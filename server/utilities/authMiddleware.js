const jwt=require("jsonwebtoken");

const requireAuth=(req,res,next)=>{
    const token=req.headers.authorization;
        if(!token)
        {
           res.send("error");
        }
        jwt.verify(token,"XYZABC3366",(err)=>{
            if(err){
              console.log(err)
            }
            else{
                next();
            }
        }
        )
    
}
module.exports={requireAuth};