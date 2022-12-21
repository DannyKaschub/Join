async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html"); // "includes/header.html" & nav.html
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
  currentPage();
}

let userToTask = [];

let categoryToTask = [];

let prioToTask = [];

let colors = ["8AA4FF", "FF0000", "2AD300", "FF7A00", "E200BE", "0038FF"];

let selectedColor = [];

let categories = [];

let printTask = [];

let subTasks = [];

const getDoc = function (id) {
  return document.getElementById(`${id}`);
}

//////////////////////////////////////////////////////////////////////////////////////////// --add functions--
/**
 * adds the task to the board and checks if inputs are missing
 */
async function addToBoard() {
  InputForTask(selectedState);
  if( noContactIsSelected() == false || noCategoryIsSelected() == false || noPriorityIsSelected() == false) {
   return false;
  } else {
    pushTask();
  }
}

/**
 * handles the push for each card created, depending on which page the user is at it will either guide the user to the board page else it will just update and close the add task sidebar
 */
async function pushTask() {
  task_cards.push(printTask[0]);
    clearInputs();
    await saveTaskToServer();
    showAnim();
    if(board === "board.html") {
      clearInputs();
      openAddTask();
      updateHTML();
    } else {
      setTimeout(function() {window.location.href = "board.html";}, 1500);
    }
}


/**
 * fills out the JSON and provides a JSON Array filled out by the user for the final push 
 */
function InputForTask(state) {
  let assignee = userToTask;
  let category = categoryToTask;
  let priority = prioToTask;
  let task = cardAsJSON(state, assignee, category, priority);
  printTask.push(task);
}


/**
 * This JSON is responsible for the task card creation, it will print out the provided data by the user
 */
function cardAsJSON(state, assignee, category, priority) {
  let title = getDoc("title");
  let description = getDoc("description");
  let date = getDoc("date");
  let task_card_data = {
    "state": state,
    "category": category,
    "date": date.value,
    "declaration-header": title.value,
    "declaration-text": description.value,
    "assignees": assignee,
    "priority": priority,
  }; return task_card_data;
}


/**
 * adds a category to the task JSON creating the cardAsJSON format 
 */
function addCategory(elemcolor, ID) {
  let name = getDoc('cat-name' + ID).innerHTML;
  let color = elemcolor;

  let category = {
    "ID": ID,
    "name": name,
    "color": color,
  };
  validate(category);
}


/**
 * Checks if a category is already selected. If already selected it clears out the array and pushes the newly selected category 
 */
function validate(category) {
  if (categoryToTask.length <= 0) {
    categoryToTask.push(category);
    resetList(category);
  } else {
    categoryToTask = [];
    categoryToTask.push(category);
    resetList(category);
  }
}


/**
 * adds a new category chosen by the user
 */
async function addNewCategory() {
  let name = getDoc('new-cat-name');
  let color =  selectedColor[0];

  let newCategory = {
    "ID": categories.length,
    "name": name.value,
    "color": color,
  };

  categories.push(newCategory);
  categoryToTask.push(newCategory);
  await saveCatToServer();
  resetList(newCategory);
}

/**
 * this function lets the user choose a color background for new categories
 */
function addColor(color, ID) {
  let selection = getDoc('color' + ID);

  selectedColor = [];
  selectedColor.push(color);
  clearCLassList();
  selection.classList.add('shadow');
}

/**
 * adds selected user to userToTask which is the array that holds the assigned contacts for the task card if a user already exists it will be equalized so no doubles exist
 */
function addUserToTask(ID) {
  let users = contacts[ID];

  if (userToTask.indexOf(users) > -1) {
    userToTask.splice(userToTask.indexOf(users), 1);
  } else {
    userToTask.push(users);
    console.log(users);
  }
}


/**
 * Depending on which priority is selected it toggles off the other 2 remaining priorities and sets the style accordingly
 */
