'use strict';

const taskInput = document.querySelector('.task__input input');
const taskBox = document.querySelector('.task__box');
const filters = document.querySelectorAll('.filters span');
const clearAll = document.querySelector('.clear__btn')
// Getting local storage todo-list data
let toDo = JSON.parse(localStorage.getItem('todo-list'));
let editedID;
let isEditedTask = false;

filters.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('span.active').classList.remove('active');
        btn.classList.add('active');
        showToDo(btn.id);
    })
})

const showToDo = function (filter) {
    let li = '';

    if (!toDo) return;

    toDo.forEach((todo, id) => {
        let isCompleted = todo.status === 'completed' ? 'checked' : '';
        if (filter == todo.status || filter == 'all') {
            li += `
            <li class="task">
            <label for="${id}">
                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                <p class="${isCompleted}">${todo.name}</p>
            </label>
            <div class="setting">
                <i class="fa-solid fa-ellipsis" onclick="showMenu(this)"></i>
                <ul class="task__menu">
                    <li onclick="editTask(${id},'${todo.name}')"><i class="fa-solid fa-pen"></i>Edit</li>
                    <li onclick="deleteTask(${id})"><i class="fa-solid fa-trash"></i>Delete</li>
                </ul>
            </div>
        </li>
        `;
        }

    })
    taskBox.innerHTML = li || `<span>You don't have any task now.</span>`;
}
showToDo('all');

taskInput.addEventListener('keyup', (e) => {
    const inputData = taskInput.value.trim();

    if (e.key == 'Enter' && inputData) {
        if (!isEditedTask) {
            if (!toDo) {
                toDo = [];
            }
            let taskInfo = {
                name: inputData,
                status: 'pending'
            }
            toDo.push(taskInfo);
        } else {
            isEditedTask = false;
            toDo[editedID].name = inputData;
        }
        taskInput.value = '';
        localStorage.setItem('todo-list', JSON.stringify(toDo));
        showToDo('all');
    }
})


const showMenu = function (selectedTask) {
    let taskMenu = selectedTask.closest('div').lastElementChild;
    taskMenu.classList.add('show');
    document.addEventListener('click', (e) => {
        if (e.target.tagName != 'I' || e.target != selectedTask) {
            taskMenu.classList.remove('show');
        }
    })
}
const editTask = function (taskID, taskName) {
    editedID = taskID;
    isEditedTask = true;
    taskInput.value = taskName;
}
const deleteTask = function (id) {
    // Delete item from array
    toDo.splice(id, 1);
    localStorage.setItem('todo-list', JSON.stringify(toDo));
    showToDo('all');
}
const updateStatus = function (selectedTask) {
    let taskName = selectedTask.closest('label').lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add('checked');
        // Updating the status Value
        toDo[selectedTask.id].status = 'completed';
    } else {
        taskName.classList.remove('checked');
        // Updating the status Value
        toDo[selectedTask.id].status = 'pending';
    }
    localStorage.setItem('todo-list', JSON.stringify(toDo))
}
clearAll.addEventListener('click', () => {
    toDo.splice(0, toDo.length);
    localStorage.clear();
    showToDo('all')
})