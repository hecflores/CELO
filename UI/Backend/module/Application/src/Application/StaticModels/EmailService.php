<?php
/**
 * Created by PhpStorm.
 * User: Hector
 * Date: 2/23/2017
 * Time: 4:09 PM
 */

namespace Application;


use PHPMailer;
use Zend\Mail\Message;
use Zend\Mail\Transport\Sendmail;
use Zend\Mail\Transport\Smtp as SmtpTransport;
use Zend\Mail\Transport\SmtpOptions;

class EmailService
{
    public static function SendEmail($email, $subject, $body)
    {
        echo '<pre>';
        $mail = new PHPMailer;

        //$mail->SMTPDebug = 3;                               // Enable verbose debug output
        $mail->isSMTP();                                      // Set mailer to use SMTP
        $mail->Host = 'smtp.gmail.com';                       // Specify main and backup SMTP servers
        $mail->SMTPAuth = true;                               // Enable SMTP authentication
        $mail->Username = 'hectorsoftwarecorp@gmail.com';                 // SMTP username
        $mail->Password = 'Armandorocha1-';                           // SMTP password
        $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
        $mail->Port = 465;                                    // TCP port to connect to
        $mail->SMTPOptions=array('ssl'=>
        array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => false
        ));

        $mail->setFrom('updates@celo.com', 'CELO Updates');

        //$mail->addAddress($to);               // Name is optional

        $mail->addReplyTo('hectorsoftwarecorp@gmail.com', 'HectorSoftware Corp');

        //$mail->addCC('cc@example.com');
        $mail->addBCC($email);
        //foreach($tos as $to){
        //    $mail->addBCC($to);
        //}
        //$mail->addBCC('bcc@example.com');

        //$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
        //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
        $mail->isHTML(true);                                  // Set email format to HTML

        $mail->Subject = $subject;
        $mail->Body    = $body;
        $mail->AltBody=$body;
        //$mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

        if(!$mail->send()) {
            echo 'Message could not be sent.';
            echo 'Mailer Error: ' . $mail->ErrorInfo.'';
        } else {
            echo 'Message has been sent';
        }
        echo '</pre>';


    }
}