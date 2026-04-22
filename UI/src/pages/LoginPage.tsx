import React, { useState } from 'react';
import {Box, Button, TextField, Typography} from '@mui/material';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;
const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                setError("Invalid email or password");
                return;
            }

            const data = await response.json();
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/main");
        } catch {
            setError("Error");
        }
    };

    return (
        <Box
            sx={{
                height: "100vh",
                width: "100vw",
                backgroundColor: "#121212",
                color: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 3,
            }}
        >
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Login
            </Typography>


            <TextField
                label = "Email"
                variant = "outlined"
                value = {email}
                onChange = {(e) => setEmail(e.target.value)}
                sx = {{ input: { color: "white" }, label: { color: "grey" }, width: 300 }}
            />
            <TextField
                label = "Password"
                type = "password"
                variant = "outlined"
                value = {password}
                onChange = {(e) => setPassword(e.target.value)}
                sx = {{ input: { color: "white" }, label: { color: "grey" }, width: 300 }}
            />

            {error && (
                <Typography color="error">{error}</Typography>
            )}

            <Button variant = "contained" size = "large" onClick = {handleLogin}>
                Login
            </Button>

            <Button variant = "outlined" size = "large" onClick = {() => navigate("/register")}>
                Register
            </Button>
        </Box>
        );
    };

export default LoginPage;