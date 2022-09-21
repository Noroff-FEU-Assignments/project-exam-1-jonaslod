import checkUndefined from "./checkUndefined.js";
import findInCategories from "./findInCategories.js";

export default function displayPostShowcase(container, post, categories = [], continueReading = false){
    const id = checkUndefined(post.id);
    const title = checkUndefined(post.title.rendered, " title");
    const postCategories = checkUndefined(post.categories, " categories");
    let date = checkUndefined(post.date, " date");
    if(date!="undefined date"){
        const year = date.slice(0,4);
        const month = date.slice(5,7);
        const day = date.slice(8,10);
        date = `${day}/${month}/${year}`;
    }
    const excerpt = checkUndefined(post.excerpt.rendered, " excerpt");
    
    container.innerHTML += `
        <a class="post" href="post.html?id=${id}">
            <h3>${title}</h3>
            <div class="categories"><img src="images/icon/category-icon.png" alt="Post category"/>${findInCategories(postCategories, categories)}</div>
            <div class="date"><img src="images/icon/date-icon.png" alt="Post date"/>${date}</div>
            ${excerpt}
            ${continueReading ? `<p class="link">Continue reading &gt;&gt;</p>` : ""}
        </a>
    `;
}