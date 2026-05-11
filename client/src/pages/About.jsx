// About.jsx. Information page explaining StudySync
// This component provides an overview of the platform, its features, and origin.
// It uses MUI icons for visual consistency and a clean, card‑based layout.

import { Box, Container, Typography } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GroupIcon from "@mui/icons-material/Group";
import SchoolIcon from "@mui/icons-material/School";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import TaskIcon from "@mui/icons-material/Task";
import ShareIcon from "@mui/icons-material/Share";
import CodeIcon from "@mui/icons-material/Code";

function About() {
  // Data for the three content cards, each with a dedicated MUI icon.
  // Using an array makes it easy to add or reorder sections without duplicating JSX.
  const sections = [
    {
      icon: <MenuBookIcon sx={{ fontSize: "1.8rem" }} />,
      title: "What is StudySync?",
      body: "StudySync is a student-focused web application designed to help users organise their academic work more effectively. It brings your entire study workflow into one clean, simple platform.",
    },
    {
      icon: <GroupIcon sx={{ fontSize: "1.8rem" }} />,
      title: "What can you do?",
      body: "Create study groups, schedule revision sessions, share resources like links and notes, and manage coursework tasks — all without switching between different tools or apps.",
    },
    {
      icon: <SchoolIcon sx={{ fontSize: "1.8rem" }} />,
      title: "Where did it come from?",
      body: "StudySync was developed as part of a Web Technologies module at Griffith College Dublin. It was built with React, Node.js and MongoDB.",
    },
  ];

  // Decorative feature icons, used in the strip at the bottom.
  // This is purely visual and reinforces the key functionalities.
  const featureIcons = [<TaskIcon />, <ShareIcon />, <EmojiObjectsIcon />, <CodeIcon />];

  return (
    <Box
      sx={{
        background: "#FAF7F5",        // soft off‑white background, consistent with Dashboard
        minHeight: "100vh",           // full viewport height
        py: { xs: 8, md: 12 },        // responsive vertical padding: less on mobile, more on desktop
        fontFamily: "'Georgia', serif", // serif font gives a scholarly, trustworthy feel
      }}
    >
      <Container maxWidth="md">       // max width for comfortable reading on large screens

        {/* Page label, a small badge above the headline, consistent with Contact page */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 0.5,
            mb: 4,
            borderRadius: "999px",
            backgroundColor: "#EFEBE9",
            border: "1px solid #D7CCC8",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#8D6E63",
              fontFamily: "inherit",
            }}
          >
            About
          </Typography>
        </Box>

        {/* Main headline, responsive font size, with a line break for emphasis */}
        <Typography
          variant="h2"
          sx={{
            fontFamily: "inherit",
            fontWeight: 700,
            fontSize: { xs: "2rem", md: "3rem" }, // scales down on mobile
            color: "#3E2723",
            letterSpacing: "-0.02em",            // tighter letter spacing for modern look
            mb: 2,
            lineHeight: 1.15,
          }}
        >
          Built for students,
          <br />
          by students
        </Typography>

        {/* Amber underline accent, matches the gold colour from Home.jsx and Dashboard */}
        <Box
          sx={{
            width: 60,
            height: 4,
            borderRadius: 2,
            backgroundColor: "#FFD54F",
            mb: 6,
          }}
        />

        {/* Content cards, mapped from the sections array */}
        {sections.map(({ icon, title, body }, index) => (
          <Box
            key={title}
            sx={{
              display: "flex",
              gap: 3,
              p: { xs: 3, md: 4 },               // less padding on mobile
              mb: 3,
              borderRadius: 4,
              border: "1px solid #EDE0DC",
              background: "#fff",
              boxShadow: "0 4px 20px rgba(62,39,35,0.05)",
              // Staggered fade‑up animation, each card appears slightly later
              // This creates a progressive reveal effect as the user scrolls.
              animation: "fadeUp 0.4s ease both",
              animationDelay: `${index * 0.1}s`,   // delay increases per card
              "@keyframes fadeUp": {
                from: { opacity: 0, transform: "translateY(14px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
              "&:hover": {
                boxShadow: "0 8px 32px rgba(62,39,35,0.1)",
                transform: "translateY(-2px)",      // subtle lift on hover
              },
              transition: "all 0.2s ease",          // smooth hover transition
            }}
          >
            {/* Icon container, consistent size and background for each card */}
            <Box
              sx={{
                width: 52,
                height: 52,
                flexShrink: 0,
                borderRadius: 2.5,
                backgroundColor: "#FBF3EF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#5D4037", // matches the theme's walnut colour
              }}
            >
              {icon}
            </Box>
            <Box>
              <Typography
                sx={{
                  fontFamily: "inherit",
                  fontWeight: 700,
                  color: "#3E2723",
                  mb: 0.75,
                  fontSize: "1.05rem",
                }}
              >
                {title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "inherit",
                  color: "#795548",
                  lineHeight: 1.75,
                  fontSize: "0.95rem",
                }}
              >
                {body}
              </Typography>
            </Box>
          </Box>
        ))}

        {/* Decorative feature strip, shows icons representing tasks, resources, ideas, code */}
        {/* This is purely visual; it reinforces the app's core features without being interactive. */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 4,
            mt: 6,
            flexWrap: "wrap",     // wraps on small screens
          }}
        >
          {featureIcons.map((icon, idx) => (
            <Box
              key={idx}
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                backgroundColor: "#EFEBE9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#5D4037",
              }}
            >
              {icon}
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default About;