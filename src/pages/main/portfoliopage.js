import React, { Component, useState, useRef, useEffect } from 'react';
import { MainAppBar, ImageMasonry } from '@components'
import { fromFirestore, getUrlsFor } from '@api';
import { 
  Box,
  Button,
  CircularProgress,
  Collapse,
  Divider,
  Drawer, 
  Fab,
  Grid,
  IconButton,
  Link,
  List, ListItem, ListItemSecondaryAction, ListItemText,
  Toolbar,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { 
  Add,
  Edit,
  DeleteForever,
  ExpandLess, ExpandMore,

} from '@material-ui/icons/';
import { makeStyles } from '@material-ui/core/styles';
const _ = require('lodash');

const drawerWidth = 240;

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
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    marginLeft: drawerWidth,
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
  nested: {
    paddingLeft: theme.spacing(4),
  },
  iconButton: {
    margin: theme.spacing(0, 1),
  },
}));

const NestedList = (props) => {
  const { classes, name, elements, onOpen, onSelect } = props;
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
    if(!open && onOpen) {
      props.onOpen();
    }
  };

  return (
    <div>
      <ListItem button onClick={handleClick} key={`${name}/title`}>
        <ListItemText primary={name} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>      
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {elements.map((e, index) => (
            <ListItem 
              key={`${name}/${e}/tile`}
              button 
              className={classes.nested} 
              onClick={() => {
                onSelect(index);
              }}
            >
              <ListItemText primary={e === 'icon' ? 'All' : e} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </div>
  );
}

const useContainerDimensions = myRef => {
  const getDimensions = () => ({
    width: myRef.current.offsetWidth,
    height: myRef.current.offsetHeight
  })

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getDimensions())
    }

    if (myRef.current) {
      setDimensions(getDimensions())
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [myRef])

  return dimensions;
};

const Tiles = (props) => {
  const componentRef = useRef();
  const { width } = useContainerDimensions(componentRef);
  
  return (
    <div ref={componentRef}>
      {width
      ? (
        <ImageMasonry 
          numCols={width/300}
          containerWidth={'100%'}
          forceOrder={true}
          animate={true}
          imageUrls={getUrlsFor(props.data)}
          onClick={(index) => {
            props.onClick(index);
          }}
        />
      ) : (
        <div></div>
      )}
    </div>
  )
}

class PortfolioPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      manager: null,
      loaded: false,
      category: 0,
      subcategory: 0,
    };
    this.initializeManager();
  }

  initializeManager = async () => {
    console.log('initializing manager...');
    const m = await fromFirestore();
    this.setState({
      manager: m,
      loaded: true,
    });
  }

  render() {
    const classes = this.props.classes;

    return (
      <div classes={classes.root}>
        <MainAppBar page='portfolio'/>
        <div>
          {this.state.loaded
          ? (
            <div>
              <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                  paper: classes.drawerPaper,
                }}
              >
                <Toolbar variant="dense"/>
                <div className={classes.drawerContainer}>
                  <List>
                    <ListItem>
                      <ListItemText>
                        <Typography variant='h5'>
                          Categories
                        </Typography>
                      </ListItemText>
                      <ListItemSecondaryAction>
                        <IconButton edge='end' onClick={() => {}}>
                          <Add />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                  <Divider />
                  <List>
                    {this.state.manager.getCategoriesCapitalized().map((category, index) => (
                      <NestedList 
                        key={`${category}/nestedlist`}
                        classes={classes} 
                        name={category}
                        elements={this.state.manager.getSubcategoriesAt(category)}
                        onSelect={(i) => {
                          this.setState({
                            category: index,
                            subcategory: i,
                          });
                        }}
                        onOpen={() => {
                          this.setState({
                            category: index,
                            subcategory: 0,
                          });
                        }}
                      />
                    ))}
                  </List>
                </div>
              </Drawer>
              <main className={classes.content}>
                <Toolbar variant="dense"/>
                <Box display="flex" flexDirection='row'>
                  <Box flexGrow={1} justifyContent="flex-start">
                    <Typography variant="h3" display="inline">
                      {this.state.manager.getCategory(this.state.category)}
                    </Typography>
                    <Typography variant="h4" display="inline">
                      {`: ${this.state.manager.getSubcategoryFrom(this.state.category, this.state.subcategory)}`}
                    </Typography>
                  </Box>
                  <Box flexDirection='row'>
                    <Tooltip title='Edit'>
                      <IconButton
                        className={classes.iconButton}
                        onClick={() => {

                        }}
                        >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Delete'>
                      <IconButton
                        className={classes.iconButton}
                        onClick={() => {
                          
                        }}
                        >
                        <DeleteForever />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Tiles 
                  data={this.state.manager.getPicturesQuery(`${this.state.manager.getCategory(this.state.category)}/${this.state.manager.getSubcategoryFrom(this.state.category, this.state.subcategory)}`)} 
                  onClick={(index) => {
                    console.log(index);
                  }}
                />
                <Fab 
                  className={classes.fab}
                  variant="extended"
                  onClick={() => {

                  }}
                >
                  <Add className={classes.extendedIcon} />
                  {`Add${this.state.subcategory === 0 ? '...' : ' Photo'}`}
                </Fab>
              </main>
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
    <PortfolioPage classes={classes} />
  )
}