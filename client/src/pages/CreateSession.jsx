import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { getGroups, createSession } from "../services/api";

function CreateSession() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    groupId: "",
    title: "",
    date: "",
    description: "",
  });

  // Auth check and fetch groups
  useEffect(() => {
    const user = localStorage.getItem("studysyncUser");
    if (!user) navigate("/login");

    async function fetchGroups() {
      try {
        const data = await getGroups();
        setGroups(data.groups || []);
        if (data.groups && data.groups.length > 0) {
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

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.groupId) {
      setError("Please select a study group.");
      return false;
    }
    if (!formData.title.trim()) {
      setError("Session title is required.");
      return false;
    }
    if (!formData.date) {
      setError("Date and time are required.");
      return false;
    }
    const selectedDateTime = new Date(formData.date);
    if (selectedDateTime < new Date()) {
      setError("Session date cannot be in the past.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await createSession({
        title: formData.title,
        groupId: formData.groupId,
        date: formData.date,
        description: formData.description || "",
      });
      setSuccess("Study session created successfully!");
      setFormData({
        ...formData,
        title: "",
        date: "",
        description: "",
      });
      // Keep groupId selected
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingGroups) {
    return (
      <Container sx={{ mt: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 6, p: 4, borderRadius: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Study Session
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {groups.length === 0 ? (
          <Alert severity="warning">
            You are not a member of any group. Please create or join a group first.
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              select
              fullWidth
              label="Study Group"
              name="groupId"
              margin="normal"
              value={formData.groupId}
              onChange={handleChange}
              disabled={submitting}
              required
            >
              {groups.map((group) => (
                <MenuItem key={group._id} value={group._id}>
                  {group.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Session Title"
              name="title"
              margin="normal"
              value={formData.title}
              onChange={handleChange}
              disabled={submitting}
              required
            />

            <TextField
              fullWidth
              name="date"
              label="Date & Time"
              type="datetime-local"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={handleChange}
              disabled={submitting}
              required
            />

            <TextField
              fullWidth
              label="Description or Meeting Link"
              name="description"
              margin="normal"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              disabled={submitting}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 3 }}
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={24} /> : "Create Session"}
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default CreateSession;