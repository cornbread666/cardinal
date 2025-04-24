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

let PAGE_NUMBER = 0;
let docBody = document.body;
let HORSEY = document.getElementById("horse_piece");

let mazeCanvas = document.getElementById("maze_canvas");
let mazeCtx;

let sigCanvas = document.getElementById("signature_canvas");
let sigCtx;

let timer = new Timer();
var timerInterval;

const drakeListenerConfig = { attributes: false, childList: true, subtree: false };
const drakeCallback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        checkDrakeDescriptions();
      }
    }
};
const drakeObserver = new MutationObserver(drakeCallback);
drakeObserver.observe(document.getElementById("drake_subgrid2"), drakeListenerConfig);
let EXIT_DRAKE = false;
let VALID_MAZE_START = false;
let VALID_MAZE_END = false;
let VALID_SIG_START = false;
let VALID_SIG_END = false;
let MAZE_DRAG_PTS = [];
let SIG_DRAG_PTS = [];
let MAKEOVER_STYLE_CHOICES = {"hair": 1, "eyes": 1, "misc": 1};
let MAKEOVER_STYLE_MAX = [5, 3, 5];
let MAKEOVER_COLOR_CHOICES = {"skin": 1, "hair": 1, "brows": 1, "eyes": 1, "mouth": 1};
let MAKEOVER_COLOR_MAX = [5, 15, 5, 10, 5];

let PROGRESS_BAR = 2;
let PROGRESS_INTERVAL;

// TUMBLEWEED VARIABLES
let TEACHER_NAME = "";
let VALID_HORSE = false;
let ORIGINAL_SEASON = "";
let FAVE_SEASON = "";
let TILES_LENGTH = 0;
let CRUSH_NAME = "";
let INKBLOT_ANSWER = "";
let CHEESE_PILLED = false;
let CLIQUE = "";
let COLOR_PREFERENCES = {"red": 0, "pink": 0, "orange": 0, "yellow": 0, "green": 0,
                        "blue": 0, "purple": 0, "brown": 0};
// PALETTES - DARK TO LIGHT
let RED_PALETTES = [["#6B0F1A", "#F4A261", "#EFB366"], ["#2B2118", "#6F1A07", "#A8763E"], ["#841C26", "#A82443", "#EDB88B"],
["#4E0110", "#881600", "#DEA47E"], ["#A92723", "#DE6449", "#FAC9B8"], ["#5D0B09", "#DB4C40", "#E59500"],
["#590004", "#A50104", "#F2B202"], ["#420C14", "#732C2C", "#E2C290"], ["#AB3428", "#F49E4C", "#F5EE9E"]];

let PINK_PALETTES = [["#93032E", "#FF420E", "#F98866"], ["#CA6680", "#D57A66", "#EDC79B"], ["#FBAF00", "#FFD639", "#FFA3AF"],
["#250902", "#38040E", "#C83E4D"], ["#E15A97", "#EEABC4", "#6FBCEC"]];

let ORANGE_PALETTES = [["#46211A", "#A43820", "#CD6E51"], ["#D95D39", "#F18805", "#F0A202"], ["#313628", "#A3320B", "#FF9B42"],
["#33261D", "#C44900", "#FFEECF"], ["#CC5803", "#1F1300", "#FFC15E"], ["#644536", "#BA3F1D", "#A77E58"],
["#972139", "#663D49", "#E0913E"], ["#B64600", "#F3A712", "#F0CEA0"], ["#2F2504", "#A63C06", "#EC9F05"]];

let YELLOW_PALETTES = [["#AB3428", "#F26419", "#FCCA46"], ["#C36F09", "#EEBA0B", "#EDA296"], ["#C73E1D", "#FFC100", "#FFEAAE"],
["#823200", "#E09891", "#F2BB05"], ["#694A38", "#303E28", "#F4AC45"], ["#D8572A", "#DB7C26", "#EEE3AB"],
["#3A4422", "#E26D5C", "#FFBF47"], ["#432E36", "#5F4842", "#EFC88B"], ["#452103", "#690500", "#EDAE49"]];

let GREEN_PALETTES = [["#262A10", "#598234", "#D4B483"], ["#918450", "#FFB563", "#FFD29D"], ["#243E36", "#7CA982", "#E0EEC6"],
["#065143", "#129490", "#70B77E"], ["#CAF2EF", "#C9EFDC", "#D8F2BB"]];

let BLUE_PALETTES = [["#69DDFF", "#96CDFF", "#D8E1FF"], ["#A5D8FF", "#87BAAB", "#F4BFDB"], ["#0B3954", "#087E8B", "#BFD7EA"],
["#279AF1", "#23B5D3", "#F4C95D"], ["#004777", "#97DFFC", "#1982C4"]];

let PURPLE_PALETTES = [["#210B2C", "#55286F", "#BC96E6"], ["#564592", "#CA7DF9", "#F896D8"], ["#F99FBC", "#D29DB8", "#ACA1CE"],
["#832388", "#E3436B", "#F0772F"], ["#CA7DF9", "#F896D8", "#EDF67D"]];

