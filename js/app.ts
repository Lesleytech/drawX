interface defaultsInterface {
  lineWidth: number;
  color: string;
}

const colorElements = document.querySelectorAll('#color-selector button');
const brushSizeSelector = <HTMLInputElement>(
  document.getElementById('brush-size-selector')
);
const brushSize = document.getElementById('brush-size');
const selectedColor = document.getElementById('selected-color');
const canvas = <HTMLCanvasElement>document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const defaults: defaultsInterface = {
  color: '#000',
  lineWidth: 5,
};

colorElements.forEach((e: HTMLButtonElement) => {
  e.style.background = e.value;
});

const canvasHeight = window.innerHeight;
const canvasWidth = window.innerWidth - 300;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

// variables
let painting = false;
let tool = 'brush';
let strokeStyle = defaults.color;

//functions
function startPosition(e) {
  painting = true;
  draw(e);
}

function finishedPosition() {
  painting = false;
  ctx.beginPath();
}

function draw(e: MouseEvent) {
  if (!painting) return;

  if (tool === 'eraser') {
    ctx.strokeStyle = '#fff';
  } else {
    ctx.strokeStyle = strokeStyle;
  }

  ctx.lineCap = 'round';
  ctx.lineTo(e.clientX, e.clientY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);
}

function download() {
  const a = document.createElement('a');
  canvas.toBlob(
    (blob) => {
      const url = window.URL.createObjectURL(blob);

      a.href = url;
      a.download = `drawX-${Date.now()}`;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    },
    'image/jpeg',
    1
  );
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  fillBackground();
}

function changeColor(e: HTMLButtonElement) {
  ctx.strokeStyle = e.value;
  selectedColor.style.backgroundColor = e.value;
  strokeStyle = e.value;
}

function changeBrushSize({ value }) {
  brushSize.innerText = value;

  ctx.lineWidth = value;
}

function fillBackground() {
  ctx.rect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.beginPath();
}

function loadDefaults({ color, lineWidth }: defaultsInterface) {
  ctx.beginPath();
  fillBackground();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;

  brushSizeSelector.value = lineWidth.toString();
  brushSize.innerText = lineWidth.toString();
  selectedColor.style.backgroundColor = color;
}

function changeTool(newTool) {
  tool = newTool;

  if (newTool === 'brush') {
    canvas.style.cursor = "url('../assets/paint-brush.png'), auto";
  } else if (newTool === 'eraser') {
    canvas.style.cursor = "url('../assets/eraser.png'), auto";
  }
}

// Load app defaults
loadDefaults(defaults);

//Event listeners
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', finishedPosition);
canvas.addEventListener('mousemove', draw);
