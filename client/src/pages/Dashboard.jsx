// Dashboard.jsx, This is the Main dashboard we made to view for logged‑in users
// This component displays a personalised overview of groups, upcoming sessions, and pending tasks.
// It also provides quick actions to create new groups or sessions.

import { useEffect, useState } from "react";
import { Container, Grid, Card, CardContent, Typography, Button, Alert,
  CircularProgress, Box, Chip, Avatar,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
// We use MUI icons for visual clarity and to reinforce the purpose of each section
import GroupsIcon from "@mui/icons-material/Groups";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import { getGroups, getSessions, getTasks } from "../services/api";

/* 
  Palette tokens, we decided to define colour constants in one place to ensure consistency
  across the entire dashboard. These match the colours we used in Home.jsx.
*/
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
  ink: "#3E2723",
  muted: "#795548",
  white: "#FFFFFF",
  bgPage: "#FDFAF8",
};

/*nSectionCard, we made it a reusable card component for the three main sections (Groups, Sessions, Tasks).
  It reduces code duplication and ensures a consistent layout, hover effects, header with icon and badge, and a standard action button.
*/
function SectionCard({ icon: Icon, iconBg, title, badge, children, action }) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 4,
        border: `1px solid ${t.border}`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "all 0.25s ease",   // smooth hover effect
        "&:hover": {
          borderColor: t.blush,
          boxShadow: "0 12px 40px rgba(93,64,55,0.1)",
          transform: "translateY(-3px)",
        },
      }}
    >
      {/* We used the block of code below to make the Card header, contains icon, title, and optional badge count */}
      <Box
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: `1px solid ${t.border}`,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            backgroundColor: iconBg || t.parchment,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: t.walnut,
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: "1.3rem" }} />
        </Box>
        <Typography
          sx={{
            fontFamily: "'Georgia', serif",
            fontWeight: 700,
            fontSize: "1rem",
            color: t.espresso,
            flex: 1,
          }}
        >
          {title}
        </Typography>
        {badge != null && (
          <Chip
            label={badge}
            size="small"
            sx={{
              backgroundColor: t.parchment,
              color: t.walnut,
              fontWeight: 700,
              fontSize: "0.75rem",
              height: 24,
              border: `1px solid ${t.border}`,
            }}
          />
        )}
      </Box>

      {/* We used the block of code below to make the card body, it has dynamic content (list of groups, sessions, tasks) */}
      <CardContent sx={{ px: 3, py: 2.5, flex: 1 }}>{children}</CardContent>

      {/* We used the block of code below to make the card footer with an action button */}
      {action && (
        <Box sx={{ px: 3, pb: 3 }}>
          <Button
            component={Link}
            to={action.to}
            variant="contained"
            endIcon={<ArrowForwardIcon sx={{ fontSize: "0.9rem !important" }} />}
            sx={{
              backgroundColor: t.espresso,
              color: t.white,
              fontFamily: "'Georgia', serif",
              fontWeight: 700,
              fontSize: "0.82rem",
              px: 2.5,
              py: 1,
              borderRadius: "999px",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: t.walnut,
                boxShadow: "0 4px 16px rgba(62,39,35,0.25)",
              },
              transition: "all 0.2s ease",
            }}
          >
            {action.label}
          </Button>
        </Box>
      )}
    </Card>
  );
}

