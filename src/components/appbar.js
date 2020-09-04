import React, { Component } from 'react'
import { MainConsumer, ThemeToggleConsumer } from '@api';
import {
  AppBar,
  Grid,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { ArrowBack, Brightness3, Brightness7 } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  nav: {
    justifyContent: 'center',
  },
  link: {

  },
}));

class MainAppBar extends Component {

  render() {
    const classes = this.props.classes;

    return (
      <MainConsumer>
       {maincontext => (
        <div height='56px'>
          <AppBar position='fixed' color='default' elevation={0}>
            <Toolbar>
              <IconButton 
              edge="start" 
              className={classes.menuButton} 
              color="inherit" 
              onClick={() => {
                maincontext.setPage('index');
              }} 
              >
                <ArrowBack />
              </IconButton>
              <Grid container className={classes.nav} spacing={6}>
                <Grid item>
                  <Typography>
                    <Link 
                    href="#" 
                    onClick={() => {
                      maincontext.setPage('portfolio');
                    }} 
                    color="inherit"
                    >
                      Portfolio
                    </Link>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography>
                    <Link 
                    href="#" 
                    onClick={() => {
                      maincontext.setPage('messages');
                    }} 
                    color="inherit"
                    >
                      Messages
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
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
            </Toolbar>
          </AppBar>
        </div>
       )} 
      </MainConsumer>
    )
  }
}

export default () => {
  const classes = useStyles();
  return (
    <MainAppBar classes={classes} />
  )
}