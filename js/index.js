import fetchFromApi from "./components/fetchFromApi.js";
import { baseUrl } from "./components/apiInfo.js";
import displayPostShowcase from "./components/displayPostShowcase.js";
import showError from "./components/showError.js";

const posts = await fetchFromApi(`${baseUrl}posts?per_page=20`);
const categories = await fetchFromApi(`${baseUrl}categories?per_page=20`);

const carousel = document.querySelector(".carousel .content");
const controlsTop = document.querySelector(".controls-top");

try {
    const numberOfPostsToShow = 3;
    let firstPostIndex = 0;
    
    document.querySelectorAll(".carousel .controls button").forEach((btn) => {
        btn.addEventListener("click", (event) => {
            moveCarousel(event.currentTarget)
        });
    });

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
        for(let i = firstPostIndex; i < (firstPostIndex + numberOfPostsToShow); i++){
            if(i < posts.length){
                displayPostShowcase(carousel, posts[i], categories);
            }
            else{
                controlsTop.classList.add("hidden");
                break;
            }
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

        document.querySelectorAll(".carousel .controls .placement").forEach((placement) => {
            placement.innerHTML = placementHtml;
        });
    }
    
    showCarousel();
}
catch (error) {
    showError(document.querySelector(".carousel"), "Could not load latest blog posts.");
}