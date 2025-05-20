import {
  getCampaigns,
  updateCampaign,
  deleteCampaign,
  getUsers,
} from "../../services/api.js";

const countCampaigner = document.querySelector(".count-campaigner");
const btnGroup = document.querySelector(".btn-group-campaigns");
const btnPrev = document.querySelector(".btn-group-campaigns .btn-prev");
const btnNext = document.querySelector(".btn-group-campaigns .btn-next");
let currentPage = 1;
const countCampaignsPage =10;

let users = [];
let campaigns = [];

const campaignsBody = document.getElementById("campaigns-table-body");
const pendingCampaignsCheckbox = document.getElementById(
  "pending-campaigns-filter"
);

async function loadCampaigns() {
  if (!campaignsBody) {
    console.error("Element with ID 'campaigns-table-body' not found");
    return;
  }

  campaignsBody.innerHTML = `<tr><td colspan="7">Loading data...</td></tr>`;
  try {
    const dataCampaigns = await getCampaigns();
    const dataUsers = await getUsers();

    if (!Array.isArray(dataCampaigns)) {
      throw new Error(" dataCampaigns isn't array");
    }
    if (!Array.isArray(dataUsers)) {
      throw new Error(" dataUsers isn't array");
    }
    campaigns = dataCampaigns;
    users = dataUsers;
    renderCampaigns();
  } catch (error) {
    console.error("error load dataCampaigns");
    throw error;
  }
}

function renderCampaigns() {
  if (!campaignsBody) {
    console.error("Element with ID 'campaigns-table-body' not found");
    return;
  }

  campaignsBody.innerHTML = "";
  const showOnlyPending = pendingCampaignsCheckbox?.checked ?? false;
  const campaignsList = showOnlyPending
    ? campaigns.filter((campaign) => !campaign.isApproved)
    : campaigns;

  if (campaignsList.length === 0) {
    campaignsBody.innerHTML = `<tr><td colspan="6">No campaigns found</td></tr>`;
    return;
  }

  let start = (currentPage - 1) * countCampaignsPage;
  let end = start + countCampaignsPage;
  let currentData = campaignsList.slice(start, end);
  // console.log(currentData);

  currentData.forEach((campaign) => {
    const row = document.createElement("tr");

    // Find creator name
    const creator = users.find((user) => user.id === campaign.creatorId);
    const creatorName = creator ? creator.name : "Unknown";
    const deadline = new Date(campaign.deadline).toLocaleDateString();
    const statusBadgeClass = campaign.isApproved ? "success" : "warning";
    const statusText = campaign.isApproved ? "Approved" : "Pending";

    row.innerHTML = `
        <td>${campaign.id}</td>
        <td>${campaign.title}</td>
        <td>${creatorName}</td>
        <td>$${campaign.goal.toLocaleString()}</td>
        <td>${deadline}</td>
        <td><span class="badge ${statusBadgeClass}">${statusText}</span></td>
        <td class="actions d-flex gap-1">
          ${
            !campaign.isApproved
              ? `<button class="button success" data-action="approve-campaign" data-id="${campaign.id}">Approve</button>`
              : ""
          }
          <button class="button danger" data-action="delete-campaign" data-id="${
            campaign.id
          }">Delete</button>

        </td>
      `;

    campaignsBody.appendChild(row);
  });

  if (campaigns.length <= countCampaignsPage) {
    btnGroup.style.display = "none";
  } else {
    btnGroup.style.display = "block";
  }

  updateCounter();
  updatePaginationButtons();

  campaignsBody.removeEventListener("click", handleCampaignActionClick);
  campaignsBody.addEventListener("click", handleCampaignActionClick);
}

function handleCampaignActionClick(e) {
  e.preventDefault();
  e.stopPropagation();

  if (e.target.tagName === "BUTTON") {
    const action = e.target.dataset.action;
    const campaignId = e.target.dataset.id;

    console.log(campaignId);

    switch (action) {
      case "approve-campaign":
        handleCampaignUpdate(
          campaignId,
          { isApproved: true },
          "Approve",
          updateCampaign
        );
        break;
      case "delete-campaign":
        handleDeleteCampaign(campaignId, "Delete");
        break;
      //   case "view-details":
      //     handleCampaignUpdate(campaignId, { isActive: false }, "View Details");
      //     break;
    }
  }
}

async function handleCampaignUpdate(campaignId, updates, action) {
  try {
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (!campaign) {
      console.warn(`user ${campaignId} not found`);
      return { success: false, error: "user not found" };
    }
    await updateCampaign(campaignId, updates);
    await loadCampaigns();

    return { success: true };
  } catch (error) {
    console.error("Failed to approve campaigner:", error);
    return { success: false, error: error.message };
  }
}
async function handleDeleteCampaign(campaignId, action) {
  try {
    await deleteCampaign(campaignId);
    await loadCampaigns();

    return { success: true };
  } catch (error) {
    console.error("Failed to delete campaigner:", error);
    return { success: false, error: error.message };
  }
}

function updateCounter() {
  countCampaigner.textContent =
    campaigns.length === 0
      ? "No campaigner to show"
      : `showing from  ${Math.min(
          (currentPage - 1) * countCampaignsPage + 1,
          campaigns.length
        )}  to ${Math.min(
          currentPage * countCampaignsPage,
          campaigns.length
        )} of ${campaigns.length}`;
}
 
function updatePaginationButtons() {
  btnPrev.disabled = currentPage === 1;
  btnNext.disabled = currentPage * countCampaignsPage >= campaigns.length;
}

btnPrev.addEventListener("click", function () {
  if (currentPage > 1) {
    currentPage--;
    renderCampaigns();
  }
});
btnNext.addEventListener("click", function () {
  if (currentPage < campaigns.length / countCampaignsPage) {
    currentPage++;
    renderCampaigns();
  }
});

pendingCampaignsCheckbox?.addEventListener("change", renderCampaigns);

document.addEventListener("DOMContentLoaded", loadCampaigns);
