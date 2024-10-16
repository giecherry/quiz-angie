let questions = [];

document.addEventListener('DOMContentLoaded', async () => {
    const subject = localStorage.getItem('selectedSubject');
    console.log(`Selected subject: ${subject}`);
    if (!subject) {
        window.location.href = 'index.html';
    }
    
    questions = await fetchData(subject);
    displayQuestion();
});

async function fetchData(subject) {
    let url;
    switch (subject) {
        case 'History':
            url = 'https://opentdb.com/api.php?amount=5&category=23&difficulty=easy&type=multiple';
            break;
        case 'Geography':
            url = 'https://opentdb.com/api.php?amount=5&category=22&difficulty=easy&type=multiple';
            break;
        case 'Art':
            url = 'https://opentdb.com/api.php?amount=5&category=25&difficulty=easy&type=multiple';
            break;
        default:
            console.log(`No URL found for subject: ${subject}`);
            return [];
    }

    console.log(`Fetching questions from: ${url}`);

    const response = await fetch(url);
    const data = await response.json();
    console.log(`Received data:`, data);
    return data.results;
}

let currentQuestionIndex = 0;

function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    console.log(`Displaying question ${currentQuestionIndex + 1}:`, currentQuestion.question);
    document.getElementById('question').textContent = currentQuestion.question;

    const answers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
    shuffleArray(answers);

    document.getElementById('answer1').textContent = answers[0];
    document.getElementById('answer2').textContent = answers[1];
    document.getElementById('answer3').textContent = answers[2];
    document.getElementById('answer4').textContent = answers[3];

    timer();
    document.querySelectorAll('.answer-btn').forEach(button => {
        button.addEventListener('click', () => checkAnswer(button, currentQuestion.correct_answer));
    });
}

function shuffleArray(array) {
    console.log(`Shuffling array:`);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    console.log(`Shuffled array:`, array);
}

document.getElementById('next-btn').addEventListener('click', nextQuestion);
function nextQuestion() {
    console.log('Next button clicked');
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        resetState();  
        displayQuestion(); 
    } else {
        showResults();
    }
}

let score = 0;

function checkAnswer(selectedButton, correctAnswer) {
    clearInterval(timerInterval);
    document.querySelectorAll('.answer-btn').forEach(button => {
        button.disabled = true; 
    });

    if (selectedButton.textContent === correctAnswer) {
        selectedButton.style.backgroundColor = '#88ff92';
        score++;
    } else {
        selectedButton.style.backgroundColor = '#ff5a5a';
    }

    document.getElementById('next-btn').style.display = 'inline-block'; 
    console.log('Displaying next button');
}


function showResults() {
    console.log(`Showing results. Final score: ${score}/${questions.length}`);
    document.getElementById('question-container').classList.add('hidden');
    document.getElementById('result-container').style.display = 'block';
    document.getElementById('final-score').textContent = `${score}/${questions.length}`;
}

let timerInterval;
const timeLimit = 8; 
const progressBarWidth = 100; 

function timer() {
    const progressBar = document.getElementById('progress-bar');
    let timeRemaining = timeLimit;
    let progressBarWidth = 100;
    progressBar.style.width = `${progressBarWidth}%`; 

    console.log(`Starting timer with ${timeRemaining} seconds`);

    timerInterval = setInterval(() => {
        timeRemaining--;
        progressBarWidth -= (100 / timeLimit);
        progressBar.style.width = `${progressBarWidth}%`;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            console.log('Time is up');

            document.querySelectorAll('.answer-btn').forEach(button => {
                button.disabled = true; 
                button.style.backgroundColor = 'lightgray';  
                console.log('Buttons disabled');
            });

            document.getElementById('next-btn').style.display = 'inline-block';
            console.log('Displaying next button');
        }
    }, 1000);
}

function resetState() {
    console.log('Resetting state for the next question');
    document.getElementById('next-btn').style.display = 'none';
    document.querySelectorAll('.answer-btn').forEach(button => {
        button.style.backgroundColor = '';
        button.disabled = false;
    });
    document.getElementById('progress-bar').style.width = '100%';
}

