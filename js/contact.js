import fetchApi from "./components/fetchApi.js";
import showError from "./components/showError.js";

const form = document.querySelector("form");
const formError = document.getElementById("form-error");
form.addEventListener("submit", validateForm);
const feedback = document.querySelector(".feedback");
const cta = document.querySelector("form .cta");

const name = document.getElementById("your-name");
const nameError = document.getElementById("form-error_name");
let nameIsValid;
name.addEventListener("blur", () => (nameIsValid = validateInput(validateLength(name.value, 5), name, nameError)));

const email = document.getElementById("your-email");
const emailError = document.getElementById("form-error_email");
let emailIsValid;
email.addEventListener("blur", () => (emailIsValid = validateInput(validateEmail(email.value), email, emailError)));

const subject = document.getElementById("your-subject");
const subjectError = document.getElementById("form-error_subject");
let subjectIsValid;
subject.addEventListener("blur", () => (subjectIsValid = validateInput(validateLength(subject.value, 15), subject, subjectError)));

const message = document.getElementById("your-message");
const messageError = document.getElementById("form-error_message");
let messageIsValid;
message.addEventListener("blur", () => (messageIsValid = validateInput(validateLength(message.value, 25), message, messageError)));

async function validateForm(event) {
    event.preventDefault();

    if (nameIsValid && emailIsValid && subjectIsValid && messageIsValid) {
        formError.style.display = "none";
        cta.disabled = true;
        cta.className = "cta-disabled";
        feedback.innerHTML = `
            <span class="italic">Loading ...</span>
        `;
        try {
            const url = "https://marieogjonas.com/jonas/skole/the-library/wp-json/contact-form-7/v1/contact-forms/189/feedback";
            const options = {
                method: "POST",
                body: new FormData(form),
            };
            const responseStatus = await fetchApi(url, options, false);
            if (responseStatus === 200) {
                feedback.innerHTML = `<span class="bold">Message sent!</span>`;
                form.reset();
            } else {
                feedback.innerHTML = `<span class="bold">Could not send message, try again later</span>`;
            }
        } catch {
            showError(feedback, "An error occurred while trying to send your message, try again later.");
        }
    } else {
        formError.style.display = "block";
        if (!nameIsValid) {
            showFormError(name, nameError);
        }
        if (!emailIsValid) {
            showFormError(email, emailError);
        }
        if (!subjectIsValid) {
            showFormError(subject, subjectError);
        }
        if (!messageIsValid) {
            showFormError(message, messageError);
        }
    }
}

function validateInput(validation, input, errorContainer) {
    if (validation) {
        input.style.border = "1px solid #1C0E09";
        errorContainer.style.display = "none";
        return true;
    } else {
        showFormError(input, errorContainer);
        return false;
    }
}

function showFormError(input, errorContainer) {
    input.style.border = "1px solid #F00";
    errorContainer.style.display = "block";
}

function validateLength(value, length) {
    return value.trim().length > length ? true : false;
}

function validateEmail(email) {
    const regularExpression = /\S+@\S+\.\S+/;
    const match = regularExpression.test(email);
    return match;
}
