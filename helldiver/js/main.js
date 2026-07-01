class Timer {
    constructor(mins) {
      this.isRunning = false;
      this.startTime = 0;
      this.overallTime = 0;
      this.targetTime = mins * 60000; // minutes to milliseconds
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

    getTimeLeft() {
        if (!this.startTime) {
            return 0;
        }
        if (this.isRunning) {
            let t = Math.abs(this.targetTime - this.getTime());
            if (this.getTime() > this.targetTime) {
                timeExceeded = true;
            }
            return t;
        }
        return this.overallTime;
    }

    penalty(min) { // time added in minutes
        if (min > 0) {
            PENALTIES_TAKEN += 1;
        }
        let p = min * 60000;
        this.overallTime += p;
    }
}

const keypadJSON =
    '{ "Codes" : [' +
        '{ "Code" : "4259", "Take" : ["61", "70"], "Discard" : ["00", "90"], "Message" : "Great work, dummy!" },' +
        '{ "Code" : "7143", "Take" : ["74"], "Discard" : ["65"], "Message" : "Now that\'s thinking on your feet... er, head" },' +
        '{ "Code" : "3720", "Take" : ["75"], "Discard" : ["21", "96"], "Message" : "nom nom" },' +
        '{ "Code" : "1121", "Take" : [], "Discard" : [], "Message" : "Inputting the code stops the self-destruct sequence. With control on the command decks established, the orbital defense system is yours." },' +
        '{ "Code" : "1957", "Take" : ["65"], "Discard" : ["84", "I", "II", "III"], "Message" : "Space quote goes here" }],' +
    ' "Machines" : [' +
        '{ "Code" : "90", "Take" : ["82"], "Discard" : ["90"], "Message" : "Loud and clear!" },' +
        '{ "Code" : "102", "Take" : ["55"], "Discard" : ["102", "?"], "Message" : "Gross!" },' +
        '{ "Code" : "74", "Take" : ["9"], "Discard" : ["74"], "Message" : "Nice flying!" }],' +
    ' "Hints" : [' +
        '{ "Code" : "89", "Hint" : "get good idiot", "Take" : ["73"] },' +
        '{ "Code" : "34", "Hint" : "I can\'t believe this...", "Take" : ["74"] }]}';

let timeAllowed = 60; // minutes
const validKeypadEntries = JSON.parse(keypadJSON);
let modalContainer = document.getElementById("modal_container");
let keypadModal = document.getElementById("keypad_modal");
let keypadInput = document.getElementById("keypad_input");
let penaltyModal = document.getElementById("penalty_modal");
let successModal = document.getElementById("success_modal");
let hintModal = document.getElementById("hint_modal");
let overlay = document.getElementById("overlay");
let keypadMode = "code";
let timer = new Timer(timeAllowed);
let timerInterval;
let selfieInterval;
let timeElement = document.getElementById("time");
let timeExceeded = false;
let gameRunning = false;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;
const speechRec = new SpeechRecognition();
let speechActive = false;
let videoCanvas = document.createElement("canvas");
let videoContext = videoCanvas.getContext("2d", { willReadFrequently: true });
let GLASS_BONUS = false;
let CURRENT_MACHINE;
let HINTS_USED = 0;
let PENALTIES_TAKEN = 0;
let shipCanvas = document.createElement("canvas");
shipCanvas.id = "ship_canvas";
let shipContext = shipCanvas.getContext("2d");
let ship_drag_pts = [];
let ship_triangles = [{"active": 0, "x1": 62, "y1": 30, "x2": 57, "y2": 35, "x3": 66, "y3": 35, "color": "lightpink"},
                    {"active": 0, "x1": 42, "y1": 35, "x2": 40, "y2": 40, "x3": 48, "y3": 38, "color": "lightpink"},
                    {"active": 0, "x1": 37, "y1": 45, "x2": 38, "y2": 49, "x3": 43, "y3": 45, "color": "lightpink"},
                    {"active": 0, "x1": 39, "y1": 58, "x2": 49, "y2": 59, "x3": 46, "y3": 54, "color": "lightpink"},
                    {"active": 0, "x1": 50, "y1": 62, "x2": 42, "y2": 68, "x3": 54, "y3": 69, "color": "lightpink"},
                    {"active": 0, "x1": 59, "y1": 71, "x2": 63, "y2": 75, "x3": 68, "y3": 72, "color": "lightpink"},
                    {"active": 0, "x1": 77, "y1": 60, "x2": 76, "y2": 65, "x3": 84, "y3": 63, "color": "lightpink"},
                    {"active": 0, "x1": 74, "y1": 49, "x2": 69, "y2": 55, "x3": 81, "y3": 54, "color": "lightpink"},
                    {"active": 0, "x1": 62, "y1": 49, "x2": 53, "y2": 50, "x3": 59, "y3": 53, "color": "lightpink"},
                    {"active": 0, "x1": 67, "y1": 66, "x2": 80, "y2": 77, "x3": 85, "y3": 68, "color": "lightpink"},
                    {"active": 0, "x1": 46, "y1": 22, "x2": 41, "y2": 25, "x3": 48, "y3": 25, "color": "lightcyan"},
                    {"active": 0, "x1": 65, "y1": 23, "x2": 62, "y2": 28, "x3": 69, "y3": 28, "color": "lightcyan"},
                    {"active": 0, "x1": 78, "y1": 22, "x2": 78, "y2": 25, "x3": 83, "y3": 24, "color": "lightcyan"},
                    {"active": 0, "x1": 72, "y1": 34, "x2": 71, "y2": 39, "x3": 78, "y3": 37, "color": "lightcyan"},
                    {"active": 0, "x1": 66, "y1": 40, "x2": 65, "y2": 45, "x3": 72, "y3": 43, "color": "lightcyan"},
                    {"active": 0, "x1": 76, "y1": 41, "x2": 74, "y2": 46, "x3": 81, "y3": 45, "color": "lightcyan"},
                    {"active": 0, "x1": 28, "y1": 38, "x2": 30, "y2": 43, "x3": 35, "y3": 41, "color": "lightcyan"},
                    {"active": 0, "x1": 30, "y1": 44, "x2": 26, "y2": 48, "x3": 32, "y3": 47, "color": "lightcyan"},
                    {"active": 0, "x1": 46, "y1": 43, "x2": 49, "y2": 48, "x3": 53, "y3": 45, "color": "lightcyan"},
                    {"active": 0, "x1": 56, "y1": 55, "x2": 57, "y2": 61, "x3": 63, "y3": 58, "color": "lightcyan"},
                    {"active": 0, "x1": 28, "y1": 59, "x2": 31, "y2": 63, "x3": 36, "y3": 60, "color": "lightcyan"},
                    {"active": 0, "x1": 26, "y1": 67, "x2": 30, "y2": 71, "x3": 34, "y3": 68, "color": "lightcyan"},
                    {"active": 0, "x1": 39, "y1": 69, "x2": 40, "y2": 74, "x3": 46, "y3": 71, "color": "lightcyan"},
                    {"active": 0, "x1": 27, "y1": 31, "x2": 39, "y2": 37, "x3": 33, "y3": 23, "color": "lightcyan"},
                    {"active": 0, "x1": 59, "y1": 26, "x2": 59, "y2": 22, "x3": 54, "y3": 25, "color": "lightgreen"},
                    {"active": 0, "x1": 78, "y1": 29, "x2": 77, "y2": 25, "x3": 72, "y3": 28, "color": "lightgreen"},
                    {"active": 0, "x1": 82, "y1": 34, "x2": 78, "y2": 31, "x3": 77, "y3": 34, "color": "lightgreen"},
                    {"active": 0, "x1": 54, "y1": 26, "x2": 45, "y2": 31, "x3": 55, "y3": 32, "color": "lightgreen"},
                    {"active": 0, "x1": 59, "y1": 37, "x2": 51, "y2": 40, "x3": 59, "y3": 43, "color": "lightgreen"},
                    {"active": 0, "x1": 67, "y1": 50, "x2": 71, "y2": 47, "x3": 64, "y3": 47, "color": "lightgreen"},
                    {"active": 0, "x1": 35, "y1": 56, "x2": 38, "y2": 50, "x3": 29, "y3": 51, "color": "lightgreen"},
                    {"active": 0, "x1": 68, "y1": 63, "x2": 72, "y2": 57, "x3": 65, "y3": 59, "color": "lightgreen"},
                    {"active": 0, "x1": 64, "y1": 67, "x2": 59, "y2": 63, "x3": 56, "y3": 67, "color": "lightgreen"},
                    {"active": 0, "x1": 41, "y1": 65, "x2": 43, "y2": 61, "x3": 38, "y3": 62, "color": "lightgreen"},
                    {"active": 0, "x1": 52, "y1": 74, "x2": 56, "y2": 72, "x3": 51, "y3": 71, "color": "lightgreen"}];

intro();

function intro() {

    timeText(timeAllowed * 60); // convert to seconds
    addKeypadListeners();
    initializeSpeech();
    //checkPermissions();
    document.getElementById("play_icon").addEventListener("click", startGame);
}

async function startGame() {

    gameRunning = true;
    
    timer.start();
    timerInterval = setInterval(() => {
        t = timer.getTimeLeft();
        timeText((t / 1000)); // convert milli to seconds
    }, 100);

    pauseImg = document.createElement("img");
    pauseImg.src = "css/assets/pause.png";
    pauseImg.classList.add("icon");
    pauseImg.id = "pause_icon";
    pauseImg.addEventListener("click", pauseGame);
    document.getElementById("play_icon").remove();
    document.getElementById("top_hex11").appendChild(pauseImg);

    setTimeout(iconToggle, 0);
}

function pauseGame() {
    gameRunning = false;

    timer.stop();
    clearInterval(timerInterval);

    playImg = document.createElement("img");
    playImg.src = "css/assets/play.png";
    playImg.classList.add("icon", "shine");
    playImg.id = "play_icon";
    playImg.addEventListener("click", startGame);
    document.getElementById("pause_icon").remove();
    document.getElementById("top_hex11").appendChild(playImg);

    setTimeout(iconToggle, 0);
}

function iconToggle() {
    Array.from(document.getElementsByClassName("icon")).forEach(icon => {
        if (gameRunning) {
            icon.classList.add("shine");
        } else {
            icon.classList.remove("shine");
        }
    })
}

function addKeypadListeners() {
    document.getElementById("code_icon").addEventListener("click", function() { openKeypad("code") });
    document.getElementById("machine_icon").addEventListener("click", function() { openKeypad("machine") });
    document.getElementById("hint_icon").addEventListener("click", function() { openKeypad("hint") });
    document.getElementById("glass_icon").addEventListener("click", function() { openPenalty("glass", 0, 0) });
    document.getElementById("penalty_icon").addEventListener("click", function() { openPenalty("penalty", 2, 0) });
    overlay.addEventListener("click", closeKeypad);
    document.getElementById("keypad_close").addEventListener("click", closeKeypad);
    document.getElementById("penalty_close").addEventListener("click", closePenalty);
    document.getElementById("success_close").addEventListener("click", closeSuccess);
    document.getElementById("hint_close").addEventListener("click", closeHint);


    Array.from(document.getElementsByClassName("keypad_button")).forEach(key => {
        key.addEventListener("click", keypadPress);
    })
}

function initializeSpeech() {
    speechRec.continuous = false;
    speechRec.lang = "en-US";
    speechRec.interimResults = false;
    speechRec.maxAlternatives = 1;
}

speechRec.onstart = () => {
    speechActive = true;
    console.log("Speech started");
    document.getElementById("speech_button").classList.add("activeSpeech");
}

speechRec.onend = () => {
    speechActive = false;
    console.log("Speech stopped");
    document.getElementById("speech_button").classList.remove("activeSpeech");
}

function openKeypad(mode) {
    if (gameRunning) {
        modalContainer.style.zIndex = "10";
        keypadMode = mode;
        keypadModal.classList.add("active");
        document.getElementById("overlay").classList.add("active");
    }
}

function openPenalty(code="none", t=0, attempt) {

    let penaltyText = document.getElementById("penalty_body");
    let penaltyHead = document.getElementById("penalty_head_text");
    penaltyText.replaceChildren();
    let skull = document.createElement("img");
    skull.src = "css/assets/skull.png";
    skull.id = "skull_icon";
    skull.classList.add("icon", "shine");

    if (gameRunning) {
        modalContainer.style.zIndex = "10";
        penaltyModal.classList.add("active");
        document.getElementById("overlay").classList.add("active");
    }

    if (code === "code") {
        penaltyText.appendChild(modalTextElement("Wrong code!"));
        penaltyHead.textContent = `${attempt}`;
    } else if (code === "machine") {
        penaltyText.appendChild(modalTextElement("Machine not found!"));
        penaltyHead.textContent = `${attempt}`;
    } else if (code === "hint") {
        penaltyText.appendChild(modalTextElement("Hint not found!"));
        penaltyHead.textContent = `Hint n° ${attempt}`;
    } else if (code === "glass") {
        if (!GLASS_BONUS) {
            GLASS_BONUS = true;
            penaltyText.appendChild(modalTextElement("This button does nothing."));
            penaltyText.appendChild(modalTextElement("Take a 5-minute bonus as a reward for having a curious mind."));
            penaltyHead.textContent = "";
            timer.penalty(-5);
        } else {
            penaltyText.appendChild(modalTextElement("Don't be greedy."));
            penaltyHead.textContent = "";
        }
    } else if (code === "penalty") {
        penaltyText.appendChild(modalTextElement("I hope you did something to deserve this."));
        penaltyText.appendChild(skull);
        penaltyHead.textContent = `Penalty`;
        timer.penalty(2);
    }

    if (t !== 0) {
        penaltyText.appendChild(modalTextElement(`You lose ${t} minutes`));
        penaltyText.appendChild(skull);
    }
}

function openCode(attempt, message, take=[], discard=[]) {
    let successText = document.getElementById("success_body");
    let successHead = document.getElementById("success_head_text");
    successText.replaceChildren();

    if (gameRunning) {
        modalContainer.style.zIndex = "10";
        successModal.classList.add("active");
        document.getElementById("overlay").classList.add("active");
    }

    successText.appendChild(modalTextElement(message));
    successHead.textContent = `${attempt}`;

    if (take.length > 0) {

        successText.appendChild(modalTextElement("Take:"));

        let bubbleContainer = document.createElement("div");
        bubbleContainer.classList.add("bubble_container");
        for (let i = 0; i < take.length; i++) {
            let bubble = numberBubble(take[i], "take");
            bubbleContainer.appendChild(bubble);
        }
        successText.appendChild(bubbleContainer);
    }

    if (discard.length > 0) {

        successText.appendChild(modalTextElement("Discard:"));

        let bubbleContainer = document.createElement("div");
        bubbleContainer.classList.add("bubble_container");
        for (let i = 0; i < discard.length; i++) {
            let bubble = numberBubble(discard[i], "discard");
            bubbleContainer.appendChild(bubble);
        }
        successText.appendChild(bubbleContainer);
    }

    if (attempt === "1121") {
        pauseGame();
        successHead.textContent = "YOU WIN!";
        successText.appendChild(modalTextElement("Darrow turns to you, nods, then speaks into his wrist: \"The station is secure. Now we prep for the invasion of Mercury.\""));
        
        let score = document.createElement("img");
        score.src = "css/assets/star.png";
        score.id = "star_icon";
        successText.appendChild(score);
        score.addEventListener("click", winScreen);
    }
}

function openHint(attempt, hint, take) {
    let hintText = document.getElementById("hint_body");
    let hintHead = document.getElementById("hint_head_text");
    hintText.replaceChildren();

    if (gameRunning) {
        modalContainer.style.zIndex = "10";
        hintModal.classList.add("active");
        document.getElementById("overlay").classList.add("active");
    }

    hintText.appendChild(modalTextElement("1 = hint || 2 = solution"));
    hintHead.textContent = `Hint n° ${attempt}`;

    let bubbleContainer = document.createElement("div");
    bubbleContainer.classList.add("bubble_container");
    bubbleContainer.id = "hint_bubble_container";
    let bubble1 = numberBubble("1", "hint", hint);
    let bubble2 = numberBubble("2", "hint", take);
    bubbleContainer.appendChild(bubble1);
    bubbleContainer.appendChild(bubble2);

    hintText.appendChild(modalTextElement(""));
    hintText.appendChild(bubbleContainer);
}

function winScreen() {

    let wt = timer.getTime() / 1000;

    let mins = Math.floor(wt / 60);
    let formattedMins = String(mins).padStart(2, '0');
    let secs = Math.floor(wt % 60);
    let formattedSecs = String(secs).padStart(2, '0');

    document.getElementById("win_screen").style.display = "flex";
    document.getElementById("win_time_text").textContent = `${formattedMins}:${formattedSecs}`;
    document.getElementById("win_hints_text").textContent = `${HINTS_USED}`;
    document.getElementById("win_penalties_text").textContent = `${PENALTIES_TAKEN}`;
}

function hintReplacer(e, n, text) {

    e.target.style.backgroundImage = "linear-gradient(to bottom left, #90ee90, #228b22)";
    let hintText = document.getElementById("hint_body");
    let replacer = hintText.firstElementChild;

    if (n === "1") {
        HINTS_USED += 1;
        replacer.textContent = text;
    } else if (n === "2") {
        HINTS_USED += 1;
        replacer.textContent = "Take:";
        let bubble = numberBubble(text, "take");
        replacer.insertAdjacentElement("afterend", bubble);
    }
}

function closeKeypad() {
    modalContainer.style.zIndex = "-1";
    if (keypadModal.classList.contains("active")) {
        keypadModal.classList.remove("active");
        overlay.classList.remove("active");
        keypadInput.value = "";
    }
}

function closePenalty() {
    modalContainer.style.zIndex = "-1";
    if (penaltyModal.classList.contains("active")) {
        penaltyModal.classList.remove("active");
        overlay.classList.remove("active");
    }
}

function closeSuccess() {
    modalContainer.style.zIndex = "-1";
    if (successModal.classList.contains("active")) {
        successModal.classList.remove("active");
        overlay.classList.remove("active");
    }
}

function closeHint() {
    modalContainer.style.zIndex = "-1";
    if (hintModal.classList.contains("active")) {
        hintModal.classList.remove("active");
        overlay.classList.remove("active");
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
        } else if (keypadInput.value.length < 3) {
            keypadInput.value = keypadInput.value + last_char;
        }
    }
}

