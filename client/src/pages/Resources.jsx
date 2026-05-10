import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Alert,
  MenuItem,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import { getGroups, getResources, createResource } from "../services/api";

function Resources() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    type: "link",
    content: "",
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Auth check
  useEffect(() => {
    const user = localStorage.getItem("studysyncUser");
    if (!user) navigate("/login");
  }, [navigate]);

  // Fetch groups
  useEffect(() => {
    async function fetchGroups() {
      try {
        const data = await getGroups();
        setGroups(data.groups || []);
        if (data.groups && data.groups.length > 0) {
          setSelectedGroup(data.groups[0]._id);
        }
      } catch (err) {
        setError(err.message);
        if (err.message.includes("Unauthorised")) navigate("/login");
      } finally {
        setLoading(false);
      }
    }
    fetchGroups();
  }, [navigate]);

  // Fetch resources when group changes
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

  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value);
  };

  const handleFormChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // URL validation helper
  const isValidUrl = (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setFormError("Resource title is required.");
      return false;
    }
    if (!formData.content.trim()) {
      setFormError("Content is required.");
      return false;
    }
    if (formData.type === "link" && !isValidUrl(formData.content)) {
      setFormError("Please enter a valid URL for link resources.");
      return false;
    }
    return true;
  };

  const handleAddResource = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!validateForm()) return;
    if (!selectedGroup) {
      setFormError("Please select a study group first.");
      return;
    }

    setSubmitting(true);
    try {
      await createResource({
        title: formData.title,
        groupId: selectedGroup,
        type: formData.type,
        content: formData.content,
      });
      // Refresh list
      const updated = await getResources(selectedGroup);
      setResources(updated.resources || []);
      setFormData({ title: "", type: "link", content: "" });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && groups.length === 0) {
    return (
      <Container sx={{ mt: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Shared Resources
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Group selector */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Select Study Group
        </Typography>
        <TextField
          select
          fullWidth
          value={selectedGroup}
          onChange={handleGroupChange}
          disabled={loading || groups.length === 0}
        >
          {groups.map((group) => (
            <MenuItem key={group._id} value={group._id}>
              {group.name}
            </MenuItem>
          ))}
        </TextField>
        {groups.length === 0 && (
          <Typography color="error" sx={{ mt: 2 }}>
            You are not a member of any group. Create or join a group first.
          </Typography>
        )}
      </Paper>

      {/* Add resource form */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add Resource
        </Typography>
        {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
        <Box component="form" onSubmit={handleAddResource}>
          <TextField
            fullWidth
            label="Resource Title"
            name="title"
            margin="normal"
            value={formData.title}
            onChange={handleFormChange}
            disabled={submitting || !selectedGroup}
            required
          />
          <TextField
            select
            fullWidth
            label="Resource Type"
            name="type"
            margin="normal"
            value={formData.type}
            onChange={handleFormChange}
            disabled={submitting || !selectedGroup}
          >
            <MenuItem value="link">Link</MenuItem>
            <MenuItem value="note">Note</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Content"
            name="content"
            margin="normal"
            multiline
            rows={4}
            placeholder={formData.type === "link" ? "https://..." : "Write your note here..."}
            value={formData.content}
            onChange={handleFormChange}
            disabled={submitting || !selectedGroup}
            required
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3 }}
            disabled={submitting || !selectedGroup}
          >
            {submitting ? <CircularProgress size={24} /> : "Add Resource"}
          </Button>
        </Box>
      </Paper>

      {/* Resources list */}
      <Grid container spacing={3}>
        {loading ? (
          <CircularProgress />
        ) : resources.length === 0 ? (
          <Typography>No resources shared in this group yet.</Typography>
        ) : (
          resources.map((resource) => (
            <Grid item xs={12} md={6} key={resource._id}>
              <Card sx={{ borderRadius: 4 }}>
                <CardContent>
                  <Typography variant="h6">{resource.title}</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Type: {resource.type}
                  </Typography>
                  <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                      {resource.type === "link" ? (
                        <a href={resource.content} target="_blank" rel="noopener noreferrer">
                          {resource.content}
                        </a>
                        ) : (
                          resource.content
                        )}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}            
export default Resources;