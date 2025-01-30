# Todoアプリ

## 概要

Todoアプリです。

## 起動方法

### バックエンド

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn src.app:app --reload --port 8000
```

### フロントエンド

```bash
cd frontend
npm install
npm run dev
```