function keypadAttempt(code) {

    let passed = false;

    if (keypadMode === "code") {
        for (var c in validKeypadEntries["Codes"]) {
            if (code === validKeypadEntries["Codes"][c]["Code"]) {
                /*if (code === "1121") {
                    openPenalty("winner", 0, 0);
                } else {
                    
                }*/
                codePass(validKeypadEntries["Codes"][c]);
                passed = true;
            }
        }
        if (!passed) {
            closeKeypad();
            timer.penalty(2); // 2 minute penalty for wrong code
            openPenalty("code", 2, code);
        }
    } if (keypadMode === "machine") {
        for (var m in validKeypadEntries["Machines"]) {
            if (code === validKeypadEntries["Machines"][m]["Code"]) {
                machinePass(validKeypadEntries["Machines"][m]);
                passed = true;
            }
        }
        if (!passed) {
            closeKeypad();
            openPenalty("machine", 0, code);
        }
    } if (keypadMode === "hint") {
        for (var h in validKeypadEntries["Hints"]) {
            if (code === validKeypadEntries["Hints"][h]["Code"]) {
                hintPass(validKeypadEntries["Hints"][h]);
                passed = true;
            }
        }
        if (!passed) {
            closeKeypad();
            openPenalty("hint", 0, code);
        }
    }
}

