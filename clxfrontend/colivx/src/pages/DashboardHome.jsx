import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import {useNavigate} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import Roommates from "./Roommates";
import BrowseRooms from "./BrowseRooms";
import { useLocation } from "react-router-dom";
import {Outlet} from "react-router-dom";





export default function DashboardHome() {

     const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

                const dashboardData = {
                profileStatus: "incomplete", // later from backend
                roomsListed: 0,
                roommatesMatched: 0,
                reviewsCount: 0,
                avgRating: 0,
                emailVerified: user?.emailVerified ?? false,
                };

                





                useEffect (() => {
                const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

                
                

                    if (currentUser) {
                    await currentUser.getIdToken(true);

                    await currentUser.reload();

                    setUser({...auth.currentUser});

                    }
                    else {
                        setUser(null);
                    }
                    });

                    return () => unsubscribe();

                }, []);




                const handleLogout = async () => {
                try{
                    await signOut(auth);
                    navigate("/", {replace: true});
                }
                catch (error) {
                    console.error("Logout failed:", error.message);
                }
                };








  return (
    <div>

      <div className="flex justify-center mb-4 ">
      <div className="bg-gray-50 p-10 rounded-2xl shadow-md 
      w-full max-w-lg 
      text-center">
        
        <h1 className="text-3xl font-bold text-blue-600 mb-3">
          Welcome to CoLivX 🏠
        </h1>

        <p className="text-sm text-gray-600 mt-2">
          Welcome, <span className="font-semibold">{user?.displayName}</span> 👋
        </p>



        <p className="text-sm text-gray-500 mt-1">
          Your co-living journey starts here
        </p>
      </div>
      </div>



    <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Dashboard Overview
        </h3>

 

    {/* OVERVIEW CARDS */}

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10" >

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h4 className="text-sm text-gray-500 mb-1">
          Profile Status
        </h4>

      <p className="text-l font-semibold text-gray-800">
        Incomplete
      </p>
       <p className="text-xs text-gray-400 mt-1">
        Complete your profile to get better matches
      </p>

      <button 
      className="bg-blue-500 text-white font-semibold m-3
         py-1 px-5 rounded-xl hover:bg-blue-800 transition"
      onClick={() => navigate("/dashboard/profile")}
      >
        Update Profile
      </button>


      
      </div>




    <div className="bg-white rounded-xl shadow-sm p-5">
        <h4 className="text-sm text-gray-500 mb-2">
            Rooms Activity
        </h4>

        <p className="text-l font-semibold text-gray-800">
           0 Rooms Listed
          </p>

          <p className="text-xs text-gray-400 mt-1">
              List a room to reach potential roommates
            </p>

       <button 
        className="bg-blue-500 text-white font-semibold m-3
          py-1 px-9 rounded-xl hover:bg-blue-800 transition"
       onClick={() => navigate("/dashboard/browse")}
        >
         List Rooms
        </button>
          </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h4 className="text-sm text-gray-500 mb-2">
            Account Status
        </h4>

        <p
       className={`text-l font-semibold ${
          dashboardData.emailVerified ? "text-green-600" : "text-red-500"
            }`}
            >
         {dashboardData.emailVerified ? "Verified" : "Not Verified"}
        </p>

          <p className="text-xs text-gray-400 mt-1">
              Your email is verified
            </p>
          </div>

        
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h4 className="text-sm text-gray-500 mb-2">
           Roommates Seeked
        </h4>

        <p className="text-l font-semibold text-gray-800">
          0 Roommates matched
          </p>

          <p className="text-xs text-gray-400 mt-1">
              Your matching history
            </p>

             <button 
        className="bg-blue-500 text-white font-semibold m-3
          py-1 px-4 rounded-xl hover:bg-blue-800 transition"
       onClick={() => navigate("/dashboard/roommates")}
        >
         Seek Roommates
        </button>
          </div>
          </div>

      
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h4 className="text-sm text-gray-500 mb-2">
            Reviews & Ratings
        </h4>

        <p className="text-l font-semibold text-gray-800">
          0 Reviews Published
          </p>
          <p className="text-s  text-gray-700">
          Average Rating : 0.0
          </p>

          <p className="text-xs text-gray-400 mt-1">
              Your feedback matters in improving our services
            </p>
          </div>







    </div>
  );
}