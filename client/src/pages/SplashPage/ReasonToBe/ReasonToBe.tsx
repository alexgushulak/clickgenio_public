import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import React from 'react';
import styled from 'styled-components';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { Typography } from '@mui/material';

const containerStyle = {
    width: {xs: '340px', sm: '400px', md: '520px'},
    margin: '0 auto',
    mb: '40px'
}

const iconStyle = {
    float: 'left',
    width: '40px',
    height: '40px',
    backgroundImage: 'linear-gradient(to right, #3cba92, #30dd8a, #2bb673)',
    color: 'black',
    borderRadius: '10px',
    margin: '4px'
}

const descriptionText = {
    marginLeft: '10px',
    textAlign: 'left',
    width: {xs: '240px', sm: '300px'},
    float: 'left',
    color: '#30dd8a'
}

const itemContainer = {
    padding: '0px'!,
    margin: {xs:'10px 0px 0px 20px',sm: '15px -20px'},
    width: '100%',
}

export default function ReasonToBe() {

    return (
        <Grid container spacing={2} sx={containerStyle}>
            <Grid item md={12} sx={itemContainer}>
                <AutoFixHighIcon sx={iconStyle}/>
                <Typography variant='body1' sx={descriptionText}>Clickgen.io is easy to use, just type in what you want to see. That's it!</Typography>
            </Grid>
            <Grid item md={12} sx={itemContainer}>
                <LocalFireDepartmentIcon sx={iconStyle}/>
                <Typography variant='body1' sx={descriptionText}>Create thumbnails that will attract viewers to your videos</Typography>
            </Grid>
            <Grid item md={12} sx={itemContainer}>
                <ElectricBoltIcon sx={iconStyle} />
                <Typography variant='body1' sx={descriptionText}>Thumbnails are generated quickly, within 20 seconds</Typography>
            </Grid>
        </Grid>
    )
}