function codePass(codeObj) {
    closeKeypad();
    openCode(codeObj["Code"], codeObj["Message"], codeObj["Take"], codeObj["Discard"]);
}

function machinePass(machineObj) {
    closeKeypad();
    machineSetup(machineObj);
}

function hintPass(hintObj) {
    closeKeypad();
    openHint(hintObj["Code"], hintObj["Hint"], hintObj["Take"])
}

function timeText(t) { // delivered in seconds
    timeString = "";

    let mins = Math.floor(t / 60);
    let formattedMins = String(mins).padStart(2, '0');
    let secs = Math.floor(t % 60);
    let formattedSecs = String(secs).padStart(2, '0');

    if (timeExceeded) {
        timeElement.style.color = "red";
    }
    
    timeElement.textContent = `${formattedMins}:${formattedSecs}`;   
}

function modalTextElement(s) {
    let p = document.createElement("p");
    p.classList.add("modal_text");
    p.textContent = s;
    return p;
}

function numberBubble(n, action, text="") {
    let bubble = document.createElement("p");
    bubble.classList.add("number_bubble");
    if (action === "take") {
        bubble.style.backgroundImage = "linear-gradient(to bottom left, #90ee90, #228b22)";
    } else if (action === "discard") {
        bubble.style.backgroundImage = "linear-gradient(to bottom left, #e9967a, #b22222)";
    } else if (action === "hint") {
        bubble.classList.add("hint_bubble");
        bubble.style.backgroundImage = "linear-gradient(to bottom left, #d3d3d3, #708090)";
        bubble.addEventListener("click", (event) => { hintReplacer(event, n, text) });
    }
    bubble.id = `bubble_${action}_${n}`;
    bubble.textContent = n;
    return bubble;
}

