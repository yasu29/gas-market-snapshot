/**
 * Market Snapshot 用 設定クラス
 *
 * 責務：
 * - ScriptProperties から設定値を取得する窓口
 * - Market Snapshot アプリケーション固有設定を管理
 *
 * 設計方針：
 * - ScriptProperties への直接アクセスを他ファイルから排除
 * - 設定取得ロジックを一元管理
 *
 * 管理対象：
 * - Alpha Vantage APIキー
 * - LINEユーザーID（通知利用時）
 */
class MarketConfig {

  /**
   * Alpha Vantage APIキー
   *
   * ScriptProperty:
   * ALPHA_API_KEY
   */
  static get ALPHA_API_KEY() {

    const value = PropertiesService
      .getScriptProperties()
      .getProperty("ALPHA_API_KEY");

    if (!value) {
      throw new Error("ALPHA_API_KEY is not set.");
    }

    return value;
  }


  /**
   * LINEユーザーID
   *
   * ScriptProperty:
   * LINE_USER_ID
   *
   * ※通知基盤利用時のみ使用
   */
  static get LINE_USER_ID() {

    const value = PropertiesService
      .getScriptProperties()
      .getProperty("LINE_USER_ID");

    if (!value) {
      throw new Error("LINE_USER_ID is not set.");
    }

    return value;
  }

}