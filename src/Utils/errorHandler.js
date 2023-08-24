export const handleErrors= async(err, req, res, next)=>{
    if (err.code === 11000 && err.keyPattern.email === 1) {
        return res.status(400).send({
          message: `Email address '${err.keyValue.email}' is already in use. Please provide another value.`,
          status: 'fail',
        });
      }
    
}