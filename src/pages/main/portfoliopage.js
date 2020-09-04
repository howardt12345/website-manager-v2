import React, { Component } from 'react';
import { theme } from '@styles';
import { MainAppBar } from '@components'
import { 
  Box,
  Button,
  Grid,
  Link,
  Typography
} from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
const _ = require('lodash');

const { colors, } = theme;

const muitheme = createMuiTheme({
  palette: {
    primary: {
      main: colors.accent
    },
  },
});

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: "center",
  },
}));

class PortfolioPage extends Component {

  render() {
    const classes = this.props.classes;

    return (
      <ThemeProvider theme={muitheme}>
        <Box className={classes.paper}>
          <MainAppBar />
          <Typography component="h1" variant="h2">
            Portfolio Page
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }
}
 
export default () => {
  const classes = useStyles();
  return (
    <PortfolioPage classes={classes} />
  )
}