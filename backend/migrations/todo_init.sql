CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    alert INTEGER DEFAULT 0,
    limit_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO todos (text, completed, alert, limit_date) VALUES
    ('買い物に行く', 0, 1, '2024-03-20 18:00:00'),
    ('本を返却', 0, 1, '2024-03-25 17:00:00'),
    ('歯医者の予約', 0, 0, '2024-03-30 10:00:00'),
    ('報告書作成', 0, 1, '2024-03-22 15:00:00'),
    ('部屋の掃除', 0, 0, '2024-03-21 12:00:00');