import React, { useState } from 'react';

const NewsItem = ({ title, description, imageUrl, newsUrl, author, date, source }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const publishedDate = date ? new Date(date) : null;
  const formattedDate = publishedDate && !Number.isNaN(publishedDate.getTime())
    ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(publishedDate)
    : '';
  const hasImage = imageUrl && imageUrl !== 'null' && !imageFailed;

  return (
    <div className="my-2 news-item">
      <div className="card news-card">
        {hasImage ? (
          <img
            src={imageUrl}
            className="card-img-top"
            alt={title ? `Article: ${title}` : 'News article'}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="news-image-placeholder" role="img" aria-label={`Image unavailable${title ? ` for ${title}` : ''}`}>
            Image unavailable
          </div>
        )}
        <div className="card-body">
          <h2 className="card-title">{title || 'Untitled article'}</h2>
          {description && <p className="card-text">{description}</p>}
          <p className="card-text news-metadata">
            <small className="text-muted">
              {source || 'News source'}
              {author && ` · By ${author}`}
              {formattedDate && ` · ${formattedDate}`}
            </small>
          </p>
          <a href={newsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
            Read More
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsItem