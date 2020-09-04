import React, { Component } from 'react';
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: "center",
  },
}));

class PortfolioPage extends Component {

  render() {
    const classes = this.props.classes;

    return (
      <Box className={classes.paper}>
        <MainAppBar />
        <Typography component="h1" variant="h2">
          Portfolio Page
        </Typography>
      </Box>
    );
  }
}
 
export default () => {
  const classes = useStyles();
  return (
    <PortfolioPage classes={classes} />
  )
}