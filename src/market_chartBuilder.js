/**
 * Snapshotから折れ線グラフ画像を生成する
 *
 * 責務：
 * - historyデータを抽出
 * - LineChartを構築
 * - PNG Blobを返却
 *
 * @param {Object} snapshot - marketServiceが返す内部モデル
 * @returns {Blob} PNG画像
 */
function buildLineChartImage(snapshot) {

  // -------------------------------
  // ① 履歴データ取得
  // -------------------------------
  const historyData = snapshot.history.data;

  if (!historyData || historyData.length === 0) {
    throw new Error("No history data available for chart.");
  }

  // -------------------------------
  // ② データテーブル構築
  // -------------------------------
  const dataTable = Charts.newDataTable();

  dataTable.addColumn(Charts.ColumnType.STRING, "Date");
  dataTable.addColumn(Charts.ColumnType.NUMBER, snapshot.label);

  historyData.forEach(item => {
    const shortDate = item.date.slice(5); // "MM-DD" 表示
    dataTable.addRow([shortDate, item.close]);
  });

  // -------------------------------
  // ③ LineChart生成
  // -------------------------------
  const chart = Charts.newLineChart()
    .setDataTable(dataTable)
    .setTitle(snapshot.label + " (" + snapshot.history.period + ")")
    .setDimensions(600, 300)
    .setCurveStyle(Charts.CurveStyle.SMOOTH)
    .setPointStyle(Charts.PointStyle.CIRCLE)
    .setLegendPosition(Charts.Position.NONE)
    .build();

  // -------------------------------
  // ④ PNG Blobとして返却
  // -------------------------------
  return chart.getBlob().setName(snapshot.symbol + "_chart.png");
}