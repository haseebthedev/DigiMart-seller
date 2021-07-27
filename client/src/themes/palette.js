// const primary = "#090071";
// const secondary = "#FF5C93";
// const warning = "#FFC260";
// const success = "#3CD4A0";
// const info = "#9013FE";

var mode = localStorage.getItem("THEME_MODE");

const pal = {
	palette: {
		primary: {
			light: "#ff2450",
			main: "#DC143C",
			dark: "#bd062a",
		},
		secondary: {
			light: "#BA55D3",
			main: "#9932CC",
			dark: "#9400D3",
		},
		type: mode ? mode : "light",
	},
};

export default pal;
