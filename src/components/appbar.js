import React, { Component } from 'react'
import { MainConsumer } from '@api';
import {
  AppBar,
  Grid,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Menu } from '@material-ui/icons'
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
      <div height='56px'>
        <AppBar position='fixed' color='default'>
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <Menu />
            </IconButton>
            <MainConsumer> 
              {maincontext => (
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
              )}
            </MainConsumer>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export default () => {
  const classes = useStyles();
  return (
    <MainAppBar classes={classes} />
  )
}