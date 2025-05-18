import {
  getCampaigns,
  updateCampaign,
  deleteCampaign,
  getUsers,
} from "../../utils/api.js";

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

  campaignsList.forEach((campaign) => {
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
        <td class="actions">
          ${
            !campaign.isApproved
              ? `<button class="button success" data-action="approve-campaign" data-id="${campaign.id}">Approve</button>`
              : ""
          }
          <button class="button danger" data-action="delete-campaign" data-id="${
            campaign.id
          }">Delete</button>
          <button class="button primary" data-action="view-details" data-id="${
            campaign.id
          }">Details</button>
        </td>
      `;

    campaignsBody.appendChild(row);
  });
  // handleUserActionClick();
  campaignsBody.removeEventListener("click", handleCampaignActionClick);
  campaignsBody.addEventListener("click", handleCampaignActionClick);
}

function handleCampaignActionClick(e) {
  e.preventDefault();
  e.stopPropagation();

  if (e.target.tagName === "BUTTON") {
    const action = e.target.dataset.action;
    const campaignId = parseInt(e.target.dataset.id);

    console.log(campaignId);

    if (isNaN(campaignId) || campaignId <= 0) {
      console.error("campaign isn't valid");
      return;
    }

    switch (action) {
      case "approve-campaign":
        handleCampaignUpdate(campaignId, { isApproved: true }, "Approve",updateCampaign);
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
    if (isNaN(campaignId) || campaignId <= 0) {
      console.error("campaignId isn't valid:", campaignId);
      return { success: false, error: "campaignId isn't valid" };
    }
    const campaign = campaigns.find((c) => Number(c.id) === Number(campaignId));
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
    if (isNaN(campaignId) || campaignId <= 0) {
      console.error("campaignId isn't valid:", campaignId);
      return { success: false, error: "campaignId isn't valid" };
    }
    await deleteCampaign(campaignId);
    await loadCampaigns();

    return { success: true };
  } catch (error) {
    console.error("Failed to delete campaigner:", error);
    return { success: false, error: error.message };
  }
}

pendingCampaignsCheckbox?.addEventListener("change", renderCampaigns);

document.addEventListener("DOMContentLoaded", loadCampaigns);
