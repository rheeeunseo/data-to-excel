# 📊 Data to Excel

> 대용량 주문 데이터를 엑셀 파일로 추출·다운로드하는 웹 페이지

PostgreSQL에 저장된 10만 건 이상의 주문 데이터를 청크 단위로 처리해 엑셀을 생성하고, 실시간 진행 상황을 확인할 수 있습니다.

---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 📦 **청크 기반 엑셀 생성** | 5,000건 단위로 데이터를 나눠 읽어 메모리 사용량 최소화 |
| ⚡ **비동기 백그라운드 처리** | FastAPI `BackgroundTasks`로 요청 즉시 응답, 백그라운드에서 작업 수행 |
| 🔄 **실시간 진행률 추적** | 프론트엔드가 3초마다 폴링해 진행 상태·퍼센트를 실시간 표시 |
| 📥 **파일 다운로드** | 작업 완료 후 생성된 엑셀 파일을 바로 다운로드 |
| 🐳 **Docker 원클릭 실행** | `docker compose up --build` 한 줄로 전체 환경 구동 |

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

## 🚀 빠른 시작

### 🐳 Docker로 실행 (권장)

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

## 🔌 API 엔드포인트

| Method | URL | 설명 |
|--------|-----|------|
| `GET` | `/health` | 헬스 체크 |
| `POST` | `/api/export-jobs` | 엑셀 생성 작업 요청 |
| `GET` | `/api/export-jobs` | 전체 작업 목록 조회 |
| `GET` | `/api/export-jobs/{id}` | 특정 작업 상태 조회 |
| `GET` | `/api/export-jobs/{id}/download` | 완료된 엑셀 파일 다운로드 |

### 작업 상태 흐름

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

## 💭 기술 스택 선택 이유

### PostgreSQL 선택 이유

과제 요구사항에서는 PostgreSQL, MySQL, SQLite 중 하나를 선택할 수 있었습니다.
초기에는 SQLite 사용도 고려하였지만, 본 과제는 10만 건 이상의 데이터를 저장하고 조회해야 하므로 PostgreSQL을 선택하였습니다.

선택 이유는 다음과 같습니다.

- **대용량 데이터 처리에 적합** — 동시 접속 및 대용량 쿼리 처리에 강함
- **Docker 환경에서 구성하기 쉬움** — 공식 이미지와 `healthcheck` 지원이 잘 갖춰져 있음
- **실무에서 가장 널리 사용되는 RDBMS 중 하나** — 운영 환경과 동일한 스택 선택
- **향후 데이터 증가 시 확장성이 높음** — 인덱스, 파티셔닝 등 성능 튜닝 옵션이 풍부
- **`generate_series` 활용** — DB 내부에서 10만 건 시드 데이터를 단일 쿼리로 생성 가능

특히 Job 상태 관리와 대량 데이터 조회가 핵심인 과제 특성상 SQLite보다 PostgreSQL이 적합하다고 판단하였습니다.

---

## 🔍 설계 시 고민한 점

### 1. 비동기 처리 방식

초기에는 Celery + Redis 기반 작업 큐도 고려하였습니다.
하지만 과제 요구사항에서 **단일 컨테이너 환경**과 **제한된 리소스 환경**을 강조하고 있었기 때문에 별도 메시지 브로커를 추가하지 않았습니다.
대신 FastAPI의 `BackgroundTasks`를 사용하여 구현 복잡도를 줄이고 요구사항에 집중하였습니다.

**장점**
- 추가 인프라 불필요
- 단일 컨테이너 환경에 적합
- 구현 단순

**단점**
- 프로세스 재시작 시 작업 유실 가능
- 대규모 트래픽 환경에는 적합하지 않음

실무 환경이라면 Celery, RabbitMQ 또는 Redis Queue 기반 구조를 고려할 것입니다.

---

### 2. 상태 확인 방식

상태 확인 방식으로는 다음 세 가지를 고려하였습니다.

| 방식 | 장점 | 단점 |
|------|------|------|
| 페이지 새로고침 | 구현 단순 | 사용자 경험 나쁨 |
| Polling | 구현 단순, 안정적 | 불필요한 요청 발생 가능 |
| SSE | 실시간성 뛰어남 | 구현 복잡도 증가 |

