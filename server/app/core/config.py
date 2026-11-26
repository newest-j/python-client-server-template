from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "PythonAuth"
    database_url: str
    jwt_secret_key: str
    frontend_url: str = "http://localhost:5173"
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()