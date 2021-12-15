import React, { useState, useEffect } from "react";
import {
	Grid,
	Tooltip,
	Paper,
	Modal,
	Container,
	Typography,
	Button,
	Avatar,
	TextField,
	IconButton,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Draggable from "react-draggable";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

//importing icons
import SendIcon from "@material-ui/icons/Send";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Highlighter from "react-highlight-words";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import SearchIcon from "@material-ui/icons/Search";
import ChatIcon from "@material-ui/icons/Chat";
import noChatConversation from "../../../assets/images/noChatIllustration.gif";

import useStyles from "./styles";
import myImage from "../../../assets/images/myImage.jpg";
import api from "../../../Axios/api";
import { useUserContext } from "../../../context/UserContext";

// socket io
import io from "socket.io-client";
const SERVER = "https://digi-mart-server.herokuapp.com";

const Chat = () => {
	const classes = useStyles();
	const [messageText, setMessageText] = useState(null);
	const [conversations, setConversations] = useState([]);
	const [ChatRecieverUser, setChatRecieverUser] = useState([]);
	const messagesPageLink = "/seller/messages";
	const [openDialogBox, setOpenDialogBox] = useState(false);
	const [messages, setMessages] = useState([]);
	var socket = io(SERVER);
	const [selectedChat, setSelectedChat] = useState([]);
	const [textToSearch, setTextToSearch] = useState([""]);

	// context API
	const { store } = useUserContext();
	const token = store.data.token;
	const userId = store.data.data._id;

	// for opening menu of deleting single message
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	// Search User Modal
	const [SearchModal, setSearchModal] = useState(false);
	const [searchedUsers, setSearchedUsers] = useState("");

	//for opening search users model
	const OpenSearchModal = () => {
		setSearchModal(true);
	};

	const handleSearchModal = () => {
		setSearchModal(false);
	};

	//for searching text
	const handlerSearchText = (e) => {
		setTextToSearch([e.target.value]);
	};

	//for confirmation on deletion box
	const handleClickOpenDialogBox = () => {
		setOpenDialogBox(true);
	};

	const handleCloseDialogBox = () => {
		setOpenDialogBox(false);
	};

	// for deleting a single message
	const handleClickDeletMessage = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleCloseDeleteMessage = () => {
		setAnchorEl(null);
	};

	function PaperComponent(props) {
		return (
			<Draggable
				handle="#draggable-dialog-title"
				cancel={'[class*="MuiDialogContent-root"]'}
			>
				<Paper {...props} />
			</Draggable>
		);
	}

	const SendMessage = () => {
		//This is for user u want to chat with, send roomId of chat and userId
		socket.emit("subscribe", {
			room: selectedChat.chatRoomId,
			otherUserId: selectedChat.conversationUser._id,
		});
		//This is to send message to user
		socket.emit("chat", {
			currentLoggedInUserId: userId,
			roomId: messages[0].chatRoomId,
			messageText,
		});
	};

	const updateChatMessageAndConversation = () => {
		socket.on("message", (data) => {
			//if that conversation is opened then set messages else not
			if (selectedChat.chatRoomId === data.message.chatRoomId) {
				//set messages to new messages

				let temp = messages;
				temp.push(data.message);
				setMessages([...temp]);
			}
			//In conversation array change last message of conversation
			// and make it bold if conversation is not opened
			const messageRoomId = data.message.chatRoomId;
			conversations.forEach((conversation) => {
				if (conversation.chatRoomId === messageRoomId) {
					conversation.message.messageText =
						data.message.message.messageText;
					if (
						data.message.postedByUser !== userId &&
						selectedChat.chatRoomId !== data.message.chatRoomId
					) {
						conversation.countOfUnReadMessages =
							conversation.countOfUnReadMessages + 1;
						if (document.getElementById(conversation._id)) {
							document.getElementById(
								conversation._id
							).style.fontWeight = "bold";
							document.getElementById(
								conversation._id
							).style.color = "black";
						}
					}
					if (selectedChat.chatRoomId === data.message.chatRoomId) {
						conversation.countOfUnReadMessages = 0;
						if (document.getElementById(conversation._id)) {
							document.getElementById(
								conversation._id
							).style.fontWeight = "none";
							document.getElementById(
								conversation._id
							).style.color = "none";
						}
					}
				}
			});
			setConversations([...conversations]);
			// Scroll to Bottom of Chat
			var myDiv = document.querySelector("#user-messages");
			if (myDiv) myDiv.scrollTop = myDiv.scrollHeight;
		});
	};

	const changeMessageText = (text) => {
		setMessageText(text);
	};

	const makeConversationOfRoomRead = (conversaton) => {
		//set all messages read of that conversation and get messages that are not read
		api.patch(
			`/seller/chat/${conversaton.chatRoomId}/markRead`,
			{},
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		)
			.then(async (res) => {})
			.catch((error) => console.log(error));
	};

	//for opening conversation
	const HandleConversationOfUser = async (conversation) => {
		//This is for user u want to chat with, send roomId of chat and userId
		socket.emit("subscribe", {
			room: conversation.chatRoomId,
			otherUserId:
				conversation.conversationUser != null
					? conversation.conversationUser._id
					: ChatRecieverUser._id,
		});
		makeConversationOfRoomRead(conversation);
		//change bold message and count when read
		conversation.countOfUnReadMessages = 0;
		if (document.getElementById(conversation._id)) {
			document.getElementById(conversation._id).style.fontWeight =
				"normal";
			document.getElementById(conversation._id).style.color = "grey";
		}
		//get conversation
		await api
			.get(`/seller/chat/${conversation.chatRoomId}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				setSelectedChat(conversation);
				setMessages(res.data.conversation);
				setChatRecieverUser(res.data.chatReciever);
			})
			.catch((error) => console.log(error));

		var elem = document.getElementById("user-messages");
		if (elem) {
			elem.scrollTop = elem.scrollHeight;
		}
	};

	const getTimeInCorrectFormat = (timeString) => {
		timeString = new Date(timeString).toISOString();
		const timeString12hr = new Date(timeString).toLocaleTimeString(
			{},
			{
				timeZone: "UTC",
				hour12: true,
				hour: "numeric",
				minute: "numeric",
			}
		);
		return timeString12hr;
	};

	//Search Buyer
	const searchBuyer = async (searchQuery) => {
		await api
			.get(`/seller/search/buyer/query/${searchQuery}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				let data = res.data.data.Buyers;
				setSearchedUsers([...data]);
			})
			.catch((error) => console.log(error));
	};

	//start new chat with user
	const startChatWithUser = async (user) => {
		setSearchModal(false);
		// let data = "";
		let newConversation = "";
		await api
			.post(
				`/seller/chat/initiate`,
				{
					userIds: [user._id],
					type: "seller-to-buyer",
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
			.then(async (res) => {
				newConversation = res.data.data.newConversationInitiated;
				HandleConversationOfUser(newConversation);
				if (res.data.data.chatRoom.isNew) {
					window.location.href = messagesPageLink;
				}
			})
			.catch((error) => console.log(error));
	};

	//delete selected chat room
	const deleteSelectedChatRoom = async () => {
		handleCloseDialogBox();
		await api
			.delete(`/seller/chat/room/${selectedChat.chatRoomId}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then(async (res) => {
				await api
					.get(`/seller/chat/conversations/seller-to-buyer`, {
						headers: { Authorization: `Bearer ${token}` },
					})
					.then((res) => {
						setConversations(res.data.recentConversation);
					})
					.catch((error) => console.log(error));
			})
			.catch((error) => console.log(error));
		setSelectedChat([]);
	};

	//delete selected message
	const deleteMessage = async (messageId) => {
		handleCloseDeleteMessage();
		await api
			.delete(`/seller/chat/message/${messageId}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				const temp = messages.filter((item) => {
					return item._id !== messageId;
				});
				setMessages([...temp]);
			})
			.catch((error) => console.log(error));
	};

	useEffect(() => {
		updateChatMessageAndConversation();
		socket.on("newConversation", (data) => {
			// set conversations to new conversations if new chat
			// if i am recieving a chat or i am an intiating the chat the conversations are reloaded
			if (
				data.chatInitiatorId === userId ||
				data.chatRecieverId === userId
			) {
				setConversations(data.recentConversations);
			}
		});
		// eslint-disable-next-line
	}, [socket]);

	// get All Conversations of user
	useEffect(() => {
		//This is to identify current logged in user
		socket.emit("identity", userId);
		api.get(`/seller/chat/conversations/seller-to-buyer`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => {
				setConversations(res.data.recentConversation);
				if (res.data.recentConversation.length > 0) {
					HandleConversationOfUser(res.data.recentConversation[0]);
				}
			})
			.catch((error) => console.log(error));
		// eslint-disable-next-line
	}, []);

	return (
		<Grid container className={classes.root}>
			{/* Users List */}
			<Grid
				item
				xs={12}
				sm={12}
				md={3}
				lg={3}
				component={Paper}
				className={classes.leftSideBar}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						paddingBottom: 15,
						borderBottom: "1px solid #e1e1e1",
						padding: 15,
					}}
				>
					<Typography variant="h4" color="primary">
						Messages
					</Typography>
					<Button
						onClick={() => OpenSearchModal()}
						variant="contained"
						color="primary"
					>
						NEW
					</Button>
				</div>

				<Grid
					container
					direction="column"
					style={{
						padding: "10px 0",
						display: "flex",
						justifyContent: "center",
						alignItems: "stretch",
					}}
				>
					{conversations.map((el, index) => (
						<Grid
							item
							key={index}
							xs={12}
							style={{
								cursor: "pointer",
								padding: "10px 0px",
								borderBottom: "1px solid #F8F8F8",
								borderRight:
									selectedChat._id === el._id
										? `4px solid red`
										: "",
								background:
									selectedChat._id === el._id
										? "#F8F8F8"
										: "none",
							}}
							onClick={() => HandleConversationOfUser(el)}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
									}}
								>
									<Avatar
										src={el.conversationUser.profilePic}
										alt={myImage}
										style={{
											width: 50,
											height: 50,
											marginLeft: 15,
										}}
									/>
									<div style={{ marginLeft: 12 }}>
										<Typography
											variant="subtitle1"
											style={{
												fontWeight: "bold",
												fontSize: 14,
												textTransform: "capitalize",
												textAlign: "left",
											}}
										>
											{el.conversationUser.name}
											{el.countOfUnReadMessages > 0 ? (
												<span
													style={{
														marginLeft: 7,
													}}
													className={classes.badge}
												>
													{el.countOfUnReadMessages}
												</span>
											) : null}
										</Typography>

										<Typography
											style={{
												color: "grey",
												fontSize: 12,
											}}
										>
											<span id={el._id}>
												{el.message.messageText
													.toString()
													.substring(0, 22) + "..."}
											</span>
										</Typography>
									</div>
								</div>
								<div>
									<Typography
										style={{
											color: "grey",
											paddingRight: 10,
											fontSize: 12,
										}}
									>
										{el.readByRecipients[0][0].readtAt}
									</Typography>
								</div>
							</div>
						</Grid>
					))}
				</Grid>
			</Grid>

			{/* Users Chat Area */}
			{selectedChat.conversationUser != null ? (
				<Grid
					item
					xs={false}
					sm={false}
					md={8}
					lg={6}
					className={classes.MainChatArea}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							paddingBottom: 15,
							borderBottom: "1px solid #e1e1e1",
							padding: "15px 0",
						}}
					>
						<Typography
							variant="h3"
							color="primary"
							style={{
								fontWeight: "bold",
								textTransform: "capitalize",
							}}
						>
							{selectedChat.conversationUser.name}
						</Typography>
						<TextField
							variant="standard"
							placeholder="Search here"
							onChange={handlerSearchText}
							InputProps={{
								endAdornment: (
									<SearchIcon
										color="primary"
										style={{
											cursor: "pointer",
										}}
									/>
								),
							}}
						/>
					</div>

					<Grid container style={{ padding: "10px 0" }}>
						<div
							style={{
								width: "100%",
								height: "80vh",
								maxHeight: "410px",
								display: "flex",
								flexDirection: "column",
								overflowY: "scroll",
								position: "relative",
							}}
							id="user-messages"
						>
							{messages.map((el, index) => (
								<Grid
									item
									key={index}
									style={{
										padding: "10px 0px",
									}}
								>
									<div
										style={{
											display: "flex",
											justifyContent:
												el.postedByUser === userId
													? "flex-end"
													: "flex-start",
										}}
									>
										{el.postedByUser === userId ? (
											<div
												style={{
													display: "flex",
													alignItems: "center",
												}}
											>
												<div>
													<Menu
														id="fade-menu"
														anchorEl={anchorEl}
														keepMounted
														open={open}
														onClose={
															handleCloseDeleteMessage
														}
													>
														<MenuItem
															onClick={() =>
																deleteMessage(
																	el._id
																)
															}
														>
															<DeleteOutlineIcon
																style={{
																	marginRight: 5,
																}}
															/>
															Delete
														</MenuItem>
													</Menu>
												</div>
												<div style={{ marginLeft: 12 }}>
													<Typography
														variant="subtitle1"
														component={Paper}
														elevation={0}
														style={{
															padding: 10,
															fontSize: 15,
															color: "#FFF",
															boxShadow:
																"rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
															background:
																"#DC143C",
														}}
													>
														<Highlighter
															highlightClassName="YourHighlightClass"
															searchWords={
																textToSearch
															}
															autoEscape={true}
															textToHighlight={
																el.message
																	.messageText
															}
														/>
														<Typography
															align="right"
															style={{
																marginTop: 4,
																fontSize: 9,
															}}
														>
															<span
																style={{
																	display:
																		"flex",
																	flexDirection:
																		"row",
																}}
															>
																<span>
																	{
																		el.createdAt.split(
																			"T"
																		)[0]
																	}
																</span>
																<span
																	style={{
																		paddingLeft: 8,
																	}}
																>
																	{getTimeInCorrectFormat(
																		el.createdAt
																	)}
																</span>
															</span>
														</Typography>
													</Typography>
												</div>
												<Avatar
													src={
														store.data.data
															.profilePic
													}
													alt="profile pic"
													style={{
														width: 50,
														height: 50,
														marginLeft: 15,
														marginRight: 15,
														boxShadow:
															"rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
													}}
												/>
												<IconButton
													aria-controls="fade-menu"
													aria-haspopup="true"
													onClick={
														handleClickDeletMessage
													}
													style={{
														padding: 0,
														backgroundColor:
															"#FAFAFA",
														color: "silver",
													}}
												>
													<MoreVertIcon fontSize="small" />
												</IconButton>
											</div>
										) : (
											<div
												style={{
													display: "flex",
												}}
											>
												<Avatar
													src={
														ChatRecieverUser.profilePic
													}
													alt="profile pic"
													style={{
														width: 50,
														height: 50,
														marginLeft: 15,
														boxShadow:
															"rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
													}}
												/>
												<div style={{ marginLeft: 12 }}>
													<Typography
														variant="subtitle1"
														component={Paper}
														elavation={0}
														style={{
															padding: 10,
															fontSize: 14,
															boxShadow:
																"rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
														}}
													>
														<Highlighter
															highlightClassName="YourHighlightClass"
															searchWords={
																textToSearch
															}
															autoEscape={true}
															textToHighlight={
																el.message
																	.messageText
															}
														/>
														<Typography
															align="right"
															style={{
																marginBottom: 10,
																fontSize: 9,
															}}
														>
															<span
																style={{
																	display:
																		"flex",
																	flexDirection:
																		"row",
																	color: "grey",
																}}
															>
																<span>
																	{
																		el.createdAt.split(
																			"T"
																		)[0]
																	}
																</span>
																<span
																	style={{
																		paddingLeft: 8,
																	}}
																>
																	{getTimeInCorrectFormat(
																		el.createdAt
																	)}
																</span>
															</span>
														</Typography>
													</Typography>
												</div>
											</div>
										)}
									</div>
								</Grid>
							))}
						</div>
						<Paper
							style={{
								position: "absolute",
								bottom: 0,
								width: "98%",
							}}
						>
							<TextField
								fullWidth
								variant="outlined"
								label="Enter message here"
								onChange={(e) =>
									changeMessageText(e.target.value)
								}
								InputProps={{
									endAdornment: (
										<SendIcon
											color="primary"
											fontSize="large"
											style={{
												cursor: "pointer",
											}}
											onClick={() => SendMessage()}
										/>
									),
								}}
							/>
						</Paper>
					</Grid>
				</Grid>
			) : (
				<div></div>
			)}

			{/* User Details Card */}
			{selectedChat.conversationUser != null ? (
				<Grid
					item
					xs={12}
					sm={12}
					md={12}
					lg={2}
					component={Paper}
					style={{ height: "82vh", zIndex: 1 }}
				>
					<div
						style={{
							paddingBottom: 15,
							borderBottom: "1px solid #e1e1e1",
							padding: 20,
						}}
					>
						<Typography variant="h4" color="primary" align="center">
							User Details
						</Typography>
					</div>

					{selectedChat.conversationUser != null ? (
						<div align="center">
							<Avatar
								src={selectedChat.conversationUser.profilePic}
								alt={myImage}
								style={{
									width: 120,
									height: 120,
									marginTop: 25,
									marginBottom: 15,
									boxShadow:
										"rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
								}}
							/>
							<div style={{ margin: "20px 0px" }}>
								<Typography style={{ fontWeight: "bold" }}>
									Name:
								</Typography>
								<Typography style={{ fontSize: 14 }}>
									{selectedChat.conversationUser.name}
								</Typography>
							</div>
							<Tooltip
								title={
									selectedChat.conversationUser.email
										? selectedChat.conversationUser.email
										: "Email"
								}
							>
								<div style={{ margin: "20px 0px" }}>
									<Typography style={{ fontWeight: "bold" }}>
										Email
									</Typography>
									<Typography style={{ fontSize: 14 }}>
										{selectedChat.conversationUser.email
											? selectedChat.conversationUser.email
													.toString()
													.substring(0, 18) + "..."
											: "Empty"}
									</Typography>
								</div>
							</Tooltip>
							<div style={{ margin: "20px 0px" }}>
								<Typography style={{ fontWeight: "bold" }}>
									Phone
								</Typography>
								<Typography style={{ fontSize: 14 }}>
									{selectedChat.conversationUser.phoneNumber}
								</Typography>
							</div>
							<Tooltip
								title={
									selectedChat.conversationUser.address
										? selectedChat.conversationUser.address
										: "Address"
								}
							>
								<div style={{ margin: "20px 0px" }}>
									<Typography style={{ fontWeight: "bold" }}>
										Address
									</Typography>
									<Typography style={{ fontSize: 14 }}>
										{selectedChat.conversationUser.address
											? selectedChat.conversationUser.address
													.toString()
													.substring(0, 18) + "..."
											: "Empty"}
									</Typography>
								</div>
							</Tooltip>
							<Button
								variant="contained"
								color="primary"
								onClick={handleClickOpenDialogBox}
							>
								<DeleteOutlineIcon style={{ marginRight: 5 }} />
								Clear Chat
							</Button>
						</div>
					) : (
						<div></div>
					)}
				</Grid>
			) : (
				<div></div>
			)}

			{/* //Deletion dialog box */}
			<div>
				<Dialog
					open={openDialogBox}
					onClose={handleCloseDialogBox}
					PaperComponent={PaperComponent}
					aria-labelledby="draggable-dialog-title"
				>
					<DialogTitle
						style={{ cursor: "move" }}
						id="draggable-dialog-title"
					>
						Delete Chat
					</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Are you sure you want to delete this chat?
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button
							autoFocus
							onClick={handleCloseDialogBox}
							color="primary"
						>
							Cancel
						</Button>
						<Button
							onClick={() => deleteSelectedChatRoom()}
							color="primary"
						>
							Yes
						</Button>
					</DialogActions>
				</Dialog>
			</div>

			{/* Search User by Name  */}
			<Modal
				open={SearchModal}
				onClose={handleSearchModal}
				onBackdropClick={handleSearchModal}
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Container
					component={Paper}
					style={{
						padding: "40px",
						maxWidth: "70vw",
						height: "84vh",
						position: "relative",
					}}
				>
					<Grid container spacing={4} align="center">
						<Button
							variant="outlined"
							color="primary"
							style={{
								marginRight: 20,
								position: "absolute",
								top: 20,
								right: 5,
							}}
							onClick={handleSearchModal}
						>
							Close
						</Button>
						<Grid item xs={12} sm={12} md={12}>
							<Typography
								variant="h4"
								style={{ fontWeight: "bold" }}
							>
								Search Users To Chat
							</Typography>
						</Grid>
						<Grid item xs={12} style={{}}>
							<Grid
								container
								style={{ marginBottom: 10 }}
								justify="center"
							>
								<Grid item>
									<TextField
										variant="outlined"
										margin="normal"
										fullWidth
										size="small"
										label=" Search here ..."
										placeholder="Search ..."
										onChange={(e) =>
											searchBuyer(e.target.value)
										}
									/>
								</Grid>
								<Grid item>
									<Button
										fullWidth
										variant="contained"
										color="primary"
										style={{
											marginTop: 16,
											padding: 7.6,
											paddingLeft: 15,
											paddingRight: 15,
										}}
										// onClick ={() => searchBuyer()}
									>
										<SearchIcon />
										SEARCH
									</Button>
								</Grid>
							</Grid>
						</Grid>

						{/* Searched users will display here */}

						<TableContainer
							component={Paper}
							style={{ height: "53vh" }}
						>
							<Table
								className={classes.table}
								aria-label="simple table"
							>
								<TableHead>
									<TableRow>
										<TableCell
											style={{ fontWeight: "bold" }}
										>
											Sr#
										</TableCell>
										<TableCell
											style={{ fontWeight: "bold" }}
										>
											Image
										</TableCell>
										<TableCell
											style={{ fontWeight: "bold" }}
										>
											Name
										</TableCell>
										<TableCell
											style={{ fontWeight: "bold" }}
										>
											Email
										</TableCell>
										<TableCell
											style={{ fontWeight: "bold" }}
										>
											Contact Number
										</TableCell>
										<TableCell
											style={{ fontWeight: "bold" }}
											align="right"
										>
											Actions
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{searchedUsers
										? searchedUsers.map((row, index) => (
												<TableRow key={index}>
													<TableCell
														component="th"
														scope="row"
													>
														{index + 1}.
													</TableCell>
													<TableCell>
														<Avatar
															src={row.profilePic}
															alt={myImage}
														/>
													</TableCell>
													<TableCell>
														{row.name}
													</TableCell>
													<TableCell>
														{row.email}
													</TableCell>
													<TableCell>
														{row.phoneNumber}
													</TableCell>
													<TableCell align="right">
														<Button
															variant="outlined"
															color="primary"
															onClick={() =>
																startChatWithUser(
																	row
																)
															}
														>
															<ChatIcon
																style={{
																	marginRight: 5,
																}}
															/>
															Chat
														</Button>
													</TableCell>
												</TableRow>
										  ))
										: null}
								</TableBody>
							</Table>
						</TableContainer>
					</Grid>
				</Container>
			</Modal>
		</Grid>
	);
};

export default Chat;
