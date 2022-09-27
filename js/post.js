import fetchFromApi from "./components/fetchFromApi.js";
import { baseUrl, username, applicationPassword } from "./components/apiInfo.js";
import checkUndefined from "./components/checkUndefined.js";
import formatDate from "./components/formatDate.js";
import findInCategories from "./components/findInCategories.js";
import showError from "./components/showError.js";
import postToApi from "./components/postToApi.js";

const queryString = document.location.search;
const parameters = new URLSearchParams(queryString);
const id = parameters.get("id");

const post = await fetchFromApi(`${baseUrl}posts/${id}`);
const categories = await fetchFromApi(`${baseUrl}categories?per_page=20`);
const pageContent = document.querySelector(".post-content");
const form = document.querySelector("form");
form.addEventListener("submit", postComment);
const feedback = document.querySelector(".feedback");
const commentsWrapper = document.querySelector(".posted-comments");
const modal = document.querySelector(".modal");

try {
    const title = checkUndefined(post.title.rendered, " title");
    const postCategories = checkUndefined(post.categories, " categories");
    const content = checkUndefined(post.content.rendered, " content");

    document.title = `${title} | The Library`;

    pageContent.innerHTML = `
        <h1>${title}</h1>
        <div class="categories"><img src="../images/icon/category-icon.png" alt="List of categories"/>${findInCategories(postCategories, categories)}</div>
        <div class="date"><img src="images/icon/date-icon.png" alt="Post date"/>${formatDate(post.date)}</div>
        ${content}
    `;

    document.querySelectorAll(".post-content figure img").forEach((image) => {
        image.addEventListener("click", (event) => {
            showModal(event.target);
        });
    });

    function showModal(image){
        modal.style.display = "grid";
        modal.innerHTML = `
            <div class="close-modal" title="Close image">
                <img src="images/icon/exit-icon.png" alt="Close modal" />
            </div>
            <div class="img-wrapper">
                <img class="image-showcase" src="${image.src}" alt="${image.alt}" />
            </div>
        `;
    }

    modal.addEventListener("click", (event) => {
        if(event.target.className != "image-showcase"){
            modal.style.display = "none";
        }
    });

    document.querySelector(".post-comments").style.display = "block";

    showComments();
}
catch {
    showError(pageContent, "Blog post could not be found.");
}

async function postComment(event){
    event.preventDefault();

    const nameInput = document.querySelector("#author_name").value;
    const commentInput = document.querySelector("#content").value;

    if(nameInput.trim() && commentInput.trim()){
        feedback.innerHTML = `<span class="italic">Loading ...</span>`;
        try {
            const url = `${baseUrl}comments?post=${id}`;
            const comment = JSON.stringify({
                author_name: nameInput,
                content: commentInput,
                status: "approved"
            });

            const options = {
                method: "POST",
                body: comment,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${btoa(username + ":" + applicationPassword)}`
                }
            }
    
            const responseStatus = await postToApi(url, options);
            
            if(responseStatus === 201){
                feedback.innerHTML = `<span class="success">Comment posted!</span>`;
                form.reset();
                showComments();
            }
            else if(responseStatus === 409){
                feedback.innerHTML = `<span class="error">Could not post comment, since comment already exists!</span>`;
            }
            else{
                feedback.innerHTML = `<span class="error">Something went wrong when trying to post your comment, try again later.</span>`;
            }

        }
        catch {
            showError(feedback, "An error occurred while trying to post your comment, try again later.");
        }
    }
    else{
        feedback.innerHTML = `<span class="error">Please enter your name and a comment</span>`;
    }
}

async function showComments(){
    commentsWrapper.innerHTML = "";
    const postedComments = await fetchFromApi(`${baseUrl}comments?post=${id}`);

    try {
        if(typeof postedComments === "object" && postedComments.length > 0){
            postedComments.forEach((postedComment) => {
                const authorName = document.createElement("span");
                authorName.setAttribute("class", "bold");
                authorName.innerText = checkUndefined(postedComment.author_name, " author");
                const author = document.createElement("p");
                author.appendChild(authorName);
                author.innerHTML += " says:";

                const date = document.createElement("p");
                date.innerText = "(" + formatDate(postedComment.date, true) + ")";

                const authorDetails = document.createElement("div");
                authorDetails.setAttribute("class", "author-details");
                authorDetails.appendChild(author);
                authorDetails.appendChild(date);

                const authorWrapper = document.createElement("div");
                authorWrapper.setAttribute("class", "author");
                authorWrapper.innerHTML = `<div class="profile-image"><img src="images/icon/profile-icon.png" alt="Profile icon"/></div>`;
                authorWrapper.appendChild(authorDetails);

                const commentWrapper = document.createElement("p");
                commentWrapper.setAttribute("class", "italic");
                commentWrapper.innerText = checkUndefined(postedComment.content.rendered.replaceAll("<p>", "").replaceAll("</p>", ""), " comment");

                const currentComment = document.createElement("div");
                currentComment.setAttribute("class", "comment");
                currentComment.appendChild(authorWrapper);
                currentComment.appendChild(commentWrapper);
                
                commentsWrapper.appendChild(currentComment);
            });
        }
    
        else{
            commentsWrapper.innerHTML = `
            <div class="comment">
                <p>There are currently no comments in this post.</p>
                <p>Why not add one yourself?</p>
            </div>`;
        }
    }
    catch {
        showError(document.querySelector(".comments"), "Comments could not be loaded.");
    }
}