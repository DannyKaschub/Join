async function init() {
  await downloadFromServer();
  task_cards = (await JSON.parse(backend.getItem("tasks"))) || [];
  contacts = (await JSON.parse(backend.getItem("contacts"))) || [];
  categories = (await JSON.parse(backend.getItem("categories"))) || [];
  renderContactList();
  renderCategoryList();
  renderPriorities();
  renderSubTask();
  board = "add_task.html";
  selectedState = "to_do";
}


setURL("https://danny-kaschub.developerakademie.net/smallest_backend_ever-master");


function showDropdown(id) {
  getDoc(id).classList.toggle("option-wrapper");
  getDoc(id).classList.toggle("d-none");

}


function stopProp(event) {
  event.stopPropagation();
}

function clearSubtask() {
  document.getElementById("subtaskText").value = ``;
}

function pushSubtaskLocalStorage() {
  if (document.getElementById("subtaskText").value) {
    document.getElementById("mistakeReportsubtask").innerHTML = ``;
    subTasks.push(document.getElementById("subtaskText").value);
    document.getElementById("subtaskText").value = ``;
    localStorage.setItem("subtasks", JSON.stringify(subTasks));
    renderSubTask();
  } else {
    document.getElementById("mistakeReportsubtask").innerHTML = `Please enter value!`;
  }
}

function renderSubTask() {
  subTasks = JSON.parse(localStorage.getItem("subtasks")) || [];
  document.getElementById("addSubtaskCheckbox").innerHTML = ``;
  for (let i = 0; i < subTasks.length; i++) {
    document.getElementById("addSubtaskCheckbox").innerHTML += `
        <div class="subtaskList" id="subtaskValue">  
        <input id="${subTasks[i]}" value="${subTasks[i]}" class="subtaskCheckbox pointer" type="checkbox">
        <p>${subTasks[i]}</p>
        </div>`;
  }
}

function clearSubtaskrender() {
  subTasks = [];
  document.getElementById("addSubtaskCheckbox").innerHTML = ``;
}