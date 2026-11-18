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
const PRINT_SHEET = "data:image/avif;base64,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"

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
