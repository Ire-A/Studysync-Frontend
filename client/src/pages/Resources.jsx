import { useState } from "react";
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
} from "@mui/material";

function Resources() {
  const [resources, setResources] = useState([
    {
      title: "React Documentation",
      group: "Web Technologies",
      type: "link",
      content: "https://react.dev",
    },
    {
      title: "MongoDB Notes",
      group: "Database Systems",
      type: "note",
      content: "Revise collections, documents and ObjectId relationships.",
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    group: "",
    type: "",
    content: "",
  });

  const [error, setError] = useState("");

  const groups = ["Web Technologies", "Database Systems", "Algorithms"];

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function isValidUrl(value) {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  function handleAddResource(event) {
    event.preventDefault();
    setError("");

    if (!formData.title || !formData.group || !formData.type || !formData.content) {
      setError("Please fill in all resource fields.");
      return;
    }

    if (formData.type === "link" && !isValidUrl(formData.content)) {
      setError("Please enter a valid URL for link resources.");
      return;
    }

    setResources([...resources, formData]);

    setFormData({
      title: "",
      group: "",
      type: "",
      content: "",
    });
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Shared Resources
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Share useful study links and notes with your group.
      </Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add Resource
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleAddResource}>
          <TextField
            fullWidth
            label="Resource Title"
            name="title"
            margin="normal"
            value={formData.title}
            onChange={handleChange}
          />

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
            select
            fullWidth
            label="Resource Type"
            name="type"
            margin="normal"
            value={formData.type}
            onChange={handleChange}
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
            value={formData.content}
            onChange={handleChange}
          />

          <Button type="submit" variant="contained" sx={{ mt: 3 }}>
            Add Resource
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {resources.map((resource, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h6">{resource.title}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Group: {resource.group}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Type: {resource.type}
                </Typography>
                <Typography variant="body1">{resource.content}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Resources;