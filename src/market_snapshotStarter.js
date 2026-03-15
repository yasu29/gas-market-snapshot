/**
 * Market Snapshot 実行例（単体実行）
 *
 * 目的：
 * - gas-market-snapshot を単体で実行するサンプル
 * - データ取得とチャート生成の動作確認
 *
 * 処理概要：
 * ① Snapshot取得
 * ② メッセージ生成
 * ③ チャート生成
 * ④ Loggerへ出力
 *
 * 想定用途：
 * - 開発時の動作確認
 * - GAS単体での利用
 * - 通知機能を持たない環境での実行
 */
function marketSnapshotStarter() {

  const result = runDailyMarketSnapshot();

  Logger.log("===== Market Snapshot =====");
  Logger.log(result.message);

  result.imageUrls.forEach(url => {
    Logger.log(url);
  });

}


/**
 * Market Snapshot 実行例（通知基盤利用）
 *
 * 前提：
 * - gas-notification-engine が導入済み
 *
 * 目的：
 * - Market Snapshot を通知基盤経由で送信するサンプル
 */
function marketSnapshotStarterWithNotification() {

  const result = runDailyMarketSnapshot();

  const lineUserId = MarketConfig.LINE_USER_ID;

  // -----------------------------
  // ① テキスト通知
  // -----------------------------
  notifyText(
    "LINE",
    lineUserId,
    result.message
  );

  // -----------------------------
  // ② 画像通知
  // -----------------------------
  result.imageUrls.forEach(url => {

    notifyImage(
      "LINE",
      lineUserId,
      url
    );

  });

}