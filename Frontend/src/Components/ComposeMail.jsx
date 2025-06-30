import {
  Dialog,
  Box,
  Typography,
  styled,
  InputBase,
  TextField,
  Button,
  useMediaQuery
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { DeleteOutline } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/authContext'; 

const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '10px 15px',
  background: '#f2f6fc',
  borderBottom: '1px solid #ccc',
});

const RecipientsWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  padding: '10px 15px',
  gap: '10px',
});

const Footer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 15px',
  borderTop: '1px solid #ccc',
});

const SendButton = styled(Button)({
  borderRadius: 20,
  background: 'blue',
  width: 100,
  color: 'white',
  textTransform: 'none',
});

const ComposeMail = ({ openDialog, setOpenDialog }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const location = useLocation();
  const { currentUser, userLoggedIn } = useAuth();

  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [password, setPassword] = useState('');
  const [draftId, setDraftId] = useState(null);

  useEffect(() => {
    const pwd = location.state?.password || localStorage.getItem("userPassword") || '';
    setPassword(pwd);
    if (pwd) localStorage.setItem("userPassword", pwd);
  }, [location.state]);

  const closeComposeMail = (e) => {
    e.preventDefault();
    setOpenDialog(false);
  };

  const sendMail = async (e) => {
    e.preventDefault();
    if (!userLoggedIn) return alert('You need to be logged in to send an email!');
    try {
      await axios.post('https://gmailclone-rjhk.onrender.com/send-email', {
        userId: currentUser.email,
        password,
        to: recipients,
        subject,
        text: body
      });
      alert('Email sent successfully!');
      setRecipients('');
      setSubject('');
      setBody('');
      setOpenDialog(false);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email.');
    }
  };

  const saveAsDraft = async (e) => {
    try {
      if (draftId) {
        await axios.put(`https://gmailclone-rjhk.onrender.com/emails/${draftId}/save-draft`, {
          to: recipients,
          subject,
          text: body,
          draft: true
        });
      } else {
        const res = await axios.post('https://gmailclone-rjhk.onrender.com/draft-emails', {
          to: recipients,
          from: currentUser.email,
          subject,
          text: body,
          draft: true
        });
        setDraftId(res.data._id);
      }
      alert("Draft saved!");
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Failed to save draft.");
    }
  };

  const dialogStyle = {
    height: isMobile ? '90%' : '75%',
    width: isMobile ? '100%' : '70%',
    maxHeight: '100%',
    maxWidth: '100%',
    boxShadow: 'none',
    borderRadius: isMobile ? '0' : '10px 10px 0 0',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <Dialog open={openDialog} PaperProps={{ sx: dialogStyle }}>
      <Header>
        <Typography>New Message</Typography>
        <CloseIcon
          fontSize="small"
          onClick={async (e) => {
            await saveAsDraft(e);
            closeComposeMail(e);
          }}
          style={{ cursor: 'pointer' }}
        />
      </Header>

      <RecipientsWrapper>
        <InputBase
          placeholder="Recipients"
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          style={{ borderBottom: '1px solid #F5F5F5' }}
        />
        <InputBase
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={{ borderBottom: '1px solid #F5F5F5' }}
        />
      </RecipientsWrapper>

      <Box flex={1} overflow="auto" px={2}>
        <TextField
          multiline
          rows={isMobile ? 10 : 12}
          fullWidth
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your message..."
          sx={{
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
          }}
        />
      </Box>

      <Footer>
        <SendButton onClick={sendMail}>Send</SendButton>
        <DeleteOutline onClick={() => setOpenDialog(false)} style={{ cursor: 'pointer' }} />
      </Footer>
    </Dialog>
  );
};

export default ComposeMail;
