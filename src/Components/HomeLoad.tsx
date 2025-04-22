import { useEffect } from "react";

export const HomeLoad = () => {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = "/map";
    }, 5000);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="home_load">
        <svg
          width="173"
          height="159"
          viewBox="0 0 173 159"
          fill="none"
          overflow={"visible"}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            id="ring_2"
            d="M63.2333 2.19009C50.7 6.05676 48.0333 7.39009 38.4333 13.6568C20.4333 25.6568 6.96667 44.3234 1.9 64.3234C-0.633333 74.4568 -0.633333 93.2568 1.9 104.857C5.5 120.723 12.5 128.5 23.5 143.39L34.8333 154.723L37.6333 151.923L40.3 149.123L31.7667 140.057C16.5667 123.923 9.23333 105.657 9.23333 83.9234C9.23333 42.1901 43.2333 8.85675 85.9 8.59009C99.2333 8.45675 108.433 10.5901 120.967 16.7234C168.433 39.3901 175.955 104.246 142.5 140.057C140.133 142.59 134 149.123 134 149.123L137 151.923L140.5 154.723C140.5 154.723 145.329 148.403 149.9 143.39C158.7 133.657 168.167 115.123 170.567 102.99C172.833 92.0568 172.433 72.7234 169.9 62.9901C162.7 35.2568 142.167 13.5234 113.633 3.52342C102.167 -0.476578 74.1667 -1.27657 63.2333 2.19009Z"
            fill="#5D94C7"
          />
          <path
            id="ring_1"
            d="M70.4353 23.9474C56.9686 27.1474 34.5686 40.8808 39.7686 42.7474C40.5686 43.0141 42.3019 44.0808 43.6353 45.0141C45.7686 46.6141 46.8353 46.2141 51.7686 42.3474C70.8353 27.8141 101.902 28.4808 120.169 43.9474C122.569 45.8141 127.769 48.4808 132.035 49.8141L139.635 52.2141L140.435 61.2808C143.502 94.8808 139.635 113.147 125.235 132.481C122.169 136.481 118.435 141.281 116.702 143.147C115.102 144.881 114.035 146.614 114.302 146.881C115.369 148.081 132.169 135.014 136.302 129.814C146.702 116.747 152.569 93.4141 149.769 76.8808C144.835 48.7474 124.435 28.2141 96.1686 23.2808C85.2353 21.4141 80.3019 21.5474 70.4353 23.9474Z"
            fill="#3E71A4"
          />
          <path
            id="ring_1"
            d="M99.0303 23.9474C112.497 27.1474 134.897 40.8808 129.697 42.7474C128.897 43.0141 127.164 44.0808 125.83 45.0141C123.697 46.6141 122.63 46.2141 117.697 42.3474C98.6303 27.8141 67.5636 28.4808 49.297 43.9474C46.897 45.8141 41.697 48.4808 37.4303 49.8141L29.8303 52.2141L29.0303 61.2808C25.9636 94.8808 29.8303 113.147 44.2303 132.481C47.297 136.481 51.0303 141.281 52.7636 143.147C54.3636 144.881 55.4303 146.614 55.1636 146.881C54.097 148.081 37.297 135.014 33.1636 129.814C22.7636 116.747 16.897 93.4141 19.697 76.8808C24.6303 48.7474 45.0303 28.2141 73.297 23.2808C84.2303 21.4141 89.1636 21.5474 99.0303 23.9474Z"
            fill="#3E71A4"
          />
          <path
            id="avatar"
            d="M86.236 40C82 40 78.9414 44.6603 69 48.9001C61.6286 52.0439 49.5361 54.1335 42 55.5668C34.464 57 34.5 58.5 36.5 76.9001C38.7261 97.3797 40.2657 115.861 54.5 130.767C63.0334 139.7 82.7694 158.5 85.7027 158.5C88.2361 158.5 109.436 139.7 115.836 130.767C128.103 114.1 133.036 99.8334 134.369 76.9001C135.436 60.2334 134.236 56.9001 127.303 55.5668C118.769 53.9668 113.067 53.5668 104 48.9001C94.1334 43.8334 90.5401 40 86.236 40ZM100 83.1668C97.356 91 92.8054 93.8334 86.9027 93.8334C81 93.8334 75.1667 90.3668 72.5 83.1668C69.1846 73.7306 76.7825 64.4889 86.236 64.2334C96.131 64.2334 103.141 73.8621 100 83.1668ZM107.5 109.567C110.5 114.674 111.5 127 107.5 132.233C105 135.504 93.6068 146.03 85.7027 152.233C78.7015 146.668 67.3 136.5 64.1027 132.233C60.8 127 61.1694 115.033 64.1027 109.567C69.3027 99.7001 101 98.5 107.5 109.567Z"
            fill="#D23730"
          />
        </svg>
      </div>
    </>
  );
};

