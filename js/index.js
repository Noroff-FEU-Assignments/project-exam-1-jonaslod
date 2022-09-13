import fetchFromApi from "./components/fetchFromApi.js";
import findInCategories from "./components/findInCategories.js";
import checkUndefined from "./components/checkUndefined.js";
import showError from "./components/showError.js";

const posts = await fetchFromApi("https://marieogjonas.com/jonas/skole/the-library/wp-json/wp/v2/posts?per_page=20");
const categories = await fetchFromApi("https://marieogjonas.com/jonas/skole/the-library/wp-json/wp/v2/categories?per_page=20");

const carousel = document.querySelector(".carousel .content");
const controlBtns = document.querySelectorAll(".carousel .controls button");
const placementShowcases = document.querySelectorAll(".carousel .controls .placement");
const controlsTop = document.querySelector(".controls-top");

try {
    controlBtns.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            moveCarousel(event.currentTarget)
        });
    });
    const numberOfPostsToShow = 3;
    let firstPostIndex = 0;

    function moveCarousel(movement){
        if(movement.className === "cta next"){
            firstPostIndex += numberOfPostsToShow;
            if(firstPostIndex >= posts.length){
                firstPostIndex = 0;
            }
        }
        else{
            firstPostIndex -= numberOfPostsToShow;
            if(firstPostIndex < 0){
                //Calculate the index of the first post in the last pair of posts (each pair containing numberOfPostsToShow posts)
                const pairs = posts.length / numberOfPostsToShow;
                const decimal = pairs - Math.floor(pairs);
                firstPostIndex = posts.length - (numberOfPostsToShow * decimal);
            }
        }
        showCarousel();
        if(window.innerWidth < 800){
            document.querySelector(".carousel").scrollIntoView();
        }
    }
    
    function showCarousel(){
        controlsTop.classList.remove("hidden");
        carousel.innerHTML = "";
        let carouselIndex = firstPostIndex;
        while(carouselIndex < (firstPostIndex + numberOfPostsToShow)){
            if(carouselIndex < posts.length){
                const post = posts[carouselIndex];
                const id = checkUndefined(post.id);
                const title = checkUndefined(post.title.rendered, " title");
                const postCategories = checkUndefined(post.categories, " categories");
                const excerpt = checkUndefined(post.excerpt.rendered, " excerpt");
                const date = checkUndefined(post.date, " date");
                const year = date.slice(0,4);
                const month = date.slice(5,7);
                const day = date.slice(8,10);
    
                carousel.innerHTML += `
                    <a class="post" href="post.html?id=${id}">
                        <h3>${title}</h3>
                        <div class="categories"><img src="images/icon/category-icon.png" alt="Post category"/>${findInCategories(postCategories, categories)}</div>
                        <div class="date"><img src="images/icon/date-icon.png" alt="Post date"/>${day}/${month}/${year}</div>
                        ${excerpt}
                    </a>
                `;
            }
            else{
                controlsTop.classList.add("hidden");
                break;
            }
            carouselIndex++;
        }

        let placementHtml = `<div class="showcase">`;
        for(let i = 0; i < Math.ceil(posts.length/numberOfPostsToShow); i++){
            if(i === firstPostIndex/numberOfPostsToShow){
                placementHtml += `<div class="current"></div>`;
            }
            else{
                placementHtml += "<div></div>";
            }
        }
        placementHtml += "</div>";

        placementShowcases.forEach((placement) => {
            placement.innerHTML = placementHtml;
        });
    }
    
    showCarousel();
}
catch (error) {
    showError(document.querySelector(".carousel"), "Could not load latest blog posts.");
}