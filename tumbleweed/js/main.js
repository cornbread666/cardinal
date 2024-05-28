let PAGE_NUMBER = 0;
let docBody = document.body;
let HORSEY = document.getElementById("horse_piece");

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

// POTENTIAL TUMBLEWEED VARIABLES
let VALID_HORSE = false;
let TILES_LENGTH = 0;
let CRUSH_NAME = "";

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

    HORSEY.onpointerdown = beginChessDrag;
    HORSEY.onpointerup = stopChessDrag;

    document.getElementById("maze").onpointerdown = beginMazeDrag;
    document.getElementById("maze").onpointerup = stopMazeDrag;

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

    loadPage(12);
}

function beginChessDrag(e) {
    HORSEY.onpointermove = chessDrag;
    HORSEY.setPointerCapture(e.pointerId);
}

function stopChessDrag(e) {
    HORSEY.onpointermove = null;
    HORSEY.releasePointerCapture(e.pointerId);
    let targetElements = document.elementsFromPoint(e.pageX, e.pageY);
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
    document.getElementById("maze").onpointermove = mazeDrag;
    document.getElementById("maze").setPointerCapture(e.pointerId);

    let targetElements = document.elementsFromPoint(e.pageX, e.pageY);
    for (let i = 0; i < targetElements.length; i++) {
        let te = targetElements[i];
        if (te.id === ("maze_start_square")) {
            VALID_MAZE_START = true;
        }
    }
}

function stopMazeDrag(e) {
    document.getElementById("maze").onpointermove = null;
    document.getElementById("maze").releasePointerCapture(e.pointerId);

    let targetElements = document.elementsFromPoint(e.pageX, e.pageY);
    for (let i = 0; i < targetElements.length; i++) {
        let te = targetElements[i];
        if (te.id === ("maze_end_square")) {
            VALID_MAZE_END = true;
        }
    }

    clearMazeLine(VALID_MAZE_START && VALID_MAZE_END);

    if (VALID_MAZE_START && VALID_MAZE_END) {
        nextPage(e);
    } else {
        VALID_MAZE_START = false;
        VALID_MAZE_END = false;
    }
}

function mazeDrag(e) {
    let c = document.createElement("div");
    c.classList.add("maze_drag_circle", "drawn");
    c.style.top = `${e.pageY}px`;
    c.style.left = `${e.pageX}px`;
    docBody.appendChild(c);
}

function clearMazeLine(success) {

    let mazeCircles = document.getElementsByClassName("maze_drag_circle");
    if (success) {
        for (let i = 0; i < mazeCircles.length; i++) {
            mazeCircles[i].classList.add("maze_win");
        }
        setTimeout(function() {
            while (mazeCircles[0]) {
                docBody.removeChild(mazeCircles[0]);
            }
        }, 2000);
    } else {
        while (mazeCircles[0]) {
            docBody.removeChild(mazeCircles[0]);
        }
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
            PAGE_NUMBER = PAGE_NUMBER + 1;
            document.getElementById("page" + PAGE_NUMBER.toString()).classList.add("page_fly_in");
        }, 1800);

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