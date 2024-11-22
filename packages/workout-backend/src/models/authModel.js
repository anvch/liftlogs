import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dynamoDB from "../config/dynamodb.js";

const TABLE_NAME = 'Users';

function generateAccessToken(username) {
  return jwt.sign(
    { username: username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

async function registerUser(req, res) {
  const { username, pwd } = req.body;

  if (!username || !pwd) {
    return res.status(400).send("Bad request: Invalid input data.");
  }

  try {
    const existingUser = await dynamoDB.get({
      TableName: TABLE_NAME,
      Key: { username }
    }).promise();

    if (existingUser.Item) {
      return res.status(409).send("Username already taken");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pwd, salt);
    const token = generateAccessToken(username);
    
    await dynamoDB.put({
      TableName: TABLE_NAME,
      Item: {
        username,
        hashedPassword
      }
    }).promise();

    res.status(201).send({ token });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send("Internal server error");
  }
}

async function loginUser(req, res) {
  const { username, pwd } = req.body;
  
  try {
    const result = await dynamoDB.get({
      TableName: TABLE_NAME,
      Key: { username }
    }).promise();

    const user = result.Item;
    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    const matched = await bcrypt.compare(pwd, user.hashedPassword);
    if (!matched) {
      return res.status(401).send("Unauthorized");
    }

    const token = generateAccessToken(username);
    res.status(200).send({ token });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send("Internal server error");
  }
}

function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    
    // Add user info to request
    req.user = { username: decoded.username };
    
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
}

export { registerUser, loginUser, authenticateUser };