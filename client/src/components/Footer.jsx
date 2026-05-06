import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        py: 3,
        textAlign: "center",
        backgroundColor: "#5D4037",
        color: "white",
      }}
    >
      <Typography variant="body2">
        &copy; 2026 StudySync | Built for Web Technologies Assignment 3
      </Typography>
    </Box>
  );
}

export default Footer;