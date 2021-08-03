import React from "react";
import {
	Grid,
	Typography,
	TextField,
	FormControlLabel,
	Radio,
	RadioGroup,
	Select,
	InputLabel,
	FormControl,
} from "@material-ui/core";

export default function Store(props) {
	// coming from dashboard page
	const { values, handleChange } = props;

	return (
		<React.Fragment>
			<Typography variant="h6" gutterBottom>
				Store Details
			</Typography>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<TextField
						required
						name="StoreName"
						label="Store Name"
						fullWidth
						defaultValue={values.name}
						onChange={handleChange("name")}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<FormControl fullWidth>
						<InputLabel>Category</InputLabel>
						<Select
							native
							defaultValue={values.category}
							onChange={handleChange("category")}
						>
							<option value="Electronic">Electronics</option>
							<option value="Health">Health and Beauty</option>
							<option value="Groceries">Groceries & Pets</option>
							<option value="Lifestyle">Home & Lifestyle</option>
							<option value="fashion">Fashion & Clothing</option>
							<option value="sports">Sports</option>
							<option value="automotive">
								Automotive and Bikes
							</option>
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						required
						name="storeBio"
						label="Biography"
						fullWidth
						defaultValue={values.biography}
						onChange={handleChange("biography")}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						required
						name="warehouseAddress"
						label="Warehouse Address"
						fullWidth
						defaultValue={values.warehouseAddress}
						onChange={handleChange("warehouseAddress")}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						required
						name="physicalAddress"
						label="Physical Address"
						fullWidth
						defaultValue={values.physicalAddress}
						onChange={handleChange("physicalAddress")}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						required
						name="city"
						label="City"
						fullWidth
						defaultValue={values.city}
						onChange={handleChange("city")}
					/>
				</Grid>

				<Grid item xs={12} sm={6}>
					<TextField
						required
						name="country"
						label="Country"
						fullWidth
						defaultValue={values.country}
						onChange={handleChange("country")}
					/>
				</Grid>
				<Grid item xs={12}>
					<RadioGroup
						row
						value={values.type}
						onChange={handleChange("type")}
					>
						<FormControlLabel
							value="individual"
							control={<Radio color="primary" />}
							label="I'm an Individual"
						/>
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
