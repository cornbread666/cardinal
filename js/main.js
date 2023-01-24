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
      //console.log("timer started");
      this.isRunning = true;
      this.startTime = Date.now();
    }

    stop() {
      if (!this.isRunning) {
        return console.error('Timer is already stopped');
      }
      //console.log("timer stopped");
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

  index = 0;

  mn = 1;

  gameWon = false;

  var timerInterval;

  gameSetup();

  function gameSetup() {

    puzzles = ["x", "x", "x", "242230023400133302351020", "01412430332000523105013120", "31124102038313204004202002", "223014441133034161052002", "30030024032044200650330121", "420314210020751012002731", "434033128027001400350012", "410320321033310001011167", "334314239305002140053110", "040044127700021010015510", "413324125037212120041001", "411223101031103134300234", "04220043240010140730301211", "201342040234352020423100", "00304313033002861022013112202233", "044331122600700500213014", "013023033610046102411110012023", "4014340300143301530153002032", "0114302415303002044213001013233133", "124123143003305632011102", "0341212412205039032024001333", "00032244032014302112600310202230", "321300233412101306400341", "04124043220033020057003300", "1222233110242563010052030212202230", "34041033540032000032511510112130", "204432400135000300550063", "04302123220005503114322212132023", "0230341155200220230003600020", "1203144378114300120110210010122132", "044224013200604723003200", "02123141420002520383300301102233", "001113310360010016303232021022", "441103334007201312106402132230", "102123320033330000331353011013233032", "0113204123501410013120531322", "3240041311330079040010001321", "41120133106421324310002302101231", "240131435106463013100011", "0321314414204126121030031022", "0113324325102123430100330212303032", "121331321033010004617106021013202330", "234132005103101002860300012331", "132403417302240011203034001122", "121340430310012100375035000310122330", "202343020420510420221340", "133023433232003603205002", "31022420212204403501001310122333", "21234202002322323032531031", "21122333001301423630600301031013213132", "03243442740040054200300100213033", "340130225301341002101056101232", "42033100105510103147010023", "011333312450660002200220021221233233", "102402430331220412005004", "04122134430010005423420112202133", "33043230001023004523005700212332", "34301113320203312111321401202332", "31130421025050041300342130", "2234044132122201740020111120", "123422200033400345210213", "04304321370002202002303600112022", "01142144330002002354700401202230", "321300233412101306400341", "1244221120038006015421001020", "22440221224630043100341010133032", "034041112850000300121143"];

    firstDay = new Date("01/16/2023");
    today = new Date();
    diff = today - firstDay;
    index = Math.floor(diff / (1000 * 3600 * 24));
    document.getElementById("version_info").innerText = "cardinal #" + index.toString() + " — v1.1.7";

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
    if (!at || at === "00:00") {
      window.localStorage.setItem("averageTime", "0");
    }

    scores = window.localStorage.getItem("allScores");
    if (!scores) {
      window.localStorage.setItem("allScores", JSON.stringify([0, 0, 0, 0, 0]));
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

    todaysPuzzle = puzzles[index];

    createSquares(true);
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
      timerInterval = setInterval(() => {
        tmp = timer.getTime();
        t = tmp + (ts * 1000);
        window.localStorage.setItem("timeSpent", (t / 1000).toString());
        timeText((t / 1000));
      }, 100);
    }

    if (firstTime) {
      settingsMenu(1);
    } else if (!gridFill) {
      startPrompt();
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

  function createSquares(initial) {

    if (!initial) {
      for (let x = 0; x < 25; x++) {
        document.getElementById((x + 1).toString()).remove();
      }
    }

    w = (gameBoard.offsetWidth - 40) / 5;
    h = (gameBoard.offsetHeight - 40) / 5;
    size = 0;
    if (w >= h) {
      size = h;
    } else {
      size = w;
    }

    for (let i = 0; i < 25; i++) {
      let square = document.createElement("div");
      square.classList.add("button", "square");
      square.id = (i + 1).toString();
      square.style.backgroundColor = "white";
      square.style.width = `${size}px`;
      square.style.height = `${size}px`;
      ['pointerdown', 'pointermove', 'pointerup'].forEach( event =>
        square.addEventListener(event, setColor));
      gameBoard.appendChild(square);
      if (gameWon && !initial) {
        square.style.borderRadius = "50%";
      }
    }

    fillGrid();
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
    settingsImg.addEventListener("click", function() { settingsMenu(1) }, false);
    settingsImg.style.left = `${l}px`;
    settingsImg.style.top = `${t}px`;
    settingsImg.style.position = "absolute";
    settingsImg.style.height = "30px";
    settingsImg.style.cursor = "pointer";
    settingsImg.style.transform = "translate(-25%, 0)";
    settingsImg.style.webkitTapHighlightColor = "transparent";
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
    scoresImg.style.webkitTapHighlightColor = "transparent";
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
    time.style.transform = "translate(0, -25%)";
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

  function settingsMenu(menuNum) {

    document.getElementById("settings_modal").classList.add("active");
    document.getElementById("overlay").classList.add("active");

    sqList = [];
    sqCoorList = [];
    squares = [];

    if (menuNum > 1) {
      document.getElementById("left_arrow").style.visibility = "visible";
    } else {
      document.getElementById("left_arrow").style.visibility = "hidden";
    }
    if (menuNum < 3) {
      document.getElementById("right_arrow").style.visibility = "visible";
    } else {
      document.getElementById("right_arrow").style.visibility = "hidden";
    }

    for (let i = 0; i < 3; i++) {
      if ((i+1) != menuNum) {
        document.getElementById("rules_container_0" + (i+1).toString()).classList.remove("active");
        document.getElementById("rules_dot_0" + (i+1).toString()).style.height = "10px";
        document.getElementById("rules_dot_0" + (i+1).toString()).style.width = "10px";
      } else {
        document.getElementById("rules_container_0" + (i+1).toString()).classList.add("active");
        document.getElementById("rules_dot_0" + (i+1).toString()).style.height = "20px";
        document.getElementById("rules_dot_0" + (i+1).toString()).style.width = "20px";
      }
    }

    if (menuNum == 1) {
      sqList = ["rb04"];
      sqCoorList = [[0,2,1,0]];
      squares = ["rb01", "rb02", "rb03", "rb05", "rb06", "rb07", "rb08", "rb09"];

      if (colorMode == "light") {
        document.getElementById("rb07").style.animation = "rb07w 6s infinite steps(1, start)";
        document.getElementById("rb05").style.animation = "rb05w 6s infinite steps(1, start)";
        document.getElementById("rb06").style.animation = "rb06w 6s infinite steps(1, start)";
        document.getElementById("rb08").style.animation = "rb08w 6s infinite steps(1, start)";
      } else {
        document.getElementById("rb07").style.animation = "rb07b 6s infinite steps(1, start)";
        document.getElementById("rb05").style.animation = "rb05b 6s infinite steps(1, start)";
        document.getElementById("rb06").style.animation = "rb06b 6s infinite steps(1, start)";
        document.getElementById("rb08").style.animation = "rb08b 6s infinite steps(1, start)";
      }
      document.getElementById("rules_check_01").style.animation = "check01 6s infinite steps(1, start)";
    } else if (menuNum == 2) {
      sqList = ["rb11", "rb19"];
      sqCoorList = [[0,2,2,0], [2,0,0,2]];
      squares = ["rb12", "rb13", "rb14", "rb15", "rb16", "rb17", "rb18"];

      if (colorMode == "light") {
        document.getElementById("rb18").style.animation = "rb18w 12s infinite steps(1, start)";
        document.getElementById("rb15").style.animation = "rb15w 12s infinite steps(1, start)";
        document.getElementById("rb16").style.animation = "rb16w 12s infinite steps(1, start)";
        document.getElementById("rb17").style.animation = "rb17w 12s infinite steps(1, start)";
        document.getElementById("rb14").style.animation = "rb14w 12s infinite steps(1, start)";
        document.getElementById("rb12").style.animation = "rb12w 12s infinite steps(1, start)";
        document.getElementById("rb13").style.animation = "rb13w 12s infinite steps(1, start)";
      } else {
        document.getElementById("rb18").style.animation = "rb18b 12s infinite steps(1, start)";
        document.getElementById("rb15").style.animation = "rb15b 12s infinite steps(1, start)";
        document.getElementById("rb16").style.animation = "rb16b 12s infinite steps(1, start)";
        document.getElementById("rb17").style.animation = "rb17b 12s infinite steps(1, start)";
        document.getElementById("rb14").style.animation = "rb14b 12s infinite steps(1, start)";
        document.getElementById("rb12").style.animation = "rb12b 12s infinite steps(1, start)";
        document.getElementById("rb13").style.animation = "rb13b 12s infinite steps(1, start)";
      }
      document.getElementById("rules_check_02").style.animation = "check02 12s infinite steps(1, start)";
      document.getElementById("rules_ex_02").style.animation = "ex02 12s infinite steps(1, start)";
    } else if (menuNum == 3) {
      sqList = ["rb21", "rb22", "rb23"];
      sqCoorList = [[0,0,"x",0], [0,0,2,0], [0,0,2,0]];
      squares = ["rb24", "rb25", "rb26", "rb27", "rb28", "rb29"];

      if (colorMode == "light") {
        document.getElementById("rb24").style.animation = "rb24w 6s infinite steps(1, start)";
        document.getElementById("rb25").style.animation = "rb25w 6s infinite steps(1, start)";
        document.getElementById("rb27").style.animation = "rb27w 6s infinite steps(1, start)";
        document.getElementById("rb28").style.animation = "rb28w 6s infinite steps(1, start)";
        document.getElementById("rb26").style.animation = "rb26w 6s infinite steps(1, start)";
        document.getElementById("rb29").style.animation = "rb29w 6s infinite steps(1, start)";
      } else {
        document.getElementById("rb24").style.animation = "rb24b 6s infinite steps(1, start)";
        document.getElementById("rb25").style.animation = "rb25b 6s infinite steps(1, start)";
        document.getElementById("rb27").style.animation = "rb27b 6s infinite steps(1, start)";
        document.getElementById("rb28").style.animation = "rb28b 6s infinite steps(1, start)";
        document.getElementById("rb26").style.animation = "rb26b 6s infinite steps(1, start)";
        document.getElementById("rb29").style.animation = "rb29b 6s infinite steps(1, start)";
      }
      document.getElementById("rules_check_03").style.animation = "check03 6s infinite steps(1, start)";
    }

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

    mn = menuNum;
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

    scores = JSON.parse(window.localStorage.getItem("allScores"));
    max = Math.max(...scores);

    for (let i = 5; i > 0; i--) {
      s = scores[i-1];
      bar = document.getElementById("bb0" + i.toString());
      bar.innerText = s.toString();

      if (s == 0) {
          bar.style.width = "4%";
      } else {
          bar.style.width = `${4 + ((scores[i-1] / max) * 80)}%`;
      }
    }

    if (gameWon) {
      star = String.fromCodePoint("0x2605");
      timeNumber = Number(window.localStorage.getItem("timeSpent"));
      timeSpent = "";
      if (timeNumber < 3600) {
        timeSpent = new Date(timeNumber * 1000).toISOString().substring(14, 19);
      } else {
        timeSpent = new Date(timeNumber * 1000).toISOString().substring(11, 19);
      }
      stars = getScore(timeNumber);

      document.getElementById("clipboard_copy").innerText = "today's score: " + timeSpent + ", " + stars.toString() + star;
    }

    blurScreen();
  }

  function closeModal(clicked = "close") {

    if (!(clicked == "overlay" && document.getElementById("start_modal").classList.contains("active"))) {
      document.getElementById("palette_modal").classList.remove("active");
      document.getElementById("settings_modal").classList.remove("active");
      document.getElementById("scores_modal").classList.remove("active");
      document.getElementById("start_modal").classList.remove("active");
      document.getElementById("overlay").classList.remove("active");

      mn = 1;

      focusScreen();
    }
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
    window.addEventListener("resize", function() { createSquares(false) }, false);
    window.addEventListener("resize", function() { setCompasses(false) }, false);
    window.addEventListener("resize", function() { gameButtons(false) }, false);
    window.addEventListener("resize", function() { menuButtons(false) }, false);
    window.addEventListener("resize", function() { setTimer(false) }, false);
    window.addEventListener("blur", blurScreen);
    window.addEventListener("focus", focusScreen);

    document.getElementById("palette_close").addEventListener("click", closeModal);
    document.getElementById("settings_close").addEventListener("click", closeModal);
    document.getElementById("scores_close").addEventListener("click", closeModal);
    document.getElementById("overlay").addEventListener("click", function() { closeModal("overlay") }, false);
    document.getElementById("share_button").addEventListener("click", shareScore);
    document.getElementById("start_button").addEventListener("click", closeModal);

    document.getElementById("left_arrow").addEventListener("click", function() { settingsMenu((mn-1)) }, false);
    document.getElementById("right_arrow").addEventListener("click", function() { settingsMenu((mn + 1)) }, false);

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

      document.getElementById("tutorial_title").style.color = "black";

      document.getElementById("rules_container_01").style.backgroundColor = "white";
      document.getElementById("rules_container_01").style.borderTop = "1px solid black";
      document.getElementById("rules_text_01").style.color = "black";

      document.getElementById("rules_container_02").style.backgroundColor = "white";
      document.getElementById("rules_container_02").style.borderTop = "1px solid black";
      document.getElementById("rules_text_02").style.color = "black";

      document.getElementById("rules_container_03").style.backgroundColor = "white";
      document.getElementById("rules_container_03").style.borderTop = "1px solid black";
      document.getElementById("rules_text_03").style.color = "black";

      document.getElementById("check_container").style.color = "white";
      document.getElementById("rules_bottom_row").style.backgroundColor = "white";
      document.getElementById("rules_dots").style.backgroundColor = "white";
      document.getElementById("rules_dot_01").style.backgroundColor = "black";
      document.getElementById("rules_dot_02").style.backgroundColor = "black";
      document.getElementById("rules_dot_03").style.backgroundColor = "black";
      document.getElementById("left_arrow").src = "icons/left_light.png";
      document.getElementById("right_arrow").src = "icons/right_light.png";

      // scores modal
      document.getElementById("scores_modal").style.backgroundColor = "white";
      document.getElementById("scores_modal").style.border = "2px solid black";
      document.getElementById("scores_close").style.color = "black";
      document.getElementById("stats_container").style.color = "black";
      document.getElementById("stats_container").style.backgroundColor = "white";
      document.getElementById("stats_container").style.borderTop = "1px solid black";
      document.getElementById("share_container").style.backgroundColor = "white";
      document.getElementById("share_container").style.borderTop = "1px solid black";
      document.getElementById("clipboard_copy").style.color = "black";
      document.getElementById("my_info").style.backgroundColor = "white";
      document.getElementById("my_info").style.borderTop = "1px solid black";
      document.getElementById("name").style.color = "black";
      document.getElementById("email").style.color = "black";
      document.getElementById("graph_container").style.backgroundColor = "white";
      document.getElementById("bl01").style.color = "black";
      document.getElementById("bl02").style.color = "black";
      document.getElementById("bl03").style.color = "black";
      document.getElementById("bl04").style.color = "black";
      document.getElementById("bl05").style.color = "black";
      document.getElementById("version_info").style.backgroundColor = "white";
      document.getElementById("version_info").style.color = "black";

      // start modal
      document.getElementById("start_modal").style.border = "2px solid black";
      document.getElementById("start_modal").style.backgroundColor = "white";
      document.getElementById("start_container").style.backgroundColor = "white";
      document.getElementById("cardinal_intro").style.color = "black";

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

      document.getElementById("tutorial_title").style.color = "white";

      document.getElementById("rules_container_01").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("rules_container_01").style.borderTop = "1px solid gray";
      document.getElementById("rules_text_01").style.color = "white";

      document.getElementById("rules_container_02").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("rules_container_02").style.borderTop = "1px solid gray";
      document.getElementById("rules_text_02").style.color = "white";

      document.getElementById("rules_container_03").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("rules_container_03").style.borderTop = "1px solid gray";
      document.getElementById("rules_text_03").style.color = "white";

      document.getElementById("check_container").style.color = style.getPropertyValue('--dark-mode-black');
      document.getElementById("rules_bottom_row").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("rules_dots").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("rules_dot_01").style.backgroundColor = "white";
      document.getElementById("rules_dot_02").style.backgroundColor = "white";
      document.getElementById("rules_dot_03").style.backgroundColor = "white";
      document.getElementById("left_arrow").src = "icons/left_dark.png";
      document.getElementById("right_arrow").src = "icons/right_dark.png";

      // scores modal
      document.getElementById("scores_modal").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("scores_modal").style.border = "2px solid gray";
      document.getElementById("scores_close").style.color = "gray";
      document.getElementById("stats_container").style.color = "white";
      document.getElementById("stats_container").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("stats_container").style.borderTop = "1px solid gray";
      document.getElementById("share_container").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("share_container").style.borderTop = "1px solid gray";
      document.getElementById("clipboard_copy").style.color = "white";
      document.getElementById("my_info").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("my_info").style.borderTop = "1px solid gray";
      document.getElementById("name").style.color = "white";
      document.getElementById("email").style.color = "white";
      document.getElementById("graph_container").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("bl01").style.color = "white";
      document.getElementById("bl02").style.color = "white";
      document.getElementById("bl03").style.color = "white";
      document.getElementById("bl04").style.color = "white";
      document.getElementById("bl05").style.color = "white";
      document.getElementById("version_info").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("version_info").style.color = "white";

      // start modal
      document.getElementById("start_modal").style.border = "2px solid gray";
      document.getElementById("start_modal").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("start_container").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("cardinal_intro").style.color = "white";
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

    if (!document.getElementById("start_modal").classList.contains("active")
    && !document.getElementById("palette_modal").classList.contains("active")
    && !document.getElementById("settings_modal").classList.contains("active")
    && !document.getElementById("scores_modal").classList.contains("active")) {

      if (!gameWon) {
        timer.start();
      }

      setCompasses(false);
      fillGrid();
    }

  }

  function startPrompt() {

    document.getElementById("start_modal").classList.add("active");
    document.getElementById("overlay").classList.add("active");
    document.getElementById("cardinal_intro").innerText = "cardinal #" + index.toString();

    blurScreen();
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
        b = false;
        for (let e = 0; e < blanks.length; e++) {
          if (c == blanks[e][0] && d == blanks[e][1]) {
            b = true;
          }
        }
        if ((nesw[c][d] != compassNESW[c][d]) && !b) {
          win = false;
        }
      }
    }

    if (win) {
      if (noLoneSquares() && checkPaths()) {
        gameWon = true;
        timer.stop();
        clearInterval(timerInterval);
        gameWonCleanup();
        gw = Number(window.localStorage.getItem("gamesWon")) + 1;
        window.localStorage.setItem("gamesWon", gw.toString());

        newT = Number(window.localStorage.getItem("timeSpent"));
        oldAvg = Number(window.localStorage.getItem("averageTime"));
        newAvg = oldAvg + ((newT - oldAvg) / gw);
        window.localStorage.setItem("averageTime", newAvg.toString());

        scores = JSON.parse(window.localStorage.getItem("allScores"));
        stars = getScore(newT);
        scores[stars-1] = scores[stars-1] + 1;
        window.localStorage.setItem("allScores", JSON.stringify(scores));
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

    document.getElementById("share_container").classList.add("active");
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

    setTimeout(scoresMenu, 2200);
  }

  function shareScore() {

    document.getElementById("clipboard_copy").innerText = "copied to clipboard";

    yc = String.fromCodePoint("0x1f7e1");
    rc = String.fromCodePoint("0x1f534");
    gc = String.fromCodePoint("0x1f7e2");
    bc = String.fromCodePoint("0x1f535");
    oc = String.fromCodePoint("0x1f7e0");
    pc = String.fromCodePoint("0x1f7e3");
    star = String.fromCodePoint("0x2605");
    blankStar = String.fromCodePoint("0x2606");
    clock = String.fromCodePoint("0x1f553");
    blackCircle = String.fromCodePoint("0x26AB");

    timeNumber = Number(window.localStorage.getItem("timeSpent"));
    timeSpent = "";
    if (timeNumber < 3600) {
      timeSpent = new Date(timeNumber * 1000).toISOString().substring(14, 19);
    } else {
      timeSpent = new Date(timeNumber * 1000).toISOString().substring(11, 19);
    }

    stars = getScore(timeNumber);

    scoreString = "";
    for (let i = 0; i < 5; i++) {
      if ((i + 1) <= stars) {
        scoreString = scoreString + star + " ";
      } else {
        scoreString = scoreString + blankStar + " ";
      }
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(`cardinal #${index.toString()} — ${timeSpent}
${scoreString}

https://cornbread.games`);
    }
  }

  function getScore(t) {

    if (t < 60) {
      stars = 5;
    } else if (t >= 60 && t < 150) {
      stars = 4;
    } else if (t >= 150 && t < 300) {
      stars = 3;
    } else if (t >= 300 && t < 600) {
      stars = 2;
    } else {
      stars = 1;
    }

    return stars;
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
          if (grid[x][y] == 0) {
            winPath = false;
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
    if (color == 0) {
      return false;
    }

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
});
