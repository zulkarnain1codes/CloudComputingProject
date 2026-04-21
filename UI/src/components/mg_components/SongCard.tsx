import React from "react";
import { Card, CardContent, Typography, Button, Box, Avatar } from "@mui/material";
import type { Song } from "../../types/Song";

interface SongCardProps {
  song: Song;
  buttonText: string;
  onButtonClick?: (song: Song) => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, buttonText, onButtonClick }) => {
  return (
    <Card
      sx={{
        backgroundColor: "#333",
        color: "white",
        borderRadius: 2,
        mb: 2,
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
          <Box display="flex" gap={2} alignItems="center">
            <Avatar
              src={song.img_url}
              alt={song.title}
              variant="rounded"
              sx={{ width: 56, height: 56 }}
            />
            <Box>
              <Typography fontWeight="bold">{song.title}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {song.artist} · {song.album} · {song.year}
              </Typography>
            </Box>
          </Box>

          <Button
            variant="outlined"
            onClick={() => onButtonClick?.(song)}
            sx={{ color: "white", borderColor: "gray", minWidth: 120 }}
          >
            {buttonText}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SongCard;