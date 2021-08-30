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
	},
}));

export default useStyles;
