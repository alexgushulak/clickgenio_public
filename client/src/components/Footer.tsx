import { Paper, Container, Typography, Box } from "@mui/material";

export default function Footer() {
    return (
      <Paper sx={{marginTop: 'calc(10% + 60px)',
        width: '100%',
        bottom: 0,
        position: 'fixed'
      }} component="footer" square variant="outlined">
        <Container maxWidth="lg">
          <Box
            sx={{
              flexGrow: 1,
              justifyContent: "center",
              display: "flex",
              my:1
            }}
          >
          </Box>
  
          <Box
            sx={{
              flexGrow: 1,
              justifyContent: "center",
              display: "flex",
              mb: 2,
            }}
          >
            <Typography variant="caption" color="white">
              clickgen.io 2024 | <a href="https://www.freeprivacypolicy.com/live/03433b0f-d213-4d04-a08d-d9602037db32">Privacy Policy</a> | <a href="../../tos.html">Terms of Service</a> | <a href="mailto:clickgenio11@gmail.com">Support</a>
            </Typography>
          </Box>
        </Container>
      </Paper>
    );
  }