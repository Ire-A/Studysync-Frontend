// Home.jsx, This is the page we made as our Landing page for StudySync
// This component serves as the marketing/landing page for the application.
// It introduces the product, highlights features, and provides calls-to-action for user registration and login.

import { Box, Button, Container, Grid, Typography, Card, CardContent,
} from "@mui/material";
import { Link } from "react-router-dom";
// We used MUI for our design and imported MUI Icons becasue we needed visual symbols for each feature card
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TaskIcon from "@mui/icons-material/Task";
import ShareIcon from "@mui/icons-material/Share";

// Feature data array, we used it to dynamically generate the feature cards.
// This makes it easy to add/modify features without changing the structure, because we made it to just lloop through these and print the informations.
const features = [
  {
    icon: <GroupAddIcon sx={{ fontSize: "1.8rem" }} />,
    title: "Create study groups",
    desc: "Organise classmates by module, project or exam topic.",
  },
  {
    icon: <CalendarMonthIcon sx={{ fontSize: "1.8rem" }} />,
    title: "Schedule sessions",
    desc: "Plan study meetings with dates, times and descriptions.",
  },
  {
    icon: <TaskIcon sx={{ fontSize: "1.8rem" }} />,
    title: "Track tasks",
    desc: "Add coursework tasks, assign work and mark progress.",
  },
  {
    icon: <ShareIcon sx={{ fontSize: "1.8rem" }} />,
    title: "Share resources",
    desc: "Upload notes, links and files for your whole group.",
  },
];

