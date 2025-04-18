import { styled } from "@mui/material/styles";
import { useEffect } from "react";

// const RainDrop = styled("div")({
//   position: "absolute",
//   width: "2px",
//   background:
//     "linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.6))",
//   borderRadius: "50%",
//   pointerEvents: "none",
// });

const RainContainer = styled("div")({
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
  zIndex: 0,
});

export const RainEffect = () => {
  useEffect(() => {
    const rainContainer = document.querySelector(".rain-container");
    if (!rainContainer) return;

    const createRainDrop = () => {
      const drop = document.createElement("div");
      drop.className = "rain-drop";

      // Random properties for natural look
      const size = Math.random() * 2 + 3; // Height between 3-5px
      const posX = Math.random() * 100; // Random horizontal position
      const duration = Math.random() * 0.5 + 0.7; // Animation duration
      const delay = Math.random() * 2; // Random start delay

      // Apply styles
      drop.style.cssText = `
        left: ${posX}%;
        height: ${size}px;
        animation: rainfall ${duration}s linear ${delay}s infinite;
      `;

      rainContainer.appendChild(drop);

      // Remove drops after they've fallen to avoid memory issues
      setTimeout(() => {
        if (drop.parentNode === rainContainer) {
          rainContainer.removeChild(drop);
        }
      }, (duration + delay) * 1000);
    };

    // Create initial raindrops
    for (let i = 0; i < 100; i++) {
      createRainDrop();
    }

    // Continue adding raindrops
    const interval = setInterval(() => {
      for (let i = 0; i < 5; i++) {
        createRainDrop();
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return <RainContainer className="rain-container" />;
};
