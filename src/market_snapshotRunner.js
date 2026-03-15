/**
 * Daily Market Snapshot 生成関数
 *
 * 責務：
 * - 各銘柄のSnapshot取得
 * - メッセージ生成
 * - グラフ生成
 *
 * 戻り値：
 * - message
 * - chartUrls
 */
function runDailyMarketSnapshot() {

  // -----------------------------
  // ① Snapshot取得
  // -----------------------------
  const fxSnapshot = buildFxSnapshot("USD", "JPY", 5);

  const btcSnapshot = buildCryptoSnapshot("BTC", "USD", 7);

  const snapshots = [
    fxSnapshot,
    btcSnapshot
  ];

  // -----------------------------
  // ② メッセージ生成
  // -----------------------------
  const message = buildMarketSnapshotMessage(snapshots);

  // -----------------------------
  // ③ チャート生成
  // -----------------------------
  const imageUrls = [];

  snapshots.forEach(snapshot => {

    const chartBlob = buildLineChartImage(snapshot);

    const imageUrl = uploadChartAndGetUrl(chartBlob);

    imageUrls.push(imageUrl);

  });

  // -----------------------------
  // ④ 結果返却
  // -----------------------------
  return {
    message: message,
    imageUrls: imageUrls
  };

}