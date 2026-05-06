import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";

function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!groupName.trim()) {
      setError("Group name is required.");
      return;
    }

    if (description.trim().length < 10) {
      setError("Description must be at least 10 characters.");
      return;
    }

    setMessage("Group created successfully. This will later connect to the backend.");
    setGroupName("");
    setDescription("");
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 6, p: 4, borderRadius: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Study Group
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Group Name"
            margin="normal"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />

          <TextField
            fullWidth
            label="Description"
            margin="normal"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button fullWidth type="submit" variant="contained" sx={{ mt: 3 }}>
            Create Group
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default CreateGroup;