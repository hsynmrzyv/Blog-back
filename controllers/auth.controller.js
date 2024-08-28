import bcrypt from "bcryptjs";

// User model
import User from "../models/user.model.js";

// Utils
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

export const signIn = async (request, response) => {
  const { email, password } = request.body;

  // Check for empty values
  if (!email || !password) {
    return response
      .status(400)
      .json({ message: "Email and password are required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return response
        .status(401)
        .json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return response
        .status(401)
        .json({ message: "Invalid email or password" });
    }

    generateTokenAndSetCookie(user._id, response);

    // Send back the user info (excluding password) and the token
    response.status(200).json({
      user,
      message: "Sign in successful",
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Server error" });
  }
};

export const signUp = async (request, response) => {
  console.log(request.body);
  console.log(request.file);

  const { fullName, email, password, userName } = request.body;

  // Check for empty values
  if (!fullName || !email || !password || !userName) {
    return response.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if a user already exists with the provided email or userName
    const existingUser = await User.findOne({
      $or: [{ email }, { userName }],
    });
    if (existingUser) {
      return response
        .status(400)
        .json({ message: "User with this email or username already exists" });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      fullName,
      email,
      password,
      userName,
      password: hashedPassword,
      profilePic: request.file ? request.file.path : null,
    };

    // Create new user
    const createdUser = await User.create(newUser);

    // Generate JWT
    generateTokenAndSetCookie(createdUser._id, response);

    // Send back the user (excluding the password)
    response.status(201).json({
      user: createdUser,
      message: "User successfully created",
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Server error" });
  }
};

export const logout = (request, response) => {
  // Clear the JWT cookie
  response.cookie("jwt", "", {
    maxAge: 0,
  });

  response.status(200).json({ message: "Logged out successfully" });
};