function speechButton(bgElement) {

    let button = document.createElement("div");
    button.addEventListener("click", recordSpeech);
    button.id = "speech_button";

    bgElement.appendChild(button);
}

function recordSpeech() {

    let word;

    speechRec.start();

    speechRec.onresult = (event) => {
        word = event.results[0][0].transcript;
        if (word.toLowerCase() === "registers" || word.toLowerCase() === "register") {
            closeMachine(true, CURRENT_MACHINE["Code"], CURRENT_MACHINE["Message"], CURRENT_MACHINE["Take"], CURRENT_MACHINE["Discard"]);
        }
        console.log(`Word: ${word}`);
        console.log(`Confidence: ${event.results[0][0].confidence}`);
    };

    speechRec.onspeechend = () => {
        speechRec.stop();
    };

    return word;
}

async function accessSelfieCam(bg) {
    let stream = null;
    let vid = document.createElement("video");
    vid.id = "selfie_cam";

    try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "user" }});
        vid.srcObject = stream;
        vid.play();
        bg.appendChild(vid);

        let sickle = document.createElement("img");
        sickle.src = "css/assets/sickle_red.png";
        sickle.id = "sickle_overlay";
        bg.appendChild(sickle);

        selfieInterval = setInterval(() => {
            checkForBlackout(vid, stream);
        }, 1000);

    } catch (err) {
        console.log(err);
    }

}

