function startQuiz(subject) {
    localStorage.setItem('selectedSubject', subject);
    window.location.href = 'quiz.html';
}