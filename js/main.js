let game = {
    "category": null,
    "question": null,
    "points": null,
};

function init() {
    let urlParams = new URLSearchParams(window.location.search);
    let myParam = urlParams.get('quiz');

    if(myParam === "" || myParam === null) {
        myParam = 0;
    }

    showIntro(myParam);
}

function showIntro(category = 0) {
    document.getElementById('content-card').innerHTML = `
        <div class="card-body d-flex flex-column align-content-center justify-content-center">
            <h2 class="text-center">${questionPool[category]["intro"]}</h2>
            <p class="card-text text-center fs-4">Ready for the Challenge?</p>
        </div>
        <div class="d-flex justify-content-end m-4">
            <button class="btn btn-orange" onclick="newGame(${category})">START NOW ></button>
        </div>
    `;
}

function newGame(category) {
    game.category = category;
    game.question = 0;
    game.points = 0;
    showQuestion();
}

function showQuestion() {
    let content = `
        <div class="card-body d-flex flex-column align-content-center justify-content-center">
        <p class="text-center fs-3 fw-bolder">${questionPool[game.category]["questions"][game.question]["question"]}</p>
    `;

    questionPool[game.category]["questions"][game.question]["options"].forEach(function (value, index) {
        content += getQuestionOption(index, value);
    });

    content += `</div>`;

    document.getElementById('content-card').innerHTML = content;
}

function getQuestionOption(index, text) {
    return `
        <div class="card answer-option" onclick="sendAnswer(${index})">
            <div class="card-body">
                <p class="card-text text-center">${text}</p>
            </div>
        </div>
    `;
}

function sendAnswer(id) {
    let el = document.getElementsByClassName('answer-option')[id];

    if(id !== questionPool[game.category]["questions"][game.question]["a"]) {
        el.classList.add("bg-danger");
        el.classList.add("bg-gradient");
        el.classList.add("text-light");
    }
    else {
        game.points++;
    }

    showAnswer();
    disableOptions();
    window.setTimeout(nextQuestion, 1750);
}

function disableOptions() {
    let el = document.getElementsByClassName('answer-option');

    for(let i = 0; i < el.length; i++) {
        el[i].removeAttribute("onclick");
    }
}

function showAnswer() {
    let el = document.getElementsByClassName('answer-option')[questionPool[game.category]["questions"][game.question]["a"]];
    el.classList.add("bg-success");
    el.classList.add("bg-gradient");
    el.classList.add("text-light");
}

function nextQuestion() {
    if(game.question + 1 >= questionPool[game.category]["questions"].length) {
        showEndCard();
        game = {
            "category": null,
            "question": null,
            "points": null,
        };
    }
    else {
        game.question++;
        showQuestion();
    }
}

function showEndCard() {
    document.getElementById('content-card').innerHTML = `
        <img class="trophy-image" src="img/tropy.png">

        <div class="card-body d-flex flex-column align-items-center justify-content-center fs-3">
            <img class="game-over-image" src="img/brain%20result.png" alt="Quiz Completed">
            <p class="text-center fw-bold"><b>Complete<br>${questionPool[game.category]["category"]} Quiz</b></p>
            <p class="mt-3"><b><span class="text-orange">YOUR SCORE</span> <span class="p-3">${game.points}/${questionPool[game.category]["questions"].length}</span></b></p>
            <button class="btn btn-primary mt-3 ps-5 pe-5">SHARE</button>
            <button class="btn btn-outline-primary mt-3 ps-5 pe-5" onclick="window.location.reload()">REPLAY</button>
        </div>
    `;
}