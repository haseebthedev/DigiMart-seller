import React, { useState, useEffect } from "react";
import api from "../../../Axios/api";

import { Box, Grid, Paper } from "@material-ui/core";

// icons
import FeaturedVideoIcon from "@material-ui/icons/FeaturedVideo";
import LocalAtmIcon from "@material-ui/icons/LocalAtm";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";

import { useUserContext } from "../../../context/UserContext";
// import useStyles from "./styles";
import Chart from "react-apexcharts";

// Widgets
import CountCard from "../../AnalyticsWidget/CountCard";
// import GeoLocSales from "../../AnalyticsWidget/GeoLocSales";

const BusinessAnalytics = () => {
	// const classes = useStyles();

	// context
	const { store } = useUserContext();
	const token = store.data.token;

	const [salesData, setSalesData] = useState([]);
	const [categoryData, setCategoryData] = useState([]);
	// const [salesData, setSalesData] = useState([
	// 	{
	// 		date: "2021-08-12T07:02:11.212Z",
	// 		orders: 53,
	// 	},
	// 	{
	// 		date: "2021-08-12T07:03:11.212Z",
	// 		orders: 26,
	// 	},
	// 	{
	// 		date: "2021-08-12T07:04:11.212Z",
	// 		orders: 73,
	// 	},
	// 	{
	// 		date: "2021-08-12T07:05:11.212Z",
	// 		orders: 51,
	// 	},
	// 	{
	// 		date: "2021-08-12T07:06:11.212Z",
	// 		orders: 61,
	// 	},
	// ]);

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
			colors: ["#DC143C"],
			fill: {
				colors: ["#DC143C"],
			},
			chart: {
				type: "line",
				zoom: {
					type: "x",
				},
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
			},
		},
	};

	var CategoryWiseStats = {
		series: Object.values(categoryData),
		options: {
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
			},
			labels: ["Delivered", "Cancelled", "Pending", "Active", "Returned"],
			fill: {
				opacity: 1,
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

	const [StatsCount, setStatsCount] = useState({
		stock: "1234",
		investment: "4321",
		revenue: "1123",
		profit: "9876",
	});

	const getStats = async () => {
		await api
			.get("/seller/store/analytics", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				// let stock = res.data.data.productsAnalytics.totalStock;
				// let investment = res.data.data.productsAnalytics.totalPurchasePrice;
				// let revenue = res.data.data.ordersAnalytics.totalRevenue;
				// let profit = res.data.data.ordersAnalytics.totalProfit;
				setStatsCount({ ...StatsCount, stock: 112233 });

				// PieChart
				let AllCounts = res.data.data.allCounts;
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
		getStats();
		// eslint-disable-next-line
	}, []);

	return (
		<Box>
			<Grid
				container
				spacing={4}
				justify="space-between"
				style={{ marginBottom: 16 }}
			>
				<Grid item xs={12} md={3}>
					<CountCard
						title="PRODUCT STOCK"
						count={StatsCount.stock}
						icon={<FeaturedVideoIcon style={{ fontSize: 50 }} />}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<CountCard
						title="TOTAL INVESTMENT"
						count={"$" + StatsCount.investment}
						icon={<LocalAtmIcon style={{ fontSize: 50 }} />}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<CountCard
						title="TOTAL REVENUE"
						count={"$" + StatsCount.revenue}
						icon={<WhatshotIcon style={{ fontSize: 50 }} />}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<CountCard
						title="TOTAL PROFIT"
						count={"$" + StatsCount.profit}
						icon={
							<AccountBalanceWalletIcon
								style={{ fontSize: 50 }}
							/>
						}
					/>
				</Grid>
			</Grid>
			<Grid container spacing={4}>
				<Grid item xs={12} md={7}>
					<Paper style={{ padding: 16 }}>
						<Chart
							options={SalesStats.options}
							series={SalesStats.series}
							type="area"
						/>
					</Paper>
				</Grid>
				<Grid item xs={12} md={5}>
					<Paper style={{ padding: 16 }}>
						<Chart
							options={CategoryWiseStats.options}
							series={CategoryWiseStats.series}
							type="polarArea"
						/>
					</Paper>
				</Grid>
			</Grid>
			{/* <Grid container>
				<Grid item xs={12}>
					<Paper style={{ padding: 16 }}>
						<GeoLocSales />
					</Paper>
				</Grid>
			</Grid> */}
		</Box>
	);
};

export default BusinessAnalytics;
