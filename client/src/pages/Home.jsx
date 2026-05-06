import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { Link } from "react-router-dom";

function Home() {
  return (
    <Box>
      <Box
        sx={{
          background: "linear-gradient(135deg, #5D4037 0%, #8B5E3C 100%)",
          color: "white",
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
                Study smarter with StudySync
              </Typography>

              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Create study groups, schedule sessions, share resources and
                manage coursework tasks in one simple platform.
              </Typography>

              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/register"
                sx={{
                  backgroundColor: "white",
                  color: "#5D4037",
                  mr: 2,
                  "&:hover": {
                    backgroundColor: "#F8FAFC",
                  },
                }}
              >
                Get Started
              </Button>

              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/login"
                sx={{
                  color: "white",
                  borderColor: "white",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Login
              </Button>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={6}
                sx={{
                  p: 4,
                  borderRadius: 5,
                  color: "#1E293B",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
                  Your study dashboard
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Upcoming Session
                  </Typography>
                  <Typography variant="body2">
                    Web Technologies revision — Monday 6pm
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Current Task
                  </Typography>
                  <Typography variant="body2">
                    Finish React client-side components
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Shared Resource
                  </Typography>
                  <Typography variant="body2">
                    React documentation and MongoDB notes
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" textAlign="center" sx={{ fontWeight: "bold", mb: 5 }}>
          What StudySync helps you do
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Create study groups
                </Typography>
                <Typography variant="body2">
                  Organise classmates by module, project or exam topic.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Schedule sessions
                </Typography>
                <Typography variant="body2">
                  Plan study meetings with dates, times and descriptions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Track tasks
                </Typography>
                <Typography variant="body2">
                  Add coursework tasks, assign work and mark progress.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;