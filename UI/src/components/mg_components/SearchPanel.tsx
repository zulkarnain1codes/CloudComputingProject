import React, { useState } from "react";
import { Card, CardContent, TextField, Button, Typography } from "@mui/material";
import SongCard from "./SongCard";
import { subscribeMusic } from "../../services/musicApi";
import { getApiUrl } from '../../config/apiConfig';

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

  const handleSearch = async () => {
    // Assignment requirement: at least one field must be filled
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
      const response = await fetch(`${getApiUrl()}/music`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(schema),
      });

      const data = await response.json();

      if (!data.details || data.details.length === 0) {
        setNoResults(true);
        setSongs([]);
        return;
      }
      setNoResults(false);

      const combined = data.details.map((item: any, index: number) => ({
        ...item,
        image_url: data.jpg[index],
      }));

      setSongs(combined);

    } catch (err) {
      alert("Error fetching data");
    }
  };

  const handleSubscribe = async (song: any) => {
    const userData = localStorage.getItem("user");
    if (!userData) return;

    const user = JSON.parse(userData);

    await subscribeMusic(user.email, song);
    onSubscribe?.();  // triggers subscription list to refresh
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
    </Card>
  );
};

export default SearchPanel;