import Button from '@mui/material/Button';
import { useCookies } from 'react-cookie';
import React, { useEffect } from 'react';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/authContext';
import { getCredits } from '../services/apiLayer';


export default function Login() {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [credits, setCredits] = React.useState<null | number>(0);
    const [cookies, setCookie, removeCookie] = useCookies(['token', 'given_name', 'pictureURL', 'credits', 'isLoggedIn']);
    const [isLoading, setIsLoading ] = React.useState<boolean>(true);
    const navigate = useNavigate();
    const auth = useAuth()

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const buyTokens = () => {
        navigate('/purchase')
    }

    const handleLogout = () => {
        auth.logout()
        removeCookie('token')
        removeCookie('pictureURL')
        removeCookie('credits')
        handleCloseUserMenu()
    }

    const buttonStyle = {
        cursor: 'pointer',
        marginRight: '10px',
        display: cookies.isLoggedIn ? 'flex' : 'none',
        height: '35px',
        fontSize: {xs: '12px', sm: '16px'},
        padding: {xs: '0px 10px', sm: '10px 20px'},
        mt: '2px'
    }

    const buttonStyle2 = {
        cursor: 'pointer',
        marginRight: '10px',
        display: cookies.isLoggedIn ? 'none' : 'flex',
        height: '40px',
        fontSize: {xs: '12px', sm: '16px'},
        padding: {xs: '0px 10px', sm: '10px 20px'},
        mt: '0px'
    }

    const creditsStyle = {
        display: cookies.isLoggedIn ? 'flex' : 'none',
        height: '35px',
        mr: '10px',
        padding: {xs: '0px 2px', sm: '0px 10px'},
        fontSize: {xs: '12px', sm: '16px'},
        mt: '2px'
    }

    useEffect(() => {
        const fetchData = async () => {
            if (cookies.token) {
                try {
                    const response = await getCredits(cookies.token);
                    setCredits(response.credits);
                    setCookie('credits', response.credits)
                    setIsLoading(false)

                } catch (error) {
                    console.error('Error fetching credits:', error);
                }
            }
        };

        if (!auth.isAuthorized()) {
            navigate('/')
        } else {
            fetchData()
        }
    }, [])
      
    return (
        <div id="signInButton" style={{ display: 'flex', float: 'right', flexGrow: -1 }}>
            <>
              <Button
                sx={{
                  width: '100px',
                  mr: '20px',
                  height: '40px',
                  display: cookies.isLoggedIn ? 'none' : 'flex'
                }}
                className="btn-hover color-12"
                variant='contained'
                onClick={() => auth.login()}
              >
                Sign in
              </Button>
              {/* <Button variant="contained" className="btn-hover color-2" onClick={buyTokens} sx={buttonStyle2}>
                Pricing
              </Button> */}
              <Box sx={{ display: cookies.isLoggedIn ? 'flex' : 'none' }}>
              {isLoading ? (
                <> {/* Render nothing */}
                </>
                ) : (
                <Chip sx={creditsStyle} label={cookies.credits + " CREDITS"} />
                )}
                {/* <Button variant="contained" className="btn-hover color-2" onClick={buyTokens} sx={buttonStyle}>
                  Buy Credits
                </Button> */}
                <Tooltip title="" sx={{}}>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="AI" imgProps={{ referrerPolicy: "no-referrer" }} src={cookies.pictureURL} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{
                    mt: '45px',
                  }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem key="1">
                    <Typography textAlign="center">Support: clickgenio11@gmail.com</Typography>
                  </MenuItem>
                  <MenuItem key="2" onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </>
        </div>
      );
      

}