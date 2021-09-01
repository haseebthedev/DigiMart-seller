import { withStyles } from "@material-ui/core/styles";
import { Switch } from "@material-ui/core";

const IOSSwitch = withStyles((theme) => ({
	root: {
		width: 42,
		height: 22,
		padding: 0,
	},
	switchBase: {
		padding: 1,
		"&$checked": {
			transform: "translateX(20px)",
			color: theme.palette.common.white,
			"& + $track": {
				backgroundColor: theme.palette.primary,
				opacity: 1,
				border: "none",
			},
			boxShadow: "0 1px 20px rgb(0 0 0 / 10%)",
		},
		"&$focusVisible $thumb": {
			color: "#52d869",
			border: "6px solid #fff",
		},
	},
	thumb: {
		width: 20,
		height: 20,
	},
	track: {
		borderRadius: 26 / 2,
		border: `1px solid #e1e1e1`,
		backgroundColor: theme.palette.grey[50],
		opacity: 1,
		transition: theme.transitions.create(["background-color", "border"]),
	},
	checked: {},
	focusVisible: {},
}))(({ classes, ...props }) => {
	return (
		<Switch
			focusVisibleClassName={classes.focusVisible}
			disableRipple
			classes={{
				root: classes.root,
				switchBase: classes.switchBase,
				thumb: classes.thumb,
				track: classes.track,
				checked: classes.checked,
			}}
			{...props}
		/>
	);
});

export default IOSSwitch;
