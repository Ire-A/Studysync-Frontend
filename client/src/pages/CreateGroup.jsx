import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { createGroup } from "../services/api";

function CreateGroup() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Client-side validation before sending to API
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!validate()) return;

    setLoading(true);
    try {
      // POST /api/groups with name and description
      const response = await createGroup({ name: groupName, description });
      setSuccess(response.message || "Group created successfully!");
      // Clear form after success
      setGroupName("");
      setDescription("");
      // Optionally redirect after a short delay so user sees success message
      setTimeout(() => navigate("/groups"), 1500);
    } catch (err) {
      setError(err.message);
      if (err.message.includes("Unauthorised")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 6, p: 4, borderRadius: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Study Group
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Group Name"
            margin="normal"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            disabled={loading}
            required
          />
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            helperText="At least 10 characters"
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Create Group"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default CreateGroup;