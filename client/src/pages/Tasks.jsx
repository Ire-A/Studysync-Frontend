import { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Alert,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  MenuItem,
} from "@mui/material";

function Tasks() {
  const [tasks, setTasks] = useState([
    { title: "Finish UI design", group: "Web Technologies", completed: false },
    { title: "Prepare React components", group: "Web Technologies", completed: true },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    group: "",
    deadline: "",
  });

  const [error, setError] = useState("");

  const groups = ["Web Technologies", "Database Systems", "Algorithms"];

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function handleAddTask(event) {
    event.preventDefault();
    setError("");

    if (!formData.title || !formData.group) {
      setError("Task title and study group are required.");
      return;
    }

    if (formData.deadline && new Date(formData.deadline) < new Date()) {
      setError("Deadline cannot be in the past.");
      return;
    }

    setTasks([
      ...tasks,
      {
        title: formData.title,
        group: formData.group,
        completed: false,
      },
    ]);

    setFormData({
      title: "",
      group: "",
      deadline: "",
    });
  }

  function toggleTask(index) {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  }

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Task Management
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Add coursework tasks and mark them as completed.
      </Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add New Task
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleAddTask}>
          <TextField
            fullWidth
            label="Task Title"
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
            fullWidth
            label="Deadline"
            name="deadline"
            type="date"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formData.deadline}
            onChange={handleChange}
          />

          <Button type="submit" variant="contained" sx={{ mt: 3 }}>
            Add Task
          </Button>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
        <Typography variant="h6" gutterBottom>
          Current Tasks
        </Typography>

        <List>
          {tasks.map((task, index) => (
            <ListItem key={index}>
              <Checkbox
                checked={task.completed}
                onChange={() => toggleTask(index)}
              />

              <ListItemText
                primary={task.title}
                secondary={task.group}
                sx={{
                  textDecoration: task.completed ? "line-through" : "none",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default Tasks;