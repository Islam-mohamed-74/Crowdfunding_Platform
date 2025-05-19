

// In a real application, this would be an environment variable
const apiUrl = "http://localhost:3000";

export async function getUsers() {
  try {
    const response = await fetch(`${apiUrl}/users`);
    if (!response.ok) throw new Error("Failed to fetch users");
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function getCampaigns() {
  try {
    const response = await fetch(`${apiUrl}/campaigns`);
    if (!response.ok) throw new Error("Failed to fetch campaigns");
    
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function getPledges() {
  try {
    const response = await fetch(`${apiUrl}/pledges`);
    if (!response.ok) throw new Error("Failed to fetch pledges");
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function updateUser(userId, userData) {
  try {
    const response = await fetch(`${apiUrl}/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) throw new Error("Failed to update user");
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function updateCampaign(campaignId, campaignData) {
  try {
    const response = await fetch(`${apiUrl}/campaigns/${campaignId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(campaignData),
    });

    if (!response.ok) throw new Error("Failed to update campaign");
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function deleteCampaign(campaignId) {
  try {
    const response = await fetch(`${apiUrl}/campaigns/${campaignId}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete campaign");
    return true;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
