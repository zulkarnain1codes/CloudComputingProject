import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BackendSwitcher from "../components/BackendSwitcher";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    const user = sessionStorage.getItem("user");
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
      {/* Backend switcher pinned to top-right corner */}
      <Box sx={{ position: "fixed", top: 16, right: 16, zIndex: 1000 }}>
        <BackendSwitcher />
      </Box>

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