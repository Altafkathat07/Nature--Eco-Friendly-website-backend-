import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js"
import { ApiError } from "../utils/apiErrorHandler.js";
import { uploadFile } from "../utils/cloudinaryFileUpload.js";
import { ApiResponse } from "../utils/apiResponse.js";


const generateAccessAndRefreshToken = asyncHandler( async (userId) =>{
    try {
        const user = await User.findById(userId);
        const accessToken = generateAccessToken();
        const refreshToken = generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating Access and Refresh Token.")
    }

})

const userRegister = asyncHandler( async (req, res) => {

    const {username, email, password, cpassword } = req.body;
    // console.log(req.body )

    if(
     [username, email, password, cpassword].some((field)=>field?.trim() === "")
    ){
       throw new ApiError(400, "Please fill the all required fields.")
    }

    if(password != cpassword){
        throw new ApiError(401, "Password of comfirm password does not match")
    }
    
    const existedUser = await User.findOne({email});

    if(existedUser){
        throw new ApiError(409, "User with this email already exists. Please choose a different email or login.")
    }  

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // console.log(req.files)
    // console.log(avatarLocalPath);

    if(!avatarLocalPath){
        throw new ApiError(450, "Image file is required")
    };

    const avatar = await uploadFile(avatarLocalPath)
    // console.log(avatar);

    if(!avatar){throw new ApiError(405, "Avatar file is required")};

    const user = await User.create({
        username: username.toLowerCase(),
        avatar : avatar.url,
        email,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // const createdUser = await user.findById(userId).select(
    //     "-password -refreshToken"
    // )

    if(!createdUser){
        throw new ApiError(500, "something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, "User Registered Successfully", createdUser )
    )

});

const userLogin = asyncHandler(async (req, res) =>{
   const {username, email, password} = req.body;
   if(!(username || email)){
    throw new ApiError(400, "Username or email is required");
   }

   const user =  User.findOne({
    $or : [{username, email}]
   });

   if(!user){
    throw new ApiError(404, "User does not exist")
   }

   const isPasswordValid = await user.isPasswordCorrect(password)
   if(!isPasswordValid){
    throw new ApiError(401, "password Invalid")
   }

   const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
   const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

   const option = {
    httpOnly: true,
    secure: true,
   }

   return res.status(200).cookie("accessToken", accessToken, option).cookie("refreshToken", refreshToken, option)
   .json(new ApiResponse(200, {
    user: loggedInUser,accessToken, refreshToken,

   },
   "User logged In Successfully",
 ))


})

const logOutUser = asyncHandler( async (req, res) =>{
    await User.findByIdAndUpdate(
        req.user._id, {
        $set: {
            refreshToken: undefined
        }
        
        },
        {
            new: true
        }
    )

    option = {
        httpOnly : true,
        secure: true,
    }

    return res.status(200).clearCookie("accessToken", option).clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "User Logged out Successfully"));

})

export {userRegister, userLogin, logOutUser} ;

