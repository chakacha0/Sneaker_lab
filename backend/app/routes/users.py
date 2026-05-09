from fastapi import APIRouter, HTTPException
from app.repositories.users_repo import create_user, verify_email_by_code, get_user_by_email, authenticate_user
from app.utils.email_service import send_verification_email

router = APIRouter(prefix="/users")

@router.post("/register")
def register_user(data: dict):
    email = data.get("email")
    password = data.get("password")
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    phone_number = data.get("phone_number")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    try:
        user = create_user(email, password, first_name, last_name, phone_number)
        
        # Send verification code email
        code = user.get("verification_code")
        email_sent = False
        email_message = ""
        
        if code:
            email_sent, email_message = send_verification_email(email, code)
        
        # Form message based on email sending result
        if email_sent:
            if "Development mode" in email_message or "DEV MODE" in email_message:
                message = "Registration successful! Check the server console for the verification code."
            else:
                message = "Registration successful! Check your email - we've sent a verification code."
        else:
            message = f"Registration successful, but failed to send email: {email_message}. Check the server console."
        
        return {
            "message": message,
            "email_sent": email_sent,
            "email_message": email_message if not email_sent else None,
            "user": {
                "user_id": user.get("user_id"),
                "email": user.get("email"),
                "first_name": user.get("first_name"),
                "last_name": user.get("last_name"),
                "phone_number": user.get("phone_number"),
                "email_verified": user.get("email_verified", False)
            },
            "verification_code": code if ("Development mode" in email_message or "DEV MODE" in email_message) else None  # Only in development mode
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/verify-email")
def verify_email(data: dict):
    """
    Verifies user email by code
    """
    email = data.get("email")
    code = data.get("code")
    
    if not email or not code:
        raise HTTPException(status_code=400, detail="Email and verification code are required")
    
    # Check user
    user = get_user_by_email(email)
    
    if not user:
        raise HTTPException(status_code=404, detail="User with this email not found")
    
    if user.get("email_verified"):
        return {
            "message": "Email is already verified",
            "user": {
                "user_id": user.get("user_id"),
                "email": user.get("email"),
                "first_name": user.get("first_name"),
                "last_name": user.get("last_name"),
                "phone_number": user.get("phone_number"),
                "email_verified": True
            }
        }
    
    # Verify email by code
    verified_user = verify_email_by_code(email, code)
    
    if not verified_user:
        raise HTTPException(status_code=400, detail="Invalid verification code. Please check the code and try again.")
    
    return {
        "message": "Email successfully verified!",
        "user": {
            "user_id": verified_user.get("user_id"),
            "email": verified_user.get("email"),
            "first_name": verified_user.get("first_name"),
            "last_name": verified_user.get("last_name"),
            "phone_number": verified_user.get("phone_number"),
            "email_verified": verified_user.get("email_verified", True)
        }
    }

@router.post("/login")
def login(data: dict):
    """
    User authentication by email and password
    """
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    
    # Authenticate user
    user = authenticate_user(email, password)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not user.get("email_verified"):
        raise HTTPException(status_code=403, detail="Email not verified. Please verify your email before signing in.")
    
    return {
        "message": "Sign in successful",
        "user": {
            "user_id": user.get("user_id"),
            "email": user.get("email"),
            "first_name": user.get("first_name"),
            "last_name": user.get("last_name"),
            "phone_number": user.get("phone_number"),
            "role": user.get("role"),
            "email_verified": user.get("email_verified", True)
        }
    }


