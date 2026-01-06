import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const RETRY_DELAY = 5000;

export const startConsumer = async () => {
  while (true) {
    try {
      console.log("Connecting to RabbitMQ...");

      const connection = await amqp.connect(RABBITMQ_URL);
      const channel = await connection.createChannel();

      await channel.assertExchange("reservations.events", "topic", {
        durable: true,
      });

      const q = await channel.assertQueue("notifications.queue", {
        durable: true,
      });

      await channel.bindQueue(q.queue, "reservations.events", "reservation.*");

      console.log("Waiting for reservation events...");

      channel.consume(q.queue, (msg) => {
        if (!msg) return;

        const event = JSON.parse(msg.content.toString());

        switch (event.event) {
          case "reservation.confirmed":
            console.log("Enviar notificação de confirmação", event.data);
            break;

          case "reservation.cancelled":
            console.log("Enviar notificação de cancelamento", event.data);
            break;
        }

        channel.ack(msg);
      });

      break;

    } catch (error) {
      console.error("RabbitMQ indisponível, a tentar novamente em 5s...");
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
};
