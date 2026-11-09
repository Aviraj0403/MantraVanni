import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  // Auto redirect after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 10000); // Redirect after 10 seconds
    return () => clearTimeout(timer); // cleanup
  }, [navigate]);

  return (
    <div style={styles.container}>
      {/* Dark overlay for readability */}
      <div style={styles.overlay}></div>
      <div style={styles.content}>
        <h1 style={styles.title}>404 - Page Not Found</h1>
        <p style={styles.message}>
          Oops! Looks like we don't offer this beauty service right now 💅
          <br />
          Don't worry, we'll take you back to our fabulous homepage in a few seconds!
        </p>
        <Link to="/" style={styles.button}>
          Back to Home
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh", // Full-screen height
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundImage: "url('/beauty.gif')", // Use the same background image as EB.jsx
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
    padding: "20px",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark overlay for readability
    zIndex: 1,
  },
  content: {
    position: "relative",
    zIndex: 2, // Ensure content is above the overlay
    color: "#ffffff", // White text for better contrast
    padding: "20px",
    maxWidth: "500px",
    textAlign: "center",
    backgroundColor: "#006a6a", // Marine blue-green background for the content
    borderRadius: "10px", // Rounded corners for content box
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", // Shadow for better separation
  },
  title: {
    fontSize: "2.4rem",
    fontWeight: "700", // Bold title for visibility
    marginBottom: "15px",
    fontFamily: "Segoe UI, sans-serif",
  },
  message: {
    fontSize: "1.2rem",
    fontWeight: "bold", // Bold message text for emphasis
    maxWidth: "400px",
    margin: "0 auto 20px auto",
  },
  button: {
    display: "inline-block",
    padding: "12px 24px",
    background: "#ff7043", // Button color for consistency
    color: "#fff",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "600",
    transition: "background 0.3s ease",
  },
};

// Hover effect for the button
styles.button["&:hover"] = {
  background: "#d84315", // Darker orange shade for hover effect
};

export default NotFoundPage;
