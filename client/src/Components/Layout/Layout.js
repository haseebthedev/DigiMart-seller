import React, { useState, useEffect } from "react";
import clsx from "clsx";
import api from "../../Axios/api";
import { Redirect } from "react-router-dom";

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
	Switch,
	Badge,
	MenuItem,
	Menu,
	Collapse,
	Avatar,
} from "@material-ui/core";

import {
	Switch as SwitchRouter,
	withRouter,
	Route,
	Link,
} from "react-router-dom";

// MUI Icons
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
import SalesIcon from "@material-ui/icons/MonetizationOn";
import ChatIcon from "@material-ui/icons/Chat";
import PaymentIcon from "@material-ui/icons/Payment";
import AssessmentIcon from "@material-ui/icons/Assessment";
import TuneIcon from "@material-ui/icons/Tune";
import AssistantIcon from "@material-ui/icons/Assistant";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import LocalConvenienceStoreIcon from "@material-ui/icons/LocalConvenienceStore";
import ViewComfyIcon from "@material-ui/icons/ViewComfy";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import StorageIcon from "@material-ui/icons/Storage";
import SurroundSoundIcon from "@material-ui/icons/SurroundSound";
import EventIcon from "@material-ui/icons/Event";
import LocalActivityIcon from "@material-ui/icons/LocalActivity";

import logo from "../../assets/images/logo.png";
import useStyles from "./styles";

// Page Components
import VendorAnalytics from "../VendorAnalytics/VendorAnalytics";
import AddProduct from "../Pages/Product/AddProduct/AddProduct";
import ViewProducts from "../Pages/Product/ViewProducts/ViewProducts";
import PaymentMethod from "../Pages/Payment/PaymentMethod";
import Transactions from "../Pages/Payment/Transactions";
import SettingsProfile from "../Pages/Setting/SettingsProfile";
import SettingsStore from "../Pages/Setting/SettingsStore";
import PromoteProduct from "../Pages/Promotion/PromoteProducts/PromoteProduct";

// User context
import { useUserContext, logoutUser } from "../../context/UserContext";

