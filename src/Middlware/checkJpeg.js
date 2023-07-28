export const checkJpgPng = async (req, res, next) => {
  try {
    if (req.files == null) {
      return res.status(400).send({ message: "please provide required files" });
    }
    for (let i = 0; i < req.files.length; i++) {
      if (
        req.files.mimetype.endsWith("jpeg") ||
        req.files.mimetype.endsWith("jpg") ||
        req.files.mimetype.endsWith("png")
      ) {
        continue;
      } else {
        return res
          .status(400)
          .send({ message: "please provide files in jpg/jpeg/png format" });
      }
    }
    next();
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};
