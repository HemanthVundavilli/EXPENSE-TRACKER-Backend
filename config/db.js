const mongoose = require('mongoose');

const connectDb = async(uri) => {

    try{
        await mongoose.connect(uri, { useUnifiedTopology: true});
        console.log('MongoDb Connected');
    }

    catch(err){
        console.error(err.message)
        process.exit(1);
    }
};

module.exports = connectDb;