function checkForBlackout(vid, stream) {

    if (vid.videoWidth > 0 && vid.videoHeight > 0) {

        videoCanvas.width = vid.videoWidth;
        videoCanvas.height = vid.videoHeight;
        videoContext.drawImage(vid, 0, 0, videoCanvas.width, videoCanvas.height);

        let frame = videoContext.getImageData(0, 0, videoCanvas.width, videoCanvas.height);
        let data = frame.data;
        
        let totalBrightness = 0;

        for (let i = 0; i < data.length; i += 4 * 50) {
            totalBrightness += (data[i] + data[i+1] + data[i+2]) / 3;
        }
        let avgBrightness = totalBrightness / (data.length / (4 * 50));
    
        if (avgBrightness < 25) {
            closeMachine(true, CURRENT_MACHINE["Code"], CURRENT_MACHINE["Message"], CURRENT_MACHINE["Take"], CURRENT_MACHINE["Discard"]);
        }
    }
}

async function closeStreams() {

    try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "user" }});
        stream.getTracks().forEach(function(track) {
            track.stop();
        });
    } catch (err) {
        console.log(err);
    }

}

async function shipTracer(bgElement) {

    let img = await setShipCanvasDimensions();
    let shipsWidth, shipsHeight;

    let imgRatio = img.naturalHeight / img.naturalWidth;
    let viewRatio = window.innerHeight / window.innerWidth;

    if (viewRatio > imgRatio) {
        shipsWidth = window.innerWidth;
        shipsHeight = shipsWidth * imgRatio;
    } else {
        shipsHeight = window.innerHeight;
        shipsWidth = shipsHeight / imgRatio;
    }
    
    shipCanvas.width = shipsWidth;
    shipCanvas.height = shipsHeight;
    shipCanvas.classList.remove("correct_ships");
    clearShipLine(false);

    /*ship_triangles.forEach(ship => {
        drawShipTriangle(ship.x1, ship.y1, ship.x2, ship.y2, ship.x3, ship.y3, ship.color);
    });*/

    bgElement.appendChild(shipCanvas);
    shipCanvas.onpointerdown = beginShipDrag;
    shipCanvas.onpointerup = stopShipDrag;
}

