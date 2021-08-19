import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	paper: {
		margin: theme.spacing(3, 6),
		// justifyContent: "center",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		[theme.breakpoints.down(700)]: {
			margin: theme.spacing(1.8, 4),
		},
	},
	form: {
		width: "100%",
		marginTop: theme.spacing(2),
	},
	submit: {
		margin: theme.spacing(4, 0, 2),
	},
	captcha: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		marginBottom: 10,
	},
	formControl: {
		margin: theme.spacing(0),
		minWidth: 150,
	},
	selectEmpty: {
		marginTop: theme.spacing(0),
	},
	chip: {
		margin: theme.spacing(0.5),
	},
	media: {
		height: 90,
	},
}));

export default useStyles;
