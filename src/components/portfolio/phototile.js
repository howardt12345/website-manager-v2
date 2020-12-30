import React, { useState, useEffect, useCallback, useRef } from "react";

const useDoubleClick = (click, doubleClick, timeout = 200) => {
  // we're using useRef here for the useCallback to rememeber the timeout
  const clickTimeout = useRef();

  const clearClickTimeout = () => {
      if (clickTimeout) {
          clearTimeout(clickTimeout.current);
          clickTimeout.current = undefined;
      }
  };

  // return a memoized version of the callback that only changes if one of the dependencies has changed
  return useCallback((event) => {
      clearClickTimeout();
      if (click && event.detail === 1) {
          clickTimeout.current = setTimeout(() => {
              click(event);
          }, timeout);
      }
      if (event.detail % 2 === 0) {
          doubleClick(event);
      }
  }, [click, doubleClick]);
};

const imgStyle = {
  transition: "transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s"
};
const selectedImgStyle = {
  transform: "translateZ(0px) scale3d(0.9, 0.9, 1)",
  transition: "transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s"
};

const cont = {
  backgroundColor: "#70707020",
  cursor: "pointer",
  overflow: "hidden",
  position: "relative"
};

const PhotoTile = ({
    index, 
    photo, 
    top,
    left,
    direction,
    selected,
    onClick, 
    onDoubleClick
  }) => {
    const [isSelected, setIsSelected] = useState(selected);

    //calculate x,y scale
    const sx = (100 - (30 / photo.width) * 100) / 100;
    const sy = (100 - (30 / photo.height) * 100) / 100;
    selectedImgStyle.transform = `translateZ(0px) scale3d(${sx}, ${sy}, 1)`;
  
    if (direction === "column") {
      cont.position = "absolute";
      cont.left = left;
      cont.top = top;
    }

  return (
    <div style={{ height: photo.height, width: photo.width, ...cont }}>
      <img
        {...photo}
        style={
          isSelected ? { ...imgStyle, ...selectedImgStyle } : { ...imgStyle }
        }
        onClick={useDoubleClick(onClick, () => {
          setIsSelected(!isSelected);
          onDoubleClick();
        })}
      />
    </div>
  )
}


export default PhotoTile;