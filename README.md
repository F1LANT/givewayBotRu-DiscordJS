# Discord Lottery Bot
![Screenshot](https://i.imgur.com/zHkpyEb.jpg)
## Описание
Этот бот для Discord предназначен для проведения розыгрышей на вашем сервере Discord. Он позволяет пользователям присоединяться к розыгрышу с помощью интерактивной кнопки и автоматически выбирает победителей после окончания времени розыгрыша. Этот бот идеально подходит для сообществ, которые хотят проводить регулярные розыгрыши, будь то для развлечения или для привлечения внимания к определенным событиям или продуктам.

## Основные функции
- **Автоматическое создание розыгрышей:** Бот автоматически создает новый розыгрыш каждые 24 часа (или другой настраиваемый период времени).
- **Участие одним нажатием:** Участники могут присоединиться к розыгрышу, просто нажав на кнопку.
- **Уведомления:** Участники получают уведомления о том, что они успешно присоединились к розыгрышу, а также о завершении розыгрыша и объявлении победителей.
- **Автоматическое определение победителей:** Победители выбираются случайным образом среди участников.
- **Конфигурация через JSON-файлы:** Настройки розыгрыша, включая призы и продолжительность, могут быть настроены через JSON-файлы.

## Как использовать
1. **Настройка:** Склонируйте репозиторий и установите необходимые зависимости через npm.
2. **Конфигурация:** Настройте вашего бота, указав токен бота и ID канала в файле конфигурации.
3. **Запуск бота:** Запустите бота, используя Node.js.
4. **Использование на сервере:** После запуска бот будет автоматически создавать и управлять розыгрышами на вашем сервере.

## Настройка
Для работы бота необходимо:
- Node.js версии 16.6.0 или выше.
- Discord.js версии 14 или выше.
- Скачай все файлы и напиши *npm i*
- Вставь токены и всю информацию в `slash.js` и `index.js`
- Сначала 1 раз запустите `slash.js` и после на постоянной основе запускайе `index.js`

## Команды
- `/endlottery`: Досрочно завершить текущий розыгрыш (доступно только администраторам).
