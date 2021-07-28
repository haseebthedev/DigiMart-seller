import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 300;
const useStyles = makeStyles((theme) => {
	return {
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
			background: theme.palette.type === "light" ? "#FFF" : "#FFF",
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
			background: theme.palette.primary.main,
			color: "#FFF",
			width: drawerWidth,
			paddingLeft: theme.spacing(1),
		},
		drawerHeader: {
			display: "flex",
			alignItems: "center",
			padding: theme.spacing(0, 1),
			...theme.mixins.toolbar,
			justifyContent: "flex-end",
		},
		content: {
			flexGrow: 1,
			padding: theme.spacing(4),
			transition: theme.transitions.create("margin", {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			marginTop: theme.spacing(8),
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
		dropdown: {
			paddingLeft: theme.spacing(4),
		},
		paper: {
			marginTop: theme.spacing(2),
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
		},
		avatar: {
			margin: theme.spacing(1),
			backgroundColor: theme.palette.primary.main,
		},
		form: {
			width: "100%",
			marginTop: theme.spacing(1),
		},
		switch: {
			marginTop: theme.spacing(1),
		},
		submit: {
			margin: theme.spacing(2, 0, 2),
		},
		avatarInProfileSetting: {
			height: "120px",
			width: "120px",
			backgroundColor: theme.palette.primary.main,
			[theme.breakpoints.down(700)]: {
				height: "60px",
				width: "60px",
			},
		},
	};
});

export default useStyles;
