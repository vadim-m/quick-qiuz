const username = document.querySelector('#username-input');
const saveScoreButton = document.querySelector('#save-score-btn');
const finalScore = document.querySelector('#final-score');
const mostRecentScore = localStorage.getItem('mostRecentScore');

finalScore.innerHTML = mostRecentScore;

username.addEventListener('keyup', (e) => { // слушатель на инпут, keyup - событие клавиша отжата
    saveScoreButton.disabled = !username.value; // снимаем disabled с конпки сохранения, при появлении любого значения в поле инпута!
})

const saveHighScore = (e) => {
    console.log(username.value);
    e.preventDefault();
}