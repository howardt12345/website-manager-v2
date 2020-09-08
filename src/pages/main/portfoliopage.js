import React, { Component, useState } from 'react';
import { MainAppBar } from '@components'
import { fromFirestore, ThemeToggleConsumer } from '@api';
import { NestedList, Tiles } from '@components/portfolio';
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
import { MaterialUiIconPicker } from '@components/material-ui-icon-picker';

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

const CategoryDialog = (props) => {
  const { edit, name, icon, onClose, onSave } = props;
  const [newName, setNewName] = useState(name);
  const [newIcon, setNewIcon] = useState(icon);

  return (
    <div>
      <DialogTitle>{edit ? 'Edit Category' : 'Add Category'}</DialogTitle>
      <DialogContent>
        <TextField 
          id="outlined-basic" 
          label="Name" 
          variant="outlined" 
          defaultValue={name}
          onChange={(event) => {
            setNewName(event.target.value);
          }}
        />
        <Box m={1} />
        <ThemeToggleConsumer>
          {themecontext => (
            <Box display="flex" flexDirection='row' alignItems='center'>
              <Box flexGrow={1} justifyContent="flex-start">
                <MaterialUiIconPicker 
                  theme={themecontext.theme}
                  label={edit ? 'Edit Icon' : 'Pick Icon'}
                  modalTitle='Pick Icon'
                  onPick={(icon) => {
                    console.log(icon.name);
                    setNewIcon(icon.name);
                  }}
                />
              </Box>
              <Tooltip title={newIcon}>
                <Icon color='primary'>{newIcon}</Icon>
              </Tooltip>
            </Box>
          )}
        </ThemeToggleConsumer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => {onSave({name: newName, icon: newIcon}); onClose()}} color="primary">
          OK
        </Button>
      </DialogActions>
    </div>
  );
}

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
            {this.state.manager.getCategoriesCapitalized().map((category, index) => (
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

  handleClose = () => {
    this.setState({
      addCategory: false,
      editCategory: false,
      addFab: false,
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
        <Dialog open={this.state.addCategory || this.state.editCategory} onClose={this.handleClose}>
          <CategoryDialog 
            edit={this.state.editCategory}
            name={this.state.editCategory ? this.state.manager.getCategory(this.state.category) : ''}
            icon={this.state.editCategory ? this.state.manager.getIconFrom(this.state.category) : ''}
            onClose={this.handleClose}
            onSave={(data) => {
              if (this.state.editCategory) {
                
              } else {
                this.state.manager.addCategory(data.name, data.icon);
              }
            }}
          />
        </Dialog>
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