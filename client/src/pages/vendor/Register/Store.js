import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

export default function Store() {
  const [age, setAge] = useState("Category");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Store Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="storeName"
            name="storeName"
            label="Store Name"
            fullWidth
            autoComplete="given-name"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl>
            <InputLabel>Category</InputLabel>
            <Select
              native
              defaultValue="Generic"
              value={age}
              onChange={handleChange}
            >
              <option value="Electronic">Electronics</option>
              <option value="Health">Health and Beauty</option>
              <option value="Groceries">Groceries & Pets</option>
              <option value="Lifestyle">Home & Lifestyle</option>
              <option value="fashion">Fashion & Clothing</option>
              <option value="sports">Sports</option>
              <option value="automotive">Automotive and Bikes</option>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id=""
            name="storeBio"
            label="Biography"
            fullWidth
            autoComplete="family-name"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="physicalAddress"
            name="physicalAddress"
            label="Physical Address"
            fullWidth
            autoComplete="shipping address-line1"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            autoComplete="shipping address-level2"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="country"
            name="country"
            label="Country"
            fullWidth
            autoComplete="shipping postal-code"
          />
        </Grid>
        <Grid item xs={12}>
          <RadioGroup row defaultValue="male">
            <FormControlLabel
              value="individual"
              control={<Radio color="secondary" />}
              label="I'm an Individual"
            />
            <FormControlLabel
              value="brand"
              control={<Radio color="secondary" />}
              label="We're a Brand"
            />
          </RadioGroup>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
