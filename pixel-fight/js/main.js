let winH = window.innerHeight;
let winW = window.innerWidth;
let minD = Math.min(winH, winW);
let scal = minD * 0.6;
let size = 5;
var dims;
var pixs;
let fps = 30;

var c = document.getElementById("canva");
var ctx = c.getContext("2d");
var graphContainer = document.getElementById("graph_container");

var numColors = 2;
let colorPalette = ["#F28482", "#183A37", "#84A59D", "#F6BD60", "#8F3985", "#931621"];
var grid;
var colorData = [];
var stepCounter = 0;
var steps = [];
var chart;
var chartOptions;
var run = true;

var colorSlider = document.getElementById("color_slider");
var colorSliderTitle = document.getElementById("color_slider_title");
var speedSlider = document.getElementById("speed_slider");
var speedSliderTitle = document.getElementById("speed_slider_title");
var sizeSlider = document.getElementById("size_slider");
var sizeSliderTitle = document.getElementById("size_slider_title");

intro();

function intro() {

  document.getElementById("home_button").addEventListener("click", (e) => { window.open("https://cornbread.games/home", "_blank").focus(); });
  document.getElementById("info_button").addEventListener("click", showInfo);
  document.getElementById("overlay").addEventListener("click", closeModal);
  document.getElementById("info_close").addEventListener("click", closeModal);

  initializeGrid();
  initializeGraph();
  colorGrid();
  window.addEventListener("blur", function() { run = false; });
  window.addEventListener("focus", function() { run = true; colorGrid(); });
}

