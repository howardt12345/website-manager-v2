import React, { useState, useRef, useEffect } from 'react';
import { getUrlsFor } from '@api';
import { ImageMasonry } from '@components'
import { 
  Box,
  IconButton,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { 
  Edit,
  DeleteForever,
} from '@material-ui/icons/';

const useContainerDimensions = myRef => {

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    
    const getDimensions = () => ({
      width: myRef.current.offsetWidth,
      height: myRef.current.offsetHeight
    });

    const handleResize = () => {
      setDimensions(getDimensions());
    }

    if (myRef.current) {
      setDimensions(getDimensions());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, [myRef]);

  return dimensions;
};

export default function Tiles(props) {
  const componentRef = useRef();
  const { width } = useContainerDimensions(componentRef);
  const { classes, category, subcategory, data, onClick, onEdit, onDelete } = props;
  
  return (
    <div ref={componentRef}>
      <Box display="flex" flexDirection='row'>
        <Box flexGrow={1} justifyContent="flex-start">
          <Typography variant="h3" display="inline">
            {category}
          </Typography>
          <Typography variant="h4" display="inline">
            {`: ${subcategory}`}
          </Typography>
        </Box>
        <Box flexDirection='row'>
          <Tooltip title='Edit'>
            <IconButton
              className={classes.iconButton}
              onClick={() => {
                onEdit();
              }}
              >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton
              className={classes.iconButton}
              onClick={() => {
                onDelete();
              }}
              >
              <DeleteForever />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      {width
      ? (
        <ImageMasonry 
          numCols={Math.ceil(width/300)}
          containerWidth={'100%'}
          forceOrder={true}
          animate={true}
          imageUrls={getUrlsFor(data)}
          onClick={(index) => {
            onClick(index);
          }}
        />
      ) : (
        <div></div>
      )}
    </div>
  )
}