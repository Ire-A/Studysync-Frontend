import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  MenuItem,
} from "@mui/material";

function CreateSession() {
  const [formData, setFormData] = useState({
    group: "",
    title: "",
    date: "",
    time: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const groups = ["Web Technologies", "Database Systems", "Algorithms"];

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!formData.group || !formData.title || !formData.date || !formData.time) {
      setError("Please fill in the group, title, date and time.");
      return;
    }

    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);

    if (selectedDateTime < new Date()) {
      setError("Study session date and time cannot be in the past.");
      return;
    }

    setMessage("Study session created successfully. This will later connect to the backend.");

    setFormData({
      group: "",
      title: "",
      date: "",
      time: "",
      description: "",
    });
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 6, p: 4, borderRadius: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Study Session
        </Typography>

        <Typography variant="body2" sx={{ mb: 3 }}>
          Plan a study session for one of your groups.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            select
            fullWidth
            label="Study Group"
            name="group"
            margin="normal"
            value={formData.group}
            onChange={handleChange}
          >
            {groups.map((group) => (
              <MenuItem key={group} value={group}>
                {group}
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
          />

          <TextField
            fullWidth
            name="date"
            label="Date"
            type="date"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formData.date}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            name="time"
            label="Time"
            type="time"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formData.time}
            onChange={handleChange}
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
          />

          <Button fullWidth type="submit" variant="contained" sx={{ mt: 3 }}>
            Create Session
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default CreateSession;