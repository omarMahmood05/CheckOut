import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Server Successfully Connected to Database ${conn.connection.host}`
        .bgYellow.black
    );
  } catch (error) {
    console.log(error);
  }
};

export default dbConnection;
