import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { ArrowBack, Delete, Reply, StarBorder, Star, Shortcut } from '@mui/icons-material';
import axios from 'axios';
import DOMPurify from 'dompurify';
import ReplyDialog from './ReplyDialog';
import ForwardDialog from './ForwardDialog';

function decodeQuotedPrintable(input) {
  return input
    .replace(/=(?:\r\n|\n|\r)/g, '')
    .replace(/=([A-Fa-f0-9]{2})/g, (match, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
}

function extractHtmlFromMime(mimeString) {
  if (!mimeString) return '';
  const boundaryMatch = mimeString.match(/boundary="?([^"\r\n]+)"?/i);
  if (!boundaryMatch) {
    if (mimeString.includes('Content-Type: text/html')) {
      const parts = mimeString.split(/\r?\n\r?\n/);
      for (let i = 0; i < parts.length; i++) {
        if (parts[i].toLowerCase().includes('content-type: text/html')) {
          let content = parts[i + 1] || '';
          const encodingHeader = parts[i].match(/Content-Transfer-Encoding: (.+)/i);
          const encoding = encodingHeader ? encodingHeader[1].toLowerCase().trim() : '';
          if (encoding === 'quoted-printable') content = decodeQuotedPrintable(content);
          else if (encoding === 'base64') content = atob(content.replace(/\s/g, ''));
          return content;
        }
      }
    }
    return mimeString;
  }

  const boundary = boundaryMatch[1];
  const parts = mimeString.split('--' + boundary);
  for (const part of parts) {
    if (part.toLowerCase().includes('content-type: text/html')) {
      const headerEndIndex = part.indexOf('\r\n\r\n');
      if (headerEndIndex === -1) continue;
      let content = part.substring(headerEndIndex + 4).trim();
      const encodingHeader = part.match(/Content-Transfer-Encoding: (.+)/i);
      const encoding = encodingHeader ? encodingHeader[1].toLowerCase().trim() : '';
      if (encoding === 'quoted-printable') content = decodeQuotedPrintable(content);
      else if (encoding === 'base64') {
        try {
          content = atob(content.replace(/\s/g, ''));
        } catch {}
      }
      return content;
    }
  }

  return mimeString;
}

const ViewEmail = ({ openDrawer, email, setEmails }) => {
  const location = useLocation();
  const [openReplyDialog, setOpenReplyDialog] = useState(false);
  const [openForwardDialog, setOpenForwardDialog] = useState(false);
  const [isStarred, setIsStarred] = useState(email?.starred || false);

  useEffect(() => {
    setIsStarred(email?.starred || false);
  }, [email]);

  const handleStarred = async () => {
    try {
      await axios.put(`http://localhost:4000/emails/${email._id}/star`);
      setIsStarred(prev => !prev);
      setEmails(prevEmails =>
        prevEmails.map(e => (e._id === email._id ? { ...e, starred: !e.starred } : e))
      );
    } catch (error) {
      console.error('Star toggle error:', error.message);
    }
  };

  const handleBin = async () => {
    try {
      await axios.put(`https://gmailclone-rjhk.onrender.com/emails/${email._id}/bin`);
      setEmails(prevEmails =>
        prevEmails.map(e => (e._id === email._id ? { ...e, bin: true } : e))
      );
    } catch (error) {
      console.error('Bin error:', error.message);
    }
  };

  const getEmailHtml = () => {
    if (!email?.text) return '';
    if (email.text.toLowerCase().includes('content-type: text/html')) {
      const rawHtml = extractHtmlFromMime(email.text);
      return DOMPurify.sanitize(rawHtml);
    }
    return DOMPurify.sanitize(email.text.replace(/\n/g, '<br />'));
  };

  const drawerStyle = openDrawer
    ? { marginLeft: '0px', marginTop: '0px' }
    : { marginTop: '0px', width: '100%' };

  const pathnamesToHide = ['/inbox', '/sent', '/draft', '/bin', '/all-mail', '/snoozed', '/starred'];

  if (!email) return <Box p={2}>Select an email to view</Box>;

  return (
    <Box style={drawerStyle}>
      {!pathnamesToHide.includes(location.pathname) && (
        <Box p={{ xs: 1, sm: 3 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton onClick={() => window.history.back()}>
              <ArrowBack color="action" fontSize="small" />
            </IconButton>
            <IconButton onClick={handleBin}><Delete /></IconButton>
          </Box>
          <Typography sx={{ fontSize: '20px', mt: 2, ml: { xs: 2, sm: 6 } }}>
            {email.subject}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, ml: { xs: 2, sm: 6 }, flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <img
                src="https://lh3.googleusercontent.com/a/default-user=s40-p"
                alt="avatar"
                style={{ borderRadius: '50%', width: 40, height: 40 }}
              />
            </Box>
            <Box flex={1}>
              <Typography fontSize={14}>{email.from}</Typography>
              <Typography fontSize={12} color="text.secondary">
                {new Date(email.date).toLocaleString()}
              </Typography>
            </Box>
            <Box>
              {isStarred ? (
                <Star fontSize="small" onClick={handleStarred} style={{ color: 'gold', cursor: 'pointer' }} />
              ) : (
                <StarBorder fontSize="small" onClick={handleStarred} style={{ cursor: 'pointer' }} />
              )}
              <Reply fontSize="small" style={{ marginLeft: 8, cursor: 'pointer' }} onClick={() => setOpenReplyDialog(true)} />
            </Box>
          </Box>
          <Box
            mt={3}
            ml={{ xs: 2, sm: 6 }}
            pr={2}
            sx={{
              fontFamily: 'sans-serif',
              color: '#222',
              fontSize: '15px',
              wordBreak: 'break-word',
              whiteSpace: 'normal',
              lineHeight: 1.5
            }}
            dangerouslySetInnerHTML={{ __html: getEmailHtml() }}
          />
          <Box display="flex" gap={2} mt={5} pl={{ xs: 2, sm: 6 }} flexWrap="wrap">
            <Button
              onClick={() => setOpenReplyDialog(true)}
              variant="outlined"
              startIcon={<Reply />}
              sx={{
                borderRadius: '30px',
                textTransform: 'none',
                color: 'black',
                borderColor: 'black',
                height: { xs: 32, sm: 40 },
                minWidth: { xs: '140px', sm: '120px' },
                fontSize: { xs: '13px', sm: '14px' },
                paddingX: 2
              }}
            >
              Reply
            </Button>
            <Button
              onClick={() => setOpenForwardDialog(true)}
              variant="outlined"
              startIcon={<Shortcut />}
              sx={{
                borderRadius: '30px',
                textTransform: 'none',
                color: 'black',
                borderColor: 'black',
                height: { xs: 32, sm: 40 },
                minWidth: { xs: '140px', sm: '120px' },
                fontSize: { xs: '13px', sm: '14px' },
                paddingX: 2
              }}
            >
              Forward
            </Button>
          </Box>
        </Box>
      )}
      <ReplyDialog openDialog={openReplyDialog} setOpenDialog={setOpenReplyDialog} />
      <ForwardDialog openDialog={openForwardDialog} setOpenDialog={setOpenForwardDialog} email={email} />
    </Box>
  );
};

export default ViewEmail;
