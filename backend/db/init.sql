CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL,
    order_date TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ NULL,
    completed_at TIMESTAMPTZ NULL,
    file_path VARCHAR(255) NULL,
    error_msg TEXT NULL,
    progress INTEGER NOT NULL DEFAULT 0
);

INSERT INTO orders (user_name, product_name, category, amount, status, order_date)
SELECT
    (ARRAY['이은서','김지희','이지선','김도훈','최영재'])[1 + floor(random() * 5)::int],
    (ARRAY['스키 이용권','워터파크 입장권','리조트 숙박','통합 패키지'])[1 + floor(random() * 4)::int],
    (ARRAY['스키','워터파크','숙박','테마파크'])[1 + floor(random() * 4)::int],
    30000 + floor(random() * 470000)::int,
    (ARRAY['confirmed','cancelled','pending'])[1 + floor(random() * 3)::int],
    NOW() - (random() * interval '365 days')
FROM generate_series(1, 100000);

CREATE INDEX IF NOT EXISTS idx_orders_id ON orders(id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);