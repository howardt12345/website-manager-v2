import React, { Component, Fragment } from 'react';
import { MainAppBar } from '@components'
import { 
  Box,
  Button,
  Grid,
  Link,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
const _ = require('lodash');

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
}));

class MessagesPage extends Component {

  render() {
    const classes = this.props.classes;

    return (
      <Fragment>
        <MainAppBar />
        <Box className={classes.paper}>
          <Typography component="h1" variant="h2">
            Messages Page
          </Typography>
        </Box>
      </Fragment>
    );
  }
}
 
export default () => {
  const classes = useStyles();
  return (
    <MessagesPage classes={classes} />
  )
}