import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/account?tab=orders', { replace: true });
  }, [navigate]);

  return null;
};

export default OrderHistory;
