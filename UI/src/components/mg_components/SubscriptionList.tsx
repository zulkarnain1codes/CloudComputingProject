import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import SongCard from "./SongCard";
import { songs } from "../../data/songs";

const SubscriptionList: React.FC = () => {
  const subscribedSongs = songs.slice(0, 3);

  return (
    <Card
      sx={{
        backgroundColor: "#2f2f2f",
        color: "white",
        borderRadius: 2,
        mt: 3,
      }}
    >
      <CardContent>
        <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 2 }}>
          MY SUBSCRIPTIONS
        </Typography>

        {subscribedSongs.map((song, index) => (
          <SongCard key={index} song={song} buttonText="Remove" />
        ))}
      </CardContent>
    </Card>
  );
};

export default SubscriptionList;