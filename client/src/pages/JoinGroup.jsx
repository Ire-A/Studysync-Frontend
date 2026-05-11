// JoinGroup.jsx, Allows an authenticated user to join an existing study group by entering its Group ID.
// This component calls the backend endpoint POST /api/groups/:id/join and then redirects to the groups list.

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Typography, TextField, Button, Box, Alert, CircularProgress } from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

// Colour palette, kept consistent with Dashboard and Groups pages so every screen shares the same visual language.
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

function JoinGroup() {
  const navigate = useNavigate();
  const [groupId, setGroupId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handles form submission, sends a POST request to the join endpoint.
  const handleJoin = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    // Basic client‑side validation: Group ID cannot be empty.
    if (!groupId.trim()) {
      setError("Please enter a Group ID.");
      return;
    }

    setLoading(true);
    try {
      // Uses the environment variable VITE_API_URL to construct the full backend URL.
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/groups/${groupId}/join`,
        {
          method: "POST",
          credentials: "include", // sends the session cookie so the backend knows who is making the request
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to join group");

      setSuccess("Successfully joined the group!");
      // After a short delay, navigate to the groups list so the user sees the new group.
      setTimeout(() => navigate("/groups"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: t.bgPage, minHeight: "100vh" }}>
      {/* HERO BANNER Gradient background matching all other authenticated pages.
          Uses a white wave at the bottom for a smooth transition.
      */}
      <Box
        sx={{
          background: `linear-gradient(145deg, ${t.espresso} 0%, ${t.mocha} 55%, ${t.taupe} 100%)`,
          pt: { xs: 6, md: 8 },
          pb: { xs: 10, md: 12 },
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 15% 50%, rgba(255,255,255,0.04) 0%, transparent 55%), radial-gradient(circle at 85% 20%, rgba(255,220,150,0.06) 0%, transparent 50%)",
            pointerEvents: "none", // ensures the gradient does not block clicks
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
        <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
          {/* Back button to return to the groups overview, uses client‑side navigation */}
          <Button
            component={Link}
            to="/groups"
            startIcon={<ArrowBackIcon />}
            sx={{
              color: "rgba(255,255,255,0.65)",
              fontFamily: "'Georgia', serif",
              textTransform: "none",
              fontSize: "0.85rem",
              mb: 3,
              px: 0,
              "&:hover": { color: t.white, backgroundColor: "transparent" },
            }}
          >
            All Groups
          </Button>

          {/* Icon, reinforces the purpose of the page */}
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              backgroundColor: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: t.gold,
              mb: 2,
            }}
          >
            <GroupAddIcon sx={{ fontSize: "1.6rem" }} />
          </Box>

          <Typography
            sx={{
              fontFamily: "'Georgia', serif",
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "2.6rem" },
              color: t.white,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              mb: 1,
            }}
          >
            Join a Study Group
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.65)",
              fontFamily: "'Georgia', serif",
              fontSize: "1rem",
            }}
          >
            Enter the Group ID shared by the group creator.
          </Typography>
        </Container>
      </Box>

      {/* FORM CARD White card that sits partially over the banner (negative margin top).
          Contains the input field and submission button.
      */}
      <Container maxWidth="sm" sx={{ mt: { xs: -4, md: -5 }, pb: 8, position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            backgroundColor: t.white,
            borderRadius: 4,
            border: `1px solid ${t.border}`,
            boxShadow: "0 8px 40px rgba(62,39,35,0.08)",
            p: { xs: 3, sm: 4 },
          }}
        >
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 2.5, fontFamily: "'Georgia', serif", fontSize: "0.88rem" }}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
              icon={<CheckCircleOutlinedIcon fontSize="inherit" />}
              sx={{ mb: 3, borderRadius: 2.5, fontFamily: "'Georgia', serif", fontSize: "0.88rem" }}
            >
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleJoin}>
            <Typography
              sx={{
                fontFamily: "'Georgia', serif",
                fontWeight: 700,
                fontSize: "0.82rem",
                color: t.espresso,
                mb: 0.75,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Group ID
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. 67f8a2b3c4d5e6f7a8b9c0d1"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              required
              helperText="Ask the group creator to copy their Group ID from the group page."
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,
                  fontFamily: "'Georgia', serif",
                  fontSize: "0.95rem",
                  backgroundColor: t.parchment,
                  "& fieldset": { borderColor: t.border },
                  "&:hover fieldset": { borderColor: t.blush },
                  "&.Mui-focused fieldset": { borderColor: t.walnut, borderWidth: 2 },
                },
                "& .MuiFormHelperText-root": {
                  fontFamily: "'Georgia', serif",
                  fontSize: "0.78rem",
                  color: t.muted,
                  mt: 0.75,
                },
              }}
            />

            <Button
              fullWidth
              type="submit"
              disabled={loading || !!success}
              sx={{
                mt: 3,
                py: 1.4,
                borderRadius: "999px",
                backgroundColor: loading || success ? t.border : t.espresso,
                color: loading || success ? t.muted : t.white,
                fontFamily: "'Georgia', serif",
                fontWeight: 700,
                fontSize: "0.95rem",
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: t.walnut,
                  boxShadow: "0 4px 20px rgba(62,39,35,0.2)",
                },
                transition: "all 0.2s ease",
              }}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: t.muted }} />
              ) : success ? (
                "Redirecting…"
              ) : (
                "Join Group"
              )}
            </Button>
          </Box>

          {/* Link to create a new group for users who don't have an ID */}
          <Box
            sx={{
              mt: 3,
              pt: 3,
              borderTop: `1px solid ${t.border}`,
              textAlign: "center",
            }}
          >
            <Typography sx={{ fontFamily: "'Georgia', serif", fontSize: "0.85rem", color: t.muted }}>
              Don't have an ID?{" "}
              <Typography
                component={Link}
                to="/create-group"
                sx={{
                  color: t.walnut,
                  fontWeight: 700,
                  textDecoration: "none",
                  "&:hover": { color: t.espresso, textDecoration: "underline" },
                }}
              >
                Create your own group
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default JoinGroup;