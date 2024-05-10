let PAGE_NUMBER = 0;
let dragged;

intro();

function intro() {
    document.getElementById("play_triangle").addEventListener("click", intro_blurb);
    document.getElementById("intro_triangle").addEventListener("click", startQuiz);

    questionPages = document.getElementsByClassName("answer triangle");
    for (let i = 0; i < questionPages.length; i++) {
        questionPages[i].addEventListener("click", nextPage);
    }

    // chess page listeners
    document.getElementById("horse_piece").addEventListener("dragstart", (event) => {
        event.dataTransfer.effectAllowed = "move";
        dragged = event.target;
    });
    chessSquares = document.getElementsByClassName("chess_square");
    for (let i = 0; i < chessSquares.length; i++) {
        chessSquares[i].addEventListener("dragover", (event) => { event.preventDefault(); });
        chessSquares[i].addEventListener("drop", (event) => {
            event.preventDefault();
            if (event.target.className === "chess_square" && event.target !== dragged) {
                dragged.parentNode.removeChild(dragged);
                event.target.appendChild(dragged);
                document.getElementById("prompt31").style.opacity = "1";
                nextPage(event);
            }
        });
    }
}

function intro_blurb() {
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

    if (event.target.classList.contains("answer") && event.target.classList.contains("triangle")) {
        event.target.parentNode.classList.add("selected_option");
    }

    setTimeout(function() {
        document.getElementById("page" + PAGE_NUMBER.toString()).classList.add("page_fly_out");
    }, 800);

    
    setTimeout(function() {
        document.getElementById("page" + PAGE_NUMBER.toString()).style.display = "none";
        PAGE_NUMBER = PAGE_NUMBER + 1;
        document.getElementById("page" + PAGE_NUMBER.toString()).classList.add("page_fly_in");
    }, 1800);
}