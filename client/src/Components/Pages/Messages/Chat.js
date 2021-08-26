import React, { useState } from "react";
import {
	Grid,
	Paper,
	Typography,
	Button,
	Avatar,
	TextField,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import SendIcon from "@material-ui/icons/Send";
import useStyles from "./styles";

import Pal from "../../../themes/palette";
import myImage from "./myImage.jpg";

const Chat = () => {
	const classes = useStyles();

	const DATA = [
		{
			id: 1,
			name: "Haseeb",
			profilePic: "https://avatars.dicebear.com/api/male/.svg",
			message: "This is a msg",
			lastChatTime: "26/8/21",
		},
		{
			id: 2,
			name: "Jamal",
			profilePic: myImage,
			message: "This is a msg",
			lastChatTime: "12/8/21",
		},
		{
			id: 3,
			name: "Ahmed",
			profilePic: myImage,
			message: "This is a msg",
			lastChatTime: "09/8/21",
		},
		{
			id: 4,
			name: "Ameen",
			profilePic: myImage,
			message: "This is a msg",
			lastChatTime: "02/8/21",
		},
	];

	const CHAT = [
		{
			id: 2,
			name: "Ahmed",
			profilePic: "https://avatars.dicebear.com/api/male/.svg",
			message: "Why I haven't received my product?",
			sentOn: "",
		},
		{
			id: 1,
			name: "Haseeb",
			profilePic: myImage,
			message: "What the heck is with your Order?",
			sentOn: "",
		},
		{
			id: 2,
			name: "Ahmed",
			profilePic: "https://avatars.dicebear.com/api/male/.svg",
			message: "Yea. Now, its working on my side. Thanks!",
			sentOn: "",
		},
		{
			id: 1,
			name: "Haseeb",
			profilePic: myImage,
			message: "No Prob. You're always welcome!",
			sentOn: "",
		},
	];

	const [SelectedChat, setSelectedChat] = useState("");
	const [MyId] = useState(1);

	return (
		<Grid container className={classes.root}>
			<Grid
				item
				xs={12}
				sm={12}
				md={12}
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
					<Button variant="contained" color="primary">
						NEW
					</Button>
				</div>

				<Grid
					container
					direction="column"
					justifyContent="center"
					alignItems="stretch"
					style={{ padding: "10px 0" }}
				>
					{DATA.map((el) => (
						<Grid
							item
							key={el.id}
							xs={12}
							style={{
								padding: "10px 0px",
								borderBottom: "1px solid #F8F8F8",
								borderRight:
									SelectedChat === el.id
										? `4px solid ${Pal.palette.primary.light}`
										: "",
								background:
									SelectedChat === el.id ? "#F8F8F8" : "",
							}}
							onClick={() => setSelectedChat(el.id)}
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
										justifyContent: "flex-start",
										alignItems: "center",
									}}
								>
									<Avatar
										src={el.profilePic}
										alt="profile pic"
										style={{
											width: 50,
											height: 50,
											marginLeft: 15,
										}}
									/>
									<div style={{ marginLeft: 12 }}>
										<Typography
											variant="subtitle1"
											style={{ fontWeight: "bold" }}
										>
											{el.name}
										</Typography>
										<Typography style={{ color: "grey" }}>
											{el.message}
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
										{el.lastChatTime}
									</Typography>
								</div>
							</div>
						</Grid>
					))}
				</Grid>
			</Grid>

			<Grid
				item
				xs={12}
				sm={12}
				md={12}
				lg={6}
				// component={Paper}
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
						variant="h2"
						color="primary"
						style={{ fontWeight: "bold" }}
					>
						Haseeb Ahmed
					</Typography>
					<TextField
						variant="standard"
						placeholder="Search here"
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

				<Grid
					container
					direction="column"
					justifyContent="center"
					alignItems="stretch"
					style={{ padding: "10px 0" }}
				>
					{CHAT.map((el) => (
						<Grid
							item
							key={el.id}
							xs={12}
							style={{
								padding: "10px 0px",
							}}
						>
							<div
								style={{
									display: "flex",
									justifyContent:
										el.id === MyId
											? "flex-end"
											: "flex-start",
								}}
							>
								{el.id === MyId ? (
									<div
										style={{
											display: "flex",
										}}
									>
										<div style={{ marginLeft: 12 }}>
											<Typography
												variant="subtitle1"
												component={Paper}
												style={{
													padding: 10,
													color: "#FFF",
													background:
														Pal.palette.primary
															.light,
												}}
											>
												{el.message}
												<Typography
													align="right"
													style={{ marginBottom: -5 }}
												>
													12:21 PM
												</Typography>
											</Typography>
										</div>
										<Avatar
											src={el.profilePic}
											alt="profile pic"
											style={{
												width: 50,
												height: 50,
												marginLeft: 15,
												marginRight: 15,
											}}
										/>
									</div>
								) : (
									<div
										style={{
											display: "flex",
										}}
									>
										<Avatar
											src={el.profilePic}
											alt="profile pic"
											style={{
												width: 50,
												height: 50,
												marginLeft: 15,
											}}
										/>
										<div style={{ marginLeft: 12 }}>
											<Typography
												variant="subtitle1"
												component={Paper}
												style={{
													padding: 10,
												}}
											>
												{el.message}
												<Typography
													align="right"
													style={{ marginBottom: -5 }}
												>
													12:21 PM
												</Typography>
											</Typography>
										</div>
									</div>
								)}
							</div>
						</Grid>
					))}

					<Paper
						style={{
							position: "absolute",
							bottom: 0,
							width: "100%",
						}}
					>
						<TextField
							fullWidth
							variant="outlined"
							label="Enter message here"
							InputProps={{
								endAdornment: (
									<SendIcon
										color="primary"
										fontSize="large"
										style={{
											cursor: "pointer",
										}}
									/>
								),
							}}
						/>
					</Paper>
				</Grid>
			</Grid>

			<Grid item xs={12} sm={12} md={12} lg={2} component={Paper}>
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

				<div align="center">
					<Avatar
						src={"https://avatars.dicebear.com/api/male/.svg"}
						alt="profile pic"
						style={{
							width: 120,
							height: 120,
							marginTop: 25,
							marginBottom: 15,
						}}
					/>
					<div style={{ margin: "20px 0px" }}>
						<Typography style={{ fontWeight: "bold" }}>
							Name:
						</Typography>
						<Typography>Haseeb Ahmed</Typography>
					</div>
					<div style={{ margin: "20px 0px" }}>
						<Typography style={{ fontWeight: "bold" }}>
							Email
						</Typography>
						<Typography>haseeb@gmail.com</Typography>
					</div>
					<div style={{ margin: "20px 0px" }}>
						<Typography style={{ fontWeight: "bold" }}>
							Phone
						</Typography>
						<Typography>+92 3455488210</Typography>
					</div>
					<div style={{ margin: "20px 0px" }}>
						<Typography style={{ fontWeight: "bold" }}>
							Location
						</Typography>
						<Typography>Satellite Town, RWP</Typography>
					</div>
				</div>
			</Grid>
		</Grid>
	);
};

export default Chat;
