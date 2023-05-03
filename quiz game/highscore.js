const highScoresList = document.getElementById('highScoresList')
const highScores = JSON.parse(localStorage.getItem("highScores")) || []; //get highscores out of local storage 
                                                                        //|| [] it's to give empty array if not working

//from highScores create a new array with < li> populated with the names and scores                                                                   
highScoresList.innerHTML = highScores
    .map(score => {
        return `<li class="high-score">${score.name} - ${score.score}</li>`;
    })
    .join(""); //transform the return into string