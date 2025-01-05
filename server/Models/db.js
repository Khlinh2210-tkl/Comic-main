

    const mongoose=require("mongoose")
    mongoose.connect( "mongodb+srv://amislmv1304:1234@cluster0.3tyus.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(()=>{
        console.log("mongodb connected");
    })
    .catch(()=>{
        console.log('failed');
    })
    