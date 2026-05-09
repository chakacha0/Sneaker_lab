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
        # If SMTP settings are not configured, return True (for development)
        if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
            print(f"\n{'='*60}")
            print(f"[DEV MODE] Email not configured - code in console:")
            print(f"Email: {email}")
            print(f"Verification Code: {code}")
            print(f"{'='*60}\n")
            return (True, f"Development mode. Code in server console.")
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = settings.EMAIL_FROM
        msg['To'] = email
        msg['Subject'] = "SneakerLab Registration Verification Code"
        
        # Email body
        body = f"""
        Hello!
        
        Thank you for registering with SneakerLab!
        
        Your verification code: {code}
        
        Enter this code on the verification page to complete your registration.
        
        The code is valid for 10 minutes.
        
        If you did not register on our website, please ignore this email.
        
        Best regards,
        SneakerLab Team
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
        print(f"[EMAIL] Email successfully sent to {email}")
        return (True, "Email sent successfully")
    except smtplib.SMTPAuthenticationError as e:
        error_msg = f"SMTP authentication error: {str(e)}. Check SMTP_USER and SMTP_PASSWORD in .env"
        print(f"[EMAIL ERROR] {error_msg}")
        return (False, error_msg)
    except smtplib.SMTPException as e:
        error_msg = f"SMTP error: {str(e)}"
        print(f"[EMAIL ERROR] {error_msg}")
        return (False, error_msg)
    except Exception as e:
        error_msg = f"Error sending email: {str(e)}"
        print(f"[EMAIL ERROR] {error_msg}")
        return (False, error_msg)

def send_order_confirmation_email(email: str, order_id: int, total_price: float, order_items: list, address: dict, user_name: str = None) -> tuple[bool, str]:
    """
    Отправляет письмо с подтверждением заказа
    
    Args:
        email: Email адрес пользователя
        order_id: ID заказа
        total_price: Итоговая стоимость заказа
        order_items: Список товаров в заказе
        address: Информация об адресе доставки
        user_name: Имя пользователя (опционально)
        
    Returns:
        (success: bool, message: str) - результат отправки и сообщение
    """
    try:
        # If SMTP settings are not configured, return True (for development)
        if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
            print(f"\n{'='*60}")
            print(f"[DEV MODE] Email not configured - order information in console:")
            print(f"Email: {email}")
            print(f"Order number: #{order_id}")
            print(f"Order total: {total_price:.2f} $")
            print(f"Delivery address: {address.get('country', '')}, {address.get('city', '')}, {address.get('street', '')}, {address.get('house', '')}")
            print(f"Items in order:")
            for item in order_items:
                print(f"  - {item.get('name', '')} (Size: {item.get('size', '')}, Quantity: {item.get('quantity', '')}, Price: {item.get('price_at_purchase', 0)} $)")
            print(f"{'='*60}\n")
            return (True, f"Development mode. Order information in server console.")
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = settings.EMAIL_FROM
        msg['To'] = email
        msg['Subject'] = f"Order Confirmation #{order_id} - SneakerLab"
        
        # Формируем адрес доставки
        address_parts = [
            address.get('country', ''),
            address.get('city', ''),
            address.get('street', ''),
            address.get('house', '')
        ]
        if address.get('apartment'):
            address_parts.append(f"apt. {address.get('apartment')}")
        if address.get('postal_code'):
            address_parts.append(f"postal code: {address.get('postal_code')}")
        delivery_address = ", ".join(filter(None, address_parts))
        
        # Формируем список товаров
        items_text = ""
        for item in order_items:
            item_name = item.get('name', 'Item')
            item_size = item.get('size', '')
            item_quantity = item.get('quantity', 1)
            item_price = item.get('price_at_purchase', 0)
            items_text += f"\n  • {item_name} (Size: {item_size}, Quantity: {item_quantity}) - {item_price:.2f} $"
        
        # Обращение к пользователю
        greeting = f"Hello, {user_name}!" if user_name else "Hello!"
        
        # Текст письма
        body = f"""
{greeting}

Thank you for your order at SneakerLab!

Your order number: #{order_id}
Order total: {total_price:.2f} $

Items in your order:
{items_text}

Delivery address:
{delivery_address}

Your order has been received and is being processed. We will contact you to confirm and clarify delivery details.

Please expect delivery within 3-5 business days.

You can track your order status in your personal account on our website.

If you have any questions, please contact our support team.

Best regards,
SneakerLab Team
        """
        
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        # Send email
        print(f"[EMAIL] Attempting to send order confirmation email to {email}...")
        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
        server.starttls()
        print(f"[EMAIL] Connecting to {settings.SMTP_HOST}:{settings.SMTP_PORT}...")
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        print(f"[EMAIL] Authentication successful")
        server.send_message(msg)
        server.quit()
        print(f"[EMAIL] Order confirmation email successfully sent to {email}")
        return (True, "Email sent successfully")
    except smtplib.SMTPAuthenticationError as e:
        error_msg = f"SMTP authentication error: {str(e)}. Check SMTP_USER and SMTP_PASSWORD in .env"
        print(f"[EMAIL ERROR] {error_msg}")
        return (False, error_msg)
    except smtplib.SMTPException as e:
        error_msg = f"SMTP error: {str(e)}"
        print(f"[EMAIL ERROR] {error_msg}")
        return (False, error_msg)
    except Exception as e:
        error_msg = f"Error sending email: {str(e)}"
        print(f"[EMAIL ERROR] {error_msg}")
        return (False, error_msg)

