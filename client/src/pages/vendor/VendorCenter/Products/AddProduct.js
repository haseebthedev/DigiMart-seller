import React from "react";
import axios from "axios";

import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import NotificationsIcon from "@material-ui/icons/Notifications";

import StoreIcon from "@material-ui/icons/Store";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import SettingsIcon from "@material-ui/icons/Settings";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";
import AssistantPhotoIcon from "@material-ui/icons/AssistantPhoto";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
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

import useStyles from "../styles";

import logo from "../../../../assets/images/logo.png";
import Form from "./Form";

import { useUserContext, logoutUser } from "../../../../context/UserContext";
import { Redirect } from "react-router-dom";

export default function AddProduct() {
  const classes = useStyles();

  // eslint-disable-next-line
  const { store, dispatch } = useUserContext();
  const token = store.data.token;

  const [isLoggedOut, setIsLoggedOut] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openProfile = Boolean(anchorEl);

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

  const logoutHandler = (e) => {
    e.preventDefault();

    axios
      .post(
        "http://localhost:8080/seller/logout",
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
        console.log("ERROR: " + JSON.stringify(error.response.data.error))
      );
  };

  const [openDDProduct, setOpenDDProduct] = React.useState(true);
  const [openDDSettings, setOpenDDSettings] = React.useState(false);
  const [openDDPayments, setOpenDDPayments] = React.useState(false);

  const handleDDProduct = () => {
    setOpenDDProduct(!openDDProduct);
  };
  const handleDDSettings = () => {
    setOpenDDSettings(!openDDSettings);
  };
  const handleDDPayments = () => {
    setOpenDDPayments(!openDDPayments);
  };

  return (
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
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <div className={classes.appbarRight}>
            <div>
              <img src={logo} alt="Logo" className={classes.logo} />
            </div>
            <div>
              <IconButton aria-label="show 4 new mails">
                <Badge badgeContent={3} color="secondary">
                  <MailIcon fontSize="small" />
                </Badge>
              </IconButton>
              <IconButton aria-label="show 17 new notifications">
                <Badge badgeContent={9} color="secondary">
                  <NotificationsIcon fontSize="small" />
                </Badge>
              </IconButton>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
              >
                <AccountCircle fontSize="large" />
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
                  <Typography variant="h5" weight="medium" color="primary">
                    Hi, Haseeb
                  </Typography>
                </div>

                <MenuItem onClick={handleClose}>
                  <ListItemIcon className={classes.listItemIcon}>
                    <StoreIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="View Store" />
                </MenuItem>

                <MenuItem onClick={handleClose}>
                  <ListItemIcon className={classes.listItemIcon}>
                    <AssistantPhotoIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Report a Problem" />
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon className={classes.listItemIcon}>
                    <LiveHelpIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Frequent Questions" />
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon className={classes.listItemIcon}>
                    <ReportProblemIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Privacy Policy" />
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon className={classes.listItemIcon}>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Settings and Config" />
                </MenuItem>
                <MenuItem onClick={logoutHandler}>
                  <ListItemIcon className={classes.listItemIcon}>
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
          <ListItem button component="a" href="/vendor/dashboard">
            <ListItemIcon>
              <DashboardIcon className={classes.iconColor} />
              {/* <MailIcon className={classes.iconColor} /> */}
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
                component="a"
                href="/vendor/products/add-product"
                selected={true}
              >
                <ListItemIcon>
                  <SaveAltIcon className={classes.iconColor} />
                </ListItemIcon>
                <ListItemText primary="Add Products" />
              </ListItem>
              <ListItem
                button
                className={classes.dropdown}
                component="a"
                href="/vendor/products/view-products"
              >
                <ListItemIcon>
                  <ViewComfyIcon className={classes.iconColor} />
                </ListItemIcon>
                <ListItemText primary="View Products" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button>
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
              <PaymentIcon className={classes.iconColor} />
            </ListItemIcon>
            <ListItemText primary="Payments" />
            {openDDPayments ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openDDPayments} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                className={classes.dropdown}
                button
                component="a"
                href="/vendor/payments/editBankdetails"
              >
                <ListItemIcon>
                  <SaveAltIcon className={classes.iconColor} />
                </ListItemIcon>
                <ListItemText primary="Edit Bank Details" />
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
                component="a"
                href="/vendor/settings/profile"
              >
                <ListItemIcon>
                  <AccountCircleIcon className={classes.iconColor} />
                </ListItemIcon>
                <ListItemText primary="Profile Settings" />
              </ListItem>
              <ListItem
                button
                className={classes.dropdown}
                component="a"
                href="/vendor/settings/store"
              >
                <ListItemIcon>
                  <LocalConvenienceStoreIcon className={classes.iconColor} />
                </ListItemIcon>
                <ListItemText primary="Store Settings" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button>
            <ListItemIcon>
              <AssistantIcon className={classes.iconColor} />
            </ListItemIcon>
            <ListItemText primary="Promotions" />
          </ListItem>
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />

        {/* BREADCRUMBS */}
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/">
            Vendor
          </Link>
          <Typography color="textPrimary">Products</Typography>
        </Breadcrumbs>

        <div style={{ margin: "20px 0" }}>
          <Typography variant="h4">Add Product</Typography>
        </div>

        <div style={{ margin: "20px 0" }}>
          <Form />
        </div>
      </main>
    </div>
  );
}
