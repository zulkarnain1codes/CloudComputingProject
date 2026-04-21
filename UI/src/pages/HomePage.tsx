import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/main");
  }, []);

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
      <Typography variant="h3" sx={{ fontWeight: 700 }}>
        Welcome to RAGA
      </Typography>

      <Button
        variant="contained"
        size="large"
        onClick={() => navigate("/main")}
      >
        Go to Main Page
      </Button>

      <Button
        variant="outlined"
        size="large"
        onClick={() => navigate("/login")}
      >
        Login
      </Button>

      <Button
        variant="outlined"
        size="large"
        onClick={() => navigate("/register")}
      >
        Register
      </Button>
    </Box>
  );
};

export default HomePage;