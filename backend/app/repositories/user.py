from database import get_connection
from schemas.user import UserCreate
from security import hash_password, generate_verification_token
from datetime import datetime, timedelta, timezone
from psycopg.rows import dict_row
import hashlib

def create_user(user: UserCreate):
    hashed_password = hash_password(user.password)
    token, token_hash = generate_verification_token()
    expires_at = (
        datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(hours=1)
    )

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO users (email, password_hash)
                VALUES (%s, %s)
                RETURNING id
                """,
                (user.email, hashed_password)
            )

            user_id = cur.fetchone()[0]

            cur.execute(
                """
                INSERT INTO email_verification_tokens
                    (user_id, token_hash, expires_at)
                VALUES (%s, %s, %s)
                """,
                (user_id, token_hash, expires_at)
            )

    return {
        "id": user_id,
        "email": user.email,
        "verification_token": token
    }


def create_verification_token(user_id: int, token_hash: str):
    expires_at = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(hours=1)

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO email_verification_tokens
                    (user_id, token_hash, expires_at)
                VALUES (%s, %s, %s)
                """,
                (user_id, token_hash, expires_at)
            )


def verify_email(token: str) -> bool:
    token_hash = hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT user_id
                FROM email_verification_tokens
                WHERE token_hash = %s
                  AND expires_at > (NOW() AT TIME ZONE 'UTC')
                FOR UPDATE
                """,
                (token_hash,)
            )

            row = cur.fetchone()

            if row is None:
                return False

            user_id = row[0]

            cur.execute(
                """
                UPDATE users
                SET email_verified_at = (NOW() AT TIME ZONE 'UTC')
                WHERE id = %s
                """,
                (user_id,)
            )

            cur.execute(
                """
                DELETE FROM email_verification_tokens
                WHERE user_id = %s
                """,
                (user_id,)
            )

    return True


def find_user_by_email(email: str):
    with get_connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(
                """
                SELECT
                    id,
                    email,
                    password_hash,
                    email_verified_at,
                    is_active
                FROM users
                WHERE email = %s
                """,
                (email,)
            )

            return cur.fetchone()

def find_user_by_id(user_id: int):
    with get_connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(
                """
                SELECT
                    id,
                    email,
                    email_verified_at,
                    is_active
                FROM users
                WHERE id = %s
                """,
                (user_id,)
            )

            return cur.fetchone()
