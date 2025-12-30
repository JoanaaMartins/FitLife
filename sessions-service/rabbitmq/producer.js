import amqp from 'amqplib';

let channel;

export const connectRabbitMQ = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();

  await channel.assertExchange('reservations.events', 'topic', {
    durable: true,
  });

  console.log('✅ RabbitMQ connected (sessions-service)');
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
