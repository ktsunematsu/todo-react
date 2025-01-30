CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO todos (text) VALUES
    ('買い物に行く'),
    ('本を返却'),
    ('歯医者の予約'),
    ('報告書作成'),
    ('部屋の掃除');