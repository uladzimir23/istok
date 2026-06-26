---
name: Istok in zavody-rb cluster
description: istok входит в кластер zavody-rb как ведущий проект и донор-шаблон для других B2B-витрин РБ-производств
type: project
originSessionId: 4013e346-6d80-41a0-b129-252c10b3f032
---
С 2026-05-06 istok — часть кластера zavody-rb (папка-зонтик для B2B-витрин
РБ-производств). **С 2026-06 кластер живёт в `~/Projects/zavody-rb/`** (istok
переехал туда из `~/Documents/istok`; старый `~/Documents/zavody-rb/` остался
legacy-копией без обновлений). Состав кластера сейчас: `istok`, `alto`, `barsa`,
`rasing`, `_shared` (проект `alto` добавился позже памяти — уточнить его профиль).

**Why:** в один день пришли 2 потенциальных проекта той же ниши через
знакомого Лаксим Мегковес — RASING (упаковка для HoReCa, navy/cream) и
BARSA (хлебопекарное B2B, ivory/bronze + serif + blob-Hero). Оба попадают
в архетип где istok уже строится. Решение зафиксировать кластерную
организацию принято в DEC-001 в `_shared/docs/decisions.md`.

**How to apply при работе над istok:**
- Любая правка в общих компонентах (Header, Footer, Hero-варианты,
  ContactForm, sandbox-пульт, токены, Dockerfile, deploy.yml) — делать
  с учётом «эта хрень потом будет в RAS/BARSA», не зашивать istok-специфику.
- istok-специфичное (бренд Исток+ELIS, каталог Элис, тон голоса фабрики,
  бренд-архитектура двух брендов) — оставлять в `web/src/app/`, `content/`,
  `docs/65 - Brand/`. Это **не** уезжает в RAS/BARSA.
- Перед добавлением новой фичи в общий слой — спросить: «нужна ли она
  RAS/BARSA или это istok-only?»
- Сквозные кросс-проектные решения фиксировать как DEC-NNN в
  `~/Projects/zavody-rb/_shared/docs/decisions.md`, **не** в istok-ADR
  (ADR в istok — только проектные).

**Где смотреть:**
- `~/Projects/zavody-rb/README.md` — обзор кластера
- `~/Projects/zavody-rb/_shared/docs/projects.md` — статус всех 3
- `~/Projects/zavody-rb/_shared/docs/decisions.md` — DEC-NNN
- `~/Projects/zavody-rb/_shared/docs/archetype.md` — типовая B2B-витрина РБ
- `~/Projects/zavody-rb/_shared/refs/{rasing,barsa}/` — мудборды

После запуска istok в прод — выделить `_template/` репо как чистый
скаффолд без бренд-специфики истока.
