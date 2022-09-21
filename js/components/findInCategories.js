export default function findInCategories(postCategories = [], categoryList = []){    
    let html = "";
    if(typeof postCategories === "object" && postCategories.length>0){
        postCategories.forEach((id) => {
            const category = categoryList.find(cat => cat.id === id);
            if(category){
                if(html.length!=0){
                    html += ", "
                }
                html += category.name;
            }
        });
    }
    if(html.length===0){
        html = "Undefined categories";
    }
    return html;
}