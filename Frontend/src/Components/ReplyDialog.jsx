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
import { useState } from "react";
import axios from 'axios';

const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '10px 15px',
  background: '#f2f6fc',
});

const RecipientsWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  padding: '10px 15px',
});

const Footer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 15px',
  borderTop: '1px solid #ccc'
});

const SendButton = styled(Button)({
  borderRadius: 20,
  background: 'blue',
  width: 100,
  color: 'white',
  textTransform: 'none'
});

const Reply = ({ openDialog, setOpenDialog }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const sendMail = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://gmailclone-rjhk.onrender.com/send-email', {
        to: recipients,
        subject: subject,
        text: body
      });
      alert('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email.');
    }
    setOpenDialog(false);
  };

  return (
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          width: isMobile ? '100%' : '80%',
          height: isMobile ? '100%' : '50%',
          maxWidth: '100%',
          maxHeight: '100%',
          borderRadius: isMobile ? 0 : '10px 10px 0 0',
          position: 'fixed',
          bottom: isMobile ? 0 : 'auto',
          left: isMobile ? 0 : '260px',
        }
      }}
    >
      <Header>
        <Typography variant="subtitle1">Reply</Typography>
        <CloseIcon style={{ cursor: 'pointer' }} onClick={() => setOpenDialog(false)} />
      </Header>

      <RecipientsWrapper>
        <InputBase
          placeholder="Recipients"
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          style={{ borderBottom: '1px solid #F5F5F5', marginTop: '10px' }}
        />
        <InputBase
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={{ borderBottom: '1px solid #F5F5F5', marginTop: '10px' }}
        />
      </RecipientsWrapper>

      <Box px={2}>
        <TextField
          multiline
          rows={8}
          fullWidth
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your message..."
          sx={{
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            mt: 1,
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

export default Reply;
