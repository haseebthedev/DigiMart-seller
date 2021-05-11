import palette from "./palette";
import typography from "./typography";

import { createMuiTheme } from "@material-ui/core";

const myTheme = {
  ...palette,
  ...typography,
};

// eslint-disable-next-line
export default {
  default: createMuiTheme(myTheme),
};
