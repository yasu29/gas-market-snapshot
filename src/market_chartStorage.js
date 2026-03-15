/**
 * グラフ画像をDriveへ保存し、公開URLを返す
 *
 * 責務：
 * - 専用フォルダ管理
 * - 同名ファイル削除
 * - 新規保存
 * - 公開設定
 *
 * @param {Blob} blob - 画像データ
 * @returns {string} 公開URL
 */
function uploadChartAndGetUrl(blob) {

  const FOLDER_NAME = "MarketCharts";

  // -------------------------------
  // ① フォルダ取得 or 作成
  // -------------------------------
  let folder;
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);

  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    folder = DriveApp.createFolder(FOLDER_NAME);
  }

  const fileName = blob.getName();

  // -------------------------------
  // ② 同名ファイル削除
  // -------------------------------
  const existingFiles = folder.getFilesByName(fileName);

  while (existingFiles.hasNext()) {
    const file = existingFiles.next();
    file.setTrashed(true);
  }

  // -------------------------------
  // ③ 新規保存
  // -------------------------------
  const file = folder.createFile(blob);

  // -------------------------------
  // ④ 公開設定（リンクを知っている全員）
  // -------------------------------
  file.setSharing(
    DriveApp.Access.ANYONE_WITH_LINK,
    DriveApp.Permission.VIEW
  );

  // -------------------------------
  // ⑤ 公開URL生成
  // -------------------------------
  const fileId = file.getId();
  const publicUrl = "https://drive.google.com/uc?id=" + fileId;

  return publicUrl;
}