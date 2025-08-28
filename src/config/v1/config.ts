import * as dotenv from "dotenv";
dotenv.config();

const service_name = "user_dashboard_service";
const default_service_port = 4000;
const default_log_level = "info";

export const config = {
  port: Number(process.env.PORT ?? default_service_port),
  jwtSecret: process.env.JWT_SECRET || "change_me",
  postgrestUrl: process.env.POSTGREST_URL || "http://localhost:3001",
  logsTimeFormat: process.env.LOGS_TIME_FORMAT || 'YYYY-MM-DDTHH:mm:ssZ',
  logsFilenameDatePattern: process.env.LOGS_FILENAME_DATE_PATTERN || 'YYYY-MM-DD',
  logFileName: `/usr/src/app/logs/${service_name}_%DATE%.log`,
  logsMaxSizePerFile: process.env.LOGS_MAX_SIZE_PER_FILE || '30m',
  logsMaxFiles: process.env.LOGS_MAX_FILES || '14d',
  logLevel: process.env.LOG_LEVEL || default_log_level,
  inviteLinkFrontendUrl: process.env.INVITE_LINK_FRONTEND_URL || "http://localhost:3000",
};