import { useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "../services/api";
import Swal from "sweetalert2";

function VerifyEmailChange() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasVerified = useRef(false);

  useEffect(() => {
  if (hasVerified.current) return;

  hasVerified.current = true;

  verifyEmail();
}, []);

  const verifyEmail = async () => {
    console.log("verifyEmail called");
    try {
      const email = searchParams.get("email");

      const res = await api.get(
        `/users/verify-email-change/${token}?email=${email}`
      );

      Swal.fire({
        icon: "success",
        title: "Email Updated",
        text: res.data.message,
      });

      navigate("/settings");

    } catch (err) {

  console.log(err);

  console.log(err.response);

  console.log(err.response?.data);

  Swal.fire({
    icon: "error",
    title: "Verification Failed",
    text:
      err.response?.data?.message ||
      "Invalid or expired verification link.",
  });

  navigate("/settings");
}
  };

  return (
    <div className="min-h-screen  flex items-center justify-center">
      <h2 className="text-2xl font-bold">
        Verifying your email...
      </h2>
    </div>
  );
}

export default VerifyEmailChange;