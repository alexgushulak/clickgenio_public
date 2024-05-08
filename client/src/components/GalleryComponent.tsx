import React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import YouTubeThumbnail from './YoutubeThumbnail';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function GalleryComponent() {
    const [myImageData, setMyImageData] = React.useState([])
    // const [viewCount, setViewCount] = React.useState("")

    React.useEffect(() => {
        // setViewCount((Math.random() * (5 - 1) + 1).toFixed(1));
        fetch(`${import.meta.env.VITE_APISERVER}/gallery`)
            .then(res => res.json())
            .then(data => {
                const myImageData = data.images.map((item: any) => item)
                setMyImageData(myImageData)
                myImageData.forEach((item: any) => {
                    item.previewUrl = `${import.meta.env.VITE_APISERVER}/image-cache/${item.imageId}.jpg`
                })
                myImageData.forEach((item: any) => {
                    item.viewCount = (Math.random() * (5 - 1) + 1).toFixed(1);
                  });
            })
    }, [])


    return (
        <div>
            <Typography variant='h4' sx={{mb: '0px'}}><b>Community Thumbnails</b></Typography>
            <ImageList sx={{ display: 'inline-block', width: '100%', height: '80vh'}}>
                <Grid container spacing={2}>
                {myImageData.map((item: any) => (
                    <YouTubeThumbnail key={item.previewUrl} imageSrc={item.previewUrl} title={item.userPrompt} viewCount={item.viewCount} />
                ))}
                </Grid>
            </ImageList>
        </div>
    )
}