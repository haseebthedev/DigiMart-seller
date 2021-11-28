import React, { useState, useEffect } from "react";
import api from "../../../../Axios/api";
import MaterialTable from "material-table";
// import Snackbar from "@material-ui/core/Snackbar";
// import MuiAlert from "@material-ui/lab/Alert";
import { Grid, Paper } from "@material-ui/core";
import moment from "moment";
import { useUserContext } from "../../../../context/UserContext";

import Pal from "../../../../themes/palette";

export default function PromotedProducts() {
	// const classes = useStyles();
	const { store } = useUserContext();
	const token = store.data.token;

	const [PPdetails, setPPdetails] = useState([]);

	const columns = [
		{ title: "PID", field: "productId" },
		{ title: "Product Name", field: "productName" },
		{
			title: "Discount",
			field: "discount",
			render: ({ discount }) => {
				let res = discount === null ? "NIL" : discount;
				return <div>{res}</div>;
			},
		},
		{
			title: "Promo Code",
			field: "promoCode",
			render: ({ promoCode }) => {
				let res = promoCode === null ? "-" : promoCode;
				return <div>{res}</div>;
			},
		},
		{
			title: "Medium",
			field: "promotionSource",
			render: (row) => {
				let res;
				if (row.importedAudiencePromotionSource !== undefined) {
					res = row.importedAudiencePromotionSource;
				} else {
					res = row.buyerPromotionSource;
				}
				return <div>{res}</div>;
			},
		},
		{ title: "Product URL", field: "shortUrl" },
		{
			title: "Date",
			field: "promotion_date",
			render: ({ promotion_date }) => {
				let date = new Date(promotion_date);
				return <div>{date.toLocaleDateString()}</div>;
			},
		},
		{
			title: "Time",
			field: "promotion_date",
			align: "center",
			render: (row) => {
				let time = "";
				if (row.isPromotionScheduled === false) {
					time = moment(row.createdAt).format("hh:mm A");
				} else {
					time = moment(row.promotion_date).format("hh:mm A");
				}
				return <div>{time}</div>;
			},
			export: false,
		},
	];

	const getAllPromotedProducts = async () => {
		await api
			.get("/seller/store/products/promote", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => setPPdetails(res.data.data.productPromotions))
			.catch((error) => console.log("ERROR: " + error));
	};

	useEffect(() => {
		getAllPromotedProducts();
		// eslint-disable-next-line
	}, []);

	return (
		<Grid container>
			<Grid item xs={12} sm={12} md={12} component={Paper}>
				<MaterialTable
					title="All Promoted Products"
					data={PPdetails}
					columns={columns}
					options={{
						actionsColumnIndex: -1,
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
