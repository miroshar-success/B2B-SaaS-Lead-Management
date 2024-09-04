const User = require("../models/user.model");
const Lead = require("../models/lead.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Transaction = require("../models/transaction.model");

// Create and save a new user
exports.create = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
      role: "user", // Default role
    });

    const savedUser = await user.save();
    res.status(201).send(savedUser);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).send({ user });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// User logout
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).send({ message: "Logout successful" });
};

// Middleware to check authentication
exports.authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send({ message: "Invalid token." });
  }
};

// Middleware to check roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log(req.user.role);
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).send({ message: "Access denied." });
    }
    next();
  };
};

// Update user role
exports.updateRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    );
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Retrieve all users
exports.findAll = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Retrieve a single user by ID
exports.findOne = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update a user by ID
exports.update = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete a user by ID
exports.delete = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.validate = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    const loggedInUser = await User.findById(req.user.id).select("-password");
    res.status(200).send({
      token: token,
      user: loggedInUser,
    });
  } catch (err) {
    res.status(400).send({ message: "Invalid token." });
  }
};

// Function to access multiple emails
exports.accessEmails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { leadIds } = req.body; // Expecting an array of lead IDs

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const emails = [];
    let emailsAccessed = user.emailAccessed.map((id) => id.toString());
    let emailsToAccess = [];
    let totalCost = 0;

    // Iterate over each lead ID
    for (const leadId of leadIds) {
      const lead = await Lead.findById(leadId);

      if (!lead) {
        return res
          .status(404)
          .json({ message: `Lead not found for ID: ${leadId}` });
      }

      // If the email for this lead has already been accessed, return it without cost
      if (emailsAccessed.includes(leadId)) {
        emails.push({ leadId, email: lead.email.value });
      } else {
        if (user.emailCredit > 0) {
          emails.push({ leadId, email: lead.email.value });
          emailsToAccess.push(leadId);
          user.emailCredit -= 1;
          totalCost += 1;
        } else {
          return res.status(400).json({ message: "Not enough email credits" });
        }
      }
    }

    if (totalCost > 0) {
      const transaction = new Transaction({
        userId,
        type: "Email",
        meta: {
          leadIds: leadIds,
        },
        amount: totalCost,
        status: "Completed",
      });
      await transaction.save();
    }

    // Update accessed emails and save the user
    user.emailAccessed.push(...emailsToAccess);
    await user.save();

    res.json({ emails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Function to access multiple phones
exports.accessPhones = async (req, res) => {
  try {
    const userId = req.user.id;
    const { leadIds } = req.body; // Expecting an array of lead IDs

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const phones = [];
    let phonesAccessed = user.phoneAccessed.map((id) => id.toString());
    let phonesToAccess = [];
    let totalCost = 0;

    // Iterate over each lead ID
    for (const leadId of leadIds) {
      const lead = await Lead.findById(leadId);

      if (!lead) {
        return res
          .status(404)
          .json({ message: `Lead not found for ID: ${leadId}` });
      }

      // If the phone for this lead has already been accessed, return it without cost
      if (phonesAccessed.includes(leadId)) {
        phones.push({ leadId, phone: lead.phone.value });
      } else {
        if (user.phoneCredit > 0) {
          phones.push({ leadId, phone: lead.phone.value });
          phonesToAccess.push(leadId);
          user.phoneCredit -= 1;
          totalCost += 1;
        } else {
          return res.status(400).json({ message: "Not enough phone credits" });
        }
      }
    }

    if (totalCost > 0) {
      const transaction = new Transaction({
        userId,
        type: "Phone",
        meta: {
          leadIds: leadIds,
        },
        amount: totalCost,
        status: "Completed",
      });
      await transaction.save();
    }

    // Update accessed phones and save the user
    user.phoneAccessed.push(...phonesToAccess);
    await user.save();

    res.json({ phones });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
