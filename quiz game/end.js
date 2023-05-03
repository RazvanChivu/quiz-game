const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const mostRecentScore = localStorage.getItem('mostRecentScore')
const finalScore = document.getElementById('finalScore')

//gets highscores values from localStorage and converts it to highscores object
const highScores = JSON.parse(localStorage.getItem("highScores")) || []; 

const MAX_HIGH_SCORES = 5;
console.log(highScores);
finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value;
});

//save score button is disabled if there is no username input
saveHighScore = e => {
    console.log("clicked the save button!");
    e.preventDefault();

    const score = {
        score: mostRecentScore,
        name: username.value
    };
    highScores.push(score);
    highScores.sort( (a,b) => b.score - a.score) //sorting array method: if b higher than a then put b first
    highScores.splice(5); //this is to show only the 5 highest scores

    localStorage.setItem("highScores", JSON.stringify(highScores)); //to permamently save the highscore
    window.location.assign("/"); //go back home after saving score 
    console.log(highScores);
};