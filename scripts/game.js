const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.querySelector('#progress-text');
const progressBarFull = document.getElementById('progress-bar-full');
const scoreText = document.querySelector('#score');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availiableQuestions = [];

let questions = [
    {
        question: "Inside which HTML element do we put the JavaScript??",
        choice1: "<script>",
        choice2: "<javascript>",
        choice3: "<js>",
        choice4: "<scripting>",
        answer: 1
      },
      {
        question:
          "What is the correct syntax for referring to an external script called 'xxx.js'?",
        choice1: "<script href='xxx.js'>",
        choice2: "<script name='xxx.js'>",
        choice3: "<script src='xxx.js'>",
        choice4: "<script file='xxx.js'>",
        answer: 3
      },
      {
        question: " How do you write 'Hello World' in an alert box?",
        choice1: "msgBox('Hello World');",
        choice2: "alertBox('Hello World');",
        choice3: "msg('Hello World');",
        choice4: "alert('Hello World');",
        answer: 4
      }
];

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

const startGame = () => {
    questionCounter = 0;
    score = 0;
    availiableQuestions = [...questions];
    getNewQuestion();
}

const getNewQuestion = () => {
    if (availiableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) { // проверка на конец игры
        localStorage.setItem('mostRecentScore', score); // записываем в localstorage ключ 'mostRecentScore' и передаем значение score. Чтобы потом получить макс счет для занесения в результаты!
       
        return window.location.assign('./end.html') // go to end page
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`; // счетчик вопросов
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`; // прогресс бар - заполнение по мере прохождения
    progressBarFull.style.backgroundColor = `rgba(86,165,235,${questionCounter / MAX_QUESTIONS})`; // прогресс бар - изменение яркости цвета по мере прохождения

    const questionIndex = Math.floor(Math.random()*availiableQuestions.length); // рандомныйй инлекс вопроса
    currentQuestion = availiableQuestions[questionIndex]; // текущий вопрос
    question.innerText = currentQuestion.question; // подставили вопрос в html страницы

    choices.forEach( choice => { // подставляем каждый вариант ответа в html страницы
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    })
    
    availiableQuestions.splice(questionIndex, 1); // вырезаем вопрос из массива вопросов
    acceptingAnswers = true; 
}

choices.forEach( choice => {  // добавляем слушатели событий на каждый вариант ответа
    choice.addEventListener('click', e => {
        if (!acceptingAnswers) return;
        
        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        console.log(selectedAnswer);
        console.log(currentQuestion.answer);
        
        // сравниваем  выбранный ответ  с верным и добавляем класс родителю!
        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'; 
        selectedChoice.parentElement.classList.add(classToApply);

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        // таймут для подстветки ответа - верно или неверно, потом удаление класса у эл-та и след. вопрос
        setTimeout(()=>{
            selectedChoice.parentElement.classList.remove(classToApply);
            // новый вопрос!
            getNewQuestion();
        }, 700)
    });
})

const incrementScore = (num) => { // функция по подсчету очков
    score += num;
    scoreText.innerText = score;
}

// запуск игры - без выполнения функции весь html будет статикой из вертски!
startGame();