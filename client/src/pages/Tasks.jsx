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
  List,
  ListItem,
  ListItemText,
  Checkbox,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { getGroups, getTasks, createTask, updateTask } from "../services/api";

// Helper to format date for input field
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16); // "YYYY-MM-DDThh:mm"
};

function Tasks() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state for new task
  const [formData, setFormData] = useState({
    title: "",
    deadline: "",
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Auth check
  useEffect(() => {
    const user = localStorage.getItem("studysyncUser");
    if (!user) navigate("/login");
  }, [navigate]);

  // Fetch user's groups
  useEffect(() => {
    async function fetchGroups() {
      try {
        const data = await getGroups();
        setGroups(data.groups || []);
        if (data.groups && data.groups.length > 0) {
          setSelectedGroup(data.groups[0]._id); // auto-select first group
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

  // Fetch tasks whenever selected group changes
  useEffect(() => {
    if (!selectedGroup) return;
    async function fetchTasks() {
      try {
        setLoading(true);
        const data = await getTasks(selectedGroup);
        setTasks(data.tasks || []);
        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
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

  // Client-side validation before POST
  const validateForm = () => {
    if (!formData.title.trim()) {
      setFormError("Task title is required.");
      return false;
    }
    if (formData.deadline && new Date(formData.deadline) < new Date()) {
      setFormError("Deadline cannot be in the past.");
      return false;
    }
    return true;
  };

  const handleAddTask = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!validateForm()) return;
    if (!selectedGroup) {
      setFormError("Please select a study group first.");
      return;
    }

    setSubmitting(true);
    try {
      await createTask({
        title: formData.title,
        groupId: selectedGroup,
        deadline: formData.deadline || null,
      });
      // Refresh task list
      const updatedTasks = await getTasks(selectedGroup);
      setTasks(updatedTasks.tasks || []);
      setFormData({ title: "", deadline: "" });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle task completion – calls PUT /api/tasks/:id
  const toggleTaskCompletion = async (taskId, currentStatus) => {
    try {
      await updateTask(taskId, { completed: !currentStatus });
      // Refresh list
      const updatedTasks = await getTasks(selectedGroup);
      setTasks(updatedTasks.tasks || []);
    } catch (err) {
      setError(err.message);
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
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Task Management
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

      {/* Add new task form */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add New Task
        </Typography>
        {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
        <Box component="form" onSubmit={handleAddTask}>
          <TextField
            fullWidth
            label="Task Title"
            name="title"
            margin="normal"
            value={formData.title}
            onChange={handleFormChange}
            disabled={submitting || !selectedGroup}
            required
          />
          <TextField
            fullWidth
            label="Deadline"
            name="deadline"
            type="datetime-local"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formData.deadline}
            onChange={handleFormChange}
            disabled={submitting || !selectedGroup}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3 }}
            disabled={submitting || !selectedGroup}
          >
            {submitting ? <CircularProgress size={24} /> : "Add Task"}
          </Button>
        </Box>
      </Paper>

      {/* Task list */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
        <Typography variant="h6" gutterBottom>
          Current Tasks
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : tasks.length === 0 ? (
          <Typography>No tasks yet. Add one above.</Typography>
        ) : (
          <List>
            {tasks.map((task) => (
              <ListItem key={task._id}>
                <Checkbox
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task._id, task.completed)}
                />
                <ListItemText
                  primary={task.title}
                  secondary={
                    task.deadline
                      ? `Deadline: ${new Date(task.deadline).toLocaleString()}`
                      : "No deadline"
                  }
                  sx={{
                    textDecoration: task.completed ? "line-through" : "none",
                  }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
}

export default Tasks;