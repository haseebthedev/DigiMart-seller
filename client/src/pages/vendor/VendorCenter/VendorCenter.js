import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
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

import logo from "../../../assets/images/logo.png";
import CompleteRegister from "../CompleteRegister/CompleteRegister";

import { useUserContext } from "../../../context/UserContext";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  appbarRight: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: "120px",
    marginLeft: theme.spacing(1),
  },
  root: {
    display: "flex",
  },
  appBar: {
    background: "#FFF",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {},
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    background: "linear-gradient(130deg, rgba(9,0,113,1) 30%, #EF233C 80%)",
    color: "#FFF",
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(5),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  listItemIcon: {
    minWidth: "40px",
  },
  iconColor: {
    color: "#FFF",
  },
}));

export default function VendorCenter() {
  const classes = useStyles();
  const theme = useTheme();

  // eslint-disable-next-line
  const { store, dispatch } = useUserContext();

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
        <div className={classes.drawerHeader}>
          <IconButton
            onClick={handleDrawerClose}
            style={{ background: "#ffffff0d" }}
          >
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon style={{ color: "#FFF" }} />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {[
            "Dashboard",
            "Products",
            "Sales",
            "Orders",
            "Messages",
            "Payments",
            "Business Analytics",
            "Settings",
            "Promotions",
          ].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? (
                  <InboxIcon className={classes.iconColor} />
                ) : (
                  <MailIcon className={classes.iconColor} />
                )}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />

        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/">
            Vendor
          </Link>
          <Typography color="textPrimary">Dashboard</Typography>
        </Breadcrumbs>

        <CompleteRegister />
        <Divider />
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
