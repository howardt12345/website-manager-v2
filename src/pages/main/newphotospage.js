import React, { Component, useState } from 'react';
import { MainAppBar } from '@components';
import { 
  Box,
  CircularProgress,
  CssBaseline,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { fromFirestoreNew } from '@api';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    component: 'div',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: "center",
    overflow: 'hidden',
    minHeight: '95vh',
  },
}));


class NewPhotosPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      manager: null,
    }
    this.initializeManager();
  }

  initializeManager = async () => {
    console.log('initializing manager...');
    const m = await fromFirestoreNew();
    this.setState({
      manager: m,
      loaded: true,
    });
  }

  render() {
    const classes = this.props.classes;

    return (
      <div classes={classes.root}>
        <MainAppBar page='photos'/>
        <div>
          {this.state.loaded 
          ? (<div>

            </div>
          ) : (
              <div className={classes.paper}>
                <CircularProgress color='primary'/>
                <Box m={1} />
                <Typography variant='h5'>
                  Loading...
                </Typography>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default () => {
  const classes = useStyles();
  return (
    <NewPhotosPage classes={classes} />
  )
}