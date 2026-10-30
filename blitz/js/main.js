//                  YELLOW      GREEN       BLUE       RED      PURPLE      INK         PINK        ORANGE
let PLAYER_COLORS = ["#FCB500", "#009100", "#057976", "#DF2A01", "#73373C", "#1B2A36", "#D2605B", "#E26E2A"];
let NUM_PLAYERS;
let PLAYERS_ADDED = 0;
let GOAL_SCORE;
let ROUND;
let MAX_ROUNDS = 99;
let PADDING = 5;
let scoreChart = null;

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

    // close color picker
    document.addEventListener("click", function(e) {
        if (!e.target.classList.contains("color_slice")) {
            if (e.target.classList.contains("player_name_cell")) {
                let target = e.target.id.slice(0,2);
                document.querySelectorAll(".color_picker").forEach(cp => {
                    if (cp.classList.contains("open")) {
                        if (cp.id.slice(0,2) !== target) {
                            cp.classList.remove("open");
                            cp.replaceChildren();
                        }
                    }
                });
                
            } else {
                document.querySelectorAll(".color_picker").forEach(cp => {
                    cp.classList.remove("open");
                    cp.replaceChildren();
                });
            }
        }
    });

    // tab closes color picker
    document.addEventListener("keydown", function(e) {
        if(e.code === "Tab") {
            document.querySelectorAll(".color_picker").forEach(cp => {
                cp.classList.remove("open");
                cp.replaceChildren();
            });
        }
    });

    let table = document.getElementById("game_table");
    let callback = (mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === "characterData") {
                updateScore();
            }
        }
    };
      
    let observer = new MutationObserver(callback);
      
    observer.observe(table, {
        childList: true,
        subtree: true,
        characterData: true
    });
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
    NUM_PLAYERS = parseInt(document.getElementById("player_count_input").value);
    GOAL_SCORE = parseInt(document.getElementById("goal_score_input").value);
    ROUND = 0;
    console.log(`players: ${NUM_PLAYERS}, goal score: ${GOAL_SCORE}`);
    document.getElementById("intro").style.display = "none";
    document.getElementById("game").style.display = "flex";

    // create skeleton of table
    let gameTable = document.getElementById("game_table");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");
    let tfoot = document.createElement("tfoot");
    let nr = document.createElement("tr");
    let nr2 = document.createElement("tr");
    let header = document.createElement("th");
    header.colSpan = 2;
    header.id = "round_header";
    header.textContent = "Round";
    let footer = document.createElement("th");
    footer.colSpan = 2;

    nr.appendChild(header);
    thead.appendChild(nr);
    nr2.appendChild(footer);
    tfoot.appendChild(nr2);
    gameTable.appendChild(thead);
    gameTable.appendChild(tbody);
    gameTable.appendChild(tfoot);

    createPlayers();
    for (let r = 0; r < MAX_ROUNDS; r++) { createRound(); }
    addButtonTray();
}

function createPlayers() {

    for (let i = 0; i < NUM_PLAYERS; i++) {
        addPlayer();
    }
}

function addPlayer() {

    let headRow = document.querySelector("#game_table thead tr");
    let footRow = document.querySelector("#game_table tfoot tr");

    // HEADER
    let newCol = document.createElement("th");
    let playerNum = PLAYERS_ADDED + 1;
    newCol.classList.add("player_name_cell");
    newCol.textContent = `Player ${PLAYERS_ADDED+1}`;
    newCol.contentEditable = "true";
    newCol.tabIndex = "0";
    newCol.style.backgroundColor = PLAYER_COLORS[PLAYERS_ADDED];
    newCol.id = `P${PLAYERS_ADDED+1}_NAME`;
    newCol.addEventListener("focus", function() {
        let range = document.createRange();
        range.selectNodeContents(this);
        
        let selection = window.getSelection();
        selection.removeAllRanges(); 
        selection.addRange(range);

        // COLOR PICKER
        chooseColor(newCol.getBoundingClientRect(), playerNum);
    });

    headRow.appendChild(newCol);

    // FOOTER
    let newFoot = document.createElement("th");
    newFoot.textContent = "0";
    newFoot.contentEditable = false;
    newFoot.tabIndex = "-1";
    newFoot.style.backgroundColor = PLAYER_COLORS[PLAYERS_ADDED];
    newFoot.id = `P${PLAYERS_ADDED+1}_SCORE`;
    newFoot.classList.add("player_totaler");

    footRow.appendChild(newFoot);

    PLAYERS_ADDED += 1;

}

function addNewPlayer() {
    NUM_PLAYERS += 1;
    addPlayer();
    addRounds(NUM_PLAYERS);
}

