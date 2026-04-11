import React from "react";
import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";

const UserCard: React.FC = () => {
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
          <Avatar sx={{ bgcolor: "#1976d2" }}>JD</Avatar>
          <Box>
            <Typography fontWeight="bold">john_doe</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              john@example.com
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserCard;