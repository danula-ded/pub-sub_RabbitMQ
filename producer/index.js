const fs = require('fs');
const amqp = require('amqplib');

const EXCHANGE_NAME = 'messages_exchange';
const QUEUE_NAME = 'messages_queue';

const sendMessages = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:guest@rabbitmq');
        const channel = await connection.createChannel();

        await channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: false });
        await channel.assertQueue(QUEUE_NAME, { durable: false });
        await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, '');

        const filePath = '/app/input.txt';

        let fileStream;
        if (!fs.existsSync(filePath)) {
            console.error('⚠️  input.txt не найден! Используем дефолтное сообщение.');
            channel.publish(EXCHANGE_NAME, '', Buffer.from('Default message'));
            console.log('📤 Отправлено: Default message');
        } else {
            fileStream = fs.createReadStream(filePath);
            fileStream.on('data', (chunk) => {
                const messages = chunk.toString().split('\n');
                messages.forEach((msg) => {
                    if (msg.trim()) {
                        channel.publish(EXCHANGE_NAME, '', Buffer.from(msg));
                        console.log(`📤 Отправлено: ${msg}`);
                    }
                });
            });

            fileStream.on('end', () => {
                console.log('✅ Все сообщения отправлены.');
                setTimeout(() => connection.close(), 500);
            });
        }
    } catch (error) {
        console.error('❌ Ошибка:', error);
    }
};

sendMessages();
