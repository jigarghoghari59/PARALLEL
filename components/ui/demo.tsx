"use client"

import * as React from "react"
import JournalSpreadCarousel, { type JournalSpread } from "@/components/ui/journal-spread-carousel"

// Free Unsplash photos of Lisbon, Sintra, Aveiro and the Algarve, packed into two AVIF
// sheets so the demo fetches nothing off-origin. They are cut back into separate
// same-origin images on load. In your app, pass plain image URLs instead.
//
// Spread sheet (2 x 4 tiles, 640 x 512), unsplash.com/photos/<id>:
//   1665091982331-e66db14feae6, 1559315542-780c225b5239, 1565865735988-fd5752a02846, 1486571698588-a2204703bec8
//   1559163806-3ca824710bf8, 1531772337062-9d94547f333f, 1526737511523-ba685f246e8c, 1525155000528-d926bd2a3755
// Print sheet (4 x 4 tiles, 180 x 225):
//   1562250883-5b8fa0be26ab, 1582407672718-3429c4b2c39d, 1791719229657-ec16750a5a2d, 1562195168-c82fea0f0953
//   1751808862930-d839da90d0e1, 1721639713587-f4ae92bba42f, 1536663205865-cc64102c5e0d, 1562762562-8670c946876c
//   1548884642-f00c2df80668, 1769013556856-e70c58c9db8a, 1650557175315-05ad335468f2, 1608649944716-228404a0a8bb
//   1655986406308-bfa317b6302b, 1649257701313-be3fb439987d, 1712581566227-1e5277055cac, 1660403269439-383de3c8e3cc
const SPREAD_SHEET = "data:image/avif;base64,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"

// Slice an atlas image into individual Object URLs so the component can consume them as plain images.
function useAtlas(src: string, cols: number, rows: number): string[] {
  const [urls, setUrls] = React.useState<string[]>([])
  React.useEffect(() => {
    let alive = true
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      if (!alive) return
      const tileW = Math.floor(img.naturalWidth / cols)
      const tileH = Math.floor(img.naturalHeight / rows)
      const canvas = document.createElement("canvas")
      canvas.width = tileW
      canvas.height = tileH
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      const next: string[] = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          ctx.clearRect(0, 0, tileW, tileH)
          ctx.drawImage(img, c * tileW, r * tileH, tileW, tileH, 0, 0, tileW, tileH)
          next.push(canvas.toDataURL("image/jpeg", 0.88))
        }
      }
      if (alive) setUrls(next)
    }
    img.src = src
    return () => {
      alive = false
    }
  }, [src, cols, rows])
  return urls
}

