const Imap = require('node-imap');
const { simpleParser } = require('mailparser');
const Email = require('../model/email');
const UserCredentials = require('../model/userCredentials');

const rewriteImages = (html) => {
  if (!html) return '';
  return html.replace(/<img[^>]+src="([^"]+)"[^>]*>/gi, (match, url) => {
    const encoded = encodeURIComponent(url);
    return match.replace(url, `http://localhost:4000/image-proxy?url=${encoded}`);
  });
};

const fetchMail = async (userId) => {
  const creds = await UserCredentials.findOne({ userId });
  if (!creds) throw new Error('No user credentials found.');

  const imap = new Imap({
    user: creds.userId,
    password: creds.password,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
  });

  const openInbox = (cb) => imap.openBox('INBOX', false, cb);

  imap.once('ready', () => {
    openInbox((err, box) => {
      if (err) throw err;

      const start = Math.max(1, box.messages.total - 9);
      const fetch = imap.seq.fetch(`${start}:${box.messages.total}`, {
        bodies: '',
        struct: true,
      });

      fetch.on('message', (msg, seqno) => {
        let buffer = '';

        msg.on('body', (stream) => {
          stream.on('data', (chunk) => {
            buffer += chunk.toString('utf8');
          });
        });

        msg.once('end', async () => {
          try {
            const parsed = await simpleParser(buffer);
            const emailData = {
              seqno,
              from: parsed.from?.text || '',
              to: parsed.to?.text || '',
              subject: parsed.subject || '',
              date: parsed.date || new Date(),
              text: parsed.text || '',
              html: rewriteImages(parsed.html),
            };

            const exists = await Email.findOne({
              from: emailData.from,
              to: emailData.to,
              subject: emailData.subject,
              date: emailData.date,
            });

            if (!exists) {
              await new Email(emailData).save();
              console.log(`✅ New email saved: ${emailData.subject}`);
            } else {
              console.log(`⚠️ Duplicate email skipped: ${emailData.subject}`);
            }
          } catch (error) {
            console.error('❌ Failed to parse/save email:', error.message);
          }
        });
      });

      fetch.once('error', (err) => console.error('❌ Fetch error:', err));
      fetch.once('end', () => imap.end());
    });
  });

  imap.once('error', (err) => console.error('❌ IMAP error:', err.message));
  imap.once('end', () => console.log('🛑 IMAP connection closed.'));
  imap.connect();
};

module.exports = fetchMail;
