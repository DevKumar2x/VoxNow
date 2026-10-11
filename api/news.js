

export default async function handler(req, res) {
  try {
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "NEWS_API_KEY is not configured",
      });
    }

    const response = await fetch(
      "https://newsapi.org/v2/top-headlines?country=us",
      {
        headers: {
          "X-Api-Key": apiKey,
        },
      }
    );

    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("NewsAPI request failed:", error);

    return res.status(500).json({
      error: "Failed to fetch news",
    });
  }
}
