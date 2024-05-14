let PAGE_NUMBER = 0;
let HORSEY = document.getElementById("horse_piece");

// POTENTIAL TUMBLEWEED VARIABLES
let VALID_HORSE = false;
let TILES_LENGTH = 0;
let CRUSH_NAME = "";

intro();

function intro() {
    document.getElementById("play_triangle").addEventListener("click", introBlurb);
    document.getElementById("intro_triangle").addEventListener("click", startQuiz);

    questionPages = document.getElementsByClassName("answer triangle");
    for (let i = 0; i < questionPages.length; i++) {
        questionPages[i].addEventListener("click", nextPage);
    }

    letterTiles = document.getElementsByClassName("letter_tile");
    for (let i = 0; i < letterTiles.length; i++) {
        letterTiles[i].addEventListener("click", letterTileSwapper);
    }

    HORSEY.onpointerdown = beginChessDrag;
    HORSEY.onpointerup = stopChessDrag;

    Sortable.create(document.getElementById("drake_subgrid2"), { handle: ".drake_desc" });

    loadPage(9);
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