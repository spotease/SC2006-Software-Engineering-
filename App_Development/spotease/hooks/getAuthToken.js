const url = "https://www.onemap.gov.sg/api/auth/post/getToken";

async function getAuthToken() {
  try {
    const data = JSON.stringify({
      email: "C230124@e.ntu.edu.sg",
      password: "SC2006Project!",
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData.access_token; // Return the access token
  } catch (error) {
    console.error("Error:", error);
    return null; // Return null or an error value if there's an error
  }
}

export default getAuthToken;