// We are using MUI's sx prop for inline, theme-aware styling; avoids separate CSS files and keeps styles co-located.
function Home() {
  return (
    // Outer Box, sets global font and acts as container for all sections
    <Box sx={{ fontFamily: "'Georgia', serif" }}>
      {/*  HERO SECTION we made it to have a gradient background with a wave */}
      {/* We made this becaseu the hero section is the first thing users see and we wanted it to be warmand welcoming. */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(145deg, #3E2723 0%, #6D4C41 55%, #8D6E63 100%)",
          color: "white",
          py: { xs: 10, md: 16 }, // Responsive padding: less on mobile, more on desktop
          // xs targets mobile screens (<600px), md targets tablets and desktops (>900px).
          // This ensures the hero section doesn't take too much space on phones.
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            // Two radial gradients to create subtle textured background noise
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.04) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,220,150,0.07) 0%, transparent 50%)",
            pointerEvents: "none", // Allows clicking through the pseudo-element
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -2,
            left: 0,
            right: 0,
            height: 80,
            background: "white",
            clipPath: "ellipse(55% 100% at 50% 100%)", // WE used the ellipse wo create a curved wave effect and Clip-path creates a soft elliptical wave instead of a sharp straight line, improving visual flow.
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            {/* This is for the left column, headline, description, buttons */}
            <Grid item xs={12} md={7}>
              {/* This block of code below is for the Badge and tagline design */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 0.5,
                  mb: 3,
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.3)",
                  backdropFilter: "blur(8px)", // Glassmorphism effect
                  backgroundColor: "rgba(255,255,255,0.08)",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#FFD54F", // Amber dot for visual accent
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontFamily: "inherit",
                  }}
                >
                  Student collaboration platform
                </Typography>
              </Box>

              {/* This block of code below is for the main headline and the design, it is also responsive */}
              <Typography
                variant="h1"
                sx={{
                  fontFamily: "'Georgia', serif",
                  fontWeight: 700,
                  fontSize: { xs: "2.6rem", md: "4rem" }, // Scales down on mobile
                  lineHeight: 1.1,
                  mb: 3,
                  letterSpacing: "-0.02em",
                  maxWidth: 720,
                }}
              >
                Study smarter, together
              </Typography>

              {/* This block of code below is for the Subheading / description and design */}
              <Typography
                sx={{
                  fontSize: "1.15rem",
                  lineHeight: 1.75,
                  opacity: 0.88,
                  mb: 5,
                  maxWidth: 560,
                  fontFamily: "inherit",
                }}
              >
                StudySync helps students organise group work in one place. Create
                study groups, schedule sessions, share useful resources and keep
                track of coursework tasks without losing everything in long chat
                messages.
              </Typography>

              {/*This block of code below is for the CTA Buttons part on the page and the designs */}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/register"
                  sx={{
                    backgroundColor: "#FFD54F",
                    color: "#3E2723",
                    fontWeight: 700,
                    fontFamily: "inherit",
                    px: 4,
                    py: 1.5,
                    borderRadius: "999px",
                    fontSize: "0.95rem",
                    boxShadow: "0 4px 20px rgba(255,213,79,0.35)",
                    "&:hover": {
                      backgroundColor: "#FFE082",
                      boxShadow: "0 6px 28px rgba(255,213,79,0.5)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  Get started free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  to="/login"
                  sx={{
                    color: "white",
                    borderColor: "rgba(255,255,255,0.45)",
                    fontFamily: "inherit",
                    px: 4,
                    py: 1.5,
                    borderRadius: "999px",
                    fontSize: "0.95rem",
                    backdropFilter: "blur(8px)",
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.8)",
                      backgroundColor: "rgba(255,255,255,0.08)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  Log in
                </Button>
              </Box>
              {/* For the linking we used component={Link} which enables React Router's client‑side navigation and it si faster than <a> tags because it avoids full page refreshes */}
            </Grid>

            {/* This block of code below is for the right column which includes the feature highlight card and the designs we used for them*/}
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: 5,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "inherit",
                    fontWeight: 700,
                    fontSize: "1.4rem",
                    mb: 2,
                  }}
                >
                  Built for student teamwork
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "inherit",
                    opacity: 0.82,
                    lineHeight: 1.7,
                    mb: 3,
                  }}
                >
                  Instead of switching between WhatsApp, shared documents and
                  calendar apps, StudySync gives students one clear place to plan
                  and manage academic collaboration.
                </Typography>
                <Box sx={{ display: "grid", gap: 1.5 }}>
                  {["Groups", "Sessions", "Tasks", "Resources"].map((item) => (
                    <Box
                      key={item}
                      sx={{
                        px: 2,
                        py: 1.2,
                        borderRadius: 2,
                        backgroundColor: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        fontWeight: 700,
                      }}
                    >
                      {item}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FEATURES SECTION, we made it to show a little bit about what our webapp is. It communicates what the app can do, using cards and icons */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="overline"
            sx={{
              fontFamily: "inherit",
              letterSpacing: "0.2em",
              color: "#8D6E63",
              fontWeight: 700,
              display: "block",
              mb: 1,
            }}
          >
            Features
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontFamily: "inherit",
              fontWeight: 700,
              fontSize: { xs: "1.9rem", md: "2.6rem" },
              color: "#3E2723",
              letterSpacing: "-0.02em",
            }}
          >
            Everything your study group needs
          </Typography>
        </Box>
        {/*This block of code below loops through our already created array to show the feartures, we used maps cause we learnt that in Data Structures and Algorithms */}
        <Grid container spacing={3}>
          {features.map(({ icon, title, desc }) => (
            <Grid item xs={12} sm={6} md={3} key={title}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  border: "1px solid #EDE0DC",
                  p: 1,
                  transition: "all 0.25s ease",
                  "&:hover": {
                    borderColor: "#A1887F",
                    boxShadow: "0 12px 40px rgba(93,64,55,0.12)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2.5,
                      backgroundColor: "#FBF3EF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#5D4037",
                      mb: 2.5,
                    }}
                  >
                    {icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontFamily: "inherit",
                      fontSize: "1rem",
                      mb: 1,
                      color: "#3E2723",
                    }}
                  >
                    {title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#795548",
                      lineHeight: 1.65,
                      fontFamily: "inherit",
                    }}
                  >
                    {desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CALL-TO-ACTION (CTA) SECTION, we made this to encourages users who have read the features to take action */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #4E342E 0%, #6D4C41 100%)",
          py: { xs: 8, md: 10 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container
          maxWidth="md"
          sx={{ textAlign: "center", position: "relative", zIndex: 1 }}
        >
          <Typography
            variant="h3"
            sx={{
              fontFamily: "inherit",
              fontWeight: 700,
              color: "white",
              fontSize: { xs: "1.8rem", md: "2.6rem" },
              mb: 2,
              letterSpacing: "-0.02em",
            }}
          >
            Ready to organise your study life?
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.75)",
              mb: 5,
              fontSize: "1.05rem",
              maxWidth: 500,
              mx: "auto",
              fontFamily: "inherit",
              lineHeight: 1.7,
            }}
          >
            Create an account and start managing groups, sessions, tasks and
            shared study resources.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/register"
            sx={{
              backgroundColor: "#FFD54F",
              color: "#3E2723",
              fontWeight: 700,
              fontFamily: "inherit",
              px: 5,
              py: 1.75,
              borderRadius: "999px",
              fontSize: "1rem",
              boxShadow: "0 8px 30px rgba(255,213,79,0.3)",
              "&:hover": {
                backgroundColor: "#FFE082",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 40px rgba(255,213,79,0.45)",
              },
              transition: "all 0.2s ease",
            }}
          >
            Create your free account
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;