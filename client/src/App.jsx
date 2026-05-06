import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme, Box } from "@mui/material";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateSession from "./pages/CreateSession";
import Groups from "./pages/Groups";
import CreateGroup from "./pages/CreateGroup";
import Tasks from "./pages/Tasks";
import Resources from "./pages/Resources";
import About from "./pages/About";
import Contact from "./pages/Contact";

const theme = createTheme({
  palette: {
    primary: { main: "#5D4037" },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          
          <Navbar />

          <Box sx={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-session" element={<CreateSession />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/create-group" element={<CreateGroup />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Box>

          <Footer />

        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;