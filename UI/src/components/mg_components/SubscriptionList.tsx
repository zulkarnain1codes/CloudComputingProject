import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import SongCard from "./SongCard";
import { getSubscriptions, removeSubscription } from "../../api/api";

interface SubscriptionListProps {
  refreshTrigger?: number;
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ refreshTrigger }) => {
  const [songs, setSongs] = useState<any[]>([]);

  const loadSubscriptions = async () => {
    const userData = localStorage.getItem("user");
    if (!userData) return;

    const user = JSON.parse(userData);

    const res = await getSubscriptions(user.email);
    setSongs(res.subscriptions || []);
  };

  useEffect(() => {
    loadSubscriptions();
  }, [refreshTrigger]);  // reloads whenever SearchPanel subscribes

  const handleRemove = async (song: any) => {
    const userData = localStorage.getItem("user");
    if (!userData) return;

    const user = JSON.parse(userData);

    await removeSubscription(user.email, song.title, song.artist, song.year);

    loadSubscriptions();
  };

  return (
    <Card sx={{ backgroundColor: "#2f2f2f", color: "white", borderRadius: 2, mt: 3 }}>
      <CardContent>
        <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 2 }}>
          MY SUBSCRIPTIONS
        </Typography>

        {songs.length === 0 ? (
          <Typography>No subscriptions yet</Typography>
        ) : (
          songs.map((song, index) => (
            <SongCard
              key={index}
              song={song}
              buttonText="Remove"
              onButtonClick={handleRemove}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionList;