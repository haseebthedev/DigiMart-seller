import React from "react";
import {
	Grid,
	Typography,
	TextField,
	FormControlLabel,
	Radio,
	RadioGroup,
	Select,
	MenuItem,
} from "@material-ui/core";

export default function Store(props) {
	// coming from dashboard page
	const { values, handleChange, IFerrors } = props;

	return (
		<React.Fragment>
			<Typography variant="h6" style={{ marginBottom: 15 }}>
				Store Details
			</Typography>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<TextField
						variant="outlined"
						label="Store Name"
						fullWidth
						value={values.name}
						onChange={handleChange("name")}
						helperText={IFerrors.nameError}
						error={IFerrors.nameError.length > 0 ? true : false}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Select
						fullWidth
						variant="outlined"
						value={values.category}
						defaultValue={"DEFAULT"}
						onChange={handleChange("category")}
						error={IFerrors.categoryError.length > 0 ? true : false}
					>
						<MenuItem value="DEFAULT" disabled>
							Select a Category
						</MenuItem>
						<MenuItem value="Electronic">Electronics</MenuItem>
						<MenuItem value="Health">Health and Beauty</MenuItem>
						<MenuItem value="Groceries">Groceries & Pets</MenuItem>
						<MenuItem value="Lifestyle">Home & Lifestyle</MenuItem>
						<MenuItem value="fashion">Fashion & Clothing</MenuItem>
						<MenuItem value="sports">Sports</MenuItem>
						<MenuItem value="automotive">
							Automotive and Bikes
						</MenuItem>
					</Select>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						variant="outlined"
						label="Biography"
						fullWidth
						defaultValue={values.biography}
						onChange={handleChange("biography")}
						helperText={IFerrors.biographyError}
						error={
							IFerrors.biographyError.length > 0 ? true : false
						}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						variant="outlined"
						label="City"
						fullWidth
						defaultValue={values.city}
						onChange={handleChange("city")}
						helperText={IFerrors.cityError}
						error={IFerrors.cityError.length > 0 ? true : false}
					/>
				</Grid>

				<Grid item xs={12} sm={6}>
					<TextField
						variant="outlined"
						label="Country"
						fullWidth
						defaultValue={values.country}
						onChange={handleChange("country")}
						helperText={IFerrors.countryError}
						error={IFerrors.countryError.length > 0 ? true : false}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						variant="outlined"
						label="Warehouse Address"
						fullWidth
						defaultValue={values.warehouseAddress}
						onChange={handleChange("warehouseAddress")}
						helperText={IFerrors.warehouseAddressError}
						error={
							IFerrors.warehouseAddressError.length > 0
								? true
								: false
						}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						variant="outlined"
						label="Physical Address"
						fullWidth
						defaultValue={values.physicalAddress}
						onChange={handleChange("physicalAddress")}
						helperText={IFerrors.physicalAddressError}
						error={
							IFerrors.physicalAddressError.length > 0
								? true
								: false
						}
					/>
				</Grid>

				<Grid item xs={12}>
					<RadioGroup
						row
						value={values.type}
						onChange={handleChange("type")}
					>
						<FormControlLabel
							value="shop"
							control={<Radio color="primary" />}
							label="I'm a Shopkepper"
						/>
						<FormControlLabel
							value="brand"
							control={<Radio color="primary" />}
							label="We're a Brand"
						/>
					</RadioGroup>
				</Grid>
			</Grid>
		</React.Fragment>
	);
}
