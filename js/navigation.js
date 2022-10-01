const navigation = document.getElementById("navigation-hamburger");
navigation.addEventListener("click", () => {
    document.querySelector(".navigation-hamburger img").src = navigation.checked ? "images/icon/exit-icon.png" : "images/icon/menu-icon.png";
});
