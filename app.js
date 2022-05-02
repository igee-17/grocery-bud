// ****** SELECT ITEMS **********
const form = document.querySelector(".grocery-form");
const input = document.querySelector("#grocery");
const alert = document.querySelector(".alert");
const submit = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");

// edit option
let editElement;
let editFlag = false;
let editID = "";

// ****** EVENT LISTENERS **********

// submit form
form.addEventListener("submit", addItem);

// clear items
clearBtn.addEventListener("click", clearItems);

// SET ITEMS
window.addEventListener("DOMContentLoaded", setItems());

// ****** FUNCTIONS **********

function addItem(e) {
  e.preventDefault();
  const id = new Date().getTime().toString();
  value = input.value;

  // CONDITIONS:
  // 1. if user adds item to the list and is not editing
  // 2. if user adds item to list and is editing
  // 3. if user hasn't added anything
  if (value && !editFlag) {
    // create element
    createElement(id, value);

    // display alert
    showAlert("item added", "success");

    // add to local storage
    addToLocalStorage(id, value);

    // set back to default
    setBackToDefault();
  } else if (value && editFlag) {
    // console.log("item edited");
    editElement.innerHTML = value;
    showAlert("item edited", "success");

    // edit local storage
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    showAlert("kindly input an item", "danger");
  }
}
// SHOW ALERT
function showAlert(message, attribute) {
  alert.innerHTML = `<p class="alert">${message}</p>`;
  alert.classList.add(`alert-${attribute}`);

  setTimeout(() => {
    alert.classList.remove(`alert-${attribute}`);
    alert.innerHTML = ``;
  }, 1000);
}

// CLEAR ITEMS
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");

  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  showAlert("empty list", "danger");
  localStorage.removeItem("list");
}
// DELETE ITEM (not working correctly)
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  // console.log(id);
  // console.log(list.children);
  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  showAlert("item removed", "danger");
  setBackToDefault();

  // TO REMOVE FROM LOCAL STORAGE
  removeFromLocalStorage(id);
}

// EDIT ITEM
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;

  editElement = e.currentTarget.parentElement.previousElementSibling;

  editFlag = true;
  editID = element.dataset.id;

  submit.textContent = "edit";
  input.value = editElement.innerHTML;
  // setBackToDefault();
  // let attr = document.createAttribute("autofocus");
  // editElement.setAttributeNode(attr);
}

//  set back to default

function setBackToDefault() {
  input.value = "";
  editFlag = false;
  submit.textContent = "submit";
  editID = "";
}

// ****** LOCAL STORAGE **********

// ADD TO LOCAL STORAGE
function addToLocalStorage(id, value) {
  // const grocery = {id: id, value: value}
  const grocery = { id, value };

  const items = getLocalStorage();

  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}

// REMOVE FROM LOCAL STORAGE
function removeFromLocalStorage(id) {
  items = getLocalStorage();
  items = items.filter(function (item) {
    // this checks if the id of the list we get from the local storage, equals the id of the currentTarget from our 'deleteItem' function
    if (item.id !== id) {
      return item;
    }
  });
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
}

// EDIT ITEM IN LOCAL STORAGE
function editLocalStorage(id, value) {
  items = getLocalStorage();

  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

// GET ITEM FROM LOCAL STORAGE
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}
// ****** SETUP ITEMS **********

function setItems() {
  items = getLocalStorage();

  if (items.length > 0) {
    items.forEach(function (item) {
      createElement(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}

function createElement(id, value) {
  element = document.createElement("article");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add("grocery-item");

  element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
  // console.log(element);

  list.appendChild(element);
  container.classList.add("show-container");

  // add event listeners to both buttons;

  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);
}
