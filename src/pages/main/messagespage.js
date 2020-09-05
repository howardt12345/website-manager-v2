import React, { Component, useRef, useState, useEffect } from 'react';
import { MainAppBar } from '@components'
import { getMessages } from '@firebase-api';
import { 
  AppBar,
  Box,
  Button,
  CssBaseline,
  Drawer,
  Divider,
  Grid,
  IconButton,
  InputBase,
  Link,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography
} from '@material-ui/core';
import { 
  Archive, 
  Delete, 
  Search, 
  Refresh, 
  Reply 
} from '@material-ui/icons/';
import { fade, makeStyles } from '@material-ui/core/styles';
const _ = require('lodash');

const drawerWidth = 340;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
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
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
  },
  searchIcon: {
    padding: theme.spacing(0, 1),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  listItem: {
    maxWidth: "20rem",
    overflow: "hidden",
    position: "relative",
    lineHeight: "1.2em",
    maxHeight: "3.5em",
    textAlign: "justify",
    marginRight: "-1em",
    paddingRight: "1em",
    "&&:before": {
      content: '"..."',
      position: "absolute",
      right: 0,
      bottom: 0
    },
    "&&:after": {
      content: '""',
      position: "absolute",
      right: 0,
      width: "1em",
      height: "1em",
      marginTop: "0.2em",
      background: "white"
    }
  },
  iconButton: {
    margin: theme.spacing(0, 1),
  },
}));

const TooltipDiv = props => {
  const divRef = useRef(null);
  const [allowTooltip, setAllowTooltip] = useState(false);
  useEffect(() => {
    if (
      !allowTooltip &&
      divRef.current.scrollHeight > divRef.current.offsetHeight
    ) {
      setAllowTooltip(true);
    }
  }, [allowTooltip]);
  if (allowTooltip) {
    return (
      <Tooltip title={props.text} disableHoverListener>
        <div ref={divRef} className={props.className}>
          {props.text}
        </div>
      </Tooltip>
    );
  }
  return (
    <div ref={divRef} className={props.className}>
      {props.text}
    </div>
  );
};


class MessagesPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      allMessages: [],
      messages: [],
      index: -1,
      current: null,
    };
    this.loadMessages();
  }

  loadMessages = async () => {
    const messages = await getMessages();
    messages.sort((a, b) => b.date.localeCompare(a.date));
    this.setState({
      allMessages: messages,
      messages: messages
    });
    console.log(messages);
  }

  search = (query) => {
    console.log(`query: {${query}}`);
    const tmp = [];
    this.state.allMessages.forEach(message => {
      if(message.email.includes(query) || message.name.includes(query) || message.subject.includes(query) || message.body.includes(query)) {
        tmp.push(message);
      }
    })
    tmp.sort((a, b) => b.date.localeCompare(a.date));
    this.setState({ messages: tmp, index: -1 });
  }

  MessageContent = (props) => {
    const { message, classes } = props;
    return (
      <div>
        <Box display="flex" flexDirection='row'>
          <Box flexGrow={1} justifyContent="flex-start">
            <Typography variant='h6'>
              <Box fontWeight={400}>{`${message.name} (${message.email})`}</Box>
            </Typography>
            <Typography variant='subtitle1'>
              <Box>{message.date}</Box>
            </Typography>
          </Box>
          <Box flexDirection='row'>
            <IconButton className={classes.iconButton}>
              <Reply />
            </IconButton>
            <IconButton className={classes.iconButton}>
              <Archive />
            </IconButton>
            <IconButton className={classes.iconButton}>
              <Delete />
            </IconButton>
          </Box>
        </Box>
        <Box m={2} />
        <Typography variant='h5'>
          <Box>{message.subject}</Box>
        </Typography>
        <Box m={1} />
        <Typography paragraph>
          {message.body}
        </Typography>
      </div>
    )
  }

  MessagePreview = (props) => {
    const { message, index } = props;
    return (
      <ListItem 
        button 
        selected={this.state.index === index}
        onClick={event => this.selectIndex(event, message, index)}
      >
        <ListItemText 
          primary={
            <div>
              <Typography variant='body2'>
                {`${message.name} (${message.email})`}
              </Typography>
              <Typography variant='body2' noWrap>
                <Box fontWeight={500}>{message.subject}</Box>
              </Typography>
            </div>
          }
          secondary={
            <TooltipDiv text={message.body} className={props.classes.listItem} />
          }
        />
      </ListItem>
    );
  }

  selectIndex = (event, message, index) => {
    console.log(index);
    this.setState({ 
      current: message,
      index: index,
    });
  }
 
  render() {
    const classes = this.props.classes;

    return (
      <div classes={classes.root}>
        <CssBaseline />
        <MainAppBar page='messages'/>
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
                  <div className={classes.search}>
                    <div className={classes.searchIcon}>
                      <Search />
                    </div>
                    <InputBase
                      placeholder="Search…"
                      classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                      }}
                      inputProps={{ 'aria-label': 'search' }}
                      onChange={(query) => {
                        this.search(query.target.value);
                      }}
                    />
                  </div>
                </ListItemText>
                <ListItemSecondaryAction>
                  <IconButton edge='end' onClick={this.loadMessages}>
                    <Refresh />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
            <Divider />
            <List>
              {this.state.messages.map((message, index) => (
                <this.MessagePreview message={message} index={index} classes={classes}/>
              ))}
            </List>
          </div>
        </Drawer>
        <main className={classes.content}>
          <Toolbar variant="dense"/>
          {this.state.current === null ? <div /> : <this.MessageContent message={this.state.current} classes={classes}/>}
        </main>
      </div>
    );
  }
}
 
export default () => {
  const classes = useStyles();
  return (
    <MessagesPage classes={classes} />
  )
}