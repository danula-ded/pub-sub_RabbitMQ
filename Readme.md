### 📌 **Как запустить проект**

1. **Клонирование репозитория:**

   ```sh
   git clone https://github.com/danula-ded/pub-sub_RabbitMQ.git
   cd pub-sub_RabbitMQ
   ```

2. **Запуск через Docker Compose:**

   ```sh
   docker-compose up --build
   ```

3. **Проверка работы:**

   - **Очередь RabbitMQ**: открой `http://localhost:15672/`, логин/пароль — `guest/guest`. Перейди в раздел **Queues**, найди `messages_queue` и посмотри сообщения.
   - **Был создан exchange**: его можно увидеть во вкладке **exchange**
   - **База данных PostgreSQL**: подключись к контейнеру и проверь таблицы:
     ```sh
     docker exec -it postgres psql -U postgres -d messages_db
     SELECT * FROM message1;
     SELECT * FROM message2;
     ```
     если не работает, нужно открыть программу для администрирования БД, и вбить следующие параметры POSTGRES_USER: postgres - POSTGRES_PASSWORD: postgres - POSTGRES_DB: messages_db

4. **Пересобрать input.txt:**
   ```
   cd .\producer\
   node generate_input.js
   ```

### 🔍 **Как работает система?**

**Producer** отправляет сообщения в очередь `messages_queue` RabbitMQ. **Consumer-1** и **Consumer-2** одновременно считывают их: первый записывает в `message1`, второй в `message2`. RabbitMQ балансирует сообщения между ними, так что они распределяются случайным образом.

## Техническое Задание

**Задача: Настройка Pub/Sub в RabbitMQ**

**Цель:**
Настроить систему Pub/Sub с использованием RabbitMQ, где один Publisher отправляет сообщения из файла, а два Consumers получают эти сообщения и записывают их в отдельные файлы.

ЯП - любой

**Шаги реализации:**

1. **Publisher:**
   1. Читает построчно текст из заранее подготовленного файла (input.txt).
   1. Отправляет каждую строку как сообщение в очередь RabbitMQ.
1. **Consumers:**
   1. Два отдельных Consumers подписываются на очередь RabbitMQ.
   1. Каждый Consumer записывает полученные сообщения в базу в отдельную таблицу (название таблиц любое). Либо если опыта с базами не было то у каждого Consumer свой текстовый файл.
1. **Docker Compose:**
   1. Создать docker-compose.yml, который включает:
      1. Сервис RabbitMQ.
      1. Сервис Publisher.
      1. Два сервиса Consumers.
   1. В ином случае подробная документация по запуску проекта

Дополнительный балл:

1\. В качестве бд использована ApacheCassandra

2\. Настроен НЕ дефолтный  exchange в  Rabbit

Отправка решения:

1\. Ссылка на репозиторий в GitHub

2\. Худший вариант - отправка  архива или иной вариант, который можно обсудить лично, либо напишите в тг
