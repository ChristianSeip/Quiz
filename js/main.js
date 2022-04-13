let game = {
    "category": null,
    "question": null,
    "points": null,
};

/**
 * Init Application
 */
function init() {
    let urlParams = new URLSearchParams(window.location.search);
    let myParam = urlParams.get('quiz');

    if(myParam === "" || myParam === null) {
        myParam = 0;
    }

    showIntro(parseInt(myParam));
}

/**
 * Set intro template on quiz start
 *
 * @param {int} category
 */
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
    setNavigation();
}

/**
 * Adds any game to navigation
 */
function setNavigation() {
    let listItems = '';
    questionPool.forEach((cat, index) => listItems += `<li onclick="newGame(${index})">${cat.category}</li>`);
    document.getElementById('main-navigation').innerHTML = listItems;
    setActiveNavItem();
}

/**
 * Set active game as active navigation item
 */
function setActiveNavItem() {
    let items = document.getElementById('main-navigation').children;
    let cat = game.category === null ? 0 : game.category;

    for(let i = 0; i < items.length; i++) {
        if(i === cat) {
            items[i].classList.add('nav-item-active');
            items[i].removeAttribute('onclick');
        }
        else {
            items[i].classList.remove('nav-item-active')
        }
    }
}

/**
 * Start a new game
 *
 * @param {int} category
 */
function newGame(category) {
    game.category = category;
    game.question = 0;
    game.points = 0;
    showQuestion();
}

/**
 * Display actual question template on card element
 */
function showQuestion() {
    handleProgressBar();
    let content = `
        <div class="card-body d-flex flex-column align-content-center justify-content-center">
        <p class="text-center fs-3 fw-bolder">${questionPool[game.category]["questions"][game.question]["question"]}</p>
    `;

    questionPool[game.category]["questions"][game.question]["options"].forEach((value, index) => content += getQuestionOption(index, value));

    content += `</div>`;

    document.getElementById('content-card').innerHTML = content;
}

/**
 * Get answer option template
 *
 * @param {int} index
 * @param {string} text
 * @returns {string}
 */
function getQuestionOption(index, text) {
    return `
        <div class="card answer-option" onclick="sendAnswer(${index})">
            <div class="card-body">
                <p class="card-text text-center">${text}</p>
            </div>
        </div>
    `;
}

/**
 * Send answer option by id
 *
 * @param {int} id
 */
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

/**
 * Remove onclick attribute from answer options
 */
function disableOptions() {
    let el = document.getElementsByClassName('answer-option');

    for(let i = 0; i < el.length; i++) {
        el[i].removeAttribute("onclick");
    }
}

/**
 * Display the right answer
 */
function showAnswer() {
    let el = document.getElementsByClassName('answer-option')[questionPool[game.category]["questions"][game.question]["a"]];
    el.classList.add("bg-success");
    el.classList.add("bg-gradient");
    el.classList.add("text-light");
}

/**
 * Handle request for next question (show end cart and reset game, if there is no question left)
 */
function nextQuestion() {
    if(game.question + 1 >= questionPool[game.category]["questions"].length) {
        showEndCard();
        game = {
            "category": null,
            "question": null,
            "points": null,
        };
        handleProgressBar();
    }
    else {
        game.question++;
        showQuestion();
    }
}

/**
 * Show end card
 */
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

/**
 * Handle game progress bar
 */
function handleProgressBar() {
    let div = document.getElementById('quiz-progress');

    if(game.question === null) {
        div.classList.add('visually-hidden');
        return;
    }

    div.classList.remove('visually-hidden');
    let progressBar = document.getElementsByClassName('progress-bar')[0];
    progressBar.ariaValueMax = questionPool[game.category]["questions"].length.toString();
    progressBar.ariaValueNow = (game.question+1).toString();
    progressBar.style.width = ((game.question+1 / questionPool[game.category]["questions"].length)*100).toString() + '%';
}