let BROWN_PALETTES = [["#0A0903", "#7E3B10", "#FFC100"], ["#763626", "#16302B", "#F1C17E"], ["#4C230A", "#A53F2B", "#FEB95F"],
["#472C1B", "#B76D68", "#DBCFB0"], ["#3F4739", "#8C5E58", "#F1BF98"], ["#533E2D", "#709176", "#EDB88B"],
["#854D27", "#2E1F27", "#DD7230"], ["#826754", "#AD5D4E", "#E8D2AE"], ["#251605", "#5C1A1B", "#A16017"]];

let SPRING_PALETTE = ["#F49097", "#FED766", "#DFB2F4", "#F2F5FF", "#55D6C2", "#336699"];
let SUMMER_PALETTE = ["#086788", "#07A0C3", "#F0C808", "#FFF1D0", "#DD1C1A", "#BEB2C8"];
let AUTUMN_PALETTE = ["#2E1F27", "#854D27", "#244F26", "#90A959", "#DD7230", "#F4E3B2"];
let WINTER_PALETTE = ["#B1F8F2", "#BCD39C", "#FFFC99", "#EAFDCF", "#8E8358", "#5E0B15"];

let FINAL_TW_PALETTE;
let FINAL_BG_PALETTE;
let FINAL_DT_PALETTE;

intro();

function intro() {
    document.getElementById("play_triangle").addEventListener("click", introBlurb);
    document.getElementById("intro_triangle").addEventListener("click", startQuiz);
    document.getElementById("stats_button").addEventListener("click", showStats);
    document.getElementById("modal_overlay").addEventListener("click", closeModal);
    document.getElementById("home_button").addEventListener("click", (e) => { window.open("https://cornbread.games/home", "_blank").focus(); });

    let questionPages = document.getElementsByClassName("answer triangle");
    for (let i = 0; i < questionPages.length; i++) {
        questionPages[i].addEventListener("click", nextPage);
    }

    let letterTiles = document.getElementsByClassName("letter_tile");
    for (let i = 0; i < letterTiles.length; i++) {
        letterTiles[i].addEventListener("click", letterTileSwapper);
    }

    let makeoverArrows = document.getElementsByClassName("makeover triangle");
    for (let i = 0; i < makeoverArrows.length; i++) {
        makeoverArrows[i].addEventListener("click", makeoverScroll);
    }

    HORSEY.onpointerdown = beginChessDrag;
    HORSEY.onpointerup = stopChessDrag;

    mazeCanvas.onpointerdown = beginMazeDrag;
    mazeCanvas.onpointerup = stopMazeDrag;

    sigCanvas.onpointerdown = beginSigDrag;
    sigCanvas.onpointerup = stopSigDrag;
    sigCanvas.setAttribute('width', window.innerWidth * 0.8);
    sigCanvas.setAttribute('height', window.innerHeight * 0.3);

    Sortable.create(document.getElementById("drake_subgrid2"), {
        swap: true,
        swapClass: 'drake_highlight',
        handle: ".drake_desc",
        filter: ".drake_filter",
        animation: 150
    });

    let drakeDescriptions = document.getElementsByClassName("drake_desc");
    for (let i = 0; i < drakeDescriptions.length; i++) {
        drakeDescriptions[i].onpointerup = checkDrakeDescriptions;
    }

    //loadPage(21);

    /*
    localStorage.removeItem("quizCompleted");
    localStorage.removeItem("twImage");
    localStorage.removeItem("bgPalette");
    localStorage.removeItem("dtPalette");
    localStorage.removeItem("twPalette");
    localStorage.removeItem("colorPrefs");
    */

    let completed = window.localStorage.getItem("quizCompleted");
    if (completed) {
        document.getElementById("title_page").replaceChildren();
        loadTumbleweed();
    }
}

function loadTumbleweed() {
    loadPage(22);

    let twimg = localStorage.getItem("twImage");
    FINAL_BG_PALETTE = JSON.parse(localStorage.getItem("bgPalette"));
    FINAL_DT_PALETTE = JSON.parse(localStorage.getItem("dtPalette"));
    FINAL_TW_PALETTE = JSON.parse(localStorage.getItem("twPalette"));
    COLOR_PREFERENCES = JSON.parse(localStorage.getItem("colorPrefs"));

    let backgroundp5 = new p5(backgroundSketch);
    let dotsp5 = new p5(dotSketch);
    let grainp5 = new p5(grainSketch);

    let ti = document.createElement("img");
    ti.id = "tumbleweed";
    ti.src = twimg;
    document.getElementById("tumbleweed_container").appendChild(ti);

    populateStats();

    setTimeout(function() {
        document.getElementById("header").style.display = "flex";
        document.getElementById("stats_button").classList.add("menu_button_animate");
        document.getElementById("home_button").classList.add("menu_button_animate");
    }, 5000);
}

function beginChessDrag(e) {
    HORSEY.onpointermove = chessDrag;
    HORSEY.setPointerCapture(e.pointerId);
}

