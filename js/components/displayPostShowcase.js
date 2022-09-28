import checkUndefined from "./checkUndefined.js";
import findInCategories from "./findInCategories.js";
import formatDate from "./formatDate.js";

export default function displayPostShowcase(container, post, categories = [], showLink = false) {
    const id = checkUndefined(post.id);
    const title = checkUndefined(post.title.rendered, " title");
    const postCategories = checkUndefined(post.categories, " categories");
    const excerpt = checkUndefined(post.excerpt.rendered, " excerpt");

    container.innerHTML += `
        <a class="post" href="post.html?id=${id}">
            <h3>${title}</h3>
            <div class="categories"><img src="images/icon/category-icon.png" alt="Post category">${findInCategories(postCategories, categories)}</div>
            <div class="date"><img src="images/icon/date-icon.png" alt="Post date">${formatDate(post.date)}</div>
            ${excerpt}
            ${showLink ? `<p class="link">Continue reading &gt;&gt;</p>` : ""}
        </a>
    `;
}