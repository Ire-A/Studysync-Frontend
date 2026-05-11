// Groups.jsx, Lists of all study groups the user belongs to
// Shows each group as a card with name, description, member count, and a coloured accent.
// Provides buttons to create a new group or join an existing one.

import { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent, Button, Grid, Box,
  CircularProgress, Alert, Chip, Avatar, } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getGroups } from "../services/api";

// We still use consistent colour palette, matches the rest of the app.
const t = {
  espresso: "#3E2723",
  walnut: "#5D4037",
  mocha: "#6D4C41",
  taupe: "#8D6E63",
  blush: "#A1887F",
  parchment: "#FBF3EF",
  border: "#EDE0DC",
  gold: "#FFD54F",
  goldHover: "#FFE082",
  muted: "#795548",
  white: "#FFFFFF",
  bgPage: "#FDFAF8",
};

// Array of accent colours for group cards and cycles through them so each card gets a unique top stripe.
const accentColors = ["#5D4037", "#6D4C41", "#8D6E63", "#4E342E", "#795548"];

function Groups() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect to login if no user is stored in localStorage.
  useEffect(() => {
    const user = localStorage.getItem("studysyncUser");
    if (!user) navigate("/login");
  }, [navigate]);

  // Fetch the user’s groups from the backend using the session cookie.
  useEffect(() => {
    async function fetchGroups() {
      try {
        setLoading(true);
        const data = await getGroups();
        setGroups(data.groups || []);
      } catch (err) {
        setError(err.message);
        if (err.message.includes("Unauthorised")) navigate("/login");
      } finally {
        setLoading(false);
      }
    }
    fetchGroups();
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress sx={{ color: t.mocha }} />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: t.bgPage, minHeight: "100vh" }}>
      {/* HERO BANNER, Gradient background with wave, same style as Dashboard and GroupDetail. */}
      <Box
        sx={{
          background: `linear-gradient(145deg, ${t.espresso} 0%, ${t.mocha} 55%, ${t.taupe} 100%)`,
          pt: { xs: 6, md: 8 },
          pb: { xs: 8, md: 10 },
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 15% 50%, rgba(255,255,255,0.04) 0%, transparent 55%), radial-gradient(circle at 85% 20%, rgba(255,220,150,0.06) 0%, transparent 50%)",
            pointerEvents: "none",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -2,
            left: 0,
            right: 0,
            height: 64,
            background: t.bgPage,
            clipPath: "ellipse(55% 100% at 50% 100%)",
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          {/* Small badge, indicates the page section */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 0.5,
              mb: 2,
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.25)",
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
          >
            <Box sx={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: t.gold }} />
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.85)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontFamily: "'Georgia', serif",
              }}
            >
              Collaboration
            </Typography>
          </Box>

          {/* Header row: title + subtitle on left, action buttons on right */}
          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: "'Georgia', serif",
                  fontWeight: 700,
                  fontSize: { xs: "2rem", md: "2.8rem" },
                  color: t.white,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                Study Groups
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.65)",
                  mt: 1,
                  fontFamily: "'Georgia', serif",
                  fontSize: "1rem",
                }}
              >
                {groups.length > 0
                  ? `You're a member of ${groups.length} group${groups.length !== 1 ? "s" : ""}.`
                  : "Create or join a group to get started."}
              </Typography>
            </Box>

            {/* Two buttons: Join Group (glass style) and Create Group (gold solid) */}
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              <Button
                component={Link}
                to="/join-group"
                startIcon={<GroupAddIcon />}
                sx={{
                  color: t.white,
                  border: "1px solid rgba(255,255,255,0.35)",
                  fontFamily: "'Georgia', serif",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  px: 2.5,
                  py: 1,
                  borderRadius: "999px",
                  textTransform: "none",
                  backdropFilter: "blur(8px)",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  "&:hover": { borderColor: "rgba(255,255,255,0.7)", backgroundColor: "rgba(255,255,255,0.1)" },
                  transition: "all 0.2s ease",
                }}
              >
                Join Group
              </Button>
              <Button
                component={Link}
                to="/create-group"
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: t.gold,
                  color: t.espresso,
                  fontFamily: "'Georgia', serif",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  px: 2.5,
                  py: 1,
                  borderRadius: "999px",
                  textTransform: "none",
                  boxShadow: "0 4px 20px rgba(255,213,79,0.3)",
                  "&:hover": { backgroundColor: t.goldHover, boxShadow: "0 6px 28px rgba(255,213,79,0.45)", transform: "translateY(-1px)" },
                  transition: "all 0.2s ease",
                }}
              >
                Create Group
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* MAIN CONTENT */}
      <Container maxWidth="lg" sx={{ pb: 8, mt: { xs: -1, md: -2 } }}>
        {/* Display any error from the API */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3, fontFamily: "'Georgia', serif" }}>
            {error}
          </Alert>
        )}

        {/* If the user has no groups, show an empty state with helpful actions */}
        {groups.length === 0 && !error ? (
          <Box
            sx={{
              textAlign: "center",
              py: 10,
              px: 3,
              border: `1px dashed ${t.blush}`,
              borderRadius: 4,
              backgroundColor: t.parchment,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                backgroundColor: t.border,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2.5,
                color: t.taupe,
              }}
            >
              <PeopleAltIcon sx={{ fontSize: "2rem" }} />
            </Box>
            <Typography sx={{ fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: "1.2rem", color: t.espresso, mb: 1 }}>
              No groups yet
            </Typography>
            <Typography sx={{ color: t.muted, fontSize: "0.9rem", mb: 3, fontFamily: "'Georgia', serif" }}>
              Create a group or ask a classmate to share their Group ID.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
              <Button
                component={Link}
                to="/create-group"
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: t.espresso,
                  color: t.white,
                  fontFamily: "'Georgia', serif",
                  fontWeight: 700,
                  borderRadius: "999px",
                  textTransform: "none",
                  px: 3,
                  "&:hover": { backgroundColor: t.walnut },
                }}
              >
                Create a Group
              </Button>
              <Button
                component={Link}
                to="/join-group"
                variant="outlined"
                startIcon={<GroupAddIcon />}
                sx={{
                  borderColor: t.mocha,
                  color: t.mocha,
                  fontFamily: "'Georgia', serif",
                  fontWeight: 600,
                  borderRadius: "999px",
                  textTransform: "none",
                  px: 3,
                  "&:hover": { borderColor: t.espresso, color: t.espresso, backgroundColor: t.parchment },
                }}
              >
                Join a Group
              </Button>
            </Box>
          </Box>
        ) : (
          // GRID OF GROUP CARDS, each card represents a single group
          <Grid container spacing={3}>
            {groups.map((group, i) => {
              // Cycle through accent colours to give each card a unique top stripe
              const accent = accentColors[i % accentColors.length];
              const initials = group.name 
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <Grid item xs={12} sm={6} md={4} key={group._id}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      borderRadius: 4,
                      border: `1px solid ${t.border}`,
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        borderColor: t.blush,
                        boxShadow: "0 12px 40px rgba(93,64,55,0.1)",
                        transform: "translateY(-4px)",
                      },
                    }}
                  >
                    {/* Coloured top stripe, visual accent */}
                    <Box sx={{ height: 6, backgroundColor: accent }} />

                    <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
                      {/* Group avatar (initials) + name */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                        <Avatar
                          sx={{
                            width: 42,
                            height: 42,
                            backgroundColor: accent,
                            fontFamily: "'Georgia', serif",
                            fontWeight: 700,
                            fontSize: "0.9rem",
                          }}
                        >
                          {initials}
                        </Avatar>
                        <Typography
                          sx={{
                            fontFamily: "'Georgia', serif",
                            fontWeight: 700,
                            fontSize: "1rem",
                            color: t.espresso,
                            lineHeight: 1.25,
                          }}
                        >
                          {group.name}
                        </Typography>
                      </Box>

                      {/* Group description, truncated to 3 lines */}
                      <Typography
                        sx={{
                          color: t.muted,
                          fontSize: "0.85rem",
                          lineHeight: 1.6,
                          fontFamily: "'Georgia', serif",
                          flex: 1,
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {group.description || "No description provided."}
                      </Typography>

                      {/* Footer: member count chip + “View” button */}
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Chip
                          icon={<PeopleAltIcon sx={{ fontSize: "0.85rem !important" }} />}
                          label={`${group.members?.length || 0} member${group.members?.length !== 1 ? "s" : ""}`}
                          size="small"
                          sx={{
                            backgroundColor: t.parchment,
                            color: t.muted,
                            border: `1px solid ${t.border}`,
                            fontFamily: "'Georgia', serif",
                            fontSize: "0.75rem",
                            height: 26,
                          }}
                        />
                        <Button
                          component={Link}
                          to={`/group/${group._id}`}
                          endIcon={<ArrowForwardIcon sx={{ fontSize: "0.85rem !important" }} />}
                          sx={{
                            color: t.walnut,
                            fontFamily: "'Georgia', serif",
                            fontWeight: 700,
                            fontSize: "0.82rem",
                            textTransform: "none",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            "&:hover": { backgroundColor: t.parchment, color: t.espresso },
                            transition: "all 0.18s ease",
                          }}
                        >
                          View
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default Groups;