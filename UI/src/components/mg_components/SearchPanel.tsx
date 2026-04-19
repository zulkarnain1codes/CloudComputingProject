import React, { useState } from "react";
import { Card, CardContent, Typography, TextField, Button, Box } from "@mui/material";
import SongCard from "./SongCard";
import { songs } from "../../data/songs";

const SearchPanel: React.FC = () => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [year, setYear] = useState("");
  const [album, setAlbum] = useState("");

  const filteredSongs = songs.filter((song) => {
    return (
      song.title.toLowerCase().includes(title.toLowerCase()) &&
      song.artist.toLowerCase().includes(artist.toLowerCase()) &&
      song.year.toLowerCase().includes(year.toLowerCase()) &&
      song.album.toLowerCase().includes(album.toLowerCase())
    );
  });

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
          SEARCH MUSIC
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: "#ccc" } }}
            sx={textFieldStyle}
          />

          <TextField
            label="Artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: "#ccc" } }}
            sx={textFieldStyle}
          />

          <TextField
            label="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: "#ccc" } }}
            sx={textFieldStyle}
          />

          <TextField
            label="Album"
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: "#ccc" } }}
            sx={textFieldStyle}
          />

          <Button
            variant="outlined"
            sx={{ color: "white", borderColor: "gray", py: 1.5 }}
          >
            Query
          </Button>
        </Box>

        <Typography variant="subtitle2" sx={{ opacity: 0.8, mt: 4, mb: 2 }}>
          RESULTS
        </Typography>

        {filteredSongs.map((song, index) => (
          <SongCard key={index} song={song} buttonText="+ Subscribe" />
        ))}
      </CardContent>
    </Card>
  );
};

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& fieldset": {
      borderColor: "#555",
    },
    "&:hover fieldset": {
      borderColor: "#888",
    },
  },
  "& .MuiInputBase-input": {
    color: "white",
  },
};

export default SearchPanel;