function stopChessDrag(e) {
    HORSEY.onpointermove = null;
    HORSEY.releasePointerCapture(e.pointerId);
    let targetElements = document.elementsFromPoint(e.clientX, e.clientY);
    let targetFound = false;
    for (let i = 0; i < targetElements.length; i++) {

        let te = targetElements[i];
        if (te.classList.contains("chess_square") && te !== HORSEY.parentNode) {
            targetFound = true;
            HORSEY.parentNode.removeChild(HORSEY);
            HORSEY.onpointerdown = null;
            te.appendChild(HORSEY);
            HORSEY.style.position = 'relative';
            HORSEY.style.left = "0";
            HORSEY.style.top = "0";

            if (te.id === "chess_square12" || te.id === "chess_square14" || te.id === "chess_square21" || te.id === "chess_square41") {
                document.getElementById("chessmove_prompt").innerText = "nerd...";
                VALID_HORSE = true;
            }

            if (VALID_HORSE) {
                COLOR_PREFERENCES["brown"] += randomFromRange(50, 100);
            } else {
                COLOR_PREFERENCES["green"] += randomFromRange(50, 100);
            }

            document.getElementById("chessmove_prompt").style.opacity = "1";
            nextPage(e);
        }
    }

    if (!targetFound) {
        HORSEY.style.position = 'relative';
        HORSEY.style.left = "0";
        HORSEY.style.top = "0";
    }
}

function chessDrag(e) {
    e.target.style.position = "absolute";
    e.target.style.left = `${e.clientX-20}px`;
    e.target.style.top = `${e.clientY-20}px`;
}

function beginMazeDrag(e) {

    mazeCanvas.setAttribute('width', document.getElementById("maze").getBoundingClientRect().width);
    mazeCanvas.setAttribute('height', document.getElementById("maze").getBoundingClientRect().height);
    mazeCtx = mazeCanvas.getContext("2d");

    MAZE_DRAG_PTS.push([e.offsetX, e.offsetY]);
    mazeCanvas.onpointermove = mazeDrag;
    mazeCanvas.setPointerCapture(e.pointerId);

    let targetElements = document.elementsFromPoint(e.clientX, e.clientY);
    for (let i = 0; i < targetElements.length; i++) {
        let te = targetElements[i];
        if (te.id === ("maze_start_square")) {
            VALID_MAZE_START = true;
        }
    }
}

function stopMazeDrag(e) {
    mazeCanvas.onpointermove = null;
    mazeCanvas.releasePointerCapture(e.pointerId);

    let targetElements = document.elementsFromPoint(e.clientX, e.clientY);
    for (let i = 0; i < targetElements.length; i++) {
        let te = targetElements[i];
        if (te.id === ("maze_end_square")) {
            VALID_MAZE_END = true;
        } else if (te.id === ("maze_cheese_square")) {
            CHEESE_PILLED = true;
            VALID_MAZE_END = true;
        }
    }

    clearMazeLine(VALID_MAZE_START && VALID_MAZE_END);

    if (VALID_MAZE_START && VALID_MAZE_END) {
        nextPage(e);
    } else {
        VALID_MAZE_START = false;
        VALID_MAZE_END = false;
        CHEESE_PILLED = false;
        MAZE_DRAG_PTS = [];
    }
}

function mazeDrag(e) {

    let targetElements = document.elementsFromPoint(e.clientX, e.clientY);
    for (let i = 0; i < targetElements.length; i++) {
        let te = targetElements[i];
        if (te.id === ("maze_cheese_square")) {
            CHEESE_PILLED = true;
        }
    }

    MAZE_DRAG_PTS.push([e.offsetX, e.offsetY]);
    drawMazeLine(false);
}

function drawMazeLine(winner) {

    mazeCtx.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);

    mazeCtx.beginPath();
    mazeCtx.lineWidth = winner ? "6" : "4";
    mazeCtx.strokeStyle = winner ? "#70d863" : "#f4c67f";
    let start = MAZE_DRAG_PTS[0];
    mazeCtx.moveTo(start[0], start[1]);

    for (let i = 1; i < MAZE_DRAG_PTS.length; i++) {
        let point = MAZE_DRAG_PTS[i];
        mazeCtx.lineTo(point[0], point[1]);
    }

    mazeCtx.stroke();
}

function clearMazeLine(success) {

    if (success) {
        drawMazeLine(true);
    } else {
        mazeCtx.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);
    }

}

function introBlurb() {
    document.getElementById("title_page").classList.add("page_fly_out");
    setTimeout(function() {
        document.getElementById("title_page").style.display = "none";
        document.getElementById("intro_page").classList.add("page_fly_in");
    }, 1001);
}

function startQuiz() {
    document.getElementById("intro_page").classList.add("page_fly_out");
    setTimeout(function() {
        document.getElementById("intro_page").style.display = "none";
        document.getElementById("page1").classList.add("page_fly_in");
    }, 1001);
    PAGE_NUMBER = 1;
    timer.start();
}

function endQuiz() {

    PROGRESS_INTERVAL = setInterval(fillProgress, 50);
    document.getElementById("page21").onanimationend = (e) => {
        if (e.animationName === "fadeout") {
            document.getElementById("page21").style.display = "none";
            document.getElementById("page22").style.display = "flex";
            generateTumbleweed();
        }
    }
}

