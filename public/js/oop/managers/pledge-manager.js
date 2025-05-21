import { getCampaigns, getPledges, getUsers } from "../../services/api.js";

const pledgesBody = document.getElementById("pledges-table-body");

const countPledges = document.querySelector(".count-Pledges");
const btnGroup = document.querySelector(".btn-group-Pledges");
const btnPrev = document.querySelector(".btn-group-Pledges .btn-prev");
const btnNext = document.querySelector(".btn-group-Pledges .btn-next");
let currentPage = 1;
const countPledgesPage = 4;

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


  if (!pledges.length) {
    tableBody.innerHTML = `<tr><td colspan="6">No pledges found</td></tr>`;
    return;
  }


  tableBody.innerHTML = "";

  let start = (currentPage - 1) * countPledgesPage;
  let end = start + countPledgesPage;
  let currentData = pledges.slice(start, end); 

  currentData.forEach((pledge) => {
    const row = document.createElement("tr");
    // Find campaign and user
    const campaign = campaigns.find((c) => c.id === pledge.campaignId); 
    const user = users.find((u) => u.id === pledge.userId);


    row.innerHTML = `
        <td>${pledge.id}</td>
        <td>${campaign ? campaign.title : "Unknown Campaign"}</td>
        <td>${user ? user.name : "Unknown User"}</td>
        <td>$${pledge.amount.toLocaleString()}</td> 
      `;

    tableBody.appendChild(row);
  });

  if (pledges.length <= countPledgesPage) {
    btnGroup.style.display = "none";
  } else {
    btnGroup.style.display = "block";
  }

  updateCounter();
  updatePaginationButtons();
}

function updateCounter() {
  countPledges.textContent =
    pledges.length === 0
      ? "No users to show"
      : `showing from  ${Math.min(
          (currentPage - 1) * countPledgesPage + 1,
          pledges.length
        )}  to ${Math.min(currentPage * countPledgesPage, pledges.length)} of ${
          pledges.length
        }`;
}

function updatePaginationButtons() {
  btnPrev.disabled = currentPage === 1;
  btnNext.disabled = currentPage * countPledgesPage >= pledges.length;
}

btnPrev.addEventListener("click", function () {
  if (currentPage > 1) {
    currentPage--;
    renderPledges();
  }
});
btnNext.addEventListener("click", function () {
  if (currentPage < pledges.length / countPledgesPage) {
    currentPage++;
    renderPledges();
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
