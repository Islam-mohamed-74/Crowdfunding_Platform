import { getCampaigns, getPledges, getUsers } from "../../utils/api.js";

const pledgesBody = document.getElementById("pledges-table-body");

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

    console.log(pledges);
    console.log(campaigns);
    console.log(users);

    renderPledges();
  } catch (error) {
    console.error("error load users");
    throw error;
  }
}

function renderPledges() {
  const tableBody = document.getElementById("pledges-table-body");
  tableBody.innerHTML = "";

  pledges.forEach((pledge) => {
    const row = document.createElement("tr");

    // Find campaign and user
    const campaign = campaigns.find((c) => c.id === pledge.campaignId);
    const user = users.find((u) => u.id === pledge.userId);

    console.log(campaign);
    console.log(user);
    

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
}
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
