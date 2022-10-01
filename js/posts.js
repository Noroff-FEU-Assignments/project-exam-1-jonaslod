import fetchApi from "./components/fetchApi.js";
import { baseUrl } from "./components/apiInfo.js";
import displayPostShowcase from "./components/displayPostShowcase.js";
import checkUndefined from "./components/checkUndefined.js";
import showError from "./components/showError.js";

const listContent = document.querySelector(".list .content");
const viewMore = document.querySelector(".list .controls .cta");
const searchInput = document.getElementById("search");
const categoryCheckboxes = document.getElementsByName("category");
const sortByNewRadio = document.getElementById("sort-by-new");
const searchBtn = document.querySelector(".sort .cta");
const searchFeedback = document.querySelector(".search-feedback");
let numberOfPostsShown = 0;
const numberOfPostsToShow = 10;

try {
    const allPosts = await fetchApi(`${baseUrl}posts?per_page=100&_embed=wp:term`);
    showPosts();

    viewMore.addEventListener("click", () => {
        showPosts();
    });

    searchBtn.addEventListener("click", () => {
        const search = searchInput.value.trim();
        const selectedCategories = [];
        categoryCheckboxes.forEach((cat) => {
            if (cat.checked) {
                selectedCategories.push(parseInt(cat.value));
            }
        });
        const sortByNew = sortByNewRadio.checked ? true : false;
        filterPosts(selectedCategories, search, sortByNew);
    });

    function showPosts(posts = allPosts) {
        if (posts.length > 0) {
            if (numberOfPostsShown === 0) {
                listContent.innerHTML = "";
                viewMore.style.display = "inline-block";
            }
            const postsToShow = posts.slice(numberOfPostsShown, numberOfPostsShown + numberOfPostsToShow);
            postsToShow.forEach((post) => displayPostShowcase(listContent, post, true));
            numberOfPostsShown += postsToShow.length;
            if (numberOfPostsShown >= posts.length) {
                viewMore.style.display = "none";
            }
        } else {
            listContent.innerHTML = `
                <div class="post">
                    <p>There are no posts that match your request</p>
                </div>
            `;
            viewMore.style.display = "none";
        }
    }

    function filterPosts(selectedCategories, searchValue, sortByNew = true) {
        numberOfPostsShown = 0;
        let filteredPosts = allPosts;

        if (typeof selectedCategories === "object" && selectedCategories.length > 0) {
            filteredPosts = [];
            allPosts.forEach((post) => {
                const postCategories = checkUndefined(post._embedded["wp:term"], "Uncategorized", true);
                if (typeof postCategories === "object" && postCategories.length > 0) {
                    for (let i = 0; i < postCategories.length; i++) {
                        if (postCategories[i].taxonomy === "category") {
                            for (let j = 0; j < selectedCategories.length; j++) {
                                if (postCategories[i].id === selectedCategories[j]) {
                                    filteredPosts.push(post);
                                    return;
                                }
                            }
                        }
                    }
                }
            });
        }

        if (searchValue) {
            filteredPosts = filteredPosts.filter((post) => post.title.rendered.toLowerCase().includes(searchValue.toLowerCase()));
        }

        filteredPosts.sort((a, b) => (sortByNew ? convertDate(a.date) < convertDate(b.date) : convertDate(a.date) > convertDate(b.date)));

        const feedbackHtml = document.createElement("p");
        feedbackHtml.innerHTML = "Searching through posts.";
        searchFeedback.appendChild(feedbackHtml);
        setTimeout(() => {
            searchFeedback.firstChild.remove();
        }, 5000);

        showPosts(filteredPosts);
    }

    function convertDate(dateString) {
        const lastDateIndex = dateString.indexOf("T");
        const date = dateString.substring(0, lastDateIndex);
        const convertedDate = parseInt(date.replaceAll("-", ""));
        return convertedDate;
    }
} catch {
    showError(listContent, "Could not load blog posts");
    viewMore.style.display = "none";
}
