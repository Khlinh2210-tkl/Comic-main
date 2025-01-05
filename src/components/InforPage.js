import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./InforPage.css";
import "./HomePage.css"; // Import CSS từ HomePage để sử dụng khung xanh
import { handleError, handleSuccess } from '../untils';

const InforPage = () => {
  const { slug } = useParams();
  const [comic, setComic] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cash, setCash] = useState('');
  const [loggedInUser, setLoggedInUser] = useState('');
  const [loggedInMail, setLoggedInMail] = useState('');

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'))
    setCash(localStorage.getItem('cash'))
    setLoggedInMail(localStorage.getItem('loggedInMail'))


}, [])
  const navigate = useNavigate();

  const removeHtmlTags = (htmlString) => {
    return htmlString.replace(/<[^>]*>?/gm, "");
  };

  useEffect(() => {
    const fetchComicDetail = async () => {
      try {
        const response = await axios.get(
          `https://otruyenapi.com/v1/api/truyen-tranh/${slug}`
        );
        const comicData = response.data.data.item;
        const allChapters = comicData.chapters.flatMap((chapter) => chapter.server_data);

        setComic(comicData);
        setChapters(allChapters);
      } catch (err) {
        console.error("Lỗi khi gọi API:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComicDetail();
  }, [slug]);

  const handleChapterClick = (chapter, index) => {
    // Subtract 5 from cash and update local storage
    const currentCash = parseFloat(cash) || 0; // Ensure cash is a number
    const newCash = currentCash - 5;
    setCash(newCash.toString()); // Update state
    localStorage.setItem('cash', newCash.toString()); // Update local storage

     navigate(`/chapter/${chapter.chapter_name}`, {
      state: {
        chapters: chapters, // Truyền tất cả các chương
        currentChapterIndex: index, // Truyền chỉ số chương hiện tại
        chapterApiUrl: chapter.chapter_api_data, // Truyền URL API của chương
      },
    });


    try{
    const cashUpdateUrl = `https://comic-drab.vercel.app/auth/updatecash`;
    const response =  fetch(cashUpdateUrl, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: loggedInMail, cash: newCash }) // Update cash in the database
    });
    const result =  response.json();
    const { success, message, error } = result;
    if (success) {
      handleSuccess(message);
    } else if (error) {
      handleError(error);
    }
  }
  catch(err){
    handleError(err);
  }

};
  const handleReadFirstChapter = () => {
    if (chapters.length > 0) {
      const currentCash = parseFloat(cash) || 0; // Ensure cash is a number
    const newCash = currentCash - 5;
    setCash(newCash.toString()); // Update state
    localStorage.setItem('cash', newCash.toString()); // Update local storage
    try{
      const cashUpdateUrl = `https://comic-drab.vercel.app/auth/updatecash`;
      const response =  fetch(cashUpdateUrl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: loggedInMail, cash: newCash }) // Update cash in the database
      });
      const result =  response.json();
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
      } else if (error) {
        handleError(error);
      }
    }
    catch(err){
      handleError(err);
    }
      const firstChapter = chapters[0]; // Lấy chương 1
      navigate(`/chapter/${firstChapter.chapter_name}`, {
        state: {
          chapters: chapters,
          currentChapterIndex: 0, // Chỉ số chương 1 là 0
          chapterApiUrl: firstChapter.chapter_api_data,
        },
      });
    }
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div>Có lỗi xảy ra: {error}</div>;
  }

  return (
    <div className="infor-container">
      {/* Khung xanh phía trên */}
      <div
        className="homepage-header"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        <div className="homepage-logo" title="Nhấn để trở về trang đầu">
          Tam Cô Nương
        </div>
      </div>

      <h1 className="infor-header">{comic.name}</h1>
      <div className="infor-details">
        <img
          src={`https://img.otruyenapi.com/uploads/comics/${comic.thumb_url}`}
          alt={comic.name}
          className="infor-image"
        />
        <div className="infor-author-category">
          <p><strong>Tác giả:</strong> {comic.author && comic.author.join(", ")}</p>
          <p><strong>Thể loại:</strong> {comic.category && comic.category.map((cat) => cat.name).join(", ")}</p>
          <p><strong>Mô tả:</strong> {removeHtmlTags(comic.content)}</p>

          {chapters.length > 0 && (
            <button
              className="read-comic-button"
              onClick={handleReadFirstChapter}
            >
              Đọc truyện
            </button>
          )}
        </div>
      </div>

  <div className="infor-chapters">
  <h2>Danh sách chương</h2>
  {chapters.length > 0 ? (
    <ul className="infor-chapter-list">
      {chapters.map((chapter, index) => (
        <li key={index} className="infor-chapter-item">
          <button
            onClick={() => handleChapterClick(chapter, index)}
            className="infor-chapter-button"
          >
            Chương {chapter.chapter_name}
          </button>
        </li>
      ))}
    </ul>
  ) : (
    <p className="no-chapters-message">Không có chương để hiển thị</p>
  )}
</div>


      <div className="advertisement-container left-ad">
        <p>Trống trải vì chưa được book quảng cáo :))</p>
      </div>
      <div className="advertisement-container right-ad">
        <p>Trống trải vì chưa được book quảng cáo :))</p>
      </div>
    </div>
  );
};

export default InforPage;