import { Box, Grid } from "@mui/material";
import Navbar from "../components/mg_components/Navbar";
import UserCard from "../components/mg_components/UserCard";
import SubscriptionList from "../components/mg_components/SubscriptionList";
import SearchPanel from "../components/mg_components/SearchPanel";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  // Incrementing this triggers SubscriptionList to reload
  const [refreshSubs, setRefreshSubs] = useState(0);

  React.useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) navigate("/login");
  }, [navigate]);

  return (
    <Box sx={{ minHeight: "100vh", width: "100%", backgroundColor: "#1e1e1e", color: "white" }}>
      <Navbar />
      <Box sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <SearchPanel onSubscribe={() => setRefreshSubs(r => r + 1)} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <UserCard />
            <SubscriptionList refreshTrigger={refreshSubs} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default MainPage;