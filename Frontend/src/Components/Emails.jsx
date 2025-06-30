import { DeleteForeverOutlined, Refresh } from '@mui/icons-material';
import { Box, Checkbox, IconButton, List } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Email from './Email';
import ViewEmail from './ViewEmails';
import { useAuth } from '../contexts/authContext';
import Header from './Header';

const Emails = ({ openDrawer, toggleDrawer }) => {
  const [emails, setEmails] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchMode, setSearchMode] = useState(false);
  const { currentUser } = useAuth();
  const location = useLocation();

  const fetchEmails = async () => {
    try {
      const res = await axios.get('https://gmailclone-rjhk.onrender.com/emails');
      setEmails(res.data);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  useEffect(() => {
    if (!searchMode) fetchEmails();
    const interval = setInterval(() => {
      if (!searchMode) fetchEmails();
    }, 2000);
    return () => clearInterval(interval);
  }, [location.pathname, searchMode]);

  const filteredEmails = emails.filter(email => {
    if (location.pathname === '/') return true;
    if (location.pathname === '/inbox') return !email.bin && !email.draft && !email.sent;
    if (location.pathname === '/starred') return email.starred;
    if (location.pathname === '/snoozed') return email.snoozed;
    if (location.pathname === '/sent') return email.from === currentUser.email;
    if (location.pathname === '/draft') return email.draft;
    if (location.pathname === '/bin') return email.bin;
    if (location.pathname === '/all-mail') return true;
    return false;
  });

  const selectAllEmails = (e) => {
    if (e.target.checked) {
      const allEmailIds = filteredEmails.map(email => email._id);
      setSelectedEmails(allEmailIds);
    } else {
      setSelectedEmails([]);
    }
  };

  const toggleSelectEmail = (emailId) => {
    setSelectedEmails(prev =>
      prev.includes(emailId)
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  const handleSelectedDelete = async () => {
    try {
      if (location.pathname === '/bin') {
        await axios.delete('https://gmailclone-rjhk.onrender.com/emails/delete', {
          data: { ids: selectedEmails }
        });
        setEmails(prev => prev.filter(email => !selectedEmails.includes(email._id)));
      } else {
        await axios.put('https://gmailclone-rjhk.onrender.com/emails/bin', { ids: selectedEmails });
        setEmails(prev =>
          prev.map(email =>
            selectedEmails.includes(email._id)
              ? { ...email, bin: true }
              : email
          )
        );
      }
      setSelectedEmails([]);
    } catch (error) {
      console.error('Error deleting emails:', error);
    }
  };

  return (
    <Box style={openDrawer ? { marginLeft: '250px', marginTop: '64px' } : { marginTop: '64px', width: '100%' }}>
      <Header toggleDrawer={toggleDrawer} setEmails={setEmails} setSearchMode={setSearchMode} />

      {location.pathname !== '/view-email' && (
        <Box style={{ padding: '20px 10px 0 10px', display: 'flex', alignItems: 'center' }}>
          <Checkbox
            size='small'
            onChange={selectAllEmails}
            checked={selectedEmails.length === filteredEmails.length && filteredEmails.length > 0}
          />
          <IconButton onClick={handleSelectedDelete}>
            <DeleteForeverOutlined />
          </IconButton>
          <IconButton onClick={fetchEmails}>
            <Refresh />
          </IconButton>
        </Box>
      )}

      <List>
        {filteredEmails
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map(email => (
            <Box key={email._id} onClick={() => setSelectedEmail(email)}>
              <Email
                email={email}
                selectedEmails={selectedEmails}
                setEmails={setEmails}
                openDrawer={openDrawer}
                toggleSelectEmail={toggleSelectEmail}
              />
            </Box>
          ))}
      </List>

      {selectedEmail && (
        <ViewEmail openDrawer={openDrawer} email={selectedEmail} setEmails={setEmails} />
      )}
    </Box>
  );
};

export default Emails;