function chooseColor(rect, player) {

    let colorPicker = document.createElement("div");
    colorPicker.id = `P${player}_COLOR_PICKER`;
    colorPicker.classList.add("color_picker", "open");
    colorPicker.style.position = "fixed";
    colorPicker.style.top = `${rect.bottom}px`
    colorPicker.style.left = `${rect.left}px`;
    colorPicker.style.width = `${rect.width}px`;
    colorPicker.style.height = `${rect.height}px`;

    let colorX = rect.width / 8;
    let colorY = rect.height;
    
    for (let i = 0; i < PLAYER_COLORS.length; i++) {
        let colorSlice = document.createElement("div");
        colorSlice.id = `P${player}_COLOR_SLICE_${i}`;
        colorSlice.classList.add("color_slice");
        colorSlice.style.position = "absolute";
        colorSlice.style.top = `0px`;
        colorSlice.style.left = `${i * colorX}px`;
        colorSlice.style.width = `${colorX}px`;
        colorSlice.style.height = `${colorY}px`;
        colorSlice.style.backgroundColor = `${PLAYER_COLORS[i]}`;
        colorSlice.addEventListener("click", function(e) { colorSliceChooser(e, player, i); });
        colorPicker.appendChild(colorSlice);
    }
    
    document.body.appendChild(colorPicker);

}

function colorSliceChooser(event, player, colorIndex) {
    console.log(`player ${player} chooses color #${colorIndex+1}`);

    let table = document.getElementById("game_table");
    let headerLength = table.rows[0].cells.length;
    for (let i = 0; i < table.rows.length; i++) {
        if (table.rows[i].cells.length > headerLength) {
            table.rows[i].cells[player+1].style.backgroundColor = PLAYER_COLORS[colorIndex];
        } else {
            if(!table.rows[i].cells[player].id.includes("TOTAL")) {
                table.rows[i].cells[player].style.backgroundColor = PLAYER_COLORS[colorIndex];
            }
            
        }
    }
    event.target.parentNode.classList.remove("open");
    event.target.parentNode.replaceChildren();

}

function addRounds(pIndex) {

    let tableBody = document.querySelector("#game_table tbody");

    counter = 1;
    for (let i = 0; i < tableBody.rows.length; i++) {
        let round = Math.floor(i / 3) + 1;
        console.log(round);
        let row = tableBody.rows[i];
        let td = document.createElement("td");
        if (counter === 1) {
            td.contentEditable = "true";
            td.tabIndex = "0";
            td.style.backgroundColor = PLAYER_COLORS[pIndex-1];
            td.id = `P${pIndex}_SUB_ROUND${round.toString().padStart(PADDING, "0")}`;
        } else if (counter === 2) {
            td.contentEditable = "true";
            td.tabIndex = "0";
            td.style.backgroundColor = PLAYER_COLORS[pIndex-1];
            td.id = `P${pIndex}_ADD_ROUND${round.toString().padStart(PADDING, "0")}`;
        } else {
            td.contentEditable = "false";
            td.tabIndex = "-1";
            td.style.backgroundColor = "#5E3023";
            td.textContent = "0";
            td.classList.add("player_summer");
            td.id = `P${pIndex}_TOTAL_ROUND${round.toString().padStart(PADDING, "0")}`;
        }
        row.appendChild(td);
        counter += 1;
        if (counter > 3) { counter = 1; }
    }
}

function createRound() {

    ROUND += 1;

    let tableBody = document.querySelector("#game_table tbody");

    let newRow = document.createElement("tr");
    let roundCol = document.createElement("td");
    roundCol.rowSpan = "3";
    roundCol.textContent = `${ROUND}`;
    roundCol.tabIndex = "-1";

    newRow.appendChild(roundCol);

    for (let r = 0; r < 3; r++) {
        if (r === 0) {
            for (let i = 0; i < parseInt(NUM_PLAYERS)+1; i++) {
                let newCol = document.createElement("td");
                if (i === 0) {
                    newCol.classList.add("math_column");
                    newCol.contentEditable = "false";
                    newCol.tabIndex = "-1";
                    newCol.style.backgroundColor = "#5E3023";
                    newCol.id = `MATH_SUB_ROUND${ROUND.toString().padStart(PADDING, "0")}`;
                    newCol.textContent = "-";
                } else {
                    newCol.contentEditable = "true";
                    newCol.tabIndex = "0";
                    newCol.style.backgroundColor = PLAYER_COLORS[i-1];
                    newCol.id = `P${i}_SUB_ROUND${ROUND.toString().padStart(PADDING, "0")}`;
                }
                newRow.appendChild(newCol);
            }
            tableBody.appendChild(newRow);
        } else {
            let newRowX = document.createElement("tr");
            for (let i = 0; i < parseInt(NUM_PLAYERS)+1; i++) {
                let newCol = document.createElement("td");
                if (i === 0) {
                    newCol.classList.add("math_column");
                    newCol.contentEditable = "false";
                    newCol.tabIndex = "-1";
                    newCol.style.backgroundColor = "#5E3023";
                    if (r === 1) {
                        newCol.textContent = "+";
                        newCol.id = `MATH_ADD_ROUND${ROUND.toString().padStart(PADDING, "0")}`;
                    } else {
                        newCol.textContent = "=";
                        newCol.id = `MATH_TOTAL_ROUND${ROUND.toString().padStart(PADDING, "0")}`;
                    }
                } else {
                    if (r === 1) {
                        newCol.style.backgroundColor = PLAYER_COLORS[i-1];
                        newCol.contentEditable = "true";
                        newCol.tabIndex = "0";
                        newCol.id = `P${i}_ADD_ROUND${ROUND.toString().padStart(PADDING, "0")}`;
                    } else {
                        newCol.style.backgroundColor = "#5E3023";
                        newCol.contentEditable = "false";
                        newCol.tabIndex = "-1";
                        newCol.textContent = "0";
                        newCol.classList.add("player_summer");
                        newCol.id = `P${i}_TOTAL_ROUND${ROUND.toString().padStart(PADDING, "0")}`;
                    }
                }
                newRowX.appendChild(newCol);
            }
            tableBody.appendChild(newRowX);
        }
    }
}

