
let users = [];
let loggedUsers = [];
let activeUser = [];


setURL("https://danny-kaschub.developerakademie.net/smallest_backend_ever-master");

async function loadAtStart() {
    await downloadFromServer();
    loggedUsers = JSON.parse(await backend.getItem("loggedUser")) || [];
    users = JSON.parse(await backend.getItem("users")) || [];
}


function loadCurrentUserMail() {
    let lastUser = loggedUsers.length -1;
    return loggedUsers[lastUser].email;
}


function loadDataFromCurrentUser() {
    let currentEmail = loadCurrentUserMail();
    let loggedInUser = users.filter(a => a.email === currentEmail);
    return loggedInUser;

}


function getCurrentUserName() {
    let guest = [];
    guest = loggedUsers.map(a => a.email === "guest@joinKanBan.de");
    let lastUser = guest.length -1;
    if (guest[lastUser] === true) {
        let name = "Max Mustermann";
        return name;
    } else {
        let name = loadDataFromCurrentUser();
        name = name[0].name
        return name;
    }
}