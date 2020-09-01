import React, { Component } from 'react';
import { signOut } from '@firebase-api'
import { theme } from '@styles';
import { email, pass } from '@vars';
import { 
  Box,
  Button,
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

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © Howard Tseng '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: "center",
  },
  button: {
    marginBottom: theme.spacing(1),
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  bottom: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: "center",
    marginBottom: theme.spacing(2),
  }
}));

class MainPage extends Component {
  render() {
    const classes = this.props.classes;
    return (
      <ThemeProvider theme={muitheme}>
        <Box className={classes.paper}>
          <Typography component="h1" variant="h2">
            Website Manager
          </Typography>
          <a href={'https://howardt12345.com'} target='_blank' rel="noopener noreferrer">
            howardt12345.com
          </a>
        </Box>
        <Box className={classes.bottom}>
          <Button 
            variant="outlined" 
            color="secondary" 
            className={classes.button}
            onClick={async () => {
              await signOut();
            }}
          >
            Sign Out
          </Button>
          <Copyright />
        </Box>
      </ThemeProvider>
    );
  }
}
 
export default () => {
  const classes = useStyles();
  return (
    <MainPage classes={classes} />
  )
}