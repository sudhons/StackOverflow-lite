const questionField = document.getElementById('post-question');

const showQuestionField = (e) => {
  e.preventDefault();
  questionField.style.display = questionField.style.display == 'block' ? 'none' : 'block';
}

document.getElementById('ask').addEventListener('click', showQuestionField);
