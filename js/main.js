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

  practice = true;
  activeGame = false;
  index = 0;
  mn = 1;
  firstTime = false;
  gameWon = false;

  var timerInterval;
  var practiceInterval;

  puzzles = ["x", "x", "x", "x", "x", "x",
  // sunday through saturday, row begins with sunday.
  // 6 - 12
  "223014441133034161052002", "30030024032044200650330121", "420314210020751012002731", "434033128027001400350012", "410320321033310001011167", "23424100102500533015044032", "421114124046220242020001",
  // 13 - 19
  "403411430025410601213002", "334314239305002140053110", "040044127700021010015510", "413324125037212120041001", "411223101031103134300234", "04220043240010140730301211", "201342040234352020423100",
  // 20 - 26
  "044331122600700500213014", "41334001006510340015013003", "242104009405363011000100", "433000233045002202105115", "002224200130241064050211", "300143140210356050151200", "214004013453002226000130",
  // 27 - 33
  "0422123148001120301442020133", "300001220550031003601333", "122214202860521420030200", "40231233002050375510022013", "403203340046123133202003", "023440204320420500420211", "241410325402000104532111",
  // 34 - 40
  "2312243058202003200401240131",  "241340203402420100420024", "034041112850000300121143", "1244221120038006015421001020", "223313435205001111336013", "41112333501600205510004400", "042230449600241202101002",
  // 41 - 47
  "013023033610046102411110012023", "103004420142022067000031", "03440131163060042210310110", "4014340300143301530153002032", "124123143003305632011102", "432230031021521402202630", "33011342125354003002301410",
  // 48 - 54
  "1222233110242563010052030212202230", "240131435106463013100011", "204432400135000300550063", "001113310360010016303232021022", "102402430331220412005004", "04124043220033020057003300", "133023433232003603205002",
  // 55 - 61
  "04302123220005503114322212132023", "321300233412101306400341", "31130421025050041300342130", "023034115520022023000360002033", "123422200033400345210213", "041242020400861220240120", "24331341520202203004402500",
  // 62 - 68
  "1203144378114300120110210010122132", "044224013200604723003200", "11442341421310012135102323", "00304313033002861022013112202233", "202343020420510420221340", "42033100105510103147010023", "023031044320056100132500",
  // 69 - 75
  "011333312450660002200220021221233233", "220344144301640040022301", "231203006830133020100200", "02123141420002520383300301102233", "14214213010120265045330023", "342021120100005727400330", "1231403422233004004322041233",
  // 76 - 82
  "34041033540032000032511510112130", "122201030340584033001010", "234312103002500205730112", "0113204123501410013120531322", "143122433402522621111000", "23421031301630010222028332", "3240041311330079040010001321",
  // 83 - 89
  "102123320033330000331353011013233032", "34331211100455102024242011", "333400406105530501400001", "03243442740040054200300100213033", "244432130102300263055203", "0111044459500430220000020112", "404431040026200302533200",
  // 90 - 96
  "121340430310012100375035000310122330", "40332104003111443234200023", "013330132770451000230022", "441103334007201312106402132230", "241330404303310200250051", "43031130301202200540014632", "120440002312360000430210",
  // 97 - 103
  "21122333001301423630600301031013213132", "21234202002322323032531031", "202302310013443112402220", "22310413263021005400510103121332", "443024424004001450064003", "214003343113004135302000", "2043023202133045243000110112",
  // 104 - 110
  "121331321033010004617106021013202330", "334014007204002124020340", "330040244214021000214105", "01142144330002002354700401202230", "112234135401114453010012", "01044223352020005024133123", "1244200102523003054111100231",
  // 111 - 117
  "0113324325102123430100330212303032", "331004412005035237003002", "42122310201101433322032222", "234132005103101002860300012331", "01043244112035002022700330", "034210413320004305622002", "0321314414204126121030031022",
  // 118 - 124
  "0114302415303002044213001013233133", "13412114463120223013100222", "440041232001047030133232", "132403417302240011203034001122", "021134407600016253020010", "004221240510002004535005", "2234044132122201740020111120",
  // 125 - 131
  "31022420212204403501001310122333", "410314200053410020010361", "23304420512902105005012003", "340130225301341002101056101232", "30233301022455100044023011", "44401300000200653400036032", "1331022223400031002085130330",
  // 132 - 138
  "33043230001023004523005700212332", "211223412015353203411020", "04123031320040020143046232", "00032244032014302112600310202230", "111033410330011230462032", "10213343030011685203002113", "1404403257008400000230021031",
  // 139 - 145
  "04122134430010005423420112202133", "213314001152552021030220", "143043042500005760032000", "04304321370002202002303600112022", "441401410002850256300020", "440240231000640000762026", "0341212412205039032024001333",
  // 146 - 152
  "34301113320203312111321401202332", "01232103574001210641012000", "043212003200124034210620", "22440221224630043100341010133032", "410340020074023000153510", "314312042222204641031000", "2043111406630021023422000230"];

  intro();

  function intro() {

    firstDay = new Date("01/16/2023"); // 01/16/2023
    today = new Date();
    diff = today - firstDay;
    index = Math.floor(diff / (1000 * 3600 * 24));
    index = 152;
    document.getElementById("version_info").innerText = "cardinal #" + index.toString() + " — v1.3.8";

    gridFill = false;

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
      palette = "default";
      window.localStorage.setItem("userPalette", "default");
    }

    cm = window.localStorage.getItem("userColorMode");
    if (!cm) {
      window.localStorage.setItem("userColorMode", colorMode);
    } else {
      colorMode = cm;
    }

    gps = window.localStorage.getItem("gamesPlayed");
    if (!gps) {
      window.localStorage.setItem("gamesPlayed", "0");
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

    windowListeners();
    colorPickerListeners();
    dragListeners();
    createSquares(true);
    choosePalette(palette);
    gameButtons(true);
    menuButtons(true);

    if (colorMode == "dark") {
      document.getElementById("dark_mode_checker").checked = true;
      switchColorMode();
    }

    if (firstTime) {
      settingsMenu(1);
    } else if (todayWon == 1) {
      gameSetup();
    } else {
      startPrompt();
    }
  }

  function gameSetup() {

    grid = Array.from(Array(5), () => new Array(5).fill(0));
    cors = [];
    compassNESW = [];
    blanks = [];

    gameWon = false;
    practice = false;

    todaysPuzzle = puzzles[index];

    activeGame = true;
    createSquares(false);
    puzzleSpecs(todaysPuzzle);
    fillGrid();
    setCompasses(false);
    setTimer(false);
    clearInterval(practiceInterval);
    clearInterval(timerInterval);
    timer.reset();
    window.localStorage.setItem("gridProgress", JSON.stringify(grid));

    ts = Number(window.localStorage.getItem("timeSpent"));
    if (ts == 0) {
      gpn = Number(window.localStorage.getItem("gamesPlayed"));
      window.localStorage.setItem("gamesPlayed", (gpn+1).toString());
    }

    todayWon = Number(window.localStorage.getItem("todayWon"));
    if (todayWon == 1) {
      timeText(ts);
      gameWon = true;
      gameWonCleanup();
    } else {
      timer.start();
      timerInterval = setInterval(() => {
        tmp = timer.getTime();
        t = tmp + (ts * 1000);
        window.localStorage.setItem("timeSpent", (t / 1000).toString());
        timeText((t / 1000));
      }, 100);
    }
  }

  function practiceSetup() {

    grid = Array.from(Array(5), () => new Array(5).fill(0));
    cors = [];
    compassNESW = [];
    blanks = [];

    gameWon = false;
    practice = true;
    activeGame = true;

    clearInterval(practiceInterval);
    clearInterval(timerInterval);
    timer.reset();

    randCompasses();
    randPuzzle();
    compassNESW = compassCheck();

    createSquares(false);
    setCompasses(false);
    setTimer(false);
    resetGrid();

    timer.start();
    practiceInterval = setInterval(() => {
      t = timer.getTime();
      timeText((t / 1000));
    }, 100);
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

    if (cors.length > 0) {
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
        if (document.getElementById((x + 1).toString())) {
          document.getElementById((x + 1).toString()).remove();
        }
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

    cp05Rect = document.getElementById("cp05").getBoundingClientRect();
    cp06Rect = document.getElementById("cp06").getBoundingClientRect();
    centerx05 = (cp05Rect.left + cp05Rect.right) / 2;
    centery05 = (cp05Rect.top + cp05Rect.bottom) / 2;
    centerx06 = (cp06Rect.left + cp06Rect.right) / 2;
    centery06 = (cp06Rect.top + cp06Rect.bottom) / 2;

    resetImg = document.createElement("img");
    resetImg.src = "icons/reset_light.png";
    if (colorMode == "dark") { resetImg.src = "icons/reset_dark.png"; }
    resetImg.id = "reset_button";
    document.getElementById("cp05").addEventListener("click", resetGrid);
    resetImg.classList.add("game_button");
    resetImg.style.top = `${centery05}px`;
    resetImg.style.left = `${centerx05}px`;
    resetImg.style.transform = "translate(-50%, -50%)";
    resetImg.classList.add("disable_select");
    resetImg.style.pointerEvents = "none";

    highlightImg = document.createElement("img");
    highlightImg.src = "icons/highlight_light.png";
    if (colorMode == "dark") { highlightImg.src = "icons/highlight_dark.png"; }
    highlightImg.id = "highlight_button";
    document.getElementById("cp06").addEventListener("click", highlight);
    highlightImg.classList.add("game_button");
    highlightImg.style.top = `${centery06}px`;
    highlightImg.style.left = `${centerx06}px`;
    highlightImg.style.transform = "translate(-50%, -50%)";
    highlightImg.classList.add("disable_select");
    highlightImg.style.pointerEvents = "none";

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
      if (document.getElementById("time")) {
        document.getElementById("time").remove();
      }
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
    if (practice) {
      time.innerText = "practice time: 00:00";
    }
    keyBoard.appendChild(time);
    if (!practice) {
      timeText(Number(window.localStorage.getItem("timeSpent")));
    }

  }

  function timeText(seconds) {

    timeString = "";

    if (practice) {
      timeString = "practice time: ";
    }

    if (seconds < 3600) {
      timeString += new Date(seconds * 1000).toISOString().substring(14, 19);
    } else {
      timeString += new Date(seconds * 1000).toISOString().substring(11, 19);
    }

    document.getElementById("time").innerText = timeString;
  }

  function paletteSelection() {
    document.getElementById("palette_modal").classList.add("active");
    document.getElementById("overlay").classList.add("active");

    blurScreen();
  }

  function settingsMenu(menuNum) {

    document.getElementById("settings_modal").classList.add("active");
    document.getElementById("overlay").classList.add("active");

    if (firstTime && menuNum < 4) {
      document.getElementById("practice_container_02").classList.remove("active");
    } else {
      document.getElementById("practice_container_02").classList.add("active");
    }

    sqList = [];
    sqCoorList = [];
    squares = [];

    if (menuNum > 1) {
      document.getElementById("left_arrow").style.visibility = "visible";
    } else {
      document.getElementById("left_arrow").style.visibility = "hidden";
    }
    if (menuNum < 4) {
      document.getElementById("right_arrow").style.visibility = "visible";
    } else {
      document.getElementById("right_arrow").style.visibility = "hidden";
    }

    for (let i = 0; i < 4; i++) {
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
      sqList = ["rb34"];
      sqCoorList = [[0,2,1,0]];
      squares = ["rb31", "rb32", "rb33", "rb35", "rb36", "rb37", "rb38", "rb39"];

    } else if (menuNum == 2) {
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
      document.getElementById("rules_check_02").style.animation = "check01 6s infinite steps(1, start)";
    } else if (menuNum == 3) {
      sqList = ["rb11", "rb19"];
      sqCoorList = [[0,"x",2,0], [2,0,0,2]];
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
      document.getElementById("rules_check_03").style.animation = "check02 12s infinite steps(1, start)";
      document.getElementById("rules_ex_03").style.animation = "ex02 12s infinite steps(1, start)";
    } else if (menuNum == 4) {
      sqList = ["rb21", "rb22", "rb23"];
      sqCoorList = [[0,0,2,0], [0,0,2,0], [0,0,2,0]];
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
      document.getElementById("rules_check_04").style.animation = "check03 6s infinite steps(1, start)";
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
    if (gpn == 0) {
      wp.innerText = 0;
    } else {
      wp.innerText = Math.floor((gwn / gpn) * 100).toString();
    }

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

    if (firstTime) {
      document.getElementById("settings_modal").classList.remove("active");
      document.getElementById("overlay").classList.remove("active");
      firstTime = false;
      if (clicked != "practice") {
        startPrompt();
      }
    } else {
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
    document.getElementById("share_button").addEventListener("touchstart", shareScore);
    document.getElementById("start_button").addEventListener("click", gameSetup);
    document.getElementById("start_button").addEventListener("click", closeModal);
    document.getElementById("practice_button").addEventListener("click", practiceSetup);
    document.getElementById("practice_button").addEventListener("click", closeModal);
    document.getElementById("practice_button_02").addEventListener("click", practiceSetup);
    document.getElementById("practice_button_02").addEventListener("click", function() { closeModal("practice") }, false);

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

    fillGrid();

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
      document.getElementById("cp06").style.backgroundColor = "white";
      document.getElementById("reset_button").src = "icons/reset_light.png";
      document.getElementById("highlight_button").src = "icons/highlight_light.png";
      document.getElementById("settings_button").src = "icons/settings_light.png";
      document.getElementById("scores_button").src = "icons/scores_light.png";
      if (document.getElementById("time")) {
        document.getElementById("time").style.color = "black";
      }

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
      document.getElementById("rules_check_01").style.color = "white";

      document.getElementById("rules_container_02").style.backgroundColor = "white";
      document.getElementById("rules_container_02").style.borderTop = "1px solid black";
      document.getElementById("rules_text_02").style.color = "black";

      document.getElementById("rules_container_03").style.backgroundColor = "white";
      document.getElementById("rules_container_03").style.borderTop = "1px solid black";
      document.getElementById("rules_text_03").style.color = "black";

      document.getElementById("rules_container_04").style.backgroundColor = "white";
      document.getElementById("rules_container_04").style.borderTop = "1px solid black";
      document.getElementById("rules_text_04").style.color = "black";

      document.getElementById("check_container").style.color = "white";
      document.getElementById("rules_bottom_row").style.backgroundColor = "white";
      document.getElementById("rules_dots").style.backgroundColor = "white";
      document.getElementById("rules_dot_01").style.backgroundColor = "black";
      document.getElementById("rules_dot_02").style.backgroundColor = "black";
      document.getElementById("rules_dot_03").style.backgroundColor = "black";
      document.getElementById("rules_dot_04").style.backgroundColor = "black";
      document.getElementById("left_arrow").src = "icons/left_light.png";
      document.getElementById("right_arrow").src = "icons/right_light.png";

      document.getElementById("practice_container_02").style.backgroundColor = "white";
      document.getElementById("practice_container_02").style.borderTop = "1px solid black";
      document.getElementById("practice_intro_02").style.color = "black";

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
      document.getElementById("practice_container").style.backgroundColor = "white";
      document.getElementById("practice_container").style.borderTop = "1px solid black";
      document.getElementById("practice_intro").style.color = "black";

      document.getElementById("warning01").style.color = "black";
      document.getElementById("warning02").style.color = "black";

    } else {
      // main game
      document.getElementById("container").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("header").style.borderBottom = "1px solid gray";
      document.getElementById("title").style.color = "white";
      document.getElementById("cp05").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("cp06").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("reset_button").src = "icons/reset_dark.png";
      document.getElementById("highlight_button").src = "icons/highlight_dark.png";
      document.getElementById("settings_button").src = "icons/settings_dark.png";
      document.getElementById("scores_button").src = "icons/scores_dark.png";
      if (document.getElementById("time")) {
        document.getElementById("time").style.color = "white";
      }

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
      document.getElementById("rules_check_01").style.color = style.getPropertyValue('--dark-mode-black');

      document.getElementById("rules_container_02").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("rules_container_02").style.borderTop = "1px solid gray";
      document.getElementById("rules_text_02").style.color = "white";

      document.getElementById("rules_container_03").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("rules_container_03").style.borderTop = "1px solid gray";
      document.getElementById("rules_text_03").style.color = "white";

      document.getElementById("rules_container_04").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("rules_container_04").style.borderTop = "1px solid gray";
      document.getElementById("rules_text_04").style.color = "white";

      document.getElementById("check_container").style.color = style.getPropertyValue('--dark-mode-black');
      document.getElementById("rules_bottom_row").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("rules_dots").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("rules_dot_01").style.backgroundColor = "white";
      document.getElementById("rules_dot_02").style.backgroundColor = "white";
      document.getElementById("rules_dot_03").style.backgroundColor = "white";
      document.getElementById("rules_dot_04").style.backgroundColor = "white";
      document.getElementById("left_arrow").src = "icons/left_dark.png";
      document.getElementById("right_arrow").src = "icons/right_dark.png";

      document.getElementById("practice_container_02").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("practice_container_02").style.borderTop = "1px solid gray";
      document.getElementById("practice_intro_02").style.color = "white";

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
      document.getElementById("practice_container").style.backgroundColor = style.getPropertyValue('--dark-mode-black');
      document.getElementById("practice_container").style.borderTop = "1px solid gray";
      document.getElementById("practice_intro").style.color = "white";

      document.getElementById("warning01").style.color = "white";
      document.getElementById("warning02").style.color = "white";
    }

    choosePalette(window.localStorage.getItem("userPalette"));
    fillGrid();
    chooseColor(currentColor);
  }

  function blurScreen() {

    if (activeGame) {

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
  }

  function focusScreen() {

    if (activeGame) {
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
  }

  function startPrompt() {

    document.getElementById("start_modal").classList.add("active");
    document.getElementById("overlay").classList.add("active");
    document.getElementById("cardinal_intro").innerText = "cardinal #" + index.toString();

    ts = Number(window.localStorage.getItem("timeSpent"));
    if (ts != 0) {
      document.getElementById("start_button").innerText = "continue";
    }

    blurScreen();
  }

  function beginColor() {

    if (activeGame) {
      drag = true;
      if (highlighted) {
        setCompasses(false);
        highlighted = false;
      }
    }

  }

  function endColor() {
    if (activeGame) {
      drag = false;
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          clicked[i][j] = 0;
        }
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

    if (activeGame) {
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
      if (!practice) {
        window.localStorage.setItem("gridProgress", JSON.stringify(grid));
      }
    }
  }

  function highlight() {

    if (activeGame) {
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
  }

  function didWin() {

    if (activeGame) {
      if (!practice) {
        window.localStorage.setItem("gridProgress", JSON.stringify(grid));
      }

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

          if (practice) {
            timer.stop();
            gameWon = true;
            gameWonCleanup();
          } else {
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
    }
  }

  function fillGrid() {

    if (practice) {
      for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
          sq = document.getElementById((x + (5 * y) + 1).toString());
          if (grid[x][y] == 0) {
            if (colorMode == "light") {
              sq.style.backgroundColor = "white";
              sq.style.border = "2px solid black";
            } else {
              sq.style.backgroundColor = style.getPropertyValue('--dark-mode-black');
              sq.style.border = "2px solid gray"
            }
          } else {
            sq.style.backgroundColor = style.getPropertyValue('--color' + grid[x][y]);
            sq.style.border = "2px solid " + style.getPropertyValue('--color' + grid[x][y]);
          }
        }
      }
    } else {
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
  }

  function gameWonCleanup() {

    activeGame = false;

    if (!practice) {
      document.getElementById("share_container").classList.add("active");
      window.localStorage.setItem("todayWon", "1");
    }

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

    if (!practice) {
      setTimeout(scoresMenu, 2200);
    } else {
      setTimeout(startPrompt, 2200);
    }

  }

  function shareScore() {

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

    shareString = `cardinal #${index.toString()} — ${timeSpent}
${scoreString}

https://cornbread.games`;

    hasTouchScreen = false;
    if ("maxTouchPoints" in navigator) {
      hasTouchScreen = navigator.maxTouchPoints > 0;
    } else if ("msMaxTouchPoints" in navigator) {
      hasTouchScreen = navigator.msMaxTouchPoints > 0;
    }

    if (navigator.share && hasTouchScreen) {
      navigator.share({
        text: shareString
      })
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareString);
      document.getElementById("clipboard_copy").innerText = "copied to clipboard";
    } else {
      document.getElementById("clipboard_copy").innerText = "error copying score";
    }
  }

  function getScore(t) {

    offset = blanks.length * 30;
    t01 = 60 + offset;
    t02 = 150 + (offset * 1.5);
    t03 = 300 + (offset * 2);
    t04 = 600 + (offset * 3);

    if (t <= t01) {
      stars = 5;
    } else if (t > t01 && t <= t02) {
      stars = 4;
    } else if (t > t02 && t <= t03) {
      stars = 3;
    } else if (t > t03 && t <= t04) {
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

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

  function shapeChecker(x, y) {
    shapes = [];
    if (checkDirection(y, "N") && checkDirection(x, "E")) {
      if (grid[x][y-1] == 0 && grid[x+1][y] == 0) {
        shapes.push(1);
      }
    }
    if (checkDirection(y, "S") && checkDirection(x, "E")) {
      if (grid[x][y+1] == 0 && grid[x+1][y] == 0) {
        shapes.push(2);
      }
    }
    if (checkDirection(y, "S") && checkDirection(x, "W")) {
      if (grid[x][y+1] == 0 && grid[x-1][y] == 0) {
        shapes.push(3);
      }
    }
    if (checkDirection(y, "N") && checkDirection(x, "W")) {
      if (grid[x][y-1] == 0 && grid[x-1][y] == 0) {
        shapes.push(4);
      }
    }
    if (checkDirection(y, "N") && checkDirection(y, "S")) {
      if (grid[x][y-1] == 0 && grid[x][y+1] == 0) {
        shapes.push(5);
      }
    }
    if (checkDirection(x, "E") && checkDirection(x, "W")) {
      if (grid[x+1][y] == 0 && grid[x-1][y] == 0) {
        shapes.push(6);
      }
    }
    return shapes;

  }

  function drawShape(x, y, c, s) {
    grid[x][y] = c;
    switch(s) {
      case 1:
        grid[x][y-1] = c;
        grid[x+1][y] = c;
        break;
      case 2:
        grid[x][y+1] = c;
        grid[x+1][y] = c;
        break;
      case 3:
        grid[x][y+1] = c;
        grid[x-1][y] = c;
        break;
      case 4:
        grid[x][y-1] = c;
        grid[x-1][y] = c;
        break;
      case 5:
        grid[x][y-1] = c;
        grid[x][y+1] = c;
        break;
      case 6:
        grid[x+1][y] = c;
        grid[x-1][y] = c;
        break;
      default:
        console.log("oops!");
    }
  }

  function randCompasses() {
    setC = 0;
    while (setC < 4) {
      x = randInt(0, 4);
      y = randInt(0, 4);
      shapes = shapeChecker(x, y);
      if (grid[x][y] == 0 && shapes.length > 0) {
        randex = randInt(0, (shapes.length - 1));
        shape = shapes[randex];
        setC += 1;
        drawShape(x, y, setC, shape);
        comp = [x,y];
        nesw = [0,0,0,0];
        cors.push(comp);
        compassNESW.push(nesw);
      }
    }
  }

  function availableSpots() {
    n = 0;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (grid[i][j] == 0) {
          n += 1;
        }
      }
    }
    return n;
  }

  function getAvailableSq(i) {

    n = 0;
    for (let x = 0; x < 5; x++)  {
      for (let y = 0; y < 5; y++) {
        if (grid[x][y] == 0) {
          n += 1;
          if (n == i) {
            return [x,y];
          }
        }
      }
    }
  }

  function getAdjacentColors(x, y) {
    adjacentColors = [];
    if (checkDirection(y, "N")) {
      if (grid[x][y-1] != 0) {
        adjacentColors.push(grid[x][y-1]);
      }
    }
    if (checkDirection(x, "E")) {
      if (grid[x+1][y] != 0) {
        adjacentColors.push(grid[x+1][y]);
      }
    }
    if (checkDirection(y, "S")) {
      if (grid[x][y+1] != 0) {
        adjacentColors.push(grid[x][y+1]);
      }
    }
    if (checkDirection(x, "W")) {
      if (grid[x-1][y] != 0) {
        adjacentColors.push(grid[x-1][y]);
      }
    }
    return adjacentColors;
  }

  function randPuzzle() {

    colorCounts = [0,0,0,0];
    spots = availableSpots();
    while (spots > 0) {
      spot = randInt(1, spots);
      sqCors = getAvailableSq(spot);
      sqx = sqCors[0];
      sqy = sqCors[1];
      adjacentColors = getAdjacentColors(sqx, sqy);
      if (adjacentColors.length == 1) {
        c = adjacentColors[0];
        grid[sqx][sqy] = c;
        colorCounts[c-1] += 1;
      } else if (adjacentColors.length > 1) {
        min = colorCounts[adjacentColors[0] - 1];
        mindex = 0;
        for (let i = 1; i < adjacentColors.length; i++) {
          c = colorCounts[adjacentColors[i] - 1];
          if (c < min) {
            min = c;
            mindex = i;
          }
        }
        c = adjacentColors[mindex];
        grid[sqx][sqy] = c;
        colorCounts[c-1] += 1;
      }
      spots = availableSpots();
    }
  }
});
