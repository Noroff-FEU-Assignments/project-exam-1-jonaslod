import fetchFromApi from "./components/fetchFromApi.js";
import { baseUrl, username, applicationPassword } from "./components/apiInfo.js";
import checkUndefined from "./components/checkUndefined.js";
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
    let date = checkUndefined(post.date, " date");
    if(date!="undefined date"){
        const year = date.slice(0,4);
        const month = date.slice(5,7);
        const day = date.slice(8,10);
        date = `${day}/${month}/${year}`;
    }
    const content = checkUndefined(post.content.rendered, " content");

    document.title = `${title} | The Library`;

    pageContent.innerHTML = `
        <h1>${title}</h1>
        <div class="categories"><img src="../images/icon/category-icon.png" alt="List of categories"/>${findInCategories(postCategories, categories)}</div>
        <div class="date"><img src="images/icon/date-icon.png" alt="Post date"/>${date}</div>
        ${content}
    `;

    const images = document.querySelectorAll(".post-content figure img");

    images.forEach((image) => {
        image.addEventListener("click", (event) => {
            showModal(event.target);
        });
    });

    document.querySelector(".post-comments").style.display = "block";

    modal.addEventListener("click", (event) => {
        if(event.target.className != "image-showcase"){
            modal.style.display = "none";
        }
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
}
catch (error) {
    showError(pageContent, "Blog post could not be found.");
}

async function postComment(event){
    event.preventDefault();

    const name = document.querySelector("#author_name").value;
    const comment = document.querySelector("#content").value;

    if(name.trim() && comment.trim()){
        feedback.innerHTML = `<span class="italic">Loading ...</span>`;
        try {
            const url = `${baseUrl}comments?post=${id}`;
            const formData = JSON.stringify({
                author_name: name,
                content: comment,
                status: "approved"
            });

            const options = {
                method: "POST",
                body: formData,
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
        catch (error) {
            showError(feedback, "An error occurred while trying to post your comment, try again later.");
            console.log(error);
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
        if(typeof postedComments === "object" && postedComments.length>0){
            postedComments.forEach((comment) => {
                let commentAuthor = checkUndefined(comment.author_name, " author");
                let commentContent = checkUndefined(comment.content.rendered.replaceAll("<p>", "").replaceAll("</p>", ""), " comment");

                const authorWrapper = document.createElement("div");
                authorWrapper.setAttribute("class", "author");
                authorWrapper.innerHTML = `<div class="profile-image"><img src="images/icon/profile-icon.png" alt="Profile icon"/></div>`;

                const author = document.createElement("p");
                author.innerText = commentAuthor + " says:";
                authorWrapper.appendChild(author);

                const commentWrapper = document.createElement("p");
                commentWrapper.innerText = commentContent;

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
    catch (error) {
        showError(document.querySelector(".comments"), "Comments could not be loaded.");
    }
}

showComments();