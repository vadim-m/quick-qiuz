const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.querySelector('#progress-text');
const progressBarFull = document.getElementById('progress-bar-full');
const scoreText = document.querySelector('#score');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availiableQuestions = [];
let questions = [];

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;

// Чтобы начать игру нужны данные, для этого делаем запрос на список вопросов через api opentdb.Данные затем нужно будет отформатировать в нужный вид
fetch('https://opentdb.com/api.php?amount=5&category=22&difficulty=easy&type=multiple').then(res => {
    // метод .json() возращает результат парсинга тела ответа в JSON объект
    return res.json();
}).then(loadedQuestions => {
    // получив ответ в JSON виде начинаем при помощи метода map() наполнять массив questions, в котором хранятся: сам вопрос, варианты ответов, индекс правильного ответа 
    questions = loadedQuestions.results.map( loadedQuestion => {

        // создаем объект для хранения информации о вопросе(сам вопрос, правильный и неправильные ответы). Пока только присваем в него сам Вопрос. Далее наполним его остальной инфой. Метод map() создаст массив из нескольких таких объектов formattedQuestion, а затем запишет этот массив в questions
        const formattedQuestion = {
            question: loadedQuestion.question
        };

        // наполняем массив вариантов ответа сначала неправильными вариантами ответа. Тут получиться массив из 3 вариантов
        const answerChoices = [...loadedQuestion.incorrect_answers];

        // теперь нам нужно нарандомить правильный номер ответа для объекта formattedQuestion.  Т.к. в викторине 4 варанта ответа, то индексы массива вариантов  ответа [0-3], чтобы получить этот интервал можно округлять в меньшую сторону при помощи floor, но прибавляем 1 потому что в струтуре formattedQuestion варианты ответов choice начинаются не с 'choice0' а с 'choice1'. Получаем рандомный индекс правильного ответа (заведомо больше 0 как и необходимо)
        formattedQuestion.answer = Math.floor(Math.random() * 3 + 1);

        // теперь к массиву ответов добавляем на рандомный индекс правильный ответ. Здесь наоборот отнимаем единицу так как индекс массива начинается с нуля. Массив из 4 вариантов ответа готов.
        answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);

        // добавляем в объект formattedQuestion пары ключ-значение с вариантами ответа на соответствующие индексы( index + 1 для правильной нумерации choice). 
        answerChoices.forEach( (choice, index) => {
            formattedQuestion['choice' + (index + 1)] = choice;
        });
        // Теперь имеем такой вид объекта formattedQuestion:
        // {
        //     "question": "Inside which HTML element do we put the JavaScript??", - сам вопрос
        //     "choice1": "<script>",
        //     "choice2": "<javascript>",
        //     "choice3": "<js>",
        //     "choice4": "<scripting>",
        //     "answer": 1 - индекс правильного ответа
        // }

        // возвращаем отформатированный объект formattedQuestion, затем метод map склеит все полученные объеты в массив и присвоит это массив в переменную questions
        return formattedQuestion;
    });
    
    // запуск игры
    startGame();
}).catch(err => {
    console.error(err);
});

// функция началы игры
const startGame = () => {
    console.log(questions)
    questionCounter = 0;
    score = 0;
    availiableQuestions = [...questions];

    // вызываем функцию для получения нового вопроса
    getNewQuestion();
    // убираем класс хидден у блока с игрой и скрываем loader
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

// функция получения нового вопроса
const getNewQuestion = () => {
    if (availiableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) { // проверка на конец игры
        localStorage.setItem('mostRecentScore', score); // записываем в localstorage ключ 'mostRecentScore' и передаем значение score. Чтобы потом получить макс счет для занесения в результаты!

        return window.location.assign('./end.html') // go to end page
    }

    // увеличиваем на 1 счетчик вопрос и отображаем его динамически на странице
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    // прогресс бар - заполнение по мере прохождения ширины и яркости бэкграунда
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
    progressBarFull.style.backgroundColor = `rgba(86,165,235,${questionCounter / MAX_QUESTIONS})`;

    // рандомный индекс вопроса
    const questionIndex = Math.floor(Math.random() * availiableQuestions.length); 
    // текущий вопрос
    currentQuestion = availiableQuestions[questionIndex]; 
    question.innerText = currentQuestion.question; // подставили вопрос в html страницы

    // подставляем каждый вариант ответа в html страницы
    choices.forEach(choice => { 
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    })

    availiableQuestions.splice(questionIndex, 1); // вырезаем вопрос из массива вопросов
    acceptingAnswers = true;
};

// добавляем Слушатели событий при нажатии на каждый вариант ответа
choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        // сравниваем  выбранный ответ  с верным и добавляем класс родителю!
        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
        selectedChoice.parentElement.classList.add(classToApply);

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        // таймут для подстветки ответа - верно или неверно, потом удаление класса у эл-та и след. вопрос
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            // новый вопрос!
            getNewQuestion();
        }, 700)
    });
});

// функция по подсчету очков
const incrementScore = (num) => { // функция по подсчету очков
    score += num;
    scoreText.innerText = score;
};