/* RowItem, it displays a single item (group name, session title, task title)
  with a coloured dot and optional secondary text. Used inside SectionCard lists.
*/
function RowItem({ primary, secondary, dot }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        py: 1.1,
        borderBottom: `1px solid ${t.border}`,
        "&:last-child": { borderBottom: "none" },
      }}
    >
      <Box
        sx={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          backgroundColor: dot || t.blush,
          flexShrink: 0,
        }}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: "'Georgia', serif",
            fontSize: "0.88rem",
            color: t.espresso,
            fontWeight: 600,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {primary}
        </Typography>
        {secondary && (
          <Typography
            sx={{
              fontSize: "0.76rem",
              color: t.muted,
              mt: 0.2,
            }}
          >
            {secondary}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

/* EmptyState, shown when a section has no data */
function EmptyState({ message }) {
  return (
    <Box
      sx={{
        py: 3,
        textAlign: "center",
        color: t.taupe,
        fontSize: "0.85rem",
        fontFamily: "'Georgia', serif",
        fontStyle: "italic",
      }}
    >
      {message}
    </Box>
  );
}

/* We added StatPill and this is the code we sed to do it. We used it to show counts for groups, sessions, and pending tasks.
  It uses a glassmorphism effect (blur + semi‑transparent background).
*/
function StatPill({ value, label }) {
  return (
    <Box
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
  );
}

/* Main Dashboard component */
function Dashboard() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  // Authentication check, redirect to login if no user data in localStorage
  useEffect(() => {
    const userData = localStorage.getItem("studysyncUser");
    if (!userData) {
      navigate("/login");
    } else {
      try {
        const user = JSON.parse(userData);
        setUserName(user.name || "Student");
      } catch {
        setUserName("Student");
      }
    }
  }, [navigate]);

  // Data fetching, load groups, then for each group fetch sessions and tasks
  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const groupsData = await getGroups();
        const userGroups = groupsData.groups || [];
        setGroups(userGroups);

        let allSessions = [];
        let allTasks = [];

        // Loop through each group to collect its sessions and tasks
        // We use a for...of loop because we need to await inside it.
        for (const group of userGroups) {
          try {
            const sessions = await getSessions(group._id);
            allSessions.push(...(sessions.sessions || []));
            const tasks = await getTasks(group._id);
            allTasks.push(...(tasks.tasks || []));
          } catch (err) {
            // If a single group fails, we log but continue, don't break the whole dashboard
            console.error(`Error fetching data for group ${group._id}`, err);
          }
        }

        // Filter upcoming sessions (date >= today) and take the first 5
        const now = new Date();
        setUpcomingSessions(
          allSessions.filter((s) => new Date(s.date) >= now).slice(0, 5)
        );
        // Filter pending tasks (completed === false) and take the first 5
        setPendingTasks(allTasks.filter((t) => !t.completed).slice(0, 5));
      } catch (err) {
        setError(err.message);
        if (err.message.includes("Unauthorised")) navigate("/login");
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [navigate]);

  // Loading state, show a centred spinner, we used the circular progress from MUI for this
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: t.mocha }} />
      </Box>
    );
  }

  // Personalised greeting, we extract the first name and choose a time‑based message, we used a time based message so the user feels welcome
  const firstName = userName.split(" ")[0];
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <Box sx={{ backgroundColor: t.bgPage, minHeight: "100vh" }}>
      {/* Hero banner, gradient background with a wave at the bottom, same style as Home page */}
      <Box
        sx={{
          background:
            "linear-gradient(145deg, #3E2723 0%, #6D4C41 55%, #8D6E63 100%)",
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
            pointerEvents: "none", // ensures the gradient does not block clicks
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -2,
            left: 0,
            right: 0,
            height: 64,
            background: t.bgPage,
            clipPath: "ellipse(55% 100% at 50% 100%)", // creates a smooth transition to the white background
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          {/* Greeting section with a small “Dashboard” badge */}
          <Box sx={{ mb: 4 }}>
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
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  backgroundColor: t.gold,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255,255,255,0.85)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontFamily: "'Georgia', serif",
                }}
              >
                Dashboard
              </Typography>
            </Box>

            <Typography
              sx={{
                fontFamily: "'Georgia', serif",
                fontWeight: 700,
                fontSize: { xs: "2rem", md: "2.8rem" }, // responsive font size
                color: t.white,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              {greeting}, {firstName}.
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.65)",
                mt: 1,
                fontSize: "1rem",
                fontFamily: "'Georgia', serif",
              }}
            >
              Here's your StudySync overview.
            </Typography>
          </Box>

          {/* StatPills, to show a quick visual summary */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <StatPill value={groups.length} label="Groups" />
            <StatPill value={upcomingSessions.length} label="Sessions" />
            <StatPill value={pendingTasks.length} label="Tasks due" />
          </Box>
        </Container>
      </Box>

      {/* Main content, three SectionCards in a responsive Grid */}
      <Container maxWidth="lg" sx={{ pb: 8, mt: { xs: -1, md: -2 } }}>
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 3, fontFamily: "'Georgia', serif" }}
          >
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Groups card */}
          <Grid item xs={12} md={4}>
            <SectionCard
              icon={GroupsIcon}
              title="My Study Groups"
              badge={groups.length}
              action={{ to: "/groups", label: "Manage Groups" }}
            >
              {groups.length === 0 ? (
                <EmptyState message="You haven't joined any groups yet." />
              ) : (
                groups.map((group) => (
                  <RowItem key={group._id} primary={group.name} dot={t.mocha} />
                ))
              )}
            </SectionCard>
          </Grid>

          {/* Sessions card */}
          <Grid item xs={12} md={4}>
            <SectionCard
              icon={CalendarMonthIcon}
              title="Upcoming Sessions"
              badge={upcomingSessions.length || null}
              action={{ to: "/create-session", label: "Create Session" }}
            >
              {upcomingSessions.length === 0 ? (
                <EmptyState message="No sessions scheduled. Create one!" />
              ) : (
                upcomingSessions.map((session) => (
                  <RowItem
                    key={session._id}
                    primary={session.title}
                    secondary={new Date(session.date).toLocaleDateString(
                      "en-IE",
                      { weekday: "short", day: "numeric", month: "short" }
                    )}
                    dot={t.gold}
                  />
                ))
              )}
            </SectionCard>
          </Grid>

          {/* Tasks card */}
          <Grid item xs={12} md={4}>
            <SectionCard
              icon={AssignmentIcon}
              title="Pending Tasks"
              badge={pendingTasks.length || null}
              action={{ to: "/tasks", label: "View All Tasks" }}
            >
              {pendingTasks.length === 0 ? (
                <Box
                  sx={{
                    py: 3,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                    color: t.taupe,
                  }}
                >
                  <CheckCircleOutlineIcon sx={{ fontSize: "2rem", color: "#A5D6A7" }} />
                  <Typography
                    sx={{
                      fontSize: "0.85rem",
                      fontFamily: "'Georgia', serif",
                      fontStyle: "italic",
                    }}
                  >
                    All caught up — great work!
                  </Typography>
                </Box>
              ) : (
                pendingTasks.map((task) => (
                  <RowItem key={task._id} primary={task.title} dot="#EF9A9A" />
                ))
              )}
            </SectionCard>
          </Grid>
        </Grid>

        {/* Quick action, a highlighted box encouraging group creation */}
        <Box
          sx={{
            mt: 4,
            p: 3,
            borderRadius: 4,
            border: `1px dashed ${t.blush}`,
            backgroundColor: t.parchment,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: "'Georgia', serif",
                fontWeight: 700,
                color: t.espresso,
                fontSize: "0.95rem",
              }}
            >
              Start collaborating
            </Typography>
            <Typography sx={{ color: t.muted, fontSize: "0.82rem", mt: 0.3 }}>
              Create a group and invite your classmates.
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/create-group"
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{
              borderColor: t.mocha,
              color: t.mocha,
              fontFamily: "'Georgia', serif",
              fontWeight: 700,
              fontSize: "0.85rem",
              px: 3,
              py: 1,
              borderRadius: "999px",
              "&:hover": {
                backgroundColor: t.parchment,
                borderColor: t.espresso,
                color: t.espresso,
              },
              transition: "all 0.2s ease",
            }}
          >
            Create a Group
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Dashboard;