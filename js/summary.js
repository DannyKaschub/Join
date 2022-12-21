let task_cards = [];
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const d = new Date();
setURL("https://danny-kaschub.developerakademie.net/smallest_backend_ever-master");




async function init() {
    await loadAtStart()
    task_cards = (await JSON.parse(backend.getItem("tasks"))) || [];
    await greetUser();
    renderCurrentDate();
    renderAmountToTasks();
    board = "summary.html"
}


function renderCurrentDate() {
    let currentYear = new Date().getFullYear().toString();
    let currentDay = new Date().getDate().toString();
    let currentMonth = month[d.getMonth()];
    document.getElementById('urgent-date').innerHTML = `${currentMonth} ${currentDay}, ${currentYear}`;
}

async function greetUser() {
    let currentTime = new Date().getHours();
    if (currentTime < 12) {
        document.getElementById("greet-at-time").innerHTML = "Good morning, ";
    } else {
        document.getElementById("greet-at-time").innerHTML = "Good evening, ";
    }
    document.getElementById("greet-user").innerHTML = getCurrentUserName();
}

function syncSummaryTasks(state) {
    let states = task_cards.filter((a) => a.state === state)
    let amountState = states.length;
    return amountState
}

function syncSummaryUrgent() {
    let urgent = task_cards.filter((a) => a.priority[0] === "urgent")
    let amountUrgent = urgent.length;
    console.log(amountUrgent);
    return amountUrgent
}


function renderAmountToTasks() {
    getDoc('task-to-do-id-').innerHTML = syncSummaryTasks("to_do");
    getDoc('task-in-board-id-').innerHTML = task_cards.length;
    getDoc('task-in-progress-id-').innerHTML = syncSummaryTasks("in_progress");
    getDoc('task-awaiting-feedback-id-').innerHTML = syncSummaryTasks("await_feedback");
    getDoc('task-done-id-').innerHTML = syncSummaryTasks("done");
    getDoc("task-id-").innerHTML = syncSummaryUrgent();

}

function goToBoard(){
    window.location.href = "./board.html"
}
