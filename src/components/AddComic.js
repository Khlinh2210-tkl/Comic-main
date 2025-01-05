import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddComic.css';

const AddComic = ({ addComic }) => {
  const [comicName, setComicName] = useState('');
  const [comicDescription, setComicDescription] = useState('');
  const [comicCover, setComicCover] = useState(null); // State để lưu ảnh bìa
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setComicCover(file);
    } else {
      setErrorMessage('Vui lòng chọn một tệp hình ảnh hợp lệ.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra tính hợp lệ của dữ liệu nhập vào
    if (!comicName || !comicDescription || !comicCover) {
      setErrorMessage('Tên truyện, mô tả và ảnh bìa không được để trống!');
      return;
    }

    // Thêm truyện vào danh sách
    addComic({ name: comicName, description: comicDescription, cover: comicCover });

    // Đặt lại trạng thái
    setComicName('');
    setComicDescription('');
    setComicCover(null);
    setErrorMessage('');

    // Chuyển hướng đến trang danh sách truyện
    navigate('/comics');
  };

  return (
    <div className="add-comic-container">
      <h1 className="add-comic-title">Đăng truyện mới</h1>
      <form onSubmit={handleSubmit} className="add-comic-form">
        <label htmlFor="comicName">Tên truyện:</label>
        <input
          id="comicName"
          type="text"
          value={comicName}
          onChange={(e) => setComicName(e.target.value)}
          placeholder="Nhập tên truyện"
          required
        />
        
        <label htmlFor="comicDescription">Mô tả truyện:</label>
        <textarea
          id="comicDescription"
          value={comicDescription}
          onChange={(e) => setComicDescription(e.target.value)}
          placeholder="Nhập mô tả truyện"
          required
        />
        
        <label htmlFor="comicCover">Ảnh bìa:</label>
        <input
          id="comicCover"
          type="file"
          accept="image/*" // Chỉ cho phép chọn hình ảnh
          onChange={handleFileChange}
          required
        />
        {comicCover && <p>File ảnh đã chọn: {comicCover.name}</p>}

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <button type="submit">Đăng truyện</button>
      </form>
    </div>
  );
};

export default AddComic;