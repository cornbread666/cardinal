let PAGE_NUMBER = 0;
let docBody = document.body;
let HORSEY = document.getElementById("horse_piece");

let mazeCanvas = document.getElementById("maze_canvas");
let mazeCtx;

let sigCanvas = document.getElementById("signature_canvas");
let sigCtx;

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
let exitDrake = false;
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

// POTENTIAL TUMBLEWEED VARIABLES
let TEACHER_NAME = "";
let VALID_HORSE = false;
let ORIGINAL_SEASON = "";
let FAVE_SEASON = "";
let TILES_LENGTH = 0;
let CRUSH_NAME = "";
let INKBLOT_ANSWER = "";
let CHEESE_PILLED = false;
let CLIQUE = "";

intro();

function intro() {
    document.getElementById("play_triangle").addEventListener("click", introBlurb);
    document.getElementById("intro_triangle").addEventListener("click", startQuiz);

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

    loadPage(18);
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
            te.appendChild(HORSEY);
            HORSEY.style.position = 'relative';
            HORSEY.style.left = "0";
            HORSEY.style.top = "0";

            if (te.id === "chess_square12" || te.id === "chess_square14" || te.id === "chess_square21" || te.id === "chess_square41") {
                document.getElementById("chessmove_prompt").innerText = "nerd...";
                VALID_HORSE = true;
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

    let tumbleweedp5 = new p5(tumbleweedSketch);
    let backgroundp5 = new p5(backgroundSketch);
    let dotsp5 = new p5(dotSketch);
    let grainp5 = new p5(grainSketch);

    let tumbleweedURL = document.getElementById("tumbleweed_canvas").toDataURL("image/png", 1.0);
    document.getElementById("tumbleweed_canvas").style.display = "none";

    let ti = document.createElement("img");
    ti.id = "tumbleweed";
    ti.src = tumbleweedURL;
    document.getElementById("tumbleweed_container").appendChild(ti);

    /*let backgroundURL = document.getElementById("tumbleweed_bg_canvas").toDataURL("image/png", 1.0);
    document.getElementById("tumbleweed_bg_canvas").style.display = "none";

    let bi = document.createElement("img");
    bi.id = "tumbleweed_background";
    bi.src = backgroundURL;
    document.body.appendChild(bi);*/
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
        } else if (PAGE_NUMBER === 2) { // TEACHER PAGE
            let t = event.target.id.slice(-1);
            TEACHER_NAME = document.getElementById(`prompt2_answer${t}`).innerText;
            event.target.parentNode.classList.add("selected_option");
        } else if (PAGE_NUMBER === 5) { // CRUSH PAGE
            let c = document.getElementById("crush_input").value;
            if (c.length > 0) {
                CRUSH_NAME = c;
                event.target.removeEventListener("click", nextPage);
                event.target.parentNode.classList.add("selected_option");
            } else {
                validAnswer = false;
            }
        } else if (PAGE_NUMBER === 8) { // SEASONS PAGE
            let tid = event.target.id;
            let tidSliced = tid.slice(0, -1);
            let tidNum = parseInt(tid.slice(-1));
            ORIGINAL_SEASON = document.getElementById(`prompt8_answer${tidNum}`).innerText;
            let newNum = Math.abs(tidNum - 4) + 1;
            FAVE_SEASON = document.getElementById(`prompt8_answer${newNum}`).innerText;
            document.getElementById(tidSliced + newNum.toString()).parentNode.classList.add("selected_option");
            event.target.removeEventListener("click", nextPage);
        } else if (PAGE_NUMBER === 16) {
            let ink = document.getElementById("inkblot_input").value;
            if (ink.length > 0) {
                INKBLOT_ANSWER = ink;
                event.target.removeEventListener("click", nextPage);
                event.target.parentNode.classList.add("selected_option");
            } else {
                validAnswer = false;
            }
        }
        else {
            event.target.removeEventListener("click", nextPage);
            event.target.parentNode.classList.add("selected_option");
        }
    }

    if (validAnswer) {

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
        
        console.log(PAGE_NUMBER);

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
                document.body.scrollTop = document.documentElement.scrollTop = 0;
                document.body.style.overflow = "hidden";
                endQuiz();
            }, 3000);
        }
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

    if (complete && !exitDrake) {
        exitDrake = true;
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