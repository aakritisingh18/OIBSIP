let todo = JSON.parse(localStorage.getItem("todo")) || [];
const todoInput = document.getElementById("todoInput");
const todoDate = document.getElementById("todoDate");
const todoTime = document.getElementById("todoTime");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const addButton = document.getElementById("addButton");
const deleteButton = document.getElementById("deleteButton");
const deleteSelectedButton = document.getElementById("deleteSelectedButton");
const alarmSound = document.getElementById("alarmSound");

document.addEventListener("DOMContentLoaded", function () {
    addButton.addEventListener("click", addTask);
    todoInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addTask();
        }
    });
    deleteButton.addEventListener("click", deleteAllTasks);
    deleteSelectedButton.addEventListener("click", deleteSelectedTasks);
    displayTasks();
    checkAlarms();
});

function addTask() {
    const newTask = todoInput.value.trim();
    const date = todoDate.value;
    const time = todoTime.value;

    if (newTask !== "") {
        todo.push({
            text: newTask,
            date: date,
            time: time,
            disabled: false,
            selected: false
        });
        saveToLocalStorage();
        todoInput.value = "";
        todoDate.value = "";
        todoTime.value = "";
        displayTasks();
        checkAlarms(); 
    }
}

function deleteAllTasks() {
    todo = [];
    saveToLocalStorage();
    displayTasks();
    checkAlarms(); 
}

function deleteSelectedTasks() {
    todo = todo.filter(task => !task.selected);
    saveToLocalStorage();
    displayTasks();
    checkAlarms(); 
}

function displayTasks() {
    todoList.innerHTML = "";
    todo.forEach((item, index) => {
        const p = document.createElement("p");
        p.innerHTML = `
            <div class="todo-container">
                <input type="checkbox" class="select-checkbox" id="select-${index}" ${item.selected ? "checked" : ""}>
                <input type="checkbox" class="todo-checkbox" id="input-${index}" ${item.disabled ? "checked" : ""}>
                <p id="todo-${index}" class="${item.disabled ? "disabled" : ""}" onclick="editTask(${index})">
                    ${item.text} <span>${item.date ? `Due: ${item.date} ${item.time ? `at ${item.time}` : ""}` : ""}</span>
                </p>
                ${item.date && item.time ? '<span class="alarm-notification">Alarm set!</span>' : ''}
            </div>
        `;
        p.querySelector(".todo-checkbox").addEventListener("change", () => {
            toggleTask(index);
        });
        p.querySelector(".select-checkbox").addEventListener("change", () => {
            selectTask(index);
        });
        todoList.appendChild(p);
    });
    todoCount.textContent = todo.length;
}

function editTask(index) {
    const todoItem = document.getElementById(`todo-${index}`);
    const existingText = todo[index].text;
    const inputElement = document.createElement("input");

    inputElement.value = existingText;
    todoItem.replaceWith(inputElement);

    inputElement.focus();

    inputElement.addEventListener("blur", function () {
        const updatedText = inputElement.value.trim();
        if (updatedText) {
            todo[index].text = updatedText;
            saveToLocalStorage();
        }
        displayTasks();
    });
}

function toggleTask(index) {
    todo[index].disabled = !todo[index].disabled;
    saveToLocalStorage();
    displayTasks();
}

function selectTask(index) {
    todo[index].selected = !todo[index].selected;
    saveToLocalStorage();
}

function saveToLocalStorage() {
    localStorage.setItem("todo", JSON.stringify(todo));
}

function checkAlarms() {
    const now = new Date();
    todo.forEach(task => {
        if (task.date && task.time) {
            const alarmTime = new Date(`${task.date}T${task.time}`);
            if (alarmTime <= now && !task.disabled) {

                alarmSound.play();
                alert(`Alarm for task: ${task.text}`);

            }
        }
    });
}
