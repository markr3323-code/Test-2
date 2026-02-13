const names = ["Clay", "Greg", "Mark", "Mike"];
const segmentDeg = 360 / names.length;

const wheel = document.getElementById("wheel");
const spinButton = document.getElementById("spinButton");
const result = document.getElementById("result");

let spinning = false;
let currentRotation = 0;

function normalize(degrees) {
  return ((degrees % 360) + 360) % 360;
}

function spinWheel() {
  if (spinning) return;
  spinning = true;
  spinButton.disabled = true;
  result.textContent = "Spinning...";

  // Equal 25% chance for each name.
  const winnerIndex = Math.floor(Math.random() * names.length);

  // Pointer is at 0deg (top). We target center of winner segment under pointer.
  const winnerCenter = winnerIndex * segmentDeg + segmentDeg / 2;
  const targetAtTop = normalize(360 - winnerCenter);
  const currentAtTop = normalize(currentRotation);

  let delta = targetAtTop - currentAtTop;
  if (delta < 0) delta += 360;

  const extraSpins = (4 + Math.floor(Math.random() * 3)) * 360;
  currentRotation += extraSpins + delta;

  wheel.style.transition = "transform 3.6s cubic-bezier(0.12, 0.8, 0.15, 1)";
  wheel.style.transform = `rotate(${currentRotation}deg)`;

  const onDone = () => {
    wheel.removeEventListener("transitionend", onDone);
    spinning = false;
    spinButton.disabled = false;
    result.textContent = `Landed on: ${names[winnerIndex]}`;
  };

  wheel.addEventListener("transitionend", onDone);
}

spinButton.addEventListener("click", spinWheel);