function fillProgress() {

    let progressFill = document.getElementById("progress_fill");

    let randNum = Math.random()
    if (randNum >= 0.5) {
        PROGRESS_BAR = PROGRESS_BAR + 1;
        progressFill.style.width = `${PROGRESS_BAR}%`;
    }

    if (PROGRESS_BAR >= 100) {
        clearInterval(PROGRESS_INTERVAL);
        progressFill.classList.add("complete");
        progressFill.ontransitionend = () => {
            document.getElementById("page21").classList.add("fadeout");
        }
    }
}

function generateTumbleweed() {

    var keys = [];
    var values = [];

    for (const [key, value] of Object.entries(COLOR_PREFERENCES)) {
        keys.push(key);
        if (value === 0) {
            let newNum = randomFromRange(0, 100);
            COLOR_PREFERENCES[key] = newNum;
            values.push(newNum);
        } else {
            values.push(value);
        }
    }
    for (let i = 0; i < keys.length; i++) {
        var currentMin = values[i];
        var currentInd = i;
        for (let j = i+1; j < keys.length; j++) {
            if (values[j] < currentMin) {
                currentMin = values[j];
                currentInd = j;
            }
        }
        if (currentInd != i) {
            let tmpKey = keys[i];
            let tmpValue = values[i];
            keys[i] = keys[currentInd];
            values[i] = values[currentInd];
            keys[currentInd] = tmpKey;
            values[currentInd] = tmpValue;
        }
    }

    console.log(`top colors: ${keys[keys.length-1]}, ${keys[keys.length-2]}, ${keys[keys.length-3]}`);

    var tw_chosen = false;
    var bg_chosen = false;

    for (let x = keys.length-1; x >= 0; x--) {
        console.log(keys[x]);
        if (!tw_chosen && keys[x] === "red") {
            console.log("red tumbleweed");
            FINAL_TW_PALETTE = RED_PALETTES[Math.floor(Math.random() * RED_PALETTES.length)];
            tw_chosen = true;
        }
        if (!tw_chosen && keys[x] === "orange") {
            console.log("orange tumbleweed");
            FINAL_TW_PALETTE = ORANGE_PALETTES[Math.floor(Math.random() * ORANGE_PALETTES.length)];
            tw_chosen = true;
        }
        if (!tw_chosen && keys[x] === "yellow") {
            console.log("yellow tumbleweed");
            FINAL_TW_PALETTE = YELLOW_PALETTES[Math.floor(Math.random() * YELLOW_PALETTES.length)];
            tw_chosen = true;
        }
        if (!tw_chosen && keys[x] === "brown") {
            console.log("brown tumbleweed");
            FINAL_TW_PALETTE = BROWN_PALETTES[Math.floor(Math.random() * BROWN_PALETTES.length)];
            tw_chosen = true;
        }
        if (!bg_chosen && keys[x] === "pink") {
            console.log("pink background");
            FINAL_BG_PALETTE = PINK_PALETTES[Math.floor(Math.random() * PINK_PALETTES.length)];
            bg_chosen = true;
        }
        if (!bg_chosen && keys[x] === "green") {
            console.log("green background");
            FINAL_BG_PALETTE = GREEN_PALETTES[Math.floor(Math.random() * GREEN_PALETTES.length)];
            bg_chosen = true;
        }
        if (!bg_chosen && keys[x] === "blue") {
            console.log("blue background");
            FINAL_BG_PALETTE = BLUE_PALETTES[Math.floor(Math.random() * BLUE_PALETTES.length)];
            bg_chosen = true;
        }
        if (!bg_chosen && keys[x] === "purple") {
            console.log("purple background");
            FINAL_BG_PALETTE = PURPLE_PALETTES[Math.floor(Math.random() * PURPLE_PALETTES.length)];
            bg_chosen = true;
        }
    }

    if (ORIGINAL_SEASON === "spring") {
        FINAL_DT_PALETTE = SPRING_PALETTE;
        console.log("spring dots");
    }
    if (ORIGINAL_SEASON === "summer") {
        FINAL_DT_PALETTE = SUMMER_PALETTE;
        console.log("summer dots");
    }
    if (ORIGINAL_SEASON === "autumn") {
        FINAL_DT_PALETTE = AUTUMN_PALETTE;
        console.log("autumn dots");
    }
    if (ORIGINAL_SEASON === "winter") {
        FINAL_DT_PALETTE = WINTER_PALETTE;
        console.log("winter dots");
    }

    let tumbleweedp5 = new p5(tumbleweedSketch);
    let backgroundp5 = new p5(backgroundSketch);
    let dotsp5 = new p5(dotSketch);
    let grainp5 = new p5(grainSketch);

    document.getElementById("tumbleweed_canvas").toBlob((blob) => {
        let ti = document.createElement("img");
        twURL = URL.createObjectURL(blob);
        ti.id = "tumbleweed";
        ti.src = twURL;
        window.localStorage.setItem("twImage", twURL);
        document.getElementById("tumbleweed_canvas").style.display = "none";
        document.getElementById("tumbleweed_container").appendChild(ti);
    });

    window.localStorage.setItem("quizCompleted", true);
    window.localStorage.setItem("bgPalette", JSON.stringify(FINAL_BG_PALETTE));
    window.localStorage.setItem("dtPalette", JSON.stringify(FINAL_DT_PALETTE));
    window.localStorage.setItem("twPalette", JSON.stringify(FINAL_TW_PALETTE));
    window.localStorage.setItem("colorPrefs", JSON.stringify(COLOR_PREFERENCES));

    populateStats();

    setTimeout(function() {
        document.getElementById("header").style.display = "flex";
        document.getElementById("stats_button").classList.add("menu_button_animate");
        document.getElementById("home_button").classList.add("menu_button_animate");
    }, 5000);
        
}

