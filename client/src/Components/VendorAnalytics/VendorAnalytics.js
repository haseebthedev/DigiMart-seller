import React, { useState, useEffect } from "react";
import { Grid, Paper } from "@material-ui/core";

// complete registration
import CompleteRegister from "../CompleteRegister/CompleteRegister";

// graphs
import TopSellingProducts from "./TopSellingProducts";
import ProductRevenue from "./ProductRevenue";
import WeeklySales from "./WeeklySales";

import { useUserContext } from "../../context/UserContext";

import useStyles from "./styles";

const VendorAnalytics = () => {
	const classes = useStyles();

	// context
	const { store } = useUserContext();
	// const token = store.data.token;

	const [showCompleteRegis, setCompleteRegis] = useState(true);

	useEffect(() => {
		setCompleteRegis(store.data.data.isStoreRegistered);
	}, [store.data.data.isStoreRegistered]);

	return (
		<Paper className={classes.Paper}>
			{!showCompleteRegis ? (
				<CompleteRegister setCompleteRegis={setCompleteRegis} />
			) : (
				<div>
					<Grid container spacing={4} justify="space-between">
						<Grid item xs={12} md={6}>
							<TopSellingProducts />
						</Grid>
						<Grid item xs={12} md={6}>
							<ProductRevenue />
						</Grid>
					</Grid>
					<Grid container spacing={4} justify="center">
						<Grid item xs={12} md={8}>
							<WeeklySales />
						</Grid>
					</Grid>
				</div>
			)}
		</Paper>
	);
};

export default VendorAnalytics;
