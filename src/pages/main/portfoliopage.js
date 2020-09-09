import React, { Component, useState } from 'react';
import { MainAppBar } from '@components'
import { fromFirestore } from '@api';
import { NestedList, Tiles, CategoryDialog, DeleteDialog } from '@components/portfolio';
import { 
  Box,
  Button,
  CircularProgress,
  Dialog, DialogActions, DialogContent, DialogTitle,
  Divider,
  Drawer, 
  Fab,
  Icon,
  IconButton,
  List, ListItem, ListItemSecondaryAction, ListItemText,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { 
  Add,
  Refresh,
} from '@material-ui/icons/';
import { makeStyles } from '@material-ui/core/styles';

const _ = require('lodash');

const drawerWidth = 260;

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

class PortfolioPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      manager: null,
      loaded: false,
      category: 0,
      subcategory: 0,
      addCategory: false,
      editCategory: false,
      deleteCategory: false,
      addFab: false,
    };
    this.initializeManager();
  }

  initializeManager = async () => {
    console.log('initializing manager...');
    const m = await fromFirestore();
    this.setState({
      manager: m,
      loaded: true,
      category: 0,
      subcategory: 0,
    });
  }

  CategoriesDrawer = (props) => {
    const { classes } = props;
    return (
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
                <Box flexDirection='row'>
                  <Tooltip title='Refresh'>
                    <IconButton 
                      edge='end' 
                      onClick={this.initializeManager}
                    >
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Add Category'>
                    <IconButton 
                      edge='end' 
                      onClick={() => {
                        this.setState({ addCategory: true });
                      }}
                    >
                      <Add />
                    </IconButton>
                  </Tooltip>
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
          <Divider />
          <List>
            {this.state.manager.getCategories().map((category, index) => (
              <NestedList 
                key={`${category}/nestedlist`}
                classes={classes} 
                name={category}
                icon={this.state.manager.getIconAt(category)}
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
    );
  }

  handleClose = (confirm) => {
    this.setState({
      addCategory: false,
      editCategory: false,
      deleteCategory: false,
      addFab: false,
    });
    if(confirm) {
      this.setState({
        category: 0,
        subcategory: 0,
      })
    }
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
              <this.CategoriesDrawer classes={classes}/>
              <main className={classes.content}>
                <Toolbar variant="dense"/>
                <Tiles 
                  classes={classes}
                  category={this.state.manager.getCategory(this.state.category)}
                  subcategory={this.state.manager.getSubcategoryFrom(this.state.category, this.state.subcategory)}
                  data={this.state.manager.getPicturesQuery(`${this.state.manager.getCategory(this.state.category)}/${this.state.manager.getSubcategoryFrom(this.state.category, this.state.subcategory)}`)} 
                  onClick={(index) => {
                    console.log(index);
                  }}
                  onEdit={() => {
                    this.setState({ editCategory: true});
                  }}
                  onDelete={() => {
                    this.setState({ deleteCategory: true});
                  }}
                />
                <Fab 
                  className={classes.fab}
                  variant="extended"
                  onClick={() => {
                    if (this.state.subcategory === 0) {

                    } else {

                    }
                  }}
                >
                  <Add className={classes.extendedIcon} />
                  {`Add${this.state.subcategory === 0 ? '...' : ' Photo'}`}
                </Fab>
                <Dialog open={this.state.addCategory || this.state.editCategory} onClose={this.handleClose}>
                  <CategoryDialog 
                    edit={this.state.editCategory}
                    name={this.state.editCategory ? this.state.manager.getCategory(this.state.category) : ''}
                    icon={this.state.editCategory ? this.state.manager.getIconFrom(this.state.category) : ''}
                    onClose={this.handleClose}
                    onSave={async (data) => {
                      if (this.state.editCategory) {
                        const oldName = this.state.manager.getCategory(this.state.category);
                        const oldIcon = this.state.manager.getIconFrom(this.state.category);
                        console.log(oldIcon);
                        if(oldIcon !== data.icon) {
                          await this.state.manager.changeIcon(oldName, data.icon);
                        }
                        if(oldName !== data.name) {
                          await this.state.manager.renameCategory(oldName, data.name);
                        }
                      } else {
                        await this.state.manager.addCategory(data.name, data.icon);
                      }
                    }}
                  />
                </Dialog>
                <Dialog open={this.state.deleteCategory} onClose={this.handleClose}>
                  <DeleteDialog 
                    name={this.state.manager.getCategory(this.state.category)}
                    onClose={this.handleClose}
                    onConfirm={async () => {
                      await this.state.manager.deleteCategory(this.state.manager.getCategory(this.state.category))
                    }}
                  />
                </Dialog>
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