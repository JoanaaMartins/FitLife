import amqp from 'amqplib';

let channel;

export const connectRabbitMQ = async () => {
  const host = process.env.RABBITMQ_HOST || "fitlife-rabbitmq";
  const port = process.env.RABBITMQ_PORT || 5672;
  const RABBITMQ_URL = `amqp://${host}:${port}`;
  
  const connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();

  await channel.assertExchange('reservations.events', 'topic', {
    durable: true,
  });

  console.log('RabbitMQ connected (sessions-service)');
};

export const publishEvent = (routingKey, payload) => {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }

  const message = {
    event: routingKey,
    data: payload,
  };

  channel.publish(
    'reservations.events',
    routingKey,
    Buffer.from(JSON.stringify(message)),
    { persistent: true }
  );
};
