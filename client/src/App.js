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
					<Route path="/seller/register" exact component={Register} />
					<Route
						path="/seller/forget-password"
						exact
						component={ForgetPassword}
					/>
					<Route path="/seller/login" exact component={Login} />
					<PrivateRoute path="/seller">
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
						<Redirect to="/seller/login" />
					)
				}
			/>
		);
	}
}

export default App;
