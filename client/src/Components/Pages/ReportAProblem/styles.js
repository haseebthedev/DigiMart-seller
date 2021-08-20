import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	paper: {
		margin: theme.spacing(3, 6),
		justifyContent: "center",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		[theme.breakpoints.down(700)]: {
			margin: theme.spacing(1.8, 4),
		},
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
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(2),
		textAlign: "center",
	},
	submit: {
		margin: theme.spacing(2, 0, 2),
	},
}));

export default useStyles;
