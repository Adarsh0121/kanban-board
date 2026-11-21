let tasksData = {};
const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const columns = [todo, progress, done];
let dragElement = null;

const modal = document.querySelector(".modal");
const toggleModalButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const addTaskButton = document.querySelector("#add-new-task");
const titleInput = document.querySelector("#task-title-input");
const descInput = document.querySelector("#task-desc-input");

function addTask(title, desc, column) {
  const div = document.createElement("div");
  div.classList.add("task");
  div.setAttribute("draggable", "true");

  const h1 = document.createElement("h1");
  h1.textContent = title;
  const p = document.createElement("p");
  p.textContent = desc;
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";

  div.append(h1, p, deleteButton);
  column.appendChild(div);

  div.addEventListener("dragstart", () => {
    dragElement = div;
  });

  deleteButton.addEventListener("click", () => {
    div.remove();
    updateTaskCount();
  });

  return div;
}

function updateTaskCount() {
  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".right");

    tasksData[col.id] = Array.from(tasks).map((t) => ({
      title: t.querySelector("h1").innerText,
      desc: t.querySelector("p").innerText,
    }));

    count.innerText = tasks.length;
  });
  localStorage.setItem("tasks", JSON.stringify(tasksData));
}

// Page reload par localStorage se data load karo
const saved = localStorage.getItem("tasks");
if (saved) {
  const data = JSON.parse(saved);
  for (const col in data) {
    const column = document.querySelector(`#${col}`);
    if (!column) continue;
    data[col].forEach((task) => addTask(task.title, task.desc, column));
  }
}
updateTaskCount();

// Drag and drop
columns.forEach((col) => {
  col.addEventListener("dragenter", (e) => {
    e.preventDefault();
    col.classList.add("hover-over");
  });

  col.addEventListener("dragleave", (e) => {
    // child element par jaane par flicker na ho
    if (!col.contains(e.relatedTarget)) {
      col.classList.remove("hover-over");
    }
  });

  col.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  col.addEventListener("drop", (e) => {
    e.preventDefault();
    col.classList.remove("hover-over");
    if (dragElement) {
      col.appendChild(dragElement);
      dragElement = null;
      updateTaskCount();
    }
  });
});

// Modal
toggleModalButton.addEventListener("click", () => {
  modal.classList.toggle("active");
});

modalBg.addEventListener("click", () => {
  modal.classList.remove("active");
});

// Naya task add karo
addTaskButton.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const desc = descInput.value.trim();

  if (!title) return;

  addTask(title, desc, todo);
  updateTaskCount();

  titleInput.value = "";
  descInput.value = "";
  modal.classList.remove("active");
});