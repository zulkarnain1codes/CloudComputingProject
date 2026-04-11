import { Container, Typography, Box } from "@mui/material";

function App() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h3">
          Music Subscription App 🎵
        </Typography>

        <Typography variant="body1" sx={{ mt: 2 }}>
          Frontend is working successfully.
        </Typography>
      </Box>
    </Container>
  );
}

export default App;