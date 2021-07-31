import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

// components
import Layout from "./Components/Layout/Layout";
import ForgetPassword from "./Components/Pages/ForgetPassword/ForgetPassword";
import Login from "./Components/Pages/Login/Login";
import Register from "./Components/Pages/Register/Register";

// context
import { useUserContext } from "./context/UserContext";
import "./App.css";

function App() {
	const { store } = useUserContext();

	return (
		<BrowserRouter>
			<div className="App">
				<Switch>
					<Route path="/vendor/register" exact component={Register} />
					<Route
						path="/vendor/forget-password"
						exact
						component={ForgetPassword}
					/>
					<Route path="/vendor/login" exact component={Login} />
					<PrivateRoute path="/vendor">
						<Layout />
					</PrivateRoute>
				</Switch>
			</div>
		</BrowserRouter>
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
						<Redirect to="/vendor/login" />
					)
				}
			/>
		);
	}
}

export default App;
