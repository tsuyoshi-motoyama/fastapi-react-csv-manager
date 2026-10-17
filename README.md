# FastAPI + React CSV Manager

FastAPI、React（TypeScript）、PostgreSQLを使用した商品管理アプリケーションです。

Docker Composeを使用して開発環境を構築し、商品登録・検索機能を実装しています。

今後はCSVファイルによる商品一括登録・ダウンロード機能を追加する予定です。

## 技術構成

| 分類 | 技術 |
|---|---|
| フロントエンド | React / TypeScript / Vite |
| バックエンド | Python / FastAPI |
| データベース | PostgreSQL 17 |
| DB接続 | psycopg |
| 開発環境 | Docker / Docker Compose |

## ディレクトリ構成

```text
.
├── docker-compose.yml
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── api/
│       │   └── products.ts
│       ├── components/
│       │   ├── ProductForm.tsx
│       │   └── ProductSearch.tsx
│       ├── types/
│       │   └── product.ts
│       ├── App.tsx
│       └── main.tsx
└── backend/
    ├── Dockerfile
    ├── requirements.txt
    └── app/
        ├── __init__.py
        ├── main.py
        ├── database.py
        ├── routers/
        │   ├── __init__.py
        │   ├── index.py
        │   ├── health.py
        │   └── products.py
        ├── schemas/
        │   ├── __init__.py
        │   └── product.py
        └── repositories/
            ├── __init__.py
            ├── health.py
            └── product.py
```

## アーキテクチャ

```text
ブラウザ
   │
   ▼
React（TypeScript）
   │
   │ HTTP / JSON
   ▼
FastAPI
   │
   ├── Router
   │     リクエスト受付・ルーティング
   │
   ├── Schema
   │     リクエストデータの型定義・検証
   │
   └── Repository
         SQL実行・データアクセス
            │
            ▼
        PostgreSQL
```

### フロントエンドの責務

| ディレクトリ・ファイル | 役割 |
|---|---|
| `App.tsx` | コンポーネントの配置 |
| `components/` | 商品登録・検索画面 |
| `api/` | FastAPIとのHTTP通信 |
| `types/` | TypeScriptの型定義 |

### バックエンドの責務

| ディレクトリ・ファイル | 役割 |
|---|---|
| `main.py` | FastAPI初期化・CORS設定・Router登録 |
| `routers/` | APIエンドポイントの定義 |
| `schemas/` | Pydanticによるデータ検証 |
| `repositories/` | PostgreSQLへのSQL実行 |
| `database.py` | DB接続処理 |

現段階ではService層を設けず、RouterからRepositoryを呼び出す構成としています。

## 開発環境の起動

プロジェクトのルートディレクトリで以下を実行します。

```bash
docker compose up -d --build
```

起動後、以下のURLにアクセスします。

| サービス | URL |
|---|---|
| React | http://localhost:5173 |
| FastAPI | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |

停止する場合：

```bash
docker compose down
```

## データベース

PostgreSQLに以下の`products`テーブルを作成します。

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

| カラム | 型 | 内容 |
|---|---|---|
| id | SERIAL | 商品ID（主キー） |
| name | VARCHAR(255) | 商品名 |
| price | INTEGER | 価格 |
| created_at | TIMESTAMP | 登録日時 |

データはDockerのVolumeで永続化します。

## 実装済み機能

### 1. 商品登録

Reactの商品登録フォームからFastAPIへPOSTリクエストを送信し、PostgreSQLに商品を登録します。

**API**

`POST /products`

リクエスト例：

```json
{
  "name": "テスト商品",
  "price": 1000
}
```

レスポンス例：

```json
{
  "id": 1,
  "name": "テスト商品",
  "price": 1000
}
```

### 2. 商品検索

商品名を指定して、PostgreSQLに登録されている商品を検索します。

**API**

`GET /products?name=テスト`

- `ILIKE`による部分一致検索
- 検索条件はURLエンコードして送信
- 取得結果をReactのテーブルに表示

### 3. データベース接続確認

**API**

`GET /db-check`

PostgreSQLへの接続を確認し、接続成功時にデータベースのバージョン情報を返します。

### 4. API稼働確認

**API**

`GET /`

FastAPIの稼働状態を返します。

## CORS設定

ReactとFastAPIは異なるポートで起動するため、FastAPI側でCORSを設定しています。

- 許可Origin：`http://localhost:5173`
- 許可メソッド：`GET`、`POST`
- 許可ヘッダー：`Content-Type`

## 今後の実装予定

- [ ] CSVファイルのアップロード
- [ ] CSVデータのバリデーション
- [ ] CSVによる商品一括登録
- [ ] 商品データのCSVダウンロード
- [ ] ログイン機能の実装
- [ ] 指定されたユーザーのみ商品登録・CSV登録を許可する認可制御
- [ ] 登録・検索画面の改善
- [ ] CSV登録時の重複処理・異常系への対応

## 開発方針

- フロントエンドとバックエンドの責務を分離する
- API通信・画面処理・DBアクセスをファイル単位で整理する
- 最小限の機能から実装し、動作確認しながら拡張する
- 正常系の完成後、必要に応じて異常系やセキュリティ対策を追加する
