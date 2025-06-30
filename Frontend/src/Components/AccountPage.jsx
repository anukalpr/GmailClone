import React, { useRef, useState } from 'react';
import { Box, Typography, Button, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext'; 
const AccountPage = () => {
  const { currentUser } = useAuth();
  const [profilePic, setProfilePic] = useState(currentUser?.photoURL || '');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleAddAccount = () => {
    navigate('/');
  };

  const handleProfileClick = () => {
    fileInputRef.current.click();
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfilePic(imageURL);

      // TODO: Optional - upload image to backend / Firebase here
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={3}
      sx={{
        width: '100%',
        height: '100vh',
        backgroundColor: '#f1f3f4',
      }}
    >
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleProfileChange}
      />
      <Avatar
        src={profilePic}
        sx={{ width: 100, height: 100, cursor: 'pointer', mb: 2 }}
        onClick={handleProfileClick}
      />
      <Typography variant="h6">{currentUser?.email}</Typography>

      <Button
        variant="contained"
        sx={{ mt: 3 }}
        onClick={handleAddAccount}
      >
        Add another account
      </Button>
    </Box>
  );
};

export default AccountPage;
