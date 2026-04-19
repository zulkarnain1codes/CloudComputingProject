import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#121212",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 3,
      }}
    >
      <Typography variant="h3" fontWeight="bold">
        Welcome to RAGA
      </Typography>

      <Button
        variant="contained"
        size="large"
        onClick={() => navigate("/main")}
      >
        Go to Main Page
      </Button>
    </Box>
  );
};

export default HomePage;