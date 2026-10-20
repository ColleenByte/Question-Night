import { useState, useEffect } from "react";
import honkSound from "../assets/honk.mp3";

// Size of background.jpg and where the rabbit's nose is on it
const IMAGE_WIDTH = 1280;
const IMAGE_HEIGHT = 720;
const NOSE_X = 1110;
const NOSE_Y = 254;
const NOSE_SIZE = 18;

// Must match background-position in App.css (85% center)
const POSITION_X = 0.85;
const POSITION_Y = 0.5;

// Plays the honk sound file
function playHonk() {
  new Audio(honkSound).play();
}

// Works out where the nose is on screen, since the background is scaled to cover it
function getNosePosition() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const scale = Math.max(screenWidth / IMAGE_WIDTH, screenHeight / IMAGE_HEIGHT);
  const offsetX = (screenWidth - IMAGE_WIDTH * scale) * POSITION_X;
  const offsetY = (screenHeight - IMAGE_HEIGHT * scale) * POSITION_Y;

  return {
    left: offsetX + NOSE_X * scale,
    top: offsetY + NOSE_Y * scale,
    size: NOSE_SIZE * scale,
  };
}

function Nose() {
  const [position, setPosition] = useState(getNosePosition);

  // Move the button when the window changes size
  useEffect(() => {
    function handleResize() {
      setPosition(getNosePosition());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <button
      className="nose"
      onClick={playHonk}
      aria-label="Honk"
      style={{
        left: position.left - position.size / 2,
        top: position.top - position.size / 2,
        width: position.size,
        height: position.size,
      }}
    />
  );
}

export default Nose;
