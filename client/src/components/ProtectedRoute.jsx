import { Navigate } from "react-router-dom";

/* ProtectedRoute page, we addded it to check if user is authenticated before rendering a page.
 * If not authenticated, redirects to /login.
 * We used a wrapper component because it is reusable, it wraps any route that requires login.
 * It is cleaner than duplicating auth checks in every page component and it has a central logic amking it e/asy to modify
 */
function ProtectedRoute({ children }) {
  // Check if user data exists in localStorage (set on login)
  const user = localStorage.getItem("studysyncUser");

  if (!user) {
    // Not logged in – redirect to login page
    return <Navigate to="/login" replace />;
  }

  // Logged in – render the requested page
  return children;
}

export default ProtectedRoute;