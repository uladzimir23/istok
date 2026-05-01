# sandbox/

Песочница для дизайн-системы и лейаутов сайта `istokmebel.by`.

## Зачем

Vite + React + SCSS modules — быстрая итеративная среда для экспериментов с
визуалом, не загрязняющая прод (`web/`). Идеи, что зашли, переносятся вручную
в `web/src/shared/design-system/` и `web/src/widgets/`.

## Стек

- Vite 8 + React 19 + TypeScript strict
- SCSS modules (sass package)
- Bun как package manager
- `@fontsource-variable/montserrat` + `comfortaa` — шрифты в зависимостях

## Запуск

```bash
cd sandbox
bun install
bun dev      # http://localhost:5173
bun run build
```

## Структура

```
src/
├── styles/
│   ├── tokens.scss     # палитра + типографика + spacing (из docs/55 - Design System/)
│   ├── reset.scss
│   └── global.scss     # точка входа стилей (импортируется в main.tsx)
├── components/         # одна компонента = одна папка (TSX + module.scss)
├── assets/             # фото, скопированные из web/public/images/
├── App.tsx             # композирует страницу из компонент
└── main.tsx
```

## Что есть сейчас (v0)

Главная страница, единственный маршрут:

- `Hero` — заголовок + 2 CTA (B2B / B2C)
- 3 направления (`DirectionCard`): кресла, корпусная, кроватки
- `TrustBlock` — три цифры (1/3 госзаказа, 2 площадки, каталог-цифры)
- Floating-кнопки мессенджеров (Telegram / WhatsApp / Viber / звонок)
- `Footer` с адресами и контактами

## Где живёт «правда»

- Бренд / DS источник правды для решений: `docs/55 - Design System/`.
- Финальный код, который попадает в прод: `web/`.
- Sandbox — только эксперименты. Кода отсюда автоматически не переносится никуда.
