import React from 'react';
import styled from 'styled-components';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ThumbnailImage = styled.img`
  float: left;
  border-radius: 7px;
  object-fit: cover;
  width: 280px;
  height: 160px;
`;

function capitalize(sentence: string) {
    return sentence.split(' ').map(word => {
      if (word.length === 0) {
        return '';
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}

interface YouTubeThumbnailProps {
  imageSrc: string;
  title: string;
  viewCount: string;
}

const YouTubeThumbnail: React.FC<YouTubeThumbnailProps> = ({ imageSrc, title, viewCount }) => {


  return (
    <Grid sx={{width: '100%', padding: '10px 0px', margin: '5px', height: {xs: '100%', sm: '160px'}}}>
        <Grid item xs={12} sm={7} sx={{display: 'inline-block', float: 'left'}}>
            <ThumbnailImage src={imageSrc} alt="" />
        </Grid>
        <Grid item xs={12} sm={5} sx={{
          color: 'white',
          display: 'inline-block',
          height: '100%',
          width: '100%',
          padding: '0px',
          margin: {xs: '10px 0px', sm: '2px 0px'},
          verticalAlign: 'text-top', 
          textAlign: 'left',
          float: 'left',
          }}>
            <Typography sx={{fontSize: '15px', padding: '0px 10px'}}><strong>{capitalize(title).substring(0,150)}</strong></Typography>
            <Typography sx={{fontSize: '14px', padding: '2px 0px 2px 10px', display: 'inline-block', float: 'left'}}>ClICKGEN.IO</Typography><CheckCircleIcon sx={{display: 'inline-block', right: '10px', height: '18px', paddingTop: '5px'}}/>
            <Typography sx={{padding: '2px 10px'}}>{viewCount}M Views</Typography>
        </Grid>
    </Grid>
  );
}

export default YouTubeThumbnail;
