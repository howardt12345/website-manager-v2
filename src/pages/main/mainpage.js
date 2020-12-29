import React, { Component } from 'react';
import { signOut, moveFirebaseFile } from '@firebase-api'
import { MainConsumer, ThemeToggleConsumer } from '@api';
import { 
  Box,
  Button,
  Grid,
  IconButton,
  Link,
  Typography
} from '@material-ui/core';
import { Brightness7, Brightness3 } from '@material-ui/icons'
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
  },
  toggleButton: {
    marginBottom: theme.spacing(1),
  },
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
                    Portfolio (Old)
                  </Link>
                </Grid>
                <Grid item>
                  <Link 
                    href="#" 
                    onClick={() => {
                      maincontext.setPage('photos');
                    }} 
                    color="inherit"
                  >
                    Photos
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
              <IconButton 
                className={classes.toggleButton} 
                color ='inherit'
                onClick={themeContext.toggleTheme}
              >
                {themeContext.dark ? <Brightness3 /> : <Brightness7 />}
              </IconButton>
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