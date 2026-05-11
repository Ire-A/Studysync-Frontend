// GroupDetail.jsx, It shows the detailed view of a single study group
// Fetches sessions, tasks, and resources for the group and displays them in tabs.
// Includes a banner with group info, member count, and a copyable group ID.

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {Container, Typography, CircularProgress, Alert, Card, CardContent, Tabs,
        Tab, Box, Chip, Button, Avatar, Grid, } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LinkIcon from "@mui/icons-material/Link";
import DescriptionIcon from "@mui/icons-material/Description";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { getGroups, getSessions, getTasks, getResources } from "../services/api";

// Colour palette, kept consistent across all pages for a unified look.
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

// Simple tab panel, shows children only when the tab index matches.
function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

// Empty state shown inside a tab when there is no data.
// It can include an action button that links to a relevant creation page.
function EmptyTabState({ message, actionLabel, actionTo }) {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 6,
        px: 3,
        border: `1px dashed ${t.blush}`,
        borderRadius: 4,
        backgroundColor: t.parchment,
      }}
    >
      <Typography sx={{ color: t.muted, fontFamily: "'Georgia', serif", fontStyle: "italic", mb: 2 }}>
        {message}
      </Typography>
      {actionLabel && actionTo && (
        <Button
          component={Link}
          to={actionTo}
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: t.espresso,
            color: t.white,
            fontFamily: "'Georgia', serif",
            fontWeight: 700,
            borderRadius: "999px",
            textTransform: "none",
            px: 3,
            "&:hover": { backgroundColor: t.walnut },
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}

function GroupDetail() {
  const { id } = useParams();           // group ID from URL
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [copied, setCopied] = useState(false);  // for copy group ID feedback

  // Auth check and redirect if not logged in.
  useEffect(() => {
    const user = localStorage.getItem("studysyncUser");
    if (!user) navigate("/login");
  }, [navigate]);

  // Fetch group details and related data (sessions, tasks, resources) in parallel.
  useEffect(() => {
    async function fetchGroupData() {
      try {
        setLoading(true);
        // First get all groups and find the one with matching ID becase our backend does not have a /groups/:id endpoint.
        const groupsData = await getGroups();
        const foundGroup = groupsData.groups?.find((g) => g._id === id);
        if (!foundGroup) throw new Error("Group not found or you are not a member");
        setGroup(foundGroup);

        // Fetch sessions, tasks, resources for this group all at once and we used Promise.all for this cause it gets everything
        const [sessionsRes, tasksRes, resourcesRes] = await Promise.all([
          getSessions(id),
          getTasks(id),
          getResources(id),
        ]);
        setSessions(sessionsRes.sessions || []);
        setTasks(tasksRes.tasks || []);
        setResources(resourcesRes.resources || []);
      } catch (err) {
        setError(err.message);
        if (err.message.includes("Unauthorised")) navigate("/login");
      } finally {
        setLoading(false);
      }
    }
    fetchGroupData();
  }, [id, navigate]);

  // We used this to allow users copy the group’s full _id to clipboard and shows a temporary Copied feedback.
  const handleCopyId = () => {
    navigator.clipboard.writeText(group._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress sx={{ color: t.mocha }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Alert severity="error" sx={{ borderRadius: 3, mb: 2 }}>{error}</Alert>
        <Button component={Link} to="/groups" startIcon={<ArrowBackIcon />} sx={{ color: t.walnut, fontFamily: "'Georgia', serif", textTransform: "none", fontWeight: 600 }}>
          Back to Groups
        </Button>
      </Container>
    );
  }

  // We used this to get the initials of the group by spliitng it and making it uppercase so we can display
  const initials = group.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    // Outer Box, fills the whole screen with the page background colour
    <Box sx={{ backgroundColor: t.bgPage, minHeight: "100vh" }}>
      {/* HERO BANNER, It uses a gradient background matching Dashboard and Groups pages.
          Uses ::before for a subtle noise texture and ::after for a white wave at the bottom.
      */}
      <Box
        sx={{
          background: `linear-gradient(145deg, ${t.espresso} 0%, ${t.mocha} 55%, ${t.taupe} 100%)`,
          pt: { xs: 5, md: 7 },
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
          {/* Back button, uses client‑side navigation with React Router */}
          <Button
            component={Link}
            to="/groups"
            startIcon={<ArrowBackIcon />}
            sx={{
              color: "rgba(255,255,255,0.65)",
              fontFamily: "'Georgia', serif",
              textTransform: "none",
              fontSize: "0.85rem",
              mb: 3,
              px: 0,
              "&:hover": { color: t.white, backgroundColor: "transparent" },
            }}
          >
            All Groups
          </Button>

          {/* Group info row: avatar, name, description, and meta chips */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2.5, flexWrap: "wrap" }}>
            {/* Avatar with initials, fallback when no image */}
            <Avatar
              sx={{
                width: 56,
                height: 56,
                backgroundColor: "rgba(255,255,255,0.15)",
                border: "2px solid rgba(255,255,255,0.25)",
                fontFamily: "'Georgia', serif",
                fontWeight: 700,
                fontSize: "1.1rem",
                color: t.white,
                flexShrink: 0,
              }}
            >
              {initials}
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontFamily: "'Georgia', serif",
                  fontWeight: 700,
                  fontSize: { xs: "1.8rem", md: "2.4rem" },
                  color: t.white,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                {group.name}
              </Typography>
              {group.description && (
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.65)",
                    mt: 0.75,
                    fontFamily: "'Georgia', serif",
                    fontSize: "0.95rem",
                  }}
                >
                  {group.description}
                </Typography>
              )}

              {/* WE used this to show meta chips, member count and copyable group ID */}
              <Box sx={{ display: "flex", gap: 1.5, mt: 2, flexWrap: "wrap", alignItems: "center" }}>
                {/* Member count chip */}
                <Chip
                  icon={<PeopleAltIcon sx={{ fontSize: "0.85rem !important", color: "rgba(255,255,255,0.7) !important" }} />}
                  label={`${group.members?.length || 0} member${group.members?.length !== 1 ? "s" : ""}`}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "rgba(255,255,255,0.85)",
                    fontFamily: "'Georgia', serif",
                    fontSize: "0.78rem",
                  }}
                />
                {/* Copy ID chip, shows last 6 chars, changes to Copied when clicked, we did this to allow the user to copy the id easily */}
                <Chip
                  icon={
                    copied
                      ? <CheckIcon sx={{ fontSize: "0.85rem !important", color: "#A5D6A7 !important" }} />
                      : <ContentCopyIcon sx={{ fontSize: "0.85rem !important", color: "rgba(255,255,255,0.7) !important" }} />
                  }
                  label={copied ? "Copied!" : `ID: ${group._id.slice(-6)}`}
                  size="small"
                  onClick={handleCopyId}
                  sx={{
                    cursor: "pointer",
                    backgroundColor: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: copied ? "#A5D6A7" : "rgba(255,255,255,0.75)",
                    fontFamily: "'Georgia', serif",
                    fontSize: "0.78rem",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.18)" },
                    transition: "all 0.18s ease",
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* TABS AND CONTENT  */}
      <Container maxWidth="lg" sx={{ pb: 8, mt: { xs: -1, md: -2 } }}>
        <Box
          sx={{
            backgroundColor: t.white,
            borderRadius: 4,
            border: `1px solid ${t.border}`,
            overflow: "hidden",
            mb: 3,
          }}
        >
          {/* Tabs header, uses MUI Tabs component */}
          <Tabs
            value={tabValue}
            onChange={(_, v) => setTabValue(v)}
            sx={{
              px: 2,
              borderBottom: `1px solid ${t.border}`,
              "& .MuiTab-root": {
                fontFamily: "'Georgia', serif",
                fontWeight: 600,
                fontSize: "0.88rem",
                textTransform: "none",
                color: t.muted,
                minHeight: 52,
                "&.Mui-selected": { color: t.espresso },
              },
              "& .MuiTabs-indicator": { backgroundColor: t.espresso, height: 3, borderRadius: "3px 3px 0 0" },
            }}
          >
            <Tab label={`Sessions · ${sessions.length}`} />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  Tasks · {tasks.length}
                  {/* Show a small badge with the number of pending tasks */}
                  {pendingCount > 0 && (
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        backgroundColor: "#EF9A9A",
                        color: t.espresso,
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {pendingCount}
                    </Box>
                  )}
                </Box>
              }
            />
            <Tab label={`Resources · ${resources.length}`} />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {/* SESSIONS TAB */}
            <TabPanel value={tabValue} index={0}>
              {sessions.length === 0 ? (
                // Empty state, link to create a session
                <EmptyTabState
                  message="No study sessions scheduled yet."
                  actionLabel="Create a Session"
                  actionTo="/create-session"
                />
              ) : (
                // Grid of session cards, 2 columns on medium screens
                <Grid container spacing={2}>
                  {sessions.map((session) => (
                    <Grid item xs={12} sm={6} key={session._id}>
                      <Card
                        elevation={0}
                        sx={{
                          borderRadius: 3,
                          border: `1px solid ${t.border}`,
                          transition: "all 0.2s ease",
                          "&:hover": { borderColor: t.blush, boxShadow: "0 6px 24px rgba(93,64,55,0.09)" },
                        }}
                      >
                        <CardContent sx={{ p: 2.5 }}>
                          <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                            {/* Icon box */}
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
                                flexShrink: 0,
                              }}
                            >
                              <CalendarMonthIcon sx={{ fontSize: "1.1rem" }} />
                            </Box>
                            <Box>
                              <Typography sx={{ fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: "0.95rem", color: t.espresso }}>
                                {session.title}
                              </Typography>
                              <Typography sx={{ fontSize: "0.8rem", color: t.taupe, mt: 0.3 }}>
                                {new Date(session.date).toLocaleString("en-IE", {
                                  weekday: "short", day: "numeric", month: "short",
                                  hour: "2-digit", minute: "2-digit",
                                })}
                              </Typography>
                              {session.description && (
                                <Typography sx={{ fontSize: "0.82rem", color: t.muted, mt: 0.75, lineHeight: 1.5 }}>
                                  {session.description}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
              {/* New Session button, appears below the grid or empty state */}
              <Button
                component={Link}
                to="/create-session"
                startIcon={<AddIcon />}
                sx={{
                  mt: 3,
                  color: t.walnut,
                  border: `1px solid ${t.border}`,
                  fontFamily: "'Georgia', serif",
                  fontWeight: 600,
                  borderRadius: "999px",
                  textTransform: "none",
                  px: 2.5,
                  "&:hover": { borderColor: t.mocha, backgroundColor: t.parchment },
                }}
              >
                New Session
              </Button>
            </TabPanel>

            {/* TASKS TAB */}
            <TabPanel value={tabValue} index={1}>
              {tasks.length === 0 ? (
                <EmptyTabState message="No tasks created for this group yet." actionLabel="Go to Tasks" actionTo="/tasks" />
              ) : (
                <Grid container spacing={2}>
                  {tasks.map((task) => (
                    <Grid item xs={12} sm={6} key={task._id}>
                      <Card
                        elevation={0}
                        sx={{
                          borderRadius: 3,
                          border: `1px solid ${task.completed ? "#C8E6C9" : t.border}`,
                          opacity: task.completed ? 0.75 : 1,
                          transition: "all 0.2s ease",
                          "&:hover": { borderColor: t.blush, boxShadow: "0 6px 24px rgba(93,64,55,0.09)" },
                        }}
                      >
                        <CardContent sx={{ p: 2.5 }}>
                          <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                            {/* Icon changes colour based on completion status */}
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 2,
                                backgroundColor: task.completed ? "#E8F5E9" : t.parchment,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: task.completed ? "#66BB6A" : t.walnut,
                                flexShrink: 0,
                              }}
                            >
                              <AssignmentIcon sx={{ fontSize: "1.1rem" }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                sx={{
                                  fontFamily: "'Georgia', serif",
                                  fontWeight: 700,
                                  fontSize: "0.95rem",
                                  color: t.espresso,
                                  textDecoration: task.completed ? "line-through" : "none",
                                  opacity: task.completed ? 0.6 : 1,
                                }}
                              >
                                {task.title}
                              </Typography>
                              <Typography sx={{ fontSize: "0.8rem", color: t.taupe, mt: 0.3 }}>
                                {task.deadline
                                  ? `Due: ${new Date(task.deadline).toLocaleDateString("en-IE", { day: "numeric", month: "short" })}`
                                  : "No deadline"}
                              </Typography>
                              <Chip
                                label={task.completed ? "Completed" : "Pending"}
                                size="small"
                                sx={{
                                  mt: 1,
                                  height: 22,
                                  fontSize: "0.72rem",
                                  fontFamily: "'Georgia', serif",
                                  backgroundColor: task.completed ? "#E8F5E9" : "#FFF3E0",
                                  color: task.completed ? "#388E3C" : "#E65100",
                                  border: `1px solid ${task.completed ? "#C8E6C9" : "#FFE0B2"}`,
                                }}
                              />
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
              <Button
                component={Link}
                to="/tasks"
                startIcon={<AddIcon />}
                sx={{
                  mt: 3,
                  color: t.walnut,
                  border: `1px solid ${t.border}`,
                  fontFamily: "'Georgia', serif",
                  fontWeight: 600,
                  borderRadius: "999px",
                  textTransform: "none",
                  px: 2.5,
                  "&:hover": { borderColor: t.mocha, backgroundColor: t.parchment },
                }}
              >
                Manage Tasks
              </Button>
            </TabPanel>

            {/* RESOURCES TAB */}
            <TabPanel value={tabValue} index={2}>
              {resources.length === 0 ? (
                <EmptyTabState message="No resources shared yet." actionLabel="Share a Resource" actionTo="/resources" />
              ) : (
                <Grid container spacing={2}>
                  {resources.map((resource) => (
                    <Grid item xs={12} sm={6} key={resource._id}>
                      <Card
                        elevation={0}
                        sx={{
                          borderRadius: 3,
                          border: `1px solid ${t.border}`,
                          transition: "all 0.2s ease",
                          "&:hover": { borderColor: t.blush, boxShadow: "0 6px 24px rgba(93,64,55,0.09)" },
                        }}
                      >
                        <CardContent sx={{ p: 2.5 }}>
                          <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                            {/* Icon changes based on resource type (link vs note) */}
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
                                flexShrink: 0,
                              }}
                            >
                              {resource.type === "link" ? (
                                <LinkIcon sx={{ fontSize: "1.1rem" }} />
                              ) : (
                                <DescriptionIcon sx={{ fontSize: "1.1rem" }} />
                              )}
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
                                <Typography sx={{ fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: "0.95rem", color: t.espresso }}>
                                  {resource.title}
                                </Typography>
                                <Chip
                                  label={resource.type}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: "0.7rem",
                                    fontFamily: "'Georgia', serif",
                                    backgroundColor: t.parchment,
                                    color: t.muted,
                                    border: `1px solid ${t.border}`,
                                  }}
                                />
                              </Box>
                              {resource.type === "link" ? (
                                <Typography
                                  component="a"
                                  href={resource.content}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{
                                    fontSize: "0.82rem",
                                    color: t.mocha,
                                    wordBreak: "break-all",
                                    textDecoration: "underline",
                                    textDecorationColor: t.blush,
                                    "&:hover": { color: t.espresso },
                                  }}
                                >
                                  {resource.content}
                                </Typography>
                              ) : (
                                <Typography sx={{ fontSize: "0.82rem", color: t.muted, lineHeight: 1.5 }}>
                                  {resource.content}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
              <Button
                component={Link}
                to="/resources"
                startIcon={<AddIcon />}
                sx={{
                  mt: 3,
                  color: t.walnut,
                  border: `1px solid ${t.border}`,
                  fontFamily: "'Georgia', serif",
                  fontWeight: 600,
                  borderRadius: "999px",
                  textTransform: "none",
                  px: 2.5,
                  "&:hover": { borderColor: t.mocha, backgroundColor: t.parchment },
                }}
              >
                Share Resource
              </Button>
            </TabPanel>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default GroupDetail;
