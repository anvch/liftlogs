import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dynamoDB from "../config/dynamodb.js";

const TABLE_NAME = "Users";

function generateAccessToken(username) {
  return jwt.sign({ username: username }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

async function registerUser(req, res) {
  const { username, pwd } = req.body;

  // Validate Input
  if (!username || !pwd) {
    return res.status(400).json({
      error: "Bad request",
      message: "Both 'username' and 'pwd' fields are required.",
    });
  }

  try {
    // Check if user already exists
    const existingUser = await dynamoDB
      .get({
        TableName: TABLE_NAME,
        Key: { username },
      })
      .promise();

    if (existingUser.Item) {
      return res.status(409).json({
        error: "Conflict",
        message: "Username is already taken. Please choose another.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pwd, salt);
    const token = generateAccessToken(username);

    // Save user to database
    await dynamoDB
      .put({
        TableName: TABLE_NAME,
        Item: {
          username,
          hashedPassword,
        },
      })
      .promise();

    res.status(201).json({
      message: "User registered successfully.",
      token,
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred during registration. Please try again later.",
    });
  }
}

async function loginUser(req, res) {
  const { username, pwd } = req.body;

  // Validate Input
  if (!username || !pwd) {
    return res.status(400).json({
      error: "Bad request",
      message: "Both 'username' and 'pwd' fields are required.",
    });
  }

  try {
    // Fetch user from database
    const result = await dynamoDB
      .get({
        TableName: TABLE_NAME,
        Key: { username },
      })
      .promise();

    const user = result.Item;
    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid username or password.",
      });
    }

    // Verify password
    const matched = await bcrypt.compare(pwd, user.hashedPassword);
    if (!matched) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid username or password.",
      });
    }

    // Generate token
    const token = generateAccessToken(username);
    res.status(200).json({
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred during login. Please try again later.",
    });
  }
}

function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized",
        message:
          "No token provided. Authorization header is missing or malformed.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    // Add user info to request
    req.user = { username: decoded.username };

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or expired token. Please log in again.",
    });
  }
}

export { registerUser, loginUser, authenticateUser };
