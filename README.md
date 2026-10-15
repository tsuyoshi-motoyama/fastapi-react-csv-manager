# FastAPI + React (TypeScript) Docker 開発環境

FastAPI（Python）とReact（TypeScript / Vite）をDocker Composeで起動する開発環境です。

ReactからFastAPIのGET APIを呼び出し、取得したメッセージを画面に表示します。FastAPI側にはPOST APIも用意しています（Swagger UIから確認可能）。

## 使用技術

- Python 3.15 / FastAPI / Uvicorn / Pydantic
- React / TypeScript / Vite
- Node.js 24
- Docker / Docker Compose

## ディレクトリ構成

```text
.
├── compose.yml
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── routers/
│       │   ├── __init__.py
│       │   └── sample.py
│       └── schemas/
│           ├── __init__.py
│           └── sample.py
└── frontend/
    ├── Dockerfile
    ├── .dockerignore
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── App.tsx
        └── main.tsx
```

※ Viteが生成するその他の設定ファイル等は省略しています。

## 前提条件

- DockerおよびDocker Composeが利用できること
- ポート `8000` と `5173` が利用可能であること

ホスト側でPythonやNode.jsの依存パッケージをインストールする必要はありません。

## 起動方法

プロジェクトのルートで実行します。

```bash
docker compose up -d --build
```

起動状態の確認：

```bash
docker compose ps
```

ログの確認：

```bash
docker compose logs -f backend
docker compose logs -f frontend
```

停止：

```bash
docker compose down
```

## 動作確認

| 対象 | URL | 内容 |
| --- | --- | --- |
| React | http://localhost:5173/ | FastAPIから取得したメッセージを表示 |
| FastAPI | http://localhost:8000/ | ルートAPI |
| GET API | http://localhost:8000/api/hello | メッセージ取得 |
| Swagger UI | http://localhost:8000/docs | API仕様の確認・実行 |

### GET API

```bash
curl http://localhost:8000/api/hello
```

レスポンス例：

```json
{"message":"Hello from FastAPI Router"}
```

### POST API

Swagger UIの `POST /api/hello` から、次のJSONを送信できます。

```json
{"message":"Hello React"}
```

レスポンス例：

```json
{"message":"Received: Hello React"}
```

## 開発環境の仕組み

- `backend` はUvicornの `--reload` によりPythonファイルの変更を反映します。
- `frontend` はViteの開発サーバーを使い、Reactの変更を反映します。
- ソースコードはDocker Composeのボリュームでコンテナにマウントしています。
- ブラウザで実行されるReactの `fetch` は `http://localhost:8000/api/hello` にアクセスします。
- FastAPIでは開発用に `http://localhost:5173` からのCORSアクセスを許可しています。

## 現在の実装範囲

- [x] FastAPIのDocker環境
- [x] React + TypeScript + ViteのDocker環境
- [x] Docker Composeによる起動
- [x] FastAPIのルーティング分離
- [x] PydanticによるPOSTリクエストの入力定義
- [x] ReactからFastAPIへのGET通信
- [ ] ReactからFastAPIへのPOST通信

## 注意事項

この構成はローカル開発用です。Viteの開発サーバー、Uvicornの自動リロード、開発用CORS設定を使用しており、本番公開を前提とした構成ではありません。
