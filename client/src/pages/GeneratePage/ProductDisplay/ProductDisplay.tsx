import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CachedIcon from '@mui/icons-material/Cached';
import DownloadIcon from '@mui/icons-material/Download';
import Stack from '@mui/material/Stack';
import '../../../style.css';
import LoadingPreview from './LoadingPreview';

export default function ProductDisplay(props: {isIdLink: boolean, isClicked: boolean, isLoading: boolean, imageUrl: string, imageId: string, onRefreshThumbnail: any, onDownloadWatermark: any, onPurchase: any}) {

    return (
        <Container sx={{
            minHeight: '100px',
            'width': '100%',
        }}>
            {
                props.isLoading ?
                <div>
                    <LoadingPreview />
                </div> :
                <div>
                <Box
                component="img"
                sx={{
                display:
                    props.isClicked && !props.isLoading ?
                    "inline-block":
                    "none",
                    margin: '0 auto',
                    width: '100%',
                }}
                src={props.isClicked && !props.isLoading ? 
                    props.imageUrl:
                    props.imageUrl}
            /></div>
            }
        <Stack spacing={0} alignItems="center" justifyContent="space-evenly" sx={{
            width: {
                xs: 292, 
                sm: 438,
                md: 384 },
            textAlign: 'center',
            margin: '10px auto',
            flexDirection: {
                xs: "row",
                sm: "row",
                md: "row" }
        }}>
                <Button
                    className="btn-hover color-1"
                    sx={{
                        display: props.isClicked && !props.isLoading ? "inline-flex" : "none",
                        textAlign: "center",
                        margin: "0 10px",
                        width: '300px',
                        bottom: '0px',
                        mt: 1,
                        fontSize: '12px',
                        border: '1px solid black'
                    }}
                    color="warning"
                    variant="contained"
                    onClick={props.onPurchase}
                    type="submit"
                >
                    <b>Download Image</b>
                </Button>
            <IconButton
                className="btn-hover color-9"
                sx={{
                    display: "none",
                    textAlign: "center",
                    margin: "0 2px",
                    bottom: '0px',
                    mt: 1,
                    border: '1px solid black',
                    width: '45px'
                }}
                type="submit"
                onClick={props.onDownloadWatermark}
            >
                <DownloadIcon/>
            </IconButton>
            <IconButton
                className="btn-hover color-8"
                sx={{
                    display: (props.isClicked && !props.isLoading) && !props.isIdLink ? "inline-flex" : "none",
                    textAlign: "center",
                    margin: "0 2px",
                    bottom: '0px',
                    mt: 1,
                    border: '1px solid black',
                    width: '45px'
                }}
                onClick={props.onRefreshThumbnail}
            >
            <CachedIcon/>
            </IconButton>
        </Stack>
      </Container>
    );
}