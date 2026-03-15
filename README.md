# 📊 GAS Market Snapshot

Google Apps Script を利用してマーケットデータを取得し、
テキストサマリーとチャート画像を生成するツールです。

為替・暗号資産などの市場データを取得し、
日次スナップショットとして可視化することを目的としています。

このツールは **データ取得と可視化に特化したモジュール**として設計されています。
通知機能は含まれていませんが、外部の通知ツールと組み合わせて利用できます。

---

# ✨ Features

* Alpha Vantage API からマーケットデータ取得
* 為替（FX）・暗号資産（Crypto）対応
* 前日比・変動率を自動計算
* GAS Chart API を使用したチャート生成
* チャート画像を Google Drive に保存
* 複数銘柄対応を前提とした設計
* 通知ツールと連携可能（LINE / Google Chat など）

---

# 🏗 Architecture

本ツールは責務ごとにモジュールを分離しています。

```
Alpha Vantage API
        │
        ▼
alphaClient
        │
        ▼
snapshotService
        │
        ├── messageBuilder
        ├── chartBuilder
        └── chartStorage
        │
        ▼
snapshotRunner
        │
        ▼
starter
```

---

# 🔄 System Flow

Daily Market Snapshot の実行フロー

1. Alpha Vantage API から市場データ取得
2. Snapshot Service がデータ整理
3. Message Builder が表示メッセージ生成
4. Chart Builder がチャート画像生成
5. Chart Storage が Google Drive に保存
6. Runner が結果を返却
7. Starter が Logger 出力または通知処理を実行

---

# 📁 Project Structure

```
src/

  market_alphaClient.gs
  market_snapshotService.gs
  market_messageBuilder.gs
  market_chartBuilder.gs
  market_chartStorage.gs
  market_snapshotRunner.gs
  market_snapshotStarter.gs
  market_config.gs
```

## 各ファイルの役割

| File                   | Responsibility      |
| ---------------------- | ------------------- |
| market_config          | ScriptProperty 設定取得 |
| market_alphaClient     | Alpha Vantage API通信 |
| market_snapshotService | 市場データ取得・差分計算        |
| market_messageBuilder  | 表示メッセージ生成           |
| market_chartBuilder    | チャート生成              |
| market_chartStorage    | Google Drive保存      |
| market_snapshotRunner  | Snapshot処理実行        |
| market_snapshotStarter | 実行サンプル              |

---

# 🚀 Usage

## 1. GASプロジェクト作成

Google Apps Script プロジェクトを作成し、
`src` ディレクトリのファイルを配置します。

---

## 2. APIキー設定

Script Properties に以下を設定します。

```
ALPHA_API_KEY
```

APIキー取得

https://www.alphavantage.co/support/#api-key

---

## 3. 実行

```
marketSnapshotStarter()
```

実行内容

* 市場データ取得
* メッセージ生成
* チャート生成
* Logger 出力

---

# 📂 Google Drive

本ツールはチャート画像を保存するため、
Google Drive にフォルダを自動作成します。

```
Google Drive
└ MarketCharts
```

チャート画像はこのフォルダに保存されます。

---

# 📊 Example Output

```
📊 Morning Market Snapshot

💱 USD/JPY (2026-03-12 Close)
159.33
前日比 +0.39 (+0.25%)

₿ BTC/USD (2026-03-13 Close)
71924.48
前日比 +1392.92 (+1.97%)
```

チャート画像も同時に生成されます。

---

# 🔔 Notification Integration (Optional)

本ツールは通知機能を持ちませんが、
通知基盤と組み合わせて利用できます。

例

* LINE通知
* Google Chat通知
* Slack通知

---

# 📈 Supported Instruments

| Asset   | Period         |
| ------- | -------------- |
| USD/JPY | 5 trading days |
| BTC/USD | 7 days         |

設計上、他の銘柄追加も可能です。

例

* S&P500
* NASDAQ
* ETH
* Gold

---

# 🔧 Design Philosophy

本プロジェクトでは以下を重視しています。

### 責務分離

```
API取得
計算処理
表示生成
画像生成
```

を独立モジュールとして実装しています。

### 通知機能の分離

通知機能は本プロジェクトに含めず、
外部通知ツールと組み合わせる設計としています。

---

# 📄 License

MIT License
