import checkUndefined from "./checkUndefined.js";
export default function formatDate(unformatedDate, showTime = false){
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let date = checkUndefined(unformatedDate, " date");
    if(date != "undefined date"){
        const newDate = new Date(unformatedDate);
        const day = newDate.getDate().toString();
        const month = months[newDate.getMonth()];
        const year = newDate.getFullYear().toString();
        const hours = newDate.getHours().toString().padStart(2, "0");
        const minutes = newDate.getMinutes().toString().padStart(2, "0");
        date = `${day} ${month} ${year} ${showTime ? `at ${hours}:${minutes}` : ""}`;
    }
    return date;
}