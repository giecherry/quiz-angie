let questions = [];

document.addEventListener('DOMContentLoaded', async () => {
    const subject = localStorage.getItem('selectedSubject');
    console.log(`Selected subject: ${subject}`);
    if (!subject) {
        window.location.href = 'index.html';
    }
    
    questions = await fetchData(subject);
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