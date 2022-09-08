const navigationOpen = document.getElementById("navigation-open");
const navigationIcon = document.querySelector(".navigation-open img");
navigationOpen.addEventListener("click", () => {
    if(navigationOpen.checked){
        navigationIcon.src = "images/icon/exit-icon.png";
    }
    else{
        navigationIcon.src = "images/icon/menu-icon.png";
    }
})