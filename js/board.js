async function initB() {
  await downloadFromServer();
  task_cards = (await JSON.parse(backend.getItem("tasks"))) || [];
  contacts = (await JSON.parse(backend.getItem("contacts"))) || [];
  categories = (await JSON.parse(backend.getItem("categories"))) || [];
  setTimeout(() => {
    markBoardNav();
  }, 250);
  updateHTML();
}

setURL("https://danny-kaschub.developerakademie.net/smallest_backend_ever-master");

let task_cards = [];

let result = [];

let card_states = ["to_do", "in_progress", "await_feedback", "done"];

let board = "board.html";

let currentDraggedCard;

let currentState;

//////////////////////////////////////////////////////////////////////////////////////////// --add functions--


function searchTask() {
  let search = getDoc('search-task-web');
  result = task_cards.filter(cards => cards["declaration-header"].includes(search.value));
  if(search.value == "") {
    updateHTML();
    
  }
  filterSearchValue(result);
}


function clearRows() {
  getDoc("to_do").innerHTML = "";
  getDoc("in_progress").innerHTML = "";
  getDoc("await_feedback").innerHTML = "";
  getDoc("done").innerHTML = "";
}


function filterSearchValue(result) {
  clearRows();
  for (let h = 0; h < 1; h++) {
    const card_state = card_states[h];
    getDoc(card_state).innerHTML = "";
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      const state = element["state"];
      const id = element["id"];
      getDoc(state).innerHTML += generateCard(element);
      updateProgressBar(state, id);
        for (let j = 0; j < element["assignees"].length; j++) {
          const userData = element["assignees"];
          renderUsers(userData, id);
        }}
  }
  renderTemplates();
}


/**
 * This function lets the user add existing contacts who are not yet assigned to a task
 * @param {number} ID 
 */
function addUserToEditTask(ID) {
  let users = contacts[ID];
  if (userToTask.indexOf(users) > -1) {
    userToTask.splice(userToTask.indexOf(users), 1);
  } else {
    userToTask.push(users);
    console.log(users);
  }
}


/**
 * Checks if an email connected to a contact exists if true it checks the current selected task_card
 */
 function addNewContactEdit(ID) {
  let card = task_cards[ID]
  let contactemail = getDoc('contact-email');
  let xy;
  contacts.forEach(contact => {
    if(emailExists(contact,contactemail)) {
      xy = true;
      checkForDuplicate(card, contact, ID, contactemail);
    }});
    if(xy !== true) {
      alert("this contact does not exist");
    }
}

/**
 * This function lets the user edit a task and change the values of it
 * @param {number} ID 
 */
async function editTask(ID) {
  let card = task_cards[ID];
  if (prioToTask.length == 0) {
    alert("Please select a priority")
    return false;
  } else {
    card["declaration-header"] = getDoc('task-edit-header').value;
    card["declaration-text"] = getDoc('task-edit-text').value;
    card["date"] = getDoc('task-edit-date').value;
    card["priority"] = prioToTask;
    await saveTaskToServer();
    updateHTML();
    closeEdit();
  }
}


//////////////////////////////////////////////////////////////////////////////////////////// --render functions--


function renderUsers(userData, id) {
  let users = getDoc("assigned-users" + id);
  users.innerHTML = "";
  for (let i = 0; i < userData.length; i++) {
    const user = userData[i];
    if (i < 3) {
      users.innerHTML += generateUsersHTML(user);
    }
    if (i > 2) {
      users.innerHTML = "";
      renderUserSurplus(userData, users);
    }}
}


/**
 * If there are more than 3 users assigned to a task the 3rd user icon will be displaying the surplus that amounts.
 * @param {number} userData 
 * @param {number} users 
 */
function renderUserSurplus(userData, users) {
  for (let j = 0; j < 2; j++) {
    const user = userData[j];
    const additionals = userData.length;
    users.innerHTML += generateUserSurplusHTML(user); // renders the first 2 users in the array if array has over 3 users
    if (j == 1) {
      users.innerHTML += generateLeftoverAmount(additionals); // shows the added users if total assigned usercount is over 3 
    }}
}


