import { useState } from "react";
import { Box, Button, Container, TextField, Typography, Alert } from "@mui/material";

function Contact() {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;
    setSuccess("Message sent successfully (demo only).");
    setMessage("");
  }

  return (
    <Box sx={{ background: "#FAF7F5", minHeight: "100vh", py: { xs: 8, md: 12 }, fontFamily: "'Georgia', serif" }}>
      <Container maxWidth="sm">

        {/* Label */}
        <Box sx={{ display: "inline-flex", px: 2, py: 0.5, mb: 4, borderRadius: "999px", backgroundColor: "#EFEBE9", border: "1px solid #D7CCC8" }}>
          <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8D6E63", fontFamily: "inherit" }}>
            Contact
          </Typography>
        </Box>

        <Typography variant="h2" sx={{ fontFamily: "inherit", fontWeight: 700, fontSize: { xs: "2rem", md: "2.8rem" }, color: "#3E2723", letterSpacing: "-0.02em", mb: 1, lineHeight: 1.15 }}>
          Get in touch
        </Typography>
        <Typography sx={{ fontFamily: "inherit", color: "#795548", mb: 6, lineHeight: 1.7 }}>
          Have a question or feedback? Send us a message.
        </Typography>

        {/* Form card */}
        <Box
          sx={{
            borderRadius: 4,
            border: "1px solid #EDE0DC",
            background: "#fff",
            boxShadow: "0 8px 40px rgba(62,39,35,0.08)",
            p: { xs: 3, md: 5 },
            animation: "fadeUp 0.4s ease both",
            "@keyframes fadeUp": {
              from: { opacity: 0, transform: "translateY(14px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          {success && (
            <Alert
              severity="success"
              sx={{
                mb: 3,
                borderRadius: 2,
                backgroundColor: "#F1F8E9",
                color: "#33691E",
                fontFamily: "inherit",
                "& .MuiAlert-icon": { color: "#558B2F" },
              }}
            >
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Typography sx={{ fontFamily: "inherit", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#8D6E63", mb: 1 }}>
              Your message
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={5}
              placeholder="Write your message here…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,
                  fontFamily: "inherit",
                  fontSize: "0.95rem",
                  "& fieldset": { borderColor: "#D7CCC8" },
                  "&:hover fieldset": { borderColor: "#8D6E63" },
                  "&.Mui-focused fieldset": { borderColor: "#5D4037" },
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#5D4037",
                color: "#fff",
                fontFamily: "inherit",
                fontWeight: 700,
                borderRadius: "999px",
                px: 5,
                py: 1.5,
                fontSize: "0.95rem",
                boxShadow: "0 4px 16px rgba(93,64,55,0.25)",
                "&:hover": { backgroundColor: "#3E2723", transform: "translateY(-1px)" },
                transition: "all 0.2s ease",
              }}
            >
              Send message
            </Button>
          </Box>
        </Box>

        {/* Decorative info strip */}
        <Box sx={{ display: "flex", gap: 4, mt: 5, flexWrap: "wrap" }}>
          {[{ icon: "📧", label: "Email", value: "hello@studysync.ie" }, { icon: "🏫", label: "College", value: "Griffith College Dublin" }].map(({ icon, label, value }) => (
            <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ width: 38, height: 38, borderRadius: 2, backgroundColor: "#EFEBE9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>
                {icon}
              </Box>
              <Box>
                <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#A1887F", fontFamily: "inherit" }}>{label}</Typography>
                <Typography sx={{ fontSize: "0.88rem", color: "#3E2723", fontFamily: "inherit" }}>{value}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

      </Container>
    </Box>
  );
}

export default Contact;