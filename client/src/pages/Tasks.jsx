// Tasks.jsx, Allows users to create, view, and toggle completion status of tasks within a selected study group.
// Tasks are fetched from the backend and updated in real time using PUT requests.

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Typography, TextField, Button, Box, Alert, Checkbox, MenuItem,
  CircularProgress, Grid, Card, CardContent, Chip, Avatar,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { getGroups, getTasks, createTask, updateTask } from "../services/api";

/* Palette tokens,same warm brown set used across Dashboard, Groups, and JoinGroup.
   Every page shares one visual language. */
const t = {
  espresso: "#3E2723",
  walnut: "#5D4037",
  mocha: "#6D4C41",
  taupe: "#8D6E63",
  blush: "#A1887F",
  parchment: "#FBF3EF",
  border: "#EDE0DC",
  gold: "#FFD54F",
  goldHover: "#FFE082",
  muted: "#795548",
  white: "#FFFFFF",
  bgPage: "#FDFAF8",
};

/* Shared TextField styles – defined outside the component to avoid recreating
   the object on every render. Matches the input style used in Login.jsx and JoinGroup.jsx. */
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
};

/* Helper function, converts an ISO date string into the "YYYY-MM-DDThh:mm" format
   required by datetime-local inputs. Returns an empty string if no date is given. */
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toISOString().slice(0, 16);
};

/* FieldLabel, we use uppercase labels above each input instead of floating MUI labels,
   to keep the form consistent with the rest of the app. */
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
        mt: 2,
      }}
    >
      {children}
    </Typography>
  );
}

/* TaskCard, displays a single task with its title, deadline, completion status,
   and a checkbox to toggle completion. Completed tasks are visually dimmed.
   Overdue tasks appear with a red border and a special chip. */
