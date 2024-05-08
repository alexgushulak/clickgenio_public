import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import logo from '../assets/logo.png';
import Login from './Login';
import Box from '@mui/material/Box';

export default function ResponsiveAppBar() {

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar sx={{height: '64px', display: {xs: 'inline-flex', sm: 'inline-flex', md: 'flex'}}}>
        <img src={logo} style={{'height': '50px', 'borderRadius': '13px'}}></img>
          <Container maxWidth="xl" sx={{
            display: { xs: 'none', md: 'inline-flex' },
            ml: 'none',
            margin: '0'
          }}>
            <Typography
              variant="h6"
              noWrap
              component="a"
              display="flex"
              href="/"
              flexGrow="1"
              sx={{
                mt: "6px",
                fontFamily: 'helvetica',
                fontWeight: 700,
                float: 'left',
                color: 'white',
                textDecoration: 'none',
              }}
            >
              CLICKGEN.IO
            </Typography>
            <Login />
          </Container>
          <Container sx={{
            display: { xs: 'inline-flex', md: 'none' },
            mt: '20px',
            mb: '20px'
          }}>
            <Login />
          </Container>
        </Toolbar>
      </Container>
    </AppBar>
  );
}