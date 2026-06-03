# 📊 Data to Excel

> 대용량 주문 데이터를 엑셀 파일로 추출·다운로드하는 웹 페이지

PostgreSQL에 저장된 10만 건 이상의 주문 데이터를 청크 단위로 처리해 엑셀을 생성하고, 현재 진행 상황을 확인할 수 있습니다.

---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 🗄️ **대용량 샘플 데이터 생성** | PostgreSQL generate_series를 활용하여 10만 건의 가상 주문 데이터를 자동 생성 |
| 📦 **청크 기반 엑셀 생성** | 5,000건 단위로 데이터를 나눠 읽어 메모리 사용량 최소화 |
| ⚡ **비동기 백그라운드 처리** | FastAPI `BackgroundTasks`로 요청 즉시 응답, 백그라운드에서 작업 수행 |
| 🔄 **실시간 진행률 추적** | 프론트엔드가 3초마다 폴링해 진행 상태(퍼센테이지)를 실시간 표시 |
| 📥 **파일 다운로드** | 작업 완료 후 생성된 엑셀 파일을 바로 다운로드 |


---

## 🚀 빠른 시작

### 🐳 Docker로 실행

```bash
# 전체 빌드 및 실행
docker compose up --build
```

| 서비스 | URL |
|--------|-----|
| 🌐 Frontend | http://localhost:3000 |
| ⚙️ Backend API | http://localhost:8000 |
| 📖 Swagger UI | http://localhost:8000/docs |

```bash
# 종료
docker compose down

# 볼륨 포함 완전 초기화
docker compose down -v
```

---

### 💻 로컬 개발 환경

**1. Backend**

```bash
cd backend
python -m venv .venv

# macOS / Linux
source .venv/bin/activate

# Windows PowerShell
.venv\Scripts\Activate.ps1

pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**2. Frontend**

```bash
cd frontend
npm install
npm run dev
```

---
## 초기 데이터 구성


별도의 수동 데이터 입력 없이 엑셀 생성 기능을 바로 테스트할 수 있도록,
애플리케이션 실행 시 PostgreSQL 초기화 스크립트가 실행되며 약 100,000건의 주문 데이터를 자동 생성합니다.

생성 방식

- PostgreSQL `generate_series` 활용
- `random()`을 활용한 주문자, 상품명, 카테고리, 금액, 주문 상태, 주문일시 생성
- 엑셀 생성 성능 검증을 위한 대용량 테스트 데이터 구성

이를 통해 실제 대용량 데이터 환경을 가정한 엑셀 생성 테스트가 가능합니다.

## 작업 상태 흐름

```
⏳ pending  →  🔄 processing  →  ✅ done
                              ↘  ❌ failed

```

---

## ⚙️ 환경 변수

Docker Compose를 사용하면 아래 변수가 자동으로 설정됩니다.
로컬 실행 시에는 `.env` 파일 또는 직접 설정이 필요합니다.

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `DATABASE_URL` | `postgresql+psycopg2://export_user:export_pass@db:5432/export_db` | PostgreSQL 연결 문자열 |

---

## 📂 파일 저장 위치

- **엑셀 출력 파일**: 컨테이너 내부 `/app/exports` → `docker-compose.yml`의 `exports` 볼륨에 마운트
- **DB 초기화 SQL**: `backend/db/init.sql`

---
## 🏗 프로젝트 구조

```
data-to-excel/
├── 🐳 docker-compose.yml        # 전체 서비스 오케스트레이션
├── 📁 backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── db/
│   │   └── init.sql             # 10만 건 샘플 주문 데이터
│   └── app/
│       ├── main.py              # FastAPI 앱 진입점
│       ├── models.py            # ORM 모델 (Order, Job)
│       ├── schemas.py           # Pydantic 스키마
│       ├── database.py          # DB 연결 및 세션
│       ├── routers/
│       │   └── export_jobs.py   # 엑셀 작업 API 엔드포인트
│       └── tasks/
│           └── excel.py         # 백그라운드 엑셀 생성 태스크
└── 📁 frontend/
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── App.jsx              # 메인 컴포넌트 (진행률·다운로드 UI)
        ├── api.js               # Axios 클라이언트
        └── main.jsx
```

---

## 🛠 기술 스택

### Backend
![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![OpenPyXL](https://img.shields.io/badge/OpenPyXL-Excel-217346?logo=microsoftexcel&logoColor=white)

### Frontend
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white)

### Infra
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?logo=nginx&logoColor=white)

