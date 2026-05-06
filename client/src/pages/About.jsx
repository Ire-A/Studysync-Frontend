import { Box, Container, Typography } from "@mui/material";

function About() {
  return (
    <Box sx={{ background: "#FAF7F5", minHeight: "100vh", py: { xs: 8, md: 12 }, fontFamily: "'Georgia', serif" }}>
      <Container maxWidth="md">

        {/* Page label */}
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
          <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8D6E63", fontFamily: "inherit" }}>
            About
          </Typography>
        </Box>

        <Typography
          variant="h2"
          sx={{
            fontFamily: "inherit",
            fontWeight: 700,
            fontSize: { xs: "2rem", md: "3rem" },
            color: "#3E2723",
            letterSpacing: "-0.02em",
            mb: 2,
            lineHeight: 1.15,
          }}
        >
          Built for students,<br />by students
        </Typography>

        {/* Amber underline accent */}
        <Box sx={{ width: 60, height: 4, borderRadius: 2, backgroundColor: "#FFD54F", mb: 6 }} />

        {/* Content cards */}
        {[
          {
            icon: "📚",
            title: "What is StudySync?",
            body: "StudySync is a student-focused web application designed to help users organise their academic work more effectively. It brings your entire study workflow into one clean, simple platform.",
          },
          {
            icon: "🤝",
            title: "What can you do?",
            body: "Create study groups, schedule revision sessions, share resources like links and notes, and manage coursework tasks — all without switching between different tools or apps.",
          },
          {
            icon: "🎓",
            title: "Where did it come from?",
            body: "StudySync was developed as part of a Web Technologies module at Griffith College Dublin. It was built with React, Node.js and MongoDB.",
          },
        ].map(({ icon, title, body }, i) => (
          <Box
            key={title}
            sx={{
              display: "flex",
              gap: 3,
              p: { xs: 3, md: 4 },
              mb: 3,
              borderRadius: 4,
              border: "1px solid #EDE0DC",
              background: "#fff",
              boxShadow: "0 4px 20px rgba(62,39,35,0.05)",
              animation: "fadeUp 0.4s ease both",
              animationDelay: `${i * 0.1}s`,
              "@keyframes fadeUp": {
                from: { opacity: 0, transform: "translateY(14px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
              "&:hover": {
                boxShadow: "0 8px 32px rgba(62,39,35,0.1)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.2s ease",
            }}
          >
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
                fontSize: "1.5rem",
              }}
            >
              {icon}
            </Box>
            <Box>
              <Typography sx={{ fontFamily: "inherit", fontWeight: 700, color: "#3E2723", mb: 0.75, fontSize: "1.05rem" }}>
                {title}
              </Typography>
              <Typography sx={{ fontFamily: "inherit", color: "#795548", lineHeight: 1.75, fontSize: "0.95rem" }}>
                {body}
              </Typography>
            </Box>
          </Box>
        ))}
      </Container>
    </Box>
  );
}

export default About;