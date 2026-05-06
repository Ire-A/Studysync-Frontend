// Shared design tokens — import into any page for consistency
export const C = {
  brown900: "#3E2723",
  brown700: "#5D4037",
  brown500: "#8D6E63",
  brown200: "#D7CCC8",
  brown50:  "#EFEBE9",
  amber:    "#FFD54F",
  amberLight: "#FFF8E1",
  white:    "#FFFFFF",
  text:     "#2D1C14",
  muted:    "#795548",
};

export const pageWrap = {
  minHeight: "100vh",
  background: "#FAF7F5",
  fontFamily: "'Georgia', serif",
  py: { xs: 6, md: 10 },
};

export const card = {
  borderRadius: 4,
  border: "1px solid #EDE0DC",
  boxShadow: "0 4px 24px rgba(62,39,35,0.07)",
  background: "#fff",
};

export const formCard = {
  ...card,
  p: { xs: 3, md: 5 },
};

export const pill = (bg = "#EFEBE9", color = "#5D4037") => ({
  display: "inline-block",
  px: 1.5,
  py: 0.25,
  borderRadius: "999px",
  backgroundColor: bg,
  color,
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
});

export const heading = {
  fontFamily: "'Georgia', serif",
  fontWeight: 700,
  color: "#3E2723",
  letterSpacing: "-0.02em",
};

export const primaryBtn = {
  backgroundColor: "#5D4037",
  color: "#fff",
  fontFamily: "'Georgia', serif",
  fontWeight: 700,
  borderRadius: "999px",
  px: 4,
  py: 1.25,
  boxShadow: "0 4px 16px rgba(93,64,55,0.25)",
  "&:hover": {
    backgroundColor: "#3E2723",
    transform: "translateY(-1px)",
    boxShadow: "0 6px 20px rgba(62,39,35,0.3)",
  },
  transition: "all 0.2s ease",
};

export const outlinedBtn = {
  borderColor: "#8D6E63",
  color: "#5D4037",
  fontFamily: "'Georgia', serif",
  borderRadius: "999px",
  px: 3,
  "&:hover": {
    borderColor: "#5D4037",
    backgroundColor: "#EFEBE9",
  },
};