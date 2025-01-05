import React, { useState, useEffect, useRef } from 'react'; 
import axios from 'axios'; 
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../Theme";
import InputBase from '@mui/material/InputBase';
import SearchIcon from "@mui/icons-material/Search";

import './HomePage.css'; 
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../untils';
import PaypalCheckoutButton from './PaypalCheckoutButton';
const HomePage = () => {
  const [comics, setComics] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [page, setPage] = useState(1); 
  
  const [totalPages, setTotalPages] = useState(500); 
  const [searchKeyword, setSearchKeyword] = useState(''); 
  const [searchResults, setSearchResults] = useState([]); 
  const searchInputRef = useRef(null); 
  const [loggedInUser, setLoggedInUser] = useState('');
  const [cash, setCash] = useState('');
  const [loggedInMail, setloggedInMail] = useState('');
  const product = {
    description: "Learn how to build a website with React JS",
    price: 5,
};
  const navigate = useNavigate(); 
  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'))
    setCash(localStorage.getItem('cash'))
    setloggedInMail(localStorage.getItem('loggedInMail'))
}, [])
  // Fetch search results based on keyword
  const fetchSearchResults = async () => {
    if (searchKeyword.trim() === '') {
      setSearchResults([]); // Không tìm kiếm nếu từ khóa rỗng
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `https://otruyenapi.com/v1/api/tim-kiem?keyword=${searchKeyword}&page=${page}&limit=30`
      );

      console.log("Response from API:", response.data);

      const results = response.data.data.items || [];
      setSearchResults(results); 

      const totalCount = response.data.data?.totalCount || 0;
      setTotalPages(Math.ceil(totalCount / 30));

    } catch (err) {
      console.error("Error fetching search results:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };  

  // Handle Enter key to search
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setPage(1); // Reset trang về 1 khi tìm kiếm
      fetchSearchResults(); // Thực hiện tìm kiếm khi nhấn Enter
    }
  };
  const theme = useTheme();

  const colors = tokens(theme.palette.mode);

  // Fetch comics data when page changes (if not searching)
  useEffect(() => {
    if (!searchKeyword.trim()) {
      const fetchComics = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `https://otruyenapi.com/v1/api/danh-sach/truyen-moi?page=${page}&limit=30`
          );
          setComics(response.data.data.items || []);
          setTotalPages(Math.min(response.data.data.totalPages || 500, 500));
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchComics();
    } 
  }, [page, searchKeyword]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleLogoClick = () => {
    setPage(1);
    setSearchKeyword('');
    setSearchResults([]); 
    setTotalPages(500); 
    navigate('/');
  };

  const handleLogout = (e) => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('cash');
    localStorage.removeItem('loggedInMail');

    handleSuccess('User Loggedout');
    setTimeout(() => {
        navigate('/');
    }, 1000)
}

  const displayedComics = searchKeyword ? searchResults : comics;

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>Có lỗi xảy ra: {error}</div>;

  // Handle pagination display range
  const maxPagesToShow = 5;
  const pageNumbers = [];

  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="homepage-container">
  <Box display="flex" justifyContent="space-between" p={2}>
      <div className="homepage-header"  style={{ cursor: 'pointer' }}>
      <Typography variant="h5" color={colors.greenAccent[100]}>
      Comic HEHE xin chào {loggedInUser} , {loggedInUser} đang có {cash} xu      </Typography>
        <Box>
        <button onClick={handleLogout} className="logout-button">
        Đăng xuất
      </button>
      </Box>
      <Box>

      <button onClick={() => navigate('/add-comic')} className="payment-button">
          Đăng truyện
        </button>
        </Box>

      </div>
      <Box >
      <button onClick={() => navigate('/')} className="payment-button">
      <PaypalCheckoutButton product={product} />
    Nạp xu
        </button>
      <div>

      </div>
      </Box>
      </Box>
      <h1 className="homepage-title"  color={colors.greenAccent[800]}>

     Danh sách truyện tranh
      </h1>


      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="10px"
        margin = "20px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} ref={searchInputRef}
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)} 
          onKeyDown={handleKeyDown} 
          placeholder="Tìm kiếm truyện..."
          className="search-input"/>
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>
      {/* <div className="search-container">
        <input
          ref={searchInputRef}
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)} 
          onKeyDown={handleKeyDown} 
          placeholder="Tìm kiếm truyện..."
          className="search-input"
        />
      </div> */}
      <div className="container">
        {displayedComics.map((comic) => (
          <div key={comic._id} className="comic-item">
            <img
              src={`https://otruyenapi.com//uploads/comics/${comic.thumb_url}`}
              alt={comic.name}
            />
            <h3>{comic.name}</h3>
            <div className="comic-detail-link">
              <a href={`/comic/${comic.slug}`}>Xem chi tiết</a>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(1)}
          disabled={page === 1}
        >
          &lt;&lt; Trang đầu
        </button>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Trang trước
        </button>
        {pageNumbers.map(num => (
          <button
            key={num}
            className={num === page ? 'active' : ''}
            onClick={() => handlePageChange(num)}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Trang sau
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={page === totalPages}
        >
          Trang cuối &gt;&gt;
        </button>
      </div>

 
    </div>
  );
};

export default HomePage