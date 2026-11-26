import { useState, type ChangeEvent, type FormEvent } from "react";
import usevalidation from "../hooks/useValidation";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import type SignupData from "../Typescript/SignupData";
import { authuser } from "../services/authService";
import { toast } from "react-toastify";
import { signup } from "../store/AuthSlice";

function SignUpPage() {
  const [form, setform] = useState<SignupData>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    errors,
    validateName,
    validateEmail,
    validateConfirmPassword,
    validatePassword,
    setValidationErrors,
    clearErrors,
  } = usevalidation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      password_confirmation: validateConfirmPassword(
        form.password_confirmation,
        form.password,
      ),
    };

    setValidationErrors(newErrors);

    const isValid = Object.values(newErrors).every((error) => error === "");

    if (!isValid) {
      return;
    }
    try {
      const result = await authuser.register({
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });
      if (result) {
        dispatch(signup(result));
        toast.success("Registration complete");
        clearErrors();
        navigate("/login", { replace: true });
      }
    } catch (err: any) {
      console.error("creating user error:", err);
      toast.error(err.message);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-6 py-16 sm:px-8">
      {/* logo */}
      <div className="mb-10 flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-900 lg:hidden">
        <span className="grid size-8 place-items-center rounded-lg bg-emerald-500 text-sm font-bold text-white">
          J
        </span>
        JLTD
      </div>
      {/* body */}
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
        Start fresh
      </p>
      <h2 className="text-4xl font-semibold tracking-tight text-slate-950">
        Create your account
      </h2>
      <p className="mt-4 text-base leading-7 text-slate-500">
        Your next chapter can start with one small step.
      </p>

      <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-slate-700"
        >
          Full Name:
        </label>
        <input
          type="text"
          name="name"
          placeholder="Alex morgan"
          value={form.name}
          onChange={handleChange}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
        />
        {errors.name && <p className="text-sm text-rose-600">{errors.name}</p>}
        <label
          className="block text-sm font-semibold text-slate-700"
          htmlFor="signup-email"
        >
          Email address
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          required
        />
        {errors.email && (
          <p className="text-sm text-rose-600">{errors.email}</p>
        )}
        <label
          className="block text-sm font-semibold text-slate-700"
          htmlFor="signup-password"
        >
          Create a password
        </label>
        <input
          id="signup-password"
          name="password"
          type="password"
          placeholder="At least 8 characters"
          minLength={8}
          value={form.password}
          onChange={handleChange}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          required
        />
        {errors.password && (
          <p className="text-sm text-rose-600">{errors.password}</p>
        )}
        <label
          htmlFor="password_confirmation"
          className="block text-sm font-semibold text-slate-700"
        >
          Confirm Password
        </label>
        <input
          type="password"
          name="password_confirmation"
          placeholder="Matching password"
          value={form.password_confirmation}
          onChange={handleChange}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
        />
        {errors.password_confirmation && (
          <p className="text-sm text-rose-600">
            {errors.password_confirmation}
          </p>
        )}
        <button
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-slate-950 px-5 py-3.5 font-semibold text-white transition hover:bg-emerald-600"
          type="submit"
        >
          Create account <span aria-hidden="true">→</span>
        </button>

        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}

export default SignUpPage;
