document.addEventListener("DOMContentLoaded", () => {

  class Timer {
    constructor() {
      this.isRunning = false;
      this.startTime = 0;
      this.overallTime = 0;
    }

    _getTimeElapsedSinceLastStart() {
      if (!this.startTime) {
        return 0;
      }
      return Date.now() - this.startTime;
    }

    start() {
      if (this.isRunning) {
        return console.error('Timer is already running');
      }
      console.log("timer started");
      this.isRunning = true;
      this.startTime = Date.now();
    }

    stop() {
      if (!this.isRunning) {
        return console.error('Timer is already stopped');
      }
      console.log("timer stopped");
      this.isRunning = false;
      this.overallTime = this.overallTime + this._getTimeElapsedSinceLastStart();
    }

    reset() {
      this.overallTime = 0;
      if (this.isRunning) {
        this.startTime = Date.now();
        return;
      }
      this.startTime = 0;
    }

    getTime() {
      if (!this.startTime) {
        return 0;
      }
      if (this.isRunning) {
        return this.overallTime + this._getTimeElapsedSinceLastStart();
      }
      return this.overallTime;
    }
  }

  gameBoard = document.getElementById("board");
  keyBoard = document.getElementById("keyboard-container");
  header = document.getElementById("header");
  modal = document.getElementById("modal_container");
  style = getComputedStyle(document.documentElement);

  grid = Array.from(Array(5), () => new Array(5).fill(0)); // 2d array for tracking color

  drag = false; // is mouse / touch being dragged?
  clicked = Array.from(Array(5), () => new Array(5).fill(0)); // 2d array for mouse drag
  currentColor = 1; // index for color selection array

  cors = [];
  compassNESW = [];
  blanks = [];

  highlighted = false;
  colorMode = "light";

  timer = new Timer();

  gameWon = false;

  gameSetup();

  function gameSetup() {
    firstDay = new Date("01/11/2023");
    today = new Date();
    diff = today - firstDay;
    index = Math.floor(diff / (1000 * 3600 * 24));
    console.log("puzzle number: " + (index + 1));

    gridFill = false;
    firstTime = false;

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      colorMode = "dark";
    } else {
      colorMode = "light";
    }

    // load previous puzzle number. if first time visiting, set it to today
    storedPuzzleIndex = Number(window.localStorage.getItem("puzzleIndex"));
    if (!storedPuzzleIndex) {
      firstTime = true;
      window.localStorage.setItem("puzzleIndex", index.toString());
    }

    palette = window.localStorage.getItem("userPalette");
    if (!palette) {
      window.localStorage.setItem("userPalette", "default");
    }

    cm = window.localStorage.getItem("userColorMode");
    if (!cm) {
      window.localStorage.setItem("userColorMode", colorMode);
    } else {
      colorMode = cm;
    }

    gpn = 0;
    gps = window.localStorage.getItem("gamesPlayed");
    if (!gps) {
      window.localStorage.setItem("gamesPlayed", "0");
    } else {
      gpn = Number(gps);
    }

    wp = window.localStorage.getItem("gamesWon");
    if (!wp) {
      window.localStorage.setItem("gamesWon", "0");
    }

    at = window.localStorage.getItem("averageTime");
    if (!at or at === "00:00") {
      window.localStorage.setItem("averageTime", "0");
    }

    // if today is a new day
    if (storedPuzzleIndex != index) {
      todayWon = 0;
      window.localStorage.setItem("todayWon", "0");
      window.localStorage.setItem("puzzleIndex", index.toString());
      window.localStorage.setItem("gridProgress", JSON.stringify(grid));
      window.localStorage.setItem("timeSpent", "0");
      window.localStorage.setItem("gamesPlayed", (gpn+1).toString());
    } // else today has already been opened
    else {
      todayWon = Number(window.localStorage.getItem("todayWon"));
      timeSpent = Number(window.localStorage.getItem("timeSpent"));
      gridFill = true;
      if (!todayWon) {
        window.localStorage.setItem("todayWon", "0");
      }
      if (!timeSpent) {
        window.localStorage.setItem("timeSpent", "0");
      }
    }

    puzzles = ["x", "112223320300623803310110", "111331331741110040031155010312132021223233"];
    todaysPuzzle = puzzles[index];

    createSquares();
    colorPickerListeners();
    dragListeners();
    windowListeners();
    choosePalette(palette);
    puzzleSpecs(todaysPuzzle);
    setCompasses(true);
    gameButtons(true);
    menuButtons(true);
    setTimer(true);
    if (gridFill) {
      fillGrid();
    }
    window.localStorage.setItem("gridProgress", JSON.stringify(grid));

    if (colorMode == "dark") {
      document.getElementById("dark_mode_checker").checked = true;
      switchColorMode();
    }

    if (todayWon == 1) {
      ts = Number(window.localStorage.getItem("timeSpent"));
      timeText(ts);
      gameWon = true;
      gameWonCleanup();
    } else {
      timer.start();
      ts = Number(window.localStorage.getItem("timeSpent"));
      setInterval(() => {
        tmp = timer.getTime();
        t = tmp + (ts * 1000);
        window.localStorage.setItem("timeSpent", (t / 1000).toString());
        timeText((t / 1000));
      }, 100);
    }

    if (firstTime) {
      settingsMenu();
    }

  }

  function puzzleSpecs(puzzleString) {
    tmpArr = [];
    for (let i = 0; i < puzzleString.length; i++) {
      tmpArr.push(puzzleString[i]);
      if (i < 8 && i % 2 == 1) {
        cors.push(tmpArr);
        tmpArr = [];
      }
      if (i >= 8 && i < 24 && i % 4 == 3) {
        compassNESW.push(tmpArr);
        tmpArr = [];
      }
      if (i >= 24 && i % 2 == 1) {
        blanks.push(tmpArr);
        tmpArr = [];
      }
    }
  }

  function setCompasses(initial) {

    for (let i = 0; i < 4; i++) {

      if (!initial) {

        if (document.getElementById("compass0" + (i+1).toString())) {
          document.getElementById("compass0" + (i+1).toString()).remove();
        }
        if (document.getElementById("compass1" + (i+1).toString())) {
          document.getElementById("compass1" + (i+1).toString()).remove();
        }
        if (document.getElementById("compass0" + (i+1).toString() + "N")) {
          document.getElementById("compass0" + (i+1).toString() + "N").remove();
        }
        if (document.getElementById("compass0" + (i+1).toString() + "E")) {
          document.getElementById("compass0" + (i+1).toString() + "E").remove();
        }
        if (document.getElementById("compass0" + (i+1).toString() + "S")) {
          document.getElementById("compass0" + (i+1).toString() + "S").remove();
        }
        if (document.getElementById("compass0" + (i+1).toString() + "W")) {
          document.getElementById("compass0" + (i+1).toString() + "W").remove();
        }
      }

      xin = cors[i][0];
      yin = cors[i][1];
      sqNum = +xin + (5 * +yin) + 1;

      sq = document.getElementById(sqNum.toString());

      sq.style.backgroundColor = style.getPropertyValue('--color' + (i + 1).toString());
      sq.style.border = "2px solid " + style.getPropertyValue('--color' + (i + 1).toString());
      grid[xin][yin] = i + 1;

      sqRect = sq.getBoundingClientRect();
      xCenter = (sqRect.left + sqRect.right) / 2;
      yCenter = (sqRect.top + sqRect.bottom) / 2;
      xOffset = sqRect.width / 3.5;
      yOffset = sqRect.height / 3.5;

      drawLine(sqRect.left + xOffset, sqRect.top + yOffset, sqRect.right - xOffset, sqRect.bottom - yOffset, "compass0" + (i+1).toString());
      drawLine(sqRect.left + xOffset, sqRect.bottom - yOffset, sqRect.right - xOffset, sqRect.top + yOffset, "compass1" + (i+1).toString());

      for (let j = 0; j < 4; j++) {
        coordinate = compassNESW[i][j];
        blank = false;
        for (let x = 0; x < blanks.length; x++) {
          if (blanks[x][0] == i && blanks[x][1] == j) {
            blank = true;
          }
        }
        if (!blank) {
          if (j == 0) {
            drawCoordinate(xCenter, yCenter - yOffset, coordinate.toString(), "compass0" + (i+1).toString() + "N");
          } else if (j == 1) {
            drawCoordinate(xCenter + xOffset, yCenter, coordinate.toString(), "compass0" + (i+1).toString() + "E");
          } else if (j == 2) {
            drawCoordinate(xCenter, yCenter + yOffset, coordinate.toString(), "compass0" + (i+1).toString() + "S");
          } else if (j == 3) {
            drawCoordinate(xCenter - xOffset, yCenter, coordinate.toString(), "compass0" + (i+1).toString() + "W");
          }
        }
      }
    }
  }

  function drawLine(X1, Y1, X2, Y2, id, parent) {

    x1 = X1, y1 = Y1, x2 = X2, y2 = Y2;
    if (X1 > X2) { x1 = X2; y1 = Y2; x2 = X1; y2 = Y1; }
    dx = x1 - x2;
    dy = y1 - y2;
    d = Math.sqrt(dx * dx + dy * dy);
    a = Math.atan(dy / dx);

    line = document.createElement("span");
    line.classList.add("compass_line");
    line.id = id;
    line.style.top = `${y1}px`;
    line.style.left = `${x1}px`;
    line.style.width = `${d}px`;
    line.style.transform = `translate(-${d/2}px,0) rotate(${a}rad) translate(${d/2}px,0)`;
    line.style.pointerEvents = "none";
    if (parent === undefined) {
      gameBoard.appendChild(line);
    } else {
      line.style.borderTop = "1px solid black";
      parent.appendChild(line);
    }

  }

  function drawCoordinate(x, y, txt, id, parent) {

    num = document.createElement("p");
    num.classList.add("coordinate_num");
    num.id = id;
    num.innerText = txt;
    num.style.left = `${x}px`;
    num.style.top = `${y}px`;
    num.style.pointerEvents = "none";
    if (parent === undefined) {
      gameBoard.appendChild(num);
    } else {
      num.style.fontSize = "0.75rem";
      parent.appendChild(num);
    }

  }

  function createSquares() {

    for (let i = 0; i < 25; i++) {
      let square = document.createElement("button");
      square.classList.add("button", "square");
      square.id = (i + 1).toString();
      square.style.backgroundColor = "white";
      ['pointerdown', 'pointermove', 'pointerup'].forEach( event =>
        square.addEventListener(event, setColor));
      gameBoard.appendChild(square);
    }
  }

  function gameButtons(initial) {

    if (!initial) {
      document.getElementById("reset_button").remove();
      document.getElementById("highlight_button").remove();
    }

    cpRect = document.getElementById("cp05").getBoundingClientRect();
    center = (cpRect.left + cpRect.right) / 2;

    resetImg = document.createElement("img");
    resetImg.src = "icons/reset_light.png";
    if (colorMode == "dark") { resetImg.src = "icons/reset_dark.png"; }
    resetImg.id = "reset_button";
    if (!gameWon) { resetImg.addEventListener("click", resetGrid); }
    resetImg.classList.add("game_button");
    resetImg.style.top = `${cpRect.top}px`;
    resetImg.style.left = `${center}px`;
    resetImg.style.transform = "translate(-50%, 0)";
    resetImg.classList.add("disable_select");

    highlightImg = document.createElement("img");
    highlightImg.src = "icons/highlight_light.png";
    if (colorMode == "dark") { highlightImg.src = "icons/highlight_dark.png"; }
    highlightImg.id = "highlight_button";
    if (!gameWon) { highlightImg.addEventListener("click", highlight); }
    highlightImg.classList.add("game_button");
    highlightImg.style.top = `${cpRect.top}px`;
    highlightImg.style.left = `${center}px`;
    highlightImg.style.transform = "translate(-50%, 150%)";
    highlightImg.classList.add("disable_select");

    keyBoard.appendChild(resetImg);
    keyBoard.appendChild(highlightImg);
  }

  function menuButtons(initial) {
    if (!initial) {
      for (let i = 0; i < 4; i++) {
        document.getElementById("palette_button0" + (i+1).toString()).remove();
      }
      document.getElementById("settings_button").remove();
      document.getElementById("scores_button").remove();
    }

    menuContainer = document.getElementById("menu_buttons");
    menuRect = menuContainer.getBoundingClientRect();

    l = menuContainer.offsetLeft;
    r = (((2 * l) + (menuContainer.offsetWidth / 2)) / 2) + (menuContainer.offsetWidth / 2);
    t = menuContainer.offsetTop;
    b = menuContainer.offsetTop + menuContainer.offsetHeight;

    xCenter = (l + l + menuContainer.offsetWidth) / 2;
    yCenter = (t + b) / 2;

    for (let i = 0; i < 4; i++) {
      sq = document.createElement("button");
      sq.id = "palette_button0" + (i+1).toString();
      sq.addEventListener("click", paletteSelection);
      sq.classList.add("palette_square");
      sq.style.position = "absolute";
      if (i == 0) {
        sq.style.top = `${t}px`;
        sq.style.left = `${xCenter}px`;
      } else if (i == 1) {
        sq.style.top = `${t}px`;
        sq.style.left = `${r}px`;
      } else if (i == 2) {
        sq.style.top = `${yCenter}px`;
        sq.style.left = `${xCenter}px`;
      } else if (i == 3) {
        sq.style.top = `${yCenter}px`;
        sq.style.left = `${r}px`;
      }
      header.appendChild(sq);
    }

    settingsImg = document.createElement("img");
    settingsImg.src = "icons/settings_light.png";
    if (colorMode == "dark") { settingsImg.src = "icons/settings_dark.png"; }
    settingsImg.id = "settings_button";
    settingsImg.addEventListener("click", settingsMenu);
    settingsImg.style.left = `${l}px`;
    settingsImg.style.top = `${t}px`;
    settingsImg.style.position = "absolute";
    settingsImg.style.height = "30px";
    settingsImg.style.cursor = "pointer";
    settingsImg.style.transform = "translate(-25%, 0)";
    settingsImg.classList.add("disable_select");
    header.appendChild(settingsImg);

    scoresImg = document.createElement("img");
    scoresImg.src = "icons/scores_light.png";
    if (colorMode == "dark") { scoresImg.src = "icons/scores_dark.png"; }
    scoresImg.id = "scores_button";
    scoresImg.addEventListener("click", scoresMenu);
    scoresImg.style.left = `${l}px`;
    scoresImg.style.top = `${t}px`;
    scoresImg.style.position = "absolute";
    scoresImg.style.height = "30px";
    scoresImg.style.cursor = "pointer";
    scoresImg.style.transform = "translate(-150%, 0)";
    scoresImg.classList.add("disable_select");
    header.appendChild(scoresImg);
  }

  function setTimer(initial) {

    if (!initial) {
      document.getElementById("time").remove();
    }

    rect = keyBoard.getBoundingClientRect();
    time = document.createElement("span");
    time.id = "time";
    time.classList.add("timer");
    time.style.position = "absolute";
    time.style.top = `${rect.top}px`;
    if (colorMode == "light") {
      time.style.color = "black";
    } else {
      time.style.color = "white";
    }
    keyBoard.appendChild(time);
    timeText(Number(window.localStorage.getItem("timeSpent")));
  }

  function timeText(seconds) {
    if (seconds < 3600) {
      document.getElementById('time').innerText = new Date(seconds * 1000).toISOString().substring(14, 19);
    } else {
      document.getElementById('time').innerText = new Date(seconds * 1000).toISOString().substring(11, 19);
    }
  }

  function paletteSelection() {
    document.getElementById("palette_modal").classList.add("active");
    document.getElementById("overlay").classList.add("active");

    blurScreen();
  }

  function settingsMenu() {
    document.getElementById("settings_modal").classList.add("active");
    document.getElementById("overlay").classList.add("active");

    sqList = ["rb01", "rb05", "rb09", "rb11", "rb15", "rb19", "rb21", "rb25", "rb29"];
    sqCoorList = [[0,1,0,0], [1,2,0,1], [0,0,0,"x"], [0,1,0,0], [1,2,0,1], [0,0,0,"x"], [0,1,0,0], [1,2,0,1], [0,0,0,"x"]];
    squares = ["rb02", "rb03", "rb04", "rb06", "rb07", "rb08", "rb12", "rb17", "rb18"];

    for (let x = 0; x < squares.length; x++) {
      sq = document.getElementById(squares[x]);
      if (colorMode == "light") {
        sq.style.backgroundColor = "white";
        sq.style.border = "2px solid black";
      } else {
        sq.style.backgroundColor = style.getPropertyValue('--dark-mode-black');
        sq.style.border = "2px solid gray"
      }
    }

    for (let y = 0; y < sqList.length; y++) {

      if (document.getElementById("rc0" + (y+1).toString())) {
        document.getElementById("rc0" + (y+1).toString()).remove();
      }
      if (document.getElementById("rc1" + (y+1).toString())) {
        document.getElementById("rc1" + (y+1).toString()).remove();
      }
      if (document.getElementById("rn0" + (y+1).toString() + "N")) {
        document.getElementById("rn0" + (y+1).toString() + "N").remove();
      }
      if (document.getElementById("rn0" + (y+1).toString() + "E")) {
        document.getElementById("rn0" + (y+1).toString() + "E").remove();
      }
      if (document.getElementById("rn0" + (y+1).toString() + "S")) {
        document.getElementById("rn0" + (y+1).toString() + "S").remove();
      }
      if (document.getElementById("rn0" + (y+1).toString() + "W")) {
        document.getElementById("rn0" + (y+1).toString() + "W").remove();
      }
    }

    for (let i = 0; i < sqList.length; i++) {

      sq = document.getElementById(sqList[i]);
      sqRect = sq.getBoundingClientRect();
      l = sq.offsetLeft;
      r = sq.offsetLeft + sq.offsetWidth;
      t = sq.offsetTop;
      b = sq.offsetTop + sq.offsetHeight;
      xCenter = sq.offsetLeft + (sq.offsetWidth / 2);
      yCenter = sq.offsetTop + (sq.offsetHeight / 2);
      xOffset = sq.offsetWidth / 3.5;
      yOffset = sq.offsetHeight / 3.5;

      drawLine(l + xOffset, t + yOffset, r - xOffset, b - yOffset, "rc0" + (i+1).toString(), sq);
      drawLine(l + xOffset, b - yOffset, r - xOffset, t + yOffset, "rc1" + (i+1).toString(), sq);

      for (let j = 0; j < 4; j++) {

        coordinate = sqCoorList[i][j];
        if (coordinate !== "x") {
          if (j == 0) {
            drawCoordinate(xCenter, yCenter - yOffset, coordinate.toString(), "rn0" + (i+1).toString() + "N", sq);
          } else if (j == 1) {
            drawCoordinate(xCenter + xOffset, yCenter, coordinate.toString(), "rn0" + (i+1).toString() + "E", sq);
          } else if (j == 2) {
            drawCoordinate(xCenter, yCenter + yOffset, coordinate.toString(), "rn0" + (i+1).toString() + "S", sq);
          } else if (j == 3) {
            drawCoordinate(xCenter - xOffset, yCenter, coordinate.toString(), "rn0" + (i+1).toString() + "W", sq);
          }
        }
      }
    }

    blurScreen();
  }

  function scoresMenu() {
    document.getElementById("scores_modal").classList.add("active");
    document.getElementById("overlay").classList.add("active");

    gwn = Number(window.localStorage.getItem("gamesWon"));
    gpn = Number(window.localStorage.getItem("gamesPlayed"));
    atn = Number(window.localStorage.getItem("averageTime"));

    gp = document.getElementById("games_played_num");
    gp.innerText = window.localStorage.getItem("gamesPlayed");

    wp = document.getElementById("win_percentage_num");
    wp.innerText = Math.floor((gwn / gpn) * 100).toString();

    at = document.getElementById("average_time_num");
    if (atn < 3600) {
      at.innerText = new Date(atn * 1000).toISOString().substring(14, 19);
    } else {
      at.innerText = new Date(atn * 1000).toISOString().substring(11, 19);
    }

    blurScreen();
  }

  function closeModal() {
    document.getElementById("palette_modal").classList.remove("active");
    document.getElementById("settings_modal").classList.remove("active");
    document.getElementById("scores_modal").classList.remove("active");
    document.getElementById("overlay").classList.remove("active");

    focusScreen();
  }

  function colorPickerListeners() {
    document.getElementById("cp01").addEventListener("click", function() { chooseColor(1) }, false);
    document.getElementById("cp02").addEventListener("click", function() { chooseColor(2) }, false);
    document.getElementById("cp03").addEventListener("click", function() { chooseColor(3) }, false);
    document.getElementById("cp04").addEventListener("click", function() { chooseColor(4) }, false);
  }

  function dragListeners() {
    document.addEventListener("pointerdown", beginColor);
    document.addEventListener("pointerup", endColor);
    document.addEventListener("pointerup", didWin);
  }

  function windowListeners() {
    window.addEventListener("resize", function() { setCompasses(false) }, false);
    window.addEventListener("resize", function() { gameButtons(false) }, false);
    window.addEventListener("resize", function() { menuButtons(false) }, false);
    window.addEventListener("resize", function() { setTimer(false) }, false);
    window.addEventListener("blur", blurScreen);
    window.addEventListener("focus", focusScreen);

    document.getElementById("palette_close").addEventListener("click", closeModal);
    document.getElementById("settings_close").addEventListener("click", closeModal);
    document.getElementById("scores_close").addEventListener("click", closeModal);
    document.getElementById("overlay").addEventListener("click", closeModal);

    document.getElementById("default").addEventListener("click", function() { choosePalette("default"); }, false);
    document.getElementById("colorblind").addEventListener("click", function() { choosePalette("colorblind"); }, false);
    document.getElementById("neon").addEventListener("click", function() { choosePalette("neon"); }, false);
    document.getElementById("tape").addEventListener("click", function() { choosePalette("tape"); }, false);
    document.getElementById("vintage").addEventListener("click", function() { choosePalette("vintage"); }, false);
    document.getElementById("sunset").addEventListener("click", function() { choosePalette("sunset"); }, false);
    document.getElementById("grayscale").addEventListener("click", function() { choosePalette("grayscale"); }, false);

    document.getElementById("dark_mode_switch").addEventListener("click", switchColorMode);
  }

  function choosePalette(theme) {
    themer = document.getElementById("themer");
    themer.className = "";
    themer.classList.add(theme);

    palettes = document.getElementsByClassName("palette");
    for (let i = 0; i < palettes.length; i++) {
      p = palettes[i];
      if (palettes[i].id == theme) {
        palettes[i].style.backgroundColor = "gainsboro";
      } else {
        if (colorMode == "light") {
          palettes[i].style.backgroundColor = "white";
          palettes[i].style.borderTop = "1px solid black";
        } else {
          palettes[i].style.backgroundColor = style.getPropertyValue('--dark-mode-black');
          palettes[i].style.borderTop = "1px solid gray";
        }
      }
    }

    window.localStorage.setItem("userPalette", theme);
  }

  function switchColorMode() {

    if (document.getElementById("dark_mode_checker").checked) {
      colorMode = "dark";
    } else {
      colorMode = "light";
    }
    window.localStorage.setItem("userColorMode", colorMode);

    if (colorMode == "light") {
      // main game
      document.getElementById("container").style.backgroundColor = "white";
      document.getElementById("header").style.borderBottom = "1px solid black";
      document.getElementById("title").style.color = "black";
      document.getElementById("cp05").style.backgroundColor = "white";
      document.getElementById("cp05").style.border = "2px solid white";
      document.getElementById("reset_button").src = "icons/reset_light.png";
      document.getElementById("highlight_button").src = "icons/highlight_light.png";
      document.getElementById("settings_button").src = "icons/settings_light.png";
      document.getElementById("scores_button").src = "icons/scores_light.png";
      document.getElementById("time").style.color = "black";

      // palette modal
      document.getElementById("palette_modal").style.backgroundColor = "white";
      document.getElementById("palette_modal").style.border = "2px solid black";
      document.getElementById("palette_close").style.color = "black";
      document.getElementById("dark_mode_container").style.backgroundColor = "white";
      document.getElementById("dark_mode_name").style.color = "black";

      // settings modal
      document.getElementById("settings_modal").style.backgroundColor = "white";
      document.getElementById("settings_modal").style.border = "2px solid black";
      document.getElementById("settings_close").style.color = "black";

      document.getElementById("rules_container_01").style.backgroundColor = "white";
      document.getElementById("rules_container_01").style.borderTop = "1px solid black";
      document.getElementById("rules_text_01").style.color = "black";

      document.getElementById("rules_container_02").style.backgroundColor = "white";
      document.getElementById("rules_container_02").style.borderTop = "1px solid black";
      document.getElementById("rules_text_02").style.color = "black";

      document.getElementById("rules_container_03").style.backgroundColor = "white";
      document.getElementById("rules_container_03").style.borderTop = "1px solid black";
      document.getElementById("rules_text_03").style.color = "black";

      // scores modal
      document.getElementById("scores_modal").style.backgroundColor = "white";
      document.getElementById("scores_modal").style.border = "2px solid black";
      document.getElementById("scores_close").style.color = "black";
      document.getElementById("stats_container").style.color = "black";
      document.getElementById("stats_container").style.backgroundColor = "white";
      document.getElementById("stats_container").style.borderTop = "1px solid black";

    } else {
      // main game
      document.getElementById("container").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("header").style.borderBottom = "1px solid gray";
      document.getElementById("title").style.color = "white";
      document.getElementById("cp05").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("cp05").style.border = "2px solid " + style.getPropertyValue('--dark-mode-black');
      document.getElementById("reset_button").src = "icons/reset_dark.png";
      document.getElementById("highlight_button").src = "icons/highlight_dark.png";
      document.getElementById("settings_button").src = "icons/settings_dark.png";
      document.getElementById("scores_button").src = "icons/scores_dark.png";
      document.getElementById("time").style.color = "white";

      // palette modal
      document.getElementById("palette_modal").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("palette_modal").style.border = "2px solid gray";
      document.getElementById("palette_close").style.color = "gray";
      document.getElementById("dark_mode_container").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("dark_mode_name").style.color = "white";

      // settings modal
      document.getElementById("settings_modal").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("settings_modal").style.border = "2px solid gray";
      document.getElementById("settings_close").style.color = "gray";

      document.getElementById("rules_container_01").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("rules_container_01").style.borderTop = "1px solid gray";
      document.getElementById("rules_text_01").style.color = "white";

      document.getElementById("rules_container_02").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("rules_container_02").style.borderTop = "1px solid gray";
      document.getElementById("rules_text_02").style.color = "white";

      document.getElementById("rules_container_03").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("rules_container_03").style.borderTop = "1px solid gray";
      document.getElementById("rules_text_03").style.color = "white";

      // scores modal
      document.getElementById("scores_modal").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("scores_modal").style.border = "2px solid gray";
      document.getElementById("scores_close").style.color = "gray";
      document.getElementById("stats_container").style.color = "white";
      document.getElementById("stats_container").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("stats_container").style.borderTop = "1px solid gray";
    }

    choosePalette(window.localStorage.getItem("userPalette"));
    fillGrid();
    chooseColor(currentColor);
  }

  function blurScreen() {
    timer.stop();

    if (!gameWon) {
      for (let i = 0; i < 4; i++) {
        if (document.getElementById("compass0" + (i+1).toString())) {
          document.getElementById("compass0" + (i+1).toString()).remove();
        }
        if (document.getElementById("compass1" + (i+1).toString())) {
          document.getElementById("compass1" + (i+1).toString()).remove();
        }
        if (document.getElementById("compass0" + (i+1).toString() + "N")) {
          document.getElementById("compass0" + (i+1).toString() + "N").remove();
        }
        if (document.getElementById("compass0" + (i+1).toString() + "E")) {
          document.getElementById("compass0" + (i+1).toString() + "E").remove();
        }
        if (document.getElementById("compass0" + (i+1).toString() + "S")) {
          document.getElementById("compass0" + (i+1).toString() + "S").remove();
        }
        if (document.getElementById("compass0" + (i+1).toString() + "W")) {
          document.getElementById("compass0" + (i+1).toString() + "W").remove();
        }
      }

      for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
          sq = document.getElementById((x + (5 * y) + 1).toString());
          if (colorMode == "light") {
            sq.style.backgroundColor = "white";
            sq.style.border = "2px solid black";
          } else {
            sq.style.backgroundColor = style.getPropertyValue('--dark-mode-black');
            sq.style.border = "2px solid gray";
          }
        }
      }
    }

  }

  function focusScreen() {
    if (!gameWon) {
      timer.start();
    }

    setCompasses(false);
    fillGrid();
    if (document.getElementById("overlay").classList.contains("active")) {
      document.getElementById("overlay").classList.remove("active");
    }
    if (document.getElementById("palette_modal").classList.contains("active")) {
      document.getElementById("palette_modal").classList.remove("active");
    }
    if (document.getElementById("settings_modal").classList.contains("active")) {
      document.getElementById("settings_modal").classList.remove("active");
    }
    if (document.getElementById("scores_modal").classList.contains("active")) {
      document.getElementById("scores_modal").classList.remove("active");
    }
  }

  function beginColor() {
    drag = true;
    if (highlighted) {
      setCompasses(false);
      highlighted = false;
    }
  }

  function endColor() {
    drag = false;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        clicked[i][j] = 0;
      }
    }
  }

  function chooseColor(choice) {
    currentColor = choice;

    for (let i = 0; i < 4; i++) {
      cp = document.getElementById("cp0" + (i+1).toString());
      if (i == currentColor - 1) {
        if (colorMode == "light") {
          cp.style.border = "2px solid black";
        } else {
          cp.style.border = "2px solid white";
        }
      } else {
        if (colorMode == "light") {
          cp.style.border = "2px solid white";
        } else {
          cp.style.border = "2px solid " + style.getPropertyValue('--dark-mode-black');
        }
      }
    }
  }

  function setColor(event) {

    sq = event.target;
    if (sq.hasPointerCapture(event.pointerId)) { sq.releasePointerCapture(event.pointerId); }

    sqx = Math.floor((sq.id-1) % 5);
    sqy = Math.floor((sq.id-1) / 5);

    valid = true;
    for (let i = 0; i < 4; i++) {
      compassx = cors[i][0];
      compassy = cors[i][1];
      if (compassx == sqx && compassy == sqy) {
        valid = false;
        if (drag) {
          currentColor = grid[sqx][sqy];
          chooseColor(currentColor);
        }
      }
    }

    if (drag && clicked[sqx][sqy] == 0 && valid) {
      if (grid[sqx][sqy] != currentColor) {
        sq.style.backgroundColor = style.getPropertyValue('--color' + currentColor);
        sq.style.border = "2px solid " + style.getPropertyValue('--color' + currentColor);
        grid[sqx][sqy] = currentColor;
      } else {
        if (colorMode == "light") {
          sq.style.backgroundColor = "white";
          sq.style.border = "2px solid black";
        } else {
          sq.style.backgroundColor = style.getPropertyValue('--dark-mode-black');
          sq.style.border = "2px solid gray";
        }
        grid[sqx][sqy] = 0;
      }
      clicked[sqx][sqy] = 1;
    }
  }

  function resetGrid() {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        sq = document.getElementById((i + (5 * j) + 1).toString());
        valid = true;
        for (let c = 0; c < 4; c++) {
          if (i == cors[c][0] && j == cors[c][1]) {
            valid = false;
          }
        }
        if (valid) {
          grid[i][j] = 0;
          if (colorMode == "light") {
            sq.style.backgroundColor = "white";
            sq.style.border = "2px solid black";
          } else {
            sq.style.backgroundColor = style.getPropertyValue('--dark-mode-black');
            sq.style.border = "2px solid gray";
          }
        }
      }
    }
    setCompasses();
    window.localStorage.setItem("gridProgress", JSON.stringify(grid));
  }

  function highlight() {

    highlighted = true;

    nesw = compassCheck();

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (j == 0 && document.getElementById("compass0" + (i+1).toString() + "N")) {
          if (nesw[i][j] != compassNESW[i][j]) {
            document.getElementById("compass0" + (i+1).toString() + "N").style.color = "white";
          } else {
            document.getElementById("compass0" + (i+1).toString() + "N").style.color = "black";
          }
        }
        if (j == 1 && document.getElementById("compass0" + (i+1).toString() + "E")) {
          if (nesw[i][j] != compassNESW[i][j]) {
            document.getElementById("compass0" + (i+1).toString() + "E").style.color = "white";
          } else {
            document.getElementById("compass0" + (i+1).toString() + "E").style.color = "black";
          }
        }
        if (j == 2 && document.getElementById("compass0" + (i+1).toString() + "S")) {
          if (nesw[i][j] != compassNESW[i][j]) {
            document.getElementById("compass0" + (i+1).toString() + "S").style.color = "white";
          } else {
            document.getElementById("compass0" + (i+1).toString() + "S").style.color = "black";
          }
        }
        if (j == 3 && document.getElementById("compass0" + (i+1).toString() + "W")) {
          if (nesw[i][j] != compassNESW[i][j]) {
            document.getElementById("compass0" + (i+1).toString() + "W").style.color = "white";
          } else {
            document.getElementById("compass0" + (i+1).toString() + "W").style.color = "black";
          }
        }
      }
    }
  }

  function didWin() {

    window.localStorage.setItem("gridProgress", JSON.stringify(grid));

    nesw = compassCheck();

    win = true;

    for (let c = 0; c < 4; c++) {
      for (let d = 0; d < 4; d++) {
        if (nesw[c][d] != compassNESW[c][d]) {
          win = false;
        }
      }
    }

    if (win) {
      if (noLoneSquares() && checkPaths()) {
        gameWon = true;
        timer.stop();
        gameWonCleanup();
        gw = Number(window.localStorage.getItem("gamesWon")) + 1;
        window.localStorage.setItem("gamesWon", gw.toString());

        newT = Math.floor(timer.getTime() / 1000);
        oldAvg = Number(window.localStorage.getItem("averageTime"));
        newAvg = oldAvg + ((newT - oldAvg) / gw);

        window.localStorage.setItem("averageTime", newAvg.toString());
      }
    }
  }

  function fillGrid() {
    gridProgress = JSON.parse(window.localStorage.getItem("gridProgress"));
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        grid[x][y] = gridProgress[x][y];
        sq = document.getElementById((x + (5 * y) + 1).toString());
        if (!gridProgress[x][y]) {
          if (colorMode == "light") {
            sq.style.backgroundColor = "white";
            sq.style.border = "2px solid black";
          } else {
            sq.style.backgroundColor = style.getPropertyValue('--dark-mode-black');
            sq.style.border = "2px solid gray"
          }
        } else {
          sq.style.backgroundColor = style.getPropertyValue('--color' + gridProgress[x][y]);
          sq.style.border = "2px solid " + style.getPropertyValue('--color' + gridProgress[x][y]);
        }
      }
    }
  }

  function gameWonCleanup() {

    window.localStorage.setItem("todayWon", "1");

    fillGrid();

    delay = 0.15;
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        sqNum = x + (5 * y) + 1;
        sq = document.getElementById((sqNum).toString());
        sq.style.animation = `square_flip 1.5s ease-in ${(delay * x) + (delay * y)}s 1 forwards`;
        ['pointerdown', 'pointermove', 'pointerup'].forEach( event =>
          sq.removeEventListener(event, setColor));
      }
    }

    document.getElementById("reset_button").removeEventListener("click", resetGrid);
    document.getElementById("highlight_button").removeEventListener("click", highlight);

    document.removeEventListener("pointerdown", beginColor);
    document.removeEventListener("pointerup", endColor);
    document.removeEventListener("pointerup", didWin);

    window.removeEventListener("blur", blurScreen);
    window.removeEventListener("focus", focusScreen);

    setTimeout(scoresMenu, 1000);
  }

  function checkDirection(i, d) {
    if (d == "N" || d == "W") {
      return i > 0;
    }
    if (d == "E" || d == "S") {
      return i < 4;
    }
  }

  function noLoneSquares() {
    noLone = true;
    nor = eas = sou = wes = 0;

    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        color = grid[x][y];

        if (checkDirection(y, "N")) { nor = grid[x][y-1]; }
        if (checkDirection(x, "E")) { eas = grid[x+1][y]; }
        if (checkDirection(y, "S")) { sou = grid[x][y+1]; }
        if (checkDirection(x, "W")) { wes = grid[x-1][y]; }

        if (x == 0 && y == 0) {
          if (eas != color && sou != color) { noLone = false; }
        } else if (x == 4 && y == 0) {
          if (sou != color && wes != color) { noLone = false; }
        } else if (x == 4 && y == 4) {
          if (nor != color && wes != color) { noLone = false; }
        } else if (x == 0 && y == 4) {
          if (nor != color && eas != color) { noLone = false; }
        } else if (x == 0) {
          if (nor != color && eas != color && sou != color) { noLone = false; }
        } else if (y == 0) {
          if (eas != color && sou != color && wes != color) { noLone = false; }
        } else if (x == 4) {
          if (nor != color && sou != color && wes != color) { noLone = false; }
        } else if (y == 4) {
          if (nor != color && eas != color && wes != color) { noLone = false; }
        } else if (nor != color && eas != color && sou != color && wes != color) { noLone = false; }
      }
    }

    return noLone;
  }

  function checkPaths() {
    winPath = true;

    for (let i = 0; i < 4; i++) {
      for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
          compassX = +cors[i][0];
          compassY = +cors[i][1];
          if (grid[x][y] == grid[compassX][compassY] && !(x == compassX && y == compassY)) {
            if (!checkPath(x, y, compassX, compassY)) {
              winPath = false;
            }
          }
        }
      }
    }
    return winPath;
  }

  function checkPath(x1, y1, x2, y2) {

    binaryGrid = Array.from(Array(5), () => new Array(5));
    goodPath = false;
    color = grid[x1][y1];

    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        if (grid[x][y] == color) {
          binaryGrid[x][y] = Math.abs(x2 - x) + (Math.abs(y2 - y) * 2) + 1;
        } else {
          binaryGrid[x][y] = 0;
        }
      }
    }

    checkCoordinates = [[x1, y1]];
    deadPath = false;

    while (!deadPath) {

      currentX = checkCoordinates[0][0];
      currentY = checkCoordinates[0][1];

      pathSpots = [];

      if (checkDirection(currentY, "N") && binaryGrid[currentX][currentY-1] > 0) {
        pathValue = binaryGrid[currentX][currentY-1];
        pathSpots.push([currentX, currentY-1, pathValue]);
      }
      if (checkDirection(currentX, "E") && binaryGrid[currentX+1][currentY] > 0) {
        pathValue = binaryGrid[currentX+1][currentY];
        pathSpots.push([currentX+1, currentY, pathValue]);
      }
      if (checkDirection(currentY, "S") && binaryGrid[currentX][currentY+1] > 0) {
        pathValue = binaryGrid[currentX][currentY+1];
        pathSpots.push([currentX, currentY+1, pathValue]);
      }
      if (checkDirection(currentX, "W") && binaryGrid[currentX-1][currentY] > 0) {
        pathValue = binaryGrid[currentX-1][currentY];
        pathSpots.push([currentX-1, currentY, pathValue]);
      }

      binaryGrid[currentX][currentY] = -1;
      checkCoordinates.splice(0, 1);

      if (pathSpots.length > 0) {

        pathSpots.sort(function(a,b) {
          return a[2] - b[2];
        });

        for (let i = 0; i < pathSpots.length; i++) {
          pathX = pathSpots[i][0];
          pathY = pathSpots[i][1];
          checkCoordinates.push([pathX, pathY]);
          if (pathX == x2 && pathY == y2) {
            deadPath = true;
            goodPath = true;
          }
        }
      } else if (checkCoordinates.length == 0) {
        deadPath = true;
      }
    }

    return goodPath;
  }

  function compassCheck() {

    pressedNESW = Array.from(Array(4), () => new Array(4).fill(0));

    for (let i = 0; i < 4; i++) {
      x = cors[i][0];
      y = cors[i][1];
      color = grid[x][y];

      tmpCors = [];
      for (let m = 0; m < 5; m++) {
        for (let n = 0; n < 5; n++) {
          if (grid[m][n] == color) {
            tmpCors.push([m,n]);
          }
        }
      }

      for (let a = 0; a < tmpCors.length; a++) {
        if (tmpCors[a][0] < x) { pressedNESW[i][3] = pressedNESW[i][3] + 1; }
        if (tmpCors[a][0] > x) { pressedNESW[i][1] = pressedNESW[i][1] + 1; }
        if (tmpCors[a][1] < y) { pressedNESW[i][0] = pressedNESW[i][0] + 1; }
        if (tmpCors[a][1] > y) { pressedNESW[i][2] = pressedNESW[i][2] + 1; }
      }
    }

    return pressedNESW;
  }
})
