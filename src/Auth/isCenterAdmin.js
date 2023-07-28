import centerAdminModel from "../Models/centerAdminModel.js";

export const isCenterAdmin = async (req, res, next) => {
  try {
    const centerAdmin = await centerAdminModel.findById(req.id);

    if (!centerAdmin) {
      return res.redirect("/api/center/login");
    }
    next();
  } catch (err) {
    console.log(err);
    return res.redirect("/api/center/login");
  }
};
