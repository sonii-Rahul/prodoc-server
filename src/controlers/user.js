import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { User } from "../models/User.Model.js"


const registerUser = asyncHandler(async (req, res) => {
    const { username, password, Email,fullname } = req.body;

    // Check if required fields are provided
    if (!username || !password || !Email,!fullname) {
        throw new apiError("400", "All user fields are required");
    }
    // Check if the username or email is already registered
    const existingUser = await User.findOne({ $or: [{ username }, { Email }] });
    if (existingUser) {
        throw new apiError("409", "Username or email already exists");
    }

     // Create a new user
    const newUser = new User({
        username,
        password:password, // You should hash the password before saving it
        Email:Email,
        fullName:fullname
    });
    await newUser.save();

    // Set user in session (optional)
    req.session.user = {
        _id: newUser._id,
        username: newUser.username,
        Email: newUser.Email,
        // Add any other relevant user data to the session
    };

    // Respond with success message and user data
    return res.status(201).json(new apiResponse(201, {
        user: {
            _id: newUser._id,
            username: newUser.username,
            Email: newUser.Email,
            // Omit sensitive data such as passwords
        }
    }, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);

    if (!username || !password) {
        throw new apiError("400", "All user fields are required");
    }

    const checkuser = await User.findOne({ username });

    if (!checkuser) {
        throw new apiError("401", "User not found");
    }

    const isPasswordValid = await checkuser.isPasswordCorrect(password);

    if (!isPasswordValid) {
       
        return res.status(401).json({
            message: "incorrect password or username"
        });
        
    }

    // Set user in session
    const user=req.session.user = {
        _id: checkuser._id,
        username: checkuser.username,
        Email:checkuser.Email
        // Add any other relevant user data to the session
    };
    console.log(user);

    return res.status(200).json({
        user,
        message: "User logged in successfully"
    });
});


const logOutUser = asyncHandler(async (req, res) => {
    // Destroy the user's session
    const user = req.session.user;
    console.log(user)
    if(!user){
        throw new apiError("401", "unauthorised");
    }
    req.session.destroy(err => {
        if (err) {
            throw new apiError("500", "Unable to logout user");
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.status(200).json(new apiResponse(200, {}, "User logged out successfully"));
    });
});


const verifyLogin = async (req, res) => {
    try {
        const user = req.session.user;

        if (user) {
            return res.status(200).json({
                user,
                message: "User verified"
            });
        } else {
            return res.status(404).json({
                error: "Unauthorised access",
                message: "User not found in session"
            });
        }
    } catch (error) {
        // Handle errors
        console.error('An error occurred:', error);
        return res.status(500).json({
            error: "Internal Server Error",
            message: error.message // Optionally include error message
        });
    }
};




export { loginUser, logOutUser, verifyLogin ,registerUser};
