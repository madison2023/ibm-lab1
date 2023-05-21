import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import "@fontsource/roboto";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { pink, cyan } from "@material-ui/core/colors";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import { Typography } from "@material-ui/core";

// This overrides the default MUI theme colors.
const customTheme = createMuiTheme({
  palette: {
    primary: {
      main: cyan[500],
    },
    secondary: {
      main: pink[500],
    },
  },
});

// STYLING
const useStyles = makeStyles((theme) => ({
  grow: {
    width: "120rem",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
}));

// EXPORT
export default function TopBar() {
  const classes = useStyles();

  // RETURN
  return (
    <ThemeProvider theme={customTheme}>
      <div className={classes.grow}>
        <AppBar position="static" color="primary">
          <Toolbar>
            {/* Smiley face icon */}
            <EmojiEmotionsIcon
              edge="start"
              className={classes.menuButton}
              aria-label="open drawer"
              size="large"
            />
            {/* This is the title that appears on the bar. */}
            <Typography
              className={classes.title}
              variant="h4"
              noWrap
              style={{
                width: "auto",
                letterSpacing: "0.3rem",
                fontWeight: "bold",
                fontSize: "2rem",
              }}
            >
              WYD?
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    </ThemeProvider>
  );
}
