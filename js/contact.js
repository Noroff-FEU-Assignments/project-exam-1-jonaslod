import postToApi from "./components/postToApi.js";

const form = document.querySelector("form");
const formError = document.getElementById("form-error");
form.addEventListener("submit", validateForm);
const feedback = document.querySelector(".feedback")

const name = document.getElementById("your-name");
const nameError = document.getElementById("form-error_name");
let nameIsValid;
name.addEventListener("blur", () => nameIsValid = validateInput(validateLength(name.value, 5), name, nameError));

const email = document.getElementById("your-email");
const emailError = document.getElementById("form-error_email");
let emailIsValid;
email.addEventListener("blur", () => emailIsValid = validateInput(validateEmail(email.value), email, emailError));

const subject = document.getElementById("your-subject");
const subjectError = document.getElementById("form-error_subject");
let subjectIsValid;
subject.addEventListener("blur", () => subjectIsValid = validateInput(validateLength(subject.value, 15), subject, subjectError));

const message = document.getElementById("your-message");
const messageError = document.getElementById("form-error_message");
let messageIsValid;
message.addEventListener("blur", () => messageIsValid = validateInput(validateLength(message.value, 25), message, messageError));

async function validateForm(event){
    event.preventDefault();

    if(nameIsValid && emailIsValid && subjectIsValid && messageIsValid){
        formError.style.display = "none";
        document.querySelector("form .cta").disabled = true;
        feedback.innerHTML = `
            <span class="italic">Loading ...</span>
        `;
        try {
            const url = "https://marieogjonas.com/jonas/skole/the-library/wp-json/contact-form-7/v1/contact-forms/140/feedback";
            const formData = new FormData(form);
            const response = await postToApi(url, "POST", formData);
            if(response === 200){
                feedback.innerHTML = `
                    <span class="bold">Message sent!</span>
                `;
            }
        }
        catch (error) {
            feedback.innerHTML = `
                <span class="bold">Could not send message.</span>
            `;
            console.log(error);
        }
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