function populateStats() {

    console.log(COLOR_PREFERENCES);

    let radarCtx = document.getElementById("radar_chart");

    let data = {
        labels: [
            "Boisterism", // Yellow
            "Logistance", // Green
            "Fangrosity", // Red
            "Ambigen", // Orange
            "Grell", // Purple
            "Synesthettes", // Pink
            "Prolowning", // Brown
            "Mattriness" // Blue
        ],
        datasets: [{
            label: "Qualities",
            data: [COLOR_PREFERENCES["yellow"], COLOR_PREFERENCES["green"], COLOR_PREFERENCES["red"], COLOR_PREFERENCES["orange"],
                COLOR_PREFERENCES["purple"], COLOR_PREFERENCES["pink"], COLOR_PREFERENCES["brown"], COLOR_PREFERENCES["blue"]],
            fill: true,
            tension: 0.1,
            backgroundColor: FINAL_TW_PALETTE[2],
            borderColor: FINAL_TW_PALETTE[0],
            pointBackgroundColor: FINAL_TW_PALETTE[0],
            pointBorderColor: "#FFFFFF",
            pointHoverBackgroundColor: "#FFFFFF",
            pointHoverBorderColor: FINAL_TW_PALETTE[0]
        }]
    };

    let config = {
        type: "radar",
        data: data,
        options: {
            elements: {
                line: {
                    borderWidth: 1
                }
            },
            scales: {
                r: {
                    grid: {
                        circular: true
                    },
                    ticks: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    }

    new Chart(radarCtx, config);
}

function lockAnswer(event) {
    let basename = event.target.id.slice(0, -1);
    let nodeList = document.querySelectorAll(`[id^="${basename}"]`);
    nodeList.forEach((n) => {
        n.removeEventListener("click", nextPage);
    });
}

function updateColorPreferences(ele) {

    timer.stop();
    let score = Math.min(Math.max(100 - (timer.getTime() / 1000), 0), 100);

    let cList = ele.classList;
    if (cList.contains("red")) {
        COLOR_PREFERENCES["red"] += score;
    }
    if (cList.contains("pink")) {
        COLOR_PREFERENCES["pink"] += score;
    }
    if (cList.contains("orange")) {
        COLOR_PREFERENCES["orange"] += score;
    }
    if (cList.contains("yellow")) {
        COLOR_PREFERENCES["yellow"] += score;
    }
    if (cList.contains("green")) {
        COLOR_PREFERENCES["green"] += score;
    }
    if (cList.contains("blue")) {
        COLOR_PREFERENCES["blue"] += score;
    }
    if (cList.contains("purple")) {
        COLOR_PREFERENCES["purple"] += score;
    }
    if (cList.contains("brown")) {
        COLOR_PREFERENCES["brown"] += score;
    }
}

function nextPage(event) {

    let validAnswer = true;

    if (event.target.classList.contains("answer") && event.target.classList.contains("triangle")) {

        if (event.target.classList.contains("tiles")) {

            let tc2 = document.getElementById("tile_container2");
            let answerTiles = tc2.childNodes;

            console.log(answerTiles.length);

            if (answerTiles.length > 0) {
                TILES_LENGTH = answerTiles.length;
                event.target.removeEventListener("click", nextPage);
                tc2.classList.add("selected_option");
                var inputWord = "";
                for (let i = 0; i < answerTiles.length; i++) {
                    inputWord = inputWord + answerTiles[i].innerText;
                }
                if (inputWord === "ABDICATES") {
                    document.getElementById("tile_prompt").innerText = "take it easy..."
                }
                document.getElementById("tile_prompt").style.opacity = "1";
            } else {
                validAnswer = false;
            }
        } else if (PAGE_NUMBER === 2) { // TEACHERS
            let t = event.target.id.slice(-1);
            TEACHER_NAME = document.getElementById(`prompt2_answer${t}`).innerText;
            lockAnswer(event);
            event.target.parentNode.classList.add("selected_option");
        } else if (PAGE_NUMBER === 5) { // CRUSH
            let c = document.getElementById("crush_input").value;
            if (c.length > 0) {
                CRUSH_NAME = c;
                lockAnswer(event);
                event.target.parentNode.classList.add("selected_option");
            } else {
                validAnswer = false;
            }
        } else if (PAGE_NUMBER === 8) { // SEASONS
            let tid = event.target.id;
            let tidSliced = tid.slice(0, -1);
            let tidNum = parseInt(tid.slice(-1));
            ORIGINAL_SEASON = document.getElementById(`prompt8_answer${tidNum}`).innerText;
            let newNum = Math.abs(tidNum - 4) + 1;
            FAVE_SEASON = document.getElementById(`prompt8_answer${newNum}`).innerText;
            lockAnswer(event);
            document.getElementById(tidSliced + newNum.toString()).parentNode.classList.add("selected_option");
        } else if (PAGE_NUMBER === 9) { // DRAKE
            let drakeOptions = document.getElementsByClassName("drake_desc");
            for (let i = 0; i < drakeOptions.length; i++) {
                drakeOptions[i].innerText = "QUITTER!";
                drakeOptions[i].classList.add("drake_filter");
            }
            event.target.parentNode.remove();
        } else if (PAGE_NUMBER === 14) {
            let t = parseInt(event.target.id.slice(-1));
            if (t === 1) {
                COLOR_PREFERENCES["blue"] += randomFromRange(50, 100);
                COLOR_PREFERENCES["purple"] += randomFromRange(50, 100);
            } else if (t === 2) {
                COLOR_PREFERENCES["orange"] += randomFromRange(50, 100);
                COLOR_PREFERENCES["yellow"] += randomFromRange(50, 100);
            } else if (t === 3) {
                COLOR_PREFERENCES["red"] += randomFromRange(50, 100);
                COLOR_PREFERENCES["pink"] += randomFromRange(50, 100);
            } else if (t === 4) {
                COLOR_PREFERENCES["green"] += randomFromRange(50, 100);
                COLOR_PREFERENCES["brown"] += randomFromRange(50, 100);
            }
            lockAnswer(event);
            event.target.parentNode.classList.add("selected_option");
        } else if (PAGE_NUMBER === 15) {
            let hairOption = MAKEOVER_COLOR_CHOICES["hair"];
            if (hairOption === 2 || hairOption === 3) {
                COLOR_PREFERENCES["yellow"] += randomFromRange(50, 100);
            } else if (hairOption === 4 || hairOption === 5 || hairOption === 6) {
                COLOR_PREFERENCES["brown"] += randomFromRange(50, 100);
            } else if (hairOption === 8 || hairOption === 9) {
                COLOR_PREFERENCES["red"] += randomFromRange(50, 100);
            } else if (hairOption === 10) {
                COLOR_PREFERENCES["orange"] += randomFromRange(50, 100);
            } else if (hairOption === 11) {
                COLOR_PREFERENCES["pink"] += randomFromRange(50, 100);
            } else if (hairOption === 12 || hairOption === 13) {
                COLOR_PREFERENCES["blue"] += randomFromRange(50, 100);
            } else if (hairOption === 14) {
                COLOR_PREFERENCES["purple"] += randomFromRange(50, 100);
            } else if (hairOption === 15) {
                COLOR_PREFERENCES["green"] += randomFromRange(50, 100);
            }
            lockAnswer(event);
            event.target.parentNode.classList.add("selected_option");
        } else if (PAGE_NUMBER === 16) {
            let ink = document.getElementById("inkblot_input").value;
            if (ink.length > 0) {
                INKBLOT_ANSWER = ink;
                lockAnswer(event);
                event.target.parentNode.classList.add("selected_option");
            } else {
                validAnswer = false;
            }
        }
        else {
            lockAnswer(event);
            event.target.parentNode.classList.add("selected_option");
        }
    }

    if (validAnswer) {

        updateColorPreferences(event.target);

        setTimeout(function() {
            document.getElementById("page" + PAGE_NUMBER.toString()).classList.add("page_fly_out");
        }, 800);

        setTimeout(function() {
            document.getElementById("page" + PAGE_NUMBER.toString()).style.display = "none";
            if (PAGE_NUMBER == 12 && !CHEESE_PILLED) {
                PAGE_NUMBER = PAGE_NUMBER + 1;
            }
            PAGE_NUMBER = PAGE_NUMBER + 1;
            document.getElementById("page" + PAGE_NUMBER.toString()).classList.add("page_fly_in");
        }, 1800);

        //window.scrollTo(0,0);
        if (PAGE_NUMBER === 2 || PAGE_NUMBER === 11 || PAGE_NUMBER === 18 || PAGE_NUMBER === 20 || PAGE_NUMBER === 21) { // setting no-scroll for chess, maze, & final page
            docBody.setAttribute("style", "touch-action: none");
        } else {
            docBody.setAttribute("style", "touch-action: auto");
        }
        
        //console.log(PAGE_NUMBER);

        if (PAGE_NUMBER === 17) {
            setTimeout(function() {
                plinko();
            }, 2000);
        }

        if (PAGE_NUMBER === 19) {
            setTimeout(function() {
                typewriter();
            }, 2000);
        }

        if (PAGE_NUMBER === 20) {
            setTimeout(function() {
                window.scrollTo(window.innerWidth/2, window.innerHeight/2);
                document.body.style.overflow = "hidden";
                endQuiz();
            }, 3000);
        }
        timer.reset();
        timer.start();
    }
}

function loadPage(p) {
    PAGE_NUMBER = p;
    document.getElementById("title_page").classList.add("page_fly_out");
    setTimeout(function() {
        document.getElementById("title_page").style.display = "none";
        document.getElementById("page" + PAGE_NUMBER.toString()).classList.add("page_fly_in");
    }, 1001);
    if (PAGE_NUMBER === 18) {
        setTimeout(function() {
            plinko();
        }, 2000);
    }
    if (PAGE_NUMBER === 21) {
        endQuiz();
    }
}

function letterTileSwapper(event) {

    let tile = event.target;
    let tc1 = document.getElementById("tile_container1");
    let tc2 = document.getElementById("tile_container2");

    if (tile.parentNode === tc1) {
        tc1.removeChild(tile);
        tc2.appendChild(tile);
    } else if (tile.parentNode === tc2) {
        tc2.removeChild(tile);
        tc1.appendChild(tile);
    }
}

function checkDrakeDescriptions() {

    let complete = true;

    let drakeContainer = document.getElementById("drake_subgrid2");

    let drakeDescriptions = Array.from(drakeContainer.children);
    for (let i = 0; i < drakeDescriptions.length; i++) {
        if (parseInt(drakeDescriptions[i].id.slice(-1)) === i+1) {
            if (!drakeDescriptions[i].classList.add("drake_filter")) {
                drakeDescriptions[i].classList.add("drake_filter");
            }
        } else {
            complete = false;
            if (drakeDescriptions[i].classList.contains("drake_filter")) {
                drakeDescriptions[i].classList.remove("drake_filter");
            }
        }
    }

    if (complete && !EXIT_DRAKE) {
        document.getElementById("prompt9_triangle1").removeEventListener("click", nextPage);
        EXIT_DRAKE = true;
        drakeObserver.disconnect();
        drakeContainer.addEventListener("build", nextPage);
        let e = new Event("build");
        drakeContainer.dispatchEvent(e);
    }
}

function makeoverScroll(event) {

    let tid = event.target.id;
    let col = parseInt(tid.slice(-3, -2));
    let row = parseInt(tid.slice(-1));
    let dir = tid.slice(-2, -1);
    let cur = "";
    let style = 1;
    let color = 1;
    
    if (col === 1) {
        cur = Object.keys(MAKEOVER_STYLE_CHOICES)[row-1];
        style = MAKEOVER_STYLE_CHOICES[cur];
        if (cur === "hair" || cur === "eyes") {
            color = MAKEOVER_COLOR_CHOICES[cur];
        }
    } else {
        cur = Object.keys(MAKEOVER_COLOR_CHOICES)[row-1];
        color = MAKEOVER_COLOR_CHOICES[cur];
        if (cur === "hair" || cur === "eyes") {
            style = MAKEOVER_STYLE_CHOICES[cur];
        }
    }

    let curID = cur + "_image";
    let curFile = document.getElementById(curID).src;
    //console.log(curID, style, color, col, row, dir, curFile);

    if (col === 1) {
        if (dir === "r") {
            if (style === MAKEOVER_STYLE_MAX[row-1]) {
                style = 1;
            } else {
                style = style + 1;
            }
        } else if (dir === "l") {
            if (style === 1) {
                style = MAKEOVER_STYLE_MAX[row-1];
            } else {
                style = style - 1;
            }
        }
        MAKEOVER_STYLE_CHOICES[cur] = style;
    } else if (col === 2) {
        if (dir === "r") {
            if (color === MAKEOVER_COLOR_MAX[row-1]) {
                color = 1;
            } else {
                color = color + 1;
            }
        } else if (dir === "l") {
            if (color === 1) {
                color = MAKEOVER_COLOR_MAX[row-1];
            } else {
                color = color - 1;
            }
        }
        MAKEOVER_COLOR_CHOICES[cur] = color;
    }

    console.log(cur, style, color);

    let newFile = `css/assets/makeover/${cur}/${cur}${style}_${color}.png`;
    document.getElementById(curID).src = newFile;

}

function plinko() {
    let plinkop5 = new p5(plinkoSketch);
}

function finishPlinko(option) {
    let plinkoContainer = document.getElementById("plinko_container");
    plinkoContainer.addEventListener("build", nextPage);
    let e = new Event("build");
    plinkoContainer.dispatchEvent(e);

    CLIQUE = option;
    if (CLIQUE.includes("horse")) {
        COLOR_PREFERENCES["brown"] += randomFromRange(50, 100);
    }
    if (CLIQUE.includes("teeth")) {
        COLOR_PREFERENCES["blue"] += randomFromRange(50, 100);
    }
    if (CLIQUE.includes("nails")) {
        COLOR_PREFERENCES["yellow"] += randomFromRange(50, 100);
    }
    if (CLIQUE.includes("theater")) {
        COLOR_PREFERENCES["pink"] += randomFromRange(50, 100);
    }
    if (CLIQUE.includes("shorts")) {
        COLOR_PREFERENCES["purple"] += randomFromRange(50, 100);
    }
    if (CLIQUE.includes("threw")) {
        COLOR_PREFERENCES["green"] += randomFromRange(50, 100);
    }
    if (CLIQUE.includes("peanut")) {
        COLOR_PREFERENCES["yellow"] += randomFromRange(50, 100);
    }
}

function beginSigDrag(e) {

    sigCtx = sigCanvas.getContext("2d");

    SIG_DRAG_PTS.push([e.offsetX, e.offsetY]);
    sigCanvas.onpointermove = sigDrag;
    sigCanvas.setPointerCapture(e.pointerId);

    let targetElements = document.elementsFromPoint(e.clientX, e.clientY);
    for (let i = 0; i < targetElements.length; i++) {
        let te = targetElements[i];
        if (te.id === ("signature_container")) {
            VALID_SIG_START = true;
        }
    }
}

function stopSigDrag(e) {
    sigCanvas.releasePointerCapture(e.pointerId);
    sigCanvas.onpointermove = null;
    SIG_DRAG_PTS.push(["x", "y"]);
}

function endSigPage() {
    sigCanvas.onpointerdown = null;
    sigCanvas.onpointerup = null;
    nextPage(e);
}

function sigDrag(e) {
    SIG_DRAG_PTS.push([e.offsetX, e.offsetY]);
    drawSigLine();
}

function drawSigLine() {

    sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);

    sigCtx.beginPath();
    sigCtx.lineWidth = "4";
    sigCtx.strokeStyle = "black";
    let start = SIG_DRAG_PTS[0];
    sigCtx.moveTo(start[0], start[1]);

    for (let i = 1; i < SIG_DRAG_PTS.length; i++) {
        let point = SIG_DRAG_PTS[i];
        if (point[0] === "x" && point[1] === "y") {
            let newPoint = SIG_DRAG_PTS[i+1];
            sigCtx.moveTo(newPoint[0], newPoint[1]);
            i += 1;
        } else {
            sigCtx.lineTo(point[0], point[1]);
            sigCtx.stroke();
        }
    }
}

function typewriter() {

    let letter = `Dear ${CRUSH_NAME},<br /><br />
        Remember when we were just ${CLIQUE} in ${TEACHER_NAME}'s class? Life was so simple then.<br /><br />
        As I write, it's currently ${FAVE_SEASON}, which made me think of you and the times we'd play chess on your front porch.<br /><br />`;
    
    if (VALID_HORSE) {
        letter += "I still play to this day. Sometimes I picture you across the board and I smile.<br /><br />";
    } else {
        letter += "I never really knew how to play, but it didn't matter as long as we were together.<br /><br />";
    }
    
    letter += `
    I don't know where you are now, or if this letter will ever find you. But I hope you are happy.<br /><br />
    I'm happy too, in my own funny way.<br /><br />
    With love,<br /><br />`;

    var typer = new Typewriter('#letter_container', {
        skipAddStyles: true,
        delay: 60,
    });

    typer
        .pauseFor(1000)
        .typeString(letter)
        .start();

    let timeoutPause = (letter.length * 60) + 1500;
    setTimeout(function() {
        document.getElementById("page20").insertBefore(sigCanvas, document.getElementById("prompt20_option1"));
        sigCanvas.style.border = "none";
        sigCanvas.style.width = "10em";
        sigCanvas.style.alignSelf = "flex-start";
        let cursor = document.getElementsByClassName("Typewriter__cursor")[0];
        cursor.parentNode.removeChild(cursor);
        drawSignature();
    }, timeoutPause);

}

function drawSignature() {

    sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);

    sigCtx.beginPath();
    sigCtx.lineWidth = "4";
    sigCtx.strokeStyle = "black";
    let start = SIG_DRAG_PTS[0];
    sigCtx.moveTo(start[0], start[1]);

    for (let i = 1; i < SIG_DRAG_PTS.length; i++) {
        let point = SIG_DRAG_PTS[i];
        setTimeout(function() {
            if (point[0] === "x" && point[1] === "y") {
                if (i < SIG_DRAG_PTS.length-1) {
                    let newPoint = SIG_DRAG_PTS[i+1];
                    sigCtx.moveTo(newPoint[0], newPoint[1]);
                    i += 1;
                }
            } else {
                sigCtx.lineTo(point[0], point[1]);
                sigCtx.stroke();
            }
        }, 30 * i);
    }

    setTimeout(function() {
        document.getElementById("prompt20_option1").style.display = "flex";
    }, (SIG_DRAG_PTS.length * 30) + 1000);

}

function randomFromRange(min, max) {
    return Math.random() * (max - min) + min;
}

function showStats() {
    document.getElementById("stats_modal").classList.add("active");
    document.getElementById("modal_overlay").classList.add("active");
}

function closeModal() {
    if (document.getElementById("stats_modal").classList.contains("active")) {
        document.getElementById("stats_modal").classList.remove("active");
        document.getElementById("modal_overlay").classList.remove("active");
    }
}