const Layout = (props) => {
	const classes = useStyles();

	// context
	const { store, dispatch } = useUserContext();
	const token = store.data.token;
	const name = store.data.data.name;
	const profilePic = store.data.data.profilePic;

	// Current Path - URL Location
	const {
		location: { pathname },
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
				console.log("logging off");
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

	// DARK MODE
	const [setMode] = useState(false);
	const modeType = localStorage.getItem("THEME_MODE");

	// dark mode handler
	const modeHandler = () => {
		if (!modeType) {
			localStorage.setItem("THEME_MODE", "dark");
			window.location.reload();
			setMode(true);
		} else {
			localStorage.removeItem("THEME_MODE");
			window.location.reload();
			setMode(false);
		}
	};

	// activating profile again
	useEffect(() => {
		const activateAccount = () => {
			api.patch(
				"/seller/activateAccount",
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
				.then((res) => console.log("Activating the profile again!"))
				.catch((error) => console.log("ERROR: " + error));
		};
		activateAccount();
		// eslint-disable-next-line
	}, [token]);

	return (
		// <Router>
		<div className={classes.root}>
			{isLoggedOut ? <Redirect to="/vendor/login" /> : ""}
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
							<Switch
								color="primary"
								icon={<Brightness4Icon color="primary" />}
								checkedIcon={
									<Brightness7Icon color="primary" />
								}
								checked={!!modeType}
								onChange={modeHandler}
							/>
							<IconButton>
								<Badge badgeContent={3} color="primary">
									<MailIcon
										fontSize="small"
										style={{
											color: "grey",
										}}
									/>
								</Badge>
							</IconButton>
							<IconButton>
								<Badge badgeContent={9} color="primary">
									<NotificationsIcon
										fontSize="small"
										style={{
											color: "grey",
										}}
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

								<MenuItem onClick={handleClose}>
									<ListItemIcon
										className={classes.listItemIcon}
									>
										<StoreIcon fontSize="small" />
									</ListItemIcon>
									<ListItemText primary="View Store" />
								</MenuItem>

								<MenuItem onClick={handleClose}>
									<ListItemIcon
										className={classes.listItemIcon}
									>
										<AssistantPhotoIcon fontSize="small" />
									</ListItemIcon>
									<ListItemText primary="Report a Problem" />
								</MenuItem>
								<MenuItem onClick={handleClose}>
									<ListItemIcon
										className={classes.listItemIcon}
									>
										<LiveHelpIcon fontSize="small" />
									</ListItemIcon>
									<ListItemText primary="Frequent Questions" />
								</MenuItem>
								<MenuItem onClick={handleClose}>
									<ListItemIcon
										className={classes.listItemIcon}
									>
										<ReportProblemIcon fontSize="small" />
									</ListItemIcon>
									<ListItemText primary="Privacy Policy" />
								</MenuItem>
								<MenuItem onClick={handleClose}>
									<ListItemIcon
										className={classes.listItemIcon}
									>
										<SettingsIcon fontSize="small" />
									</ListItemIcon>
									<ListItemText primary="Settings and Config" />
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
						to="/vendor/dashboard"
						selected={pathname === "/vendor/dashboard"}
					>
						<ListItemIcon>
							<DashboardIcon className={classes.iconColor} />
						</ListItemIcon>
						<ListItemText primary={"Dashboard"} />
					</ListItem>

					<ListItem button onClick={handleDDProduct}>
						<ListItemIcon>
							<ProductIcon className={classes.iconColor} />
						</ListItemIcon>
						<ListItemText primary="Products" />
						{openDDProduct ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<Collapse in={openDDProduct} timeout="auto" unmountOnExit>
						<List component="div" disablePadding>
							<ListItem
								button
								className={classes.dropdown}
								selected={
									pathname === "/vendor/products/add-product"
								}
								component={Link}
								to="/vendor/products/add-product"
							>
								<ListItemIcon>
									<SaveAltIcon
										className={classes.iconColor}
									/>
								</ListItemIcon>
								<ListItemText primary="Add a Product" />
							</ListItem>

							<ListItem
								className={classes.dropdown}
								button
								selected={
									pathname ===
									"/vendor/products/view-products"
								}
								component={Link}
								to="/vendor/products/view-products"
							>
								<ListItemIcon>
									<ViewComfyIcon
										className={classes.iconColor}
									/>
								</ListItemIcon>
								<ListItemText primary="View Products" />
							</ListItem>
						</List>
					</Collapse>

					<ListItem button selected={pathname === "/vendor/sales"}>
						<ListItemIcon>
							<SalesIcon className={classes.iconColor} />
						</ListItemIcon>
						<ListItemText primary="Sales" />
					</ListItem>

					<ListItem button>
						<ListItemIcon>
							<InboxIcon className={classes.iconColor} />
						</ListItemIcon>
						<ListItemText primary="Orders" />
					</ListItem>

					<ListItem button>
						<ListItemIcon>
							<ChatIcon className={classes.iconColor} />
						</ListItemIcon>
						<ListItemText primary="Messages" />
					</ListItem>

					<ListItem button onClick={handleDDPayments}>
						<ListItemIcon>
							<MonetizationOnIcon className={classes.iconColor} />
						</ListItemIcon>
						<ListItemText primary="Payments" />
						{openDDPayments ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<Collapse in={openDDPayments} timeout="auto" unmountOnExit>
						<List component="div" disablePadding>
							<ListItem
								className={classes.dropdown}
								button
								selected={
									pathname ===
									"/vendor/payments/PaymentMethod"
								}
								component={Link}
								to="/vendor/payments/PaymentMethod"
							>
								<ListItemIcon>
									<PaymentIcon
										className={classes.iconColor}
									/>
								</ListItemIcon>
								<ListItemText primary="Payment Methods" />
							</ListItem>
							<ListItem
								className={classes.dropdown}
								button
								selected={
									pathname === "/vendor/payments/Transactions"
								}
								component={Link}
								to="/vendor/payments/Transactions"
							>
								<ListItemIcon>
									<StorageIcon
										className={classes.iconColor}
									/>
								</ListItemIcon>
								<ListItemText primary="Transactions" />
							</ListItem>
						</List>
					</Collapse>

					<ListItem button>
						<ListItemIcon>
							<AssessmentIcon className={classes.iconColor} />
						</ListItemIcon>
						<ListItemText primary="Business Analytics" />
					</ListItem>

					<ListItem button onClick={handleDDSettings}>
						<ListItemIcon>
							<TuneIcon className={classes.iconColor} />
						</ListItemIcon>
						<ListItemText primary="Settings" />
						{openDDSettings ? <ExpandLess /> : <ExpandMore />}
					</ListItem>

					<Collapse in={openDDSettings} timeout="auto" unmountOnExit>
						<List component="div" disablePadding>
							<ListItem
								button
								className={classes.dropdown}
								selected={
									pathname === "/vendor/setting/profile"
								}
								component={Link}
								to="/vendor/setting/profile"
							>
								<ListItemIcon>
									<AccountCircleIcon
										className={classes.iconColor}
									/>
								</ListItemIcon>
								<ListItemText primary="Profile Settings" />
							</ListItem>
							<ListItem
								button
								className={classes.dropdown}
								selected={pathname === "/vendor/setting/store"}
								component={Link}
								to="/vendor/setting/store"
							>
								<ListItemIcon>
									<LocalConvenienceStoreIcon
										className={classes.iconColor}
									/>
								</ListItemIcon>
								<ListItemText primary="Store Settings" />
							</ListItem>
						</List>
					</Collapse>

					<ListItem button onClick={handleDDPromotions}>
						<ListItemIcon>
							<AssistantIcon className={classes.iconColor} />
						</ListItemIcon>
						<ListItemText primary="Promotions" />
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
									"/vendor/Promotion/Promote-Product"
								}
								component={Link}
								to="/vendor/Promotion/Promote-Product"
							>
								<ListItemIcon>
									<SurroundSoundIcon
										className={classes.iconColor}
									/>
								</ListItemIcon>
								<ListItemText primary="Promote Product" />
							</ListItem>
							<ListItem
								button
								className={classes.dropdown}
								selected={
									pathname ===
									"/vendor/Promotion/Scheduled-Promotions"
								}
								component={Link}
								to="/vendor/Promotion/Scheduled-Promotions"
							>
								<ListItemIcon>
									<EventIcon className={classes.iconColor} />
								</ListItemIcon>
								<ListItemText primary="Scheduled Promotions" />
							</ListItem>

							{/* <ListItem
								button
								className={classes.dropdown}
								selected={
									pathname ===
									"/vendor/Promotion/Regular-Customers"
								}
								component={Link}
								to="/vendor/Promotion/Regular-Customers"
							>
								<ListItemIcon>
									<AccountCircleIcon
										className={classes.iconColor}
									/>
								</ListItemIcon>
								<ListItemText primary="Regular Customers" />
							</ListItem> */}

							<ListItem
								button
								className={classes.dropdown}
								selected={
									pathname ===
									"/vendor/Promotion/Promoted-Products"
								}
								component={Link}
								to="/vendor/Promotion/Promoted-Products"
							>
								<ListItemIcon>
									<LocalActivityIcon
										className={classes.iconColor}
									/>
								</ListItemIcon>
								<ListItemText primary="Advertised Products" />
							</ListItem>
						</List>
					</Collapse>
				</List>
			</Drawer>

			<main
				className={clsx(classes.content, {
					[classes.contentShift]: open,
				})}
			>
				<SwitchRouter>
					<Route
						path="/vendor/dashboard"
						component={VendorAnalytics}
					/>
					<Route
						path="/vendor/products/add-product"
						component={AddProduct}
					/>
					<Route
						path="/vendor/products/view-products"
						component={ViewProducts}
					/>
					<Route
						path="/vendor/payments/PaymentMethod"
						component={PaymentMethod}
					/>
					<Route
						path="/vendor/payments/Transactions"
						component={Transactions}
					/>
					<Route
						path="/vendor/setting/profile"
						component={SettingsProfile}
					/>
					<Route
						path="/vendor/setting/store"
						component={SettingsStore}
					/>
					<Route
						path="/vendor/Promotion/Promote-Product"
						component={PromoteProduct}
					/>
					{/* <Route
						path="/vendor/Promotion/Scheduled-Promotions"
						component={PromoteProduct}
					/> */}
					{/* <Route
						path="/vendor/Promotion/Promoted-Products"
						component={PromoteProduct}
					/> */}
				</SwitchRouter>
			</main>
		</div>
	);
};

export default withRouter(Layout);
