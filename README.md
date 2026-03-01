# Fifth（5人目ピック）

Overwatch 5v5 で、味方4人の編成に合わせて「5人目」におすすめのヒーローを表示する Web アプリです。

- **デモ**: [https://guusy0019.github.io/ow-pick-recommend/](https://guusy0019.github.io/ow-pick-recommend/)
- 自分のロールと味方4人を選ぶと、空き枠に合うヒーローを構成タイプ（ダイブ/ラッシュ/ポーク/アンカー）に基づいてレコメンドします。

## 技術スタック

- **Vite** + **React** + **TypeScript**
- **Tailwind CSS v4**（`@tailwindcss/vite`）
- 静的サイト（バックエンドなし）、GitHub Pages でホスティング

## セットアップ

```bash
npm install
npm run dev
```

- 開発: `http://localhost:5173/`（ルートで表示）
- 本番ビルド: `npm run build` → `dist/` に出力（`base: '/ow-pick-recommend/'` 前提）

## スクリプト

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | TypeScript チェック + Vite ビルド |
| `npm run preview` | ビルド成果物のプレビュー |

## デプロイ（GitHub Pages）

- リポジトリの **Settings → Pages** で Source を **GitHub Actions** に設定
- `main` に push すると `.github/workflows/deploy-pages.yml` がビルドし、Pages にデプロイ
- 公開 URL: `https://<ユーザー>.github.io/ow-pick-recommend/`

## プロジェクト構成（抜粋）

```
src/
  App.tsx              # メイン画面（ロール・味方4人選択・設定・おすすめ一覧）
  main.tsx             # エントリ（I18nProvider + App）
  types.ts             # Role, HeroEntry, CompIndex など
  data/
    hero.json          # ヒーロー一覧と構成別相性 ratings（編集の中心）
  lib/
    hero.ts            # 編成計算・レコメンド（flattenHeroes, getRecommendations 等）
    hero-icons.ts      # ヒーロー名 → アイコン画像（HERO_ICON_SLUG, getHeroIconUrl）
    hero-names.ts       # ヒーロー名 日本語↔英語表示（getHeroDisplayName）
  i18n/
    context.tsx        # useI18n, I18nProvider
    locales/ja.ts, en.ts
  components/
    hero-select.tsx    # 味方選択用アイコン付きドロップダウン
    ui/                # card, label, select, badge
public/
  icon.png             # ファビコン
  assets/hero.json     # （必要に応じて公開用コピー）
```

## データ（hero.json）

- **columns**: 構成タイプ `["ダイブ", "ラッシュ", "ポーク", "アンカー"]`
- **data**: 役割（TANK/DPS/SUPPORT）ごとのブロック。各ヒーローは `ratings: [0..3, 0..3, 0..3, 0..3]` で各構成への相性を保持
- ヒーロー追加・相性変更は `src/data/hero.json` を編集

## アイコン

- ヒーローアイコン: `src/assets/heroes/<slug>.png`
- 名前→スラッグの対応は `src/lib/hero-icons.ts` の `HERO_ICON_SLUG`。取得手順などは `docs/hero-icons.md` を参照

## ライセンス

Private / 利用規約に従う