function renderAddTask() {
  let form = getDoc('add-task');
  
  form.innerHTML = "";
  form.innerHTML += generateAddTaskForm(), renderPrioritiesAT();
}


function renderTemplates() {
  getDoc("to_do").innerHTML += templateCard(0);
  getDoc("in_progress").innerHTML += templateCard(1);
  getDoc("await_feedback").innerHTML += templateCard(2);
  getDoc("done").innerHTML += templateCard(3);
}


/**
 * This render function will display the assigned contacts to each task and the option to invite new ones
 * @param {array} assignees 
 * @param {number} ID 
 */
function renderAssignedTaskUsers(assignees, ID) {
  let dropdown = getDoc('edit-assigned-users');
  dropdown.innerHTML = "";
  if(assignees == []) {
    dropdown.innerHTML += newContactEditTemplate(ID);
  } else {
    dropdown.innerHTML += newContactEditTemplate(ID);
    for (let i = 0; i < assignees.length; i++) {
      const elem = assignees[i];
      const ID = elem["userID"];
      dropdown.innerHTML += contactEditTemplate(elem, i, ID);
      } 
  }
}


/**
 * This function is for generateCard 
 */
 function renderAssignedUsers(assignees) {
  let list = getDoc('assigned-users');
  list.innerHTML = "";
  for (let i = 0; i < assignees.length; i++) {
    const element = assignees[i];
    list.innerHTML += `<div class="overlay-assignee">
                        <div class="overlay-assginee-img fm-inter-400" style="background: ${element["userColor"]}">${element["userInits"]}</div>
                        <span class="overlay-assignee-name fm-inter-400">${element["name"]}</span>
                       </div>`;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////// --HTML / TEMPLATES--


function updateHTML() {
  mapThroughCards();
  filterStates();
  renderTemplates();
}


function mapThroughCards() {
  task_cards.map((card, index) => {
    card.id = index++;
  });
}


/**
 * This function renders each card depending on the state it has and will display the card in the correct column
 */
 function filterStates() {
   card_states.forEach(card_state=> {
     let currentCardState = task_cards.filter((t) => t["state"] == card_state);
     getDoc(card_state).innerHTML = "";
   for (let i = 0; i < currentCardState.length; i++) {
     const element = currentCardState[i];
     const state = element["state"];
     const id = element["id"];
     getDoc(card_state).innerHTML += generateCard(element);
     updateProgressBar(state, id);
       for (let j = 0; j < element["assignees"].length; j++) {
         const userData = element["assignees"];
         renderUsers(userData, id);
       }}});      
 }


/**
 * When a card is moved up to the next stage the progress bar will show the progress with the help of this function
 * @param {string} state 
 * @param {number} id 
 */
function updateProgressBar(state, id) {
  let fill = getDoc("fill" + id);
  let filltext = getDoc("fill-text" + id);
  fillWhenToDo(state, fill, filltext);
  fillWhenInProgress(state, fill, filltext);
  fillWhenAwaitProgress(state, fill, filltext);
  fillWhenDone(state, fill, filltext);
}


function highlight(a, b, c, d) {
  templateCardPopupHandleA(a, b, c, d);
  templateCardPopupHandleB(a, b, c, d);
  templateCardPopupHandleC(a, b, c, d);
  templateCardPopupHandleD(a, b, c, d);
}


//////////////////////////////////////////////////////////////////////////////////////////// --MISC--


function templateCardPopupHandleA(a, b, c, d) {
  if(a.indexOf(currentState) > -1) {
    getDoc(`${b}`).classList.add("drag-highlight", "order-1");
    getDoc(`${c}`).classList.add("drag-highlight", "order-1");
    getDoc(`${d}`).classList.add("drag-highlight", "order-1");
  } 
}


function templateCardPopupHandleB(a, b, c, d) {
  if(b.indexOf(currentState) > -1) {
    getDoc(`${a}`).classList.add("drag-highlight", "order-1");
    getDoc(`${c}`).classList.add("drag-highlight", "order-1");
    getDoc(`${d}`).classList.add("drag-highlight", "order-1");
  } 
}


function templateCardPopupHandleC(a, b, c, d) {
  if(c.indexOf(currentState) > -1) {
    getDoc(`${a}`).classList.add("drag-highlight", "order-1");
    getDoc(`${b}`).classList.add("drag-highlight", "order-1");
    getDoc(`${d}`).classList.add("drag-highlight", "order-1");
  } 
}


function templateCardPopupHandleD(a, b, c, d) {
  if(d.indexOf(currentState) > -1) {
    getDoc(`${a}`).classList.add("drag-highlight", "order-1");
    getDoc(`${b}`).classList.add("drag-highlight", "order-1");
    getDoc(`${c}`).classList.add("drag-highlight", "order-1");
  } 
}


function throwState(num) {
  currentState = num;
}


// function highlightBg(id) {
//   getDoc(id).classList.add("highlight");
// }


function removeHighlight(id) {
  getDoc(id).classList.remove("highlight");
}


function removeTemps(a, b, c, d) {
  getDoc(`${a}`).classList.remove("drag-highlight");
  getDoc(`${b}`).classList.remove("drag-highlight");
  getDoc(`${c}`).classList.remove("drag-highlight");
  getDoc(`${d}`).classList.remove("drag-highlight");
}


function startDragging(ID) {
  currentDraggedCard = ID;
}


function allowDrop(ev) {
  ev.preventDefault();
}


function moveTo(state) {
  task_cards[currentDraggedCard]["state"] = state;
  updateHTML();
  removeHighlight(state);
  saveTaskToServer();
}


function fillWhenToDo(state, fill, filltext) {
  if (state == "to_do") {
    fill.style.width = "0%";
    filltext.innerHTML = `0/3 Done`;
  }
}


function fillWhenInProgress(state, fill, filltext) {
  if (state == "in_progress") {
    fill.style.width = "33%";
    filltext.innerHTML = `1/3 Done`;
  }
}


function fillWhenAwaitProgress(state, fill, filltext) {
  if (state == "await_feedback") {
    fill.style.width = "66%";
    filltext.innerHTML = `2/3 Done`;
  }
}


function fillWhenDone(state, fill, filltext) {
  if (state == "done") {
    fill.style.width = "100%";
    filltext.innerHTML = `3/3 Done`;
  }
}


function showOverlay() {
  getDoc('overlay-bg').classList.remove('d-none');
  getDoc('task-overlay').classList.remove('d-none');
  setTimeout(function() {
    getDoc('task-overlay').classList.add('show-task-overlay');
  }, 100);
   prioToTask = [];
   setToggle();
}


function closeOverlay() {
  getDoc('task-overlay').classList.remove('show-task-overlay');
  closeEdit();
  setTimeout(function() {
    getDoc('task-overlay').classList.add('d-none');
    getDoc('overlay-bg').classList.add('d-none');
  }, 225);
  clearPrio();
}

/**
 * Sets the priority when editing a card
 * @param {number} ID 
 */
function setPrio(ID) {
  prioToTask = [];
  let card = task_cards[ID];
  prioToTask.push(card['priority'][0])
}


function overlayData(ID) {
  let card = task_cards[ID];
  getDoc('task-overlay').innerHTML = "";
  getDoc('task-overlay').innerHTML += generateOverlayHTML(card);
  getDoc('task-edit').innerHTML = "";
  getDoc('task-edit').innerHTML += generateOverlayEditHTML(card);
  renderAssignedUsers(card["assignees"]);
  renderAssignedTaskUsers(card["assignees"], ID);
}

/**
 * determines the priority and sets it accordingly
 * @param {string} prio 
 */
function determinePrio(prio) {
  if(prio === "urgent") {
    selectPrio('urgent', 'urgent-img', 'select-urgent', 'urgent white', 'urgent red', 'medium', 'medium yellow', 'low', 'low green')
  } 
  if(prio === "medium") {
    selectPrio('medium', 'medium-img', 'select-medium', 'medium white', 'medium yellow', 'urgent', 'urgent red', 'low', 'low green')
  } 
  if(prio === "low") {
    selectPrio('low', 'low-img', 'select-low', 'low white', 'low green', 'urgent', 'urgent red', 'medium', 'medium yellow')
  } 
}


/**
 * This function is for the overlays in mobile mode depending on viewport width it will display a different exit button 
 */
function detectWindowWidth() {
  if (window.innerWidth > 468) {
    getDoc("overlay-exit-img").setAttribute("src", "./img/icons/overlay exit button.png");
    getDoc("overlay-exit-edit-img").setAttribute("src", "./img/icons/overlay exit button.png");
  } else {
    getDoc("overlay-exit-img").setAttribute("src", "./img/icons/arrow left blue.png");
    getDoc("overlay-exit-edit-img").setAttribute("src", "./img/icons/arrow left blue.png");
  } 
}

/**
 * When adding a new contact to an existing task this function will prevent duplicates
 * @param {object} card 
 * @param {JSON} contact 
 * @param {number} ID 
 * @param {string} contactemail 
 */
function checkForDuplicate(card, contact, ID, contactemail) {
  if(checkIfUserIsAssigned(card, contact)) {
    alert("This contact is already assigned");
    contactemail.value = "";
  } else {
    pushNewUser(card, contact);
    returnToListEdit(ID);
  }
}


function emailExists(contact, contactemail) {
  return contact["email"] === contactemail.value
}

/**
 * Checks if the provided contact email is already assigned to the card 
 * @param {object} card 
 * @param {string} contact 
 * @returns 
 */
function checkIfUserIsAssigned(card, contact) {
 return (card["assignees"].some(e => e.email === contact["email"]))
}


function pushNewUser(card, contact) {
 return card["assignees"].push(contact);
}


function returnToListEdit(ID) {
  let card = task_cards[ID];
  let contactList = getDoc('task-edit-contacts');
  contactList.innerHTML = "";
  contactList.innerHTML += contactListTemplate();renderAssignedTaskUsers(card["assignees"], ID);
}


function openEdit(prio) {
  getDoc('task-overlay').classList.remove('show-task-overlay');
  setTimeout(function() {
    getDoc('task-overlay').classList.add('d-none');
    getDoc('task-edit').classList.remove('d-none');
  }, 225);
  setTimeout(function() {
    getDoc('task-edit').classList.add('show-task-overlay');
  }, 300);
  renderPriorities();
  determinePrio(prio);
}


function closeEdit() {
  getDoc('task-edit').classList.remove('show-task-overlay');
  setTimeout(function() {
    getDoc('task-edit').classList.add('d-none');
    getDoc('overlay-bg').classList.add('d-none');
  }, 225);
  setToggle();
  prioToTask = [];
}


function openAddTask(selection) {
  getDoc('add-task-bg').classList.remove('d-none');
  getDoc('add-task').classList.remove('d-none');
  getDoc('add-task').innerHTML = "";
  renderAddTask();
  renderContactList();
  renderCategoryList();
  setTimeout(function() {
    getDoc('add-task-bg').classList.toggle('task-overlay-bg');
    getDoc('add-task').classList.toggle('show-add-task');
  }, 125);
  selectedState = selection;
}


/**
 * this return the toggle values for the priority buttons back to origin
 */
function setToggle() {
  toggle = false;
}

function markBoardNav() {
  document.getElementById("board-html").classList.add("bgNavBlue");
  document.getElementById("mob-board-html").classList.add("bgNavBlue");
}