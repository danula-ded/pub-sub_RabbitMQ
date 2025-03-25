const fs = require('fs');

function generateMessages(count) {
    const messages = [];
    for (let i = 1; i <= count; i++) {
        messages.push(`Message ${i}`);
        if (i % 3 === 0) {
            messages.push(`Message ${i}`);
        }
        if (i % 4 === 0) {
            messages.push(`Message ${i}`);
        }
    }
    return messages.join('\n');
}

const fileName = 'input.txt';
const messageCount = 100;
const content = generateMessages(messageCount);

fs.writeFile(fileName, content, (err) => {
    if (err) {
        console.error('Ошибка при создании файла:', err);
    } else {
        console.log(`Файл "${fileName}" успешно создан и заполнен ${messageCount} строками. С повторением каждой 3 строки и строк делящихся на 4, для проверки Redis`);
    }
});