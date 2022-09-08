import fetchFromApi from "./components/fetchFromApi.js";
import checkUndefined from "./components/checkUndefined.js";
import findInCategories from "./components/findInCategories.js";
import showError from "./components/showError.js";

const queryString = document.location.search;
const parameters = new URLSearchParams(queryString);
const id = parameters.get("id");

const post = await fetchFromApi(`https://marieogjonas.com/jonas/skole/the-library/wp-json/wp/v2/posts/${id}`);
const categories = await fetchFromApi("https://marieogjonas.com/jonas/skole/the-library/wp-json/wp/v2/categories?per_page=20");
const pageContent = document.querySelector(".post-content");
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

    modal.addEventListener("click", (event) => {
        if(event.target.className === "modal"){
            modal.style.display = "none";
        }
    });

    function showModal(image){
        modal.style.display = "grid";
        modal.innerHTML = `
            <div class="img-wrapper">
                <img src="${image.src}" alt="${image.alt}" />
            </div>
        `;
    }
}
catch (error) {
    showError(pageContent, "Blog post could not be found.");
}