---

## 💭 기술 스택 선택 이유

### PostgreSQL 선택 이유

초기에는 빠른 개발과 간단한 환경 구성을 위해 SQLite 사용도 고려하였지만, 10만 건 이상의 데이터를 저장하고 조회해야 하는 조건을 고려하여 대용량 데이터 처리에 더 적합한 PostgreSQL을 선택하였습니다. 또한 PostgreSQL은 공식 Docker 이미지와 `healthcheck` 지원이 잘 갖춰져 있어 Docker Compose 환경에서 안정적으로 구성할 수 있으며, 향후 더 큰 규모의 데이터를 처리할 경우 인덱스, 파티셔닝 등 다양한 성능 최적화 기법을 활용할 수 있다는 장점이 있습니다. 추가로 PostgreSQL의 내장 함수인 `generate_series`를 활용하여 10만 건의 시드 데이터를 단일 쿼리로 생성할 수 있었기 때문에, 별도의 데이터 생성 스크립트 없이도 대용량 테스트 환경을 손쉽게 구축할 수 있다고 판단하였습니다.

### FastAPI 선택 이유

이번 프로젝트의 핵심은 대용량 데이터 처리와 비동기 작업 설계에 있다고 판단하여, 상대적으로 가볍고 빠르게 개발할 수 있으며 FastAPI의 BackgroundTasks를 활용해 비동기 작업을 간단하게 구현할 수 있다는 점에서 FastAPI를 선택하였습니다. 또한 자동 Swagger 문서 제공과 타입 힌트 기반 개발이 가능하여 API 개발 및 테스트가 편리하다는 장점도 있었고, Python 라이브러리인 OpenPyXL을 활용하여 대용량 엑셀 파일 생성 기능을 비교적 복잡하지 않은 구조로 구현할 수 있다는 점도 선택의 이유 중 하나였습니다.


## 🔍 설계 시 고민한 점

### 비동기 처리 방식

초기에는 Celery와 Redis 기반 작업 큐도 고려하였으나 과제 요구사항의 단일 컨테이너 환경과 제한된 리소스 환경 때문에 별도 메시지 브로커를 추가하지 않았습니다.
대신 FastAPI의 `BackgroundTasks`를 사용하여 구현 복잡도를 줄이면서 엑셀 생성 작업을 비동기적으로 처리할 수 있도록 구현하였습니다.
사용자가 엑셀 생성을 요청하면 Job 레코드만 생성한 뒤 즉시 응답을 반환합니다. 
실제 엑셀 생성 작업은 BackgroundTasks에서 수행하며, Job 상태를 pending → processing → done 으로 관리하였습니다.
이를 통해 장시간 작업이 API 응답 시간을 증가시키지 않도록 하였습니다.

### Job 상태 관리

엑셀 생성 요청과 실제 생성 작업을 분리하기 위해 jobs 테이블을 별도로 구성하였습니다.
각 작업은 pending → processing → done 혹은 failed 상태를 가지며, 
요청 시간, 시작 시간, 완료 시간, 파일 저장 경로를 기록하도록 설계하였습니다.
또한 작업 실패 시에는 예외 메시지를 error_msg 컬럼에 저장하여 실패 원인을 확인할 수 있도록 하였습니다.

###  상태 확인 방식

요청 후 상태 확인 방식으로는 페이지 새로고침, SSE, Polling 방식을 고려하였습니다.
페이지 새로고침은 사용자가 직접 화면을 갱신해야 하므로 사용자 경험이 좋지 않다고 판단하여 제외하였습니다.
SSE는 서버가 상태 변경을 즉시 전달할 수 있다는 장점이 있지만, 별도의 SSE 엔드포인트와 이벤트 처리 구조가 필요하여 구현 복잡도가 증가합니다.
반면 현재 시스템은 여러 Job의 상태를 목록 형태로 보여주는 구조이기 때문에, 전체 Job 목록을 주기적으로 조회하는 방식이 더 단순하고 적합하다고 판단하였습니다.
따라서 구현 복잡도와 유지보수성을 고려하여 3초 주기의 Polling 방식을 선택하였습니다.


### 진행률 표시 방식

