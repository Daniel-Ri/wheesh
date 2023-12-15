const nodemailer = require('nodemailer');
const { formatDateWithDay, formatHour } = require('./handleValue');

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
    <span>
      <p style="margin:0;margin-top:8px">Warmest greetings to you,</p>
      <p style="margin:0;margin-top:8px">
        In order to complete your registration process in our JBHSR Ticketing System, you need to 
        verify your email address.
      </p>
    </span>
    <p style="margin:0;margin-top:8px">
      Verification Code: <span style="color:#ff764c">&nbsp;${token}</span>
    </p>
    <span>
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
    <span>
      <p style="margin:0;margin-top:8px">Warmest greetings to you,</p>
      <p style="margin:0;margin-top:8px">
        In order to complete your email address modification process in our JBHSR Ticketing System, 
        you need to verify your email address
      </p>
    </span>
    <p style="margin:0;margin-top:8px">
      Verification Code: <span style="color:#ff764c">&nbsp;${token}</span>
    </p>
    <span>
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

exports.generateMailOptionsForRemindSchedule = (user, order) => {
  const htmlContent = `
  <p style="font-size:16px;height:30px;font-weight:bold;margin:0">
    Dear ${user.Passengers[0].gender === 'Male' ? 'Mr.' : 'Mrs.'} ${user.Passengers[0].name}:
  </p>
  <div style="font-size:14px;line-height:20px;margin-left:2em">
    <p style="margin:0;margin-top:8px">Warmest greetings to you,</p>
    <p style="margin:0;margin-top:8px">
      We want to remind you about your upcoming journey from 
      <b>${order.Schedule.departureStation.name}</b> to
      <b>${order.Schedule.arrivalStation.name}</b>.
    </p>
    <div style="margin-top:1em;margin-bottom:2em;margin-left:2em;">
      <table>
        <tbody>
          <tr>
            <th style="text-align:left">Date</th>
            <td><b>:</b> ${formatDateWithDay(order.Schedule.departureTime)}</td>
          </tr>
          <tr>
            <th style="text-align: left">Schedule</th>
            <td><b>:</b> ${formatHour(order.Schedule.departureTime)} - ${formatHour(order.Schedule.arrivalTime)} WIB</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p style="margin:0;margin-top:8px">
      We wish you a comfortable and safe journey.
    </p>
  </div>
  <div style="text-align:end">Wheesh</div>
  `;

  const mailOptions = {
    from: process.env.USERNAME_NODEMAILER, // replace with your email
    to: user.email,
    subject: `Journey Reminder - ${user.email}`,
    html: htmlContent,
  };

  return mailOptions;
}