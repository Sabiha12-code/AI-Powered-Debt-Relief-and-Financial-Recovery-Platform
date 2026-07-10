from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

# JWT Configuration
SECRET_KEY = "finrelief_secret_key"
ALGORITHM = "HS256"

# OPTIMIZATION: Extended from 60 to 120 minutes for secure evaluation sessions
ACCESS_TOKEN_EXPIRE_MINUTES = 120

# Swagger Authorization
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/user/login")

# Create JWT Token
def create_access_token(data: dict):
    to_encode = data.copy()
    
    # Calculate exact timestamp expiration
    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})
    
    token = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    return token

# Verify JWT Token
def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        email = payload.get("sub")
        
        if email is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid Token"
            )
        return email
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or Expired Token"
        )