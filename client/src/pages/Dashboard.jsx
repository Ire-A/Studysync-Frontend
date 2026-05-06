import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";

function Dashboard() {
  const groups = ["Web Technologies", "Database Systems", "Algorithms"];
  const sessions = ["React UI Practice - Monday 6pm", "MongoDB Revision - Wednesday 7pm"];
  const tasks = ["Finish homepage design", "Prepare client-side validation", "Review MUI layout"];

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Typography variant="body1" sx={{ mb: 4 }}>
        Welcome back. Here is an overview of your study groups, sessions and tasks.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%", borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                My Study Groups
              </Typography>

              {groups.map((group, index) => (
                <Typography key={index} sx={{ mb: 1 }}>
                  {group}
                </Typography>
              ))}

              <Button component={Link} to="/groups" variant="contained" sx={{ mt: 2 }}>
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

              {sessions.map((session, index) => (
                <Typography key={index} sx={{ mb: 1 }}>
                  {session}
                </Typography>
              ))}

              <Button component={Link} to="/create-session" variant="contained" sx={{ mt: 2 }}>
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

              {tasks.map((task, index) => (
                <Typography key={index} sx={{ mb: 1 }}>
                  {task}
                </Typography>
              ))}

              <Button component={Link} to="/tasks" variant="contained" sx={{ mt: 2 }}>
                View Tasks
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;