
function loading(){
    document.getElementById("page-container").classList.add("d-none");
    setTimeout(() => {
        document.body.classList.remove("bg-blue");
        document.getElementById("animation").classList.add("d-none");
        document.getElementById("page-container").classList.remove("d-none");
    }, 750);
    
}

