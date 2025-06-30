import React, { useState } from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import {
  Menu as MenuIcon, Search, AccountCircleOutlined
} from '@mui/icons-material';
import { styled } from '@mui/system';
import {
  Box, InputBase, useMediaQuery, Menu, MenuItem, Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext'; 
import { icon } from '../Constant/constant';

const StyledAppBar = styled(AppBar)({
  background: '#F5F5F5',
  boxShadow: 'none',
  position: 'fixed',
  zIndex: 1200,
});

const ResponsiveToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingLeft: 8,
  paddingRight: 8,
  flexWrap: 'wrap'
});

const SearchWrapper = styled(Box)({
  background: '#EAF1FB',
  height: 44,
  borderRadius: 30,
  padding: '0 12px',
  display: 'flex',
  alignItems: 'center',
  flexGrow: 1,
  margin: '0 16px',
  maxWidth: 600,
});

const InputBox = styled(InputBase)({
  border: 'none',
  background: 'transparent',
  flex: 1,
  paddingLeft: 10,
  paddingRight: 10,
  color: 'black',
  fontSize: 14
});

const Header = ({ toggleDrawer, setEmails, setSearchMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useMediaQuery('(max-width:600px)');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleAccountClick = (event) => {
    if (isMobile) {
      navigate('/account');
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddAccount = () => {
    navigate('/');
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      try {
        const res = await fetch(`https://gmailclone-rjhk.onrender.com/emails/search?query=${query}`);
        const data = await res.json();
        setEmails(data);
        setSearchMode(true);
        setTimeout(() => setSearchMode(false), 10000);
      } catch (err) {
        console.log("Search error:", err.message);
      }
    } else {
      setSearchMode(false);
    }
  };

  return (
    <StyledAppBar>
      <ResponsiveToolbar>
        <Box display="flex" alignItems="center" gap={1}>
          <MenuIcon color="action" onClick={toggleDrawer} style={{ cursor: 'pointer' }} />
          {!isMobile && <img src={icon} alt="Gmail Logo" style={{ width: 110 }} />}
        </Box>

        <SearchWrapper>
          <Search color="action" />
          <InputBox
            type="text"
            placeholder="Search mail"
            value={searchQuery}
            onChange={handleSearch}
          />
        </SearchWrapper>

        <AccountCircleOutlined style={{"color":"black"}}onClick={handleAccountClick}>
        </AccountCircleOutlined>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem >{currentUser?.email}</MenuItem>
          <MenuItem onClick={handleAddAccount}>Add another account</MenuItem>
        </Menu>
      </ResponsiveToolbar>
    </StyledAppBar>
  );
};

export default Header;
