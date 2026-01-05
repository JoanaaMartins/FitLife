import dotenv from "dotenv";
import { startConsumer } from "./rabbitmq/consumer.js";

dotenv.config();

const startNotificationsService = async () => {
  try {
    console.log("Starting notifications-service...");

    await startConsumer();

  } catch (error) {
    console.error("Failed to start notifications-service:", error);
    process.exit(1);
  }
};

startNotificationsService();
