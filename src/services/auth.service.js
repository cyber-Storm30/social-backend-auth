import UserModel from "../models/auth.model.js";
import bcrypt from "bcryptjs";

class AuthService {
  async login(email, userPassword) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error("User not registered");
      }
      const isPassword = await bcrypt.compare(userPassword, user.password);
      if (!isPassword) {
        throw new Error("Invalid email or password");
      }
      const { password, ...newUser } = user._doc;
      return newUser;
    } catch (err) {
      throw err;
    }
  }

  async signup(email, userPassword, username, image) {
    try {
      const user = await UserModel.findOne({ email });
      if (user) {
        throw new Error("User already registered");
      }
      const salt = await bcrypt.genSalt(15);
      const hashPassword = await bcrypt.hash(userPassword, salt);
      const newUser = new UserModel({
        email,
        password: hashPassword,
        username,
        image,
      });
      const savedUser = await newUser.save();
      const { password, ...otherUser } = savedUser._doc;
      return otherUser;
    } catch (err) {
      throw err;
    }
  }

  async getUserDetails(id) {
    try {
      const userDetails = await UserModel.findById(id);
      if (!userDetails) {
        throw new Error("User not found");
      }
      const { password, ...newUser } = userDetails._doc;
      return newUser;
    } catch (err) {
      throw err;
    }
  }

  async addUserIdForConnections(senderId, receiverId, status) {
    try {
      if (status === "PENDING") {
        const receiver = await UserModel.findOne({
          _id: receiverId,
        });
        const sender = await UserModel.findOne({
          _id: senderId,
        });

        if (!sender.req_sent_to.includes(receiverId)) {
          await sender.updateOne({
            $push: { req_sent_to: receiverId },
          });
        }
        if (!receiver.req_received_from.includes(senderId)) {
          await receiver.updateOne({
            $push: { req_received_from: senderId },
          });
        }
        return true;
      } else if (status === "ACCEPT") {
        const receiver = await UserModel.findOne({
          _id: receiverId,
        });
        const sender = await UserModel.findOne({
          _id: senderId,
        });

        if (!receiver.connections.includes(senderId)) {
          await receiver.updateOne({
            $push: { connections: senderId },
          });
        }
        if (!sender.connections.includes(receiverId)) {
          await sender.updateOne({
            $push: { connections: receiverId },
          });
        }
        if (sender.req_sent_to.includes(receiverId)) {
          await sender.updateOne({
            $pull: { req_sent_to: receiverId },
          });
        }
        if (receiver.req_received_from.includes(senderId)) {
          await receiver.updateOne({
            $pull: { req_received_from: senderId },
          });
        }
        return true;
      }
    } catch (err) {
      throw err;
    }
  }

  async getPeopleYouMayKnow(userId) {
    try {
      const user = await UserModel.findById(userId).select(
        "connections req_received_from"
      );
      const connectedUserIds = user.connections.map((connection) =>
        connection.toString()
      );
      const receivedRequestsIds = user.req_received_from.map((request) =>
        request.toString()
      );
      const users = await UserModel.find({
        _id: {
          $ne: userId,
          $nin: [...connectedUserIds, ...receivedRequestsIds],
        },
      });

      return users;
    } catch (err) {
      throw err;
    }
  }
}

export default new AuthService();
