import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "stretch",
	},
	leftSideBar: {
		height: "82vh",
		marginBottom: "30px",
	},
	MainChatArea: {
		height: "82vh",
		width: "100%",
		marginBottom: "30px",
		position: "relative",
		paddingLeft: 5,
		paddingRight: 5,
	},
	badge: {
		backgroundColor: "red",
		color: "#fff",
		display: "inline-block",
		paddingLeft: "8px",
		paddingRight: "8px",
		textAlign: "center",
		borderRadius: "50%",
	},
	flexContainer: {
		padding: 0,
		margin: "auto",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
	},
	rowItem: {
		paddingLeft: 60,
		paddingRight: 60,
	},
	table: {
		minWidth: 650,
	},
}));

export default useStyles;