function selectPrio(ID, imgID, background, after, before, prioRestA, prioRestAcolor, prioRestB, prioRestBcolor) {
  let image = getDoc(imgID);
  getDoc(prioRestA + "-img").src = `./img/icons/${prioRestAcolor}.png`;
  getDoc(prioRestB + "-img").src = `./img/icons/${prioRestBcolor}.png`;
  select(ID, background, after, before, prioRestA, prioRestB, image);
}


/**
 * belongs to selectPrio function
 */
 function select(ID, background, after, before, prioRestA, prioRestB, image) {
   getDoc(ID).classList.add(background);
   image.src = `./img/icons/${after}.png`;
   getDoc(prioRestA).classList = prioRestA, "fm-OpenSA-400";
   getDoc(prioRestB).classList = prioRestB, "fm-OpenSA-400";
   prioToTask = [];
   prioToTask.push(ID);
 }

//////////////////////////////////////////////////////////////////////////////////////////// --render functions--

function renderPriorities() {
    let prio = getDoc('priorities');
    prio.innerHTML += generatePrioHTML();
}

function renderPrioritiesAT() {
  let prio = getDoc('prioritiesAT');
  prio.innerHTML += generatePrioHTML();
}


function renderContactList() {
  let list = getDoc("contact-list");
  list.innerHTML = "";
  for (let i = 0; i < contacts.length; i++) {
    const elem = contacts[i];
    // handle for 0 contacts
    list.innerHTML += contactTemplate(elem, i);
  }
  saveTaskToServer();
}


function renderCatColors() {
  let colorbar = getDoc('cat-colors');
  let ID = -1;

  for (let i = 0; i < colors.length; i++) {
    const color = colors[i];
    ID++;
    colorbar.innerHTML += /*html*/` <div id="color${ID}" class="category-color" style="background: #${color}" onclick="addColor('${color}', ${ID})"></div>`;
  }
}


function renderCategoryList() {
  let list = getDoc("categories");
  list.innerHTML = "";

  if (categories == []) {
    list.innerHTML += newCategoryTemplate();
  } else {
    list.innerHTML += newCategoryTemplate();
    for (let i = 0; i < categories.length; i++) {
      const elem = categories[i];
      list.innerHTML += categoryTemplate(elem);
    }
  }
}


////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////// --MISC--


function noContactIsSelected() {
  if (userToTask.length == 0) {
    alert("Please select a contact")
    return false;
  }
}


function noPriorityIsSelected() {
  if (prioToTask.length == 0) {
    alert("Please select a priority")
    return false;
  } 
}


function noCategoryIsSelected() {
  if(categoryToTask.length == 0) { 
    alert("Please select a category");
    return false;
  } 
}


function clearCLassList() {
  getDoc('color0').classList = ('category-color');
  getDoc('color1').classList = ('category-color');
  getDoc('color2').classList = ('category-color');
  getDoc('color3').classList = ('category-color');
  getDoc('color4').classList = ('category-color');
  getDoc('color5').classList = ('category-color');
}


function clearPrio() {
  let prio = getDoc('priorities');
  prio.innerHTML = "";
}


function returnToList() {
  let categoryList = getDoc("categories");
  selectedColor = [];
  categoryList.innerHTML = "";
  categoryList.innerHTML = categoryListTemplate();
}


function resetList(cat) {
  let categoryList = getDoc("categories");

  categoryList.innerHTML = "";
  categoryList.innerHTML = initList(cat); renderCategoryList();
}


async function clearInputs() {
  clearFields();
  resetContactList();
  returnToList();
  clearArrays();
  renderContactList();
  renderCategoryList();
  clearSubtaskrender();
  if(board == "board.html" || board == "contacts.html") {
    renderPrioritiesAT();
  } else {
    renderPriorities();
  }
  }
 


function clearFields() {
  getDoc("title").value = "";
  getDoc("description").value = "";
  getDoc('date').value = "";
  if(board == "board.html" || board == "contacts.html") {
    getDoc('prioritiesAT').innerHTML = "";
  } else {
    getDoc('priorities').innerHTML = "";
  }
}


function clearArrays() {
  userToTask = [];
  prioToTask = [];
  categoryToTask = [];
}


function resetContactList() {
  getDoc('contact-list').classList.add("option-wrapper");
  getDoc('contact-list').classList.add("d-none");
}
 

