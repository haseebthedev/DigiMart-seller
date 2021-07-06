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
  avatar: {
    width: 50,
    height: 50,
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(2, 0, 2),
  },
}));

export default useStyles;
