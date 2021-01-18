const username = document.querySelector('#username-input');
const saveScoreButton = document.querySelector('#save-score-btn');
const finalScore = document.querySelector('#final-score');
const mostRecentScore = localStorage.getItem('mostRecentScore');

// константа для максимального количества людей в списках лидеров
const MAX_HIHG_SCORES = 3;

// если есть результаты викторины то достаем их из локал стоража(предварительно распарсив JSON строчку), если их нет то константе присваевается пустой массив, который потом будет заполняться результатми викторины.
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

// рендерим результат прошедшей викторины
finalScore.innerHTML = mostRecentScore;

// вешаем слушатель на инпут, keyup - событие клавиша отжата
username.addEventListener('keyup', (e) => { 
    // снимаем disabled с кнопки сохранения, при появлении любого значения в поле инпута!
    saveScoreButton.disabled = !username.value; 
})

// функция, которая вызывается по клику кнопки Save
const saveHighScore = (e) => {
    e.preventDefault();

    // создаем объект для записи имени участника и его результата
    const score = {
        score: mostRecentScore,
        name: username.value
    }

    // добавляем в массив highScores результат участника викторины (объект c 2 свойствами) при помощи метода push()
    highScores.push(score);

    //теперь массив нужно отсортировать по возрастанию для таблицы лидеров при помощи метода sort(function) довольно мудренно работает! При числовом сравнении в порядке возрастания удобно вычитать из второго аргумента первый ( если разница больше нуля то b ставиться выше a), у меня это сделано при помощи анонимной стрелочной функции.
    highScores.sort((a, b) => b.score - a.score);
    
    // список лидеров идет до макс. кол-ва. Поэтому обрезаем массив, если список уже больше заданного числа MAX_HIHG_SCORES
    highScores.splice(MAX_HIHG_SCORES);

    // после того как у нас есть массив объектов с результатами викторины, мы записываем его в локалсторедж,т.к. локал стораж может хранить только строки, то используем метод stringify для преобразования данных в JSON строку.
    localStorage.setItem('highScores', JSON.stringify(highScores));

    // уходим на главную
    window.location.assign('./index.html');
}