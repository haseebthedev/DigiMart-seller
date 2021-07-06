import React from "react";
import axios from "axios";
import { Paper, FormControl, InputLabel, Select } from "@material-ui/core";
// import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";

import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import FileBase64 from "react-file-base64";
import Avatar from "@material-ui/core/Avatar";

import useStyles from "./styles";

import { useUserContext } from "../../../context/UserContext";
import { Redirect } from "react-router-dom";

export default function VendorCenter() {
	const classes = useStyles();

	// eslint-disable-next-line
	const { store, dispatch } = useUserContext();
	const token = store.data.token;

	const [storeData, setStoreData] = React.useState({
		logo: "",
		name: "Haseeb Ahmed",
		biography: "We love to sell products online",
		category: "Electronic",
		warehouseAddress: "Street # 213, Block-F, Satellite Town",
	});
	const [isLoggedOut] = React.useState(false);

	const onSelectlogo = (files) => {
		setStoreData({ ...storeData, logo: files.base64 });
	};
	const handleChange = (input) => (e) => {
		setStoreData({ ...storeData, [input]: e.target.value });
	};

	// UPDATE REQUEST SENDING HERE
	const handleSubmitUpdate = () => {
		const storeURL = "http://localhost:8080/seller/store/me";
		axios
			.patch(
				storeURL,
				{
					...storeData,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
			.then((res) => console.log("Store Updated. RES: ", res))
			.catch((error) => console.log("Error: " + error));
	};

	return (
		<Grid container className={classes.root}>
			{isLoggedOut ? <Redirect to="/vendor/login" /> : ""}
			<Grid item xs={12} sm={12} md={12} component={Paper}>
				<Container component="div" maxWidth="sm">
					<div className={classes.paper}>
						<Grid className={classes.settingsSpacing}>
							<form className={classes.form}>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										marginBottom: "20px",
									}}
								>
									<Avatar
										alt="profile photo"
										src={storeData.logo}
										className={
											classes.avatarInProfileSetting
										}
									>
										{"LOGO HERE"}
									</Avatar>
									<FileBase64
										size="60"
										multiple={false}
										onDone={onSelectlogo}
									/>
								</div>

								<TextField
									variant="outlined"
									margin="normal"
									fullWidth
									id="name"
									label="Store Name"
									name="storeName"
									defaultValue={storeData.name}
									onChange={handleChange("name")}
								/>
								<TextField
									variant="outlined"
									margin="normal"
									fullWidth
									id="biography"
									label="Biography"
									name="biography"
									defaultValue={storeData.biography}
									onChange={handleChange("biography")}
								/>

								<FormControl fullWidth>
									<InputLabel style={{ marginLeft: "10px" }}>
										Category
									</InputLabel>
									<Select
										variant="outlined"
										value={storeData.category}
										onChange={handleChange("category")}
										align="left"
										style={{ marginTop: "20px" }}
									>
										<option value="Electronic">
											Electronics
										</option>
										<option value="Health">
											Health and Beauty
										</option>
										<option value="Groceries">
											Groceries & Pets
										</option>
										<option value="Lifestyle">
											Home & Lifestyle
										</option>
										<option value="fashion">
											Fashion & Clothing
										</option>
										<option value="sports">Sports</option>
										<option value="automotive">
											Automotive and Bikes
										</option>
									</Select>
								</FormControl>

								<TextField
									variant="outlined"
									margin="normal"
									fullWidth
									id="warehouseAddress"
									label="Warehouse Address"
									name="warehouseAddress"
									defaultValue={storeData.warehouseAddress}
									onChange={handleChange("warehouseAddress")}
								/>

								<Button
									fullWidth
									variant="contained"
									color="secondary"
									className={classes.submit}
									onClick={handleSubmitUpdate}
								>
									SAVE CHANGES
								</Button>
							</form>
						</Grid>
					</div>
				</Container>
			</Grid>
		</Grid>
	);
}
