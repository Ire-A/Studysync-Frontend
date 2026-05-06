import { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Container, TextField, Typography, Alert } from "@mui/material";
import { registerUser } from "../services/api";

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

function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!formData.name || !formData.email || !formData.password) { setError("Please fill in all fields."); return; }
    if (!formData.email.includes("@")) { setError("Please enter a valid email address."); return; }
    if (formData.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    try {
      const data = await registerUser(formData);
      setSuccess(data.message);
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
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
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: "10%",
          right: "8%",
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "rgba(255,213,79,0.06)",
          filter: "blur(60px)",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>

        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography sx={{ fontFamily: "inherit", fontWeight: 700, fontSize: "1.6rem", color: "#FFD54F", letterSpacing: "-0.01em" }}>
            StudySync
          </Typography>
          <Typography sx={{ fontFamily: "inherit", color: "rgba(255,255,255,0.65)", mt: 0.5, fontSize: "0.9rem" }}>
            Create your free account
          </Typography>
        </Box>

        <Box
          sx={{
            background: "rgba(255,255,255,0.97)",
            borderRadius: 5,
            p: { xs: 3, md: 5 },
            boxShadow: "0 32px 80px rgba(30,10,5,0.4)",
            animation: "fadeUp 0.45s ease both",
            "@keyframes fadeUp": {
              from: { opacity: 0, transform: "translateY(20px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Typography sx={{ fontFamily: "inherit", fontWeight: 700, fontSize: "1.5rem", color: "#3E2723", mb: 0.5 }}>
            Register
          </Typography>
          <Typography sx={{ fontFamily: "inherit", color: "#795548", mb: 4, fontSize: "0.9rem" }}>
            Join thousands of students staying organised.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2, fontFamily: "inherit" }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2, fontFamily: "inherit" }}>{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            {[
              { label: "Full name", name: "name", type: "text", placeholder: "Jane Smith" },
              { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
              { label: "Password", name: "password", type: "password", placeholder: "Min. 6 characters" },
            ].map(({ label, name, type, placeholder }) => (
              <Box key={name}>
                <Typography sx={{ fontFamily: "inherit", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#8D6E63", mb: 0.75 }}>
                  {label}
                </Typography>
                <TextField fullWidth name={name} type={type} placeholder={placeholder} value={formData[name]} onChange={handleChange} sx={inputSx} />
              </Box>
            ))}

            <Button
              fullWidth
              type="submit"
              sx={{
                mt: 1,
                backgroundColor: "#FFD54F",
                color: "#3E2723",
                fontFamily: "inherit",
                fontWeight: 700,
                borderRadius: "999px",
                py: 1.5,
                fontSize: "1rem",
                boxShadow: "0 4px 16px rgba(255,213,79,0.35)",
                "&:hover": { backgroundColor: "#FFE082", transform: "translateY(-1px)" },
                transition: "all 0.2s ease",
              }}
            >
              Create account
            </Button>
          </Box>

          <Typography sx={{ fontFamily: "inherit", textAlign: "center", mt: 4, fontSize: "0.88rem", color: "#795548" }}>
            Already have an account?{" "}
            <Box component={Link} to="/login" sx={{ color: "#5D4037", fontWeight: 700, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
              Log in
            </Box>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Register;