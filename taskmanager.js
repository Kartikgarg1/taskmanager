const taskInput = document.getElementById("taskInput");
const searchInput = document.getElementById("searchInput");
const taskList = document.getElementById("taskList");
const statusFilter = document.getElementById("statusFilter");
const tasks = localStorage.getItem("items") ? JSON.parse(localStorage.getItem("items")) : [];
const taskHeading = document.getElementById("taskheadingInput");

function addTask() {
  const taskText = taskInput.value.trim();
  const taskhead = taskHeading.value.trim();
  const selectedCategory = categorySelect.value;
  const selectedDueDate = dueDateInput.value; 
  if (taskText !== "") {
    const task = {
      id: new Date().getTime(),
      text: taskText,
      head: taskhead,
      category: selectedCategory,
      dueDate: selectedDueDate, // Include the dueDate in the task object
      completed: false
    };
    tasks.push(task);
    localStorage.setItem("items", JSON.stringify(tasks));
    updateTaskList();
    taskInput.value = "";
  }
}


function deleteTask(id) {
 const taskIndex=tasks.findIndex(task=>task.id===id);
 if(taskIndex!==-1)
 {
  tasks.splice(taskIndex,1);
  updateTaskList();
  localStorage.setItem("items",JSON.stringify(tasks));
 }
  
}

function editTask(id, newText,newhead) {
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex !== -1) {
    tasks[taskIndex].text = newText;
    tasks[taskIndex].head=newhead;

    updateTaskList();
    localStorage.setItem("items", JSON.stringify(tasks));
  }
}

function toggleCompletion(id) {
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    updateTaskList();
  }
}

function filterTasks() {
  const selectedStatus = statusFilter.value;
  updateTaskList(selectedStatus);
}

function searchTasks() {
  const searchText = searchInput.value.trim().toLowerCase();
  const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(searchText));
  updateTaskList(null, filteredTasks);
}

const dates=[];
const d=new Date().getDate()+"-"+new Date().toLocaleString('default', { month: 'long' })+"-"+new Date().getFullYear()

// Update the function updateTaskList to render task cards
function updateTaskList(filterStatus = null, taskArray = tasks) {
const taskGrid = document.getElementById("taskGrid");
taskGrid.innerHTML = "";

for (const task of taskArray) {
  if (
    filterStatus === null ||
    (filterStatus === "pending" && !task.completed) ||
    (filterStatus === "completed" && task.completed)
  ) {
    const taskCard = document.createElement("div");
    taskCard.className = "task-card";
    taskCard.innerHTML = `
      <div class="task-header">
        <h3>${task.head}</h3>
        <p>Category: ${task.category}</p>
        </div>
      <p>${task.text}</p> <span>${d}</span>
      <p>Due Date: ${formatDate(task.dueDate)}</p> <!-- Display formatted due date -->
      <div class="task-actions">
        <button onclick="toggleCompletion(${task.id})">${task.completed ? "Mark as Pending" : "Mark as Complete"}</button>
        <button onclick="editTaskPrompt(${task.id}, '${task.text}', '${task.head}')"> <p>Edit</p> </button>
        <button onclick="deleteTask(${task.id})"> <p>Delete</p> </button>
      </div>
    `;
    taskGrid.appendChild(taskCard);
  }
}
}

// task status


function formatDate(dateString) {
const options = { year: 'numeric', month: 'long', day: 'numeric' };
return new Date(dateString).toLocaleDateString(undefined, options);
}                            


function editTaskPrompt(id, currentText,currhead) {
  const newText = prompt("Edit task:", currentText);
  const newhead=prompt("edit head",currhead)
  if (newText !== null) {
    editTask(id, newText,newhead);
  }
}

taskInput.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    addTask();
  }
});

searchInput.addEventListener("keyup", function(event) {
  searchTasks();
});

updateTaskList();

const taks = JSON.parse(localStorage.getItem("tasks"));
if(taks){
  taks.forEach((task) => addTask(task));
}


  // Check if the browser supports speech recognition
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  // Set up recognition parameters
  recognition.continuous = false;
  recognition.interimResults = false;

  // When speech recognition starts, this event is fired
  recognition.onstart = () => {
    console.log('Voice recognition started...');
  };

  // When speech recognition ends, this event is fired
  recognition.onend = () => {
    console.log('Voice recognition ended.');
  };

  // When a result is obtained, this event is fired
  recognition.onresult = event => {
    const result = event.results[0][0].transcript;
    searchInput.value = result;
    searchTasks(); // Call your searchTasks function to filter tasks based on the spoken query
  };

  // Attach recognition to a button or trigger
  const voiceSearchButton = document.getElementById('voiceSearchButton');
  voiceSearchButton.addEventListener('click', () => {
    recognition.start();
  });
} else {
  console.log('Speech recognition not supported.');
}

