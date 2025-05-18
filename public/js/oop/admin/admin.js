import { getUsers, updateUser } from "../../utils/api.js";

const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

const tableBody = document.getElementById("users-table-body");
const filterCheckbox = document.getElementById("pending-campaigners-filter");

tabButtons.forEach((button) => {
  button.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    tabButtons.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
    tabContents.forEach((content) => content.classList.remove("active"));
    const targetId = this.id.replace("-tab", "-section");
    document.getElementById(targetId).classList.add("active");
  });
});

// ========== Original Schema Data ==========

// GET

let users = [];

async function loadUsers() {
  tableBody.innerHTML = `<tr><td colspan="6">loading data... </td></tr>`;
  try {
    const data = await getUsers();

    if (!Array.isArray(data)) {
      throw new Error(" data isn't array");
    }
    users = data;
    renderUsers();
  } catch (error) {
    console.error("error load users");
    throw error;
  }
}

 
function renderUsers() {
  tableBody.innerHTML = "";

  const showOnlyPending = filterCheckbox.checked;
  const userList = showOnlyPending
    ? users.filter((user) => user.role === "pending_campaigner")
    : users;

  if (userList.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6">No users found</td></tr>`;
    return;
  }

  userList.forEach((user) => {
    const row = document.createElement("tr");

    // Status badge class
    let statusBadgeClass = user.isActive ? "success" : "danger";
    let statusText = user.isActive ? "Active" : "Banned";
    let roleBadgeClass =
      user.role === "pending_campaigner" ? "warning" : "info";

    row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td><span class="badge ${roleBadgeClass}">${user.role}</span></td>
        <td><span class="badge ${statusBadgeClass}">${statusText}</span></td>
        <td class="actions d-flex">
          ${
            user.role === "pending_campaigner"
              ? `<button  type="button" class="button success" data-action="approve-campaigner" data-id="${user.id}">Approve</button>
                  <button type="button" class="button danger" data-action="reject-campaigner" data-id="${user.id}">Reject</button>`
              : ""
          }
          ${
            user.isActive
              ? `<button type="button" class="button warning" data-action="ban-user" data-id="${user.id}">Ban</button>`
              : `<button type="button" class="button success" data-action="unban-user" data-id="${user.id}">Unban</button>`
          }
        </td>
      `;

    tableBody.appendChild(row);
  });
}

function handleUserActionClick(e) {
  if (e.target.tagName === "BUTTON") {
    console.log("Button clicked");
    e.preventDefault();
    e.stopPropagation();
    const action = e.target.dataset.action;
    const userId = parseInt(e.target.dataset.id);

    if (isNaN(userId)) {
      console.error("user isn't valid");
      return false;
    }

    switch (action) {
      case "approve-campaigner":
        handleUserUpdate(userId, { role: "campaigner" }, "Approve");
        break;
      case "reject-campaigner":
        handleUserUpdate(userId, { role: "backer" }, "Reject");
        break;
      case "ban-user":
        handleUserUpdate(userId, { isActive: false }, "Ban");
        break;
      case "unban-user":
        handleUserUpdate(userId, { isActive: true }, "Unban");
        break;
    }
    return false;
  }
}

async function handleUserUpdate(userId, updates, action) {
  
  try {
    if (isNaN(userId) || userId <= 0) {
      console.error("userId isn't valid:", userId);
      // return { success: false, error: "userId isn't valid" };
    }
    const user = users.find((u) => Number(u.id) === Number(userId));
    if (!user) {
      console.warn(`user ${userId} not found`);
      return { success: false, error: "user not found" };
    }
    await updateUser(userId, updates);
    await loadUsers();

    // return { success: true };
  } catch (error) {
    console.error("Failed to approve campaigner:", error);
    return { success: false, error: error.message };
  }
}

tableBody.addEventListener("click", handleUserActionClick);
filterCheckbox.addEventListener("change", renderUsers);
document.addEventListener("DOMContentLoaded", loadUsers);

// =============================================== 




