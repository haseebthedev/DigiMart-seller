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
      fontSize: "2rem",
    },
    h2: {
      fontSize: "1.8rem",
    },
    h3: {
      fontSize: "1.6rem",
    },
    h4: {
      fontSize: "1.4rem",
    },
    h5: {
      fontSize: "1.2rem",
    },
    h6: {
      fontSize: "1rem",
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "@font-face": [poppins],
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
