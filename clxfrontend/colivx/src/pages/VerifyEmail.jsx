import { sendEmailVerification } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


//VERIFICATION FUNCTION 

export default function VerifyEmail() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
  async function checkEmailVerification() {
    const user = auth.currentUser;

    // If no user, go back to login
    if (!user) {
      navigate("/");
      return;
    }

    // Refresh user data from Firebase
    await user.reload();

    // If email is verified, go to login
    if (user.emailVerified) {
      navigate("/");
    }
  }

  checkEmailVerification();
}, [navigate]);


  //RESEND EMAIL FUNCTION


  async function handleResendEmail() {
    try {
      setLoading(true);
      setMessage("");

      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setMessage("Verification email resent! Please check your inbox.");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }






  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">

        <h1 className="text-2xl font-bold text-blue-600 mb-4">
          Verify Your Email 📧
        </h1>

        <p className="text-gray-600 mb-6">
          We’ve sent a verification link to your email address.
          Please check your inbox and click the link to activate your account.
        </p>

        {message && (
          <p className="text-sm text-green-600 mb-4">
            {message}
          </p>
        )}

        <button
          onClick={handleResendEmail}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Sending..." : "Resend Verification Email"}
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-4 text-blue-600 font-semibold"
        >
          Go to Login
        </button>

      </div>
    </div>
  );
}





