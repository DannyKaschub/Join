let contacts = [];
let firstChar = [];
let currentUser = [];
let currentContactBox = [];

async function initC() {
    await loadAtStart()
    contacts = await JSON.parse(backend.getItem("contacts")) || [];
    categories = (await JSON.parse(backend.getItem("categories"))) || [];
    task_cards = (await JSON.parse(backend.getItem("tasks"))) || [];
    renderContactList();
    renderCategoryList();
    renderPriorities()
    renderContacts();
    board = "contacts.html"
}


const clearHTML = function (id) {
    return document.getElementById(`${id}`).innerHTML = " ";
}


setURL("https://danny-kaschub.developerakademie.net/smallest_backend_ever-master");

async function addCurrentUser(id) {
    currentUser = [];
    currentUser.push(id);
}

function showModal() {
    getDoc('modal').classList.remove("d-none");
}

function showMobileModal() {
    getDoc('modal-mobile').classList.remove("d-none");
    getDoc('mobile-add-Contact').classList.add("d-none");
    getDoc('summary-main-page').classList.add("d-none");
    getDoc('header').classList.add("d-none");
}

function showEditMobileModal() {
    getDoc('modal-mobile-edit').classList.remove("d-none");
    getDoc('mobile-contact-details').classList.add("d-none");
    getDoc('mobile-add-Contact').classList.add("d-none");
    getDoc('summary-main-page').classList.add("d-none");
    getDoc('header').classList.add("d-none");
    loadCurrentUserData();

}

async function saveMobileChanges() {
    let user = contacts[currentUser];
    let name = getDoc("mobile-edit-contact-name").value;
    let email = getDoc("mobile-edit-contact-email").value;
    let phone = getDoc("mobile-edit-contact-phone").value;
    user.name = name;
    user.email = email;
    user.phone = phone;
    await saveContactsToServer();
    hideEditMobileModal();
    openMobileContactDetails(currentUser);
}

function loadCurrentUserData() {
    let user = contacts[currentUser];
    getDoc("mobile-edit-contact-name").value = user.name;
    getDoc("mobile-edit-contact-email").value = user.email;
    getDoc("mobile-edit-contact-phone").value = user.phone;
}


function hideModal(modal) {
    getDoc(modal).classList.add("modal-move-out");
    setTimeout(() => {
        getDoc(modal).classList.add("d-none");
        getDoc(modal).classList.remove("modal-move-out");
    }, 225);

}

function hideMobileModal() {
    getDoc('modal-mobile').classList.add("modal-mobile-move-out");
    setTimeout(() => {
        getDoc("modal-mobile").classList.add("d-none");
        getDoc('mobile-add-Contact').classList.remove("d-none");
        getDoc('summary-main-page').classList.remove("d-none");
        getDoc('header').classList.remove("d-none");
        getDoc('modal-mobile').classList.remove("modal-mobile-move-out");
    }, 400);
}

function hideEditMobileModal() {
    getDoc('modal-mobile-edit').classList.add("modal-mobile-move-out");
    setTimeout(() => {
        getDoc('modal-mobile-edit').classList.add("d-none");
        getDoc('mobile-add-Contact').classList.remove("d-none");
        getDoc('summary-main-page').classList.add("d-none");
        getDoc('mobile-contact-details').classList.remove("d-none");
        getDoc('header').classList.remove("d-none");
        getDoc('modal-mobile-edit').classList.remove("modal-mobile-move-out");
    }, 400);

}

function openMobileContactDetails() {
    if (window.innerWidth <= 1024) {
        getDoc('mobile-contact-details').classList.remove("d-none");
        getDoc('summary-main-page').classList.add('d-none');
        getDoc('contacts').classList.add("d-none");
        getDoc('mobile-add-Contact').classList.add("d-none");
        getDoc('header').classList.add("contact-details-head");
        clearHTML('mobile-contact-details');
        getDoc('mobile-contact-details').innerHTML = templateMobileContactDetails(currentUser);
    } else {
        return false
    }
}

function closeMobileEdit() {
    getDoc('mobile-contact-details').classList.add("d-none");
    getDoc('summary-main-page').classList.remove('d-none');
    getDoc('contacts').classList.remove("d-none");
    getDoc('mobile-add-Contact').classList.remove("d-none");
    getDoc('header').classList.remove("contact-details-head");
    renderContacts();
}


function openEditContact() {
    getDoc('edit-contact-modal').classList.remove("d-none");
    editContact();
}


function closeEditContact() {
    getDoc('edit-contact-modal').classList.add("d-none");
}


function setBgColorToContactsBox(i) {
    getDoc("contact-box-" + currentContactBox[0]).classList.remove("set-bg-color");
    currentContactBox = [];
    addCurrentContactBox(i);
    getDoc("contact-box-" + currentContactBox[0]).classList.add("set-bg-color");
    getDoc("contact-box-" + currentContactBox[0]).style.borderRadius = "8px";
}


