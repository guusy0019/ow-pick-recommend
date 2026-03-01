/**
 * ヒーロー名（hero.json の表記）→ アイコンファイル名（拡張子なし）のマッピング。
 * src/assets/heroes/<slug>.png を置くと、おすすめ一覧などでアイコンが表示されます。
 * アイコンの入手方法は docs/hero-icons.md を参照。
 */
export const HERO_ICON_SLUG: Record<string, string> = {
  'バスティオン': 'bastion',
  'エムレ': 'emre',
  'ジャンクラット': 'junkrat',
  'メイ': 'mei',
  'ソルジャー76': 'soldier-76',
  'シンメトラ': 'symmetra',
  'トールビョーン': 'torbjorn',
  'アンラン': 'anran',
  'ゲンジ': 'genji',
  'リーパー': 'reaper',
  'トレーサー': 'tracer',
  'ヴェンデッタ': 'vendetta',
  'ベンチャー': 'venture',
  'エコー': 'echo',
  'フレイヤ': 'freija',
  'ファラ': 'pharah',
  'ソンブラ': 'sombra',
  'アッシュ': 'ashe',
  'キャスディ': 'cassidy',
  'ハンゾー': 'hanzo',
  'ソジョーン': 'sojourn',
  'ウィドウ': 'widowmaker',
  'D.Va': 'dva',
  'ドゥームフィスト': 'doomfist',
  'ウィンストン': 'winston',
  'レッキング・ボール': 'wrecking-ball',
  'マウガ': 'mauga',
  'オリーサ': 'orisa',
  'ロードホッグ': 'roadhog',
  'ザリア': 'zarya',
  'ドミナ': 'domina',
  'ハザード': 'hazard',
  'ジャンカークイーン': 'junker-queen',
  'ラマットラ': 'ramattra',
  'ラインハルト': 'reinhardt',
  'シグマ': 'sigma',
  'アナ': 'ana',
  'ジェットパック・キャット': 'jetpack-cat',
  'ゼニヤッタ': 'zenyatta',
  'バティスト': 'baptiste',
  'ルシオ': 'lucio',
  'イラリー': 'illari',
  'ウーヤン': 'wuyang',
  'ジュノ': 'juno',
  'ブリキッテ': 'brigitte',
  'ミズキ': 'mizuki',
  'キリコ': 'kiriko',
  'マーシー': 'mercy',
  'モイラ': 'moira',
  'ライフウィーバー': 'lifeweaver',
}

const iconModules = import.meta.glob<string>('/src/assets/heroes/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

const slugToUrl = new Map<string, string>()
for (const [path, url] of Object.entries(iconModules)) {
  const match = (path as string).match(/\/([^/]+)\.png$/)
  if (match && typeof url === 'string') slugToUrl.set(match[1], url)
}

/** ヒーロー名からアイコンURLを取得。画像が無い場合は null */
export function getHeroIconUrl(heroName: string): string | null {
  const slug = HERO_ICON_SLUG[heroName]
  if (slug && slugToUrl.has(slug)) return slugToUrl.get(slug)!
  return slugToUrl.get(heroName) ?? null
}
