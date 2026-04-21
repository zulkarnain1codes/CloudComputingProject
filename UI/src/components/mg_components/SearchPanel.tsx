import React, { useState } from "react";
import { Card, CardContent, Typography, TextField, Button, Box } from "@mui/material";
import SongCard from "./SongCard";
import type { Song } from "../../types/Song";

const SearchPanel: React.FC = () => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [year, setYear] = useState("");
  const [album, setAlbum] = useState("");

  const [results, setResults] = useState<Song[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasQueried, setHasQueried] = useState(false);

  const handleQuery = async () => {
    setError("");
    setHasQueried(true);

    const payload: Partial<Song> = {};

    if (title.trim()) payload.title = title.trim();
    if (artist.trim()) payload.artist = artist.trim();
    if (year.trim()) payload.year = year.trim();
    if (album.trim()) payload.album = album.trim();

    if (Object.keys(payload).length === 0) {
      setResults([]);
      setError("At least one field must be completed.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://34.225.214.178/music", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch music data.");
      }

      const data = await response.json();

      // API response format:
      // {
      //   jpg: [...],
      //   details: [{ title, artist, album, year, img_url, ... }]
      // }
      const retrievedSongs: Song[] = data.details || [];

      if (retrievedSongs.length === 0) {
        setResults([]);
        setError("No result is retrieved. Please query again.");
      } else {
        setResults(retrievedSongs);
      }
    } catch (err) {
      console.error(err);
      setResults([]);
      setError("No result is retrieved. Please query again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (song: Song) => {
    console.log("Subscribe clicked for:", song);

    // later here you can call your backend /subscribe API
    // and also update the subscription area
  };

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
            onClick={handleQuery}
            disabled={loading}
            sx={{ color: "white", borderColor: "gray", py: 1.5 }}
          >
            {loading ? "Loading..." : "Query"}
          </Button>
        </Box>

        <Typography variant="subtitle2" sx={{ opacity: 0.8, mt: 4, mb: 2 }}>
          RESULTS
        </Typography>

        {error && (
          <Typography sx={{ color: "#ff8a80", mb: 2 }}>
            {error}
          </Typography>
        )}

        {!error && hasQueried && results.length > 0 && (
          <>
            {results.map((song, index) => (
              <SongCard
                key={`${song.title}-${song.year}-${index}`}
                song={song}
                buttonText="Subscribe"
                onButtonClick={handleSubscribe}
              />
            ))}
          </>
        )}
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