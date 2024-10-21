import express from "express";
import colors from "colors";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec, { swaggerUiOptions } from "./config/swagger";
import router from "./router";
import db from "./config/db";

export async function connectDB() {
  try {
    await db.authenticate();
    db.sync();
    // console.log(
    //   colors.bgGreen.white("Connection has been established successfully.")
    // );
  } catch (error) {
    console.log(colors.bgRed.white("Error connecting to db"));
  }
}

connectDB();

const server = express();

//CORS

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (origin === process.env.FRONTEND_URL) {
      callback(null, true);
      console.log(origin);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
};


server.use(morgan("dev"));

server.use(cors(corsOptions));

server.use(express.json());

server.use("/api/products", router);

//Docs

server.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);

export default server;
