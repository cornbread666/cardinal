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

const validCodes = ["1234", "6969", "6666"];
const validMachines = ["52", "69", "82"];
const validHints = ["11", "22"];

const keypadJSON =
    '{ "Codes" : [' +
        '{ "Code" : "3369", "Take" : "90", "Discard" : "32|34|36" },' +
        '{ "Code" : "6969", "Take" : "34", "Discard" : "66|42|80" }],' +
    ' "Machines" : [ "12", "34", "69" ],' +
    ' "Hints" : [' +
        '{ "Code" : "89", "Hint" : "get good idiot" },' +
        '{ "Code" : "34", "Hint" : "look at the thing" }]}';

const validKeypadEntries = JSON.parse(keypadJSON);
let keypadModal = document.getElementById("keypad_modal");
let keypadInput = document.getElementById("keypad_input");
let overlay = document.getElementById("overlay");
let keypadMode = "code";
let timer = new Timer();
let gameRunning = false;

intro();

function intro() {

    addKeypadListeners();
    document.getElementById("play_icon").addEventListener("click", startGame);
}

function startGame() {
    gameRunning = true;

    pauseImg = document.createElement("img");
    pauseImg.src = "css/assets/pause.png";
    pauseImg.classList.add("icon");
    pauseImg.id = "pause_icon";
    pauseImg.addEventListener("click", pauseGame);
    document.getElementById("play_icon").remove();
    document.getElementById("top_hex11").appendChild(pauseImg);
}

function pauseGame() {
    gameRunning = false;

    playImg = document.createElement("img");
    playImg.src = "css/assets/play.png";
    playImg.classList.add("icon");
    playImg.id = "play_icon";
    playImg.addEventListener("click", startGame);
    document.getElementById("pause_icon").remove();
    document.getElementById("top_hex11").appendChild(playImg);
}

function addKeypadListeners() {
    document.getElementById("code_icon").addEventListener("click", function() { openKeypad("code") });
    document.getElementById("machine_icon").addEventListener("click", function() { openKeypad("machine") });
    document.getElementById("hint_icon").addEventListener("click", function() { openKeypad("hint") });
    overlay.addEventListener("click", closeKeypad);
    document.getElementById("keypad_close").addEventListener("click", closeKeypad);

    Array.from(document.getElementsByClassName("keypad_button")).forEach(key => {
        key.addEventListener("click", keypadPress);
    })
}

function openKeypad(mode) {
    if (gameRunning) {
        keypadMode = mode;
        keypadModal.classList.add("active");
        document.getElementById("overlay").classList.add("active");
    }
    
}

function closeKeypad() {
    if (keypadModal.classList.contains("active")) {
        keypadModal.classList.remove("active");
        overlay.classList.remove("active");
        keypadInput.value = "";
    }
}

function keypadPress(event) {
    let last_char = event.target.id.slice(-1);
    if (last_char === "C") {
        keypadInput.value = "";
    } else if (last_char === "K") {
        keypadAttempt(keypadInput.value);
    } else {
        let digit = parseInt(last_char);
        if (keypadMode === "code" && keypadInput.value.length < 4) {
            keypadInput.value = keypadInput.value + last_char;
        } else if (keypadInput.value.length < 2) {
            keypadInput.value = keypadInput.value + last_char;
        }
        
    }
}

function keypadAttempt(code) {
    if (keypadMode === "code") {
        for (var c in validKeypadEntries["Codes"]) {
            if (code === validKeypadEntries["Codes"][c]["Code"]) {
                codePass(validKeypadEntries["Codes"][c]);
            }
        }
    } if (keypadMode === "machine") {
        for (var m in validKeypadEntries["Machines"]) {
            if (code === validKeypadEntries["Machines"][m]) {
                machinePass(code);
            }
        }
    } if (keypadMode === "hint") {
        for (var h in validKeypadEntries["Hints"]) {
            if (code === validKeypadEntries["Hints"][h]["Code"]) {
                hintPass(validKeypadEntries["Hints"][h]);
            }
        }
    }
}

function codePass(codeObj) {
    closeKeypad();
    console.log(codeObj);
}

function machinePass(machine) {
    closeKeypad();
    console.log(machine);
}

function hintPass(hintObj) {
    closeKeypad();
    console.log(hintObj);
}