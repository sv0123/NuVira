import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";



//                                      SIGNUP CONTROLLER



export async function signup(req, res) {
  const {fullName, email, password} = req.body;

  try {
    if(!fullName || !email || !password) {
      return res.status(400).json({message: "All fields are required"});
    }
    if(password.length < 6) {
      return res.status(400).json({message: "Password must be at least 6 characters"});
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
    }
    
    const exixtingUser = await User.findOne({email: email.toLowerCase()});
    if(exixtingUser) {
      return res.status(400).json({message: "Email already exists please use different email."});
    }

    const idx = Math.floor(Math.random() * 100) + 1;     //1-100
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`
    
    
    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar,
    });


    
    
    //                                                CREATE USER IN STREAM CHAT




    try {
      await upsertStreamUser(
        {
          id: newUser._id.toString(),
          name: newUser.fullName,
          image: newUser.profilePic || "",
        });
      console.log(`Stream user created successfully for ${newUser.fullName}`);
    
    } catch (error) {
      console.log("Error creating stream user:", error);
    }
       



    
    const token = jwt.sign(
      { userId: newUser._id }, 
      process.env.JWT_SECRET_KEY, 
      { expiresIn: "7d" });
    
      
      //This cookie will be attached automatically by the browser in future requests, so the server can recognize the user.
    res.cookie("jwt",token,{                   
      maxAge: 7 * 24 * 60 * 60 * 1000,                         //7 days
      httpOnly: true,                                          //prevent XSS attack
      sameSite: "strict",                                      //prevent CSRF attack
      secure: process.env.NODE_ENV === "production"            //only send cookie over HTTPS in production, 
    })
    
    res.status(201).json({success: true, user: newUser});


  } catch (error) {
    console.error("Error in signup controller:", error);
    res.status(500).json({message: "Internal server error"});
  }
};



//                                      LOGIN CONTROLLER




export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid Email " });
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if(!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET_KEY, 
      { expiresIn: "7d" });
    
      
    //This cookie will be attached automatically by the browser in future requests, so the server can recognize the user.
    res.cookie("jwt",token,{                   
      maxAge: 7 * 24 * 60 * 60 * 1000,                         //7 days
      httpOnly: true,                                          //prevent XSS attack
      sameSite: "strict",                                      //prevent CSRF attack
      secure: process.env.NODE_ENV === "production"            //only send cookie over HTTPS in production, 
    })

    res.status(200).json({ success: true, user });

  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//                                        LOGOUT CONTROLLER



export function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logged out successfully" });
};



//                                                                ONBOARD



export async function onboard(req, res){
  try{
    const userId = req.user._id

    const {fullName, bio, nativeLanguage, learningLanguage, location} = req.body

    if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({
        message: "All fields are required.",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguaga && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, {
      ...req.body,
      isOnboarded: true
    }, {new: true})

    if(!updatedUser) return res.status(404).json({message: "User not found"});
    try{
    await upsertStreamUser({
      id: updatedUser._id.toString(),
      name: updatedUser.fullName,
      image: updatedUser.profilePic || "",
    })
    console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
  } catch(streamError){
    console.log("Error updatting stream user during onboarding: ", streamError.message);
  }


    res.status(200).json({success: true, user: updatedUser});
  }   catch(error) { 
    console.error("Onbboarding error", error);
    res.statu1s(500).json({message: "Internal server error."} );

  }

}
