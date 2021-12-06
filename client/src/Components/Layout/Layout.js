import React, { useState, useEffect } from "react";
import clsx from "clsx";
import api from "../../Axios/api";
import { Redirect } from "react-router-dom";
import io from "socket.io-client";
// MUI Components
import {
	CssBaseline,
	Drawer,
	AppBar,
	Toolbar,
	List,
	Typography,
	IconButton,
	ListItem,
	ListItemIcon,
	ListItemText,
	Badge,
	MenuItem,
	Menu,
	Collapse,
	Avatar,
	FormControlLabel,
} from "@material-ui/core";
import IOSSwitch from "../IOSSwitch/IOSSwitch";
import {
	Switch as SwitchRouter,
	withRouter,
	Route,
	Link,
} from "react-router-dom";

// MUI Icons
import AddAlertIcon from "@material-ui/icons/AddAlert";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import StoreIcon from "@material-ui/icons/Store";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import SettingsIcon from "@material-ui/icons/Settings";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";
import AssistantPhotoIcon from "@material-ui/icons/AssistantPhoto";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ProductIcon from "@material-ui/icons/Ballot";
import SpeakerNotesIcon from "@material-ui/icons/SpeakerNotes";
import ChatIcon from "@material-ui/icons/Chat";
import AssessmentIcon from "@material-ui/icons/Assessment";
import TuneIcon from "@material-ui/icons/Tune";
import AssistantIcon from "@material-ui/icons/Assistant";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import LocalConvenienceStoreIcon from "@material-ui/icons/LocalConvenienceStore";
import ViewComfyIcon from "@material-ui/icons/ViewComfy";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import SurroundSoundIcon from "@material-ui/icons/SurroundSound";
import EventIcon from "@material-ui/icons/Event";
import LocalActivityIcon from "@material-ui/icons/LocalActivity";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import ViewListIcon from "@material-ui/icons/ViewList";
import ArtTrackIcon from "@material-ui/icons/ArtTrack";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import HelpIcon from "@material-ui/icons/Help";

import LocalAtmIcon from "@material-ui/icons/LocalAtm";
import CameraFrontIcon from "@material-ui/icons/CameraFront";
import BubbleChartIcon from "@material-ui/icons/BubbleChart";
import LineWeightIcon from "@material-ui/icons/LineWeight";
import MoneyIcon from "@material-ui/icons/Money";

// Page Components
import VendorAnalytics from "../VendorAnalytics/VendorAnalytics";
import AddVendor from "../Pages/Vendor/AddVendor/AddVendor";
import ViewVendors from "../Pages/Vendor/ViewVendors/ViewVendors";
import BuyVendorProduct from "../Pages/Vendor/BuyVendorProduct/BuyVendorProduct";
import AddProduct from "../Pages/Product/AddProduct/AddProduct";
import ViewProducts from "../Pages/Product/ViewProducts/ViewProducts";
import Orders from "../Pages/Orders/Orders";
import Reviews from "../Pages/Reviews/Reviews";
import PaymentMethod from "../Pages/Payment/PaymentMethod/PaymentMethod";
import SettingsProfile from "../Pages/Setting/SettingsProfile";
import SettingsStore from "../Pages/Setting/SettingsStore";
import PromoteProduct from "../Pages/Promotion/PromoteProducts/PromoteProduct";
import PromotedProducts from "../Pages/Promotion/PromotedProducts/PromotedProducts";
import ScheduledPromotions from "../Pages/Promotion/ScheduledPromotions/ScheduledPromotions";
import BusinessAnalytics from "../Pages/BusinessAnalytics/BusinessAnalytics";
import ReportAProblem from "../Pages/ReportAProblem/ReportAProblem";
import Complaints from "../Pages/Complaints/Complaints";
import Subscribers from "../Pages/MySubscribers/MySubscribers";
import PrivacyPolicy from "../Pages/PrivacyPolicy/PrivacyPolicy";
import FAQs from "../Pages/FAQs/FAQs";
import MyBuyers from "../Pages/MyBuyers/MyBuyers";
import Messages from "../Pages/Messages/Chat";
import RequestWithdraw from "../Pages/Payment/RequestWithdraw/RequestWithdraw";
import ViewWithdrawalsRequests from "../Pages/Payment/ViewWithdrawalsRequests/ViewWithdrawalsRequests";
import ViewWithdrawalsRequestsHistory from "../Pages/Payment/ViewWithdrawalsRequestsHistory/ViewWithdrawalsRequestsHistory";
import ViewAllPayments from "../Pages/Payment/ViewAllPayments/ViewAllPayments";

