import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./ChapterImg.css"; // Import file CSS
import { handleError, handleSuccess } from '../untils';

const ChapterImg = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [chapterName, setChapterName] = useState("");
  const [error, setError] = useState(null);
  const [cash, setCash] = useState('');
  const [loggedInUser, setLoggedInUser] = useState('');
  const [loggedInMail, setLoggedInMail] = useState('');

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'))
    setCash(localStorage.getItem('cash'))
    setLoggedInMail(localStorage.getItem('loggedInMail'))

}, [])
  useEffect(() => {
    const fetchChapterImages = async () => {
      if (!state || !state.chapterApiUrl) {
        setError("Không có dữ liệu chương để hiển thị.");
        return;
      }

      try {
        const response = await axios.get(state.chapterApiUrl, { timeout: 10000 });
        const chapterData = response.data.data.item;

        setChapterName(chapterData.chapter_name);
        const chapterImages = chapterData.chapter_image.map((image) => ({
          imageUrl: `${response.data.data.domain_cdn}/${chapterData.chapter_path}/${image.image_file}`,
        }));

        setImages(chapterImages);
      } catch (err) {
        setError("Lỗi kết nối đến server. Vui lòng thử lại sau.");
      }
    };

    fetchChapterImages();
    window.scrollTo(0, 0);
  }, [state]);

  const handlePreviousChapter = () => {
    if (state && state.chapters && state.currentChapterIndex > 0) {
    const currentCash = parseFloat(cash) || 0; // Ensure cash is a number
    const newCash = currentCash;
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


      const prevChapter = state.chapters[state.currentChapterIndex - 1];
      navigate(`/chapter/${prevChapter.chapter_name}`, {
        state: {
          chapters: state.chapters,
          currentChapterIndex: state.currentChapterIndex - 1,
          chapterApiUrl: prevChapter.chapter_api_data,
        },
      });
    }
  };

  const handleNextChapter = () => {
    if (state && state.chapters && state.currentChapterIndex < state.chapters.length - 1) {
      const currentCash1 = parseFloat(cash) || 0; // Ensure cash is a number
      const newCash1 = currentCash1 - 5;
      setCash(newCash1.toString()); // Update state
      localStorage.setItem('cash', newCash1.toString()); // Update local storage
      try{
        const cashUpdateUrl = `https://comic-drab.vercel.app/auth/updatecash`;
        const response =  fetch(cashUpdateUrl, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: loggedInMail, cash: newCash1 }) // Update cash in the database
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
  
      
      const nextChapter = state.chapters[state.currentChapterIndex + 1];
      const currentCash = parseFloat(cash) || 0; // Ensure cash is a number
    const newCash = currentCash - 5;
    setCash(newCash.toString()); // Update state
    localStorage.setItem('cash', newCash.toString()); // Update local storage
      navigate(`/chapter/${nextChapter.chapter_name}`, {
        state: {
          chapters: state.chapters,
          currentChapterIndex: state.currentChapterIndex + 1,
          chapterApiUrl: nextChapter.chapter_api_data,
        },
      });
    }
  };

  if (error) {
    return <div>Có lỗi xảy ra: {error}</div>;
  }

  return (
    <div className="chapter-container">
      {/* Khung xanh phía trên */}
      <div className="chapter-img-header" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        <div className="homepage-logo" title="Nhấn để trở về trang đầu">
          COMIC HEHE 
        </div>
      </div>
  
      {/* Tiêu đề chương */}
      <h2 className="chapter-title">Chương {chapterName}</h2>
  
      {/* Điều hướng chương dưới tiêu đề */}
      <div className="chapter-navigation-top">
        <button onClick={handlePreviousChapter} disabled={state && (!state.chapters || state.currentChapterIndex === 0)} className="navigation-button">
          Chương trước
        </button>
        <button onClick={handleNextChapter} disabled={state && (!state.chapters || state.currentChapterIndex === state.chapters.length - 1)} className="navigation-button">
          Chương sau
        </button>
      </div>
  
      {/* Các hình ảnh chương */}
      <div className="chapter-images">
        {images.length > 0 ? (
          images.map((image, index) => (
            <img
              key={index}
              src={image.imageUrl}
              alt={`Page ${index + 1}`}
              className="chapter-image"
              loading="lazy"
            />
          ))
        ) : (
          <div>Không có hình ảnh để hiển thị.</div>
        )}
      </div>
  
      {/* Điều hướng chương ở cuối trang */}
      <div className="chapter-navigation">
        <button onClick={handlePreviousChapter} disabled={state && (!state.chapters || state.currentChapterIndex === 0)} className="navigation-button">
          Chương trước
        </button>
        <button onClick={handleNextChapter} disabled={state && (!state.chapters || state.currentChapterIndex === state.chapters.length - 1)} className="navigation-button">
          Chương sau
        </button>
      </div>
  
      {/* Quảng cáo */}
      <div className="advertisement-container left-ad">
        <p>Trống trải vì chưa được book quảng cáo </p>
      </div>
      <div className="advertisement-container right-ad">
        <p>Trống trải vì chưa được book quảng cáo </p>
      </div>
    </div>
  );    
};

export default ChapterImg;