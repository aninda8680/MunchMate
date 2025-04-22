import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const numSquaresX = useRef();
  const numSquaresY = useRef();
  const gridOffset = useRef({ x: 0, y: 0 });
  const hoveredSquare = useRef(null);

  // Square background settings
  const direction = "down";
  const speed = 0.5;
  const borderColor = "#FF6600";
  const squareSize = 40;
  const hoverFillColor = "#FF4500";

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
      numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set background color
      ctx.fillStyle = "#111111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize);
          const squareY = y - (gridOffset.current.y % squareSize);

          if (
            hoveredSquare.current &&
            Math.floor((x - startX) / squareSize) === hoveredSquare.current.x &&
            Math.floor((y - startY) / squareSize) === hoveredSquare.current.y
          ) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(squareX, squareY, squareSize, squareSize);
          }

          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 1;
          ctx.strokeRect(squareX, squareY, squareSize, squareSize);
        }
      }

      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
      );
      gradient.addColorStop(0, "rgba(255, 50, 0, 0.2)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.8)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const updateAnimation = () => {
      const effectiveSpeed = Math.max(speed, 0.1);

      gridOffset.current.x = gridOffset.current.y;
      gridOffset.current.y =
        (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;

      drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      const hoveredSquareX = Math.floor(
        (mouseX + gridOffset.current.x - startX) / squareSize
      );
      const hoveredSquareY = Math.floor(
        (mouseY + gridOffset.current.y - startY) / squareSize
      );

      if (
        !hoveredSquare.current ||
        hoveredSquare.current.x !== hoveredSquareX ||
        hoveredSquare.current.y !== hoveredSquareY
      ) {
        hoveredSquare.current = { x: hoveredSquareX, y: hoveredSquareY };
      }
    };

    const handleMouseLeave = () => {
      hoveredSquare.current = null;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    requestRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(requestRef.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleSignIn = () => {
    navigate("/signin");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen overflow-hidden relative bg-black flex flex-col items-center justify-center p-4">
      {/* Squares canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-0"
      ></canvas>

      {/* Content card with animation */}
      <div
        className={`w-full max-w-md mx-auto z-10 transition-all duration-700 transform ${
          loaded ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
        }`}
      >
        <div className="flex flex-col items-center text-center bg-[#1A1110] bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-12 border border-orange-500 border-opacity-50">
          {/* Logo with pulse effect */}
          <div className="w-20 h-20 rounded-full bg-orange-900 shadow-md flex items-center justify-center mb-8 relative">
            <div className="absolute w-full h-full rounded-full bg-orange-500 opacity-30 animate-ping"></div>
            <span className="text-3xl z-10">🍔</span>
          </div>

          {/* Title with gradient */}
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 md:mb-6 text-white">
            Welcome to{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500">
              MunchMate
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-300 mb-10 md:mb-12">
            Your campus canteen, simplified! Order fresh meals between classes and skip the long queues.
          </p>

          {/* Buttons with hover effects */}
          <div className="flex flex-col w-full space-y-4">
            <button
              onClick={handleSignIn}
              className="px-8 py-3 bg-[#1A1110] text-orange-500 font-semibold rounded-full shadow-lg border-2 border-orange-500 hover:bg-orange-900 hover:text-white transition-all duration-300 w-full transform hover:scale-105 hover:shadow-xl"
            >
              Student Login
            </button>
            <button
              onClick={handleSignUp}
              className="px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full transform hover:scale-105"
            >
              Sign Up
            </button>
          </div>


          {/* Campus food icons */}
          <div className="flex justify-center mt-8 space-x-4">
            <span className="text-2xl transform hover:scale-125 transition-transform cursor-pointer">
              🍔
            </span>
            <span className="text-2xl transform hover:scale-125 transition-transform cursor-pointer">
              🍟
            </span>
            <span className="text-2xl transform hover:scale-125 transition-transform cursor-pointer">
              🥪
            </span>
            <span className="text-2xl transform hover:scale-125 transition-transform cursor-pointer">
              ☕
            </span>
            <span className="text-2xl transform hover:scale-125 transition-transform cursor-pointer">
              🧁
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add required animation class
const styles = `
  @keyframes blob {
    0% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    100% {
      transform: translate(0px, 0px) scale(1);
    }
  }
  .animate-blob {
    animation: blob 7s infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }

  /* Squares canvas style */
  canvas {
    display: block;
  }
`;

// Add the style element to the page
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

export default Landing;