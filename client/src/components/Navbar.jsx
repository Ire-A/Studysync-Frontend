// Navbar.jsx, The main navigation bar that appears on every page.
// It adapts to screen size: desktop shows horizontal links, mobile shows a hamburger drawer.
// The navigation links change based on whether the user is logged in.

import { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List,
  ListItem, ListItemButton, ListItemText, Divider, useMediaQuery, useTheme,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { logoutUser } from "../services/api";

// Colour palette, matches the warm brown and gold theme used across the entire app.
const t = {
  espresso: "#3E2723",
  walnut: "#5D4037",
  mocha: "#6D4C41",
  gold: "#FFD54F",
  goldHover: "#FFE082",
  white: "#FFFFFF",
};

// Navigation links: each has a path and a flag indicating if authentication is required.
// Links that require auth are only shown when the user is logged in.
const navLinks = [
  { label: "Home", to: "/", authRequired: false },
  { label: "Dashboard", to: "/dashboard", authRequired: true },
  { label: "Groups", to: "/groups", authRequired: true },
  { label: "Tasks", to: "/tasks", authRequired: true },
  { label: "Resources", to: "/resources", authRequired: true },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();      // used to highlight the active link
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // detects screen size
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Reads the logged‑in user from localStorage.
  // This is called on mount and whenever the custom auth event is fired.
  function loadUserFromStorage() {
    const savedUser = localStorage.getItem("studysyncUser");
    setUser(savedUser ? JSON.parse(savedUser) : null);
  }

  // Set up the event listener for authentication changes (e.g., login/logout from other components).
  useEffect(() => {
    loadUserFromStorage();
    window.addEventListener("studysyncAuthChanged", loadUserFromStorage);
    return () => window.removeEventListener("studysyncAuthChanged", loadUserFromStorage);
  }, []);

  // Logout handler, calls the backend logout endpoint, clears local storage,
  // closes the mobile drawer if open, and navigates to the home page.
  async function handleLogout() {
    try {
      await logoutUser();
    } catch (err) {
      console.log("Logout error:", err.message);
    }
    localStorage.removeItem("studysyncUser");
    window.dispatchEvent(new Event("studysyncAuthChanged"));
    setDrawerOpen(false);
    navigate("/");
  }

  // Filter the navigation links based on authentication status.
  // If a link requires auth and there is no user, it is hidden.
  const visibleLinks = navLinks.filter(
    (l) => !l.authRequired || (l.authRequired && user)
  );

  // Helper to check if a given route is currently active (used for styling).
  const isActive = (to) => location.pathname === to;

  /* Desktop navigation button component It uses React Router's Link for client‑side navigation.
     The active link gets a gold colour and a small gold dot underneath. */
  const NavBtn = ({ to, children }) => (
    <Button
      component={Link}
      to={to}
      sx={{
        color: isActive(to) ? t.gold : "rgba(255,255,255,0.82)",
        fontFamily: "'Georgia', serif",
        fontWeight: isActive(to) ? 700 : 500,
        fontSize: "0.88rem",
        px: 1.5,
        py: 0.75,
        borderRadius: 2,
        position: "relative",
        textTransform: "none",
        letterSpacing: "0.01em",
        "&:hover": {
          color: t.white,
          backgroundColor: "rgba(255,255,255,0.08)",
        },
        ...(isActive(to) && {
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 4,
            left: "50%",
            transform: "translateX(-50%)",
            width: 4,
            height: 4,
            borderRadius: "50%",
            backgroundColor: t.gold,
          },
        }),
        transition: "all 0.18s ease",
      }}
    >
      {children}
    </Button>
  );

  return (
    <>
      {/* AppBar, sticky header with a gradient background and subtle border */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: `linear-gradient(90deg, ${t.espresso} 0%, ${t.walnut} 100%)`,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 }, minHeight: { xs: 60, md: 68 } }}>
          {/* Logo – links to the home page */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              color: t.white,
              textDecoration: "none",
              fontFamily: "'Georgia', serif",
              fontSize: "1.3rem",
              letterSpacing: "-0.01em",
              "& span": { color: t.gold },
            }}
          >
            Study<span>Sync</span>
          </Typography>

          {/* Desktop navigation links, only shown on medium screens and above */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 2 }}>
              {visibleLinks.map((l) => (
                <NavBtn key={l.to} to={l.to}>
                  {l.label}
                </NavBtn>
              ))}
            </Box>
          )}

          {/* Desktop authentication buttons (login / register or logout) */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1 }}>
              {user ? (
                // If logged in, show a gold logout button
                <Button
                  onClick={handleLogout}
                  sx={{
                    color: t.espresso,
                    backgroundColor: t.gold,
                    fontFamily: "'Georgia', serif",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    px: 2.5,
                    py: 0.75,
                    borderRadius: "999px",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: t.goldHover,
                    },
                    transition: "all 0.18s ease",
                  }}
                >
                  Log out
                </Button>
              ) : (
                // Otherwise, show Login and Get started buttons
                <>
                  <Button
                    component={Link}
                    to="/login"
                    sx={{
                      color: "rgba(255,255,255,0.85)",
                      fontFamily: "'Georgia', serif",
                      fontWeight: 500,
                      fontSize: "0.88rem",
                      px: 2,
                      borderRadius: "999px",
                      textTransform: "none",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.08)", color: t.white },
                      transition: "all 0.18s ease",
                    }}
                  >
                    Log in
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    sx={{
                      color: t.espresso,
                      backgroundColor: t.gold,
                      fontFamily: "'Georgia', serif",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      px: 2.5,
                      py: 0.75,
                      borderRadius: "999px",
                      textTransform: "none",
                      "&:hover": { backgroundColor: t.goldHover },
                      transition: "all 0.18s ease",
                    }}
                  >
                    Get started
                  </Button>
                </>
              )}
            </Box>
          )}

          {/* Mobile hamburger icon opens the side drawer */}
          {isMobile && (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ color: t.white, ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile drawer, slides in from the right when the hamburger is clicked */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 260,
            backgroundColor: t.espresso,
            color: t.white,
          },
        }}
      >
        {/* Drawer header: logo and close button */}
        <Box sx={{ px: 2, pt: 2, pb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: "1.1rem" }}>
            Study<span style={{ color: t.gold }}>Sync</span>
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "rgba(255,255,255,0.7)" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 1 }} />

        {/* Navigation links list same as desktop but vertical */}
        <List disablePadding>
          {visibleLinks.map((l) => (
            <ListItem key={l.to} disablePadding>
              <ListItemButton
                component={Link}
                to={l.to}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  px: 3,
                  py: 1.2,
                  fontFamily: "'Georgia', serif",
                  fontWeight: isActive(l.to) ? 700 : 400,
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.07)" },
                }}
              >
                <ListItemText
                  primary={l.label}
                  primaryTypographyProps={{
                    fontFamily: "'Georgia', serif",
                    fontSize: "0.95rem",
                    color: isActive(l.to) ? t.gold : t.white, 
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mt: 1, mb: 2 }} />

        {/* Drawer authentication buttons match the desktop style but full width */}
        <Box sx={{ px: 3 }}>
          {user ? (
            <Button
              fullWidth
              onClick={handleLogout}
              sx={{
                backgroundColor: t.gold,
                color: t.espresso,
                fontFamily: "'Georgia', serif",
                fontWeight: 700,
                borderRadius: "999px",
                textTransform: "none",
                py: 1,
                "&:hover": { backgroundColor: t.goldHover },
              }}
            >
              Log out
            </Button>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Button
                fullWidth
                component={Link}
                to="/login"
                onClick={() => setDrawerOpen(false)}
                sx={{
                  borderColor: "rgba(255,255,255,0.3)",
                  color: t.white,
                  border: "1px solid",
                  fontFamily: "'Georgia', serif",
                  borderRadius: "999px",
                  textTransform: "none",
                  py: 1,
                  "&:hover": { borderColor: t.white, backgroundColor: "rgba(255,255,255,0.06)" },
                }}
              >
                Log in
              </Button>
              <Button
                fullWidth
                component={Link}
                to="/register"
                onClick={() => setDrawerOpen(false)}
                sx={{
                  backgroundColor: t.gold,
                  color: t.espresso,
                  fontFamily: "'Georgia', serif",
                  fontWeight: 700,
                  borderRadius: "999px",
                  textTransform: "none",
                  py: 1,
                  "&:hover": { backgroundColor: t.goldHover },
                }}
              >
                Get started
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;