
let registeredUsers = [];
let loggedUser = [];
let pwState = 0;
setURL("https://danny-kaschub.developerakademie.net/smallest_backend_ever-master");
async function loadUsers() {
    await downloadFromServer();
    registeredUsers = await JSON.parse(backend.getItem("users")) || [];
    loggedUser = await JSON.parse(backend.getItem("loggedUser")) || [];
}




async function login() {
    let email = document.getElementById('input-email').value;
    let password = document.getElementById('input-password').value;
    let currentUserValue = []
    currentUserValue = registeredUsers.find(u => u.email == email.toLowerCase() && u.password == password)
    if (currentUserValue) {
        loggedUser.push({"email": email.toLowerCase(), "IP": await getCurrentIP()});
        await backend.setItem("loggedUser", JSON.stringify(loggedUser));
        email = '';
        password = '';
        window.location.href = "summary.html";
    } else {
        document.getElementById("input-password").placeholder = "Ups! Try again";
        document.getElementById("wrong-password").classList.remove("d-none");
        document.getElementById('input-email').value = "";
        document.getElementById('input-password').value = "";
    }
}

async function getCurrentIP(){
    let URL = "https://ip-api.com/json";
    let respsone = await fetch(URL);
    let responseAsJs = await respsone.json();
    return responseAsJs.query;
}

async function guestLogin() {
    loggedUser.push({"email": "guest@joinKanBan.de", "IP": await getCurrentIP()})
    await backend.setItem("loggedUser", JSON.stringify(loggedUser));
    window.location.href = "./summary.html";
}

function toggleCheckbox(){
    if(document.getElementById("index-checked-checkbox").classList.contains("d-none")){
        document.getElementById("index-checked-checkbox").classList.remove("d-none");
    }else{
        document.getElementById("index-checked-checkbox").classList.add("d-none");
    }
;
}


function checkWrongInput() {
    if (!document.getElementById("wrong-password").classList.contains("d-none")) {
        document.getElementById("wrong-password").classList.add("d-none");
    }
}


function changeVisibility(){
            if(pwState === 0){
                document.getElementById("login-password-image").src = "./img/icons/visibility-off.png";
                document.getElementById("input-password").type = "password";
                pwState = 1;
                console.log(pwState);
            }
            if(pwState === 1){
                document.getElementById("login-password-image").src="./img/icons/visibility.png";
                document.getElementById("input-password").type = "text";
                pwState = 0;
            }
        }
        
function changeVisibilityOnInput(){
    let lockImg = document.getElementById("login-password-image").src = "./img/icons/visibility-off.png";
    if(lockImg){
        document.getElementById("input-password").type = "password";
        return false;
    }else{
        document.getElementById("login-password-image").src = "./img/icons/visibility-off.png";

    }

}