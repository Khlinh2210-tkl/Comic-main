// src/components/RechargePage.js
import React from 'react';

const RechargePage = () => {
  const handleRecharge = () => {
    // Logic nạp xu sẽ được thực hiện ở đây
    alert('Nạp xu thành công!');
  };

  return (
    <div className="recharge-container">
      <h1>Nạp Xu</h1>
      <p>Chọn số xu bạn muốn nạp:</p>
      <button onClick={handleRecharge}>Nạp 100 Xu</button>
      <button onClick={handleRecharge}>Nạp 500 Xu</button>
      <button onClick={handleRecharge}>Nạp 1000 Xu</button>
    </div>
  );
};

export default RechargePage;