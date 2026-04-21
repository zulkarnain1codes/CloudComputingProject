import React from "react";
import { Box, Grid } from "@mui/material";
import Navbar from "../components/mg_components/Navbar";
import UserCard from "../components/mg_components/UserCard";
import SubscriptionList from "../components/mg_components/SubscriptionList";
import SearchPanel from "../components/mg_components/SearchPanel";
import { useNavigate } from "react-router-dom";


const MainPage: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) navigate("/login");
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#1e1e1e",
        color: "white",
      }}
    >
      <Navbar />

      <Box sx={{ p: 4 }}>
        <Grid container spacing={3}>
          
          {/* LEFT SIDE → SEARCH */}
          <Grid item xs={12} md={8}>
            <SearchPanel />
          </Grid>

          {/* RIGHT SIDE → USER + SUBSCRIPTIONS */}
          <Grid item xs={12} md={4}>
            <UserCard />
            <SubscriptionList />
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
};

export default MainPage;

















// import React from "react";
// import { Box, Grid } from "@mui/material";
// import Navbar from "../components/mg_components/Navbar";
// import UserCard from "../components/mg_components/UserCard";
// import SubscriptionList from "../components/mg_components/SubscriptionList";
// import SearchPanel from "../components/mg_components/SearchPanel";

// const MainPage: React.FC = () => {
//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         width: "100%",
//         backgroundColor: "#1e1e1e",
//         color: "white",
//       }}
//     >
//       <Navbar />

//       <Box sx={{ p: 4 }}>
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={4}>
//             <UserCard />
//             <SubscriptionList />
//           </Grid>

//           <Grid item xs={12} md={8}>
//             <SearchPanel />
//           </Grid>
//         </Grid>
//       </Box>
//     </Box>
//   );
// };

// export default MainPage;


