import React, { useState } from "react";
import {
  CssBaseline,
  Alert
} from "@mui/material";
import { 
  Routes,
  Route,
} from "react-router-dom";
import { submitIPData } from "./services/apiLayer";
import "./App.css";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PurchasePage from "./pages/PurchasePage/PurchasePage";
import HomePage from "./pages/HomePage/HomePage";
import GeneratePage from './pages/GeneratePage/GeneratePage';
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import SplashPage from "./pages/SplashPage/SplashPage";
import ImageEditor from "./pages/ImageEditor/ImageEditor";
import { gapi } from 'gapi-script';
import Footer from "./components/Footer";


let id: any = null

// updated
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function App() {
  const [imageId, setImageId] = useState("");

  const checkIdExistsOnPageLoad = () => {
    const query = new URLSearchParams(window.location.search);
    id = query.get("id");

    if (id) {
      try {
        setImageId(id);
      } catch {
        console.error("Could not set ID");
      }
    }
  }

  React.useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: ""
      })
    };

    gapi.load('client:auth2', start)
    checkIdExistsOnPageLoad()
    submitIPData("Logged On")
  }, [])

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  

  return (
    <ThemeProvider theme={darkTheme}>
      <Alert severity="warning" sx={{margin: "0 auto", textAlign: "center"}} >
        We will be shutting down clickgen.io on May 15th, 2024. The website source code will be open-sourced on GitHub. Please use all credits by May 15th, 2024.
     </Alert>
      <CssBaseline />
      <ResponsiveAppBar />
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/generate" element={<GeneratePage />} />
        <Route path="/purchase" element={<PurchasePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/editor" element={<ImageEditor />} />
      </Routes>
      <Footer />
    </ThemeProvider>
  );
}
