import React from "react";
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
} from "@material-ui/core";
import useStyles from "./style-form";

export default function SignupBuyer() {
  const classes = useStyles();

  // eslint-disable-next-line
  const { store, dispatch } = useUserContext();
  const token = store.data.token;

  const [productDetails, setProductDetails] = React.useState({
    name: "Feeder",
    description: "Amazing Product",
    manufactureDate: "11/06/2003",
    category: "Electronics",
    price: "1000",
    stockAvailable: 10,
    weight: 20,
    discountPercentage: 10,
    manufacturer: "Oppo china",
    warranty: "19 days",
    images: ["null"],
    colors: ["red", "yellow"],
    storeName: "Jamal baby products",
  });

  // updating BankDetails usestate
  const handleProductDetails = (input) => (e) => {
    setProductDetails({ ...productDetails, [input]: e.target.value });
  };

  const addProductHandler = (e) => {
    e.preventDefault();

    axios
      .post(
        "http://localhost:8080/seller/store/product",
        {
          ...productDetails,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => console.log(res.data))
      .catch((error) =>
        console.log("ERROR: " + JSON.stringify(error.response.data.error))
      );
  };

  return (
    <Grid container className={classes.root}>
      <CssBaseline />
      <Grid item xs={12} sm={12} md={12} component={Paper}>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LibraryAddIcon />
          </Avatar>
          <h1 style={{ margin: 1 }}>Add Product</h1>
          <Typography variant="caption">
            Please Fill this form to add product
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  autoFocus
                  margin="dense"
                  variant="outlined"
                  autoComplete="pName"
                  required
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={productDetails.name}
                  onChange={handleProductDetails("name")}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  label="Product Description"
                  id="pDes"
                  name="description"
                  value={productDetails.description}
                  onChange={handleProductDetails("description")}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  label="Category"
                  name="category"
                  value={productDetails.category}
                  onChange={handleProductDetails("category")}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  placeholder="dd/MM/YYYY"
                  label="Manufacture Date"
                  name="manufactureDate"
                  value={productDetails.manufactureDate}
                  onChange={handleProductDetails("manufactureDate")}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  size="small"
                  label="Price (Rs)"
                  name="price"
                  value={productDetails.price}
                  onChange={handleProductDetails("price")}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  size="small"
                  name="stock"
                  label="Stock / Quantity"
                  value={productDetails.stockAvailable}
                  onChange={handleProductDetails("stockAvailable")}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  name="warranty"
                  label="Warranty"
                  value={productDetails.warranty}
                  onChange={handleProductDetails("warranty")}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  label="Discount(%)"
                  id="discount"
                  name="discount"
                  value={productDetails.discountPercentage}
                  onChange={handleProductDetails("discountPercentage")}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  label="Brand Name"
                  id="brandName"
                  name="manufacturer"
                  value={productDetails.manufacturer}
                  onChange={handleProductDetails("manufacturer")}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  label="Weight (grams)"
                  name="weight"
                  value={productDetails.weight}
                  onChange={handleProductDetails("weight")}
                />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={4}
              justify="center"
              style={{ margin: "10px 0" }}
            >
              <Grid item>
                <FileBase64 multiple={true} />
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
