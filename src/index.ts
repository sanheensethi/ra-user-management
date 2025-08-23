import express from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from 'body-parser';
import { config } from "./config/v1/config";
import CompanyController from "./controllers/v1/company.controller";
import UserController from "./controllers/v1/user.controller";
import { routeHandler } from "./middleware/v1/routeHandler";


const app = express();

app.use(helmet());
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const companyController = new CompanyController();
const userController = new UserController();

app.use(routeHandler);

app.use('/user_management/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'User Management Service is running' });
});

app.use('/user_management/api/v1', companyController.getRouter());
app.use('/user_management/api/v1', userController.getRouter());

app.listen(config.port, () => {
  console.log(`user_management listening on :${config.port}`);
});
