import fetchData from "../utlis/api.js";

const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((button) => {
  button.addEventListener("click", function () {
    // إزالة كلاس active من كل الأزرار
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    // إضافة كلاس active للزر الحالي
    this.classList.add("active");

    // إخفاء كل المحتويات
    tabContents.forEach((content) => content.classList.remove("active"));
    // إظهار المحتوى المرتبط بالزر الحالي
    const targetId = this.id.replace("-tab", "-section");
    document.getElementById(targetId).classList.add("active");
  });
});

// ========== Original Schema Data ==========

// GET

const apiUrl = "http://localhost:3000";
let users = [];
fetchData(`${apiUrl}/users`)
  .then((data) => {
    users = data;
    applyUserFilter();
  })
  .catch((error) => {
    console.error("Error caught outside:", error);
  });

// const users = [
//   {
//     id: 1,
//     name: "Jane Doe",
//     role: "campaigner",
//     isActive: true,
//     email: "jane@example.com",
//     password: "hashed_password",
//   },
//   {
//     id: 2,
//     name: "Ali Hassan",
//     role: "backer",
//     isActive: true,
//     email: "ali@example.com",
//     password: "hashed_password2",
//   },
// ];

const campaigns = [
  {
    id: 1,
    title: "Smart Watch",
    creatorId: 1,
    goal: 5000,
    deadline: "2024-12-31",
    isApproved: false,
    rewards: [{ id: 1, title: "Early Bird", amount: 50 }],
  },
];

const pledges = [
  {
    id: 1,
    campaignId: 1,
    userId: 2,
    amount: 100,
    rewardId: 1,
  },
];

// ========== User Management ==========
const tableBody = document.getElementById("users-table-body");
const filterCheckbox = document.getElementById("pending-campaigners-filter");

function renderUsers(userList) {
  tableBody.innerHTML = "";

  if (userList.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6">No users found</td></tr>`;
    return;
  }
  console.log(users);

  userList.forEach((user) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <span class="${
          user.isActive
            ? "text-success bg-success-subtle"
            : "text-primary bg-danger-subtle"
        }  p-2 rounded" >
          ${user.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td>
        <button class="btn-admin p-2 border-0 outline-none rounded-2 text-light ${
          !user.isActive ? "bg-success" : "bg-primary"
        }" data-user-id=${user.id} >
          ${user.isActive ? "Deactivate" : "Activate"}
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

tableBody.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("btn-admin")) {
    const userId = Number(e.target.getAttribute("data-user-id"));

    toggleStatus(userId);
  }
});

function toggleStatus(userId) {
  console.log("userId:", userId);
  console.log("users array:", users);
  const user = users.find((u) => u.id === userId);
  console.log(user.isActive);
  if (user) {
    user.isActive = !user.isActive;
    applyUserFilter();
  }
}

function applyUserFilter() {
  const showOnlyPending = filterCheckbox.checked;
  const list = showOnlyPending
    ? users.filter((user) => user.role === "campaigner" && !user.isActive)
    : users;

  renderUsers(list);
}

filterCheckbox.addEventListener("change", applyUserFilter);
// renderUsers(users);

// ========== Campaigns ==========
const campaignsBody = document.getElementById("campaigns-table-body");
const pendingCampaignsCheckbox = document.getElementById(
  "pending-campaigns-filter"
);

function renderCampaigns(list) {
  campaignsBody.innerHTML = "";

  if (list.length === 0) {
    campaignsBody.innerHTML = `<tr><td colspan="7">No campaigns found</td></tr>`;
    return;
  }

  list.forEach((c) => {
    const creator = users.find((u) => u.id === c.creatorId)?.name || "Unknown";
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${c.id}</td>
      <td>${c.title}</td>
      <td>${creator}</td>
      <td>$${c.goal}</td>
      <td>${c.deadline}</td>
      <td>
        <span style="color: ${c.isApproved ? "green" : "red"};">
          ${c.isApproved ? "Approved" : "Pending"}
        </span>
      </td>
      <td>
        <button onclick="toggleApproval(${c.id})">
          ${c.isApproved ? "Reject" : "Approve"}
        </button>
      </td>
    `;

    campaignsBody.appendChild(row);
  });
}

function toggleApproval(id) {
  const campaign = campaigns.find((c) => c.id === id);
  if (campaign) {
    campaign.isApproved = !campaign.isApproved;
    applyCampaignFilter();
  }
}

function applyCampaignFilter() {
  const onlyPending = pendingCampaignsCheckbox.checked;
  const list = onlyPending ? campaigns.filter((c) => !c.isApproved) : campaigns;
  renderCampaigns(list);
}

pendingCampaignsCheckbox.addEventListener("change", applyCampaignFilter);
renderCampaigns(campaigns);

// ========== Pledges ==========
const pledgesBody = document.getElementById("pledges-table-body");

function renderPledges() {
  pledgesBody.innerHTML = "";

  if (pledges.length === 0) {
    pledgesBody.innerHTML = `<tr><td colspan="5">No pledges found</td></tr>`;
    return;
  }

  pledges.forEach((p) => {
    const campaign = campaigns.find((c) => c.id === p.campaignId);
    const campaignTitle = campaign?.title || "Unknown";
    const user = users.find((u) => u.id === p.userId);
    const reward = campaign?.rewards.find((r) => r.id === p.rewardId);

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${p.id}</td>
      <td>${campaignTitle}</td>
      <td>${user?.name || "Unknown"}</td>
      <td>$${p.amount}</td>
      <td>${reward?.title || "None"}</td>
    `;

    pledgesBody.appendChild(row);
  });
}

renderPledges();
