const bcrypt=require("bcrypt");
const mongoose=require('mongoose');

const {Schema,model}=mongoose;
const salt = bcrypt.genSaltSync(10);

const UserSchema = new Schema({
   username : {type:String , required:true , minLength:6,unique:true},
   password : {type:String, required:true},
});

UserSchema.pre("save", async function (next) {
   const user = this;
   if (!user.isModified('password')) return next();
   try {
       const hashedPassword = await bcrypt.hash(user.password, salt);
       user.password = hashedPassword;
       next();
   } catch (err) {
       return next(err);
   }
});

const UserModel = model('User',UserSchema);
module.exports=UserModel;