function drawShipTriangle(x1, y1, x2, y2, x3, y3, color) {
    let swu = shipCanvas.width/100;
    let shu = shipCanvas.height/100;

    shipContext.fillStyle = color;
    shipContext.globalAlpha = 0.8;
    shipContext.beginPath();

    shipContext.moveTo(x1*swu, y1*shu);
    shipContext.lineTo(x2*swu, y2*shu);
    shipContext.lineTo(x3*swu, y3*shu);
    shipContext.fill();
}

function highlightShip(px, py) {

    let swu = shipCanvas.width/100;
    let shu = shipCanvas.height/100;

    ship_triangles.forEach(ship => {

        let x1 = ship.x1 * swu;
        let x2 = ship.x2 * swu;
        let x3 = ship.x3 * swu;
        let y1 = ship.y1 * shu;
        let y2 = ship.y2 * shu;
        let y3 = ship.y3 * shu;

        let denom = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
        let a = ((y2 - y3) * (px - x3) + (x3 - x2) * (py - y3)) / denom;
        let b = ((y3 - y1) * (px - x3) + (x1 - x3) * (py - y3)) / denom;
        let c = 1 - a - b;

        if (a >= 0 && a <= 1 && b >= 0 && b <= 1 && c >= 0 && c <= 1) {
            ship.active = 1;
        }
    })

}

