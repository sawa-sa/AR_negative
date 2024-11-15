// CSVファイルを読み込む関数
async function loadCSVData(url) {
  const response = await fetch(url);
  const text = await response.text();
  const rows = text.trim().split('\n').slice(1); // ヘッダー行を除去

  const data = [];
  rows.forEach(row => {
    const cols = row.split(',');
    if (cols.length >= 3) {
      data.push({
        x: parseFloat(cols[0]),
        y: parseFloat(cols[1]),
        z: parseFloat(cols[2])
      });
    }
  });
  return data;
}

// データを-1〜1の範囲に正規化し、中心を(0,0,0)に配置する関数（比率を保つ）
function normalizeData(data) {
  const mean = { x: 0, y: 0, z: 0 };

  // 各軸の平均を計算して中心化の準備
  data.forEach(point => {
    mean.x += point.x;
    mean.y += point.y;
    mean.z += point.z;
  });
  mean.x /= data.length;
  mean.y /= data.length;
  mean.z /= data.length;

  // 平均を引いてデータを中心化
  const centeredData = data.map(point => ({
    x: point.x - mean.x,
    y: point.y - mean.y,
    z: point.z - mean.z
  }));

  // 各軸の絶対最大値を求める
  const maxAbsValue = Math.max(
    ...centeredData.map(point => Math.max(Math.abs(point.x), Math.abs(point.y), Math.abs(point.z)))
  );

  // 比率を保ったまま最大絶対値でスケーリング
  return centeredData.map(point => ({
    x: point.x / maxAbsValue,
    y: point.y / maxAbsValue,
    z: point.z / maxAbsValue
  }));
}

export { loadCSVData, normalizeData };
