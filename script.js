
const drawing = document.getElementById("drawingCanvas");
const reef = document.getElementById("reefCanvas");

const ctx = drawing.getContext("2d");
const reefCtx = reef.getContext("2d");

const color = document.getElementById("color");
const size = document.getElementById("size");

let isDrawing = false;
let history = [];

function setup(canvas, context) {
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;

  canvas.width = rect.width * ratio;
  canvas.height = 330 * ratio;

  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

setup(drawing, ctx);
setup(reef, reefCtx);

function saveHistory() {
  history.push(drawing.toDataURL());
}

function position(event) {
  const rect = drawing.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

drawing.addEventListener("pointerdown", event => {
  isDrawing = true;
  drawing.setPointerCapture(event.pointerId);

  const p = position(event);

  ctx.beginPath();
  ctx.moveTo(p.x, p.y);

  saveHistory();
});

drawing.addEventListener("pointermove", event => {
  if (!isDrawing) return;

  const p = position(event);

  ctx.strokeStyle = color.value;
  ctx.lineWidth = size.value;
  ctx.lineCap = "round";

  ctx.lineTo(p.x, p.y);
  ctx.stroke();
});

function stopDrawing() {
  isDrawing = false;
  ctx.beginPath();
}

drawing.addEventListener("pointerup", stopDrawing);
drawing.addEventListener("pointercancel", stopDrawing);

document.getElementById("undo").onclick = () => {
  const previous = history.pop();

  if (!previous) return;

  const img = new Image();

  img.onload = () => {
    ctx.clearRect(0, 0, drawing.width, drawing.height);
    ctx.drawImage(img, 0, 0, drawing.width, drawing.height);
  };

  img.src = previous;
};

document.getElementById("clear").onclick = () => {
  ctx.clearRect(0, 0, drawing.width, drawing.height);
  history = [];
};

document.getElementById("add").onclick = () => {
  const img = new Image();

  img.onload = () => {
    const x = Math.random() * 90;
    const y = Math.random() * 90;

    reefCtx.drawImage(img, x, y, 180, 180);
  };

  img.src = drawing.toDataURL();
};
