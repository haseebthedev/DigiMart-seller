import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "stretch",
	},
	leftSideBar: {
		height: "80vh",
	},
	MainChatArea: {
		height: "80vh",
		// margin: "0px 40px",
		position: "relative",
	},
}));

export default useStyles;
