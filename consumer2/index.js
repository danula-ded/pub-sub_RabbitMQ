const amqp = require('amqplib');
const { Client } = require('pg');

const EXCHANGE_NAME = 'messages_exchange';
const QUEUE_NAME = 'messages_queue';

const pgClient = new Client({
    user: 'postgres',
    host: 'postgres', // имя контейнера PostgreSQL
    database: 'messages_db',
    password: 'postgres',
    port: 5432,
});

pgClient.connect()
    .then(() => console.log('🛢️  Подключение к PostgreSQL установлено'))
    .catch(err => console.error('❌ Ошибка подключения к PostgreSQL:', err));

const consumeMessages = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:guest@rabbitmq');
        const channel = await connection.createChannel();

        await channel.assertQueue(QUEUE_NAME, { durable: false });
        channel.consume(QUEUE_NAME, async (msg) => {
            if (msg !== null) {
                const messageText = msg.content.toString();
                console.log(`📥 Получено: ${messageText}`);

                try {
                    await pgClient.query('INSERT INTO message2 (content) VALUES ($1)', [messageText]);
                    console.log('✅ Сообщение сохранено в PostgreSQL');
                } catch (err) {
                    console.error('❌ Ошибка записи в PostgreSQL:', err);
                }

                channel.ack(msg);
            }
        });

        console.log('🎧 Ожидание сообщений...');
    } catch (error) {
        console.error('❌ Ошибка:', error);
    }
};

consumeMessages();
