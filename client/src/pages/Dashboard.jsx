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
import { Link } from "react-router-dom";
import { getGroups } from "../services/api";

function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const data = await getGroups();
        setGroups(data.groups || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

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

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%", borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                My Study Groups
              </Typography>

              {groups.length === 0 ? (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  You have not created or joined any study groups yet.
                </Typography>
              ) : (
                groups.map((group) => (
                  <Typography key={group._id} sx={{ mb: 1 }}>
                    {group.name}
                  </Typography>
                ))
              )}

              <Button
                component={Link}
                to="/groups"
                variant="contained"
                sx={{ mt: 2 }}
              >
                View Groups
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%", borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Sessions
              </Typography>

              <Typography variant="body2" sx={{ mb: 2 }}>
                Sessions will appear here after you create them inside a group.
              </Typography>

              <Button
                component={Link}
                to="/create-session"
                variant="contained"
                sx={{ mt: 2 }}
              >
                Create Session
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%", borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                My Tasks
              </Typography>

              <Typography variant="body2" sx={{ mb: 2 }}>
                Tasks will appear here after you add them to a study group.
              </Typography>

              <Button
                component={Link}
                to="/tasks"
                variant="contained"
                sx={{ mt: 2 }}
              >
                View Tasks
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