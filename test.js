
const answers = {};
let currentQuestionIndex = 1;
const totalQuestions = 6; // Update this if you add more questions

function answerQuestion(questionId, answerValue) {
            // Record the answer
            answers[questionId] = answerValue;

            // Hide the current question
            const currentQuestion = document.getElementById('question' + currentQuestionIndex);
            currentQuestion.style.display = 'none';

            // Show the next question
            currentQuestionIndex++;
            const nextQuestion = document.getElementById('question' + currentQuestionIndex);
            if (nextQuestion) {
                nextQuestion.style.display = 'block';
            } else {
                checkMentalHealth();
            }
        }

        function checkMentalHealth() {
            const result = document.getElementById('result');
            let score = 0;

            // Calculate the total score
            for (let key in answers) {
                score += answers[key];
            }

            // Display the result
            result.style.display = 'block';

            const averageScore = score / totalQuestions;

            if (averageScore >= 4) {
                result.innerHTML = '<p><strong>You might need some help.</strong> Consider talking to a professional or reaching out to a trusted person in your life.</p>';
            } else if (averageScore >= 3) {
        result.innerHTML = '<p><strong>You seem to be doing okay, but keep an eye on your well-being.</strong> Don\'t hesitate to seek help if things change.</p>';
    } else {
        result.innerHTML = '<p><strong>You seem to be doing well.</strong> Continue taking care of yourself and seek help if needed.</p>';
    }
}