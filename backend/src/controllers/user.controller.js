const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create and save a new user
exports.create = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
      role: 'user' // Default role
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

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { 
      httpOnly: true, 
      // secure: process.env.NODE_ENV === 'production', 
      secure: true, 
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,  });

    const currentUser = {
      email: req.body.email,
      role: user.role
    }

    res.status(200).send(currentUser);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// User logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).send({ message: "Logout successful" });
};

// Middleware to check authentication
exports.authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send({ message: 'Invalid token.' });
  }
};

// Middleware to check roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log(req.user.role);
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).send({ message: 'Access denied.' });
    }
    next();
  };
};

// Update user role
exports.updateRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
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
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
