import dotenv from "dotenv";
import { startConsumer } from "./rabbitmq/consumer.js";

dotenv.config();

const startNotificationsService = async () => {
  console.log("Starting notifications-service...");
  await startConsumer(); 
};

startNotificationsService();
