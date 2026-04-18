import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { auth } from "../firebase"; // adjust path if needed
import { useNavigate } from "react-router-dom";





export default function LoginPage() {
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:5000";


  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  //
 // const [emailOtp, setEmailOtp] = useState("");
  //const [mobileOtp, setMobileOtp] = useState("");
  const [registerStep, setRegisterStep] = useState(1);
  //const [otp, setOtp] = useState("");
  //const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);



    //loginreloadprevention
  
  function handleNextStep(e) {
    e.preventDefault();

    if(!validateEmail ()) return;

    setStep(2);
  }

    //login submit
  
  async function handleLoginSubmit(e) {
  e.preventDefault();
  if (!validatePassword()) return;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (!userCredential.user.emailVerified) {
      setError("Please verify your email before logging in.");
      return;
    }

    console.log("Login success:", userCredential.user);

    //  USER TO BACKEND (SYNC)
            await fetch(`${BASE_URL}/api/profile/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userCredential.user.email,
        }),
      });

    navigate("/dashboard");

  } catch (error) {
    setError(error.message);
  }
}

    //register submit
  
  function handleRegisterSubmit(e){
    e.preventDefault();
    if(!validateEmail() || !validatePassword ()) return;
    console.log("Register with:", {email, password});
  }

  //email validation

  function validateEmail() {
    if (!email) {
      setError("Email is required");
      return false;
    }
    setError("");
    return true;
  }
 
    //validate password
  
  function validatePassword() {
    if (!password) {
      setError("Password is required");
      return false;
    }
    setError("");
    return true;
  }

    //HANDLE REGISTRATION SUBMIT

  function handleRegisterDetailsSubmit(e) {
    e.preventDefault();

    if (!fullName || !email) {
      setError("All fields are required");
      return;
    }
    setError("");
   
    setRegisterStep(2);

  }



//FinalRegistrationSubmit

async function handleFinalRegisterSubmit(e) {
  e.preventDefault();

  if (!fullName || !email || !password) {
    setError("All fields are required");
    return;
  }

  try {
    setLoading(true);

    // Create user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

      await fetch(`${BASE_URL}/api/profile/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userCredential.user.email,
        }),
      });

    await updateProfile(userCredential.user, {
  displayName: fullName,
 });


    // Send email verification
    await sendEmailVerification(userCredential.user);

    // Show message
    navigate("/verify-email");


    // Optional: reset form and switch to login
    setMode("login");
    setStep(1);
    setRegisterStep(1);
    setFullName("");
    setEmail("");
    setMobile("");
    setPassword("");

  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
}











  return (
    <div className="flex h-screen w-full">


      
{/* LEFT SECTION */}
      <div 
 
      className="
      rounded-2xl
      bg-gradient-to-br from-blue-200 via-purple-100 to-pink-50
      flex-1 h-full flex flex-col items-center justify-center bg-linear-to-br from-white to-blue-50">
          <h1 className="text-5xl font-extrabold text-blue-600 mb-4">CoLivX</h1>
        <p className="text-gray-600 text-lg text-center max-w-md">
          Find roommates who truly match your vibe — safer, global, and smart.
        </p>
      </div>





{/* RIGHT SECTION */} 
      <div className="flex-1 flex flex-col justify-center items-center "> 
       

        <h2 className="text-2xl font-bold text-bold-600 mb-6 text-gray-500" >{mode === "login" ? "Login" : "Register"}
        </h2>






    <div>

      {mode === "login" && step === 1 && (
        <form
        onSubmit={handleNextStep} 
        className="w-80 flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-center text-blue-600">
            Welcome Back ✨
          </h2>
          <div className="flex flex-col">
            <label className="text-gray-700 text-smmb-1 text-left px-2 py-1">
              Email Address 
            </label>
            <input type="email"
           placeholder="Enter your email" 
           value={email} onChange={(e) => setEmail(e.target.value)}
           className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
           />
           
          {error && (
            <p className="text-red-500 text-sm text-left px-2 ">{error}</p>
          )}
          </div>

           <button 
            type="submit"
            onClick={() => console.log(email)}
            className="bg-blue-600 text-white font-semibold py-2 rounded-xl hover:bg-blue-700 transition">
              Continue
            </button>

        </form>
      )}


      {mode === "login" && step === 2 && (
        <form 
          className="w-80 flex flex-col gap-4"
          onSubmit= {handleLoginSubmit}
          >
            <h2 className="text-2xl font-bold text-center text-blue-600">
            Just one step behind ✨
          </h2>
          <div className="flex flex-col">
            <label className="text-gray-700 text-smmb-1 text-left px-2 py-1">
              Door Code
            </label>
            <input type="password"
           placeholder="Enter your password" 
           value={password} onChange={(e) => setPassword(e.target.value)}
           className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
           />
           
          {error && (
            <p className="text-red-500 text-sm text-left px-2 ">{error}</p>
          )}
          </div>

           <button 
            type="submit"
          
            
            className="bg-blue-600 text-white font-semibold py-2 rounded-xl hover:bg-blue-700 transition">
              Let's go!
            </button>

          </form>


      )}

</div>



{/*REGISTRATION */}


  <div>
      {mode === "register" && registerStep === 1 && (
  <form onSubmit={handleRegisterDetailsSubmit} className="w-80 flex flex-col gap-4">
    <h2 className="text-2xl font-bold text-center text-blue-600">
      Create Your Account 🚀
    </h2>

    <input
      type="text"
      placeholder="Full Name"
      value={fullName}
      onChange={(e) => setFullName(e.target.value)}
      className="px-4 py-2 border rounded-xl"
    />

    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="px-4 py-2 border rounded-xl"
    />

   

    {error && <p className="text-red-500 text-sm">{error}</p>}

    <button className="bg-blue-600 text-white py-2 rounded-xl">
      Get Started
    </button>
  </form>
)}




{/*
  {mode === "register" && registerStep === 2 && (
  <form onSubmit={handleEmailOtpSubmit} className="w-80 flex flex-col gap-4">
    <h2 className="text-xl font-bold text-center">Verify Email</h2>

    <input
      type="text"
      placeholder="Email OTP"
      value={emailOtp}
      onChange={(e) => setEmailOtp(e.target.value)}
      className="px-4 py-2 border rounded-xl"
    />

    {error && <p className="text-red-500 text-sm">{error}</p>}

    <button className="bg-blue-600 text-white py-2 rounded-xl">
      Verify Email
    </button>
  </form>
)}
*/}



{/*
  {mode === "register" && registerStep === 4 && (
  <form onSubmit={handleMobileOtpSubmit} className="w-80 flex flex-col gap-4">
    <h2 className="text-xl font-bold text-center">Verify Mobile</h2>

    <input
      type="text"
      placeholder="Mobile OTP"
      value={mobileOtp}
      onChange={(e) => setMobileOtp(e.target.value)}
      className="px-4 py-2 border rounded-xl"
    />

    {error && <p className="text-red-500 text-sm">{error}</p>}

    <button className="bg-blue-600 text-white py-2 rounded-xl">
      Verify Mobile
    </button>
  </form>
)} */}





  {mode === "register" && registerStep === 2 && (
  <form onSubmit={handleFinalRegisterSubmit} className="w-80 flex flex-col gap-4">
    <h2 className="text-xl font-bold text-center">Set Password</h2>

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="px-4 py-2 border rounded-xl"
    />

    {error && <p className="text-red-500 text-sm">{error}</p>}

    <button 
    className="bg-blue-600 text-white py-2 rounded-xl">
      Create Account
    </button>
  </form>
)}

</div>







    <p className="mt-6 text-sm text-gray-600">
      {mode === "login" ? (
        <>
        Don't have an account?{""}
        <span 
          className="text-blue-600 font-semibold cursor-pointer"
          onClick={() => setMode("register")}
          >
            Register
        </span>
        </>
      ): (

        <>
        Already have an account?{""}
        
        <span className="text-blue-600 font-semibold cursor-pointer"
          onClick= {() => setMode("login")}>
              Login
        </span>
        </>
      )}
    </p>
       
         </div>
      </div>
  );
}