function TaskCard({ task, onToggle }) {
  const isOverdue =
    !task.completed &&
    task.deadline &&
    new Date(task.deadline) < new Date();

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1px solid ${task.completed ? "#C8E6C9" : isOverdue ? "#FFCDD2" : t.border}`,
        opacity: task.completed ? 0.72 : 1,
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: t.blush,
          boxShadow: "0 6px 24px rgba(93,64,55,0.09)",
        },
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
          {/* Checkbox uses custom MUI icons to stay on‑palette. */}
          <Checkbox
            checked={task.completed}
            onChange={() => onToggle(task._id, task.completed)}
            icon={<RadioButtonUncheckedIcon sx={{ color: t.blush, fontSize: "1.3rem" }} />}
            checkedIcon={<CheckCircleOutlinedIcon sx={{ color: "#66BB6A", fontSize: "1.3rem" }} />}
            sx={{ p: 0.5, mt: 0.1 }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: "'Georgia', serif",
                fontWeight: 700,
                fontSize: "0.92rem",
                color: t.espresso,
                textDecoration: task.completed ? "line-through" : "none",
                opacity: task.completed ? 0.6 : 1,
              }}
            >
              {task.title}
            </Typography>

            {/* Deadline row with overdue warning chip. */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
              <Typography sx={{ fontSize: "0.78rem", color: isOverdue ? "#E53935" : t.muted }}>
                {task.deadline
                  ? `Due: ${new Date(task.deadline).toLocaleDateString("en-IE", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}`
                  : "No deadline"}
              </Typography>
              {isOverdue && (
                <Chip
                  label="Overdue"
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.68rem",
                    fontFamily: "'Georgia', serif",
                    backgroundColor: "#FFEBEE",
                    color: "#C62828",
                    border: "1px solid #FFCDD2",
                  }}
                />
              )}
              {task.completed && (
                <Chip
                  label="Done"
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.68rem",
                    fontFamily: "'Georgia', serif",
                    backgroundColor: "#E8F5E9",
                    color: "#388E3C",
                    border: "1px solid #C8E6C9",
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

/* Main Tasks component – lets users create tasks for a chosen study group and
   toggle their completion status. Groups are fetched on mount; tasks reload
   whenever the selected group changes. */
function Tasks() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state for the "Add New Task" panel.
  const [formData, setFormData] = useState({ title: "", deadline: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Auth check – redirect immediately if no user in localStorage.
  useEffect(() => {
    const user = localStorage.getItem("studysyncUser");
    if (!user) navigate("/login");
  }, [navigate]);

  // Fetch all groups the user belongs to and auto‑select the first one.
  useEffect(() => {
    async function fetchGroups() {
      try {
        const data = await getGroups();
        setGroups(data.groups || []);
        if (data.groups?.length > 0) {
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

  // Reload tasks whenever the user switches to a different group.
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

  // Generic change handler for the add‑task form.
  const handleFormChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* Client‑side validation – runs before the POST so we avoid unnecessary
     network requests for empty titles or past deadlines. */
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

  // Submit a new task, then refresh the list so the UI stays in sync.
  const handleAddTask = async (e) => {
    e.preventDefault();
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
      const updated = await getTasks(selectedGroup);
      setTasks(updated.tasks || []);
      setFormData({ title: "", deadline: "" });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* Toggle a task's completed flag – calls PUT /api/tasks/:id with the
     inverted value, then refreshes the list to reflect the change. */
  const toggleTaskCompletion = async (taskId, currentStatus) => {
    try {
      await updateTask(taskId, { completed: !currentStatus });
      const updated = await getTasks(selectedGroup);
      setTasks(updated.tasks || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Show a full‑screen spinner while groups are loading for the first time.
  if (loading && groups.length === 0) {
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress sx={{ color: t.mocha }} />
      </Box>
    );
  }

  // Derived counts used in the banner stat pills and section headings.
  const pendingCount = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.filter((task) => task.completed).length;
  const overdueCount = tasks.filter(
    (task) => !task.completed && task.deadline && new Date(task.deadline) < new Date()
  ).length;

  return (
    <Box sx={{ backgroundColor: t.bgPage, minHeight: "100vh" }}>
      {/* ===== PAGE BANNER ===== 
          Gradient background with wave – same pattern as Dashboard and Groups.
      */}
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
          {/* "Tasks" badge, matches the "Dashboard" / "Collaboration" badges on other pages. */}
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
              Tasks
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
            Task Management
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.65)",
              fontFamily: "'Georgia', serif",
              fontSize: "1rem",
              mb: 4,
            }}
          >
            Track coursework tasks and mark them off as you go.
          </Typography>

          {/* Stat pills – pending / completed / overdue at a glance. */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {[
              { value: pendingCount, label: "Pending" },
              { value: completedCount, label: "Completed" },
              { value: overdueCount, label: "Overdue" },
            ].map(({ value, label }) => (
              <Box
                key={label}
                sx={{
                  textAlign: "center",
                  px: { xs: 3, md: 4 },
                  py: 2,
                  borderRadius: 3,
                  backgroundColor: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(8px)",
                  minWidth: 90,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Georgia', serif",
                    fontWeight: 700,
                    fontSize: "1.8rem",
                    color: t.gold,
                    lineHeight: 1,
                  }}
                >
                  {value}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: "rgba(255,255,255,0.75)",
                    mt: 0.5,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* MAIN CONTENT */}
      <Container maxWidth="lg" sx={{ pb: 8, mt: { xs: -1, md: -2 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3, fontFamily: "'Georgia', serif" }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* LEFT COLUMN: group selector + add task form */}
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
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    backgroundColor: t.parchment,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: t.walnut,
                  }}
                >
                  <AssignmentIcon sx={{ fontSize: "1.1rem" }} />
                </Box>
                <Typography sx={{ fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: "0.95rem", color: t.espresso }}>
                  Select Group
                </Typography>
              </Box>

              {groups.length === 0 ? (
                /* No groups – prompt the user to create or join one. */
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

            {/* Add new task form */}
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
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    backgroundColor: t.parchment,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: t.walnut,
                  }}
                >
                  <AddIcon sx={{ fontSize: "1.1rem" }} />
                </Box>
                <Typography sx={{ fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: "0.95rem", color: t.espresso }}>
                  Add New Task
                </Typography>
              </Box>

              {formError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2.5, fontFamily: "'Georgia', serif", fontSize: "0.85rem" }}>
                  {formError}
                </Alert>
              )}

              <Box component="form" onSubmit={handleAddTask}>
                <FieldLabel>Task Title</FieldLabel>
                <TextField
                  fullWidth
                  name="title"
                  placeholder="e.g. Write literature review"
                  value={formData.title}
                  onChange={handleFormChange}
                  disabled={submitting || !selectedGroup}
                  required
                  sx={{ ...inputSx, mt: 0 }}
                />

                <FieldLabel>Deadline (optional)</FieldLabel>
                <TextField
                  fullWidth
                  name="deadline"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  value={formData.deadline}
                  onChange={handleFormChange}
                  disabled={submitting || !selectedGroup}
                  sx={{ ...inputSx, mt: 0 }}
                />

                {/* Submit button dims while submitting to prevent double‑clicks. */}
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
                  {submitting ? <CircularProgress size={20} sx={{ color: t.muted }} /> : "Add Task"}
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* RIGHT COLUMN: task list */}
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                backgroundColor: t.white,
                borderRadius: 4,
                border: `1px solid ${t.border}`,
                overflow: "hidden",
              }}
            >
              {/* Section header */}
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
                  Current Tasks
                </Typography>
                {tasks.length > 0 && (
                  <Typography sx={{ fontFamily: "'Georgia', serif", fontSize: "0.8rem", color: t.muted }}>
                    {completedCount} of {tasks.length} done
                  </Typography>
                )}
              </Box>

              <Box sx={{ p: 3 }}>
                {loading ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <CircularProgress sx={{ color: t.mocha }} />
                  </Box>
                ) : tasks.length === 0 ? (
                  /* Empty state when a group has no tasks yet. */
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
                    <CheckCircleOutlinedIcon sx={{ fontSize: "2.5rem", color: t.blush, mb: 1.5 }} />
                    <Typography
                      sx={{
                        fontFamily: "'Georgia', serif",
                        fontStyle: "italic",
                        color: t.muted,
                        fontSize: "0.9rem",
                      }}
                    >
                      No tasks yet — add one using the form.
                    </Typography>
                  </Box>
                ) : (
                  /* Render each task as a TaskCard; pending tasks appear before completed ones. */
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {[...tasks]
                      .sort((a, b) => Number(a.completed) - Number(b.completed))
                      .map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          onToggle={toggleTaskCompletion}
                        />
                      ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Tasks;