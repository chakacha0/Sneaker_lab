import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import random
from app.config import settings

def generate_verification_code() -> str:
    """Генерирует 6-значный код подтверждения"""
    return str(random.randint(100000, 999999))

def send_verification_email(email: str, code: str) -> tuple[bool, str]:
    """
    Отправляет письмо с кодом подтверждения email
    
    Args:
        email: Email адрес пользователя
        code: Код подтверждения (6 цифр)
        
    Returns:
        (success: bool, message: str) - результат отправки и сообщение
    """
    try:
        # Если настройки SMTP не заданы, просто возвращаем True (для разработки)
        if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
            print(f"\n{'='*60}")
            print(f"[DEV MODE] Email не настроен - код в консоли:")
            print(f"Email: {email}")
            print(f"Код подтверждения: {code}")
            print(f"{'='*60}\n")
            return (True, f"Режим разработки. Код в консоли сервера.")
        
        # Создаем сообщение
        msg = MIMEMultipart()
        msg['From'] = settings.EMAIL_FROM
        msg['To'] = email
        msg['Subject'] = "Код подтверждения регистрации в SneakerLab"
        
        # Текст письма
        body = f"""
        Здравствуйте!
        
        Спасибо за регистрацию в SneakerLab!
        
        Ваш код подтверждения: {code}
        
        Введите этот код на странице подтверждения для завершения регистрации.
        
        Код действителен в течение 10 минут.
        
        Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.
        
        С уважением,
        Команда SneakerLab
        """
        
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        # Отправляем письмо
        print(f"[EMAIL] Попытка отправить письмо на {email}...")
        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
        server.starttls()
        print(f"[EMAIL] Подключение к {settings.SMTP_HOST}:{settings.SMTP_PORT}...")
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        print(f"[EMAIL] Авторизация успешна")
        server.send_message(msg)
        server.quit()
        print(f"[EMAIL] Письмо успешно отправлено на {email}")
        return (True, "Письмо отправлено успешно")
    except smtplib.SMTPAuthenticationError as e:
        error_msg = f"Ошибка авторизации SMTP: {str(e)}. Проверьте SMTP_USER и SMTP_PASSWORD в .env"
        print(f"[EMAIL ERROR] {error_msg}")
        return (False, error_msg)
    except smtplib.SMTPException as e:
        error_msg = f"Ошибка SMTP: {str(e)}"
        print(f"[EMAIL ERROR] {error_msg}")
        return (False, error_msg)
    except Exception as e:
        error_msg = f"Ошибка при отправке email: {str(e)}"
        print(f"[EMAIL ERROR] {error_msg}")
        return (False, error_msg)

