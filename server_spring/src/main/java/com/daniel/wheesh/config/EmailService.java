package com.daniel.wheesh.config;

import com.daniel.wheesh.order.Order;
import com.daniel.wheesh.passenger.Gender;
import com.daniel.wheesh.schedule.Schedule;
import com.daniel.wheesh.user.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    private final DateTimeFormatter sdfDate = DateTimeFormatter.ofPattern("EEE, d MMM yyyy");

    private final DateTimeFormatter sdfHour = DateTimeFormatter.ofPattern("HH:mm");

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

    @Transactional
    public void sendEmailForRemindSchedule(Gender gender, String nameOfUser, String email, String nameOfDepartureStation, String nameOfArrivalStation, LocalDateTime departureTime, LocalDateTime arrivalTime) throws MessagingException {
        String htmlContent = """
            <p style="font-size:16px;height:30px;font-weight:bold;margin:0">
                Dear %s %s:
              </p>
              <div style="font-size:14px;line-height:20px;margin-left:2em">
                <p style="margin:0;margin-top:8px">Warmest greetings to you,</p>
                <p style="margin:0;margin-top:8px">
                  We want to remind you about your upcoming journey from\s
                  <b>%s</b> to <b>%s</b>.
                </p>
                <div style="margin-top:1em;margin-bottom:2em;margin-left:2em;">
                  <table>
                    <tbody>
                      <tr>
                        <th style="text-align:left">Date</th>
                        <td><b>:</b> %s</td>
                      </tr>
                      <tr>
                        <th style="text-align: left">Schedule</th>
                        <td><b>:</b> %s - %s WIB</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p style="margin:0;margin-top:8px">
                  We wish you a comfortable and safe journey.
                </p>
              </div>
              <div style="text-align:end">Wheesh</div>
            """.formatted(
            gender == Gender.Male ? "Mr." : "Mrs.",
            nameOfUser,
            nameOfDepartureStation,
            nameOfArrivalStation,
            departureTime.format(sdfDate),
            departureTime.format(sdfHour),
            arrivalTime.format(sdfHour)
        );

        sendHtmlEmail(email, "Journey Reminder - Wheesh Dev Website", htmlContent);
    }
}
