const express = require("express");
const bodyParser = require("body-parser");
const ldap = require("ldapjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(bodyParser.json());

const LDAP_URL = "ldap://ldap.forumsys.com:389";
const BASE_DN = "dc=example,dc=com";
const JWT_SECRET = "your_jwt_secret_key"; // change this to your own secret

// Function to authenticate user against LDAP
function ldapAuthenticate(username, password) {
  return new Promise((resolve, reject) => {
    const client = ldap.createClient({
      url: LDAP_URL,
    });

    // Search for user DN
    const userDN = `uid=${username},${BASE_DN}`;

    // Try binding as user to verify credentials
    client.bind(userDN, password, (err) => {
      if (err) {
        client.unbind();
        return reject("Invalid credentials or user not found");
      }

      // Success - authenticated
      client.unbind();
      return resolve({ username, dn: userDN });
    });
  });
}

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  try {
    const user = await ldapAuthenticate(username, password);

    // Create JWT token
    const token = jwt.sign({ username: user.username }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(401).json({ error: err });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
