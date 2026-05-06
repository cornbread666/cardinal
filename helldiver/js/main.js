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
        let p = min * 60000;
        this.overallTime += p;
    }
}

const keypadJSON =
    '{ "Codes" : [' +
        '{ "Code" : "4259", "Take" : ["70"], "Discard" : ["00", "90"], "Message" : "Great work, dummy!" },' +
        '{ "Code" : "7143", "Take" : ["74"], "Discard" : ["65"], "Message" : "Now that\'s thinking on your feet... er, head" },' +
        '{ "Code" : "1957", "Take" : ["65"], "Discard" : ["84", "G", "X"], "Message" : "Space quote goes here" }],' +
    ' "Machines" : [' +
        '{ "Code" : "90", "Take" : ["82"], "Discard" : ["90"], "Message" : "Loud and clear!" },' +
        '{ "Code" : "99", "Take" : ["37"], "Discard" : ["99"], "Message" : "Gross!" },' +
        '{ "Code" : "74", "Take" : ["9"], "Discard" : ["74"], "Message" : "Sure, whatever!" }],' +
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
let videoContext = videoCanvas.getContext("2d", { willReadFrequently: true }) ;

intro();

function intro() {

    timeText(timeAllowed * 60); // convert to seconds
    addKeypadListeners();
    initializeSpeech();
    //checkPermissions();
    document.getElementById("play_icon").addEventListener("click", startGame);
}

function startGame() {
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

    hintText.appendChild(modalTextElement("Hint"));
    hintText.appendChild(bubbleContainer);
}

function hintReplacer(e, n, text) {

    e.target.style.backgroundImage = "linear-gradient(to bottom left, #90ee90, #228b22)";
    let hintText = document.getElementById("hint_body");
    let replacer = hintText.firstElementChild;

    if (n === "1") {
        replacer.textContent = text;
    } else if (n === "2") {
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
        } else if (keypadInput.value.length < 2) {
            keypadInput.value = keypadInput.value + last_char;
        }
        
    }
}

function keypadAttempt(code) {

    let passed = false;

    if (keypadMode === "code") {
        for (var c in validKeypadEntries["Codes"]) {
            if (code === validKeypadEntries["Codes"][c]["Code"]) {
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

function speechButton(bgElement, machineObj) {

    let button = document.createElement("div");
    button.addEventListener("click", function() { recordSpeech(machineObj) });
    button.id = "speech_button";

    bgElement.appendChild(button);
}

function recordSpeech(machineObj) {

    let word;

    speechRec.start();

    speechRec.onresult = (event) => {
        word = event.results[0][0].transcript;
        if (word.toLowerCase() === "registers" || word.toLowerCase() === "register") {
            closeMachine(true, machineObj["Code"], machineObj["Message"], machineObj["Take"], machineObj["Discard"]);
        }
        console.log(`Word: ${word}`);
        console.log(`Confidence: ${event.results[0][0].confidence}`);
    };

    speechRec.onspeechend = () => {
        speechRec.stop();
    };

    return word;
}

async function accessSelfieCam(bg, machineObj) {
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
            checkForBlackout(vid, machineObj);
        }, 1000);

    } catch (err) {
        console.log(err);
    }

}

function checkForBlackout(vid, machineObj) {

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
            closeMachine(true, machineObj["Code"], machineObj["Message"], machineObj["Take"], machineObj["Discard"]);
        }
    }
}

function machineSetup(machineObj) {

    let bg = document.createElement("div");
    bg.id = "machine_bg";
    bg.classList.add("machine_background");

    let close = document.getElementById("keypad_close").cloneNode(true);
    close.addEventListener("click", function() { closeMachine(false) });
    close.id = "machine_close";

    switch (machineObj["Code"]) {
        case "90":
            bg.style.backgroundImage = "url(css/assets/nakamura.png)"
            speechButton(bg, machineObj);
            break;
        case "99":
            accessSelfieCam(bg, machineObj);
            break;
        default:
            console.log("oops!");
    }

    document.body.appendChild(bg);
    bg.appendChild(close);
}

function closeMachine(success, code="", message="", take=[], discard=[]) {

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