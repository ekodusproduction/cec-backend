import superAdminModel from "../Models/superAdminModel.js";

export const isSuperAdmin = async (req, res, next) => {
  try {
    const superadmin = await superAdminModel.findById(req.id);
    if (!superadmin) {
      return res.redirect("/api/superadmin/login");
    }
    next();
  } catch (err) {
    console.log(err);
    return res.redirect("/api/superadmin/login");
  }
};
