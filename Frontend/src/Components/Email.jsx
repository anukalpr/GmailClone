import {
  AccessAlarm,
  DeleteForeverOutlined,
  Star,
  StarBorder
} from "@mui/icons-material";
import {
  Checkbox,
  Box,
  Typography,
  IconButton,
  styled,
  useMediaQuery
} from "@mui/material";
import { useState } from "react";
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";

const WrapperEmail = styled(Box)(({ theme }) => ({
  borderBottom: '1px solid #e0e0e0',
  padding: '8px 12px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  "&:hover": {
    backgroundColor: "#f2f2f2",
  },
}));

const RowDesktop = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  [theme.breakpoints.down('sm')]: {
    display: 'none'
  }
}));

const RowMobileTop = styled(Box)(({ theme }) => ({
  display: 'none',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    display: 'flex'
  }
}));

const RowMobileBottom = styled(Box)(({ theme }) => ({
  display: 'none',
  alignItems: 'center',
  gap: '6px',
  marginTop: '4px',
  [theme.breakpoints.down('sm')]: {
    display: 'flex'
  }
}));

const Email = ({ email, selectedEmails, setEmails, toggleSelectEmail }) => {
  const [isStarred, setIsStarred] = useState(email.starred);
  const [isSnoozed, setIsSnoozed] = useState(email.snoozed);
  const location = useLocation();
  const navigate = useNavigate();

  const handleStarred = async () => {
    try {
      await axios.put(`http://localhost:4000/emails/${email._id}/star`);
      setIsStarred(!isStarred);
      setEmails(prev => prev.map(e =>
        e._id === email._id ? { ...e, starred: !e.starred } : e
      ));
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSnoozed = async () => {
    try {
      await axios.put(`https://gmailclone-rjhk.onrender.com/emails/${email._id}/snooze`);
      setIsSnoozed(!isSnoozed);
      setEmails(prev => prev.map(e =>
        e._id === email._id ? { ...e, snoozed: !e.snoozed } : e
      ));
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/emails/${email._id}/delete`);
      setEmails(prev => prev.filter(e => e._id !== email._id));
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleBin = async () => {
    try {
      await axios.put(`https://gmailclone-rjhk.onrender.com/emails/${email._id}/bin`);
      setEmails(prev => prev.map(e => e._id === email._id ? { ...e, bin: true } : e));
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleBinDelete = () => {
    if (location.pathname === '/bin') handleDelete();
    else handleBin();
  };

  const handleViewEmail = () => {
    navigate('/view-email');
  };

  const formatDateTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diff = (now - messageDate) / (1000 * 60 * 60);
    return diff < 24
      ? messageDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      : messageDate.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  };

  return (
    <WrapperEmail>
      <RowDesktop>
        <Checkbox
          size="small"
          checked={selectedEmails.includes(email._id)}
          onChange={() => toggleSelectEmail(email._id)}
        />
        <IconButton onClick={handleStarred}>
          {isStarred ? (
            <Star fontSize="small" sx={{ color: "gold" }} />
          ) : (
            <StarBorder fontSize="small" sx={{ color: "gray" }} />
          )}
        </IconButton>
        <Typography
          onClick={handleViewEmail}
          sx={{
            minWidth: '150px',
            maxWidth: '200px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            fontSize: '14px'
          }}
        >
          {email.from}
        </Typography>
        <Typography
          onClick={handleViewEmail}
          sx={{
            flex: 1,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            fontSize: '14px',
            textAlign: 'center'
          }}
        >
          {email.subject}
        </Typography>
        <Typography
          onClick={handleViewEmail}
          sx={{ fontSize: '13px', minWidth: '70px' }}
        >
          {formatDateTime(email.date)}
        </Typography>
        <IconButton onClick={handleBinDelete}>
          <DeleteForeverOutlined fontSize="small" sx={{ color: 'black' }} />
        </IconButton>
        <IconButton onClick={handleSnoozed}>
          <AccessAlarm fontSize="small" sx={{ color: isSnoozed ? 'blue' : 'gray' }} />
        </IconButton>
      </RowDesktop>

      <RowMobileTop>
        <Typography
          onClick={handleViewEmail}
          sx={{ fontWeight: 600, fontSize: '14px' }}
        >
          {email.from}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {formatDateTime(email.date)}
        </Typography>
      </RowMobileTop>
      <RowMobileBottom>
        <Checkbox
          size="small"
          checked={selectedEmails.includes(email._id)}
          onChange={() => toggleSelectEmail(email._id)}
        />
        <IconButton onClick={handleSnoozed}>
          <AccessAlarm fontSize="small" sx={{ color: isSnoozed ? 'blue' : 'gray' }} />
        </IconButton>
        <IconButton onClick={handleStarred}>
          {isStarred ? (
            <Star fontSize="small" sx={{ color: 'gold' }} />
          ) : (
            <StarBorder fontSize="small" sx={{ color: 'gray' }} />
          )}
        </IconButton>
        <IconButton onClick={handleBinDelete}>
          <DeleteForeverOutlined fontSize="small" sx={{ color: 'black' }} />
        </IconButton>
      </RowMobileBottom>
    </WrapperEmail>
  );
};

export default Email;