function beginShipDrag(e) {

    ship_drag_pts.push([e.offsetX, e.offsetY]);
    shipCanvas.onpointermove = shipDrag;
    shipCanvas.setPointerCapture(e.pointerId);
}

function stopShipDrag(e) {
    shipCanvas.onpointermove = null;
    shipCanvas.releasePointerCapture(e.pointerId);

    let clicked = 0;
    let correct = false;

    ship_triangles.forEach(ship => {
        if (ship.active === 1 && ship.color === "lightpink")  {
            clicked+=1;
        }
    });

    if (clicked === 10) {
        correct = true;
    }

    if (correct) {
        clearShipLine(true);
    } else {
        clearShipLine(false);
        ship_drag_pts = [];
    }
}

function shipDrag(e) {

    ship_drag_pts.push([e.offsetX, e.offsetY]);
    highlightShip(e.offsetX, e.offsetY);
    drawShipLine(false);
}

function drawShipLine(drawLine) {

    shipContext.clearRect(0, 0, shipCanvas.width, shipCanvas.height);

    ship_triangles.forEach(ship => {
        if (ship.active === 1)  {
            drawShipTriangle(ship.x1, ship.y1, ship.x2, ship.y2, ship.x3, ship.y3, ship.color);
        }
    });

    if (drawLine) {
        shipContext.beginPath();
        shipContext.globalAlpha = 1.0;
        shipContext.lineWidth = "10";
        shipContext.strokeStyle = "purple";
        let start = ship_drag_pts[0];
        shipContext.moveTo(start[0], start[1]);
    
        for (let i = 1; i < ship_drag_pts.length; i++) {
            let point = ship_drag_pts[i];
            shipContext.lineTo(point[0], point[1]);
        }
    
        shipContext.stroke();
    }
}

function clearShipLine(success) {

    if (success) {
        drawShipLine(true);
        shipCanvas.classList.add("correct_ships");
        setTimeout(() => {
            closeMachine(true, CURRENT_MACHINE["Code"], CURRENT_MACHINE["Message"], CURRENT_MACHINE["Take"], CURRENT_MACHINE["Discard"]);
          }, 3000);
    } else {
        shipContext.clearRect(0, 0, shipCanvas.width, shipCanvas.height);
        ship_triangles.forEach(ship => {
            if (ship.active === 1)  {
                ship.active = 0;
            }
        });
    }
}

async function setShipCanvasDimensions() {

    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = "css/assets/card_51.jpg";
    });
    
}

function machineSetup(machineObj) {

    CURRENT_MACHINE = machineObj;
    let bg = document.createElement("div");
    bg.id = "machine_bg";
    bg.classList.add("machine_background");

    let close = document.getElementById("keypad_close").cloneNode(true);
    close.addEventListener("click", function() { closeMachine(false) });
    close.id = "machine_close";

    switch (machineObj["Code"]) {
        case "90":
            bg.style.backgroundImage = "url(css/assets/nakamura.png)";
            speechButton(bg);
            break;
        case "102":
            accessSelfieCam(bg);
            close.addEventListener("click", closeStreams);
            break;
        case "74":
            bg.style.backgroundImage = "url(css/assets/card_51.jpg)";
            shipTracer(bg);
            break;
        default:
            console.log("oops!");
    }

    document.body.appendChild(bg);
    bg.appendChild(close);
}

function closeMachine(success, code="", message="", take=[], discard=[]) {

    if (document.getElementById("speech_button")) {
        speechRec.stop();
    }

    if(document.getElementById("selfie_cam")) {
        let selfie = document.getElementById("selfie_cam");
        if (selfie.srcObject !== null) {
            let tracks = selfie.srcObject.getTracks();
            tracks.forEach((track) => {
                track.stop();
            });
            selfie.srcObject = null;
            clearInterval(selfieInterval);
        }
    }

    if (success) {
        openCode(code, message, take, discard);
    }
    
    document.getElementById("machine_bg").replaceChildren();
    document.getElementById("machine_bg").remove();
}