const styles = `
.home_load {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* Prevent overflow issues during flip */
  background-color: transparent; /* Start with a transparent background */
  animation: thunder_flash 7s linear infinite; /* Add thunder animation */
}

/* New Thunder Animation */
@keyframes thunder_flash {
  0%, 100% { background-color: transparent; } /* Default state */
  40% { background-color: transparent; opacity: 1; }
  41% { background-color: rgba(210, 225, 255, 0.7); opacity: 0.9; } /* Quick flash */
  41.5% { background-color: transparent; opacity: 1; }
  43% { background-color: transparent; opacity: 1; }
  43.5% { background-color: rgba(230, 240, 255, 0.8); opacity: 0.95; } /* Brighter flash */
  44.5% { background-color: transparent; opacity: 1; }
  45% { background-color: rgba(200, 220, 255, 0.6); opacity: 0.8; } /* Softer flash */
  46% { background-color: transparent; opacity: 1; }
}

/* Keep original animations if needed elsewhere, or rename/replace */
@keyframes ring_opacity {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

@keyframes grow {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes glow_effect {
  0% {
    filter: drop-shadow(0 0 3px rgba(93, 148, 199, 0.7)) drop-shadow(0 0 5px rgba(93, 148, 199, 0.5));
    transform: scale(1);
    opacity: 1;
  }
  50% {
    filter: drop-shadow(0 0 5px rgba(93, 148, 199, 1)) drop-shadow(0 0 10px rgba(93, 148, 199, 0.8));
    transform: scale(1.20);
    opacity: 0.7;
  }
  100% {
    filter: drop-shadow(0 0 3px rgba(93, 148, 199, 0.7)) drop-shadow(0 0 5px rgba(93, 148, 199, 0.5));
    transform: scale(1);
    opacity: 1;
  }
}

/* New Animations */
@keyframes giggle_flip {
  0% { transform: rotate(0deg) rotateY(0deg); }
  10% { transform: rotate(8deg) rotateY(0deg); } /* Giggle */
  20% { transform: rotate(-8deg) rotateY(0deg); }
  30% { transform: rotate(0deg) rotateY(0deg); } /* Settle before flip */
  50% { transform: rotate(0deg) rotateY(180deg); } /* Flip */
  60% { transform: rotate(8deg) rotateY(180deg); } /* Giggle while flipped */
  70% { transform: rotate(-8deg) rotateY(180deg); }
  80% { transform: rotate(0deg) rotateY(180deg); } /* Settle before flip back */
  100% { transform: rotate(0deg) rotateY(360deg); } /* Flip back */
}

@keyframes ring_wobble_1 {
  0% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(3deg); }
  50% { transform: scale(1.2) rotate(0deg); }
  75% { transform: scale(1.1) rotate(-3deg); }
  100% { transform: scale(1) rotate(0deg); }
}

@keyframes ring_wobble_glow_2 {
  0% {
    filter: drop-shadow(0 0 3px rgba(93, 148, 199, 0.7)) drop-shadow(0 0 5px rgba(93, 148, 199, 0.5));
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  25% {
    filter: drop-shadow(0 0 4px rgba(93, 148, 199, 0.85)) drop-shadow(0 0 7px rgba(93, 148, 199, 0.65));
    transform: scale(1.1) rotate(-3deg); /* Wobble opposite */
    opacity: 0.85;
  }
  50% {
    filter: drop-shadow(0 0 5px rgba(93, 148, 199, 1)) drop-shadow(0 0 10px rgba(93, 148, 199, 0.8));
    transform: scale(1.20) rotate(0deg);
    opacity: 0.7;
  }
  75% {
    filter: drop-shadow(0 0 4px rgba(93, 148, 199, 0.85)) drop-shadow(0 0 7px rgba(93, 148, 199, 0.65));
    transform: scale(1.1) rotate(3deg); /* Wobble opposite */
    opacity: 0.85;
  }
  100% {
    filter: drop-shadow(0 0 3px rgba(93, 148, 199, 0.7)) drop-shadow(0 0 5px rgba(93, 148, 199, 0.5));
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

/* Apply new animations */
#ring_2 {
  animation: ring_wobble_glow_2 4s ease-in-out infinite;
  transform-origin: center;
}

#ring_1 {
  animation: ring_wobble_1 4s ease-in-out infinite;
  transform-origin: center;
}

#avatar {
  animation: giggle_flip 4s ease-in-out infinite;
  transform-origin: center;
  filter: drop-shadow(0 0 5px rgba(210, 55, 48, 0.6)); /* Adjusted shadow for avatar color */
}
`;
