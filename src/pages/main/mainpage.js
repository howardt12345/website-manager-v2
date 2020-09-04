import React, { Component } from 'react';
import { signOut } from '@firebase-api'
import { MainConsumer, ThemeToggleConsumer } from '@api';
import { 
  Box,
  Button,
  Grid,
  Link,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
const _ = require('lodash');

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
    component: 'div',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: "center",
    overflow: 'hidden',
    minHeight: '95vh',
  },
  nav: {
    justifyContent: 'center',
    marginTop: theme.spacing(1),
  },
  button: {
    marginBottom: theme.spacing(1),
  },
  bottom: {
    display: 'flex',
    position: 'absolute',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: "center",
    bottom: theme.spacing(2),
    left: '0',
    right: '0',
  }
}));

class MainPage extends Component {

  render() {
    const classes = this.props.classes;
    return (
      <Box className={classes.paper}>
        <Typography component="h1" variant="h2">
          Website Manager
        </Typography>
        <Typography>
          <Link href={'https://howardt12345.com'} target='_blank' rel="noopener noreferrer" color='inherit'>
            howardt12345.com
          </Link>
        </Typography>
        <Typography>
          <MainConsumer> 
            {maincontext => (
              <Grid container className={classes.nav} spacing={6}>
                <Grid item>
                  <Link 
                  href="#" 
                  onClick={() => {
                    maincontext.setPage('portfolio');
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
                    maincontext.setPage('messages');
                  }} 
                  color="inherit"
                  >
                    Messages
                  </Link>
                </Grid>
              </Grid>
            )}
          </MainConsumer>
        </Typography>
        <Box className={classes.bottom}>
          <ThemeToggleConsumer>
            {themeContext => (
              <Button 
                variant="outlined" 
                color="primary" 
                className={classes.button}
                onClick={() => {
                  themeContext.toggleTheme();
                }}
              >
                Toggle Theme
              </Button>
            )}
          </ThemeToggleConsumer>
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
      </Box>
    );
  }
}
 
export default () => {
  const classes = useStyles();
  return (
    <MainPage classes={classes} />
  )
}