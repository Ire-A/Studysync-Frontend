import { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  function loadUserFromStorage() {
    const savedUser = localStorage.getItem("studysyncUser");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
    }
  }

  useEffect(() => {
    loadUserFromStorage();

    window.addEventListener("studysyncAuthChanged", loadUserFromStorage);

    return () => {
      window.removeEventListener("studysyncAuthChanged", loadUserFromStorage);
    };
  }, []);

  async function handleLogout() {
    try {
      await logoutUser();
    } catch (err) {
      console.log("Logout error:", err.message);
    }

    localStorage.removeItem("studysyncUser");
    window.dispatchEvent(new Event("studysyncAuthChanged"));
    navigate("/");
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: "#5D4037" }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            color: "white",
            textDecoration: "none",
            fontFamily: "'Georgia', serif",
          }}
        >
          StudySync
        </Typography>

        <Box>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>

          {user ? (
            <>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>

              <Button color="inherit" component={Link} to="/groups">
                Groups
              </Button>

              <Button color="inherit" component={Link} to="/tasks">
                Tasks
              </Button>

              <Button color="inherit" component={Link} to="/resources">
                Resources
              </Button>

              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>

              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;