const highScoresList = document.getElementById('highScoresList');
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

console.log(highScores);
console.log(highScoresList);

// записываем в innerHTML результат метода map(), который делает элемент <li> из каждого результата списка при помощи строковой интерполяции. Потом получившийся массив склеивается при помощи метода join и вставляется как html код прямо на страницу в список <ul> с айди highScoresList
highScoresList.innerHTML = highScores.map( score => {
    return `<li class='highScoresList__item'>${score.name} : ${score.score}</li>`
}).join('');
