import express from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from 'body-parser';
import { config } from "./config/v1/config";
import CompanyController from "./controllers/v1/company.controller";
import UserController from "./controllers/v1/user.controller";
import { routeHandler } from "./middleware/v1/routeHandler";
import SiteSchemaController from "./controllers/v1/siteSchema.controller";


const app = express();

app.use(helmet());
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const companyController = new CompanyController();
const userController = new UserController();
const siteSchemaController = new SiteSchemaController();

app.use(routeHandler);

const prefix = "user_dashboard";
app.use('/user_dashboard/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'User Management Service is running' });
});

app.use('/user_dashboard/api/v1', companyController.getRouter());
app.use('/user_dashboard/api/v1', userController.getRouter());
app.use('/user_dashboard/api/v1', siteSchemaController.getRouter());

app.listen(config.port, () => {
  console.log(`user_dashboard listening on :${config.port}`);
});
