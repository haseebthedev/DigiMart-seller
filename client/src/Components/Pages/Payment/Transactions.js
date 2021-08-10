import React, { useState } from "react";
// import api from "../../../Axios/api";
import MaterialTable from "material-table";
// import Snackbar from "@material-ui/core/Snackbar";
// import MuiAlert from "@material-ui/lab/Alert";
import { Grid, Paper } from "@material-ui/core";
// import { useUserContext } from "../../../context/UserContext";

import useStyles from "./styles";
import Pal from "../../../themes/palette";

export default function Transactions() {
	const classes = useStyles();
	// context
	// const { store } = useUserContext();
	// const token = store.data.token;

	const [details] = useState([
		{
			id: 1,
			date: "26/Jul/2021",
			amount: 2400,
			status: "PAID",
			proof: "https://images.digimart.com/pf/1",
		},
	]);

	const columns = [
		{ title: "#", field: "id" },
		{ title: "Date", field: "date" },
		{ title: "Amount", field: "amount" },
		{ title: "Status", field: "status" },
		{ title: "Proof", field: "proof" },
	];

	return (
		<Grid container className={classes.root}>
			<Grid item xs={12} sm={12} md={12} component={Paper}>
				<MaterialTable
					title="All Transactions"
					data={details}
					columns={columns}
					options={{
						actionsColumnIndex: -1,
						// rowStyle: {
						// 	backgroundColor: "#EEE",
						// },
						headerStyle: {
							backgroundColor: Pal.palette.primary.main,
							color: "#fff",
							fontWeight: "bold",
						},
						exportButton: true,
					}}
				/>
			</Grid>
		</Grid>
	);
}
