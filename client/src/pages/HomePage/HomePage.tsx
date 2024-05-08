// App.tsx
import React, { useState } from "react";
import {
  CssBaseline,
  Container,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Routes, Route } from "react-router-dom";
import { generateImage, submitIPData } from "../../services/apiLayer";
import RainbowTesla from "../../assets/rainbow_tesla.png";
import CircularProgress from "@mui/material/CircularProgress";
import "../../App.css";

let id: any = null

export default function App() {
  const engineId = import.meta.env.VITE_ENGINEID
  const apiHost = import.meta.env.VITE_APIHOST
  const apiKey = import.meta.env.VITE_APIKEY
  const [thumbnailText, setThumbnailText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageDownloadUrl, setImageDownloadUrl] = useState("");
  const [imageId, setImageId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [finalText, setFinalText] = useState('');
  const [useFinalText, setUseFinalText] = useState(false);
  const [message, setMessage] = useState("");

  const handleTextbarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setThumbnailText(event.target.value);
  };


  const handleKeyPress = async (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setFinalText(thumbnailText);
      setUseFinalText(true);
      await onGenerateThumbnail();
      event.preventDefault();
    }
  };

  const onGenerateThumbnail = async () => {
    setIsClicked(true);
    setIsLoading(true);
    const textToUse = useFinalText && thumbnailText !== "" ? finalText : thumbnailText;
    await submitIPData(textToUse);
    const my_imageId = await generateImage(textToUse, apiHost, engineId, apiKey, 'token', setImageUrl);
    setImageId(my_imageId)
    setImageDownloadUrl(`${import.meta.env.VITE_APISERVER}/download/?id=${my_imageId}`)
    setIsLoading(false);
  };

  const ProductDisplay = () => (
    <section>
      <Box
          component="img"
          sx={{
            display: isClicked && !isLoading ? "inline-block" : "none",
            height: { xs: 200, sm: 300, md: 400 },
            width: { xs: 292, sm: 438, md: 584 },
            margin: '0 auto',
          }}
          src={imageUrl}
        />
      <form action={`${import.meta.env.VITE_APISERVER}/create-checkout-session/?imgid=${imageId}`} method="POST">
      <Button
          sx={{
            display: isClicked && !isLoading ? "block" : "none",
            textAlign: "center",
            margin: "0 auto",
            bottom: '75px',
            mt: 1,
            width: '250px'
          }}
          type="submit"
          color="success"
          variant="contained"
        >Download Full Size Image</Button>
      </form>
    </section>
  );

  const onDownload = () => {
    const link = document.createElement("a");
    link.href = `${import.meta.env.VITE_APISERVER}/download/full?id=${imageId}`;
    link.click();
  };

  const checkIdExistsOnPageLoad = () => {
    const query = new URLSearchParams(window.location.search);
    id = query.get("id");

    if (id) {
      try {
        setImageId(id);
      } catch {
        console.log("Error");
      }
    } else {
      console.log("No Id in Query");
    }
  }

  React.useEffect(() => {
    checkIdExistsOnPageLoad()
    submitIPData("Logged On")
  }, [])

  return (
    <div>
      <CssBaseline />
      <Routes>
        <Route path="/" element={""} />
      </Routes>
      <div>
          {id && (
            <div>
              <div>Thank you for your purchase!</div>
              <Button
                component="label"
                startIcon={<FileDownloadIcon />}
                variant="contained"
                color="success"
                onClick={onDownload}
              > Download Thumbnail
              </Button>
            </div>
          )}
          {
      <Container sx={{ mb: 5, mt: 15 }}>
        <ProductDisplay />
        <Typography
          variant="h3"
          component="h3"
          sx={{
            display: "block",
            textAlign: "center",
            margin: "0 auto",
            mt: 1,
          }}
        >
          clickgen.io
        </Typography>
        <TextField
          fullWidth={true}
          value={thumbnailText}
          onChange={handleTextbarChange}
          onKeyDown={handleKeyPress}
          label="Thumbnail Description"
          placeholder="A Rainbow Colored Tesla Model 3 Driving Through the Mountains"
          id="outlined-multiline-flexible"
          multiline
        />
        <Button
          sx={{
            display: isLoading ? "none" : "block",
            textAlign: "center",
            margin: "0 auto",
            mt: 1,
          }}
          variant="contained"
          onClick={onGenerateThumbnail}
        >
          GENERATE THUMBNAIL
        </Button>
        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Please Wait 30 Seconds for the Image to generate
            <CircularProgress />
          </div>
        )}
      </Container>
      }
        </div>
      <Container
        sx={{
          display: "flex",
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: "center",
          alignItems: "center",
          margin: "25px auto",
          textAlign: "center"
        }}
      >
        <Box
          component="img"
          sx={{
            display: 'inline-block',
            margin: '0 auto',
            padding: '10px',
            height: { xs: 172, sm: 215, md: 215 },
            width: { xs: 301, sm: 377, md: 377 },
          }}
          src={RainbowTesla}
        />
        <Box
          component="img"
          sx={{
            display: 'inline-block',
            height: { xs: 172, sm: 215, md: 215 },
            width: { xs: 301, sm: 377, md: 377 },
            margin: '0 auto',
            padding: '10px'
          }}
        />
      </Container>
    </div>
  );
}