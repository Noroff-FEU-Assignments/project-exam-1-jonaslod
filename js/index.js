import fetchApi from "./components/fetchApi.js";
import { baseUrl } from "./components/apiInfo.js";
import displayPostShowcase from "./components/displayPostShowcase.js";
import showError from "./components/showError.js";

const carouselWrapper = document.querySelector(".carousel");
const carousel = document.querySelector(".carousel .content");
const backBtns = document.querySelectorAll(".back");
const nextBtns = document.querySelectorAll(".next");
const placements = document.querySelectorAll(".carousel .controls .placement");

const numberOfPostsToShow = 3;
let firstPostIndex = 0;

try {
    const posts = await fetchApi(`${baseUrl}posts?per_page=20&_embed=wp:term`);
    const numberOfPosts = posts.length;
    showCarousel();

    document.querySelectorAll(".carousel .controls button").forEach((btn) => {
        btn.addEventListener("click", (event) => {
            showCarousel(event.currentTarget.className);
        });
    });

    function showCarousel(btn = false) {
        if (btn) {
            firstPostIndex = btn === "next" ? (firstPostIndex += numberOfPostsToShow) : (firstPostIndex -= numberOfPostsToShow);
            if (window.innerWidth <= 800) {
                carouselWrapper.scrollIntoView();
            }
        }

        carousel.innerHTML = "";
        const postsToShow = posts.slice(firstPostIndex, firstPostIndex + numberOfPostsToShow);
        postsToShow.forEach((post) => displayPostShowcase(carousel, post));

        manageBtns(nextBtns, postsToShow.length < numberOfPostsToShow);
        manageBtns(backBtns, firstPostIndex <= 0);

        let placementHtml = `<div class="showcase">`;
        for (let i = 0; i < Math.ceil(numberOfPosts / numberOfPostsToShow); i++) {
            placementHtml += i === firstPostIndex / numberOfPostsToShow ? `<div class="current"></div>` : "<div></div>";
        }
        placementHtml += "</div>";
        placements.forEach((placement) => (placement.innerHTML = placementHtml));
    }

    function manageBtns(btns, disabled = false) {
        btns.forEach((btn) => {
            btn.disabled = disabled;
            if (disabled) {
                btn.classList.add("disabled");
            } else {
                btn.classList.remove("disabled");
            }
        });
    }
} catch {
    showError(carouselWrapper, "Could not load latest blog posts.");
}
