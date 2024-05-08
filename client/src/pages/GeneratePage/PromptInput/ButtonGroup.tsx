import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function ButtonGroup() {
  const [alignment, setAlignment] = React.useState('photo');

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
    console.log(alignment)
  };

  return (
    <ToggleButtonGroup
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '10px auto',
        width: '100%',
      }}
      color="secondary"
      value={alignment}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
    >
      <ToggleButton value="photo">Photo Realistic</ToggleButton>
      <ToggleButton value="animate">Animated</ToggleButton>
      <ToggleButton value="render">3D Render</ToggleButton>
    </ToggleButtonGroup>
  );
}