페이지 새로고침은 사용자 경험이 좋지 않다고 판단하였습니다.
SSE는 실시간성이 뛰어나지만 구현 복잡도가 증가하고, Job이 여러 개 동시에 처리될 경우 Job마다 연결을 열어야 하는 문제가 있습니다.
본 과제에서는 Job 상태 변경 빈도가 높지 않기 때문에 **3초 주기의 Polling 방식**을 선택하였습니다.
이를 통해 구현 복잡도를 낮추면서도 충분한 사용자 경험을 제공할 수 있다고 판단하였습니다.

---

### 3. 진행률 표시 방식

진행률을 표시하기 위해 `jobs` 테이블에 `progress` 컬럼을 추가하고, 엑셀 생성 태스크에서 청크 처리 완료 시마다 진행률을 계산하여 DB에 저장하는 방식을 선택하였습니다.

```python
new_progress = min(int(processed / total_count * 100), 99)
db.query(Job).filter(Job.id == job_id).update({"progress": new_progress})
db.commit()
```

매 row마다 저장하면 DB UPDATE가 과도하게 발생할 수 있으므로, **청크 처리 단위(5,000건)로만 DB에 반영**하였습니다.
10만 건 기준으로 총 20번의 UPDATE만 발생하며, 이를 통해 사용자에게 진행 상황을 제공하면서도 불필요한 DB write를 줄였습니다.

완료 시에는 `progress: 100`, 실패 시에는 별도 업데이트 없이 `status: failed`로만 처리하여 명확한 상태 구분이 가능하도록 하였습니다.

---

### 4. 엑셀 생성 시 메모리 사용량

10만 건 데이터를 한 번에 메모리에 적재할 경우 메모리 사용량이 급격히 증가할 수 있습니다.
과제의 리소스 제한 조건(CPU 0.5, Memory 512MB)을 고려하여 다음 두 가지 방식을 적용하였습니다.

**OpenPyXL Write Only 모드**

```python
Workbook(write_only=True)
```

엑셀 전체를 메모리에 유지하지 않고 행을 `append`하는 즉시 디스크에 스트리밍하도록 구성하였습니다.

**Chunk 단위 커서 기반 조회**

```python
orders = db.query(Order).filter(Order.id > last_id).order_by(Order.id).limit(CHUNK_SIZE).all()
last_id = orders[-1].id
```

`OFFSET` 방식 대신 마지막으로 처리한 `id`를 기준으로 다음 청크를 조회하는 커서 방식을 사용하였습니다.
`OFFSET`은 페이지가 뒤로 갈수록 앞의 데이터를 전부 스캔하고 버리기 때문에 성능이 저하되지만, 커서 방식은 PK 인덱스를 타고 바로 찾아가므로 일정한 속도를 유지할 수 있습니다.

이를 통해 제한된 메모리 환경에서도 안정적으로 동작할 수 있도록 하였습니다.

---

### 5. Docker 구성

Frontend는 React 애플리케이션을 빌드한 뒤 Nginx를 통해 정적 파일을 제공하도록 구성하였습니다.
개발 환경에서는 Vite Dev Server를 사용할 수 있지만, 제출 환경에서는 Nginx 기반 구성이 더 단순하고 안정적이라고 판단하였습니다.

DB 컨테이너가 완전히 준비된 후 Backend가 시작되도록 `healthcheck`와 `depends_on` 조건을 설정하였습니다.

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U export_user -d export_db"]
  interval: 5s
  timeout: 5s
  retries: 10
```

이를 통해 다음 명령어 한 번으로 전체 서비스를 실행할 수 있도록 구성하였습니다.

```bash
docker compose up --build
```

---

## 🚧 개선 방향

### 프로세스 재시작 시 태스크 유실

`BackgroundTasks`는 uvicorn 프로세스가 종료되면 실행 중이던 태스크가 유실됩니다.
`startup` 이벤트에서 `processing` 상태로 멈춘 Job을 `failed`로 복구하는 핸들러를 추가하면 최소한 상태 불일치는 방지할 수 있습니다.
근본적인 해결책으로는 Celery + Redis를 통한 워커 분리를 고려할 수 있습니다.

### 동시 요청 제어

현재 동시에 여러 엑셀 생성 요청이 들어오면 스레드를 그만큼 점유합니다.
`threading.Semaphore`로 동시 실행 수를 제한하거나 내부 큐로 순차 처리하는 방식을 고려할 수 있습니다.

### 파일 만료 처리

생성된 xlsx 파일이 무한정 누적됩니다.
일정 기간이 지난 파일을 정리하는 스케줄러가 필요합니다.

### 6. UI/UX

상태 배지와 다운로드 버튼에 `whitespace-nowrap`을 적용하여 
텍스트가 잘리지 않도록 처리하였습니다.