import { getCampaigns, getPledges, getUsers } from "../../services/api.js";

const pledgesBody = document.getElementById("pledges-table-body");

const countUsers = document.querySelector(".count-users");
const btnGroup = document.querySelector(".btn-group-users");
const btnPrev = document.querySelector(".btn-group-users .btn-prev");
const btnNext = document.querySelector(".btn-group-users .btn-next");
let currentPage = 1;
const countUsersPage = 4;



let pledges = [];
let campaigns = [];
let users = [];

async function loadPledges() {
  pledgesBody.innerHTML = `<tr><td colspan="6">loading data... </td></tr>`;
  try {
    const dataCampaigns = await getCampaigns();
    const dataPledges = await getPledges();
    const dataUsers = await getUsers();

    if (!Array.isArray(dataCampaigns)) {
      throw new Error(" data isn't array");
    }
    if (!Array.isArray(dataPledges)) {
      throw new Error(" data isn't array");
    }
    if (!Array.isArray(dataUsers)) {
      throw new Error(" data isn't array");
    }
    pledges = dataPledges;
    campaigns = dataCampaigns;
    users = dataUsers;

    renderPledges();
  } catch (error) {
    console.error("Failed to load pledges:", error);
    throw error;
  }
}

function renderPledges() {
  const tableBody = document.getElementById("pledges-table-body");
  tableBody.innerHTML = "";

  let start = (currentPage - 1) * countUsersPage;
  let end = start + countUsersPage;
  let currentData = userList.slice(start, end);
  console.log(currentData);

  pledges.forEach((pledge) => {
    const row = document.createElement("tr");

    // Find campaign and user
    const campaign = campaigns.find((c) => c.id === pledge.campaignId);
    const user = users.find((u) => u.id === pledge.userId);

    // Find reward
    let rewardTitle = "No reward";
    if (campaign && pledge.rewardId) {
      const reward = campaign.rewards.find((r) => r.id === pledge.rewardId);
      if (reward) {
        rewardTitle = `${reward.title} ($${reward.amount})`;
      }
    }

    row.innerHTML = `
        <td>${pledge.id}</td>
        <td>${campaign ? campaign.title : "Unknown Campaign"}</td>
        <td>${user ? user.name : "Unknown User"}</td>
        <td>$${pledge.amount.toLocaleString()}</td>
        <td>${rewardTitle}</td>
      `;

    tableBody.appendChild(row);
  });

  if (users.length <= countUsersPage) {
    btnGroup.style.display = "none";
  } else {
    btnGroup.style.display = "block";
  }

  updateCounter();
  updatePaginationButtons();
}

function updateCounter() {
  countUsers.textContent =
    users.length === 0
      ? "No users to show"
      : `showing from  ${Math.min(
          (currentPage - 1) * countUsersPage + 1,
          users.length
        )}  to ${Math.min(currentPage * countUsersPage, users.length)} of ${
          users.length
        }`;
}

function updatePaginationButtons() {
  btnPrev.disabled = currentPage === 1;
  btnNext.disabled = currentPage * countUsersPage >= users.length;
}

btnPrev.addEventListener("click", function () {
  if (currentPage > 1) {
    currentPage--;
    renderUsers();
  }
});
btnNext.addEventListener("click", function () {
  if (currentPage < users.length / countUsersPage) {
    currentPage++;
    renderUsers();
  }
});

document.addEventListener("DOMContentLoaded", loadPledges);

// export class PledgeManager {
//   constructor(apiService) {
//     this.apiService = apiService;
//     this.pledges = [];
//     this.campaigns = [];
//     this.users = [];
//   }

//   async loadPledges() {
//     try {
//       this.pledges = await this.apiService.getPledges();
//       this.campaigns = await this.apiService.getCampaigns();
//       this.users = await this.apiService.getUsers();
//       this.renderPledges();
//     } catch (error) {
//       console.error("Failed to load pledges:", error);
//       throw error;
//     }
//   }

//   renderPledges() {
//     const tableBody = document.getElementById("pledges-table-body");
//     tableBody.innerHTML = "";

//     this.pledges.forEach((pledge) => {
//       const row = document.createElement("tr");

//       // Find campaign and user
//       const campaign = this.campaigns.find((c) => c.id === pledge.campaignId);
//       const user = this.users.find((u) => u.id === pledge.userId);

//       // Find reward
//       let rewardTitle = "No reward";
//       if (campaign && pledge.rewardId) {
//         const reward = campaign.rewards.find((r) => r.id === pledge.rewardId);
//         if (reward) {
//           rewardTitle = `${reward.title} ($${reward.amount})`;
//         }
//       }

//       row.innerHTML = `
//         <td>${pledge.id}</td>
//         <td>${campaign ? campaign.title : "Unknown Campaign"}</td>
//         <td>${user ? user.name : "Unknown User"}</td>
//         <td>$${pledge.amount.toLocaleString()}</td>
//         <td>${rewardTitle}</td>
//       `;

//       tableBody.appendChild(row);
//     });
//   }
// }
