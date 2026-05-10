import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { getGroups } from "../services/api";

function Groups() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check authentication – if no user in localStorage, redirect to login
  useEffect(() => {
    const user = localStorage.getItem("studysyncUser");
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch real groups from the backend when component mounts
  useEffect(() => {
    async function fetchGroups() {
      try {
        setLoading(true);
        const data = await getGroups(); // GET /api/groups (requires session cookie)
        setGroups(data.groups || []);
      } catch (err) {
        setError(err.message);
        // Check if therr is missing auth, redirect to login
        if (err.message.includes("Unauthorised")) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchGroups();
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
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Study Groups</Typography>
        <Button component={Link} to="/create-group" variant="contained">
          Create Group
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {groups.length === 0 && !error ? (
        <Typography>You haven't joined any groups yet. Create one!</Typography>
      ) : (
        <Grid container spacing={3}>
          {groups.map((group) => (
            <Grid item xs={12} md={4} key={group._id}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6">{group.name}</Typography>
                  <Typography variant="body2" sx={{ my: 2 }}>
                    {group.description || "No description provided."}
                  </Typography>
                  <Typography variant="body2">
                    Members: {group.members?.length || 0}
                  </Typography>
                  <Button variant="outlined" sx={{ mt: 2 }}>
                    View Group
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default Groups;