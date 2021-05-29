import React, { useState } from "react";
import LibraryAddIcon from "@material-ui/icons/LibraryAdd";
import FileBase64 from "react-file-base64";
import axios from "axios";
import { useUserContext } from "../../../../context/UserContext";

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from "@material-ui/core";
import useStyles from "./style-form";

export default function SignupBuyer() {
  // eslint-disable-next-line
  const { store, dispatch } = useUserContext();
  const token = store.data.token;

  // eslint-disable-next-line
  const [name, setName] = React.useState("Feeder");
  const [description, setDescription] = React.useState(" Very slim feeder");
  const [manufactureDate, setManufactureDate] = React.useState("11/06/2003");
  const [category, setCategory] = React.useState("baby product");
  const [price, setPrice] = React.useState(1000);
  const [stockAvailable, setStockAvailable] = React.useState(10);
  const [weight, setWeight] = React.useState(20);
  const [discountPercentage, setDiscountPercentage] = React.useState(10);
  const [manufacturer, setManufacturer] = React.useState("Oppo china");
  const [warranty, setWarranty] = React.useState("19 days");
  const [images, setImages] = React.useState(["null"]);
  const [colors, setColors] = React.useState(["red", "yellow"]);
  const [storeName, setstoreName] = React.useState("Jamal baby products");

  const addProductHandler = (e) => {
    e.preventDefault();

    axios
      .post(
        "http://localhost:8080/seller/store/product",
        {
          name,
          description,
          manufactureDate,
          category,
          price,
          stockAvailable,
          weight,
          discountPercentage,
          manufacturer,
          warranty,
          images,
          colors,
          storeName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(
        (res) => console.log(res.data)
        // registerUser(dispatch, res.data.data.vendor, res.data.data.token)
      )
      // .then((res) => console.log("DATA", res.data))
      .catch((error) =>
        console.log("ERROR: " + JSON.stringify(error.response.data.error))
      );
  };

  // for verifying terms and condition check box.........................
  const [isCheckedTerms, setIsCheckedTerms] = useState(false);

  // for enabling and disabling button handling..........................
  const [btnDisable, setBtnDisable] = useState(true);

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  const onClickTermsHandler = () => {
    console.log("Value before set", isCheckedTerms);
    setIsCheckedTerms({ isCheckedTerms: !isCheckedTerms });
    console.log("value after set", isCheckedTerms);
    if (isCheckedTerms) {
      console.log("1st condition");

      setBtnDisable(true);
      setIsCheckedTerms(false);
    } else {
      console.log("2nd condition");
      setBtnDisable(false);
    }
  };

  const classes = useStyles();
  const headerStyle = { margin: 0 };

  return (
    <Grid container className={classes.root}>
      <CssBaseline />
      <Grid item xs={12} sm={12} md={12} component={Paper}>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LibraryAddIcon />
          </Avatar>
          <h1 style={headerStyle}>Add Product</h1>
          <Typography variant="caption">
            Please Fill this form to add product
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  margin="dense"
                  variant="outlined"
                  autoComplete="pName"
                  name="pName"
                  required
                  fullWidth
                  id="productName"
                  label="Product Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  // style={{ marginTop: 3 }}
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  name="productDescription"
                  label="Product Description"
                  id="pDes"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <TextField
                  fullWidth
                  id="date"
                  label="Production Date"
                  type="date"
                  defaultValue="2017-05-24"
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">
                    Category
                  </InputLabel>
                  <Select
                    autoWidth
                    style={{ width: 250 }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={category}
                    onChange={handleChange}
                  >
                    <MenuItem value={"Mobile"}>Mobile</MenuItem>
                    <MenuItem value={"Clothing"}>Clothing</MenuItem>
                    <MenuItem value={"Crockery"}>Crockery</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <TextField
                  variant="outlined"
                  // style={{ marginBottom: 15 }}
                  margin="dense"
                  required
                  fullWidth
                  size="small"
                  name="stock"
                  label="Price (Rs)"
                  id="mobilenum"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <TextField
                  variant="outlined"
                  // style={{ marginBottom: 15 }}
                  margin="dense"
                  required
                  fullWidth
                  size="small"
                  name="stock"
                  label="Stock / Quantity"
                  id="mobilenum"
                />
              </Grid>
            </Grid>
            {/* /////////////////////////////////////////////////////////////////////////*/}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <TextField
                  variant="outlined"
                  // style={{ marginBottom: 15 }}
                  margin="dense"
                  required
                  fullWidth
                  name="weight"
                  label="Weight (grams)"
                  id="mobilenum"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <TextField
                  variant="outlined"
                  // style={{ marginBottom: 15 }}
                  margin="dense"
                  required
                  fullWidth
                  name="discount"
                  label="Discount(%)"
                  id="discount"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <TextField
                  variant="outlined"
                  // style={{ marginBottom: 15 }}
                  margin="dense"
                  required
                  fullWidth
                  name="bName"
                  label="Brand Name"
                  id="brandName"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <TextField
                  variant="outlined"
                  // style={{ marginBottom: 15 }}
                  margin="dense"
                  required
                  fullWidth
                  name="warranty"
                  label="Warranty"
                  id="warranty"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <FileBase64 multiple={true} />
              <Grid item xs={12} sm={6} md={6} lg={3}>
                {/* {renderPhotos} */}
                {/* <Avatar
                  alt="profile photo"
                  src={productData.profilePic}
                  className={classes.avatarInProfileSetting}
                ></Avatar> */}
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <Grid item xs={12} sm={6} md={6} lg={3}></Grid>
                <Grid item xs={12} sm={6} md={6} lg={3}></Grid>
              </Grid>
            </Grid>
            <Button
              size="large"
              onClick={addProductHandler}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Add Product
            </Button>
          </form>
        </div>
        {/* Copyright Section */}
        <Box style={{ marginTop: 5 }} mt={5}>
          <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}
            <Link color="inherit" href="#">
              Digi-Mart
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}
