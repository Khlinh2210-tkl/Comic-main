import React from 'react';
import { Link } from 'react-router-dom';

const ComicList = ({ comics }) => {
  return (
    <div className="comic-list-container">
      <h1>Danh sách truyện</h1>
      <div className="comic-list">
        {comics.length === 0 ? (
          <p>Chưa có truyện nào được đăng.</p>
        ) : (
          comics.map((comic, index) => (
            <div className="comic-item" key={index}>
              <img src={comic.coverUrl} alt={comic.name} className="comic-cover" />
              <h3>{comic.name}</h3>
              <p>{comic.description}</p>
              <Link to={`/comic/${comic.name.toLowerCase().replace(/\s+/g, '-')}`}>
                Xem chi tiết
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ComicList;