function updateScore() {

    document.querySelectorAll(".player_totaler").forEach(totaler => {

        let playerTotaler = totaler.id.slice(0,2);
        var playerTotalSum = 0;

        document.querySelectorAll(".player_summer").forEach(summer => {

            let playerNum = summer.id.slice(0,2);
            let round = summer.id.slice(-5)
    
            let sub = parseInt(document.getElementById(`${playerNum}_SUB_ROUND${round}`).textContent) || 0;
            let add = parseInt(document.getElementById(`${playerNum}_ADD_ROUND${round}`).textContent) || 0;
    
            summer.textContent = `${add - sub}`;

            if (playerTotaler === playerNum) {
                playerTotalSum += (add - sub);
            }
        });

        totaler.textContent = `${playerTotalSum}`;

    });
}

function addButtonTray() {
    document.getElementById("button_container").style.display = "flex";
}

function endGame() {
    document.getElementById("intro").style.display = "flex";
    document.getElementById("game").style.display = "none";
    document.getElementById("game_table").replaceChildren();
    document.getElementById("button_container").style.display = "none";
    document.getElementById("results").style.display = "none";
    PLAYERS_ADDED = 0;
}

function finishGame() {
    document.getElementById("game").style.display = "none";
    document.getElementById("button_container").style.display = "none";
    document.getElementById("results").style.display = "flex";

    createChart();
}

function createChart() {

    let players = [];
    for (let p = 1; p <= PLAYERS_ADDED; p++) {
        let nameCell = document.getElementById(`P${p}_NAME`);
        players.push({
            name: nameCell.textContent.trim() || `Player ${p}`,
            color: nameCell.style.backgroundColor,
            deltas: []
        });
    }

    let lastRound = 0;
    for (let r = 1; r <= MAX_ROUNDS; r++) {
        let id = r.toString().padStart(PADDING, "0");
        players.forEach((pl, i) => {
            let subText = document.getElementById(`P${i+1}_SUB_ROUND${id}`).textContent.trim();
            let addText = document.getElementById(`P${i+1}_ADD_ROUND${id}`).textContent.trim();
            if (subText !== "" || addText !== "") { lastRound = r; }
            pl.deltas.push((parseInt(addText) || 0) - (parseInt(subText) || 0));
        });
    }

    players.forEach(pl => {
        let total = 0;
        pl.scores = [0];
        pl.deltas.slice(0, lastRound).forEach(d => {
            total += d;
            pl.scores.push(total);
        });
    });

    /// CHART CREATION

    
    if (scoreChart) { scoreChart.destroy(); }
    Chart.defaults.color = "#FFF";
    Chart.defaults.font.size = 16;
    

    let datasets = players.map(pl => ({
        label: pl.name,
        data: pl.scores,
        borderColor: pl.color,
        backgroundColor: pl.color,
        tension: 0.2
    }));

    // optional goal line
    datasets.push({
        label: "Goal",
        data: Array(lastRound + 1).fill(GOAL_SCORE),
        borderColor: "#888",
        borderDash: [6, 6],
        pointRadius: 0
    });

    scoreChart = new Chart(document.getElementById("scores_chart"), {
        type: "line",
        data: {
            labels: Array.from({ length: lastRound + 1 }, (_, i) => i),
            datasets
        },
        options: {
            scales: {
                x: { title: { display: true, text: "Round" } },
                y: { title: { display: true, text: "Score" } }
            },
            plugins: {
                legend: {
                    labels: {
                        filter: function(item, data) {
                            return item.text !== "Goal";
                        }
                    }
                }
            },
            animation: {
                duration: 3000
            }
        }
    });
}