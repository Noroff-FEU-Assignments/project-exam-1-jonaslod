import fetchFromApi from "./components/fetchFromApi.js";
import checkUndefined from "./components/checkUndefined.js";
import findInCategories from "./components/findInCategories.js";
import showError from "./components/showError.js";
import postToApi from "./components/postToApi.js";

const queryString = document.location.search;
const parameters = new URLSearchParams(queryString);
const id = parameters.get("id");

const post = await fetchFromApi(`https://marieogjonas.com/jonas/skole/the-library/wp-json/wp/v2/posts/${id}`);
const categories = await fetchFromApi("https://marieogjonas.com/jonas/skole/the-library/wp-json/wp/v2/categories?per_page=20");
const pageContent = document.querySelector(".post-content");
const form = document.querySelector("form");
form.addEventListener("submit", postComment);
const feedback = document.querySelector(".feedback");
const modal = document.querySelector(".modal");

try {
    const title = checkUndefined(post.title.rendered, " title");
    const postCategories = checkUndefined(post.categories, " categories");
    const date = checkUndefined(post.date, " date");
    const year = date.slice(0,4);
    const month = date.slice(5,7);
    const day = date.slice(8,10);
    const content = checkUndefined(post.content.rendered, " content");

    document.title = `${title} | The Library`;

    pageContent.innerHTML = `
        <h1>${title}</h1>
        <div class="categories"><img src="../images/icon/category-icon.png" alt="List of categories"/>${findInCategories(postCategories, categories)}</div>
        <div class="date"><img src="images/icon/date-icon.png" alt="Post date"/>${day}/${month}/${year}</div>
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
            const url = `https://marieogjonas.com/jonas/skole/the-library/wp-json/wp/v2/comments?post=${id}`;
            const username = "Jonas";
            const password = "XX7M OYKI 5Q7s psSn 3N4W lg7r";
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
                    "Authorization": `Basic ${btoa(username + ":" + password)}`
                }
            }
    
            const responseStatus = await postToApi(url, options);
            console.log(responseStatus);
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
    const commentsHeader = document.querySelector(".comments h3");
    commentsHeader.innerHTML = `<h3>Loading ...</h3>`;
    const commentsWrapper = document.querySelector(".posted-comments");
    commentsWrapper.innerHTML = "";
    const postedComments = await fetchFromApi(`https://marieogjonas.com/jonas/skole/the-library/wp-json/wp/v2/comments?post=${id}`);

    try {
        commentsHeader.innerHTML = `<h3>Comments</h3>`;
        if(typeof postedComments === "object" && postedComments.length>0){
            postedComments.forEach((comment) => {
                commentsWrapper.innerHTML += `
                    <div class="comment">
                        <p class="author">${comment.author_name} says:</p>
                        ${comment.content.rendered}
                    </div>
                `;
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