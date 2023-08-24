export const handleErrors= async(err, req, res, next)=>{
    if (err.code === 11000 && err.keyPattern) {
        const duplicateField = Object.keys(err.keyPattern)[0];
        const duplicateValue = err.keyValue[duplicateField];
    
        return res.status(400).json({
          message: `${duplicateField} '${duplicateValue}' is already in use. Please provide another value.`,
          status: 'fail',
        });
      }
      return res.status(500).send({message:"Internal server error. Something went wrong.", status:500})
}