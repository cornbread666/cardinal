let PAGE_NUMBER = 0;
let docBody = document.body;
let HORSEY = document.getElementById("horse_piece");

let mazeCanvas = document.getElementById("maze_canvas");
let mazeCtx;

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
let MAZE_DRAG_PTS = [];

// POTENTIAL TUMBLEWEED VARIABLES
let VALID_HORSE = false;
let TILES_LENGTH = 0;
let CRUSH_NAME = "";
let CHEESE_PILLED = false;
let MAKEOVER_CHOICES = [1, 1, 1, 1];

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

    //loadPage(15);
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
    mazeCtx.strokeStyle = winner ? "green" : "yellow";
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
            let newNum = Math.abs(tidNum - 4) + 1;
            document.getElementById(tidSliced + newNum.toString()).parentNode.classList.add("selected_option");
            event.target.removeEventListener("click", nextPage);
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
        if (PAGE_NUMBER === 2 || PAGE_NUMBER === 11) { // setting no-scroll for chess & maze pages
            docBody.setAttribute("style", "touch-action: none");
        } else {
            docBody.setAttribute("style", "touch-action: auto");
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

    let max_choices = [5,5,5,5];

    let tid = event.target.id;
    let row = parseInt(tid.slice(-1)) - 1;
    let dir = tid.slice(-2, -1);
    let cur = MAKEOVER_CHOICES[row];

    let curID = `makeover_row${row+1}_asset${cur}`;

    if (dir === "r") {
        if (cur === max_choices[row]) {
            MAKEOVER_CHOICES[row] = 1;
        } else {
            MAKEOVER_CHOICES[row] = MAKEOVER_CHOICES[row] + 1;
        }
    } else if (dir === "l") {
        if (cur === 1) {
            MAKEOVER_CHOICES[row] = max_choices[row];
        } else {
            MAKEOVER_CHOICES[row] = MAKEOVER_CHOICES[row] - 1;
        }
    }

    let newID = `makeover_row${row+1}_asset${MAKEOVER_CHOICES[row]}`;

    if (dir === "r") {

        document.getElementById(curID).classList.add("makeover_fly_out_right");
        setTimeout(function() {
            document.getElementById(curID).classList.remove("visible_asset");
            document.getElementById(newID).classList.add("visible_asset");
            document.getElementById(newID).classList.add("makeover_fly_from_left");
        }, 250);
        setTimeout(function() {
            document.getElementById(curID).classList.remove("makeover_fly_out_right");
            document.getElementById(newID).classList.remove("makeover_fly_from_left");
        }, 500);
    } else if (dir === "l") {

        document.getElementById(curID).classList.add("makeover_fly_out_left");
        setTimeout(function() {
            document.getElementById(curID).classList.remove("visible_asset");
            document.getElementById(newID).classList.add("visible_asset");
            document.getElementById(newID).classList.add("makeover_fly_from_right");
        }, 250);
        setTimeout(function() {
            document.getElementById(curID).classList.remove("makeover_fly_out_left");
            document.getElementById(newID).classList.remove("makeover_fly_from_right");
        }, 500);
    }






}
