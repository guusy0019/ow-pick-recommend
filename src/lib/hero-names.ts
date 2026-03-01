/**
 * ヒーロー名の日本語（hero.json の表記）→ 英語表示名のマッピング。
 * ロケールが en のときにドロップダウン・おすすめ一覧で表示する用。
 */
export const HERO_JA_TO_EN: Record<string, string> = {
  'バスティオン': 'Bastion',
  'エムレ': 'Emre',
  'ジャンクラット': 'Junkrat',
  'メイ': 'Mei',
  'ソルジャー76': 'Soldier: 76',
  'シンメトラ': 'Symmetra',
  'トールビョーン': 'Torbjörn',
  'アンラン': 'Anran',
  'ゲンジ': 'Genji',
  'リーパー': 'Reaper',
  'トレーサー': 'Tracer',
  'ヴェンデッタ': 'Vantage',
  'ベンチャー': 'Venture',
  'エコー': 'Echo',
  'フレイヤ': 'Freija',
  'ファラ': 'Pharah',
  'ソンブラ': 'Sombra',
  'アッシュ': 'Ashe',
  'キャスディ': 'Cassidy',
  'ハンゾー': 'Hanzo',
  'ソジョーン': 'Sojourn',
  'ウィドウ': 'Widowmaker',
  'D.Va': 'D.Va',
  'ドゥームフィスト': 'Doomfist',
  'ウィンストン': 'Winston',
  'レッキング・ボール': 'Wrecking Ball',
  'マウガ': 'Mauga',
  'オリーサ': 'Orisa',
  'ロードホッグ': 'Roadhog',
  'ザリア': 'Zarya',
  'ドミナ': 'Domina',
  'ハザード': 'Hazard',
  'ジャンカークイーン': 'Junker Queen',
  'ラマットラ': 'Ramattra',
  'ラインハルト': 'Reinhardt',
  'シグマ': 'Sigma',
  'アナ': 'Ana',
  'ジェットパック・キャット': 'Jetpack Cat',
  'ゼニヤッタ': 'Zenyatta',
  'バティスト': 'Baptiste',
  'ルシオ': 'Lucio',
  'イラリー': 'Illari',
  'ウーヤン': 'Wuyang',
  'ジュノ': 'Juno',
  'ブリキッテ': 'Brigitte',
  'ミズキ': 'Mizuki',
  'キリコ': 'Kiriko',
  'マーシー': 'Mercy',
  'モイラ': 'Moira',
  'ライフウィーバー': 'Lifeweaver',
}

/**
 * 表示用ヒーロー名を返す。locale が en のとき英語名、ja のとき日本語名（hero.json の表記）。
 */
export function getHeroDisplayName(
  jaName: string,
  locale: 'ja' | 'en',
): string {
  if (locale === 'ja') return jaName
  return HERO_JA_TO_EN[jaName] ?? jaName
}
