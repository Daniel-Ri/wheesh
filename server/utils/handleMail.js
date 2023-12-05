const nodemailer = require('nodemailer');

// Create a nodemailer transporter
exports.transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USERNAME_NODEMAILER,
    pass: process.env.PASSWORD_NODEMAILER,
  },
});

exports.generateMailOptionsForNewEmail = (recipientEmail, token) => {
  const htmlContent = `
  <p style="font-size:16px;height:30px;font-weight:bold;margin:0">Dear Mr/Mrs/Ms:</p>
  <div style="font-size:14px;line-height:20px;text-indent:2em">
    <span class="im">
      <p style="margin:0;margin-top:8px">Warmest greetings to you,</p>
      <p style="margin:0;margin-top:8px">
        In order to complete your registration process in our JBHSR Ticketing System, you need to 
        verify your email address.
      </p>
    </span>
    <p style="margin:0;margin-top:8px">
      Verification Code: <span style="color:#ff764c">&nbsp;${token}</span>
    </p>
    <span class="im">
      <p style="margin:0;margin-top:8px">
        This verification code will be valid for 5 minutes. If the code is expired, please apply to 
        resend the new verification code to your email address.
      </p>
      <p style="margin:0;margin-top:8px">
        We received an application to create a new user account using this email address. Shall this 
        was not done by you, please kindly ignore this email.
      </p>
      <p style="margin:0;margin-top:8px">
        Thank you!
      </p>
    </span>
    <div style="text-align:end">Wheesh</div>
  </div>

  `;

  const mailOptions = {
    from: process.env.USERNAME_NODEMAILER, // replace with your email
    to: recipientEmail,
    subject: `Register Email - ${recipientEmail}`,
    html: htmlContent,
  };

  return mailOptions;
}

exports.generateMailOptionsForUpdateEmail = (recipientEmail, token) => {
  const htmlContent = `
  <p style="font-size:16px;height:30px;font-weight:bold;margin:0">Dear Mr/Mrs/Ms:</p>
  <div style="font-size:14px;line-height:20px;text-indent:2em">
    <span class="im">
      <p style="margin:0;margin-top:8px">Warmest greetings to you,</p>
      <p style="margin:0;margin-top:8px">
        In order to complete your email address modification process in our JBHSR Ticketing System, 
        you need to verify your email address
      </p>
    </span>
    <p style="margin:0;margin-top:8px">
      Verification Code: <span style="color:#ff764c">&nbsp;${token}</span>
    </p>
    <span class="im">
      <p style="margin:0;margin-top:8px">
        This verification code will be valid for 5 minutes. If the code is expired, please apply to 
        resend the new verification code to your email address.
      </p>
      <p style="margin:0;margin-top:8px">
        We received an application to modify your registered email address. Shall this was not done by 
        you, please kindly ignore this email.
      </p>
      <p style="margin:0;margin-top:8px">
        Thank you!
      </p>
    </span>
  </div>
  <div style="text-align:end">Wheesh</div>
  `;

  const mailOptions = {
    from: process.env.USERNAME_NODEMAILER, // replace with your email
    to: recipientEmail,
    subject: `Email Address Modification - ${recipientEmail}`,
    html: htmlContent,
  };

  return mailOptions;
}