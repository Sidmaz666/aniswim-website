"use server"

import axios from "axios";

export default async function axiosRetry(url, retries = 3, delay = 300) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (retries === 0) {
      throw error;
    }
    await new Promise(resolve => setTimeout(resolve, delay));
    console.log(`Retrying ${url}...`);
    return axiosRetry(url, retries - 1, delay * 2);
  }
}

