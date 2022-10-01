export default function writeCategories(categoryList) {
    let html = "";
    if (typeof categoryList === "object" && categoryList.length > 0) {
        categoryList.forEach((cat) => {
            if (cat.name && cat.taxonomy === "category") {
                if (html.length !== 0) {
                    html += ", ";
                }
                html += cat.name;
            }
        });
    }
    return html.length > 0 ? html : categoryList;
}
