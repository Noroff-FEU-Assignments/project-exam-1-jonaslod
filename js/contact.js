const form = document.querySelector("form");
const formError = document.getElementById("form-error");
form.addEventListener("submit", validateForm);

const name = document.getElementById("name");
const nameError = document.getElementById("form-error_name");
let nameIsValid;
name.addEventListener("blur", () => nameIsValid = validateInput(validateLength(name.value, 5), name, nameError));

const email = document.getElementById("email");
const emailError = document.getElementById("form-error_email");
let emailIsValid;
email.addEventListener("blur", () => emailIsValid = validateInput(validateEmail(email.value), email, emailError));

const subject = document.getElementById("subject");
const subjectError = document.getElementById("form-error_subject");
let subjectIsValid;
subject.addEventListener("blur", () => subjectIsValid = validateInput(validateLength(subject.value, 15), subject, subjectError));

const message = document.getElementById("message");
const messageError = document.getElementById("form-error_message");
let messageIsValid;
message.addEventListener("blur", () => messageIsValid = validateInput(validateLength(message.value, 25), message, messageError));

function validateForm(event){
    event.preventDefault();

    if(nameIsValid && emailIsValid && subjectIsValid && messageIsValid){
        formError.style.display = "none";
        document.querySelector(".feedback").innerHTML = `
            <span class="bold">Message sent!</span>
        `;
    }

    else{
        formError.style.display = "block";
        if(!nameIsValid){showError(name, nameError)}
        if(!emailIsValid){showError(email, emailError)}
        if(!subjectIsValid){showError(subject, subjectError)}
        if(!messageIsValid){showError(message, messageError)}
    }
}

function validateInput(validation, input, errorContainer){
    if(validation){
        input.style.border = "1px solid #1C0E09";
        errorContainer.style.display = "none";
        return true;
    }
    else{
        showError(input, errorContainer);
        return false;
    }
}

function showError(input, errorContainer){
    input.style.border = "1px solid #F00";
    errorContainer.style.display = "block";
}

function validateLength(value, length){
    if(value.trim().length > length){
        return true;
    }
    else{
        return false;
    }
}

function validateEmail(email){
    const regularExpression = /\S+@\S+\.\S+/;
    const match = regularExpression.test(email);
    return match;
}