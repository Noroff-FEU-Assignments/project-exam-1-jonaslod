import fetchFromApi from "./components/fetchFromApi.js";
import { baseUrl } from "./components/apiInfo.js";
import displayPostShowcase from "./components/displayPostShowcase.js";
import findInCategories from "./components/findInCategories.js";
import showError from "./components/showError.js";

const allPosts = await fetchFromApi(`${baseUrl}posts?per_page=20`);
const categories = await fetchFromApi(`${baseUrl}categories?per_page=20`);
const listContent = document.querySelector(".list .content");
const viewMore = document.querySelector(".list .controls .cta");
const searchFeedback = document.querySelector(".search-feedback");

try {
    let numberOfPostsShown = 0;

    viewMore.onclick = () => {showPosts();};
    document.querySelector(".sort .cta").onclick = () => {
        const search = document.getElementById("search").value.trim();
        const selectedCategories = [];
        document.getElementsByName("category").forEach((cat) => {
            if(cat.checked){
                selectedCategories.push(parseInt(cat.value));
            }
        });
        const sortBy = document.getElementById("sort-by-new").checked ? "new" : "old";
        filterPosts(selectedCategories, search, sortBy);
    }

    function showPosts(postsToShow = allPosts){
        if(postsToShow.length>0){
            if(numberOfPostsShown === 0){
                listContent.innerHTML = "";
                viewMore.style.display = "inline-block";
            }
    
            const numberOfPostsToShow = numberOfPostsShown + 10;
            while(numberOfPostsShown < numberOfPostsToShow){
                displayPostShowcase(listContent, postsToShow[numberOfPostsShown], categories, true);
                numberOfPostsShown++;
                if(numberOfPostsShown === postsToShow.length){
                    viewMore.style.display = "none";
                    break;
                }
            }
        }
        else{
            listContent.innerHTML = `
                <div class="post">
                    <p>There are no posts that match your request</p>
                </div>
            `;
            viewMore.style.display = "none";
        }
    }

    function filterPosts(selectedCategories, searchValue, sortValue){
        numberOfPostsShown = 0;
        let filteredPosts = allPosts;

        const feedbackHtml = document.createElement("p");
        feedbackHtml.innerHTML = "Searching for posts";

        if(selectedCategories.length>0){
            filteredPosts = [];
            allPosts.forEach((post) => {
                for(let i = 0; i < post.categories.length; i++){
                    for(let j = 0; j < selectedCategories.length; j++){
                        if(post.categories[i] === selectedCategories[j]){
                            filteredPosts.push(post);
                            return;
                        }
                    }
                }
            });
            feedbackHtml.innerHTML += ` containing categories <span class="italic">${findInCategories(selectedCategories, categories).replaceAll(",", " /")}</span>`;
        }
        if(searchValue){
            filteredPosts = filteredPosts.filter(post => post.title.rendered.toLowerCase().includes(searchValue.toLowerCase()));
            feedbackHtml.innerHTML += ` with text "<span class="italic">${searchValue}</span>"`;
        }

        if(sortValue === "new"){
            filteredPosts.sort((a,b) => convertDate(a.date) < convertDate(b.date));
        }
        else{
            filteredPosts.sort((a,b) => convertDate(a.date) > convertDate(b.date));
        }

        feedbackHtml.innerHTML += ".";
        searchFeedback.appendChild(feedbackHtml);
        setTimeout(()=>{
            searchFeedback.firstChild.remove();
        }, 5000);
        
        showPosts(filteredPosts);
    }

    function convertDate(dateString){
        const lastDateIndex = dateString.indexOf("T");
        const date = dateString.substring(0, lastDateIndex)
        const convertedDate = parseInt(date.replaceAll("-", ""));
        return convertedDate;
    }
    
    showPosts();
}
catch (error) {
    showError(listContent, "Could not load blog posts");
    viewMore.style.display = "none";
}