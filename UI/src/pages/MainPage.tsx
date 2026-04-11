import React from "react";
import { Box, Typography } from "@mui/material";

const MainPage: React.FC = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#1e1e1e",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h3" fontWeight="bold">
        This is Main Page
      </Typography>
    </Box>
  );
};

export default MainPage;