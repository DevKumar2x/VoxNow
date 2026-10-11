import React from 'react';

const Spinner = () => {
  return (
    <div className="news-spinner" role="status" aria-label="Loading news">
      <span className="news-spinner-dot news-spinner-dot-teal" />
      <span className="news-spinner-dot news-spinner-dot-pink" />
    </div>
  );
};

export default Spinner;