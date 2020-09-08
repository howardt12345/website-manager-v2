import React, { useState } from 'react';

import { 
  Collapse,
  Icon,
  List, ListItem, ListItemIcon, ListItemText,
} from '@material-ui/core';
import { 
  ExpandLess, ExpandMore,
} from '@material-ui/icons/';



export default function NestedList(props) {
  const { classes, name, icon, elements, onOpen, onSelect } = props;
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
        <ListItemIcon>
          <Icon>{icon}</Icon>
        </ListItemIcon>
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