사용자에게 작업 진행 상황을 보여주기 위해 jobs 테이블에 progress 컬럼을 추가하고, 엑셀 생성 과정에서 진행률을 계산하여 저장하도록 구현하였습니다.
진행률은 전체 데이터 수 대비 처리된 데이터 수를 기준으로 계산하며, 매 row마다 저장할 경우 과도한 DB UPDATE가 발생할 수 있다고 판단하여 5,000건 단위의 청크 처리 완료 시에만 DB에 반영하였습니다.
10만 건 기준으로 약 20회의 UPDATE만 발생하므로, 불필요한 DB write를 최소화하면서도 사용자가 진행 상황을 확인할 수 있도록 하였습니다.
작업이 정상적으로 완료되면 진행률은 100%로 갱신되며, 실패한 경우에는 failed 상태를 통해 작업 실패 여부를 확인할 수 있도록 하였습니다.

### 엑셀 생성 시 메모리 사용량

10만 건 데이터를 한 번에 메모리에 적재할 경우 메모리 사용량이 급격히 증가할 수 있기 때문에, 과제의 리소스 제한 조건(CPU 0.5 Core, Memory 512MB)을 고려하여 메모리 사용량을 최소화하는 방향으로 구현하였습니다.
엑셀 생성 시에는 OpenPyXL의 `write_only` 모드를 사용하여 전체 데이터를 메모리에 유지하지 않고 바로 파일에 기록하도록 하였습니다.
또한 데이터를 한 번에 조회하지 않고 5,000건 단위로 나누어 처리하였으며, `OFFSET` 방식 대신 마지막으로 처리한 ID를 기준으로 다음 데이터를 조회하는 커서 기반 조회 방식을 적용하였습니다.
이를 통해 대용량 데이터 환경에서도 비교적 일정한 성능을 유지하면서 제한된 리소스 환경에서 안정적으로 동작할 수 있도록 하였습니다.

### 데이터 시드 생성 방식

초기에는 Python 스크립트를 통해 10만 건의 데이터를 생성하는 방안을 고려했으나, PostgreSQL를 사용하게 되면서 generate_series 함수를 활용하여 DB 내부에서 직접 더미 데이터를 생성하는 방식을 선택하였습니다.
애플리케이션 레벨에서 반복 Insert를 수행하는 방식보다 DB 엔진 내부에서 처리하는 방식이 더 단순하고 빠르며,
docker compose up --build 실행 시 초기 데이터 구성을 쉽게 자동화할 수 있다고 판단하였습니다.


### Docker 구성

Frontend는 React 애플리케이션을 빌드한 뒤 Nginx를 통해 정적 파일을 제공하도록 구성하였습니다.
개발 환경에서는 Vite Dev Server를 사용할 수 있지만, 제출 환경에서는 Nginx 기반 구성이 더 단순하고 안정적이라고 판단하였습니다.
DB 컨테이너가 완전히 준비된 후 Backend가 시작되도록 `healthcheck`와 `depends_on` 조건을 설정하였습니다.
또한 PostgreSQL 초기화 스크립트(init.sql)를 사용하여 테이블 생성 및 100,000건의 시드 데이터 삽입이 자동으로 수행되도록 구성하였습니다.

### UI/UX

작업 상태(pending, processing, done, failed)를 색상 배지로 구분하여 사용자가 현재 상태를 직관적으로 확인할 수 있도록 하였습니다.
또한 진행률(progress)을 표시하여 사용자가 작업 중에도 현재 진행 상황을 확인할 수 있도록 하였습니다.

## 🚧 개선 방향

### 프로세스 재시작 시 태스크 유실

`BackgroundTasks`는 uvicorn 프로세스가 종료되면 실행 중이던 태스크가 유실될 수 있습니다.
이를 보완하기 위해 애플리케이션 시작 시 `processing` 상태로 남아있는 Job을 검사하여 `failed` 상태로 변경하는 복구 로직을 추가할 수 있습니다.
근본적인 해결책으로는 Celery와 Redis를 활용하여 작업 처리 프로세스를 분리하는 방안을 고려할 수 있습니다.

### 동시 요청 제어

현재 구현은 동시에 여러 작업이 요청될 경우 BackgroundTasks가 각각 실행됩니다.
실제 운영 환경에서는 Semaphore를 통한 동시 실행 수 제한, 또는 내부 작업 큐를 통한 순차 처리를 적용하여 리소스 사용량을 보다 안정적으로 관리할 수 있습니다.

### 인증/인가

현재 과제 범위에는 로그인 및 권한 관리가 포함되어 있지 않아 JWT 기반 인증은 제외하였습니다.
실제 운영 환경에서는 사용자별 Job 조회 및 파일 다운로드 권한을 제한하기 위해 인증 및 인가 기능을 추가할 필요가 있습니다.
