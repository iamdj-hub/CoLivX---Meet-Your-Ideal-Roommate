import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
export default function UserProfile() {

const { state } = useLocation();
const { username } = useParams();
const navigate = useNavigate();
const BASE_URL = "https://colivx-meet-your-ideal-roommate.onrender.com";

const [user, setUser] = useState(state || null);
const [loading, setLoading] = useState(!state);

useEffect(() => {
    if (!state) {
        const fetchUser = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/profile/all`);
            const data = await res.json();

            const found = data.find((u) => u.username === username);

            setUser(found);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
        };

        fetchUser();
    }
    }, [state, username]);


    

if (loading) {
  return <div className="p-10">Loading user...</div>;
}

if (!user) {
  return <div className="p-10">User not found</div>;
}

return (

    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-100 to-pink-50 p-10">

<h2 className="text-xl font-semibold text-gray-700 mb-6">
👤 User Profile
</h2>

<div className="bg-white rounded-2xl shadow-md p-8 max-w-4xl mx-auto">

<div className="grid grid-cols-1 md:grid-cols-2 gap-10">

{/* LEFT SIDE */}

<div className="flex flex-col items-center text-center">

<div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-4xl mx-auto">
👤
</div>

<h2 className="text-xl font-bold mt-3">
{user.name}
</h2>

<p className="text-blue-600">
@{user.username}
</p>

<div className="mt-6 space-y-2 text-left text-gray-700">

<p> 📍 Location: {user.city}</p>
<p>💰  Budget: ₹{user.budget}</p>

</div>

                <button
            onClick={() => navigate(-1)}
            className="mt-6 bg-gray-200 px-6 py-2 rounded-xl hover:bg-gray-300"
            >
            ← Back
            </button>

</div>


{/* RIGHT SIDE */}

<div className="text-left">

<h3 className="text-lg font-semibold mb-6">
Lifestyle Preferences
</h3>

<div className="space-y-4 text-gray-700">

<p>🌙 Sleep Schedule: {user.sleepSchedule}</p>
<p>🧹 Cleanliness: {user.cleanliness}/5</p>
<p>🚬 Smoking: {user.smoking}</p>
<p>🐶 Pets: {user.pets}</p>

</div>

<div className="mt-8 flex gap-3">

<button className="bg-blue-500 text-white px-5 py-2 rounded-xl hover:bg-blue-600">
📩 Contact
</button>

<button className="bg-pink-500 text-white px-5 py-2 rounded-xl hover:bg-pink-600">
❤️ Save
</button>

</div>

</div>

</div>

</div>

</div>

);


                




            }