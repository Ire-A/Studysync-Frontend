// Footer.jsx, The sticky footer that appears at the bottom of every page.
// Contains brand info, navigation links for About and Contact, and a copyright notice.

import { Box, Typography, Link as MuiLink, Container, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import GroupsIcon from "@mui/icons-material/Groups";

// Colour palette, consistent with the warm brown and gold theme.
const t = {
  espresso: "#3E2723",
  walnut: "#5D4037",
  gold: "#FFD54F",
  white: "#FFFFFF",
  muted: "rgba(255,255,255,0.5)",
  subtle: "rgba(255,255,255,0.75)",
};

// Footer navigation links, only two pages (About and Contact) for simplicity.
const footerLinks = [
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
];

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: `linear-gradient(135deg, ${t.espresso} 0%, ${t.walnut} 100%)`,
        color: t.white,
        pt: 5,        // padding top
        pb: 3,        // padding bottom
        borderTop: "1px solid rgba(255,255,255,0.06)", // subtle separation from main content
      }}
    >
      <Container maxWidth="lg">
        {/* Top row: brand on the left, links on the right */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" }, // column on mobile, row on larger screens
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 3,
            mb: 3,
          }}
        >
          {/* Brand section */}
          <Box>
            <Typography
              sx={{
                fontFamily: "'Georgia', serif",
                fontWeight: 700,
                fontSize: "1.25rem",
                letterSpacing: "-0.01em",
                mb: 0.5,
                "& span": { color: t.gold },
              }}
            >
              Study<span>Sync</span>
            </Typography>
            <Typography
              sx={{
                color: t.muted,
                fontSize: "0.8rem",
                fontFamily: "'Georgia', serif",
                fontStyle: "italic",
              }}
            >
              Student collaboration, simplified.
            </Typography>
          </Box>

          {/* Footer navigation links, using MuiLink with React Router's Link component */}
          <Box sx={{ display: "flex", gap: { xs: 2, sm: 3 }, flexWrap: "wrap" }}>
            {footerLinks.map(({ label, to }) => (
              <MuiLink
                key={to}
                component={Link}
                to={to}
                sx={{
                  color: t.subtle,
                  textDecoration: "none",
                  fontFamily: "'Georgia', serif",
                  fontSize: "0.88rem",
                  "&:hover": { color: t.gold },
                  transition: "color 0.18s ease",
                }}
              >
                {label}
              </MuiLink>
            ))}
          </Box>
        </Box>

        {/* Divider line, visually separates the top row from the copyright */}
        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 2.5 }} />

        {/* Bottom row: copyright notice */}
        <Typography
          sx={{
            color: t.muted,
            fontSize: "0.78rem",
            fontFamily: "'Georgia', serif",
            textAlign: { xs: "left", sm: "center" }, // left align on mobile, centre on desktop
          }}
        >
          &copy; {new Date().getFullYear()} StudySync. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;