# VoxNow

## Overview
VoxNow is a lightweight React application that displays current top headlines using the NewsAPI. It's built for quick browsing of news by category and country, with infinite scrolling and a clean editorial UI.

## Demo
- Live demo: (https://vox-now.vercel.app/)

## Features
- Top headlines by country and category
- Infinite scrolling with duplicate protection and request error handling
- Responsive layout with article cards
- Loading, empty, and error states
- Category navigation for general, sports, technology, health, science, business, and entertainment headlines

## Built With
- React
- Bootstrap (for layout & buttons)
- Express (server-side NewsAPI proxy)
- NewsAPI (data source)

## Getting Started
These instructions will get you a copy of the project running on your local machine for development and testing purposes.

### Prerequisites
- Node.js (v18 or newer)
- npm or yarn

### Installation
Clone the repo and install dependencies:

```bash
git clone <repo-url>
cd newsapp
npm install
```

### Configure API Key
The Express server reads the NewsAPI key from `.env.local` as a server-only variable. Create an API key at https://newsapi.org and add:

```env
NEWS_API_KEY=api_key
```

Do not prefix the key with `REACT_APP_`: Create React App embeds variables with that prefix in browser assets. `.env.local` is ignored by Git. If the key was previously exposed in a deployed frontend, rotate it in NewsAPI before using the new server-only variable. For a public deployment, set `NEWS_API_KEY` in the server host's secret/environment settings and route `/api/news` to this Express server. If deployed behind a reverse proxy, set `TRUST_PROXY` to the specific trusted proxy configuration for your host; do not trust arbitrary forwarded headers. Confirm that your NewsAPI plan allows your intended deployment and usage.

### Run Locally

```bash
npm run dev
```

This starts the React app on http://localhost:3000 and the API server on http://localhost:5000. CRA forwards local `/api` requests to the server.

## Usage
The navigation currently exposes news categories; the country and page size are configured in `App.js`. The `News` component accepts the following props:

- `country` (string): two-letter country code, default `us`
- `pageSize` (number): articles per page, default `8` (`App.js` currently requests `9`)
- `category` (string): news category, default `general`

## Contributing
Contributions are welcome. Please open an issue for bugs or feature requests, then submit a pull request with a clear description of changes.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact
Project maintained by the repository owner — open issues or pull requests for questions.