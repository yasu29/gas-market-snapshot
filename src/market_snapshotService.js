/**
 * FX Snapshot を構築する
 *
 * 責務：
 * - AlphaからFXデータ取得
 * - 必要データ抽出
 * - 差分計算
 * - 直近N営業日履歴生成
 * - 内部モデル生成
 *
 * @param {string} from - 基軸通貨（例: "USD"）
 * @param {string} to - 相手通貨（例: "JPY"）
 * @param {number} days - 取得営業日数（デフォルト5）
 * @returns {Object} Snapshot内部モデル
 */
function buildFxSnapshot(from, to, days = 5) {

  // -------------------------------
  // ① Alpha API呼び出し（FX_DAILY）
  // -------------------------------
  const raw = alphaRequest({
    function: "FX_DAILY",
    from_symbol: from,
    to_symbol: to,
    outputsize: "compact"
  });

  const series = raw["Time Series FX (Daily)"];

  if (!series) {
    throw new Error("FX time series not found.");
  }

  // -------------------------------
  // ② 日付を明示的にソート（新しい順）
  // -------------------------------
  const sortedDatesDesc = Object.keys(series)
    .sort((a, b) => b.localeCompare(a));

  // -------------------------------
  // ③ データ件数チェック
  // -------------------------------
  if (sortedDatesDesc.length < 2) {
    throw new Error("Insufficient FX data.");
  }

  if (sortedDatesDesc.length < days) {
    throw new Error("Not enough historical data.");
  }

  // -------------------------------
  // ④ 直近N営業日抽出（古い→新しい順）
  // -------------------------------
  const selectedDates = sortedDatesDesc
    .slice(0, days)
    .reverse();

  const history = selectedDates.map(date => ({
    date: date,
    close: Number(series[date]["4. close"])
  }));

  // -------------------------------
  // ⑤ 最新値・前日値取得
  // -------------------------------
  const latest = Number(series[sortedDatesDesc[0]]["4. close"]);
  const previous = Number(series[sortedDatesDesc[1]]["4. close"]);

  // -------------------------------
  // ⑥ 差分計算
  // -------------------------------
  const diff = latest - previous;
  const diffPercent = (diff / previous) * 100;

  // -------------------------------
  // ⑦ 内部モデル返却
  // -------------------------------
  return {
    symbol: from + to,
    label: from + "/" + to,
    latest: latest,
    previous: previous,
    diff: diff,
    diffPercent: diffPercent,
    history: {
      period: days + "d",
      tradingDays: true,
      data: history
    }
  };
}

/**
 * Crypto Snapshot を構築する
 *
 * @param {string} symbol - 仮想通貨（例: "BTC"）
 * @param {string} market - 対象市場（例: "USD"）
 * @param {number} days - 取得日数
 */
function buildCryptoSnapshot(symbol, market, days = 5) {

  const raw = alphaRequest({
    function: "DIGITAL_CURRENCY_DAILY",
    symbol: symbol,
    market: market
  });

  const series = raw["Time Series (Digital Currency Daily)"];

  if (!series) {
    throw new Error("Crypto time series not found.");
  }

  const sortedDatesDesc = Object.keys(series)
    .sort((a, b) => b.localeCompare(a));

  const selectedDates = sortedDatesDesc
    .slice(0, days)
    .reverse();

  // -------------------------------
  // ③ history生成（数値化）
  // -------------------------------
  const history = selectedDates.map(date => {

    const close = Number(series[date]["4. close"]);

    if (isNaN(close)) {
      throw new Error("Invalid crypto close price.");
    }

    return {
      date: date,
      close: close
    };

  });

  // -------------------------------
  // ④ 最新値・前日値取得
  // -------------------------------
  const latest = Number(series[sortedDatesDesc[0]]["4. close"]);
  const previous = Number(series[sortedDatesDesc[1]]["4. close"]);

  if (isNaN(latest) || isNaN(previous)) {
    throw new Error("Invalid crypto snapshot data.");
  }

  // -------------------------------
  // ⑤ 差分計算
  // -------------------------------
  const diff = latest - previous;
  const diffPercent = (diff / previous) * 100;

  return {
    symbol: symbol,
    label: symbol + "/" + market,
    latest: latest,
    previous: previous,
    diff: diff,
    diffPercent: diffPercent,
    history: {
      period: days + "d",
      tradingDays: false,
      data: history
    }
  };
}