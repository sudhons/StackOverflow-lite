const formInputs = document.querySelectorAll('form input');

const inputFocused = (e) => {
    e.target.previousElementSibling.className = 'label';
};

const inputBlurred = (e) => {
    const inputField = e.target;
    
    if(inputField.value.length === 0)
    inputField.previousElementSibling.className = 'placeholder';
};

formInputs.forEach((input) => {
    input.addEventListener('focus', inputFocused);
    input.addEventListener('blur', inputBlurred);
});
