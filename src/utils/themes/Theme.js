import { createMuiTheme } from "@material-ui/core/styles";

//Palette the colors
const colorPrimary = "#E68859";
const colorSecondary = "#F6DBC9";
const colorBlack = "#3C3C3B";

const baseTheme = createMuiTheme({
  overrides: {
    MUIRichTextEditor: {
      root: {
        marginTop: 10,
      },
      editorContainer: {
        boxShadow:
          "0px 0px 2px rgba(52,58,67,0.10), 0px 1px 2px rgba(52,58,67,0.08), 0px 1px 4px rgba(52,58,67,0.08)",
        borderRadius: "8px",
        padding: "11.5px 14px",
      },
      hidePlaceholder: {
        display: "block !important",
      },
    },
    MuiPaper: {
      rounded: {
        border: "none",
        boxShadow: "0px 0px 1px rgba(52,58,67,0.75)",
      },
    },
    MuiFormLabel: {
      root: {
        transition: "color 150ms cubic-bezier(0.4, 0, 1, 1)",
      },
    },
    MuiFormControl: {
      marginNormal: {
        marginTop: "8px",
      },
      root: {
        width: "100%",
      },
    },
    WAMuiChipInput: {
      inputRoot: {
        padding: "0 14px !important",
        boxShadow:
          "0px 0px 2px rgba(52,58,67,0.10), 0px 1px 2px rgba(52,58,67,0.08), 0px 1px 4px rgba(52,58,67,0.08)",
      },
      chip: {
        marginTop: "8px !important",
      },
      input: {
        boxShadow: "none !important",
        padding: "11.5px 14px !important",
        paddingLeft: "0 !important",
        height: "17px !important",
        marginTop: "0",
      },
    },
    MuiLink: {
      root: {
        fontWeight: "700",
        "&:focus": {
          outlineColor: "#266678",
        },
      },
    },
  },
  palette: {
    type: "light",
    primary: {
      light: colorPrimary,
      main: colorPrimary,
      dark: colorPrimary,
      contrastText: "#ffffff",
    },
    secondary: {
      light: colorSecondary,
      main: colorSecondary,
      dark: colorBlack,
    },
    black: {
      light: colorBlack,
      main: colorBlack,
      dark: "#ffffff",
    },
    error: {
      light: "#d49494",
      main: "#cb7c7a",
      dark: "#a26362",
    },
    warning: {
      light: "#dab47d",
      main: "#cda35f",
      dark: "#b99356",
    },
    success: {
      light: "#73baa9",
      main: "#48ac98",
      dark: "#3a8a7a",
    },
    text: {
      primary: "#0f2930",
      secondary: "#53627c",
      disabled: "#a6aebc",
      hint: "#a6aebc",
    },
    background: {
      paper: "#ffffff",
      default: "#ffffff",
    },
  },
  shadows: ["none", "0px 10px 15px rgba(145, 158, 171, 0.05)"],
  typography: {
    fontFamily: [
      '"Be Vietnam"',
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    h1: {
      fontWeight: "600",
    },
    h2: {
      fontWeight: "700",
    },
    h3: {
      fontWeight: "700",
    },
    h4: {
      fontWeight: "700",
    },
    h5: {
      fontWeight: "700",
    },
    h6: {
      fontWeight: "700",
    },
    button: {
      textTransform: "none",
      fontWeight: "bold",
    },
  },
  shape: {
    borderRadius: 8,
  },
  MuiAvatar: {
    background: colorPrimary,
  },
});

const defaultTheme = createMuiTheme({
  ...baseTheme,
  themeColor: "#3C3C3B",
  themeColorSoft: "#F3F3F3",
  themeColorStrong: "#BB592E",
  palette: {
    ...baseTheme.palette,
    primary: {
      ...baseTheme.palette.primary,
      light: "#3C3C3B",
      main: "#3C3C3B",
      dark: "#3C3C3B",
    },
    secondary: {
      ...baseTheme.palette.secondary,
      light: "#F3F3F3",
      main: "#F3F3F3",
      dark: "#3C3C3B",
    },
    black: {
      ...baseTheme.palette.black,
      light: "#3C3C3B",
      main: "#3C3C3B",
      dark: "#ffffff",
    },
  },
});

const medicalTheme = createMuiTheme({
  ...baseTheme,
  themeColor: "#6295FA",
  themeColorSoft: "#dfeafe",
  themeColorStrong: "#4959A2",
  palette: {
    ...baseTheme.palette,
    primary: {
      ...baseTheme.palette.primary,
      light: "#6295FA",
      main: "#6295FA",
      dark: "#6295FA",
    },
    secondary: {
      ...baseTheme.palette.secondary,
      light: "#dfeafe",
      main: "#dfeafe",
      dark: "#3C3C3B",
    },
    black: {
      ...baseTheme.palette.black,
      light: "#4959A2",
      main: "#4959A2",
      dark: "#ffffff",
    },
  },
});

const trainerTheme = createMuiTheme({
  ...baseTheme,
  themeColor: "#E68859",
  themeColorSoft: "#F6DBC9",
  themeColorStrong: "#E68859",
  palette: {
    ...baseTheme.palette,
    primary: {
      ...baseTheme.palette.primary,
      light: "#E68859",
      main: "#E68859",
      dark: "#E68859",
    },
    secondary: {
      ...baseTheme.palette.secondary,
      light: "#F6DBC9",
      main: "#F6DBC9",
      dark: "#3C3C3B",
    },
    black: {
      ...baseTheme.palette.black,
      light: "#E68859",
      main: "#E68859",
      dark: "#ffffff",
    },
  },
});

const counterTheme = createMuiTheme({
  ...baseTheme,
  themeColor: "#8D33D3",
  themeColorSoft: "#ddc2f2",
  themeColorStrong: "#89128d",
  palette: {
    ...baseTheme.palette,
    primary: {
      ...baseTheme.palette.primary,
      light: "#8D33D3",
      main: "#8D33D3",
      dark: "#8D33D3",
    },
    secondary: {
      ...baseTheme.palette.secondary,
      light: "#ddc2f2",
      main: "#ddc2f2",
      dark: "#3C3C3B",
    },
    black: {
      ...baseTheme.palette.black,
      light: "#89128d",
      main: "#89128d",
      dark: "#ffffff",
    },
  },
});

const ComercialTheme = createMuiTheme({
  ...baseTheme,
  themeColor: "#FF6978",
  themeColorSoft: "#FFE1E4",
  themeColorStrong: "#fa3e51",
  palette: {
    ...baseTheme.palette,
    primary: {
      ...baseTheme.palette.primary,
      light: "#FF6978",
      main: "#FF6978",
      dark: "#FF6978",
    },
    secondary: {
      ...baseTheme.palette.secondary,
      light: "#FFE1E4",
      main: "#FFE1E4",
      dark: "#3C3C3B",
    },
    black: {
      ...baseTheme.palette.black,
      light: "#fa3e51",
      main: "#fa3e51",
      dark: "#ffffff",
    },
  },
});

const VirtualTheme = createMuiTheme({
  ...baseTheme,
  themeColor: "#007771",
  themeColorSoft: "#B1D6C3",
  themeColorStrong: "#B1D6C3",
  palette: {
    ...baseTheme.palette,
    primary: {
      ...baseTheme.palette.primary,
      light: "#1A857F",
      main: "#1A857F",
      dark: "#1A857F",
    },
    secondary: {
      ...baseTheme.palette.secondary,
      light: "#B1D6C3",
      main: "#B1D6C3",
      dark: "#B1D6C3",
    },
    black: {
      ...baseTheme.palette.black,
      light: "#B1D6C3",
      main: "#B1D6C3",
      dark: "#B1D6C3",
    },
  },
});

const Theme = {
  defaultTheme,
  ComercialTheme,
  medicalTheme,
  trainerTheme,
  counterTheme,
  VirtualTheme,
};

export default Theme;
