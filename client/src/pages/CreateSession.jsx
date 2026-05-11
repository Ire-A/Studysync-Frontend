// CreateSession.jsx, Form to schedule a new study session for a chosen group.
// Includes client-side validation and shows loading/error/success feedback.

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container, Typography, TextField, Button, Box,
  Alert, MenuItem, CircularProgress,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { getGroups, createSession } from "../services/api";

/* Palette tokens, same warm brown set used across the whole app. */
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

/* Shared TextField styles — keeps inputs consistent with Login, Tasks, and CreateGroup. */
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
  "& .MuiSelect-select": { fontFamily: "'Georgia', serif" },
  "& .MuiFormHelperText-root": {
    fontFamily: "'Georgia', serif",
    fontSize: "0.78rem",
    color: t.muted,
  },
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

/* Main CreateSession component */
function CreateSession() {
  const navigate = useNavigate();
  const [groups,        setGroups]        = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [error,         setError]         = useState("");
  const [success,       setSuccess]       = useState("");
  const [submitting,    setSubmitting]    = useState(false);

  const [formData, setFormData] = useState({
    groupId:     "",
    title:       "",
    date:        "",
    description: "",
  });

  /* On mount:
     1. Redirect to /login if no user in localStorage.
     2. Fetch the user's groups and pre-select the first one so the dropdown has a value immediately. */
  useEffect(() => {
    const user = localStorage.getItem("studysyncUser");
    if (!user) navigate("/login");

    async function fetchGroups() {
      try {
        const data = await getGroups();
        setGroups(data.groups || []);
        if (data.groups?.length > 0) {
          setFormData((prev) => ({ ...prev, groupId: data.groups[0]._id }));
        }
      } catch (err) {
        setError(err.message);
        if (err.message.includes("Unauthorised")) navigate("/login");
      } finally {
        setLoadingGroups(false);
      }
    }
    fetchGroups();
  }, [navigate]);

  // Generic change handler, uses the input's name attribute to update the correct field
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* Client-side validation, ensures all required fields are present and that the session date is not in the past. */
  const validateForm = () => {
    if (!formData.groupId) { setError("Please select a study group."); return false; }
    if (!formData.title.trim()) { setError("Session title is required."); return false; }
    if (!formData.date) { setError("Date and time are required."); return false; }
    if (new Date(formData.date) < new Date()) {
      setError("Session date cannot be in the past.");
      return false;
    }
    return true;
  };

  /* Submit the session, clear variable fields on success but keep the selected group so the user can easily add another session. */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await createSession({
        title:       formData.title,
        groupId:     formData.groupId,
        date:        formData.date,
        description: formData.description || "",
      });
      setSuccess("Study session created successfully!");
      setFormData((prev) => ({ ...prev, title: "", date: "", description: "" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Full-screen spinner while groups are loading on first render
  if (loadingGroups) {
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress sx={{ color: t.mocha }} />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: t.bgPage, minHeight: "100vh" }}>
      {/* Page banner */}
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
            to="/dashboard"
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
            Dashboard
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
            <CalendarMonthIcon sx={{ fontSize: "1.6rem" }} />
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
            Create a Study Session
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.65)", fontFamily: "'Georgia', serif", fontSize: "1rem" }}>
            Schedule a meeting time for your group.
          </Typography>
        </Container>
      </Box>

      {/* Form card */}
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

          {/* If the user has no groups, show a warning instead of the form */}
          {groups.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Alert severity="warning" sx={{ borderRadius: 2.5, fontFamily: "'Georgia', serif", mb: 2 }}>
                You're not in any groups yet.
              </Alert>
              <Button
                component={Link}
                to="/create-group"
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
                Create a Group First
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              {/* Group dropdown, populated from the user's groups */}
              <FieldLabel>Study Group</FieldLabel>
              <TextField
                select
                fullWidth
                name="groupId"
                value={formData.groupId}
                onChange={handleChange}
                disabled={submitting}
                required
                sx={{ ...inputSx, mt: 0 }}
              >
                {groups.map((group) => (
                  <MenuItem
                    key={group._id}
                    value={group._id}
                    sx={{ fontFamily: "'Georgia', serif", fontSize: "0.9rem" }}
                  >
                    {group.name}
                  </MenuItem>
                ))}
              </TextField>

              <FieldLabel>Session Title</FieldLabel>
              <TextField
                fullWidth
                name="title"
                placeholder="e.g. Week 8 Exam Prep"
                value={formData.title}
                onChange={handleChange}
                disabled={submitting}
                required
                sx={{ ...inputSx, mt: 0 }}
              />

              {/* Native datetime-local input; shrink keeps the label visible */}
              <FieldLabel>Date &amp; Time</FieldLabel>
              <TextField
                fullWidth
                name="date"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={formData.date}
                onChange={handleChange}
                disabled={submitting}
                required
                sx={{ ...inputSx, mt: 0 }}
              />

              {/* We made this optional because not everyone has a meeting with zoom or google meet */}
              <FieldLabel>Description or Meeting Link (optional)</FieldLabel>
              <TextField
                fullWidth
                name="description"
                placeholder="e.g. https://meet.google.com/xyz or 'Bring your notes'"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
                disabled={submitting}
                sx={{ ...inputSx, mt: 0 }}
              />

              {/* Submit button dims while the request is in-flight */}
              <Button
                fullWidth
                type="submit"
                disabled={submitting || !!success}
                sx={{
                  mt: 3,
                  py: 1.4,
                  borderRadius: "999px",
                  backgroundColor: submitting || success ? t.border : t.espresso,
                  color: submitting || success ? t.muted : t.white,
                  fontFamily: "'Georgia', serif",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": { backgroundColor: t.walnut, boxShadow: "0 4px 20px rgba(62,39,35,0.2)" },
                  transition: "all 0.2s ease",
                }}
              >
                {submitting ? (
                  <CircularProgress size={22} sx={{ color: t.muted }} />
                ) : success ? (
                  "Session Created!"
                ) : (
                  "Create Session"
                )}
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default CreateSession;