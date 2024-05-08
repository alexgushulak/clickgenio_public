import ItemWidget from './ItemWidget/ItemWidget';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import diamondIcon from '../../assets/diamond.webp';
import goldIcon from '../../assets/gold.webp';
import ironIcon from '../../assets/iron.webp';
import Container from '@mui/material/Container';
import { useAuth } from '../../context/authContext';
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from 'react';

export default function PurchasePage() {
  const navigate = useNavigate();
  const auth = useAuth();

  React.useEffect(() => {
  
  }, [])

  const refundPolicyStyle = {
    backgroundColor: '#ffe252',
    borderRadius: '15px',
    color: 'black',
    textAlign: 'left',
    padding: '10px 20px',
    fontSize: '8px'
  }

  return (
    <Container sx={{mt: '30px', mb: '0px'}}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box sx={refundPolicyStyle}>
            <Typography sx={{fontSize: '18px'}}>
              We are <strong>unable to offer refunds</strong> at this time due to the high costs to generate images. Thank you for understanding.
            </Typography>
          </Box>
        </Grid>
        <ItemWidget image={ironIcon} credits={25} price={10.00} color={"#1a1a1a"}/>
        <ItemWidget image={goldIcon} credits={50} price={18.00} color={"#171612"}/>
        <ItemWidget image={diamondIcon} credits={125} price={40.00} color={"#12161c"}/>
      </Grid>
    </Container>
  );
}