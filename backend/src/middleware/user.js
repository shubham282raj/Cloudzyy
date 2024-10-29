import User from "../models/user.js";

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      res.cookie("auth_token", "", {
        expires: new Date(0),
      });
      return res.status(404).send({ message: "Forced Logout: User Not Found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Something went wrong",
    });
  }
};