function initializeGrid() {

  dims = Math.min(customFloor(scal, size), 1000);
  pixs = dims / size;
  grid = Array.from(Array((pixs)), () => new Array(pixs).fill(0));
  colorData = [];
  var tmp = [];
  for (var x = 0; x < numColors; x++) { tmp.push(0); }
  colorData.push(tmp);
  c.width = dims;
  c.height = dims;
  graphContainer.setAttribute("style", `width: ${dims}px, height: ${dims}px`);

  xCenter = Math.floor(pixs / 2);
  yCenter = Math.floor(pixs / 2);
  let angle = 360 / numColors;

  for (var i = 0; i < pixs; i++) {
    for (var j = 0; j < pixs; j++) {
      x = (i - xCenter) / xCenter;
      y = -1 * (j - yCenter) / yCenter;
      pixelAngle = (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360;
      grid[i][j] = Math.floor(pixelAngle/angle);
    }
  }
}

function updateGrid() {

  var flat = new Array(pixs * pixs).fill(0);

  for (var i = 0; i < flat.length; i++) {
    flat[i] = i;
  }

  shuffleArray(flat);

  let limit = pixs - 1;

  for (var j = 0; j < flat.length; j++) {
    let x = Math.floor(flat[j] % pixs);
    let y = Math.floor(flat[j] / pixs);

    let currentColor = grid[x][y];
    var neighbors = [currentColor];
    var colorCount = 1
    var totalAdjacent = 1;
    if (x != 0 && y != 0) {
      totalAdjacent += 1;
      neighbors.push(grid[x-1][y-1]);
      if (grid[x-1][y-1] == currentColor) { colorCount += 1; }
    } if (x != 0) {
      totalAdjacent += 1;
      neighbors.push(grid[x-1][y]);
      if (grid[x-1][y] == currentColor) { colorCount += 1; }
    } if (x != 0 && y != limit) {
      totalAdjacent += 1;
      neighbors.push(grid[x-1][y+1]);
      if (grid[x-1][y+1] == currentColor) { colorCount += 1; }
    } if (y != limit) {
      totalAdjacent += 1;
      neighbors.push(grid[x][y+1]);
      if (grid[x][y+1] == currentColor) { colorCount += 1; }
    } if (x != limit && y != limit) {
      totalAdjacent += 1;
      neighbors.push(grid[x+1][y+1]);
      if (grid[x+1][y+1] == currentColor) { colorCount += 1; }
    } if (x != limit) {
      totalAdjacent += 1;
      neighbors.push(grid[x+1][y]);
      if (grid[x+1][y] == currentColor) { colorCount += 1; }
    } if (x != limit && y != 0) {
      totalAdjacent += 1;
      neighbors.push(grid[x+1][y-1]);
      if (grid[x+1][y-1] == currentColor) { colorCount += 1; }
    } if (y != 0) {
      totalAdjacent += 1;
      neighbors.push(grid[x][y-1]);
      if (grid[x][y-1] == currentColor) { colorCount += 1; }
    }

    let ratio = (colorCount / totalAdjacent);
    let comparison = Math.random();
    if (ratio < comparison) {
      shuffleArray(neighbors);
      var turned = false;
      var count = 0;
      while (!turned) {
        if (neighbors[count] != currentColor) {
          grid[x][y] = neighbors[count];
          turned = true;
        }
        count += 1;
      }
    }
  }
}

function colorGrid() {

  var tmpData = [];
  for (var x = 0; x < numColors; x++) { tmpData.push(0); }

  for (var i = 0; i < pixs; i++) {
    for (var j = 0; j < pixs; j++) {
      let colorIndex = grid[i][j];
      tmpData[colorIndex] += 1;
      let color = colorPalette[colorIndex];
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.fillRect(i * size, j * size, size, size);
      ctx.closePath();
      ctx.stroke();
    }
  }

  colorData.push(tmpData);
  steps.push(stepCounter);
  stepCounter += 1;

  let lastRun = colorData[colorData.length - 1];
  var zeroes = 0;
  for (var x = 0; x < numColors; x++) {
    if (lastRun[x] == 0) {
      zeroes += 1;
    }
  }
  if (zeroes == (numColors - 1)) {
    run = false;
  }

  updateGrid();
  updateGraph();

  setTimeout(() => {
    if (run) { colorGrid(); }
  }, 1000 / fps);

}

function initializeGraph() {

  var gc = document.getElementById("graph_canva");

  chartOptions = {
    elements: {
      point: {
        radius: 0
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        min: 0,
        max: 1,
        stepSize: 0.1,
        position: "right",
        ticks: {
          format: { style: "percent" }
        }
      }
    },
    animation: {
      duration: 8000
    }
  };

  chart = new Chart(gc, {
    type: "line",
    data: {},
    options: chartOptions
  });
}

function updateGraph() {

  var truncate = false;
  var xVals;
  let limit = 1000;
  if (stepCounter > limit && run) {
    truncate = true;
    xVals = steps.slice(1).slice(-limit);
  } else {
    xVals = steps;
  }

  var newData = {
    labels: xVals,
    datasets: []
  };

  for (var i = 0; i < numColors; i++) {
    var yVals = [];
    let color = colorPalette[i];
    for (var j = 1; j < colorData.length; j++) {
      yVals.push(colorData[j][i] / (pixs * pixs));
    }

    if (truncate) {
      yVals = yVals.slice(1).slice(-limit);
    }

    let newDataset = {
      fill: false,
      tension: 0.8,
      backgroundColor: color,
      borderColor: color,
      data: yVals
    };

    newData.datasets.push(newDataset);
  }

  chart.config.data = newData;
  if (run) {
    chart.update("none");
  } else {
    chart.update();
  }
}

colorSlider.oninput = function() {
  numColors = this.value;
  colorSliderTitle.innerText = "Colors: " + this.value.toString();
  chart.destroy();
  colorData = [];
  stepCounter = 0;
  steps = [];
  initializeGrid();
  initializeGraph();
  if (!run) {
    run = true;
    colorGrid();
  }
}

speedSlider.oninput = function() {
  fps = this.value;
  speedSliderTitle.innerText = "Speed: " + this.value.toString();
}

sizeSlider.oninput = function() {
  size = this.value;
  sizeSliderTitle.innerText = "Size: " + this.value.toString();
  initializeGrid();
}

function customFloor(v, n) {
  return Math.floor(v / n) * n;
}

function shuffleArray(a) {
    for (var i = a.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
}

function showInfo() {
  document.getElementById("info_modal").classList.add("active");
  document.getElementById("overlay").classList.add("active");
}

function closeModal() {
  if (document.getElementById("info_modal").classList.contains("active")) {
    document.getElementById("info_modal").classList.remove("active");
    document.getElementById("overlay").classList.remove("active");
  }
}
