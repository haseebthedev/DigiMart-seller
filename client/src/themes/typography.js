import PoppinsRegular from "./fonts/Poppins-Regular.ttf";

const poppins = {
	fontFamily: "Poppins",
	fontWeight: 400,
	src: `
     local('Poppins'),
     local('Poppins-Regular'),
     url(${PoppinsRegular}) format('ttf')
   `,
};

const typo = {
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
	},
	overrides: {
		MuiCssBaseline: {
			"@global": {
				"@font-face": [poppins],
				"*": {
					"scrollbar-width": "thin",
				},

				"*::-webkit-scrollbar": {
					width: "4px",
					height: "4px",
				},
			},
		},
		MuiListItem: {
			root: {
				"&$selected": {
					// color: colors.blue[500],
					backgroundColor: "rgba(248, 248, 248, .3)",
				},
				// "&$hover": {
				//   // color: colors.blue[500],
				//   backgroundColor: "rgba(248, 248, 248, .3)",
				// },
			},
		},
	},
};

export default typo;
