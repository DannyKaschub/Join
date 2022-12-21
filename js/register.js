setURL("https://danny-kaschub.developerakademie.net/smallest_backend_ever-master");

let users = [];


async function loadUsers() {
    await downloadFromServer();
    users = await JSON.parse(backend.getItem("users")) || [{}];
}


async function addUser() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let searchExistingUser = users.map(user => user.email === email.toLowerCase())
    if (searchExistingUser.indexOf(true) > -1) {
        document.getElementById("signup-sucessfull").classList.add("signup-unsuccessfull");
        document.getElementById("signup-sucessfull").classList.remove("d-none");
        document.getElementById("signup-sucessfull").innerHTML = `Sign up unsuccessfull! <br> Email already exists!`
    }
    else {
        document.getElementById("signup-sucessfull").classList.remove("d-none");
        users.push({ "name": name, "email": email.toLowerCase(), "password": password, "contacts": [], "tasks":[] });
        await saveUsersToServer();
        setTimeout(() => {
            window.location.href = 'index.html?msg=Du hast dich erfolgreich Registriert';  
        }, 500);
    }
}

function sendResetMail(){
    let inputMail = document.getElementById("email").value;
    let checkMail = registeredUsers.map(mail => mail.email === inputMail);
    if(checkMail.indexOf(true) > -1){
        if(document.getElementById("forgot-sucessfull").classList.contains("forgot-unsuccessfull")){
            document.getElementById("forgot-sucessfull").classList.remove("forgot-unsuccessfull")
            document.getElementById("forgot-sucessfull").innerHTML = "You got a Mail!"
        }
        document.getElementById("forgot-sucessfull").classList.remove("d-none")
    }else{
        document.getElementById("forgot-sucessfull").classList.remove("d-none")
        document.getElementById("forgot-sucessfull").classList.add("forgot-unsuccessfull")
        document.getElementById("forgot-sucessfull").innerHTML = "Email not exist!"
    }
}

async function saveUsersToServer() {
    await backend.setItem('users', JSON.stringify(users));
}