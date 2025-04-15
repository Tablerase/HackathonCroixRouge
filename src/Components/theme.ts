import { createTheme } from "@mui/material/styles";

// Create a theme
export const theme = createTheme({
  palette: {
    primary: {
      main: "#c62828", // Darker red color for Croix-Rouge theme
      light: "#ff8a80", // Lighter red color for Croix-Rouge theme
    },
    secondary: {
      main: "#212121", // Darker secondary color
    },
    background: {
      default: "#e0e0e0", // Slightly darker background
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent white
          backdropFilter: "blur(5px)",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          margin: "8px",
          "&:hover": {
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "8px",
          "&:last-child": {
            paddingBottom: "0px",
          },
        },
      },
    },
  },
});
