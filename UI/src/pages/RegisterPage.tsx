import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          user_name: username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Registration failed");
        setMessageType("error");
      } else {
        setMessage("Registration successful");
        setMessageType("success");

        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      setMessage("Could not connect to server");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const darkFieldSx = {
    "& .MuiInputBase-input": {
      color: "#ffffff",
    },
    "& .MuiInputLabel-root": {
      color: "#bdbdbd",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#ffffff",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#555",
      },
      "&:hover fieldset": {
        borderColor: "#888",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#1976d2",
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#121212",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 420,
          borderRadius: 3,
          backgroundColor: "#1e1e1e",
          color: "white",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Register
        </Typography>

        <Typography variant="body2" sx={{ mb: 3, color: "#bdbdbd" }}>
          Create your RAGA account
        </Typography>

        {message && (
          <Alert
            severity={messageType === "success" ? "success" : "error"}
            sx={{ mb: 2 }}
          >
            {message}
          </Alert>
        )}

        <Box component="form" onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            slotProps={{
              inputLabel: {
                sx: { color: "#bdbdbd" },
              },
            }}
            sx={darkFieldSx}
          />

          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            slotProps={{
              inputLabel: {
                sx: { color: "#bdbdbd" },
              },
            }}
            sx={darkFieldSx}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            slotProps={{
              inputLabel: {
                sx: { color: "#bdbdbd" },
              },
            }}
            sx={darkFieldSx}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? "Registering..." : "REGISTER"}
          </Button>
        </Box>

        <Typography variant="body2" align="center">
          Already have an account?{" "}
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate("/")}
            underline="hover"
          >
            Go to Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default RegisterPage;