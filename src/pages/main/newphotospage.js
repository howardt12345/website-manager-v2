import React, { Component, useState, useCallback } from 'react';
import { 
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Fab,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { 
  Add,
  DeleteForever,
  Refresh,
} from '@material-ui/icons/';
import { makeStyles } from '@material-ui/core/styles';
import Gallery from "react-photo-gallery";

import { ImageMasonry, MainAppBar } from '@components';
import { PhotoTile } from '@components/portfolio';
import { fromFirestoreNew, getUrlsFor } from '@api';

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
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
    boxShadow: 'none',
    color: 'primary',
  },
  iconButton: {
    margin: theme.spacing(0, 1),
  },
}));


class NewPhotosPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      manager: null,
      deleteDialog: false,
      selected: new Set(),
    }

    
    this.clickCount = 0;
    this.singleClickTimer = '';

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

  getPhotos = () => {
    return this.state.manager.pictures.map(pic => ({
      src: pic.getUrl(),
      width: pic.width,
      height: pic.height
    }));
  }

  refresh = async () => {
    console.log('refreshing...');
    this.setState({
      loaded: false,
    });
    const m = await fromFirestoreNew();
    this.setState({
      manager: m,
      loaded: true,
    });
  }

  imageRenderer = ({index, left, top, key, photo, direction}) => (
    <PhotoTile 
      key={key}
      index={index}
      photo={photo}
      left={left}
      top={top}
      direction={direction}
      selected={false}
      onClick={() => this.singleClick(index)}
      onDoubleClick={() => this.doubleClick(index)}
    />
  )

  singleClick = (index) => {
    console.log(`single clicked on ${index}`);
  }

  doubleClick = (index) => {
    console.log(`double clicked on ${index}`);
    if(!this.state.selected.has(index)) {
      var tmp = this.state.selected;
      tmp.add(index);
      this.setState({
        selected: tmp
      });
    } else {      
      var tmp = this.state.selected;
      tmp.delete(index);
      this.setState({
        selected: tmp
      });
    }
  }

  handleClose = () => {
    this.setState({
      deleteDialog: false,
    });
  }

  onDelete = () => {
    this.setState({ deleteDialog: true});
  }

  DeleteDialog = (props) => {
    const { onClose, onConfirm } = props;

    return (
      <div>
        <DialogTitle id="alert-dialog-title">{`Delete selected photos?`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Are you sure you want to delete the selected photos? This action cannot be undone.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => { onConfirm(); onClose(); }} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </div>
    );
  }

  render() {
    const classes = this.props.classes;

    return (
      <div classes={classes.root}>
        <MainAppBar page='photos'/>
        <div>
          {this.state.loaded 
          ? (<main className={classes.content}>
              <Toolbar variant="dense"/>
              <div>
                <Box display="flex" flexDirection='row'>
                  <Box flexGrow={1} justifyContent="flex-start">
                    <Typography variant="h3" display="inline">
                      {"Photos"}
                    </Typography>
                  </Box>
                  <IconButton
                    className={classes.iconButton}
                    onClick={() => {
                      this.refresh();
                    }}
                    >
                    <Refresh />
                  </IconButton>
                  {this.state.selected.size !== 0 ? (<Tooltip title='Delete'>
                    <IconButton
                      className={classes.iconButton}
                      onClick={() => {
                        this.onDelete();
                      }}
                      >
                      <DeleteForever />
                    </IconButton>
                  </Tooltip>) : (<div />)}
                </Box>
                <Box m={2}/>
                <Gallery 
                  photos={this.getPhotos()} 
                  direction={"column"}
                  renderImage={this.imageRenderer}
                />
              </div>
              <Fab 
                className={classes.fab}
                variant="extended"
                onClick={() => {
                }}
              >
                <Add className={classes.extendedIcon} />
                {`Add${this.state.subcategory === 0 ? '...' : ' Photo'}`}
              </Fab>
              <Dialog open={this.state.deleteDialog} onClose={this.handleClose}>
                <this.DeleteDialog 
                  onClose={this.handleClose}
                  onConfirm={async () => {
                    var pictures = [];

                    this.state.selected.forEach(i => {
                      pictures.push(this.state.manager.pictures[i].name);
                    })
                    pictures.forEach(async pic => {
                      await this.state.manager.deletePhoto(pic);
                    })
                    this.state.selected.clear();
                    this.refresh();
                  }}
                />
              </Dialog>
            </main>
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