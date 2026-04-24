import React , {useEffect , useState} from 'react';
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const UpdateNews = async (pageNumber = 1) => {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${pageNumber}&pageSize=${props.pageSize}`;
    
    setLoading(true)
    let data = await fetch(url);
    let parsedData = await data.json()
    props.setProgress(50);

    setArticles(parsedData.articles)
    setTotalResults(parsedData.totalResults)
    setPage(pageNumber);
    setLoading(false)
    props.setProgress(100);
  }

  useEffect(() => {
    UpdateNews(1);
    document.title = `${capitalizeFirstLetter(props.category)} - NewsDonkey`;
    //eslint-disable-next-line
  }, [props.country , props.category, props.pageSize, props.apiKey]);
  
  const fetchMoreData = async () => {
    const nextPage = page + 1;
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${nextPage}&pageSize=${props.pageSize}`;
    
    let data = await fetch(url);
    let parsedData = await data.json();
    
    setArticles((prevArticles) => prevArticles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
    setPage(nextPage);
  };

  return (
    <div className="container">
      <h1 className='text-center' style={{ margin: '40px', marginTop:'90px' }}>NewsDonkey - Top Headlines of {capitalizeFirstLetter(props.category)}</h1>
      {/* {loading && <Spinner/>} */}
      <InfiniteScroll dataLength={articles.length} next={fetchMoreData}
        hasMore={articles.length !== totalResults} loader={<Spinner />}>
        <div className="container">
        <div className="row">
          {articles.map((element) => (
            <div className="col-md-4 news-item" key={element.url}>
              <NewsItem
                title={element.title ? element.title.slice(0, 60) : ''} date={element.publishedAt}
                description={element.description ? element.description.slice(0, 95) : ''}
                newsUrl={element.url} imageUrl={element.urlToImage} author={element.author}
              />
            </div>
          ))}
        </div>
        </div>
      </InfiniteScroll>
    </div>
  )
}

News.defaultProps = {
  country: 'us',
  pageSize: 8,
  category: 'general',
  totalResults: 0,
}
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
}

export default News