from fastapi import APIRouter, HTTPException, status, Depends
from psycopg.errors import UniqueViolation
from schemas.user import UserCreate, UserLogin
from repositories.user import create_user, verify_email, find_user_by_email
from dependencies.auth import get_current_user
from mail import send_mail
from security import verify_password, create_access_token

router = APIRouter()

@router.post("/users", status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate):
    try:
        result = create_user(user)
    except UniqueViolation:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="このメールアドレスは既に登録されています"
        )

    verification_url = (
        f"http://localhost:8000/users/verify"
        f"?token={result['verification_token']}"
    )

    send_mail(
        to=result["email"],
        subject="メールアドレスの確認",
        body=f"以下のURLにアクセスしてください。\n\n{verification_url}"
    )

    return {
        "id": result["id"],
        "email": result["email"]
    }


@router.get("/users/verify")
def verify_user_email(token: str):
    if not verify_email(token):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="認証トークンが無効、または有効期限切れです"
        )

    return {
        "message": "メールアドレスの認証が完了しました"
    }


@router.post("/login")
def login(user: UserLogin):
    db_user = find_user_by_email(user.email)

    if db_user is None:
        raise HTTPException(
            status_code=401,
            detail="メールアドレスまたはパスワードが違います"
        )

    if not verify_password(
        user.password,
        db_user["password_hash"]
    ):
        raise HTTPException(
            status_code=401,
            detail="メールアドレスまたはパスワードが違います"
        )

    if db_user["email_verified_at"] is None:
        raise HTTPException(
            status_code=403,
            detail="メール認証が完了していません"
        )

    if not db_user["is_active"]:
        raise HTTPException(
            status_code=403,
            detail="アカウントが有効化されていません"
        )

    access_token = create_access_token(db_user["id"])

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/users/me")
def get_my_profile(current_user = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "email": current_user["email"]
    }