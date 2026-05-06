import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";

function Groups() {
  const groups = [
    {
      name: "Web Technologies",
      description: "Group for React, Node.js and MongoDB coursework.",
      members: 3,
    },
    {
      name: "Database Systems",
      description: "Revision group for SQL and database design.",
      members: 4,
    },
    {
      name: "Algorithms",
      description: "Study group for sorting, searching and complexity.",
      members: 5,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Study Groups</Typography>

        <Button component={Link} to="/create-group" variant="contained">
          Create Group
        </Button>
      </Box>

      <Grid container spacing={3}>
        {groups.map((group, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6">{group.name}</Typography>
                <Typography variant="body2" sx={{ my: 2 }}>
                  {group.description}
                </Typography>
                <Typography variant="body2">
                  Members: {group.members}
                </Typography>
                <Button variant="outlined" sx={{ mt: 2 }}>
                  View Group
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Groups;