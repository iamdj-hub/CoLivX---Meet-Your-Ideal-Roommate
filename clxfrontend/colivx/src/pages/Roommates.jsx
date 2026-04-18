import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";


export default function Roommates() {

  const BASE_URL = "http://localhost:5000";

  const [myProfile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roommates, setRoommates] = useState([]);


 // SAME CITY USERS (PRIMARY MATCHES)
const sameCityUsers = roommates.filter(
  (person) =>
    myProfile &&
    person.email !== myProfile.email &&
    person.city?.toLowerCase() === myProfile.city?.toLowerCase()
);

//  OTHER CITY USERS (SECONDARY)
const otherCityUsers = roommates.filter(
  (person) =>
    myProfile &&
    person.email !== myProfile.email &&
    person.city?.toLowerCase() !== myProfile.city?.toLowerCase()
);


//  SORT SAME CITY USERS BY MATCH %
const rankedSameCity = [...sameCityUsers].sort(
  (a, b) => calculateMatch(myProfile, b) - calculateMatch(myProfile, a)
);

//  SORT OTHER CITY USERS
const rankedOtherCity = [...otherCityUsers].sort(
  (a, b) => calculateMatch(myProfile, b) - calculateMatch(myProfile, a)
);



  const navigate = useNavigate();
  




useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (!currentUser) {
          setLoading(false);
          return;
        }

        try {
          // fetch MY profile
          const myRes = await fetch(
            `${BASE_URL}/api/profile/me/${currentUser.email}`
          );
          const myData = await myRes.json();
          setMyProfile(myData);

          // fetch ALL users
          const res = await fetch(`${BASE_URL}/api/profile/all`);
          const data = await res.json();
          setRoommates(data);

        } catch (err) {
          console.error("Error:", err);
        }

        setLoading(false);
      });

      return () => unsubscribe();
    }, []);

   

            //algorithm
            function calculateMatch(me, other) {
              let score = 0;
              let total = 10;

              if (me.city === other.city) score= score + 4;
              if (Math.abs(me.budget - other.budget) <= 2000) score= score + 3;
              if (me.sleepSchedule === other.sleepSchedule) score++;
              if (me.smoking === other.smoking) score++;
              if (me.pets === other.pets) score++;

              return Math.round((score / total) * 100);
            }

       function getMatchLabel(percent) {
            if (percent >= 80) return "🔥 Perfect";
            if (percent >= 60) return "👍 Good";
            return "⚠️ Low";
          }

     function getMatchReasons(me, other) {
          const reasons = [];

          //  CITY
          if (me.city === other.city) {
            reasons.push("✔ Same city");
          } else {
            reasons.push("✖ Different city");
          }

          // BUDGET
          const budgetDiff = Math.abs(me.budget - other.budget);
          if (budgetDiff <= 1000) {
            reasons.push("✔ Budget very close");
          } else if (budgetDiff <= 3000) {
            reasons.push("✔ Budget somewhat close");
          } else {
            reasons.push("✖ Budget mismatch");
          }

          //  SLEEP
          if (me.sleepSchedule === other.sleepSchedule) {
            reasons.push("✔ Same sleep schedule");
          } else {
            reasons.push("✖ Different sleep schedule");
          }

          // SMOKING
          if (me.smoking === other.smoking) {
            reasons.push("✔ Same smoking preference");
          } else {
            reasons.push("✖ Smoking mismatch");
          }

          //  PETS
          if (me.pets === other.pets) {
            reasons.push("✔ Same pet preference");
          } else {
            reasons.push("✖ Pet preference mismatch");
          }

          return reasons;
        }


        if (loading) {
          return <div className="p-10">Loading roommates...</div>;
        }

        if (!myProfile) {
          return <div className="p-10">Please complete your profile first.</div>;
        }



  return (
    <div >

      <h1 className="text-2xl font-semibold mb-6">
        👥  Explore Available Roommates
      </h1>

      {!myProfile && (
        <p className="text-gray-600">
          Please complete your profile first.
        </p>

      )}
     {myProfile && (
        <div >

                          {/*Roommates card*/}

                          <div>

                  {/* 🏠 PRIMARY MATCHES */}
                  <h2 className="text-xl font-semibold mb-4">
                    🏠 Primary Matches
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {rankedSameCity.map((person) => (
                      <div
                        key={person._id}
                        onClick={() =>
                          navigate(`/user/${person.username}`, { state: person })
                        }
                        className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
                      >
                        <h2 className="font-semibold text-lg">{person.name}</h2>
                        <p className="text-blue-600">@{person.username}</p>

                        <div className="mt-3 space-y-2 items-center flex text-sm text-gray-700">
                            <p className=" px-1  items-center gap-2">
                              <span>📍</span> <span>{person.city}</span>
                            </p>
                            <p className=" px-1 items-center gap-2">
                              <span>💰</span> <span>₹{person.budget}</span>
                            </p>
                            <p className="px-1 items-center gap-2">
                              <span>🌙</span> <span>{person.sleepSchedule}</span>
                            </p>
                            <p className=" px-1 items-center gap-2">
                              <span>🧹</span> <span>{person.cleanliness}/5</span>
                            </p>
                            <p className=" px-1 items-center gap-2">
                              <span>🚬</span> <span>{person.smoking}</span>
                            </p>
                            <p className="px-1 items-center gap-2">
                              <span>🐶</span> <span>{person.pets}</span>
                            </p>
                          </div>

                        {/* MATCH BLOCK */}
                        {(() => {
                          const percent = calculateMatch(myProfile, person);
                          return (
                            <div className="group mt-3">
                              <p className="text-green-600 font-semibold">
                                🤝 {percent}% — {getMatchLabel(percent)}
                              </p>

                              <ul className="hidden group-hover:block mt-2 text-sm text-gray-600 space-y-1">
                                {getMatchReasons(myProfile, person).map((r, i) => (
                                  <li key={i}>{r}</li>
                                ))}
                              </ul>
                            </div>
                          );
                        })()}
                      </div>
                    ))}
                  </div>


                  {/* 🌍 OTHER MATCHES */}
                  <h2 className="text-xl font-semibold mt-10 mb-4">
                    🌍 Other Matches
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {rankedOtherCity.map((person) => (
                      <div
                        key={person._id}
                        onClick={() =>
                          navigate(`/user/${person.username}`, { state: person })
                        }
                        className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition opacity-80 cursor-pointer"
                      >
                        <h2 className="font-semibold text-lg">{person.name}</h2>
                        <p className="text-blue-600">@{person.username}</p>

                        <p className="mt-2 text-gray-600">📍 {person.city}</p>

                        <p className="mt-2 text-green-600 font-semibold">
                          🤝 {calculateMatch(myProfile, person)}%
                        </p>
                      </div>
                    ))}
                  </div>

</div>
               
      </div>

        )}

  
     </div>
  );}




