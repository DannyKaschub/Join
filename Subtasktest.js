
// wird von dem plus button ausgelöst der im subtask das plus darstellt
function changeIconsInSubtasks() {
    document.getElementById('subtasks-container').innerHTML = renderNewSubTaskInput();
}

// häckchen löst diesen spas aus

function addNewSubtask() {
    let inputSubtask = document.getElementById('subtask-input').value; //holt den inhalt des schreibfeldes
    if (inputSubtask.length >= 3) { // startet nur wenn mehr als 4 drin sind
        document.getElementById('subtasks-output').innerHTML = ''; // leert den output container komplett
        let outputbox = document.getElementById('subtasks-output'); //setzt die output box auf ne variable
        addSubtask(inputSubtask);
        showSubtask(outputbox);
        clearSubtaskInput();
    }
}

function addSubtask(subtask) {
    currentSubTasks.push(subtask); //pust den ihalt des inputfeldes in ein eigenes array
}

function showSubtask(outputbox) {// erstellt alle subtasks per schleife
    for (let i = 0; i < currentSubTasks.length; i++) {
        let subtask = currentSubTasks[i]; // rattert übers array mit neuer var
        outputbox.innerHTML += renderSubtask(i, subtask); //erstellt immer neuen html code über eine extra funktion übergibt die position im array sowie die eingabe
    }
}


// kommt aus einer anderen datei

function renderSubTasks(id, i, title, description, category, date, prio, displaysubtask) {
    return `
    <div>
    <input id="checkbox-${id}-${i}" type="checkbox" onclick="checkboxToggle('${id}', '${i}', '${displaysubtask}')">
    <label for="checkbox-${id}-${i}" id="subtask-${id}-${i}" class="m-bottom-5 m-left-8">${displaysubtask}</label>
    </div>
    `
}