import { Box, Button, Container, Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";

function Home() {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Paper elevation={3} sx={{ p: 5, borderRadius: 4 }}>
          <Typography variant="h3" gutterBottom>
            Organise your study groups in one place
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            StudySync helps students create study groups, schedule sessions,
            share resources, and manage coursework tasks.
          </Typography>

          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/register"
          >
            Get Started
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}

export default Home;