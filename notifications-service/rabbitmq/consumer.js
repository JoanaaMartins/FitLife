import amqp from 'amqplib';

export const startConsumer = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertExchange('reservations.events', 'topic', {
    durable: true,
  });

  const q = await channel.assertQueue('notifications.queue', {
    durable: true,
  });

  await channel.bindQueue(q.queue, 'reservations.events', 'reservation.*');

  console.log('Waiting for reservation events...');

  channel.consume(q.queue, async (msg) => {
    if (!msg) return;

    const event = JSON.parse(msg.content.toString());

    switch (event.event) {
      case 'reservation.confirmed':
        console.log('Enviar notificação de confirmação', event.data);
        break;

      case 'reservation.cancelled':
        console.log('Enviar notificação de cancelamento', event.data);
        break;
    }

    channel.ack(msg);
  });
};
