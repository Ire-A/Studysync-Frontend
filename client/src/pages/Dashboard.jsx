import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { getGroups, getSessions, getTasks } from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Auth check
  useEffect(() => {
    const user = localStorage.getItem("studysyncUser");
    if (!user) navigate("/login");
  }, [navigate]);

  // Fetch groups, then for each group fetch sessions and tasks
  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const groupsData = await getGroups();
        const userGroups = groupsData.groups || [];
        setGroups(userGroups);

        // For simplicity, take the first group (or you could aggregate all)
        // Here we fetch from all groups and collect upcoming sessions/tasks
        let allSessions = [];
        let allTasks = [];

        for (const group of userGroups) {
          try {
            const sessions = await getSessions(group._id);
            allSessions.push(...(sessions.sessions || []));
            const tasks = await getTasks(group._id);
            allTasks.push(...(tasks.tasks || []));
          } catch (err) {
            console.error(`Error fetching data for group ${group._id}`, err);
          }
        }

        // Filter upcoming sessions (date >= today)
        const now = new Date();
        const upcoming = allSessions.filter(
          (session) => new Date(session.date) >= now
        );
        setUpcomingSessions(upcoming.slice(0, 5)); // show only 5

        // Filter incomplete tasks
        const incomplete = allTasks.filter((task) => !task.completed);
        setPendingTasks(incomplete.slice(0, 5));
      } catch (err) {
        setError(err.message);
        if (err.message.includes("Unauthorised")) navigate("/login");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <Container sx={{ mt: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Welcome back. Here is your StudySync overview.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* Groups summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%", borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                My Study Groups ({groups.length})
              </Typography>
              {groups.length === 0 ? (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  You have not created or joined any study groups yet.
                </Typography>
              ) : (
                groups.map((group) => (
                  <Typography key={group._id} sx={{ mb: 1 }}>
                    • {group.name}
                  </Typography>
                ))
              )}
              <Button component={Link} to="/groups" variant="contained" sx={{ mt: 2 }}>
                Manage Groups
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming sessions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%", borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Sessions
              </Typography>
              {upcomingSessions.length === 0 ? (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  No upcoming sessions. Create one!
                </Typography>
              ) : (
                upcomingSessions.map((session) => (
                  <Typography key={session._id} sx={{ mb: 1 }}>
                    📅 {session.title} – {new Date(session.date).toLocaleDateString()}
                  </Typography>
                ))
              )}
              <Button component={Link} to="/create-session" variant="contained" sx={{ mt: 2 }}>
                Create Session
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Pending tasks */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%", borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Tasks
              </Typography>
              {pendingTasks.length === 0 ? (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  No pending tasks. Great job!
                </Typography>
              ) : (
                pendingTasks.map((task) => (
                  <Typography key={task._id} sx={{ mb: 1 }}>
                    ⏳ {task.title}
                  </Typography>
                ))
              )}
              <Button component={Link} to="/tasks" variant="contained" sx={{ mt: 2 }}>
                View All Tasks
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Button component={Link} to="/create-group" variant="outlined">
          Create Your First Group
        </Button>
      </Box>
    </Container>
  );
}

export default Dashboard;