import axios from "axios";

// Example: using Yahoo Finance API (free) or any news API endpoint
// You can replace this with your actual API key & URL
const NEWS_API_URL = "https://newsapi.org/v2/everything";
const NEWS_API_KEY = process.env.NEWS_API_KEY; // Put in .env

export async function getStockNews(symbol) {
  try {
    const response = await axios.get(NEWS_API_URL, {
      params: {
        q: symbol,
        sortBy: "publishedAt",
        apiKey: NEWS_API_KEY
      }
    });

    // Return only the important fields
    return response.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      publishedAt: article.publishedAt,
      source: article.source.name
    }));
  } catch (error) {
    console.error("Error fetching news:", error.message);
    return [];
  }
}
