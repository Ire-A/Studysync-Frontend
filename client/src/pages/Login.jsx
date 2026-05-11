// Login.jsx, Handles user authentication via email and password.
// On success, stores the user object in localStorage, fires a custom event for the Navbar,
// and redirects to the dashboard.

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Button, Container, TextField, Typography, Alert } from "@mui/material";
import { loginUser } from "../services/api";

/* Shared TextField styles, defined outside the component to avoid recreating the object on every render. The colours match the warm brown palette
   used across the app (taupe border, walnut on focus). */
const inputSx = {
  mb: 2.5,
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    fontFamily: "'Georgia', serif",
    fontSize: "0.95rem",
    "& fieldset": { borderColor: "#D7CCC8" },
    "&:hover fieldset": { borderColor: "#8D6E63" },
    "&.Mui-focused fieldset": { borderColor: "#5D4037", borderWidth: 2 },
  },
  "& .MuiInputLabel-root": { fontFamily: "'Georgia', serif", color: "#8D6E63" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#5D4037" },
};

/* Main Login component, handles email/password authentication.
   On success it stores the user object in localStorage, dispatches the
   studysyncAuthChanged event so the Navbar updates, then redirects to /dashboard.
*/
function Login() {
  const navigate = useNavigate();

  // Controlled form state, we track email and password together in one object.
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  // Generic change handler, uses the input's name attribute to update the correct field.
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  // Form submission, runs client‑side validation before hitting the API.
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Basic presence check before making a network request.
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    // Lightweight email format check the server validates more strictly.
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const data = await loginUser(formData);

      // Persist the returned user object so other components (Navbar, Dashboard) can read it.
      localStorage.setItem("studysyncUser", JSON.stringify(data.user));

      // Notify the Navbar to re‑read localStorage and show the authenticated nav links.
      window.dispatchEvent(new Event("studysyncAuthChanged"));

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    // Full‑viewport gradient background, same palette as the hero on Home.jsx.
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #3E2723 0%, #6D4C41 60%, #8D6E63 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Georgia', serif",
        py: 6,
        position: "relative",
        // Subtle gold glow in the top‑left adds depth without distraction.
        "&::before": {
          content: '""',
          position: "absolute",
          top: "15%",
          left: "10%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(255,213,79,0.07)",
          filter: "blur(60px)",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        {/* Brand header, shown above the card so the logo is visible against the gradient. */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography
            sx={{
              fontFamily: "inherit",
              fontWeight: 700,
              fontSize: "1.6rem",
              color: "#FFD54F",
              letterSpacing: "-0.01em",
            }}
          >
            StudySync
          </Typography>

          <Typography
            sx={{
              fontFamily: "inherit",
              color: "rgba(255,255,255,0.65)",
              mt: 0.5,
              fontSize: "0.9rem",
            }}
          >
            Welcome back
          </Typography>
        </Box>

        {/* White card, elevated shadow lifts it off the dark background. */}
        <Box
          sx={{
            background: "rgba(255,255,255,0.97)",
            borderRadius: 5,
            p: { xs: 3, md: 5 },
            boxShadow: "0 32px 80px rgba(30,10,5,0.4)",
          }}
        >
          <Typography
            sx={{
              fontFamily: "inherit",
              fontWeight: 700,
              fontSize: "1.5rem",
              color: "#3E2723",
              mb: 0.5,
            }}
          >
            Log in
          </Typography>

          <Typography
            sx={{
              fontFamily: "inherit",
              color: "#795548",
              mb: 4,
              fontSize: "0.9rem",
            }}
          >
            Access your StudySync dashboard.
          </Typography>

          {/* Error alert, only rendered when there is a message to show. */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {/* We use uppercase labels above each field instead of floating MUI labels,
                to keep the form consistent with JoinGroup and CreateGroup pages. */}
            <Typography
              sx={{
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#8D6E63",
                mb: 0.75,
              }}
            >
              Email
            </Typography>

            <TextField
              fullWidth
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              sx={inputSx}
            />

            <Typography
              sx={{
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#8D6E63",
                mb: 0.75,
              }}
            >
              Password
            </Typography>

            <TextField
              fullWidth
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              sx={inputSx}
            />

            {/* Submit button, pill‑shaped to match the CTA buttons on Home and Navbar. */}
            <Button
              fullWidth
              type="submit"
              sx={{
                mt: 1,
                backgroundColor: "#5D4037",
                color: "#fff",
                fontFamily: "inherit",
                fontWeight: 700,
                borderRadius: "999px",
                py: 1.5,
                fontSize: "1rem",
                boxShadow: "0 4px 16px rgba(93,64,55,0.3)",
                "&:hover": {
                  backgroundColor: "#3E2723",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Log in
            </Button>
          </Box>

          {/* Sign‑up nudge for users who don't have an account yet. */}
          <Typography
            sx={{
              fontFamily: "inherit",
              textAlign: "center",
              mt: 4,
              fontSize: "0.88rem",
              color: "#795548",
            }}
          >
            Don&apos;t have an account?{" "}
            <Box
              component={Link}
              to="/register"
              sx={{
                color: "#5D4037",
                fontWeight: 700,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Sign up free
            </Box>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;