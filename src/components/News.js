import React, { useEffect, useRef, useState } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState('');
  const activeController = useRef(null);
  const isFetchingMore = useRef(false);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const UpdateNews = async (pageNumber = 1, append = false, signal) => {
    props.setProgress(10);
    setLoading(true);
    setError('');
    if (!append) {
      setArticles([]);
      setTotalResults(0);
    }

    try {
      const query = new URLSearchParams({
        country: props.country,
        category: props.category,
        page: String(pageNumber),
        pageSize: String(props.pageSize),
      });
      const response = await fetch(`/api/news?${query}`, { signal });
      const data = await response.json();
      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || `News request failed (${response.status}).`);
      }

      const nextArticles = Array.isArray(data.articles)
        ? data.articles.filter((article) => article && article.url)
        : [];
      props.setProgress(50);
      setArticles((currentArticles) => {
        if (!append) return nextArticles;
        const existingUrls = new Set(currentArticles.map((article) => article.url));
        return currentArticles.concat(nextArticles.filter((article) => !existingUrls.has(article.url)));
      });
      setTotalResults(nextArticles.length === 0
        ? (append ? articles.length : 0)
        : (Number(data.totalResults) || 0));
      setPage(pageNumber);
    } catch (requestError) {
      if (requestError.name !== 'AbortError') {
        setError(requestError.message || 'Unable to load news. Please try again.');
      }
    } finally {
      if (!signal || !signal.aborted) {
        setLoading(false);
        props.setProgress(100);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    activeController.current = controller;
    UpdateNews(1, false, controller.signal);
    document.title = `${capitalizeFirstLetter(props.category)} - VoxNow`;
    return () => {
      activeController.current?.abort();
      activeController.current = null;
      isFetchingMore.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.country, props.category, props.pageSize]);

  const fetchMoreData = async () => {
    if (loading || error || isFetchingMore.current || articles.length >= totalResults) return;

    const controller = new AbortController();
    activeController.current = controller;
    isFetchingMore.current = true;
    try {
      await UpdateNews(page + 1, true, controller.signal);
    } finally {
      isFetchingMore.current = false;
      if (activeController.current === controller) activeController.current = null;
    }
  };

  return (
    <div className="container">
      <h1 className="text-center" style={{ margin: '40px', marginTop: '90px' }}>
        VoxNow - Top Headlines of {capitalizeFirstLetter(props.category)}
      </h1>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button className="btn btn-sm btn-outline-danger ms-3" onClick={() => UpdateNews(error && articles.length ? page + 1 : 1, Boolean(articles.length))}>
            Try again
          </button>
        </div>
      )}
      {loading && articles.length === 0 && <Spinner />}
      {!loading && !error && articles.length === 0 && (
        <p className="text-center" role="status">No articles are available for this category right now.</p>
      )}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length > 0 && articles.length < totalResults && !error}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles.map((article) => (
              <div className="col-md-4 news-item" key={article.url}>
                <NewsItem
                  title={article.title || ''}
                  date={article.publishedAt}
                  description={article.description || ''}
                  newsUrl={article.url}
                  imageUrl={article.urlToImage}
                  author={article.author}
                  source={article.source?.name}
                />
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </div>
  );
};

News.defaultProps = {
  country: 'us',
  pageSize: 8,
  category: 'general',
  totalResults: 0,
};
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News