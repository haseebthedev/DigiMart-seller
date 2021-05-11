import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider, CssBaseline } from "@material-ui/core";

import App from "./components/App.js";
import Themes from "./themes";

ReactDOM.render(
  <ThemeProvider theme={Themes.default}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);