function addCurrentContactBox(i) {
    currentContactBox.push(i);
}


function startCall(i) {
    window.open("tel:" + contacts[i].phone);
}


function sendMail(i) {
    window.open("mailto:" + contacts[i].email);
}


function randomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);

    return `rgb(${r} ,${g} , ${b})`;
}


function convertPhone(dn) {
    let phoneNumberLength = dn.length;
    if (phoneNumberLength < 4) { return dn; }
    if (phoneNumberLength < 7) { return `(${dn.slice(0, 3)}) ${dn.slice(3)}` }
    if (phoneNumberLength <= 10) return `(+49)${dn.slice(1, 4)}${dn.slice(4, 5)}-${dn.slice(5, 10)}`;
    return `(+49)${dn.slice(1, 3)}${dn.slice(3, 4)}-${dn.slice(4, 7)}-${dn.slice(7, 11)}`;
}


function covertDnOnInput() {
    dn = getDoc("add-contact-phone").value;
    getDoc("add-contact-phone").innerHTML = convertPhone(dn);
}


function renderContacts() {
    clearHTML("contacts");
    contacts = contacts.sort((a, b) => {
        let a1 = a.name.toLowerCase();
        let b1 = b.name.toLowerCase();
        return a1 < b1 ? -1 : a1 > b1 ? 1 : 0;
    })
    renderContactBox();
    for (let i = 0; i < contacts.length; i++) {
        sortContactsToFirstLetterBox(contacts[i].name.charAt(0), i);
    }
}


async function renderContactBox() {
    clearHTML("contacts");
    for (let i = 0; i < contacts.length; i++) {
        if (firstChar.indexOf(contacts[i].name.charAt(0).toLowerCase()) === -1) {
            firstChar.push(contacts[i].name.charAt(0).toLowerCase());
        }
    }
    for (let i = 0; i < firstChar.length; i++)
        if (!getDoc("contact-container-" + firstChar[i].toUpperCase())) {
            getDoc("contacts").innerHTML += templateRenderContacts(i);
        }
}


function renderContactDetails(i) {
    clearHTML("contact-details");
    getDoc("contact-details").innerHTML = templateContactDetails(i);
}


async function addContact() {
    let name = $('#add-contact-name').val();
    let email = $('#add-contact-email').val();
    let phone = $('#add-contact-phone').val();
    let userID = contacts.length;
    let userColor = randomColor();
    contacts.push({ "userColor": userColor, "userID": userID, "name": name, "email": email, "phone": phone, "userInits": firstLetterToUpperCase(name) });
    $('#add-contact-name, #add-contact-email, #add-contact-phone').val("");
    await saveContactsToServer();
    renderContacts();
    hideModal('modal');
}


async function addMobileContact() {
    let name = $('#mobile-add-contact-name').val();
    let email = $('#mobile-add-contact-email').val();
    let phone = $('#mobile-add-contact-phone').val();
    let userID = contacts.length;
    let userColor = randomColor();
    contacts.push({ "userColor": userColor, "userID": userID, "name": name, "email": email, "phone": phone, });
    $('#mobile-add-contact-name, #mobile-add-contact-email, #mobile-add-contact-phone').val("");
    await saveContactsToServer();
    renderContacts();
}


async function editContact() {
    let user = contacts[currentUser];
    getDoc("contact-edit-name").value = user.name;
    getDoc("contact-edit-mail").value = user.email;
    getDoc("contact-edit-phone").value = user.phone;
    await saveContactsToServer();
}


async function deleteContact(user) {
    contacts.splice(user, 1);
    await saveContactsToServer();
    window.location.reload();
    renderContacts();
}


async function saveChanges() {
    let user = contacts[currentUser];
    let name = getDoc("contact-edit-name").value;
    let email = getDoc("contact-edit-mail").value;
    let phone = getDoc("contact-edit-phone").value;
    user.name = name;
    user.email = email;
    user.phone = phone;
    await saveContactsToServer();
    closeEditContact();
    renderContacts();
    renderContactDetails(currentUser);
}


async function saveContactsToServer() {
    await backend.setItem('contacts', JSON.stringify(contacts));
}


function firstLetterToUpperCase(name) {
    var separateWord = name.toLowerCase().split(' ');
    for (var i = 0; i < separateWord.length; i++) {
        separateWord[i] = separateWord[i].charAt(0).toUpperCase();
    }
    return separateWord.join('');
}


function sortContactsToFirstLetterBox(char, i) {
    if (getDoc("first-letter-" + char.toUpperCase()).innerHTML == char.toUpperCase()) {
        getDoc("contact-container-" + char.charAt(0).toUpperCase()).innerHTML += templateRenderSortContacts(i);
    } else {
        return false;
    }
}