import React, { Component } from 'react';
import { 
  Box,
  Button,
  CircularProgress,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Fab,
  IconButton,
  Snackbar,
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
import MuiAlert from '@material-ui/lab/Alert';

import Gallery from "react-photo-gallery";
import { DropzoneDialog } from 'material-ui-dropzone'
import uuid from 'react-uuid'
import EXIF from "exif-js";

import { MainAppBar } from '@components';
import { PhotoTile } from '@components/portfolio';
import { fromFirestoreNew, Picture } from '@api';
import { nearestNormalAspectRatio, replaceAll } from '@utils';

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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class NewPhotosPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      manager: null,
      uploadDialog: false,
      uploading: false,
      failed: false,
      snackbar: false,
      imageDialog: false,
      imageIndex: 0,
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

  singleClick = (index) => {
    console.log(`single clicked on ${index}`);
    this.setState({
      imageDialog: true,
      imageIndex: index,
    });
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

  closeSnackbar = () => {
    this.setState({
      snackbar: false,
    });
  }


  async handleSave(files) {
    this.setState({
      uploadDialog: false,
      loading: true,
      uploading: true,
    });
    let file = files[0];
    let filename = file.name;
    let manager = this.state.manager;

    let finishLoading = () => this.setState({
      loading: false,
      uploading: false,
      snackbar: true,
    });
    let error = () => this.setState({
      failed: true,
    });
    let refresh = this.refresh;

    var fr = new FileReader();

    fr.onload = () => {
      var img = new Image();
      img.onload = async () => {
        var width = img.width;
        var height = img.height;

        var aspectRatio = nearestNormalAspectRatio(width/height);

        EXIF.getData(file, async function() {
          var exifData = EXIF.pretty(this);
          if (exifData) {
            var rawTime = EXIF.getTag(this, "DateTimeOriginal");
            var time = replaceAll(rawTime.split(" ")[0], ":", "-") + " " + rawTime.split(" ")[1];

            var ext = filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;

            var pic = new Picture(time, `"${replaceAll(uuid(), "-", "")}.${ext}",${aspectRatio.width},${aspectRatio.height}`);
            
            var uploaded = await manager.addPhoto(pic, file);
            if(!uploaded) {
              error();
            }

            finishLoading();
            refresh();
          } else {
            console.log("No EXIF data found in image '" + file.name + "'.");
          }
        });
      }
      img.src = fr.result;
    }

    fr.readAsDataURL(file);
  }

  handleClose = () => {
    this.setState({
      uploadDialog: false,
      imageDialog: false,
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
          {this.state.loaded || this.state.uploading
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
                {this.state.manager.pictures.length !== 0 ? (<Gallery 
                  photos={this.getPhotos()} 
                  direction={"column"}
                  renderImage={({index, left, top, key, photo, direction}) => (
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
                  )}
                />) : (<div />)}
              </div>
              <Fab 
                className={classes.fab}
                variant="extended"
                onClick={() => {
                  this.setState({
                    uploadDialog: true
                  });
                }}
              >
                <Add className={classes.extendedIcon} />
                {`Add${this.state.subcategory === 0 ? '...' : ' Photo'}`}
              </Fab>
              <DropzoneDialog
                open={this.state.uploadDialog}
                onSave={this.handleSave.bind(this)}
                acceptedFiles={['image/*']}
                showPreviews={true}
                maxFileSize={500000}
                filesLimit={1}
                onClose={this.handleClose.bind(this)}
              />
              {this.state.manager.pictures.length !== 0 && (
                <Dialog
                  open={this.state.imageDialog} 
                  onClose={this.handleClose} 
                  maxWidth={(this.state.manager.pictures[this.state.imageIndex].width
                    /this.state.manager.pictures[this.state.imageIndex].height) > 1 ? "md" : "sm"}
                >
                  <DialogContent>
                    <img 
                      src={this.state.manager.pictures[this.state.imageIndex].getUrl()}
                      alt={this.state.manager.pictures[this.state.imageIndex].getUrl()}
                      width='100%'
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
              )}
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

              <Snackbar open={this.state.snackbar && !this.state.failed} autoHideDuration={3000} onClose={this.closeSnackbar.bind(this)}>
                <Alert onClose={this.closeSnackbar.bind(this)} severity="success">
                  Uploaded files successfully.
                </Alert>
              </Snackbar>
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