import logo from "../../assets/images/logo.png";
import useStyles from "./styles";

// User context
import { useUserContext, logoutUser } from "../../context/UserContext";

const Layout = (props) => {
	const classes = useStyles();

	// context
	const { store, dispatch } = useUserContext();
	const token = store.data.token;
	const name = store.data.data.name;
	const profilePic = store.data.data.profilePic;
	const storeId = store.data.data.storeId;

	// Current Path - URL Location
	const {
		location: { pathname },
		darkState,
		handleThemeChange,
	} = props;

	// navbar menu
	const [open, setOpen] = useState(true);
	const [anchorEl, setAnchorEl] = useState(null);
	const openProfile = Boolean(anchorEl);
	const [isLoggedOut, setIsLoggedOut] = useState(false);

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleDrawerOpen = () => {
		setOpen(true);
	};
	const handleDrawerClose = () => {
		setOpen(false);
	};

	// Notifications
	const SERVER = "https://digi-mart-server.herokuapp.com";
	var socket = io(SERVER);
	const [isShowNotificationsMenu, setIsShowNotificationsMenu] =
		useState(false);
	const [notifications, setNotifications] = useState([]);
	const notificationsAlreadyReceived = [];
	let notificationIds = [];
	const [unReadNotificationsLength, setUnReadNotificationsLength] = useState(
		notificationsAlreadyReceived.length
	);

	//for drop down of notifications
	const handleShowNotificationsMenuOpen = (event) => {
		setIsShowNotificationsMenu(event.currentTarget);
		setUnReadNotificationsLength(0);
	};
	const handleShowNotificationsMenuClose = () => {
		setIsShowNotificationsMenu(null);
	};

	// Logout
	const logoutHandler = (e) => {
		e.preventDefault();

		api.post(
			"/seller/logout",
			{},
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		)
			.then(function (res) {
				setIsLoggedOut(true);
				return logoutUser(dispatch);
			})
			.catch((error) =>
				console.log(
					"ERROR: " + JSON.stringify(error.response.data.error)
				)
			);
	};

	// sidebar dropdown
	const [openDDProduct, setOpenDDProduct] = useState(false);
	const [openDDSettings, setOpenDDSettings] = useState(false);
	const [openDDPayments, setOpenDDPayments] = useState(false);
	const [openDDPromotions, setOpenDDPromotions] = useState(false);
	const [openDDVendors, setOpenDDVendors] = useState(false);

	const handleDDProduct = () => {
		setOpenDDProduct(!openDDProduct);

		// Closing all other DD
		if (!openDDProduct === true) {
			setOpenDDSettings(false);
			setOpenDDPayments(false);
		}
	};
	const handleDDSettings = () => {
		setOpenDDSettings(!openDDSettings);

		// Closing all other DD
		if (!openDDSettings === true) {
			setOpenDDProduct(false);
			setOpenDDPayments(false);
		}
	};
	const handleDDPayments = () => {
		setOpenDDPayments(!openDDPayments);

		// Closing all other DD
		if (!openDDPayments === true) {
			setOpenDDProduct(false);
			setOpenDDSettings(false);
		}
	};
	const handleDDPromotions = () => {
		setOpenDDPromotions(!openDDPromotions);
	};
	const handleDDVendor = () => {
		setOpenDDVendors(!openDDVendors);
	};

	const getNotifications = async () => {
		// await api
		// 	.get("/seller/myNotifications", {
		// 		headers: { Authorization: `Bearer ${token}` },
		// 	})
		// 	.then(function (res) {
		// 		setNotifications((prevState) => [
		// 			...prevState,
		// 			...res.data.data.myNotifications,
		// 		]);
		// 	})
		// 	.catch((error) => {
		// 		console.log("error in getting data of notifications", error);
		// });

		const currentUser = store.data ? store.data.data : null;
		if (currentUser) {
			//setting notification if for the user
			socket.on("new notification", (data) => {
				if (data) {
					//for admin i.e owner change sellerId to adminId
					if (data.sellerId === currentUser._id) {
						for (const item of notificationsAlreadyReceived) {
							notificationIds.push(item._id);
						}
						if (!notificationIds.includes(data._id)) {
							notificationsAlreadyReceived.push(data);
							setUnReadNotificationsLength(
								notificationsAlreadyReceived.length
							);
							setNotifications((prevState) => [
								...prevState,
								data,
							]);
						}
					}
				}
			});
		}
	};

	useEffect(() => {
		getNotifications();
	}, []);

	return (
		<div className={classes.root}>
			{isLoggedOut ? <Redirect to="/seller/login" /> : ""}
			<CssBaseline />
			<AppBar
				position="fixed"
				className={clsx(classes.appBar, {
					[classes.appBarShift]: open,
				})}
			>
				<Toolbar>
					<IconButton
						style={{ color: "grey" }}
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						className={clsx(
							classes.menuButton,
							open && classes.hide
						)}
					>
						<MenuIcon />
					</IconButton>
					<div className={classes.appbarRight}>
						<div>
							<img
								src={logo}
								alt="Logo"
								className={classes.logo}
							/>
						</div>
						<div>
							<FormControlLabel
								control={
									<IOSSwitch
										checked={darkState}
										onChange={handleThemeChange}
									/>
								}
							/>
							{/* <IconButton>
								<Badge badgeContent={3} color="primary">
									<MailIcon
										fontSize="small"
										className="badgeIcons"
									/>
								</Badge>
							</IconButton> */}

							<IconButton
								onClick={handleShowNotificationsMenuOpen}
							>
								<Badge
									badgeContent={unReadNotificationsLength}
									color="primary"
								>
									<NotificationsIcon
										fontSize="small"
										className="badgeIcons"
									/>
								</Badge>
							</IconButton>

							<IconButton
								edge="end"
								aria-haspopup="true"
								onClick={handleMenu}
							>
								<Avatar alt="Remy Sharp" src={profilePic} />
							</IconButton>
							<Menu
								id="menu-appbar"
								getContentAnchorEl={null}
								anchorEl={anchorEl}
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "center",
								}}
								keepMounted
								transformOrigin={{
									vertical: "top",
									horizontal: "center",
								}}
								open={openProfile}
								onClose={handleClose}
							>
								<div style={{ margin: "10px 20px" }}>
									<Typography
										variant="h5"
										weight="medium"
										color="primary"
									>
										Hi, {name}
									</Typography>
								</div>

								<MenuItem
									onClick={handleClose}
									component={"a"}
									target="_blank"
									href={
										"https://digimart-buyer.netlify.app/store?storeId=" +
										storeId
									}
								>
									<ListItemIcon
										className={classes.listItemIcon}
									>
										<StoreIcon fontSize="small" />
									</ListItemIcon>
									<ListItemText primary="View Store" />
								</MenuItem>

								<MenuItem
									onClick={handleClose}
									component={Link}
									to="/seller/setting/report-problem"
								>
									<ListItemIcon
										className={classes.listItemIcon}
									>
										<AssistantPhotoIcon fontSize="small" />
									</ListItemIcon>
									<ListItemText primary="Report Problem" />
								</MenuItem>
								<MenuItem
									onClick={handleClose}
									component={Link}
									to="/seller/FAQs"
								>
									<ListItemIcon
										className={classes.listItemIcon}
									>
										<LiveHelpIcon fontSize="small" />
									</ListItemIcon>
									<ListItemText primary="FAQ's" />
								</MenuItem>
								<MenuItem
									onClick={handleClose}
									component={Link}
									to="/seller/privacy-policy"
								>
									<ListItemIcon
										className={classes.listItemIcon}
									>
										<ReportProblemIcon fontSize="small" />
									</ListItemIcon>
									<ListItemText primary="Privacy Policy" />
								</MenuItem>
								<MenuItem
									onClick={handleClose}
									component={Link}
									to="/seller/setting/profile"
								>
									<ListItemIcon
										className={classes.listItemIcon}
									>
										<SettingsIcon fontSize="small" />
									</ListItemIcon>
									<ListItemText primary="Settings" />
								</MenuItem>
								<MenuItem onClick={logoutHandler}>
									<ListItemIcon
										className={classes.listItemIcon}
									>
										<ExitToAppIcon fontSize="small" />
									</ListItemIcon>
									<ListItemText primary="Log Out" />
								</MenuItem>
							</Menu>
						</div>
					</div>
				</Toolbar>
			</AppBar>
			<Drawer
				className={classes.drawer}
				variant="persistent"
				anchor="left"
				open={open}
				classes={{
					paper: classes.drawerPaper,
				}}
			>
				{/* Drawer Open/Close Button */}
				<div className={classes.drawerHeader}>
					<IconButton
						onClick={handleDrawerClose}
						style={{ background: "rgba(50, 255, 250, 0.1)" }}
					>
						<ChevronLeftIcon style={{ color: "#FFF" }} />
					</IconButton>
				</div>

				{/* Drawer Menu List */}
				<List>
					<ListItem
						button
						component={Link}
						to="/seller/dashboard"
						selected={pathname === "/seller/dashboard"}
					>
						<ListItemIcon>
							<DashboardIcon className={classes.iconColor} />
						</ListItemIcon>
						<ListItemText primary="1. Dashboard" />
					</ListItem>

					{/* Add a Vendor */}
					<ListItem button onClick={handleDDVendor}>
						<ListItemIcon>
							<ProductIcon className={classes.iconColor} />
						</ListItemIcon>
						<ListItemText primary="2. Vendors" />
						{openDDVendors ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<Collapse in={openDDVendors} timeout="auto" unmountOnExit>
						<List component="div" disablePadding>
							<ListItem
								button
								className={classes.dropdown}
								selected={
									pathname === "/seller/vendors/add-vendor"
								}
								component={Link}
								to="/seller/vendors/add-vendor"
							>
								<ListItemIcon>
									<ContactMailIcon
										className={classes.iconColor}
									/>
								</ListItemIcon>
								<ListItemText primary="2.1. Add a Vendor" />
							</ListItem>

							<ListItem
								button
								className={classes.dropdown}
								selected={
									pathname === "/seller/vendors/view-vendors"
								}
								component={Link}
								to="/seller/vendors/view-vendors"
							>
								<ListItemIcon>
									<ViewListIcon
										className={classes.iconColor}
									/>
								</ListItemIcon>
								<ListItemText primary="2.2. View Vendors" />
							</ListItem>
						</List>
					</Collapse>

					<ListItem button onClick={handleDDProduct}>
						<ListItemIcon>
							<ArtTrackIcon className={classes.iconColor} />
						</ListItemIcon>
						<ListItemText primary="3. Products" />
						{openDDProduct ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<Collapse in={openDDProduct} timeout="auto" unmountOnExit>
						<List component="div" disablePadding>
							<ListItem
								button
								className={classes.dropdown}
								selected={
									pathname === "/seller/products/add-product"
								}
								component={Link}
								to="/seller/products/add-product"
							>
								<ListItemIcon>
									<SaveAltIcon
										className={classes.iconColor}
									/>
								</ListItemIcon>
								<ListItemText primary="3.1. Add a Product" />
							</ListItem>

							<ListItem
								className={classes.dropdown}
								button
								selected={
									pathname ===
									"/seller/products/view-products"
								}
								component={Link}
								to="/seller/products/view-products"
							>
								<ListItemIcon>
									<ViewComfyIcon
										className={classes.iconColor}
									/>
								</ListItemIcon>
								<ListItemText primary="3.2. View Products" />
							</ListItem>

							<ListItem
								button
								className={classes.dropdown}
								selected={
									pathname ===
									"/seller/vendors/buy-vendor-product"
								}
								component={Link}
								to="/seller/vendors/buy-vendor-product"
							>
								<ListItemIcon>
									<ShoppingCartIcon
										className={classes.iconColor}
									/>
								</ListItemIcon>
								<ListItemText primary="3.3. Buy Products" />
							</ListItem>
						</List>
					</Collapse>

					<ListItem
						button
						selected={pathname === "/seller/orders"}
						component={Link}
						to="/seller/orders"
					>
						<ListItemIcon>
							<InboxIcon className={classes.iconColor} />
						</ListItemIcon>
						<ListItemText primary="4. Orders" />
					</ListItem>

					<ListItem
						button
						selected={pathname === "/seller/reviews"}
						component={Link}
						to="/seller/reviews"
					>
						<ListItemIcon>
							<SpeakerNotesIcon className={classes.iconColor} />
						</ListItemIcon>
						<ListItemText primary="5. Reviews" />
					</ListItem>

					<ListItem
						button
						selected={pathname === "/seller/complaints"}
						component={Link}
						to="/seller/complaints"
					>
						<ListItemIcon>
							<ErrorOutlineIcon className={classes.iconColor} />
						</ListItemIcon>
						<ListItemText primary="6. Complaints" />
					</ListItem>

					<ListItem
						button
						selected={pathname === "/seller/view-buyers"}
						component={Link}
						to="/seller/view-buyers"
					>
						<ListItemIcon>
							<SupervisedUserCircleIcon
								className={classes.iconColor}
							/>
						</ListItemIcon>
						<ListItemText primary="7. My Buyers" />
					</ListItem>

					<ListItem
						button
						selected={pathname === "/seller/view-subscribers"}
						component={Link}
						to="/seller/view-subscribers"
					>
						<ListItemIcon>
							<LocalLibraryIcon className={classes.iconColor} />
						</ListItemIcon>
						<ListItemText primary="8. My Subscribers" />
					</ListItem>

					<ListItem
						button
						selected={pathname === "/seller/messages"}
						component={Link}
						to="/seller/messages"
					>
						<ListItemIcon>
							<ChatIcon className={classes.iconColor} />
						</ListItemIcon>
						<ListItemText primary="9. Messages" />
					</ListItem>

					<ListItem button onClick={handleDDPayments}>
						<ListItemIcon>
							<MonetizationOnIcon className={classes.iconColor} />
						</ListItemIcon>
						<ListItemText primary="10. Payments" />
						{openDDPayments ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<Collapse in={openDDPayments} timeout="auto" unmountOnExit>
						<List component="div" disablePadding>
							<ListItem
								className={classes.dropdown}
								button
								selected={
									pathname === "/seller/payments/withdraw"
								}
								component={Link}
								to="/seller/payments/withdraw"
							>
								<ListItemIcon>
									<LocalAtmIcon
										className={classes.iconColor}
									/>
								</ListItemIcon>
								<ListItemText primary="10.1. Request Withdraw" />
							</ListItem>

							<ListItem
								className={classes.dropdown}
								button
								selected={
									pathname ===
									"/seller/payments/withdraw-requests"
								}
								component={Link}
								to="/seller/payments/withdraw-requests"
							>
								<ListItemIcon>
									<CameraFrontIcon
										className={classes.iconColor}
									/>
								</ListItemIcon>
								<ListItemText primary="10.2. View Withdraw Requests" />
							</ListItem>

							<ListItem
								className={classes.dropdown}
								button
								selected={
									pathname ===
									"/seller/payments/withdraw-history"
								}
								component={Link}
								to="/seller/payments/withdraw-history"
							>
								<ListItemIcon>
									<BubbleChartIcon
										className={classes.iconColor}
									/>
								</ListItemIcon>
								<ListItemText primary="10.3. Withdrawal History" />
							</ListItem>

							<ListItem
								className={classes.dropdown}
								button
								selected={
									pathname === "/seller/payments/transactions"
								}
								component={Link}
								to="/seller/payments/transactions"
							>
								<ListItemIcon>
									<LineWeightIcon
										className={classes.iconColor}
									/>
								</ListItemIcon>
								<ListItemText primary="10.4. Payment Transactions" />
							</ListItem>

							<ListItem
								className={classes.dropdown}
								button
								selected={
									pathname ===
									"/seller/payments/paymentmethod"
								}
								component={Link}
								to="/seller/payments/paymentmethod"
							>
								<ListItemIcon>
									<MoneyIcon className={classes.iconColor} />
								</ListItemIcon>
								<ListItemText primary="10.5. Payment Methods" />
							</ListItem>
						</List>
					</Collapse>

					<ListItem
						button
						selected={pathname === "/seller/business-analytics"}
						component={Link}
						to="/seller/business-analytics"
					>
						<ListItemIcon>
							<AssessmentIcon className={classes.iconColor} />
						</ListItemIcon>
						<ListItemText primary="11. Business Analytics" />
					</ListItem>

					<ListItem button onClick={handleDDSettings}>
						<ListItemIcon>
							<TuneIcon className={classes.iconColor} />
						</ListItemIcon>
						<ListItemText primary="12. Settings" />
						{openDDSettings ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<Collapse in={openDDSettings} timeout="auto" unmountOnExit>
						<List component="div" disablePadding>
							<ListItem
								button
								className={classes.dropdown}
								selected={
									pathname === "/seller/setting/profile"
								}
								component={Link}
								to="/seller/setting/profile"
							>
								<ListItemIcon>
									<AccountCircleIcon
										className={classes.iconColor}
									/>
								</ListItemIcon>
								<ListItemText primary="12.1. Profile Settings" />
							</ListItem>
							<ListItem
								button
								className={classes.dropdown}
								selected={pathname === "/seller/setting/store"}
								component={Link}
								to="/seller/setting/store"
							>
								<ListItemIcon>
									<LocalConvenienceStoreIcon
										className={classes.iconColor}
									/>
								</ListItemIcon>
								<ListItemText primary="12.2. Store Settings" />
							</ListItem>
							<ListItem
								button
								className={classes.dropdown}
								selected={
									pathname ===
									"/seller/setting/report-problem"
								}
								component={Link}
								to="/seller/setting/report-problem"
							>
								<ListItemIcon>
									<HelpIcon className={classes.iconColor} />
								</ListItemIcon>
								<ListItemText primary="12.3. Report A Problem" />
							</ListItem>
						</List>
					</Collapse>

					<ListItem button onClick={handleDDPromotions}>
						<ListItemIcon>
							<AssistantIcon className={classes.iconColor} />
						</ListItemIcon>
						<ListItemText primary="13. Promotions" />
						{openDDPromotions ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<Collapse
						in={openDDPromotions}
						timeout="auto"
						unmountOnExit
					>
						<List component="div" disablePadding>
							<ListItem
								button
								className={classes.dropdown}
								selected={
									pathname ===
									"/seller/Promotion/promote-product"
								}
								component={Link}
								to="/seller/Promotion/promote-product"
							>
								<ListItemIcon>
									<SurroundSoundIcon
										className={classes.iconColor}
									/>
								</ListItemIcon>
								<ListItemText primary="13.1. Promote Product" />
							</ListItem>

							<ListItem
								button
								className={classes.dropdown}
								selected={
									pathname ===
									"/seller/Promotion/promoted-products"
								}
								component={Link}
								to="/seller/Promotion/promoted-products"
							>
								<ListItemIcon>
									<LocalActivityIcon
										className={classes.iconColor}
									/>
								</ListItemIcon>
								<ListItemText primary="13.2. Advertised Products" />
							</ListItem>

							<ListItem
								button
								className={classes.dropdown}
								selected={
									pathname ===
									"/seller/Promotion/scheduled-promotions"
								}
								component={Link}
								to="/seller/Promotion/scheduled-promotions"
							>
								<ListItemIcon>
									<EventIcon className={classes.iconColor} />
								</ListItemIcon>
								<ListItemText primary="13.3. Scheduled Promotions" />
							</ListItem>
						</List>
					</Collapse>
				</List>
			</Drawer>

			{/* NOTIFICATIONS BOX */}
			<Menu
				id="notifications-box"
				anchorEl={isShowNotificationsMenu}
				className={classes.notificationMenu}
				open={Boolean(isShowNotificationsMenu)}
				onClose={handleShowNotificationsMenuClose}
			>
				<Typography
					variant="h6"
					style={{
						textAlign: "center",
						fontWeight: "bold",
						padding: 10,
					}}
				>
					Notifications
				</Typography>
				<Typography
					style={{
						color: "grey",
						padding: 4,
						borderBottom: "0.1px solid #e5e5e5",
					}}
				>
					{notifications.length < 1
						? "Notifications are empty."
						: null}
				</Typography>
				{notifications.map((item, index) => (
					<div
						style={{
							width: 380,
						}}
						key={index}
					>
						<MenuItem
							style={{
								display: "flex",
								flexDirection: "column",
								borderBottom: "0.2px solid #e5e5e5",
								textAlign: "justify",
								fontSize: 14,
							}}
						>
							<div
								style={{
									display: "flex",
									alignItems: "center",
								}}
							>
								<AddAlertIcon color="primary" />
								<Typography
									className={classes.HeaderLinksHeadingText}
									variant="h6"
									style={{ color: "#666" }}
								>
									{item.message}
								</Typography>
							</div>
							<Typography
								style={{
									marginTop: 3,
									fontSize: 13,
									color: "grey",
									fontStyle: "italic",
								}}
							>
								{item.createdAt.split("T")[0]},{" "}
								{item.createdAt.split("T")[1].split(":")[0]}:
								{item.createdAt.split("T")[1].split(":")[1]}
							</Typography>
						</MenuItem>
					</div>
				))}
			</Menu>

			<main
				className={clsx(classes.content, {
					[classes.contentShift]: open,
				})}
			>
				<SwitchRouter>
					<Route
						path="/seller/dashboard"
						component={VendorAnalytics}
					/>
					<Route
						path="/seller/vendors/add-vendor"
						component={AddVendor}
					/>
					<Route
						path="/seller/vendors/view-vendors"
						component={ViewVendors}
					/>
					<Route
						path="/seller/vendors/buy-vendor-product"
						component={BuyVendorProduct}
					/>
					<Route
						path="/seller/products/add-product"
						component={AddProduct}
					/>
					<Route
						path="/seller/products/view-products"
						component={ViewProducts}
					/>
					<Route path="/seller/orders" component={Orders} />
					<Route path="/seller/reviews" component={Reviews} />
					<Route path="/seller/complaints" component={Complaints} />
					<Route
						path="/seller/view-subscribers"
						component={Subscribers}
					/>
					<Route path="/seller/view-buyers" component={MyBuyers} />
					<Route path="/seller/messages" component={Messages} />
					<Route
						path="/seller/payments/withdraw"
						component={RequestWithdraw}
					/>
					<Route
						path="/seller/payments/withdraw-requests"
						component={ViewWithdrawalsRequests}
					/>
					<Route
						path="/seller/payments/withdraw-history"
						component={ViewWithdrawalsRequestsHistory}
					/>
					<Route
						path="/seller/payments/paymentmethod"
						component={PaymentMethod}
					/>
					<Route
						path="/seller/payments/transactions"
						component={ViewAllPayments}
					/>
					<Route
						path="/seller/business-analytics"
						component={BusinessAnalytics}
					/>
					<Route
						path="/seller/setting/profile"
						component={SettingsProfile}
					/>
					<Route
						path="/seller/setting/store"
						component={SettingsStore}
					/>
					<Route
						path="/seller/setting/report-problem"
						component={ReportAProblem}
					/>
					<Route
						path="/seller/Promotion/promote-product"
						component={PromoteProduct}
					/>
					<Route
						path="/seller/Promotion/promoted-products"
						component={PromotedProducts}
					/>
					<Route
						path="/seller/Promotion/scheduled-promotions"
						component={ScheduledPromotions}
					/>
					<Route
						path="/seller/privacy-policy"
						component={PrivacyPolicy}
					/>
					<Route path="/seller/FAQs" component={FAQs} />
				</SwitchRouter>
			</main>
		</div>
	);
};

export default withRouter(Layout);
