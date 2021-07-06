import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    // height: "10vh",
    // marginTop: theme.spacing(2),
  },

  paper: {
    margin: theme.spacing(3, 6),
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.down(700)]: {
      margin: theme.spacing(1.8, 4),
    },
  },
}));

export default useStyles;
