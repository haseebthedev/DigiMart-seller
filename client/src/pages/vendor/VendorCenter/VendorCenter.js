import React from "react";
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
import Button from "@material-ui/core/Button";
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
import EditIcon from "@material-ui/icons/Edit";
import BlockIcon from "@material-ui/icons/Block";

import logo from "../../../assets/images/logo.png";
import CompleteRegister from "../CompleteRegister/CompleteRegister";
import { useUserContext, logoutUser } from "../../../context/UserContext";
import useStyles from "./styles";


export default function VendorCenter() {
  const classes = useStyles();

  // context
  const { store, dispatch } = useUserContext();

  // states
  const [showCompleteRegis, setCompleteRegis] = React.useState(
    store.data.data.isStoreRegistered
  );
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

  const printStore = () => {
    console.log("STORE: ", store);
  };

  const logoutHandler = () => {
    logoutUser(dispatch, "haseeb@gmail.com", "haseeb123");
  };

  const [openDropdown, setopenDropdown] = React.useState(false);

  const handleDropDown = () => {
    setopenDropdown(!openDropdown);
  };

  return (
    <div className={classes.root}>
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
              <IconButton>
                <Badge badgeContent={3} color="secondary">
                  <MailIcon fontSize="small" />
                </Badge>
              </IconButton>
              <IconButton>
                <Badge badgeContent={9} color="secondary">
                  <NotificationsIcon fontSize="small" />
                </Badge>
              </IconButton>
              <IconButton edge="end" aria-haspopup="true" onClick={handleMenu}>
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
                <MenuItem onClick={handleClose}>
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
          <ListItem button onClick={handleDropDown}>
            <ListItemIcon>
              <ProductIcon className={classes.iconColor} />
            </ListItemIcon>
            <ListItemText primary="Products" />
            {openDropdown ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openDropdown} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className={classes.dropdown}>
                <ListItemIcon>
                  <SaveAltIcon className={classes.iconColor} />
                </ListItemIcon>
                <ListItemText primary="Add Product" />
              </ListItem>
              <ListItem button className={classes.dropdown}>
                <ListItemIcon>
                  <EditIcon className={classes.iconColor} />
                </ListItemIcon>
                <ListItemText primary="Edit Product" />
              </ListItem>
              <ListItem button className={classes.dropdown}>
                <ListItemIcon>
                  <BlockIcon className={classes.iconColor} />
                </ListItemIcon>
                <ListItemText primary="Blocked Products" />
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
          <ListItem button>
            <ListItemIcon>
              <PaymentIcon className={classes.iconColor} />
            </ListItemIcon>
            <ListItemText primary="Payments" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <AssessmentIcon className={classes.iconColor} />
            </ListItemIcon>
            <ListItemText primary="Business Analytics" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <TuneIcon className={classes.iconColor} />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
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
          <Typography color="textPrimary">Dashboard</Typography>
        </Breadcrumbs>

        {/* COMPLETE STORE REGISTRATION FORM */}
        {!showCompleteRegis ? (
          <CompleteRegister setCompleteRegis={setCompleteRegis} />
        ) : (
          ""
        )}

        <div style={{ margin: "20px 0" }}>
          <Typography paragraph>
            Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
            ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
            elementum integer enim neque volutpat ac tincidunt. Ornare
            suspendisse sed nisi lacus sed viverra tellus. Purus sit amet
            volutpat consequat mauris. Elementum eu facilisis sed odio morbi.
            Euismod lacinia at quis risus sed vulputate odio. Morbi tincidunt
            ornare massa eget egestas purus viverra accumsan in. In hendrerit
            gravida rutrum quisque non tellus orci ac. Pellentesque nec nam
            aliquam sem et tortor. Habitant morbi tristique senectus et.
            Adipiscing elit duis tristique sollicitudin nibh sit. Ornare aenean
            euismod elementum nisi quis eleifend. Commodo viverra maecenas
            accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam
            ultrices sagittis orci a.
          </Typography>
        </div>
        <Button onClick={printStore}>SHOW STORE</Button>
        <Button onClick={logoutHandler}>Log Out</Button>
        <Copyright />
      </main>
    </div>
  );

  function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link color="inherit" href="#">
          Digi-Mart
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }
}
