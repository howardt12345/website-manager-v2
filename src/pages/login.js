import React, { Component } from 'react';
import { signIn } from '@firebase-api'
import { email, pass } from '@vars';
import { ThemeToggleConsumer } from '@api';
import { 
  Box,
  Button,
  Link,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
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
  button: {
    marginTop: theme.spacing(1),
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

class LoginPage extends Component {
  render() {
    const classes = this.props.classes;
    return (
      <ThemeToggleConsumer>
        {themeContext => (
          <ThemeProvider theme={themeContext.theme}>
            <Box className={classes.paper}>
              <Typography component="h1" variant="h2">
                Website Manager
              </Typography>
              <Typography>
                <Link href={'https://howardt12345.com'} target='_blank' rel="noopener noreferrer" color='inherit'>
                  howardt12345.com
                </Link>
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                className={classes.button}
                onClick={async () => {
                  await signIn(email, pass);
                }}
              >
                Sign In
              </Button>
              <Box className={classes.bottom}>
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
                <Copyright />
              </Box>
            </Box>
          </ThemeProvider>
        )}
      </ThemeToggleConsumer>
    );
  }
}
 
export default () => {
  const classes = useStyles();
  return (
    <LoginPage classes={classes} />
  )
}