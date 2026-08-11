//                  YELLOW      GREEN       BLUE       RED      PURPLE      INK         PINK        ORANGE
let PLAYER_COLORS = ["#FCB500", "#009100", "#057976", "#DF2A01", "#73373C", "#755850", "#D2605B", "#E26E2A"];
let NUM_PLAYERS;
let GOAL_SCORE;
let ROUND = 0;

main();

function main() {
    eventListeners();
}

function eventListeners() {

    document.getElementById("player_count_input").addEventListener("focus", function() {
        this.select();
    });
    document.getElementById("goal_score_input").addEventListener("focus", function() {
        this.select();
    });

    document.getElementById("player_count_input").addEventListener("input", limitPlayers);
    document.getElementById("goal_score_input").addEventListener("input", limitGameScore);
}

function limitPlayers(event) {
    if (event.target.value < 2) {
        event.target.value = 2;
    } else if (event.target.value > 8) {
        event.target.value = 8;
    }
}

function limitGameScore(event) {
    if (event.target.value < 1) {
        event.target.value = 1;
    } else if (event.target.value > 999) {
        event.target.value = 999;
    }
}

function startGame() {
    NUM_PLAYERS = document.getElementById("player_count_input").value;
    GOAL_SCORE = document.getElementById("goal_score_input").value;
    console.log(`players: ${NUM_PLAYERS}, goal score: ${GOAL_SCORE}`);
    document.getElementById("intro").style.display = "none";
    document.getElementById("game").style.display = "flex";

    createPlayers();
    for (let r = 0; r < 99; r++) { createRound(); }
}

function createPlayers() {
    const headRow = document.querySelector("#game_table thead tr");
    const footRow = document.querySelector("#game_table tfoot tr");

    for (let i = 0; i < NUM_PLAYERS; i++) {
        
        // HEADER
        let newCol = document.createElement("th");
        newCol.textContent = `Player ${i+1}`;
        newCol.contentEditable = "true";
        newCol.tabIndex = "0";
        newCol.style.backgroundColor = PLAYER_COLORS[i];
        newCol.id = `P${i+1}_NAME`;
        newCol.addEventListener("focus", function() {
            const range = document.createRange();
            range.selectNodeContents(this);
            
            const selection = window.getSelection();
            selection.removeAllRanges(); 
            selection.addRange(range);
        });

        let colorPicker = document.createElement("div");
        colorPicker.classList.add("color_picker");
        colorPicker.addEventListener("click", chooseColor);
        colorPicker.id = `P${i+1}_COLOR_PICKER`;

        headRow.appendChild(newCol);

        // FOOTER
        let newFoot = document.createElement("th");
        newFoot.textContent = "0";
        newFoot.contentEditable = false;
        newFoot.tabIndex = "-1";
        newFoot.style.backgroundColor = PLAYER_COLORS[i];
        newFoot.id = `P${i+1}_SCORE`;

        footRow.appendChild(newFoot);
    }
}

function chooseColor() {

}

function createRound() {

    ROUND += 1;

    const tableBody = document.querySelector("#game_table tbody");

    const newRow = document.createElement("tr");
    const roundCol = document.createElement("td");
    roundCol.rowSpan = "3";
    roundCol.textContent = `${ROUND}`;
    roundCol.tabIndex = "-1";

    newRow.appendChild(roundCol);

    for (let r = 0; r < 3; r++) {
        if (r === 0) {
            for (let i = 0; i < NUM_PLAYERS; i++) {
                const newCol = document.createElement("td");
                newCol.contentEditable = "true";
                newCol.tabIndex = "0";
                newCol.style.backgroundColor = PLAYER_COLORS[i];
                newCol.id = `P${i}_SUB_R${ROUND}`;
                newRow.appendChild(newCol);
            }
            tableBody.appendChild(newRow);
        } else {
            const newRowX = document.createElement("tr");
            for (let i = 0; i < NUM_PLAYERS; i++) {
                const newCol = document.createElement("td");
                if (r === 1) {
                    newCol.contentEditable = "true";
                    newCol.tabIndex = "0";
                    newCol.id = `P${i}_ADD_R${ROUND}`;
                } else {
                    newCol.contentEditable = "false";
                    newCol.tabIndex = "-1";
                    newCol.textContent = "0";
                    newCol.id = `P${i}_TOTAL_R${ROUND}`;
                }
                newCol.style.backgroundColor = PLAYER_COLORS[i];
                newRowX.appendChild(newCol);
            }
            tableBody.appendChild(newRowX);
        }
    }
}

function updateScore(event) {

}

function endGame() {
    console.log("Game Over!");
}