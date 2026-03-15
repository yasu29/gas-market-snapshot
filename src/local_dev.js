/**
 * 設定・ログ動作確認用テスト関数
 */
function testConfig() {

  // LINE_TOKENが正しく取得できるか確認
  LoggerService.info("LINE_TOKEN exists?", {
    exists: !!Config.LINE_TOKEN
  });

  // DEBUGログが出力されるか確認
  LoggerService.debug("Log level test");

  LoggerService.debug("LINE_TOKEN length", {
    length: Config.LINE_TOKEN.length
  });
}

function testMessage() {
  const msg = new Message("LINE", "user123", "hello");

  LoggerService.info("Initial state", msg.toObject());

  msg.markForRetry();

  LoggerService.info("After retry", msg.toObject());
}

function testSlack() {

  const factory = new ChannelFactory();
  const service = new NotificationService(factory, null);

  const msg = new Message("SLACK", "general", "hello slack");

  service.send(msg);
}

function testSendSuccess() {

  const spreadsheet = SpreadsheetApp.openById(Config.RETRY_SHEET_ID);
  const sheet = spreadsheet.getSheetByName(Config.RETRY_SHEET_NAME);

  const repo = new RetryRepository(sheet);
  const factory = new ChannelFactory();
  const service = new NotificationService(factory, repo);

  const message = new Message(
    "LINE",
    // "あなたのLINEユーザーID",
    "U716868f5f0fb7e27006ac969fba7b585",
    "通知基盤テスト：成功"
  );

  service.send(message);
}

/**
 * businessSample.gs
 *
 * 通知エンジンの最小利用サンプル。
 * 実務ロジックは含めない。
 *
 * 想定：
 * - 手動実行
 * - トリガー登録
 */


/**
 * LINE通知サンプル
 */
function jobSampleLineNotification() {

  // ScriptPropertiesで指定されたスプレッドシートを開く
  const spreadsheet = SpreadsheetApp.openById(Config.RETRY_SHEET_ID);
  const sheet = spreadsheet.getSheetByName(Config.RETRY_SHEET_NAME);

  const repo = new RetryRepository(sheet);
  const factory = new ChannelFactory();
  const service = new NotificationService(factory, repo);

  const message = new Message(
    "LINE",
    // "Uxxxxxxxxxxxxxxxx", // 自分のユーザーID
    "U716868f5f0fb7e27006ac969fba7b585",
    "LINE通知テスト"
  );

  service.send(message);
}

/**
 * Google Chat通知サンプル
 *
 * ※ Google Workspace 環境でのみ動作
 */
function jobSampleGoogleChatNotification() {

  const spreadsheet = SpreadsheetApp.openById(Config.RETRY_SHEET_ID);
  const sheet = spreadsheet.getSheetByName(Config.RETRY_SHEET_NAME);

  const repo = new RetryRepository(sheet);
  const factory = new ChannelFactory();
  const service = new NotificationService(factory, repo);

  const message = new Message(
    "GOOGLE_CHAT",
    null, // Webhook方式では宛先不要
    "Google Chat通知テスト"
  );

  service.send(message);
}

function test_alphaRequest_fx() {
  try {
    const result = alphaRequest({
      function: "FX_DAILY",
      from_symbol: "USD",
      to_symbol: "JPY",
      outputsize: "compact"
    });

    // レスポンスの主要キー確認
    const keys = Object.keys(result);
    Logger.log("Top-level keys:");
    Logger.log(keys);

    // Time Series が存在するか確認
    if (result["Time Series FX (Daily)"]) {
      Logger.log("FX Daily data found.");
      
      const series = result["Time Series FX (Daily)"];
      const latestDate = Object.keys(series)[0];
      const latestClose = series[latestDate]["4. close"];

      Logger.log("Latest date: " + latestDate);
      Logger.log("Latest close: " + latestClose);
    } else {
      Logger.log("Time Series FX (Daily) not found.");
    }

  } catch (error) {
    Logger.log("Error occurred:");
    Logger.log(error.message);
  }
}

function jobSampleLineNotification_2() {

  const message = "Notification sample";

  // --------------------------------------------
  // ① LINE通知（直書き）
  // --------------------------------------------
  // 現状は直書き。将来的にはConfig化してもよい。
  // const lineUserId = "あなたのLINEユーザーID";
  const lineUserId = "U716868f5f0fb7e27006ac969fba7b585";

  notifyText("LINE", lineUserId, message);

  Logger.log("Starter notification executed.");
}

function testChart() {
  const snapshot = buildFxSnapshot("USD", "JPY", 5);
  const blob = buildLineChartImage(snapshot);
  DriveApp.createFile(blob); // Driveに保存して確認
}

function exportScriptProperties() {

  const props = PropertiesService
    .getScriptProperties()
    .getProperties();

  Logger.log(JSON.stringify(props, null, 2));

}

function setupProperties() {

  const props = PropertiesService.getScriptProperties();

  props.setProperties({
    "RETRY_DEFAULT_BASE_DELAY": "5",
    "RETRY_SHEET_ID": "10DzjKOr7BRbI8A5cUMC9o9gIMkxwm3W4pP3uM8l4HgA",
    "RETRY_DEFAULT_MAX": "3",
    "ALPHA_API_KEY": "SPB5X5YDRGKDYSWR",
    "LINE_USER_ID": "U716868f5f0fb7e27006ac969fba7b585",
    "LINE_TOKEN": "/TCt1MM9Lsegfi/4eKHyF6b8LrkyPsiuwvT5xLMR9RBB+YvNliTiAerEeVG+GpvRq3hzHkbSenxposVFPtEAc1ZgspWKyzBqp3z7CwhIlEGC6oKL3tSbqJHCiAgRL89wfm4meX9K9jPLEZAGVeljtwdB04t89/1O/w1cDnyilFU=",
    "LOG_LEVEL": "DEBUG"
});

}