import express from "express";
import Profile from "../models/Profile.js";

const router = express.Router();

router.post("/sync", async (req, res)=> {

        try{
            const {email} = req.body;
            let user= await Profile.findOne({email});
            
            if(!user) {

                user= new Profile({email});
                await user.save();
            }

            res.json(user);
        }
        catch(err){

            res.status(500).json({error: err.message});
        }
        });
    
//  LOGGED-IN USER
router.get("/me/:email", async (req, res) => {
  try {
    const user = await Profile.findOne({ email: req.params.email });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE PROFILE
router.post("/update", async (req, res) => {
  try {
    const {
      email,
      username,
      city,
      budget,
      sleepSchedule,
      cleanliness,
      smoking,
      pets,
    } = req.body;

    const updatedUser = await Profile.findOneAndUpdate(
      { email },
      {
        username,
        city,
        budget,
        sleepSchedule,
        cleanliness,
        smoking,
        pets,
      },
      { new: true } // return updated data
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL USERS (for roommate discovery)
  router.get("/all", async (req, res) => {
      try {
        const users = await Profile.find();

        res.json(users);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });


 export default router;