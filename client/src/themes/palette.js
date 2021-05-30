// const primary = "#090071";
// const secondary = "#FF5C93";
// const warning = "#FFC260";
// const success = "#3CD4A0";
// const info = "#9013FE";

// import { useUserContext } from "../context/UserContext";
// // context
// const { store, dispatch } = useUserContext();
// const token = store.data.token;

var mode = localStorage.getItem("THEME_MODE");
// console.log("MODE: ", mode);

const pal = {
  // palette: {
  //   primary: {
  //     main: primary,
  //   },
  // },

  palette: {
    type: mode ? mode : "light",
  },
};

export default pal;
