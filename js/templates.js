function generateCard(card) {         
    return /*html*/`
      <div onclick="showOverlay(); overlayData(${card['id']}); detectWindowWidth()" draggable="true" ondragstart="startDragging(${card['id']}); highlight('template0', 'template1', 'template2', 'template3')" ondragend="removeTemps('template0', 'template1', 'template2', 'template3')" class="task-card d-flex flex-col align-center just-center">
          <div class="task-content d-flex flex-col">
              <div class="task-category d-flex flex-col fm-OpenSA-400" style="background: #${card["category"][0]["color"]}">
                  ${card["category"][0]["name"]}
              </div>
              <div class="task-declaration fm-OpenSA-700">
                  <div class="task-declaration-header">${card["declaration-header"]}</div>
                  <div class="task-text fm-inter-400">
                      <span>${card["declaration-text"]}</span>
                  </div>
              </div>
              <div class="task-progress d-flex space-btween align-center flex-row fm-inter-400">
                  <div class="progress-bar">
                    <div class="progress-bar-fill" id="fill${card["id"]}"></div>
                  </div>
                  <span id="fill-text${card["id"]}"> Done</span>
              </div>
              <div class="assignees d-flex flex-row align-center">
                  <div class="assinged-people d-flex just-center align-center flex-row" id="assigned-users${card["id"]}">
                  
                  </div>
  
                  <div class="priority d-flex just-center align-center flex-row">
                      <img src="img/icons/${card["priority"]} prio.png">
                  </div>
              </div>
          </div>
      </div>
  </div> `;
  }

  function generateOverlayHTML(card) {
    return /*html*/`
    <div class="exit-wrapper">
      <img onclick="closeOverlay()" class="overlay-exit" src="./img/icons/overlay exit button.png" id="overlay-exit-img">
    </div>
    <div class="task-overlay-category fm-OpenSA-400 d-flex flex-row" style="background: #${card["category"][0]["color"]}">${card["category"][0]["name"]}</div>
    <div class="task-overlay-decl-header fm-inter-700 d-flex flex-col">
        <span>${card["declaration-header"]}</span>
        <div class="task-overlay-decl fm-inter-400">${card["declaration-text"]}</div>
    </div>
    <div class="task-overlay-date">
        <span class="overlay-date-text fm-inter-700">Due date:</span>
        <span class="overlay-date-int fm-inter-400">${card["date"]}</span>
    </div>
    <div class="task-overlay-prio">
        <span class="overlay-prio fm-inter-700">Priority:</span>
        <img src="./img/icons/${card["priority"]} prio overlay.png">
    </div>
    <div class="task-overlay-assigned d-flex flex-col">
        <span class="overlay-assigned fm-inter-700">Assigned To:</span>
        <div class="overlay-assigned-list" id="assigned-users"> 
        
        </div>
        <div class="edit-btn-wrapper">
            <div onclick="openEdit('${card['priority']}'); setPrio(${card['id']}); detectWindowWidth()" class="edit-btn">
                <img class="edit-top" src="./img/icons/edit button default.png">
                <img class="edit-bottom" src="./img/icons/edit button v2.png">
            </div>
        </div>
    </div>
    `;
  }


  function generateOverlayEditHTML(card) {
    return /*html*/`
    <div class="exit-wrapper">
      <img onclick="closeOverlay()" class="overlay-exit" src="./img/icons/overlay exit button.png" id="overlay-exit-edit-img">
    </div>
    <div class="task-overlay-edit-header">
        <input class="fm-inter-700" min="1" value="${card["declaration-header"]}" id="task-edit-header">
        <span class="required fm-inter-400 d-none">This field is required</span>
    </div>
    <div class="task-overlay-edit-descr">
        <span class="fm-OpenSA-700">Description</span>
        <div>
            <textarea class="fm-OpenSA-400" id="task-edit-text">${card["declaration-text"]}</textarea>
            <img src="./img/icons/textarea icon.png">
        </div>
    </div>
    <div class="task-overlay-edit-date">
        <span class="fm-OpenSA-700">Due Date</span>
        <div>
            <input class="due-date fm-OpenSA-400" type="date" placeholder="dd/mm/yy" value="${card["date"]}" id="task-edit-date">
        </div>
        <span class="required fm-inter-400 d-none">This field is required</span>
    </div>
    <div class="task-overlay-edit-prio">
        <div class="prio-container" id="priorities">
          
        </div>
    </div>
    <div class="task-overlay-edit-assigned" id="task-edit-contacts">
        <span class="fm-OpenSA-700">Assigned to</span>
        <div class="dropdown-wrapper" onclick="showDropdown('edit-assigned-users')">
          <div class="d-flex">
            <div class="select fm-OpenSA-400">
                Select contacts to assign
            </div>
            <div class="select-icon">
              <div>
                  <svg width="14" height="8" viewBox="0 0 14 8" fill="none" class="posX"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                          d="M2.2 0H1.41421C0.523309 0 0.0771403 1.07714 0.707105 1.70711L6.29289 7.29289C6.68342 7.68342 7.31658 7.68342 7.70711 7.29289L13.2929 1.70711C13.9229 1.07714 13.4767 0 12.5858 0H11.8H7H2.2Z"
                          fill="#4589FF" />
                  </svg>
              </div>
            </div>  
          </div>
            <div class="list overflow-auto option-wrapper d-flex flex-col d-none" id="edit-assigned-users" onclick="stopProp(event)">
                          
            </div>
        </div>
    </div>
    <div class="edit-btn-wrapper edit-btn-wrapper-center">
      <div onclick="editTask(${card['id']})" class="redeem-edit-btn fm-OpenSA-400">
        Ok <img src="./img/icons/add task check.png"> 
      </div>
    </div>    
    `;
  }


  function contactEditTemplate(elem, i, ID) {
    return /*html*/ `
                <div class="select-option space-btween fm-OpenSA-400" >
                    <span>${elem.name}</span>
                </div> `;                      
  }
  
  
  function newContactEditTemplate(ID) {
    return /*html*/`<div class="select-option space-btween fm-OpenSA-400" onclick="newContactMenu(${ID})">
                      <span>Invite new contact</span>
                      <img class="contact-icon" src="./img/icons/contact.png">
                    </div>`;
  }
  
  
  function newContactMenu(ID) {
    let contactList = getDoc('task-edit-contacts');
    contactList.innerHTML = "";
    contactList.innerHTML += selectNewContactEdit(ID);
  }
  
  
  function selectNewContactEdit(ID) {
    return /*html*/`
        <span class="fm-OpenSA-700">Assigned to</span>
        <div class="dropdown-wrapper">
            <div class="select fm-OpenSA-400 space-btween">
                    <input class="fs-19" type="text" placeholder="Contact email" id="contact-email" required>
                    <div class="new-category-buttons d-flex flex-row">
                          <div class="clear-color" onclick="returnToListEdit(${ID})">
                            <img class="cancel-category" src="./img/icons/cancel blue.png">
                          </div>
                          <img class="tilde" src="./img/icons/tilde.png">
                          <div class="clear-color" onclick="addNewContactEdit(${ID})">
                            <img class="cancel-category" src="./img/icons/check blue.png">
                          </div>
                    </div>
            </div>
        </div>`;
  }
  
  
  function contactListTemplate(ID) {
    return /*html*/`
      <span class="fm-OpenSA-700">Assigned to</span>
        <div class="dropdown-wrapper" onclick="showDropdown('edit-assigned-users')">
          <div class="d-flex">
            <div class="select fm-OpenSA-400">
                Select contacts to assign
            </div>
            <div class="select-icon">
              <div>
                  <svg width="14" height="8" viewBox="0 0 14 8" fill="none" class="posX"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                          d="M2.2 0H1.41421C0.523309 0 0.0771403 1.07714 0.707105 1.70711L6.29289 7.29289C6.68342 7.68342 7.31658 7.68342 7.70711 7.29289L13.2929 1.70711C13.9229 1.07714 13.4767 0 12.5858 0H11.8H7H2.2Z"
                          fill="#4589FF" />
                  </svg>
              </div>
            </div>  
          </div>
            <div class="list overflow-auto option-wrapper d-flex flex-col d-none" id="edit-assigned-users" onclick="stopProp(event)">
                          
            </div>
        </div>
    `;
  }
  
  
  function generateLeftoverAmount(additionals) {
    return `<div class="assignee d-flex just-center flex-col align-center fm-inter-400" style="background: #005DFF">+${additionals - 2}</div>`;
  }
  
  
  function generateUserSurplusHTML(user) {
    return `<div class="assignee d-flex just-center flex-col align-center fm-inter-400" style="background: ${user["userColor"]}">${user["userInits"]}</div>`;
  }
  
  
  function generateUsersHTML(user) {
    return `<div class="assignee d-flex just-center flex-col align-center fm-inter-400" style="background: ${user["userColor"]}">${user["userInits"]}</div>`;
  }
  
  
  function templateCard(i) {
    return `<div id="template${i}" class="task-card-template"></div>`;
  }


  function generateAddTaskForm() {
    return`
    <form class="d-flex flex-col" onsubmit="addToBoard(); return false;">
    <div class="mobile-add-task">
        <div class="join-logo">
            <img class="join-logo" src="img/icons/join logo.png">
        </div>
        <div>
            <button class="create-task fm-OpenSA-400">Create&nbsp; <img
                    src="img/icons/add task check.png"></button>
        </div>
    </div>
    <div class="add-task-exit-wrapper">
        <span class="fm-OpenSA-700 fs-48 mobile-span">Add Task</span>
        <img onclick="openAddTask()" class="add-task-exit"
            src="./img/icons/overlay exit button.png">
    </div>
    <div class="button-container">
        <div class="add-task-btn-wrapper">
            <span class="fm-OpenSA-700 fs-48">Add Task</span>
            <button class="create-task fm-OpenSA-400">Create Task<img
                    src="img/icons/add task check.png"></button>
        </div>
    </div>
    <div class="add-task-form">
        <div class="add-task-header ">
            <input class="fm-OpenSA-700" min="1" placeholder="Enter a title" required
                id="title">
            <span class="required fm-inter-400 d-none">This field is required</span>
        </div>
        <div class="add-task-assigned">
            <div class="dropdown-wrapper" onclick="showDropdown('contact-list')">
                <div class="d-flex">
                    <div class="select fm-OpenSA-400">
                        Select contacts to assign
                    </div>
                    <div class="select-icon">
                        <div>
                            <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                class="posX" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M2.2 0H1.41421C0.523309 0 0.0771403 1.07714 0.707105 1.70711L6.29289 7.29289C6.68342 7.68342 7.31658 7.68342 7.70711 7.29289L13.2929 1.70711C13.9229 1.07714 13.4767 0 12.5858 0H11.8H7H2.2Z"
                                    fill="#4589FF" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="option-wrapper d-flex flex-col d-none" id="contact-list"
                    onclick="stopProp(event)">
  
                </div>
            </div>
        </div>
        <div class="add-task-date">
            <span class="fm-OpenSA-700">Due date</span>
            <div>
                <input class="due-date fm-OpenSA-400" type="date" required id="date">
            </div>
            <span class="required fm-inter-400 d-none">This field is required</span>
        </div>
        <div class="add-task-assigned" id="category-body">
            <span class="fm-OpenSA-700">Category</span>
            <div class="dropdown-wrapper" onclick="showDropdown('categories')">
                <div class="d-flex">
                    <div class="select fm-OpenSA-400">
                        Select new category
                    </div>
                    <div class="select-icon">
                        <div>
                            <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                class="posX" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M2.2 0H1.41421C0.523309 0 0.0771403 1.07714 0.707105 1.70711L6.29289 7.29289C6.68342 7.68342 7.31658 7.68342 7.70711 7.29289L13.2929 1.70711C13.9229 1.07714 13.4767 0 12.5858 0H11.8H7H2.2Z"
                                    fill="#4589FF" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="option-wrapper d-flex flex-col d-none" id="categories"
                    onclick="stopProp(event)">
                </div>
            </div>
        </div>
        <div class="task-overlay-edit-prio">
            <div class="prio-container" id="prioritiesAT">
  
  
            </div>
        </div>
        <div class="task-overlay-edit-descr">
            <span class="fm-OpenSA-700">Description</span>
            <div>
                <textarea class="fm-OpenSA-400" id="description" required></textarea>
                <img src="./img/icons/textarea icon.png">
            </div>
        </div>
        <div class="add-task-subtask">
            <span class="fm-OpenSA-700">Subtask</span>
            <div class="subtask-input">
                <input class=" subtask fm-OpenSA-400" type="text" placeholder="Add new subtask">
            </div>
            <span class="required fm-inter-400 d-none">This field is required</span>
            <div class="subtask-container">
  
            </div>
        </div>
    </div>
  </form>  
    `;
  }


  function categoryTemplate(elem) {
    return /*html*/ `
      <div class="select-option fm-OpenSA-400" onclick="addCategory('${elem.color}', ${elem.ID})">
          <span id="cat-name${elem.ID}">${elem.name}</span> 
          <div id="cat-color" class="category-color" style="background: #${elem.color}"> </div> 
      </div>   
      `;
  }
  
  
  function newCategoryTemplate() {
    return /*html*/ `
      <div class="select-option fm-OpenSA-400" onclick="newCategoryMenu()">
          <span>New category name</span>
      </div>
      `;
  }
  
  
  function newCategoryMenu() {
    let categoryList = getDoc("category-body");
  
    categoryList.innerHTML = "";
    categoryList.innerHTML = selectNewCategoryHTML(); renderCatColors();
  }
  
  
  function selectNewCategoryHTML() {
    return /*html*/ `<span class="fm-OpenSA-700">Category</span>               
                      <div class="dropdown-wrapper">
                          <div class="select fm-OpenSA-400 space-btween">
                              <input class="fs-19" type="text" placeholder="New category name" id="new-cat-name" required>
                              <div class="new-category-buttons d-flex flex-row">
                                  <div class="clear-color" onclick="returnToList(); renderCategoryList()">
                                    <img class="cancel-category" src="./img/icons/cancel blue.png">
                                  </div>
                                <img class="tilde" src="./img/icons/tilde.png">
                                  <div class="clear-color" onclick="addNewCategory()">
                                    <img class="cancel-category" src="./img/icons/check blue.png">
                                  </div>
                              </div>
                          </div>
                          <div class="choose-color d-flex flex-row" id="cat-colors">
  
                          </div>           
                      </div>         
      `;
  }
  
  
  function initList(cat) {
    return /*html*/`<span class="fm-OpenSA-700">Category</span>
                    <div class="dropdown-wrapper" onclick="showDropdown('categories')">
                        <div class="d-flex">
                            <div class="select fm-OpenSA-400">
                              <span>${cat.name}</span>
                              <div class="category-color" style="background: #${cat.color}"></div>
                            </div>
                            <div class="select-icon">
                                <div>
                                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" class="posX"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M2.2 0H1.41421C0.523309 0 0.0771403 1.07714 0.707105 1.70711L6.29289 7.29289C6.68342 7.68342 7.31658 7.68342 7.70711 7.29289L13.2929 1.70711C13.9229 1.07714 13.4767 0 12.5858 0H11.8H7H2.2Z"
                                            fill="#4589FF" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="option-wrapper d-flex flex-col d-none" id="categories"
                            onclick="stopProp(event)">
                        </div>
                    </div>
                    `;
  }
  
  
  function contactTemplate(elem, i) {
    return /*html*/ `<label class="checkbox" for="checkboxID${i}">
                          <div class="select-option space-btween fm-OpenSA-400" >
                              <span>${elem.name}</span>
                              <input class="checkbox-input" type="checkbox" name="myCheckBoxName"
                                  id="checkboxID${i}" onclick="addUserToTask(${i})">
                              <div class="checkbox-box"></div>
                          </div>
                      </label>`;
  }
  
  
  function categoryListTemplate() {
    return /*html*/`<span class="fm-OpenSA-700">Category</span>
              <div class="dropdown-wrapper" onclick="showDropdown('categories')">
                <div class="d-flex">
                  <div class="select fm-OpenSA-400">
                    Select new category                              
                  </div>
                  <div class="select-icon">
                    <div>
                      <svg width="14" height="8" viewBox="0 0 14 8" fill="none" class="posX"  xmlns="http://www.w3.org/2000/svg">
                        <path 
                          d="M2.2 0H1.41421C0.523309 0 0.0771403 1.07714 0.707105 1.70711L6.29289 7.29289C6.68342 7.68342 7.31658 7.68342 7.70711 7.29289L13.2929 1.70711C13.9229 1.07714 13.4767 0 12.5858 0H11.8H7H2.2Z"
                          fill="#4589FF" />                                       
                      </svg>                                                                  
                    </div>
                  </div>                    
                </div>                          
            
              <div class="option-wrapper d-flex flex-col d-none" id="categories" onclick="stopProp(event)">
                      
  
              </div>
            </div>`;
  }
  
  
  function generatePrioHTML() {
    return `
      <div id="urgent" aria-required="true" class="urgent fm-OpenSA-400" onclick="selectPrio('urgent', 'urgent-img', 'select-urgent', 'urgent white', 'urgent red', 'medium', 'medium yellow', 'low', 'low green')">
        Urgent <img id="urgent-img" src="./img/icons/urgent red.png">
      </div>
      <div id="medium" aria-required="true" class="medium fm-OpenSA-400" onclick="selectPrio('medium', 'medium-img', 'select-medium', 'medium white', 'medium yellow', 'urgent', 'urgent red', 'low', 'low green')">
        Medium <img id="medium-img" src="./img/icons/medium yellow.png">
      </div>
      <div id="low" aria-required="true" class="low fm-OpenSA-400"  onclick="selectPrio('low', 'low-img', 'select-low', 'low white', 'low green', 'urgent', 'urgent red', 'medium', 'medium yellow')">
        Low <img id="low-img" src="./img/icons/low green.png">
      </div>
    `;
  }


  function templateRenderContacts(i) {
    return /*html*/`
            <div id="contact-container-${firstChar[i].toUpperCase()}" class="contact-container">
                <div id="contact-top-${firstChar[i].toUpperCase()}" class="contact-top">
                    <div id="first-letter-${firstChar[i].toUpperCase()}" class="first-letter d-flex">${firstChar[i].toUpperCase()}</div>
                    <div class="contact-line d-flex"></div>
                </div>
            </div>`
}


