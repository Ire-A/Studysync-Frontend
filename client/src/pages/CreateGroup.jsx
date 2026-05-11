// CreateGroup.jsx, Form to create a new study group
// Submits group name and description to the backend, then redirects to the groups list.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Paper, Typography, TextField, Button, Box, Alert, CircularProgress, } from "@mui/material";
import { createGroup } from "../services/api";

function CreateGroup() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Validate input before sending to API.
  // We require a name and at least 10 characters for description to encourage meaningful descriptions.
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
      const response = await createGroup({ name: groupName, description });
      setSuccess(response.message || "Group created successfully!");
      // Clear form after success
      setGroupName("");
      setDescription("");
      // Give user time to see the success message, then go to groups overview.
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

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          {/* Group name, required, disabled during submission */}
          <TextField
            fullWidth
            label="Group Name"
            margin="normal"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            disabled={loading}
            required
          />
          {/* Description, multiline with helper text enforcing min length */}
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
          {/* Submit button, text changes to spinner when loading */}
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