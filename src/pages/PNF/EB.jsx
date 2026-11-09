import React, { Component } from "react";
import { Link } from "react-router-dom";

class EB extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to indicate that an error has occurred
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Log the error to the console for debugging
    this.setState({ error, info });
    console.error("Error caught by Error Boundary: ", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.overlay}>
            <img
              src="/beauty.gif" // Background GIF
              alt="Beauty Shop Error"
              style={styles.backgroundImage}
            />
          </div>
          <div style={styles.content}>
            <h2 style={styles.title}>Oops! Something Went Wrong!</h2>
            <p style={styles.message}>
              Looks like our beauty magic got interrupted. 🔥 We're fixing it as fast as we can!
            </p>
            <p style={styles.message}>
              Meanwhile, why not take a look at our other fabulous services? 💅
            </p>
            {/* Fallback: Use a standard <a> tag if Link is causing issues */}
            <a href="/" style={styles.button}>Return to Beauty Home</a>
          </div>
        </div>
      );
    }

    // Render the children when there's no error
    return this.props.children;
  }
}

const styles = {
  container: {
    position: "relative",
    minHeight: "100vh", // Ensures full screen height
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    overflow: "hidden", // Prevents overflow if background image is too large
  },
  overlay: {
    position: "absolute", // Positions the overlay behind the content
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1, // Ensures the image stays behind the text
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%", // Full width of the container
    height: "100%", // Full height of the container
    objectFit: "cover", // Ensures the image covers the entire container while maintaining aspect ratio
  },
  content: {
    zIndex: 1, // Makes sure the content stays on top of the background image
    position: "relative",
    padding: "20px",
    maxWidth: "600px", // Prevents text from getting too wide on larger screens
  },
  title: {
    fontSize: "2rem", // Larger font size for emphasis
    fontWeight: "700",
    color: "#6a2e9f", // Premium purple for the title
    marginBottom: "15px",
    fontFamily: "Segoe UI, sans-serif",
  },
  message: {
    fontSize: "1.2rem", // Slightly larger text for better readability
    color: "#7c3aed", // Violet/Purple for the text
    maxWidth: "750px",
    marginBottom: "25px",
  },
  button: {
    display: "inline-block",
    padding: "12px 24px",
    background: "#6a2e9f", // Premium purple button color
    color: "#fff",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "600",
    transition: "background 0.3s ease",
  },
};

// Add hover effect manually to the button
styles.button["&:hover"] = {
  background: "#4c1d95", // Darker purple on hover
};

export default EB;
