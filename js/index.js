import fetchFromApi from "./components/fetchFromApi.js";
import { baseUrl } from "./components/apiInfo.js";
import displayPostShowcase from "./components/displayPostShowcase.js";
import showError from "./components/showError.js";

const posts = await fetchFromApi(`${baseUrl}posts?per_page=20`);
const categories = await fetchFromApi(`${baseUrl}categories?per_page=20`);

const carousel = document.querySelector(".carousel .content");
const backBtns = document.querySelectorAll(".back");
const nextBtns = document.querySelectorAll(".next");
const placements = document.querySelectorAll(".carousel .controls .placement");

try {
    const numberOfPosts = posts.length;
    const numberOfPostsToShow = 3;
    let firstPostIndex = 0;
    
    document.querySelectorAll(".carousel .controls button").forEach((btn) => {
        btn.addEventListener("click", (event) => {
            showCarousel(event.currentTarget.className);
        });
    });
    
    function showCarousel(btn = ""){
        if(btn){
            firstPostIndex = (btn === "next") ? (firstPostIndex += numberOfPostsToShow) : (firstPostIndex -= numberOfPostsToShow);
            if(window.innerWidth <= 800){
                document.querySelector(".carousel").scrollIntoView();
            }
        }

        carousel.innerHTML = "";
        let i;
        for(i = firstPostIndex; i < firstPostIndex + numberOfPostsToShow; i++){
            if(i < numberOfPosts){
                displayPostShowcase(carousel, posts[i], categories);
            }
            else{
                break;
            }
        }

        manageBtns(nextBtns, (i >= numberOfPosts));
        manageBtns(backBtns, (firstPostIndex <= 0));

        let placementHtml = `<div class="showcase">`;
        for(let j = 0; j < Math.ceil(numberOfPosts/numberOfPostsToShow); j++){
            placementHtml += (j === firstPostIndex/numberOfPostsToShow) ? `<div class="current"></div>` : "<div></div>";
        }
        placementHtml += "</div>";

        placements.forEach((placement) => {
            placement.innerHTML = placementHtml;
        });
    }

    function manageBtns(btns, disabled = false){
        btns.forEach((btn) => {
            btn.disabled = disabled;
            if(disabled){
                btn.classList.add("disabled");
            }
            else{
                btn.classList.remove("disabled");
            }
        });
    }
    
    showCarousel();
}
catch (error) {
    showError(document.querySelector(".carousel"), "Could not load latest blog posts.");
}