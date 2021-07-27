import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	avatar: {
		width: 50,
		height: 50,
		margin: theme.spacing(1),
		backgroundColor: theme.palette.primary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(2),
	},
	submit: {
		margin: theme.spacing(2, 0, 2),
	},

	card: {
		margin: theme.spacing(1),
	},
	method: {
		marginBottom: "10px",
		textAlign: "center",
	},
	btns: {
		marginTop: "20px",
		display: "flex",
		justifyContent: "center",
	},
	addIcon: {
		fontSize: "35px",
		marginBottom: "20px",
	},
	addCard: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
}));

export default useStyles;
