const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text")); /*takes values from each element with choice-text class*/
const progressText = document.getElementById("progressText")
const scoreText = document.getElementById("score")
const loader = document.getElementById('loader')
const game = document.getElementById('game')

let currentQuestion = {}; /*object */
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = []; /*copy of questions list */
 
let questions = [];

fetch(
    'https://opentdb.com/api.php?amount=10&category=27&difficulty=easy&type=multiple'
)
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
        
        startGame();
    })
.catch( err => {
    console.error(err); //to give error if fetch path is wrong
});

//constants 
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3; //how many questions till the end

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions]; //take the questions array and spread each of its items and put them in this new array
    console.log(availableQuestions);
    getNewQUestion();
    game.classList.remove("hidden"); //make the questions appear
    loader.classList.add("hidden"); //make the loading circle dissapear
};

getNewQUestion = () => {
    //if all questions are completed
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem("mostRecentScore", score);
        //go to the end page
        return window.location.assign("/end.html");
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;  // it will show under "Question" the questionCounter/maxQUestions

    //Update the progress bar
    console.log(questionCounter / MAX_QUESTIONS);
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    //math.random() gives us a random number, multiplying with * 3 will make the numer > than 0
    //math.floor converts a 2.34999 number to the lower int nr whi ch is 2
    const questionIndex = Math.floor(Math.random() * availableQuestions.length); 
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;
    choices.forEach( choice => {                                 //iterates through each choice
        const number = choice.dataset['number'];                //gets the number property from the html data-number
        choice.innerText = currentQuestion['choice' + number];  //gets the choices from the current choice
    })

    //this is to get rid of the question after having it so we don't answer it multiple times
    availableQuestions.splice(questionIndex, 1);

    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if(!acceptingAnswers) return; //if not acceptingAnswers then return

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];
        
        const classToApply = 
        selectedAnswer == currentQuestion.answer ? "correct" : "incorrect"; //if the selected answer matches the true answer return correct

        if (classToApply === "correct") {
            incrementScore(CORRECT_BONUS);
        }
        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply); //remove the color
            getNewQUestion(); //get to next question
        }, 1000);             //delay parameter until next question
        
    });
})

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};

