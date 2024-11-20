const mongoose=require('mongoose')

const connectDB= async()=>{

    try {
        const conn= await mongoose.connect(process.env.MONGO_DB)
console.log('database connected sucessfully '.cyan.underline.bold);

    } catch (error) {
        console.log('error connection to databse')
    }
}
module.exports=connectDB