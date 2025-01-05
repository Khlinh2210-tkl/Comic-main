import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ComicDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComicDetail = async () => {
      try {
        const response = await axios.get(`https://api.otruyenapi.com/stories/${id}`);
        setComic(response.data); // Lưu thông tin chi tiết truyện
      } catch (err) {
        setError(err.message); // Xử lý lỗi
      } finally {
        setLoading(false);
      }
    };

    fetchComicDetail();
  }, [id]);

  if (loading) return <p>Đang tải chi tiết truyện...</p>;
  if (error) return <p>Có lỗi xảy ra: {error}</p>;

  return (
    <div className="container">
      <h1>{comic.title}</h1>
      <img src={comic.cover} alt={comic.title} className="img-fluid" />
      <p>{comic.description}</p>
    </div>
  );
};

export default ComicDetail