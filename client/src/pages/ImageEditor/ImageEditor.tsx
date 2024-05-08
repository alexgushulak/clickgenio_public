import { InputLabel, MenuItem, Select, TextField, Typography, FormControl, Box, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import Draggable from "react-draggable";

export default function ImageEditor() {
  
  const [text, setText] = useState<string>("")
  const [font, setFont] = useState<string>("Arial")
  const [dragging, setDragging] = useState<boolean>(false);
  const [height, setHeight] = useState<number>(20); // initialise to 20px
  const [mouseStart, setMouseStart] = useState<any>({ x: 0, y: 0 });
  const [textStyle, setTextStyle] = useState<any>({
    cursor: 'pointer',
    fontSize: '50px',
    color: 'black',
    textTransform: 'uppercase',
    '-webkit-text-stroke-width': '1px',
    '-webkit-text-stroke-color': 'yellow'
  })

  const boxStyle = {
    outline: '1px solid #FFFFFF',
    display: 'inline-block',
    position: 'relative',
    padding: '0px 18px',
    height: '100px',
    width: '200px'
  }

  const leftHandCornerStyle = {
    color: 'blue',
    backgroundColor: 'white',
    width: '20px',
    height: '20px',
    border: '2px solid #74cafc',
    position: 'absolute',
    top: '-10px',
    left: '-10px',
    borderRadius: '10px'
  }

  const rightHandCornerStyle = {
    color: 'blue',
    backgroundColor: 'white',
    width: '20px',
    height: '20px',
    border: '2px solid #74cafc',
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    borderRadius: '10px',
    '&:hover': {
      cursor: "ne-resize",
   },
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleFontChange = (event: SelectChangeEvent) => {
    setFont(event.target.value as string);
  };

  const onMouseDown = (event: any) => {
    setDragging(true);
    setMouseStart({ x: event.offsetX, y: event.offsetY });
  }

  const onMouseMove = (event: any) => {
    if (dragging) {
      const pixelDifference: number = Math.max(mouseStart.x - event.offsetX, mouseStart.y - event.offsetY);
      setHeight(height + pixelDifference);
    }
  }

  return (
    <div>
      <FormControl sx={{width: '200px'}}>
        <InputLabel id="demo-simple-select-label">Font</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Font"
          value={font}
          onChange={handleFontChange}
        >
          <MenuItem value={10}>Arial</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
      <TextField label="Text" variant="outlined" value={text} onChange={handleChange} />
      <Box sx={{height: { xs: 172, sm: 215, md: 215 }, width: { xs: 301, sm: 377, md: 370 }}}>
      <Box
        component="img" 
        sx={{
          display: 'inline-block',
          margin: '0 auto',
          padding: '10px',
          height: { xs: 172, sm: 215, md: 215 },
          width: { xs: 301, sm: 377, md: 370 },
        }}
        src={`${import.meta.env.VITE_APISERVER}/assets/lol.png`}
      />
      </Box>
      <Typography>{font}</Typography>
    </div>
  )
}