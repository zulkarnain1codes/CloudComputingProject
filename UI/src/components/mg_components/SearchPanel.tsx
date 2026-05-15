import React, { useState } from "react";
import { Card, CardContent, TextField, Button, Typography, Snackbar, Alert } from "@mui/material";
import SongCard from "./SongCard";
import { subscribeMusic } from "../../api/api";
import { getMusic } from "../../api/api";

interface SearchPanelProps {
  onSubscribe?: () => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ onSubscribe }) => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [year, setYear] = useState("");
  const [album, setAlbum] = useState("");
  const [songs, setSongs] = useState<any[]>([]);
  const [noResults, setNoResults] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "warning" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSearch = async () => {
    if (!title && !artist && !year && !album) {
      alert("Please fill at least one field");
      return;
    }

    const schema: any = {};
    if (title) schema.title = title;
    if (artist) schema.artist = artist;
    if (year) schema.year = year;
    if (album) schema.album = album;

    try {
      const data = await getMusic(schema);

      if (!data.details || data.details.length === 0) {
        setNoResults(true);
        setSongs([]);
        return;
      }
      setNoResults(false);
      setSongs(data.details);

    } catch (err) {
      alert("Error fetching data");
    }
  };

  const handleSubscribe = async (song: any) => {
    const userData = sessionStorage.getItem("user"); // changed from localStorage
    if (!userData) return;

    const user = JSON.parse(userData);
    const response = await subscribeMusic(user.email, song);

    if (response.message === "Already subscribed") {
      setSnackbar({ open: true, message: "Already subscribed to this song!", severity: "warning" });
    } else {
      setSnackbar({ open: true, message: "Subscribed successfully!", severity: "success" });
      onSubscribe?.();
    }
  };

  return (
    <Card sx={{ backgroundColor: "#2f2f2f", color: "white", borderRadius: 2 }}>
      <CardContent>
        <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 2 }}>
          QUERY MUSIC
        </Typography>

        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Artist"
          fullWidth
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Year"
          fullWidth
          value={year}
          onChange={(e) => setYear(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Album"
          fullWidth
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button variant="contained" fullWidth onClick={handleSearch}>
          Query
        </Button>

        {noResults && (
          <Typography sx={{ mt: 2, color: "#ff6b6b" }}>
            No result is retrieved. Please query again
          </Typography>
        )}

        {songs.map((song, index) => (
          <SongCard
            key={index}
            song={song}
            buttonText="Subscribe"
            onButtonClick={handleSubscribe}
          />
        ))}
      </CardContent>

      {/* Snackbar for subscribe feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default SearchPanel;