
export const fileFilter1=(valdiation1=[])=>{
    return function(req,file,cb){
        
        if(!valdiation1.includes(file.mimetype)){
            console.log(file.mimetype);
            
            return cb(new Error("Error 404",{cause:{status:400}}),false)
        }
        return cb(null,true)
    }

}