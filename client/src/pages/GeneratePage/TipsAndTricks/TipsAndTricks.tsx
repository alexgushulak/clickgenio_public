import React from 'react';
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';

export default function TipsAndTricks() {
    return (
        <div>
            <Alert
                severity="success"
                sx={{
                    textAlign: 'left',
                    fontSize: '14px',
                    mb: '10px'
                }}>
                <AlertTitle sx={{
                    textTransform: "uppercase",
                    textStyle: "bold",
                    fontSize: '14px'
                }}>
                    <strong>Describe the image in as much detail as possible</strong>
                </AlertTitle>
                <i>Example:</i> Detailed, 4K-resolution image of a futuristic metropolis at dusk, featuring gleaming skyscrapers, intricate flying vehicle designs, and intricate city lighting
            </Alert>
            <Alert severity="success" sx={{ textAlign: 'left', fontSize: '14px', mb: '10px' }}>
                <AlertTitle sx={{ textTransform: "uppercase", textStyle: "bold", fontSize: '14px' }}>
                    <strong>iterate multiple times</strong>
                </AlertTitle>
                <i>Initial prompt:</i> "Mountain landscape" <br /><br />
                <i>After reviewing the image:</i> "Breathtaking image of a snow-capped mountain peak at sunrise"
            </Alert>
            <Alert severity="error" sx={{ textAlign: 'left', fontSize: '14px', mb: '10px' }}>
                <AlertTitle sx={{ textTransform: "uppercase", textStyle: "bold", fontSize: '14px' }}>
                    <strong>do not try to generate words in the image</strong>
                </AlertTitle>
                <i>Example:</i> Big white title saying "The Best Thumbnail Generator" with a red background<br /><br />
                This will not work because the AI is not trained on words
            </Alert>
            <Alert severity="error" sx={{ textAlign: 'left', fontSize: '14px', mb: '10px' }}>
                <AlertTitle sx={{ textTransform: "uppercase", textStyle: "bold", fontSize: '14px' }}>
                    <strong>do not misspell words</strong>
                </AlertTitle>
                <i>Example:</i> detaled, 4K-resollution imag of a fueturistic metroplois at dusk
            </Alert>
        </div>
    )
}