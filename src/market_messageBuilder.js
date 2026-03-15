/**
 * Market Snapshot を LINE送信用テキストへ変換する
 *
 * 責務：
 * - 表示整形のみ行う
 * - 計算ロジックは含めない
 * - 丸め処理はここで実施
 * - 将来の複数銘柄対応を前提とする
 *
 * @param {Array<Object>} snapshots - marketServiceが返す内部モデル配列
 * @returns {string} LINE送信用テキスト
 */
function buildMarketSnapshotMessage(snapshots) {

  if (!snapshots || snapshots.length === 0) {
    throw new Error("No snapshot data provided.");
  }

  // -----------------------------
  // ① ヘッダー（固定タイトルのみ）
  // -----------------------------
  const messageLines = [
    "📊 Morning Market Snapshot",
    ""
  ];

  // -----------------------------
  // ② 各銘柄ブロック生成
  // -----------------------------
  snapshots.forEach(snapshot => {

    const block = buildInstrumentBlock(snapshot);

    messageLines.push(...block);
    messageLines.push(""); // 銘柄間の空行
  });

  // 改行で結合して最終文字列にする
  return messageLines.join("\n").trim();
}

/**
 * 単一銘柄ブロックを生成する
 *
 * @param {Object} snapshot
 * @returns {Array<string>}
 */
function buildInstrumentBlock(snapshot) {

  // -----------------------------
  // ① 最新日付取得（historyは古い→新しい順）
  // -----------------------------
  const historyData = snapshot.history.data;
  const latestDate = historyData[historyData.length - 1].date;

  // -----------------------------
  // ② 表示用に数値を整形
  // -----------------------------
  const latest = snapshot.latest.toFixed(2);
  const diff = snapshot.diff.toFixed(2);
  const diffPercent = snapshot.diffPercent.toFixed(2);

  // -----------------------------
  // ③ 符号処理（+ を明示）
  // -----------------------------
  const sign = snapshot.diff >= 0 ? "+" : "";

  // -----------------------------
  // ④ ブロック組み立て
  // -----------------------------
  return [
    `${getSymbolEmoji(snapshot.symbol)} ${snapshot.label} (${latestDate} Close)`,
    `${latest}`,
    `前日比 ${sign}${diff} (${sign}${diffPercent}%)`
  ];
}

/**
 * 銘柄ごとの絵文字を返す
 *
 * @param {string} symbol
 * @returns {string}
 */
function getSymbolEmoji(symbol) {

  const map = {
    USDJPY: "💱",
    SP500: "📈",
    BTC: "₿"
  };

  return map[symbol] || "📊";
}