import checkUndefined from "./checkUndefined.js";

export default function formatDate(unformatedDate, isComment = false) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let date = checkUndefined(unformatedDate, " date");
    if (date !== "undefined date") {
        const newDate = new Date(unformatedDate);
        let day = newDate.getDate();
        let month = newDate.getMonth();
        let year = newDate.getFullYear();
        date = !isComment
            ? `${day} ${months[month]} ${year}`
            : `${day.toString().padStart(2, "0")}.${(month + 1).toString().padStart(2, "0")}.${year}`;
    }
    return date;
}
