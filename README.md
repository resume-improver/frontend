# Resume Improver Frontend

Веб-интерфейс для сервиса анализа и улучшения резюме с помощью AI.

## Возможности
- Загрузка PDF-файлов резюме и вакансии
- Получение сопроводительного письма и рекомендаций по улучшению резюме
- Современный UI на Next.js (React)
- Поддержка HTTPS и работы через nginx reverse proxy

## Технологии
- [Next.js](https://nextjs.org/) 15+
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) (если используется)
- [axios](https://axios-http.com/) для запросов к backend
- [react-markdown](https://github.com/remarkjs/react-markdown) для рендера рекомендаций

## Быстрый старт (разработка)

1. Установите зависимости:
   ```bash
   npm install
   ```
2. Запустите dev-сервер:
   ```bash
   npm run dev
   ```
3. Откройте [http://localhost:3000](http://localhost:3000)

## Переменные окружения

Создайте файл `.env.local` (или используйте `.env`):
```
NEXT_PUBLIC_API_URL=https://resume-improver.sytes.net
```
- Укажите адрес backend (через nginx), обязательно с https для production.

## Production-сборка и запуск

1. Соберите проект:
   ```bash
   npm run build
   ```
2. Запустите production-сервер:
   ```bash
   npm start
   ```

## Docker

### Сборка и запуск контейнера

```bash
docker build -t resume-frontend .
docker run -p 3000:3000 resume-frontend
```

### Использование с nginx (reverse proxy)
- В production рекомендуется запускать через nginx, который будет проксировать запросы к Node.js серверу (порт 3000) и backend (порт 8000).
