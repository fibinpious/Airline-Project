import React, { useState } from "react";
import "./button.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";

export const Button = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedRoutes, setRecommendedRoutes] = useState([]); // New state for storing routes

  const handleClick = async () => {
    setIsLoading(true);

    // Simulate an API call with setTimeout (replace with your actual API call)
    setTimeout(async () => {
      try {
        const response = await fetch(
          "https://api.example.com/routes" // Replace with your API endpoint
        );

        if (response.ok) {
          const data = await response.json();
          setRecommendedRoutes(data.routes); // Update the routes state with the fetched data
        } else {
          console.error("Failed to fetch routes");
        }
      } catch (error) {
        console.error("Error fetching routes:", error);
      } finally {
        setIsLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="container">
      <button
        disabled={isLoading}
        onClick={handleClick}
        className={`button ${isLoading ? "loading" : ""}`}
      >
        <FontAwesomeIcon icon={faSync} />
        <span>{isLoading ? "Searching" : "Search Flights"}</span>
      </button>

      {/* Display the list of recommended routes */}
      {recommendedRoutes.length > 0 && (
        <div className="routes-list">
          <h3>Recommended Routes:</h3>
          <ul>
            {recommendedRoutes.map((route, index) => (
              <li key={index}>{route}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Button;
