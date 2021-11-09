import React, { useState, useEffect } from "react";
import api from "../../Axios/api";
import Pal from "../../themes/palette";
import MaterialTable from "material-table";
import { Grid, Paper, Typography } from "@material-ui/core";

// icons
import FeaturedVideoIcon from "@material-ui/icons/FeaturedVideo";
import LocalAtmIcon from "@material-ui/icons/LocalAtm";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import ImgNotAvailable from "../../assets/images/imgNotAvailable.jpg";
import Chart from "react-apexcharts";
import CompleteRegister from "../CompleteRegister/CompleteRegister";
import { useUserContext } from "../../context/UserContext";
import useStyles from "./styles";

// widget
import CountCard from "../AnalyticsWidget/CountCard";

const VendorAnalytics = () => {
	const classes = useStyles();
	const { store } = useUserContext();
	const token = store.data.token;
	const { isDarkModeEnabled } = store.data.data;

	const [showCompleteRegis, setCompleteRegis] = useState(
		store.data.data.isStoreRegistered
	);

	const [StatsCount, setStatsCount] = useState({
		stock: "0",
		investment: "0",
		revenue: "0",
		profit: "0",
	});
	const [salesData, setSalesData] = useState([]);
	const [categoryData, setCategoryData] = useState([]);
	const [details, setDetails] = useState([]);

	var SalesStats = {
		series: [
			{
				name: "Sales / Day",
				data: salesData,
				fillColor: "#FF0000",
			},
		],
		options: {
			xaxis: {
				type: "datetime",
			},
			theme: {
				mode: isDarkModeEnabled === true ? "dark" : "light",
			},
			colors: ["#DC143C"],
			fill: {
				colors: ["#DC143C"],
			},
			chart: {
				type: "line",
				zoom: {
					type: "x",
				},
				foreColor: isDarkModeEnabled === true ? "#f6f7f8" : "#373d3f",
			},
			stroke: {
				curve: "smooth",
				style: {
					colors: ["#F44336", "#E91E63"],
				},
			},
			title: {
				text: "Sales Reports",
				align: "center",
				style: {
					fontSize: "20px",
					fontFamily: "poppins",
				},
			},
			tooltip: {
				x: {
					format: "dd/MM/yy HH:mm",
				},
				theme: isDarkModeEnabled === true,
			},
		},
	};

	var CategoryWiseStats = {
		series: Object.values(categoryData),
		options: {
			theme: {
				mode: isDarkModeEnabled === true ? "dark" : "light",
			},
			title: {
				text: "Category-Wise Sales",
				align: "center",
				style: {
					fontSize: "20px",
					fontFamily: "poppins",
				},
			},
			chart: {
				type: "polarArea",
				foreColor: isDarkModeEnabled === true ? "#f6f7f8" : "#373d3f",
			},
			labels: ["Delivered", "Cancelled", "Returned", "Active", "Pending"],
			colors: ["#04e762", "#ff0a0a", "#ff4c00", "#1786dd", "#775DD0"],
			fill: {
				opacity: 1,
				colors: ["#04e762", "#ff0a0a", "#ff4c00", "#1786dd", "#775DD0"],
			},
			yaxis: {
				show: false,
			},
			legend: {
				position: "bottom",
			},
			plotOptions: {
				polarArea: {
					rings: {
						strokeWidth: 0,
					},
					spokes: {
						strokeWidth: 0,
					},
				},
			},
		},
	};

	var barChart = {
		series: [
			{
				name: "Sales / Day",
				data: salesData,
			},
		],
		options: {
			theme: {
				mode: isDarkModeEnabled === true ? "dark" : "light",
			},
			colors: [Pal.palette.primary.main],
			title: {
				text: "Orders",
				align: "center",
				style: {
					fontSize: "20px",
					fontFamily: "poppins",
				},
			},
			chart: {
				type: "bar",
				height: 350,
				foreColor: isDarkModeEnabled === true ? "#f6f7f8" : "#373d3f",
			},
			plotOptions: {
				bar: {
					borderRadius: 0,
					horizontal: false,
				},
			},
			dataLabels: {
				enabled: false,
			},
			xaxis: {
				type: "datetime",
			},
		},
	};

	const retrivingTop5Products = async () => {
		await api
			.get("/seller/store/products", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				setDetails(res.data.data.products);
			})
			.catch((error) =>
				console.log(
					"ERROR: " + JSON.stringify(error.response.data.error)
				)
			);
	};

	const getStats = async () => {
		await api
			.get("/seller/store/analytics", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				let result = res.data.data;
				let stock = result.productsAnalytics[0].totalStock;
				let investment = result.productsAnalytics[0].totalPurchasePrice;
				let revenue = result.ordersAnalytics[0].totalRevenue;
				let profit = result.ordersAnalytics[0].totalProfit;

				setStatsCount({
					...StatsCount,
					stock,
					investment,
					revenue,
					profit,
				});

				// PieChart
				var AllCounts = res.data.data.allCounts;
				delete AllCounts.todayDeliveredOrdersCount;
				setCategoryData(AllCounts);

				let salesDatabyDates = res.data.data.salesByDate.map((el) => {
					let x, y;
					x = new Date(el.date).toLocaleDateString();
					y = el.orders;
					return {
						x,
						y,
					};
				});

				// Sorting Sales Data w.r.t. Date
				salesDatabyDates.sort((a, b) => {
					let da = new Date(a.x),
						db = new Date(b.x);
					return da - db;
				});
				setSalesData(salesDatabyDates);
			})
			.catch((error) => console.log(error));
	};

	useEffect(() => {
		// Retriving List of Products from API
		retrivingTop5Products();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		getStats();
		// eslint-disable-next-line
	}, []);

	const columns = [
		{
			title: "#",
			field: "tableData.id",
			render: ({ tableData }) => <div>{tableData.id + 1}</div>,
		},
		{
			title: "Image",
			field: "images",
			render: ({ images }) => (
				<img
					src={images.length > 0 ? images[0] : ImgNotAvailable}
					alt="ProductImage"
					style={{ width: 40, height: 40, borderRadius: "50%" }}
				/>
			),
			hidden: false,
			export: false,
		},
		{ title: "Name", field: "name", hidden: false, export: true },
		{
			title: "description",
			field: "description",
			hidden: true,
			export: true,
		},
		{ title: "Brand", field: "storeName", hidden: false, export: true },
		{ title: "Category", field: "category", hidden: true, export: true },
		{
			title: "purchasePrice",
			field: "purchasePrice",
			hidden: true,
			export: true,
		},
		{
			title: "Price",
			field: "salePrice",
			render: ({ salePrice }) => <div>{"Rs. " + salePrice}</div>,
			hidden: false,
			export: true,
		},
		{
			title: "Stock",
			field: "stockAvailable",
			hidden: false,
			export: true,
		},
	];

	let result = !showCompleteRegis ? (
		<Paper className={classes.Paper}>
			<CompleteRegister setCompleteRegis={setCompleteRegis} />
		</Paper>
	) : (
		<div>
			<Grid
				container
				spacing={4}
				justify="space-between"
				style={{ marginBottom: 16 }}
			>
				<Grid item xs={12} md={3}>
					<CountCard
						title="PRODUCT STOCK"
						count={
							"# " +
							StatsCount.stock
								.toString()
								.split(/(?=(?:\d{3})+(?:\.|$))/g)
								.join(",")
						}
						icon={<FeaturedVideoIcon style={{ fontSize: 38 }} />}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<CountCard
						title="TOTAL INVESTMENT"
						count={
							"Rs. " +
							StatsCount.investment
								.toString()
								.split(/(?=(?:\d{3})+(?:\.|$))/g)
								.join(",")
						}
						icon={<LocalAtmIcon style={{ fontSize: 38 }} />}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<CountCard
						title="TOTAL REVENUE"
						count={
							"Rs. " +
							StatsCount.revenue
								.toString()
								.split(/(?=(?:\d{3})+(?:\.|$))/g)
								.join(",")
						}
						icon={<WhatshotIcon style={{ fontSize: 38 }} />}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<CountCard
						title="TOTAL PROFIT"
						count={
							"Rs. " +
							StatsCount.profit
								.toString()
								.split(/(?=(?:\d{3})+(?:\.|$))/g)
								.join(",")
						}
						icon={
							<AccountBalanceWalletIcon
								style={{ fontSize: 38 }}
							/>
						}
					/>
				</Grid>
			</Grid>
			<Grid container spacing={4}>
				<Grid item xs={12} md={8}>
					<Paper style={{ padding: 16 }}>
						<Chart
							options={SalesStats.options}
							series={SalesStats.series}
							type="area"
						/>
					</Paper>
					<MaterialTable
						style={{ marginTop: 30 }}
						title={
							<Typography
								variant="h5"
								style={{ fontWeight: "bold" }}
							>
								Top Performing Products
							</Typography>
						}
						data={details.splice(0, 5)}
						columns={columns}
						options={{
							actionsColumnIndex: -1,
							headerStyle: {
								backgroundColor: Pal.palette.primary.main,
								color: "#fff",
								fontWeight: "bold",
							},
							exportButton: false,
							search: false,
							paging: false,
						}}
					/>
				</Grid>
				<Grid item xs={12} md={4}>
					<Paper style={{ padding: 16 }}>
						<Chart
							options={CategoryWiseStats.options}
							series={CategoryWiseStats.series}
							type="polarArea"
						/>
					</Paper>
					<Paper style={{ padding: 16, marginTop: 30 }}>
						<Chart
							options={barChart.options}
							series={barChart.series}
							type="bar"
						/>
					</Paper>
				</Grid>
			</Grid>
		</div>
	);

	return result;
};

export default VendorAnalytics;