function templateRenderSortContacts(i){
    return /*html*/ `<div class="contact-box-container d-flex">
    <div onclick="addCurrentUser(${i});renderContactDetails(${i});openMobileContactDetails();addCurrentContactBox(${i}); setBgColorToContactsBox(${i})" class="contact-box d-flex" id="contact-box-${i}">
        <div class="contact-inits" style="background-color:${contacts[i].userColor}">${firstLetterToUpperCase(contacts[i].name)}</div>
        <div class="contact-right">
            <div class="contact-name">${contacts[i].name}</div>
            <a class="e-mail">${contacts[i].email}</a>
        </div>
    </div>
    <div id="contact-menu-user-${contacts[i].userID}"class="dropdown"><button>...</button>
        <div class="dropdown-content">
            <ul>
                <li onclick="startCall(${i})">Call</li>
                <li onclick="sendMail(${i})">Mail</li>
                <li onclick="addCurrentUser(${i});openEditContact()">Edit</li>
                <li onclick="deleteContact(${i})">Delete</li>
            </ul>
        </div>
    </div>
</div>`
}


function templateContactDetails(currentUser) {
    return /*html*/ `<div class="contact-details-container" id="contact-details-${currentUser}">
    <div class="contact-details-top">
        <div class="contact-details-inits" style="background-color:${contacts[currentUser].userColor}">${firstLetterToUpperCase(contacts[currentUser].name)}</div>
        <div class= "contact-details-name-container">
            <div class="contact-details-name">${contacts[currentUser].name}</div>
            <div class="contact-details-add-task" onclick="openAddTask('to_do')">
                <p>+</p> Add Task
            </div>
        </div>
    </div>
    <div class="contact-details-contact-information-frame">
        <div class="contact-details-contact-information">Contact Information</div>
        <div  onclick="openEditContact()" id="edit-contact-"class="contact-details-contact-edit">
            <img src="./img/icons/pencil.png" alt="pencilPNG">
            <div>Edit Contact</div>
        </div>
    </div>
    <div class="d-flex flex-column gap-21">
        <div class="fw-bold d-flex">Email:</div>
        <a class="td-none" href="mailto:${contacts[currentUser].email}">${contacts[currentUser].email}</a>
    </div>
    <div class="d-flex flex-column gap-21 td-none">
        <div class="fw-bold d-flex">Mobil:</div>
        <a class="td-none"href="tel:+491749429305">${convertPhone(contacts[currentUser].phone)}</a>
    </div>
</div>`
}