export default function Demo() {
  const bg = useAtlas(SPREAD_SHEET, 2, 4)
  const pr = useAtlas(PRINT_SHEET, 4, 4)

  const spreads: JournalSpread[] = React.useMemo(
    () => [
      {
        id: "cover",
        label: "Cover",
        paper: "#242838",
        image: bg[0],
        notes: [
          {
            x: 52,
            y: 46,
            w: 40,
            title: "Portugal",
            body: "Spring road trip — Lisbon to the Algarve via Sintra and the coast.",
            rotate: -2,
            style: "card",
          },
        ],
      },
      {
        id: "alfama",
        label: "Alfama, Lisbon",
        image: bg[1],
        prints: [
          { src: pr[0] ?? "", x: 6, y: 14, w: 22, rotate: -4, caption: "tram 28" },
          { src: pr[1] ?? "", x: 26, y: 48, w: 20, rotate: 3, caption: "miradouro" },
          { src: pr[2] ?? "", x: 74, y: 18, w: 20, rotate: -2, tape: true, caption: "pastel de nata" },
        ],
        notes: [
          {
            x: 52,
            y: 62,
            w: 38,
            title: "Morning in Alfama",
            body: "Steep cobblestones, laundry lines overhead, espresso at every corner.",
            rotate: 1,
            style: "card",
          },
        ],
      },
      {
        id: "sintra",
        label: "Sintra & Pena Palace",
        image: bg[2],
        prints: [
          { src: pr[3] ?? "", x: 10, y: 22, w: 24, rotate: 4, caption: "yellow towers" },
          { src: pr[4] ?? "", x: 68, y: 40, w: 22, rotate: -3, caption: "mossy gardens" },
        ],
        notes: [
          {
            x: 36,
            y: 18,
            w: 30,
            title: "Pena Palace",
            body: "Fog rolling through the pines, bright colours cutting the mist.",
            rotate: -1,
            style: "card",
          },
        ],
      },
      {
        id: "costa-nova",
        label: "Costa Nova & Aveiro",
        image: bg[3],
        prints: [
          { src: pr[5] ?? "", x: 8, y: 12, w: 20, rotate: -2, tape: true, caption: "striped palheiros" },
          { src: pr[6] ?? "", x: 24, y: 44, w: 22, rotate: 2, caption: "aveiro canals" },
          { src: pr[7] ?? "", x: 72, y: 18, w: 22, rotate: -4, caption: "salt flats" },
        ],
        notes: [
          {
            x: 54,
            y: 56,
            w: 38,
            title: "Striped cottages",
            body: "Candy stripes along the lagoon, fishing boats painted like folk art.",
            rotate: 2,
            style: "card",
          },
        ],
      },
      {
        id: "ericeira",
        label: "Ericeira",
        image: bg[4],
        prints: [
          { src: pr[8] ?? "", x: 12, y: 26, w: 24, rotate: -3, caption: "atlantic swells" },
          { src: pr[9] ?? "", x: 66, y: 16, w: 22, rotate: 4, caption: "cliff walk" },
        ],
        notes: [
          {
            x: 38,
            y: 60,
            w: 32,
            title: "Salt air",
            body: "Huge surf breaks, cold wind, fresh grilled sardines by the harbour.",
            rotate: -2,
            style: "card",
          },
        ],
      },
      {
        id: "algarve-caves",
        label: "Algarve & Benagil",
        image: bg[5],
        prints: [
          { src: pr[10] ?? "", x: 8, y: 14, w: 22, rotate: 3, caption: "benagil dome" },
          { src: pr[11] ?? "", x: 26, y: 46, w: 22, rotate: -2, tape: true, caption: "sea arches" },
          { src: pr[12] ?? "", x: 70, y: 24, w: 22, rotate: 2, caption: "marinha trail" },
        ],
        notes: [
          {
            x: 52,
            y: 62,
            w: 38,
            title: "Golden cliffs",
            body: "Kayaking through the arches at low tide, crystal water inside the caves.",
            rotate: -1,
            style: "card",
          },
        ],
      },
      {
        id: "sagres",
        label: "Sagres & End of the World",
        image: bg[6],
        prints: [
          { src: pr[13] ?? "", x: 14, y: 18, w: 24, rotate: -4, caption: "cape st vincent" },
          { src: pr[14] ?? "", x: 64, y: 44, w: 22, rotate: 3, caption: "lighthouse glow" },
        ],
        notes: [
          {
            x: 38,
            y: 20,
            w: 30,
            title: "Cabo de São Vicente",
            body: "The southwestern tip of Europe. Fierce winds and endless horizon.",
            rotate: 1,
            style: "card",
          },
        ],
      },
      {
        id: "back-cover",
        label: "Back cover",
        paper: "#242838",
        image: bg[7],
        prints: [
          { src: pr[15] ?? "", x: 38, y: 22, w: 24, rotate: -2, tape: true, caption: "until next time" },
        ],
        notes: [
          {
            x: 32,
            y: 66,
            w: 36,
            body: "April 2024 · 1,420 km · roll #04",
            rotate: 0,
            style: "ink",
          },
        ],
      },
    ],
    [bg, pr],
  )

  return (
    <div className="w-full min-h-screen bg-[#242838]">
      <JournalSpreadCarousel
        spreads={spreads}
        title="Portugal '24"
        meta="8 Spreads · 16 Pages"
        height="100svh"
      />
    </div>
  )
}
