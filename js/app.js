var colorElements = document.querySelectorAll('#color-selector button');
var brushSizeSelector = (document.getElementById('brush-size-selector'));
var brushSize = document.getElementById('brush-size');
var selectedColor = document.getElementById('selected-color');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var defaults = {
    color: '#000',
    lineWidth: 5
};
colorElements.forEach(function (e) {
    e.style.background = e.value;
});
var canvasHeight = window.innerHeight;
var canvasWidth = window.innerWidth - 300;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
// variables
var painting = false;
var tool = 'brush';
var strokeStyle = defaults.color;
//functions
function startPosition(e) {
    painting = true;
    draw(e);
}
function finishedPosition() {
    painting = false;
    ctx.beginPath();
}
function draw(e) {
    if (!painting)
        return;
    if (tool === 'eraser') {
        ctx.strokeStyle = '#fff';
    }
    else {
        ctx.strokeStyle = strokeStyle;
    }
    ctx.lineCap = 'round';
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
}
function download() {
    var a = document.createElement('a');
    canvas.toBlob(function (blob) {
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = "drawX-" + Date.now();
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }, 'image/jpeg', 1);
}
function clearCanvas() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    fillBackground();
}
function changeColor(e) {
    ctx.strokeStyle = e.value;
    selectedColor.style.backgroundColor = e.value;
    strokeStyle = e.value;
}
function changeBrushSize(_a) {
    var value = _a.value;
    brushSize.innerText = value;
    ctx.lineWidth = value;
}
function fillBackground() {
    ctx.rect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.beginPath();
}
function loadDefaults(_a) {
    var color = _a.color, lineWidth = _a.lineWidth;
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
    }
    else if (newTool === 'eraser') {
        canvas.style.cursor = "url('../assets/eraser.png'), auto";
    }
}
// Load app defaults
loadDefaults(defaults);
//Event listeners
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', finishedPosition);
canvas.addEventListener('mousemove', draw);
