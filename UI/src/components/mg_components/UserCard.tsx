import React from "react";
import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";

const UserCard: React.FC = () => {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const username = user?.username || "Guest";
  const email = user?.email || "No email";

  return (
    <Card
      sx={{
        backgroundColor: "#2f2f2f",
        color: "white",
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 2 }}>
          USER
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: "#1976d2" }}>
            {username.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography fontWeight="bold">{username}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {email}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserCard;