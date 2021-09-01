import React from "react";
import { Paper, Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	card: {
		padding: theme.spacing(2),
		// height: "10rem",
		color: theme.palette.type === "light" ? "#FFF" : "#FFF",
		background: `linear-gradient(to right bottom, rgba(230,63,63,1) 0%, ${theme.palette.primary.main})`,
	},
}));

const CountCard = ({ title, count, icon }) => {
	const classes = useStyles();

	return (
		<Paper className={classes.card}>
			<Grid container justify="space-between">
				<Grid>
					<Typography style={{ fontSize: 14 }}>{title}</Typography>
					<Typography style={{ fontSize: 36, fontWeight: "bold" }}>
						{count}
					</Typography>
				</Grid>
				<Grid>{icon}</Grid>
			</Grid>
		</Paper>
	);
};

export default CountCard;
