import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { loadStripe } from '@stripe/stripe-js';
import { createCreditCheckoutSession } from '../../../services/apiLayer';'../../../services/apiLayer.tsx';
// import { AuthContext } from '../../../main';
import { useCookies } from 'react-cookie';
import { useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface ItemWidgetProps {
    image: string;
    credits: number;
    price: number;
    color?: string;
}

export default function ItemWidget(props: ItemWidgetProps) {
    const [cookies, setCookie, removeCookie] = useCookies(['token', 'given_name', 'pictureURL', 'credits']);

    const boxStyle = {
      height: '400px',
      backgroundColor: props.color ? props.color : '#000000',
      padding: '20px',
      borderRadius: '15px'
    }

    const iconWidth = { xs: 200, sm: 200, md: 150 }

    const gridStyle = {

    }

    const buttonStyle = {
        width: '180px',
        fontSize: '20px',
        margin: '20px 0px'
    }

    const iconStyle = {
        display: 'block',
        margin: '0 auto',
        padding: '10px',
        width: iconWidth,
    }

    async function handleBuyButtonClick() {

        if (!cookies.token) {
            toast.error("Please Login To Purchase");
            return;
        }

        const response: any = await createCreditCheckoutSession(props.credits, cookies.token)
        const sessionId = response.data.sessionId
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

        if (stripe != null) {
            const { error } = await stripe.redirectToCheckout({
                sessionId
            });

            if (error) {
                console.error('Error redirecting to Stripe Checkout:', error);
                // You can handle the error here, e.g., show an error message to the user.
            }
        }
    }

    return (
        <Grid item xs={12} sm={12} md={4} sx={gridStyle}>
            <Box sx={boxStyle}>
                <Box component="img" sx={iconStyle} src={props.image}/>
                <Typography variant="h4">
                    <strong>
                        {props.credits} THUMBNAILS
                    </strong>
                </Typography>
                <Button variant="contained" sx={buttonStyle} onClick={handleBuyButtonClick}>Buy for ${props.price}</Button>
                <Typography variant="body1">${(props.price/props.credits).toFixed(2)} per Thumbnail</Typography>
            </Box>
            <Toaster />
        </Grid>
    );
}