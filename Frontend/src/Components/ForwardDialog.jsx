import {
    Dialog,
    Box,
    InputBase,
    TextField,
    Button,
    useMediaQuery,
    IconButton
  } from "@mui/material";
  import { DeleteOutline, Shortcut, Close as CloseIcon } from "@mui/icons-material";
  import { useState, useEffect } from "react";
  import axios from 'axios';
  import { styled } from "@mui/system";
  
  const Header = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 15px',
    background: '#f2f6fc',
    borderBottom: '1px solid #ddd',
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
    borderTop: '1px solid #ccc',
  });
  
  const SendButton = styled(Button)({
    borderRadius: 20,
    background: 'blue',
    width: 100,
    color: 'white',
    textTransform: 'none',
  });
  
  const ForwardDialog = ({ openDialog, setOpenDialog, email }) => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const [recipients, setRecipients] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
  
    useEffect(() => {
      if (email) {
        setSubject(`Fwd: ${email.subject}`);
        setBody(
          `\n\n---------- Forwarded message ----------\nFrom: ${email.from}\nDate: ${new Date(email.date).toLocaleString()}\nTo: ${email.to}\n\n${email.text}`
        );
      }
    }, [email]);
  
    const sendMail = async (e) => {
      e.preventDefault();
      try {
        await axios.post('http://localhost:4000/send-email', {
          to: recipients.trim(),
          subject,
          text: body,
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
            width: isMobile ? '100%' : '50%',
            height: 'fit-content',
            maxWidth: '100%',
            maxHeight: '100%',
            borderRadius: isMobile ? 0 : '10px 10px 0 0',
            position: 'fixed',
            bottom: isMobile ? 0 : 'auto',
            left: isMobile ? 0 : '260px',
          },
        }}
      >
        <Header>
          <Box display="flex" alignItems="center" gap={1}>
            <Shortcut fontSize="small" />
            Forward Email
          </Box>
          <IconButton onClick={() => setOpenDialog(false)}>
            <CloseIcon />
          </IconButton>
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
  
  export default ForwardDialog;
  