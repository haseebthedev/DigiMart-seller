import React, { useState, useEffect } from "react";
import axios from "axios";
import MaterialTable from "material-table";
import { Grid, Paper } from "@material-ui/core";
import { useUserContext } from "../../../../context/UserContext";

import useStyles from "./styles";

export default function ViewProducts() {
	const classes = useStyles();
	// context
	const { store } = useUserContext();
	const token = store.data.token;

	const [details, setDetails] = useState();
	const [storeId, setStoreId] = useState("");

	const columns = [
		{ title: "Name", field: "name" },
		{ title: "Description", field: "description" },
		{ title: "Brand", field: "manufacturer" },
		{ title: "Category", field: "category" },
		{ title: "Price", field: "price" },
		{ title: "Stock", field: "stockAvailable" },
		{ title: "Discount", field: "discountPercentage" },
		{ title: "Warranty", field: "warranty" },
	];

	useEffect(() => {
		axios
			.get("http://localhost:8080/seller/store/products", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				// console.log(res.data.data.products);
				setDetails(res.data.data.products);
				const storeData = res.data.data.products;
				// console.log("storeData on useEffect is ", storeData);
				setStoreId(
					storeData.map((items) => {
						return items._id;
					})
				);
			})
			.catch((error) =>
				console.log(
					"ERROR: " + JSON.stringify(error.response.data.error)
				)
			);
	}, [token]);

	return (
		<Grid container className={classes.root}>
			<Grid item xs={12} sm={12} md={12} component={Paper}>
				<MaterialTable
					title=""
					data={details}
					columns={columns}
					editable={{
						onRowAdd: (newData) =>
							new Promise((resolve, reject) => {
								setTimeout(() => {
									setDetails([...details, newData]);

									resolve();
								}, 1000);
							}),
						onRowUpdate: (newData, oldData) =>
							new Promise((resolve, reject) => {
								setTimeout(() => {
									const dataUpdate = [...details];
									const index = oldData.tableData.id;
									dataUpdate[index] = newData;
									setDetails([...dataUpdate]);

									const {
										name,
										category,
										description,
										stockAvailable,
										price,
										weight,
										discountPercentage,
										manufacturer,
										warranty,
									} = newData;

									axios
										.patch(
											`http://localhost:8080/seller/store/product/${storeId[index]}`,
											{
												name,
												category,
												description,
												stockAvailable,
												price,
												weight,
												discountPercentage,
												manufacturer,
												warranty,
											}
											// {
											//   headers: { Authorization: `Bearer ${token}` },
											// }
										)
										.then((res) =>
											console.log(
												"Product Updated. RES: ",
												res
											)
										)
										.catch((error) =>
											console.log("Error: " + error)
										);
									resolve();
								}, 1000);
							}),
						onRowDelete: (oldData) =>
							new Promise((resolve, reject) => {
								setTimeout(() => {
									const dataDelete = [...details];
									const index = oldData.tableData.id;
									dataDelete.splice(index, 1);
									setDetails([...dataDelete]);
									console.log(
										"Selected store id is ",
										storeId[index]
									);

									axios
										.delete(
											`http://localhost:8080/seller/store/product/${storeId[index]}`

											// {
											//   headers: { Authorization: `Bearer ${token}` },
											// }
										)
										.then((res) =>
											console.log(
												"Product Updated. RES: ",
												res
											)
										)
										.catch((error) =>
											console.log("Error: " + error)
										);
									resolve();
								}, 1000);
							}),
					}}
					options={{
						actionsColumnIndex: -1,
						// rowStyle: {
						// 	backgroundColor: "#EEE",
						// },
						exportButton: true,
					}}
				/>
			</Grid>
		</Grid>
	);
}
