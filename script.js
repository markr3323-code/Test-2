const names = ["Clay", "Greg", "Mark", "Mike"];
const colors = ["#f97316", "#22c55e", "#3b82f6", "#a855f7"];

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const result = document.getElementById("result");

const center = canvas.width / 2;
const radius = center - 8;
const segmentAngle = (Math.PI * 2) / names.length;

let rotation = 0;
let spinning = false;

function drawWheel(angle) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(angle);

  for (let i = 0; i < names.length; i += 1) {
    const start = -Math.PI / 2 + i * segmentAngle;
    const end = start + segmentAngle;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();

    ctx.save();
    ctx.rotate(start + segmentAngle / 2);
    ctx.fillStyle = "#fff";
    ctx.font = "700 28px Inter, sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(names[i], radius - 20, 0);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.lineWidth = 10;
  ctx.strokeStyle = "#1f2a44";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, 26, 0, Math.PI * 2);
  ctx.fillStyle = "#1f2a44";
  ctx.fill();

  ctx.restore();
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function spinWheel() {
  if (spinning) return;

  spinning = true;
  result.textContent = "Spinning...";

  const winnerIndex = Math.floor(Math.random() * names.length);
  const centerOfSegment = winnerIndex * segmentAngle + segmentAngle / 2;
  const targetNorm = (Math.PI * 2 - centerOfSegment) % (Math.PI * 2);

  const currentNorm = ((rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  let delta = targetNorm - currentNorm;
  if (delta < 0) delta += Math.PI * 2;

  const extraSpins = (4 + Math.floor(Math.random() * 3)) * Math.PI * 2;
  const startRotation = rotation;
  const totalRotation = extraSpins + delta;
  const duration = 3600;
  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);

    rotation = startRotation + totalRotation * eased;
    drawWheel(rotation);

    if (progress < 1) {
      requestAnimationFrame(animate);
      return;
    }

    spinning = false;
    result.textContent = `Landed on: ${names[winnerIndex]}`;
  }

  requestAnimationFrame(animate);
}

canvas.addEventListener("click", spinWheel);
canvas.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    spinWheel();
  }
});
canvas.tabIndex = 0;

// initial draw
rotation = -Math.PI / 8;
drawWheel(rotation);
