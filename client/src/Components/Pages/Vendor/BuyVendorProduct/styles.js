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
		height: 80,
	},
	// Checkbox Styles
	icon: {
		borderRadius: 12,
		width: 24,
		height: 24,
		boxShadow:
			"inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
		backgroundColor: "#f5f8fa",
		"input:hover ~ &": {
			backgroundColor: "#ebf1f5",
		},
		"input:disabled ~ &": {
			boxShadow: "none",
			background: "rgba(206,217,224,.5)",
		},
	},
	checkedIcon: {
		backgroundColor: theme.palette.primary.main,
		backgroundImage: theme.palette.secondary,
		"&:before": {
			display: "block",
			width: 24,
			height: 24,
			backgroundImage:
				"url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
				" fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
				"1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",

			content: '""',
		},
		"input:hover ~ &": {
			backgroundColor: theme.palette.primary.dark,
		},
	},
}));

export default useStyles;
