const Imap = require('node-imap');
const Email = require('../model/email');
const UserCredentials = require('../model/userCredentials');

const isPrintable = (str) => /^[\x20-\x7E\s]*$/.test(str);

const fetchMail = async () => {
  const creds = await UserCredentials.findOne().sort({ _id: -1 });
  if (!creds) throw new Error('No user credentials found.');

  const imap = new Imap({
    user: creds.userId,
    password: creds.password,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    debug: console.log ,
  });

  const openInbox = (cb) => imap.openBox('INBOX', false, cb);

  imap.once('ready', () => {
    openInbox((err, box) => {
      if (err) throw err;

      console.log('✅ IMAP connection ready. Waiting for new emails...');

      imap.on('mail', async (numNewMsgs) => {
        console.log(`📩 ${numNewMsgs} new email(s) received`);

        const fetch = imap.seq.fetch(`${box.messages.total}:*`, {
          bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
          struct: true
        });

        fetch.on('message', (msg, seqno) => {
          console.log(`🔄 Fetching message #${seqno}...`);
          const emailData = { seqno };

          msg.on('body', (stream, info) => {
            let buffer = '';
            stream.on('data', (chunk) => buffer += chunk.toString('utf8'));

            stream.once('end', () => {
              if (info.which === 'TEXT') {
                const decoded = Buffer.from(buffer, 'base64').toString('utf8');
                emailData.text = isPrintable(decoded) ? decoded : buffer;
                console.log(`📝 Body fetched`);
              } else {
                const header = Imap.parseHeader(buffer);
                emailData.from = header.from?.[0] || '';
                emailData.to = header.to?.[0] || '';
                emailData.subject = header.subject?.[0] || '';
                emailData.date = header.date?.[0] || '';
                console.log(`📬 Header fetched: ${emailData.subject}`);
              }
            });
          });

          msg.once('end', async () => {
            try {
              const existing = await Email.findOne({
                from: emailData.from,
                to: emailData.to,
                subject: emailData.subject,
                date: emailData.date
              });

              if (!existing) {
                const email = new Email(emailData);
                await email.save();
                console.log(`✅ New email saved: ${emailData.subject}`);
              } else {
                console.log(`⚠️ Duplicate email skipped: ${emailData.subject}`);
              }
            } catch (err) {
              console.error('❌ Email save failed:', err);
            }
          });
        });

        fetch.once('error', (err) => {
          console.error('❌ Fetch error:', err);
        });

        fetch.once('end', () => {
          console.log('📥 Finished fetching new email.');
        });
      });
    });
  });

  imap.once('error', (err) => {
    console.error('❌ IMAP connection error:', err);
  });

  imap.once('end', () => {
    console.log('🛑 IMAP connection closed.');
  });

  imap.connect();
};

module.exports = fetchMail;
