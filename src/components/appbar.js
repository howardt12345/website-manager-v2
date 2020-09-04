import React, { Component } from 'react'
import { MainConsumer, ThemeToggleConsumer } from '@api';
import {
  AppBar,
  Box,
  Grid,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { ArrowBack, Brightness3, Brightness7 } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'fixed',
    color: 'default',
    zIndex: theme.zIndex.drawer + 1,
    boxShadow: 'none',
  },
  nav: {
    justifyContent: 'center',
  },
  link: {

  },
}));

class MainAppBar extends Component {

  render() {
    const classes = this.props.classes;
    const page = this.props.page;

    return (
      <MainConsumer>
       {maincontext => (
        <AppBar color='default' className={classes.appBar}>
          <Toolbar variant="dense">
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
                  <Box fontWeight={ page === 'portfolio' ? 'fontWeightBold' : 'fontWeightRegular' }>
                    <Link 
                      href="#" 
                      onClick={() => {
                        if(maincontext.page !== 'portfolio') {
                          maincontext.setPage('portfolio');
                        }
                      }} 
                      color="inherit"
                    >
                      Portfolio
                    </Link>
                  </Box>
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                  <Box fontWeight={ page === 'messages' ? 'fontWeightBold' : 'fontWeightRegular' }>
                    <Link 
                      href="#" 
                      onClick={() => {
                        if(maincontext.page !== 'messages') {
                          maincontext.setPage('messages');
                        }
                      }} 
                      color="inherit"
                    >
                      Messages
                    </Link>
                  </Box>
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
       )} 
      </MainConsumer>
    )
  }
}

export default (props) => {
  const classes = useStyles();
  return (
    <MainAppBar classes={classes} {...props}/>
  )
}