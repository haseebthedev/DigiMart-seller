import React, { useState } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

// components
import Layout from "./Components/Layout/Layout";
import ForgetPassword from "./Components/Pages/ForgetPassword/ForgetPassword";
import NewPassword from "./Components/Pages/ForgetPassword/NewPassword";
import Login from "./Components/Pages/Login/Login";
import Register from "./Components/Pages/Register/Register";

// context
import { useUserContext, updateProfile } from "./context/UserContext";
import "./App.css";

// For Switch Theming
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import theme from "./themes/index";

function App() {
	var { store, dispatch } = useUserContext();
	const { isDarkModeEnabled } = false;

	// dark mode
	const [darkState, setDarkState] = useState(
		isDarkModeEnabled !== undefined ? isDarkModeEnabled : false
	);
	const palletType = darkState ? "dark" : "light";

	const darkTheme = createMuiTheme({
		...theme,
		palette: {
			primary: {
				light: "#ff2450",
				main: "#DC143C",
				dark: "#bd062a",
			},
			// secondary: {
			// 	light: "#BA55D3",
			// 	main: "#9932CC",
			// 	dark: "#9400D3",
			// },
			type: palletType,
		},
		typography: {
			fontFamily: "poppins, Arial",
			h1: {
				fontSize: "1.6rem",
			},
			h2: {
				fontSize: "1.4rem",
			},
			h3: {
				fontSize: "1.3rem",
			},
			h4: {
				fontSize: "1.2rem",
			},
			h5: {
				fontSize: "1rem",
			},
			h6: {
				fontSize: "0.8rem",
			},
			body1: {
				fontSize: "0.95rem",
			},
		},
	});

	const handleThemeChange = () => {
		setDarkState(!darkState);

		// updating darkMode state in context
		var token = store.data.token;
		const oldData = store.data.data;
		const newData = { ...oldData, isDarkModeEnabled: !darkState };
		updateProfile(dispatch, newData, token);
	};

	return (
		<ThemeProvider theme={darkTheme}>
			<BrowserRouter>
				<div className="App">
					<Switch>
						<Route
							path="/seller/register"
							exact
							component={Register}
						/>
						<Route
							path="/seller/forget-password"
							exact
							component={ForgetPassword}
						/>
						<Route
							path="/seller/set-password"
							component={NewPassword}
						/>
						<Route path="/seller/login" exact component={Login} />
						<PrivateRoute path="/seller">
							<Layout
								darkState={darkState}
								handleThemeChange={handleThemeChange}
							/>
						</PrivateRoute>
					</Switch>
				</div>
			</BrowserRouter>
		</ThemeProvider>
	);

	// HOC for Auth routes
	function PrivateRoute({ children, ...rest }) {
		return (
			<Route
				{...rest}
				render={() =>
					store.isAuthenticated ? (
						children
					) : (
						<Redirect to="/seller/login" />
					)
				}
			/>
		);
	}
}

export default App;
