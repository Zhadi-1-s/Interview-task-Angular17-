# Orders Dashboard (Angular 17+)

SPA-приложение для менеджеров интернет-магазина, позволяющее просматривать, фильтровать и редактировать заказы.

## Технологии

- Angular 17+ (standalone components, новый control flow `@if/@for`)
- RxJS / Signals для локального состояния
- Angular Material (UI-компоненты)
- TypeScript strict + ESLint + Prettier
- JSON Server для локального API

## Установка и запуск
```bash
git clone https://github.com/Zhadi-1-s/Interview-task-Angular17-.git
cd orders-dashboard
2. Установить зависимости
npm install

3. Запустить локальный JSON Server (API)
npm run mock


API доступен на http://localhost:3001

Пример db.json:

{
  "products": [
    { "id": 1, "sku": "P-001", "title": "Ноутбук", "price": 120000, "stock": 5,  "updatedAt": "2025-08-01T10:00:00Z" },
    { "id": 2, "sku": "P-002", "title": "Мышь", "price": 5000, "stock": 20, "updatedAt": "2025-08-10T12:00:00Z" }
  ],
  "orders": [
    { "id": 1, "number": "ORD-001", "customerName": "Иван Иванов", "status": "new",
      "items": [{ "productId": 1, "qty": 1, "price": 120000 }],
      "total": 120000, "createdAt": "2025-08-15T08:00:00Z" },
    { "id": 2, "number": "ORD-002", "customerName": "Пётр Петров", "status": "processing",
      "items": [{ "productId": 2, "qty": 2, "price": 5000 }],
      "total": 10000, "createdAt": "2025-08-16T09:30:00Z" }
  ]
}

4. Запуск приложения
npm start


Приложение будет доступно на http://localhost:4200

5. Сборка проекта
npm run build

6. Тесты

Юнит-тесты:

npm test


E2E-тесты (Cypress):

npm run e2e

Структура проекта
src/
 ├─ app/
 │   ├─ orders/        # компоненты, сервисы и страницы заказов
 │   ├─ auth/          # логин, guards, interceptor
 │   ├─ shared/        # модели, утилиты, общие компоненты
 │   └─ core/          # сервисы, хранилища, state management
 ├─ assets/
 ├─ environments/
 └─ main.ts