async function saveTaskToServer() {
  await backend.setItem("tasks", JSON.stringify(task_cards));
}


async function saveCatToServer() {
  await backend.setItem("categories", JSON.stringify(categories));
}


function showAnim() {
  getDoc('add-to-board').style = `transform: translateY(0vh);`;
  setTimeout(function() {hideAnim()}, 1000);
}


function hideAnim() {
 getDoc('add-to-board').style = `transform: translateY(100vh);`;
}


/**
 * Checks which template is opened and closes the oposite accordingly
 */
function detectHTML(ID) {
  let str = getDoc(ID).classList;
  let check = !str.contains('d-none')
  if(ID == 'help-template' && check) {
    toggleHelp('legal-template');
  } 
  if(ID == 'legal-template' && check) {
    toggleLegal('help-template');
  } 
}


let legal = false;
function toggleLegal(ID) {
  detectHTML(ID);
  showLegalNotice();
  if(legal == true) {
    highlightOff();
  } else if(legal == false) {
    highlightOn();
  }
}


function highlightOff() {
  getDoc('legal-img').setAttribute("src", "./img/icons/info-icon.png");
  getDoc('legal-span').classList.remove('fm-OpenSA-700');
  legal = false;
}


function highlightOn() {
  getDoc('legal-img').setAttribute("src", "./img/icons/info icon white.png");
  getDoc('legal-span').classList.add('fm-OpenSA-700');
  legal = true;
}


/**
 * Checks which File is currently opened and applies d-none accordingly
 */
function showLegalNotice() {
  checkForFile();
  toggleLegalHTML();
}


/**
 * If User is at contacts.html d-none is applied accordingly 
 */
function toggleHelp(ID) {
  detectHTML(ID);
  checkForFile();
  getDoc('help-template').classList.toggle("d-none");
}


function toggleLegalHTML() {
  getDoc('legal-template').classList.toggle("d-none");
  getDoc('legal').classList.toggle("legal-clicked");
}

/**
 * determines which html page is opened and adds d-none to main containers to display legal or help page 
 */
function checkForFile() {
  currentFileIsSummary(); 
  currentFileIsBoard();
  currentFileIsAddTask();
  currentFileIsContacts();
}


function currentFileIsBoard() {
  if(board == "board.html") {
    getDoc('task-row-wrapper').classList.toggle("d-none");
    getDoc('search-task').classList.toggle("d-none");
  }
}


function currentFileIsAddTask() {
  if(board == "add_task.html") {
    getDoc('add-task').classList.toggle("d-none");
  }
}


function currentFileIsSummary() {
  if(board == "summary.html") {
    getDoc('greeting').classList.toggle("d-none");
    getDoc('tasks').classList.toggle("d-none");
    getDoc('task-container').classList.toggle("d-none");
  }
}


function currentFileIsContacts() {
  if(board == "contacts.html") {
    getDoc('contact-details').classList.toggle("d-none");
    getDoc('contacts').classList.toggle("d-none");
  }
}

function openMobileMenu(){
  if(window.innerWidth <= 1024){
    let mobileMenu = document.getElementById("mobile-menu");

    if(mobileMenu.classList.contains("d-none")){
      mobileMenu.classList.remove("d-none")
    }else{
      mobileMenu.classList.add("mobile-menu-move-out");
      setTimeout(() => {
        mobileMenu.classList.remove("mobile-menu-move-out");
        mobileMenu.classList.add("d-none");
      }, 500);
    }
  }else{
    return false;
  }
}

function currentPage() {
  let activePage = window.location.pathname;
  if(activePage.includes('summary')) {
    document.getElementById('active_summary').classList.add('active_nav_li')
  }
  if(activePage.includes('board')) {
    document.getElementById('active_board').classList.add('active_nav_li')
  }
  if(activePage.includes('add_task')) {
    document.getElementById('active_addTask').classList.add('active_nav_li')
  }
  if(activePage.includes('contacts')) {
    document.getElementById('active_contacts').classList.add('active_nav_li')
  }
}