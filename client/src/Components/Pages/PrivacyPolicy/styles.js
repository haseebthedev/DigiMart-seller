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
	content: {
		padding: "30px",
	},
}));

export default useStyles;
