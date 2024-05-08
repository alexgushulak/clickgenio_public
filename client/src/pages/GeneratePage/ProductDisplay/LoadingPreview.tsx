import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import RainbowTesla from '../../../assets/rainbow_tesla.png';
import Tsunami from '../../../assets/tsunami.png';
import Thumby from '../../../assets/thumby.png';
import Surprise from '../../../assets/surprise.png';
import WomanThumbnail from '../../../assets/womanthumbnail.png';

export default function LoadingPreview() {
    const [progress, setProgress] = React.useState(0);
    const [randomIndex, setRandomIndex] = React.useState(Math.floor(Math.random() * 4));

    const listOfPrompts = [
        "A Rainbow Colored Tesla Model 3 Driving Through the Mountains with flames coming out of the wheels",
        "Photograph, surprised man, looking at computer screen, surprised man, Virtual reality game setting, futuristic cityscape, Close-up Shot, softbox, Vibrant colors, bold and energetic, high resolution",
        "Photograph, stressed man, explaining something, confident expression, Outdoor urban street at sunrise, Close-up, Impressionism, photograph by Annie Leibovitz, moody lighting, vibrant colors, High Definition",
        "Portrait, Illustration, woman with vibrant hair and expressive eyes, natural environment, woman enjoying a peaceful meadow, shooting technique, rim lighting, 4k"
    ]

    const listOfTips = [
        "Tip: Remember to be creative in writing your prompt",
        "Tip: Be as detailed as possible in your prompt",
        "Tip: The AI excels at creating photorealistic images",
        "Tip: The AI excels at creating photorealistic images",
    ]

    const listOfImages = [
        RainbowTesla,
        Surprise,
        Thumby,
        WomanThumbnail
    ]

    React.useEffect(() => {
        const timer = setInterval(() => {
        setProgress((oldProgress) => {
            if (oldProgress === 100) {
            return 100;
            }
            const diff = 0.2;
            return Math.min(oldProgress + diff, 100);
        });
        }, 100);

        return () => {
        clearInterval(timer);
        };
    }, []);

    return (
        <div>
            <Box sx={{ width: '100%', height: {xs: '90px', sm: '100px', md: '150px', lg: '240px'}, display: 'block', 'background-color': '#141414' }}>
                <Box
                    component="img"
                    sx={{
                    display: 'inline-block',
                    float: 'left',
                    height: '100%',
                    padding: 0,
                    margin: 0,
                    }}
                    src={listOfImages[randomIndex]}
                />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '95%',
                        fontSize: {xs: '8px', sm: '15px'},
                        padding: '10px 10px',
                    }}
                >
                    <i>{listOfPrompts[randomIndex]}</i>
                </Box>
            </Box>
            <Box sx={{ display: 'inline-block', width: '100%' }}>
                <LinearProgress variant="determinate" value={progress} />
            </Box>
            <Box sx={{ display: 'inline-block', width: '100%' }}>
                {listOfTips[randomIndex]}
            </Box>
        </div>
    )
}