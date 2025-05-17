export default async function fetchData(url, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (response.status !== 204) {
      return await response.json();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
