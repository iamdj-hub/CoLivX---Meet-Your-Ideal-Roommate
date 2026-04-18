import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



export default function Profile() {

  const BASE_URL = "http://localhost:5000";

    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    const [username, setUserName] = useState("");

    //profile features

    const [city, setCity] = useState("");
    const [budget, setBudget] = useState("");
    const [sleepSchedule, setSleepSchedule] = useState("");
    const [cleanliness, setCleanliness] = useState("");
    const [smoking, setSmoking] = useState("");
    const [pets, setPets] = useState("");

   const navigate = useNavigate();





    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          setUser(currentUser);
          setLoading(false);

          if (currentUser) {
            // FETCHING USER PROFILE FROM BACKEND
            try {
              const res = await fetch(
                `${BASE_URL}/api/profile/me/${currentUser.email}`
              );
              const data = await res.json();

              if (data) {
                setUserName(data.username || generateUsername(currentUser.displayName, currentUser.uid));
                setCity(data.city || "");
                setBudget(data.budget || "");
                setSleepSchedule(data.sleepSchedule || "");
                setCleanliness(data.cleanliness || "");
                setSmoking(data.smoking || "");
                setPets(data.pets || "");
              }
            } catch (err) {
              console.error("Error fetching profile:", err);
            }
          }
        });

        return () => unsubscribe();
      }, []);

       if (loading) {
              return <div className="p-10">Checking session...</div>;
            }

            if (!user) {
              navigate("/");
              return null;
            }


  const handleSave = async() => {
    
        if (!city || !budget || !sleepSchedule || !cleanliness || !smoking || !pets )
          {
          alert("Please fill all fields");
          return;
        }

          const profileData = { 
                  username,
                  city,
                  budget,
                  sleepSchedule,
                  cleanliness,
                  smoking,
                  pets
                };

  


  await fetch(`${BASE_URL}/api/profile/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          ...profileData,
        }),
      });


        setIsEditing(false);
      }


      function generateUsername(name,uid)
      { 
        const base=name
        ? name.toLowerCase().replace(/\s+/g, "") : "user";

        const random= uid.slice(0,5);

        return `${base}_${random}`;

      }

    
          const fields = [city, budget, sleepSchedule, cleanliness, smoking, pets];
          const completed = fields.filter(Boolean).length;
          const percent = Math.round((completed / fields.length) * 100);





    return (
    
    <div>

      <div className="w-full min-h-screen bg-gray-100 p-10">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
       👤 Profile
      </h3>
      
      

    <div
    className="bg-gray-50 rounded-2xl p-6 shadow-sm w-full mx-auto max-w-5xl"
    >

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        <div>
          <div className="flex flex-col items-center mb-6 text-center">
         <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl">
            👤
          </div>
            <p className="mt-3 text-lg font-semibold text-gray-800">
              @{username}
        </p>
     </div>
      <div className="mb-4 border-b pb-4 " >
        <p
        className="text-sm text-gray-500"
        >Full Name</p>
        <p
        className="font-medium text-gray-800"
        >{user?.displayName || "Not provided"}</p>

      </div>
      <div>

      <div className="mb-4 border-b pb-4 " >
        <p
        className="text-sm text-gray-500"
        >Email</p>
        <p
        className="font-medium text-gray-800"
        >{user?.email}</p>
      </div>
        

        <div>
         <p className="text-sm text-gray-500">Email Status</p>
          <p className={`font-medium ${
           user?.emailVerified ? "text-green-600" : "text-red-600"
         }`}>
           {user?.emailVerified ? "Verified" : "Not Verified"}
        </p>
        </div>
          
          <div className="mb-4 border-b pb-4 " ></div>

          <div className="mt-6">
                <button
                  onClick={() => setIsEditing(true)}
                  disabled={isEditing}
                  className={` py-2 px-20 rounded-2xl font-semibold transition ${
                !isEditing ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"}`} >
                
                  Edit Profile
                </button>
              </div>

           <div className="mt-6">


            <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 bg-gray-200 px-11   py-2 rounded-2xl hover:bg-gray-300"
            >
            ← Back to Dashboard
            </button>
           </div>
              
         
        

        </div>

        </div>

     
         <div className="flex flex-col items-center mb-6 text-center">

          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Lifestyle Preferences
            </h3>

            <p className="text-sm text-gray-500 mb-4">
                Profile Completion: {percent}%
                </p>

            <div className="space-y-5">

              {/* CITY */}
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">
                          City
                        </label>

                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Enter your city"
                         disabled={!isEditing}
                          required
                          className=" disabled:bg-gray-100
                          w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>


                      {/* BUDGET */}
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">
                          Monthly Budget
                        </label>

                        <input
                          type="number"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          disabled={!isEditing}
                          required
                          placeholder="₹ Budget"
                          className="
                          disabled:bg-gray-100
                          w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>


                      {/* SLEEP SCHEDULE */}
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">
                          Sleep Schedule
                        </label>

                        <select
                          value={sleepSchedule}
                          onChange={(e) => setSleepSchedule(e.target.value)}
                          disabled={!isEditing}
                          required
                          className="
                          disabled:bg-gray-100
                          w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          <option value="">Select</option>
                          <option value="early">Early Bird</option>
                          <option value="late">Night Owl</option>
                        </select>
                      </div>


                      {/* CLEANLINESS */}
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">
                          Cleanliness Level (1-5)
                        </label>

                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={cleanliness}
                          onChange={(e) => setCleanliness(e.target.value)}
                          disabled={!isEditing}
                          required
                          className="
                          disabled:bg-gray-100
                          w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>


                      {/* SMOKING */}
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">
                          Smoking
                        </label>

                        <select
                          value={smoking}
                          onChange={(e) => setSmoking(e.target.value)}
                          disabled={!isEditing}
                          required
                          className="
                          disabled:bg-gray-100
                          w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          <option value="">Select</option>
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>


                      {/* PETS */}
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">
                          Pets
                        </label>

                        <select
                          value={pets}
                          onChange={(e) => setPets(e.target.value)}
                          disabled={!isEditing}
                          required
                          className="
                          disabled:bg-gray-100
                          w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          <option value="">Select</option>
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>

                <button 
                onClick={handleSave}
                disabled={!isEditing}
                className={`w-full py-2 rounded-2xl font-semibold transition ${
                isEditing ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"}`} >
                    Save Preferences

                </button>

            </div>

         </div>
    

</div>
</div>
</div>
</div>
    )
} 
