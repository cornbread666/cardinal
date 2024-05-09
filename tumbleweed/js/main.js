let PAGE_NUMBER = 0;

intro();

function intro() {
    document.getElementById("play_triangle").addEventListener("click", intro_blurb);
    document.getElementById("intro_triangle").addEventListener("click", startQuiz);
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
    
}

function nextPage() {
    PAGE_NUMBER = PAGE_NUMBER + 1;
}