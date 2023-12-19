import { comparePasswords, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import JWT from "jsonwebtoken";

const registerController = async (req, res) => {
  try {
    // Getting the fields from the ui
    const { name, email, password, phone, address, answer, role } = req.body;

    console.log(req.body);

    // Finding the user
    const userExists = await userModel.findOne({ email });

    // Checking if the user exists
    if (userExists) {
      console.log("userExists");
      return res.status(200).send({
        success: false,
        message: "User is already registered",
      });
    }

    // Creating User
    // Hashing Password
    const hashedPassword = await hashPassword(password);

    const newUser = await new userModel({
      name,
      email,
      phone,
      address,
      answer,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "The user has beed registered successfully",
      newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "There was an error in registration",
      error,
    });
  }
};

// LOGIN

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.send({
        success: true,
        message: "User is not registered",
      });
    }

    const match = await comparePasswords(password, user.password);

    if (!match) {
      return res.send({
        message: "Email or password is incorrect",
      });
    }

    // Token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.send({
      success: true,
      message: "User Logged In",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

// Test Controller

export const testController = (req, res) => {
  try {
    res.send("Protected Route");
  } catch (error) {
    console.log(error);
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is required!" });
    }
    if (!answer) {
      res.status(400).send({ message: "Answer is required!" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New password is required!" });
    }

    // Checking if the email and the security passed

    const user = await userModel.findOne({ email, answer });

    if (!user) {
      res.status(404).send({
        success: false,
        message: "Wround email or password",
      });
    }

    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });

    res.status(200).send({
      success: true,
      message: "User password updated sucessfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

//update prfole
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Update profile",
      error,
    });
  }
};

//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Geting Orders",
      error,
    });
  }
};

//orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
    console.log(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};

export default registerController;
