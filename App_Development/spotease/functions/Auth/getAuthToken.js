const url = "https://www.onemap.gov.sg/api/auth/post/getToken";

async function getAuthToken() {
  try {
    const data = JSON.stringify({
      email: `${process.env.EXPO_PUBLIC_ONEMAP_API_EMAIL}`,
      password: `${process.env.EXPO_PUBLIC_ONEMAP_API_PASS}`,
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
