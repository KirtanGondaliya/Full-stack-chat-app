import { useState } from "react";
// import { useAuthStore } from "../store/useAuthStore";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Lock } from "lucide-react";
import { Mail } from "lucide-react";
import { MessageSquare } from "lucide-react";
import { User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import { useSingUpUserMutation } from "../features/api/authApi";
import AuthImagePattern from "../components/AuthImagePattern";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../features/slice/authSlice";
import { connectSocket } from "../lib/socket";

const SignUpPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [signUpUser, { isLoading }] = useSingUpUserMutation({});
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    fullName: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full Name is required"),

    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net)$/,
        "Email must end with .com or .net"
      )
      .required("Email is required"),

    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await signUpUser(values).unwrap();
      dispatch(setAuthUser(response.user));
      connectSocket(response.user.id);
    } catch (err) {
      dispatch(isSigningUp(false));
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare
                  className="h-6 w-6 text-primary"
                  strokeWidth={2.5}
                />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                Get started with your free account
              </p>
            </div>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleSubmit }) => (
              <Form className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      className="input input-bordered w-full pl-4"
                      placeholder="John Doe"
                      value={values.fullName}
                      onChange={handleChange}
                    />
                    {errors.fullName && touched.fullName && (
                      <div className="text-error text-sm mt-1">
                        {errors.fullName}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      className="input input-bordered w-full pl-4"
                      placeholder="you@example.com"
                      value={values.email}
                      onChange={handleChange}
                    />
                    {errors.email && touched.email && (
                      <div className="text-error text-sm mt-1">
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="input input-bordered w-full pl-4"
                      placeholder="••••••••"
                      value={values.password}
                      onChange={handleChange}
                    />
                    {errors.password && touched.password && (
                      <div className="text-error text-sm mt-1">
                        {errors.password}
                      </div>
                    )}
                    <div
                      className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </Form>
            )}
          </Formik>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}

      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default SignUpPage;
