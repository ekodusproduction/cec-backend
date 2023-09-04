export const handleErrors= async(err, req, res, next)=>{
    if (err.code === 11000 && err.keyPattern) {
        const duplicateField = Object.keys(err.keyPattern)[0];
        const duplicateValue = err.keyValue[duplicateField];
    
        return res.status(400).json({
          message: `${duplicateField} '${duplicateValue}' is already in use. Please provide another value.`,
          status: 'fail',
        });
      }
      console.log(err.message)
      return res.status(500).send({message:"Internal server errors. Something went wrong.", err:err.message, status:500})
}