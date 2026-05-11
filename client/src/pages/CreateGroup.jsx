// CreateGroup.jsx Form to create a new study group. Submits group name and description to the backend, then redirects to /groups.

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container, Typography, TextField, Button,
  Box, Alert, CircularProgress,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { createGroup } from "../services/api";

/* Palette tokens, same warm brown set used across the whole app. Defined here rather than imported so each file stays self-contained. */
const t = {
  espresso: "#3E2723",
  walnut:   "#5D4037",
  mocha:    "#6D4C41",
  taupe:    "#8D6E63",
  blush:    "#A1887F",
  parchment:"#FBF3EF",
  border:   "#EDE0DC",
  gold:     "#FFD54F",
  muted:    "#795548",
  white:    "#FFFFFF",
  bgPage:   "#FDFAF8",
};

/*Shared TextField styles, defined outside the component to avoid recreating the object on every render. Matches the input style used
  in Login.jsx, JoinGroup.jsx, and Tasks.jsx for consistency */
const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    fontFamily: "'Georgia', serif",
    fontSize: "0.92rem",
    backgroundColor: t.parchment,
    "& fieldset": { borderColor: t.border },
    "&:hover fieldset": { borderColor: t.blush },
    "&.Mui-focused fieldset": { borderColor: t.walnut, borderWidth: 2 },
  },
  "& .MuiInputLabel-root": { fontFamily: "'Georgia', serif", color: t.taupe },
  "& .MuiInputLabel-root.Mui-focused": { color: t.walnut },
};

/* FieldLabel, uppercase label above each input, consistent with the rest of the app */
function FieldLabel({ children }) {
  return (
    <Typography
      sx={{
        fontFamily: "'Georgia', serif",
        fontWeight: 700,
        fontSize: "0.75rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: t.taupe,
        mb: 0.75,
        mt: 2.5,
      }}
    >
      {children}
    </Typography>
  );
}

/* Main CreateGroup component */
function CreateGroup() {
  const navigate = useNavigate();
  const [groupName,    setGroupName]    = useState("");
  const [description,  setDescription]  = useState("");
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [success,      setSuccess]      = useState("");

  /* Client-side validation requires a name and at least 10 characters for the description to encourage meaningful group descriptions. */
  const validate = () => {
    if (!groupName.trim()) {
      setError("Group name is required.");
      return false;
    }
    if (description.trim().length < 10) {
      setError("Description must be at least 10 characters.");
      return false;
    }
    return true;
  };

  // Submit the new group, show a success message, then redirect to /groups
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await createGroup({ name: groupName, description });
      setSuccess(response.message || "Group created successfully!");
      setGroupName("");
      setDescription("");
      // Give the user a moment to read the success message before redirecting
      setTimeout(() => navigate("/groups"), 1500);
    } catch (err) {
      setError(err.message);
      if (err.message.includes("Unauthorised")) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: t.bgPage, minHeight: "100vh" }}>
      {/* Page banner, gradient + elliptical wave, same as all other pages */}
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
        <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
          {/* Back link */}
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

          {/* Page icon */}
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
            <GroupsIcon sx={{ fontSize: "1.6rem" }} />
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
            Create a Study Group
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.65)", fontFamily: "'Georgia', serif", fontSize: "1rem" }}>
            Give your group a name and describe what you'll work on together.
          </Typography>
        </Container>
      </Box>

      {/* Form card, it overlaps the banner slightly via negative mt */}
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
          {/* Error and success alerts, only rendered when there is a message */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5, fontFamily: "'Georgia', serif", fontSize: "0.88rem" }}>
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

          <Box component="form" onSubmit={handleSubmit}>
            <FieldLabel>Group Name</FieldLabel>
            <TextField
              fullWidth
              placeholder="e.g. Final Year Project Team"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              disabled={loading}
              required
              sx={{ ...inputSx, mt: 0 }}
            />

            <FieldLabel>Description</FieldLabel>
            <TextField
              fullWidth
              placeholder="What will this group study or work on?"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              helperText="At least 10 characters."
              sx={{
                ...inputSx,
                mt: 0,
                "& .MuiFormHelperText-root": {
                  fontFamily: "'Georgia', serif",
                  fontSize: "0.78rem",
                  color: t.muted,
                  mt: 0.75,
                },
              }}
            />

            {/* Submit button dims while the request is in-flight */}
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
                "&:hover": { backgroundColor: t.walnut, boxShadow: "0 4px 20px rgba(62,39,35,0.2)" },
                transition: "all 0.2s ease",
              }}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: t.muted }} />
              ) : success ? (
                "Redirecting…"
              ) : (
                "Create Group"
              )}
            </Button>
          </Box>

          {/* Sign-post to JoinGroup for users who already have an ID */}
          <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${t.border}`, textAlign: "center" }}>
            <Typography sx={{ fontFamily: "'Georgia', serif", fontSize: "0.85rem", color: t.muted }}>
              Have a Group ID?{" "}
              <Typography
                component={Link}
                to="/join-group"
                sx={{
                  color: t.walnut,
                  fontWeight: 700,
                  textDecoration: "none",
                  "&:hover": { color: t.espresso, textDecoration: "underline" },
                }}
              >
                Join an existing group
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default CreateGroup;