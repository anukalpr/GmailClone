import { Box, Button, styled, List, ListItem, useMediaQuery, Fab } from '@mui/material';
import { CreateOutlined } from '@mui/icons-material';
import { SIDEBAR_DATA } from '../Config/sidebar.config';
import ComposeMail from './ComposeMail';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ComposeButton = styled(Button)(({ theme }) => ({
  margin: '10px 0 20px 10px',
  borderRadius: 10,
  background: '#C2E7FF',
  color: 'black',
  height: 45,
  width: '85%',
  textTransform: 'none',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  [theme.breakpoints.down('sm')]: {
    display: 'none'  
  }
}));

const FabButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: 20,
  right: 20,
  background: '#C2E7FF',
  color: 'black',
  [theme.breakpoints.up('sm')]: {
    display: 'none' 
  }
}));

const Container = styled(Box)(({ theme }) => ({
  padding: 8,
  width: '220px',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    paddingBottom: 60  
  },
  '& > ul': {
    padding: '10px 0 0 5px',
  },
  '& > ul > li': {
    fontSize: 16,
    fontWeight: 500,
    cursor: 'pointer',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: 8,
    transition: 'background 0.2s',
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      padding: '6px 10px'
    }
  },
  '& > ul > li.selected': {
    background: '#90D5FF',
  },
  '& > ul > li > svg': {
    marginRight: 16
  }
}));

const SideBarContent = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDialog = () => setOpenDialog(true);

  const handleRoute = (path, title) => {
    setSelectedItem(title);
    navigate(path);
  };

  return (
    <>
      <Container>
        <ComposeButton variant="contained" onClick={handleDialog}>
          <CreateOutlined fontSize="small" /> Compose
        </ComposeButton>

        <List>
          {SIDEBAR_DATA.map((data) => (
            <ListItem
              key={data.title}
              onClick={() => handleRoute(data.path, data.title)}
              className={selectedItem === data.title ? 'selected' : ''}
            >
              <data.icon fontSize="small" /> {data.title}
            </ListItem>
          ))}
        </List>
      </Container>

      {isMobile && (
        <FabButton onClick={handleDialog}>
          <CreateOutlined />
        </FabButton>
      )}

      <ComposeMail openDialog={openDialog} setOpenDialog={setOpenDialog} />
    </>
  );
};

export default SideBarContent;

