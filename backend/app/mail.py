import os
import smtplib
from email.message import EmailMessage


def send_mail(to: str, subject: str, body: str):
    message = EmailMessage()
    message["From"] = "no-reply@example.com"
    message["To"] = to
    message["Subject"] = subject
    message.set_content(body)

    smtp_host = os.environ["SMTP_HOST"]
    smtp_port = int(os.environ["SMTP_PORT"])

    with smtplib.SMTP(smtp_host, smtp_port) as smtp:
        smtp.send_message(message)