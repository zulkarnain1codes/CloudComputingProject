import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

const Navbar: React.FC = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight="bold">
          Music Subscription App
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body1">Welcome, john_doe</Typography>
          <Button
            variant="outlined"
            sx={{ color: "#fff", borderColor: "#fff" }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;