import {Grid, Box} from '@mui/material';
import React from 'react';
import styled from 'styled-components';

const YoutubeThumbnail = {
    borderRadius: '7px',
    objectFit: 'cover',
    width: {xs: '100%', sm: '250px', md: '33.3%'},
    padding: '3px',
}

const containerStyle = {
    width: '100%',
    margin: '0 auto',
    justifyContent: 'center'
}

interface imageData {
    imageId: string;
    userPrompt: string;
    previewUrl?: string;
}

export default function GalleryGrid() {
    const [myImageData, setMyImageData] = React.useState([])

    React.useEffect(() => {
        fetch(`${import.meta.env.VITE_APISERVER}/gallery`)
            .then(res => res.json())
            .then(data => {
                const myImageData = data.images.map((item: imageData) => item)
                setMyImageData(myImageData)
                myImageData.forEach((item: imageData) => {
                    item.previewUrl = `${import.meta.env.VITE_APISERVER}/image-cache/${item.imageId}.jpg`
                })
            })
    }, [])

    return (
        <Grid container spacing={2} sx={containerStyle}>
            {myImageData.map((item: imageData) => (
                <Box sx={YoutubeThumbnail} component="img" src={item.previewUrl} />
            ))}
        </Grid>
    )
}