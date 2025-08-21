import axios from "axios";

const NEWS_API_URL = "https://newsapi.org/v2/everything";
const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Simple sentiment analysis
function getSentiment(text) {
  const positiveWords = [
    "rise",
    "gain",
    "up",
    "strong",
    "profit",
    "beat",
    "growth",
    "record",
  ];
  const negativeWords = [
    "fall",
    "loss",
    "down",
    "drop",
    "weak",
    "miss",
    "decline",
    "fear",
  ];

  const lower = text.toLowerCase();

  let score = 0;
  positiveWords.forEach((word) => {
    if (lower.includes(word)) score++;
  });
  negativeWords.forEach((word) => {
    if (lower.includes(word)) score--;
  });

  if (score > 0) return "positive";
  if (score < 0) return "negative";
  return "neutral";
}

export async function getStockNews(symbol) {
  try {
    const response = await axios.get(NEWS_API_URL, {
      params: {
        q: symbol,
        sortBy: "publishedAt",
        apiKey: NEWS_API_KEY,
      },
    });

    return response.data.articles.map((article, index) => {
      const text = `${article.title} ${article.description || ""}`;
      return {
        id: `${symbol}-${index}`,
        title: article.title,
        summary: article.description || "",
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source.name,
        sentiment: getSentiment(text),
      };
    });
  } catch (error) {
    console.error("Error fetching news:", error.message);
    return [];
  }
}
