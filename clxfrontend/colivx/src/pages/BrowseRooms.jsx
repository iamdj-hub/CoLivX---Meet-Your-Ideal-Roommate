import { useState } from "react";

export default function BrowseRooms() {

  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
        title: "",
        description: "",
        rent: "",
        city: "",
        image: null
      });

      const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "image") {
          setFormData({ ...formData, image: URL.createObjectURL(files[0]) });
        } else {
          setFormData({ ...formData, [name]: value });
        }
      };



      const handlePostRoom = () => {

            const newRoom = {
              title: formData.title,
              description: formData.description,
              rent: formData.rent,
              city: formData.city,
              image: formData.image,
            };

            setRooms([...rooms, newRoom]);

            setShowForm(false);

            setFormData({
              title: "",
              description: "",
              rent: "",
              city: "",
              image: null
            });
          };




  return (
    <div className="w-full">

        <div 
        className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">
        Browse Rooms
      </h2>

      <button
      onClick={() => setShowForm(true)}
      className="bg-blue-500 text-white px-4 py-2 rounded-full text-2xl font-bold"
      >
        +
      </button>

</div>
<div>


    {showForm && (

        <div
        className="bg-white shadow-md rounded-xl p-6 mb-6">
            <h3
            className="text-lg font-semibold mb-4">
                List a New Room
            </h3>
          
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Room Title"
              className="w-full border rounded-lg p-2 mb-3"
              />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the room..."
              className="w-full border rounded-lg p-2 mb-3"
              />
            

            <input
                type="number"
                name="rent"
                value={formData.rent}
                onChange={handleChange}
                placeholder="Monthly Rent"
                className="w-full border rounded-lg p-2 mb-3"
                />

           <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full border rounded-lg p-2 mb-3"
              />

            <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="mb-3"
                />
            

            <button
              onClick={handlePostRoom}
              className="bg-blue-500 text-white px-4 py-2 rounded-2xl"
              >
              Post Room
              </button>

            <button
                onClick={() => setShowForm(false)}
                className="bg-gray-300 px-4 py-2 rounded-2xl ml-2"
                >
                Cancel
                </button>
                        
            </div>


    )}


    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {rooms.map((room, index) => (

        <div key={index} className="bg-white p-4 rounded-xl shadow">

        <img
        src={room.image || "https://via.placeholder.com/400x250"}
        className="rounded-lg mb-3"
        />

        <h4 className="font-semibold">
        {room.title}
        </h4>

        <p className="text-sm text-gray-500">
        ₹{room.rent} / month • {room.city}
        </p>

        <p className="text-sm mt-2">
        {room.description}
        </p>

        </div>

        ))}

        </div>





      
    </div>
     
     

    </div>
  );
}