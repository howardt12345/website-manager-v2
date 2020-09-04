import React, { Component } from 'react';
import { theme } from '@styles';
import { MainContext } from '@api';
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
  nav: {
    justifyContent: 'center',
    marginTop: theme.spacing(1),
  },
  button: {
    marginBottom: theme.spacing(1),
  },
}));

class MessagesPage extends Component {

  static contextType = MainContext;

  render() {
    const classes = this.props.classes;

    const { setPage } = this.context

    return (
      <ThemeProvider theme={muitheme}>
        <Box className={classes.paper}>
          <Typography component="h1" variant="h2">
            Messages Page
          </Typography>
          <a href={'https://howardt12345.com'} target='_blank' rel="noopener noreferrer">
            howardt12345.com
          </a>
          <Grid container className={classes.nav} spacing={6}>
          <Grid item>
            <Link 
            href="#" 
            onClick={() => {
              setPage('portfolio');
            }} 
            color="inherit"
            >
              Portfolio
            </Link>
          </Grid>
          <Grid item>
            <Link 
            href="#" 
            onClick={() => {
              setPage('index');
            }} 
            color="inherit"
            >
              Main
            </Link>
          </Grid>
        </Grid>
        </Box>
      </ThemeProvider>
    );
  }
}
 
export default () => {
  const classes = useStyles();
  return (
    <MessagesPage classes={classes} />
  )
}