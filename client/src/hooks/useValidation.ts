import { useState } from "react";
import type ValidationErrors from "../Typescript/ValidationErrors";

export default function usevalidation() {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateName = (name: string) => {
    const fullNameRegex = /^[A-Za-z]{2,}(?: [A-Za-z]{2,})+$/;

    if (!name.trim()) {
      return "Name is required";
    } else if (!fullNameRegex.test(name.trim())) {
      return "Please enter your full name (first and last name, letters only)";
    } else return "";
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email.trim()) {
      return " Email is required";
    } else if (!emailRegex.test(email.trim())) {
      return "Please enter a valid email address";
    } else {
      return "";
    }
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,20}$/;

    if (!password.trim()) {
      return "Password is required";
    } else if (!passwordRegex.test(password.trim())) {
      return "Password must be 8–20 characters and contain at least one uppercase letter, lowercase letter, digit, and special character";
    } else {
      return "";
    }
  };

  const validateConfirmPassword = (
    confirmpassword: string,
    password: string,
  ) => {
    if (!confirmpassword.trim()) {
      return "Please confirm your password";
    } else if (!(password.trim() === confirmpassword.trim())) {
      return "The password do not match";
    } else {
      return "";
    }
  };

  const setValidationErrors = (newErrors: ValidationErrors) => {
    setErrors(newErrors);
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateName,
    validateEmail,
    validateConfirmPassword,
    validatePassword,
    setValidationErrors,
    clearErrors,
  };
}
