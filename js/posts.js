import fetchFromApi from "./components/fetchFromApi.js";
import findInCategories from "./components/findInCategories.js";
import checkUndefined from "./components/checkUndefined.js";
import showError from "./components/showError.js";

const posts = await fetchFromApi("https://marieogjonas.com/jonas/skole/the-library/wp-json/wp/v2/posts?per_page=20");
const categories = await fetchFromApi("https://marieogjonas.com/jonas/skole/the-library/wp-json/wp/v2/categories?per_page=20");
const listContent = document.querySelector(".list .content");
const viewMore = document.querySelector(".list .controls .cta");
const searchBtn = document.querySelector(".sort .cta");
const categoryCheckboxes = document.getElementsByName("category");
const searchInput = document.querySelector("#search");

try {
    viewMore.onclick = () => {showPosts();};
    searchBtn.onclick = () => {
        const selectedCategories = [];
        categoryCheckboxes.forEach((cat) => {
            if(cat.checked){
                selectedCategories.push(parseInt(cat.value));
            }
        });
        const search = searchInput.value.trim();
        filterPosts(selectedCategories, search);
    }

    let postsToShow = posts;
    let numberOfPostsShown = 0;

    function showPosts(){
        if(postsToShow.length>0){
            if(numberOfPostsShown === 0){
                listContent.innerHTML = "";
                viewMore.style.display = "inline-block";
            }
    
            const numberOfPostsToShow = numberOfPostsShown + 10;
            while(numberOfPostsShown < numberOfPostsToShow){
                const post = postsToShow[numberOfPostsShown];
                const id = checkUndefined(post.id);
                const title = checkUndefined(post.title.rendered, " title");
                const postCategories = checkUndefined(post.categories, " categories");
                const date = checkUndefined(post.date, " date");
                const year = date.slice(0,4);
                const month = date.slice(5,7);
                const day = date.slice(8,10);
                const excerpt = checkUndefined(post.excerpt.rendered, " excerpt");
            
                listContent.innerHTML += `
                    <a class="post" href="post.html?id=${id}">
                        <h2>${title}</h2>
                        <div class="categories"><img src="images/icon/category-icon.png" alt="List of categories"/>${findInCategories(postCategories, categories)}</div>
                        <div class="date"><img src="images/icon/date-icon.png" alt="Post date"/>${day}/${month}/${year}</div>
                        ${excerpt}
                        <p class="link">Continue reading >></p>
                    </a>
                `;
    
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
    
    function filterPosts(selectedCategories, searchValue){
        numberOfPostsShown = 0;
        let filteredPosts = posts;
        if(selectedCategories.length>0){
            filteredPosts = [];
            posts.forEach((post) => {
                for(let i = 0; i < post.categories.length; i++){
                    for(let j = 0; j < selectedCategories.length; j++){
                        if(post.categories[i] === selectedCategories[j]){
                            filteredPosts.push(post);
                            return;
                        }
                    }
                }
            });
        }
        if(search){
            filteredPosts = filteredPosts.filter(post => post.title.rendered.toLowerCase().includes(searchValue.toLowerCase()))
        }
        postsToShow = filteredPosts;
        showPosts();
    }
    
    showPosts();
}
catch (error) {
    showError(listContent, "Could not load blog posts");
}