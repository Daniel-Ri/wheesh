package com.daniel.wheesh.config;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Value("${spring.mail.username}")
    private String fromEmail;

    private void sendHtmlEmail(String to, String subject, String htmlBody) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true); // Set to true to indicate this is an HTML email
        helper.setFrom(fromEmail);

        mailSender.send(mimeMessage);
    }

    public void sendTokenForNewEmail(String to, String token) throws MessagingException {
        String htmlContent = """
            <p style="font-size:16px;height:30px;font-weight:bold;margin:0">Dear Mr/Mrs/Ms:</p>
              <div style="font-size:14px;line-height:20px;text-indent:2em">
                <span>
                  <p style="margin:0;margin-top:8px">Warmest greetings to you,</p>
                  <p style="margin:0;margin-top:8px">
                    In order to complete your registration process in our JBHSR Ticketing System, you need to\s
                    verify your email address.
                  </p>
                </span>
                <p style="margin:0;margin-top:8px">
                  Verification Code: <span style="color:#ff764c">&nbsp;%s</span>
                </p>
                <span>
                  <p style="margin:0;margin-top:8px">
                    This verification code will be valid for 5 minutes. If the code is expired, please apply to\s
                    resend the new verification code to your email address.
                  </p>
                  <p style="margin:0;margin-top:8px">
                    We received an application to create a new user account using this email address. Shall this\s
                    was not done by you, please kindly ignore this email.
                  </p>
                  <p style="margin:0;margin-top:8px">
                    Thank you!
                  </p>
                </span>
                <div style="text-align:end">Wheesh</div>
              </div>
            """.formatted(token);

        sendHtmlEmail(to, "Register Email - Wheesh Dev Website", htmlContent);
    }

    public void sendTokenForUpdateEmail(String to, String token) throws MessagingException {
        String htmlContent = """
            <p style="font-size:16px;height:30px;font-weight:bold;margin:0">Dear Mr/Mrs/Ms:</p>
              <div style="font-size:14px;line-height:20px;text-indent:2em">
                <span>
                  <p style="margin:0;margin-top:8px">Warmest greetings to you,</p>
                  <p style="margin:0;margin-top:8px">
                    In order to complete your email address modification process in our JBHSR Ticketing System,\s
                    you need to verify your email address
                  </p>
                </span>
                <p style="margin:0;margin-top:8px">
                  Verification Code: <span style="color:#ff764c">&nbsp;%s</span>
                </p>
                <span>
                  <p style="margin:0;margin-top:8px">
                    This verification code will be valid for 5 minutes. If the code is expired, please apply to\s
                    resend the new verification code to your email address.
                  </p>
                  <p style="margin:0;margin-top:8px">
                    We received an application to modify your registered email address. Shall this was not done by\s
                    you, please kindly ignore this email.
                  </p>
                  <p style="margin:0;margin-top:8px">
                    Thank you!
                  </p>
                </span>
              </div>
              <div style="text-align:end">Wheesh</div>
            """.formatted(token);

        sendHtmlEmail(to, "Email Address Modification - Wheesh Dev Website", htmlContent);
    }
}
