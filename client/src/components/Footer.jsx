import { Box, Typography, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#5D4037",
        color: "white",
        py: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="body2" sx={{ mb: 1 }}>
        &copy; 2026 StudySync
      </Typography>

      <Box>
        <MuiLink
          component={Link}
          to="/about"
          color="inherit"
          sx={{ mx: 1, textDecoration: "none" }}
        >
          About Us
        </MuiLink>

        <MuiLink
          component={Link}
          to="/contact"
          color="inherit"
          sx={{ mx: 1, textDecoration: "none" }}
        >
          Contact Us
        </MuiLink>
      </Box>
    </Box>
  );
}

export default Footer;