// Resources.jsx, Allows users to share and view resources links or notes within a selected study group. 
// Resources are fetched from the backend and new ones are created with client-side URL validation.

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Typography, TextField, Button, Box, Alert,
  MenuItem, Card, CardContent, Grid, CircularProgress, Chip,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import LinkIcon from "@mui/icons-material/Link";
import DescriptionIcon from "@mui/icons-material/Description";
import AddIcon from "@mui/icons-material/Add";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { getGroups, getResources, createResource } from "../services/api";

/* We kept the palette tokens and uses the same warm brown set used across the whole app.*/
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

/* Shared TextField styles, keeps inputs consistent with the rest of the app.*/
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

/* ResourceCard, it displays a single resource with type icon, title, type chip, and content. Link resources render as a clickable anchor with an external icon. */
function ResourceCard({ resource }) {
  const isLink = resource.type === "link";

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 3,
        border: `1px solid ${t.border}`,
        transition: "all 0.22s ease",
        "&:hover": {
          borderColor: t.blush,
          boxShadow: "0 8px 28px rgba(93,64,55,0.1)",
          transform: "translateY(-3px)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {/* Header: icon + title + type chip */}
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              backgroundColor: t.parchment,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: t.walnut,
              flexShrink: 0,
            }}
          >
            {isLink
              ? <LinkIcon sx={{ fontSize: "1.1rem" }} />
              : <DescriptionIcon sx={{ fontSize: "1.1rem" }} />
            }
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
              <Typography
                sx={{
                  fontFamily: "'Georgia', serif",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: t.espresso,
                  lineHeight: 1.3,
                }}
              >
                {resource.title}
              </Typography>
              <Chip
                label={resource.type}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.7rem",
                  fontFamily: "'Georgia', serif",
                  backgroundColor: t.parchment,
                  color: t.muted,
                  border: `1px solid ${t.border}`,
                  textTransform: "capitalize",
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Content, link opens in a new tab; note shows as plain text */}
        {isLink ? (
          <Box
            component="a"
            href={resource.content}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: "0.82rem",
              color: t.mocha,
              wordBreak: "break-all",
              textDecoration: "underline",
              textDecorationColor: t.blush,
              fontFamily: "'Georgia', serif",
              "&:hover": { color: t.espresso },
            }}
          >
            {resource.content}
            <OpenInNewIcon sx={{ fontSize: "0.8rem", flexShrink: 0 }} />
          </Box>
        ) : (
          <Typography
            sx={{
              fontSize: "0.85rem",
              color: t.muted,
              lineHeight: 1.6,
              fontFamily: "'Georgia', serif",
              whiteSpace: "pre-wrap",
            }}
          >
            {resource.content}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

/* Main Resources component */
function Resources() {
  const navigate = useNavigate();
  const [groups,        setGroups]        = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [resources,     setResources]     = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");

  // Form state for adding a new resource
  const [formData,   setFormData]   = useState({ title: "", type: "link", content: "" });
  const [formError,  setFormError]  = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Auth check, redirect immediately if no user in localStorage
  useEffect(() => {
    const user = localStorage.getItem("studysyncUser");
    if (!user) navigate("/login");
  }, [navigate]);

  // Fetch groups the user belongs to and auto-select the first one
  useEffect(() => {
    async function fetchGroups() {
      try {
        const data = await getGroups();
        setGroups(data.groups || []);
        if (data.groups?.length > 0) setSelectedGroup(data.groups[0]._id);
      } catch (err) {
        setError(err.message);
        if (err.message.includes("Unauthorised")) navigate("/login");
      } finally {
        setLoading(false);
      }
    }
    fetchGroups();
  }, [navigate]);

  // Reload resources whenever the user switches to a different group, so as to not carry ovver resources because each group is unique
  useEffect(() => {
    if (!selectedGroup) return;
    async function fetchResources() {
      try {
        setLoading(true);
        const data = await getResources(selectedGroup);
        setResources(data.resources || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchResources();
  }, [selectedGroup]);

  const handleFormChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* URL validation, tries to construct a URL object, throws if the string is not a valid URL, which we catch and treat as invalid. */
  const isValidUrl = (value) => {
    try { new URL(value); return true; }
    catch { return false; }
  };

  const validateForm = () => {
    if (!formData.title.trim()) { setFormError("Resource title is required."); return false; }
    if (!formData.content.trim()) { setFormError("Content is required."); return false; }
    if (formData.type === "link" && !isValidUrl(formData.content)) {
      setFormError("Please enter a valid URL (e.g. https://...)");
      return false;
    }
    return true;
  };

  // Submit the new resource, then refresh the list so the UI stays in sync
  const handleAddResource = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!validateForm()) return;
    if (!selectedGroup) { setFormError("Please select a study group first."); return; }

    setSubmitting(true);
    try {
      await createResource({
        title:   formData.title,
        groupId: selectedGroup,
        type:    formData.type,
        content: formData.content,
      });
      const updated = await getResources(selectedGroup);
      setResources(updated.resources || []);
      setFormData({ title: "", type: "link", content: "" }); // reset form on success
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Full-screen spinner while groups are loading on first render
  if (loading && groups.length === 0) {
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress sx={{ color: t.mocha }} />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: t.bgPage, minHeight: "100vh" }}>
      {/* Page banner — gradient + elliptical wave, we kept it consistent as other pages */}
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
          {/* "Resources" badge */}
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
              Resources
            </Typography>
          </Box>

          <Typography
            sx={{
              fontFamily: "'Georgia', serif",
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "2.8rem" },
              color: t.white,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              mb: 1,
            }}
          >
            Shared Resources
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.65)", fontFamily: "'Georgia', serif", fontSize: "1rem" }}>
            Links and notes shared by your group members.
          </Typography>
        </Container>
      </Box>

      {/* Main content */}
      <Container maxWidth="lg" sx={{ pb: 8, mt: { xs: -1, md: -2 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3, fontFamily: "'Georgia', serif" }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Left column: group selector + add resource form */}
          <Grid item xs={12} md={4}>
            {/* Group selector card */}
            <Box
              sx={{
                backgroundColor: t.white,
                borderRadius: 4,
                border: `1px solid ${t.border}`,
                p: 3,
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5, pb: 2, borderBottom: `1px solid ${t.border}` }}>
                <Box
                  sx={{
                    width: 36, height: 36, borderRadius: 2,
                    backgroundColor: t.parchment,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: t.walnut,
                  }}
                >
                  <ShareIcon sx={{ fontSize: "1.1rem" }} />
                </Box>
                <Typography sx={{ fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: "0.95rem", color: t.espresso }}>
                  Select Group
                </Typography>
              </Box>

              {groups.length === 0 ? (
                /* If the user is not in any group, we decided prompt the user to create or join one */
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <Typography sx={{ color: t.muted, fontFamily: "'Georgia', serif", fontSize: "0.85rem", mb: 2 }}>
                    You're not in any groups yet.
                  </Typography>
                  <Button
                    component={Link}
                    to="/create-group"
                    startIcon={<AddIcon />}
                    sx={{
                      backgroundColor: t.espresso,
                      color: t.white,
                      fontFamily: "'Georgia', serif",
                      fontWeight: 700,
                      borderRadius: "999px",
                      textTransform: "none",
                      fontSize: "0.82rem",
                      px: 2.5,
                      "&:hover": { backgroundColor: t.walnut },
                    }}
                  >
                    Create a Group
                  </Button>
                </Box>
              ) : (
                <TextField
                  select
                  fullWidth
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  disabled={loading}
                  sx={inputSx}
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
              )}
            </Box>

            {/* Add resource form */}
            <Box
              sx={{
                backgroundColor: t.white,
                borderRadius: 4,
                border: `1px solid ${t.border}`,
                p: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5, pb: 2, borderBottom: `1px solid ${t.border}` }}>
                <Box
                  sx={{
                    width: 36, height: 36, borderRadius: 2,
                    backgroundColor: t.parchment,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: t.walnut,
                  }}
                >
                  <AddIcon sx={{ fontSize: "1.1rem" }} />
                </Box>
                <Typography sx={{ fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: "0.95rem", color: t.espresso }}>
                  Add Resource
                </Typography>
              </Box>

              {formError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2.5, fontFamily: "'Georgia', serif", fontSize: "0.85rem" }}>
                  {formError}
                </Alert>
              )}

              <Box component="form" onSubmit={handleAddResource}>
                <FieldLabel>Title</FieldLabel>
                <TextField
                  fullWidth
                  name="title"
                  placeholder="e.g. Lecture slides week 4"
                  value={formData.title}
                  onChange={handleFormChange}
                  disabled={submitting || !selectedGroup}
                  required
                  sx={{ ...inputSx, mt: 0 }}
                />

                {/* Type selector — "link" triggers URL validation, "note" accepts free text */}
                <FieldLabel>Type</FieldLabel>
                <TextField
                  select
                  fullWidth
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  disabled={submitting || !selectedGroup}
                  sx={{ ...inputSx, mt: 0 }}
                >
                  <MenuItem value="link" sx={{ fontFamily: "'Georgia', serif" }}>Link</MenuItem>
                  <MenuItem value="note" sx={{ fontFamily: "'Georgia', serif" }}>Note</MenuItem>
                </TextField>

                {/* Placeholder adjusts based on type to guide the user */}
                <FieldLabel>Content</FieldLabel>
                <TextField
                  fullWidth
                  name="content"
                  multiline
                  rows={4}
                  placeholder={formData.type === "link" ? "https://..." : "Write your note here…"}
                  value={formData.content}
                  onChange={handleFormChange}
                  disabled={submitting || !selectedGroup}
                  required
                  sx={{ ...inputSx, mt: 0 }}
                />

                {/* Submit button dims while submitting or when no group is selected */}
                <Button
                  fullWidth
                  type="submit"
                  disabled={submitting || !selectedGroup}
                  sx={{
                    mt: 3,
                    py: 1.3,
                    borderRadius: "999px",
                    backgroundColor: submitting || !selectedGroup ? t.border : t.espresso,
                    color: submitting || !selectedGroup ? t.muted : t.white,
                    fontFamily: "'Georgia', serif",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": { backgroundColor: t.walnut, boxShadow: "0 4px 16px rgba(62,39,35,0.2)" },
                    transition: "all 0.2s ease",
                  }}
                >
                  {submitting ? <CircularProgress size={20} sx={{ color: t.muted }} /> : "Add Resource"}
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Right column: resource grid */}
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                backgroundColor: t.white,
                borderRadius: 4,
                border: `1px solid ${t.border}`,
                overflow: "hidden",
              }}
            >
              {/* Section header with resource count */}
              <Box
                sx={{
                  px: 3,
                  py: 2.5,
                  borderBottom: `1px solid ${t.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: "1rem", color: t.espresso }}>
                  Group Resources
                </Typography>
                {resources.length > 0 && (
                  <Typography sx={{ fontFamily: "'Georgia', serif", fontSize: "0.8rem", color: t.muted }}>
                    {resources.length} resource{resources.length !== 1 ? "s" : ""}
                  </Typography>
                )}
              </Box>

              <Box sx={{ p: 3 }}>
                {loading ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <CircularProgress sx={{ color: t.mocha }} />
                  </Box>
                ) : resources.length === 0 ? (
                  /* Empty state when a group has no shared resources yet */
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 6,
                      px: 3,
                      border: `1px dashed ${t.blush}`,
                      borderRadius: 3,
                      backgroundColor: t.parchment,
                    }}
                  >
                    <ShareIcon sx={{ fontSize: "2.5rem", color: t.blush, mb: 1.5 }} />
                    <Typography
                      sx={{
                        fontFamily: "'Georgia', serif",
                        fontStyle: "italic",
                        color: t.muted,
                        fontSize: "0.9rem",
                      }}
                    >
                      No resources shared yet — add one using the form.
                    </Typography>
                  </Box>
                ) : (
                  /* Two-column grid of ResourceCards; links and notes styled differently via ResourceCard */
                  <Grid container spacing={2}>
                    {resources.map((resource) => (
                      <Grid item xs={12} sm={6} key={resource._id}>
                        <ResourceCard resource={resource} />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Resources;