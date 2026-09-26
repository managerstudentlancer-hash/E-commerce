import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddressBook = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/account?tab=addresses', { replace: true });
  }, [navigate]);

  return null;
};

export default AddressBook;