function templateMobileContactDetails(currentUser) {
    return /*html*/ `
    <div class="mobile-contact-head">
        <span>Kanban Project Management Tool</span>
    </div>
    <div class="mobile-row100 flex-end">
        <img onclick="closeMobileEdit()" class="mobile-back" src="./img/icons/arrow.png">
    </div>
    <div class="contact-details-top">
        <div class="contact-details-inits">${firstLetterToUpperCase(contacts[currentUser].name)}</div>
        <div class= "contact-details-name-container">
            <div class="contact-details-name">${contacts[currentUser].name}</div>
            <div class="contact-details-add-task" onclick="openAddTask('to_do')">
                <p>+</p> Add Task
            </div>
        </div>
    </div>
    <div class="mobile-row">
        <span>Contact Information</span>
    </div>
    <div class="mobile-row">
        <div class="mobile-row-container">
            <span>Email:</span>
            <a href="mailto:mail@${contacts[currentUser].email}">${contacts[currentUser].email}</a>
        </div>
    </div>
    <div class="mobile-row">
        <div class="mobile-row-container">
            <span>Mobil:</span>
            <a href="tel:${contacts[currentUser].email}">${contacts[currentUser].phone}</a>
        </div>
    </div>
        <img onclick="showEditMobileModal()" class="edit-img" src="./img/icons/edit button default.png">
        <section id="mobile-nav">
    <nav>
        <div>
            <a class="d-flex" href="./summary.html">
                <div><img src="./img/icons/nav-summary.png" alt=""></div>Summary
            </a>
        </div>
        <div>
            <a class="d-flex" href="./board.html">
                <div><img src="./img/icons/nav-board.png" alt=""></div>Board
            </a>
        </div>
        <div>
            <a class="d-flex" href="./add_task.html">
                <div><img src="./img/icons/nav-AddTask.png" alt=""></div>Add Task
            </a>
        </div>
        <div>
            <a class="d-flex" href="./contacts.html">
                <div><img id="nav-contact-img" src="./img/icons/nav-Contacts.png" alt=""></div>Contacts
            </a>
        </div>

    </nav>
</section>`
}