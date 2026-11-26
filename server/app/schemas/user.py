from pydantic import BaseModel, EmailStr, ConfigDict, Field, model_validator

class UserCreate(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=100
    )
    email: EmailStr

    password:str = Field(
        min_length=8
    )
    password_confirmation:str = Field(
        min_length=8
    )
    @model_validator(mode='after')
    def passwords_match(self):
        if self.password != self.password_confirmation:
            raise ValueError("Passwords do not match")
        return self

class UserResponse(BaseModel):
    id:int
    name:str
    email:EmailStr

    model_config = ConfigDict(from_attributes= True)

    