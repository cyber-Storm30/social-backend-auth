import AuthService from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await AuthService.login(email, password);
      // const accessToken = jwt.sign(
      //   {
      //     email: user.email,
      //     id: user._id,
      //   },
      //   process.env.JWTSECRETKEY,
      //   { expiresIn: "10h" }
      // );
      if (user) {
        res.status(200).json({
          success: true,
          data: user,
          message: "Login Succesfull",
        });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async signup(req, res) {
    try {
      const { email, password, username, image } = req.body;
      const user = await AuthService.signup(email, password, username, image);
      // const accessToken = jwt.sign(
      //   {
      //     email: user.email,
      //     id: user._id,
      //   },
      //   process.env.JWTSECRETKEY,
      //   { expiresIn: "10h" }
      // );
      if (user) {
        res.status(200).json({
          success: true,
          data: user,
          message: "Signup Succesfull",
        });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  async getUserDetails(req, res) {
    const { id } = req.params;
    try {
      const userDetails = await AuthService.getUserDetails(id);
      res.status(200).json({
        success: true,
        data: userDetails,
        message: "User details fetched succesfully",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  async userAuth(req, res) {
    try {
      const userId = req.user.id;
      return res.status(200).json({
        message: "User Authenticated",
        userId,
        success: true,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong", errorMessage: error.message });
    }
  }

  async addUserIdForConnections(req, res) {
    try {
      const response = await AuthService.addUserIdForConnections(
        req.body.senderId,
        req.body.receiverId,
        req.body.status
      );
      if (response === true) {
        return res.status(200).json("Id Added");
      } else {
        return res.status(400).json("Something went wrong");
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
  async getPeopleYouMayKnow(req, res) {
    try {
      const response = await AuthService.getPeopleYouMayKnow(req.params.id);
      return res.status(200).json({
        message: "Users fetched succesfully",
        success: true,
        data: response,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default new AuthController();
