# DESIGN SYSTEM

## Aesthetic
Premium, futuristic, cinematic, minimal. NOT a generic AI SaaS look.

## Tokens (Tailwind extend)
| Token | Value |
|---|---|
| bg | #050505 |
| bg-alt | #08090B |
| surface | #101113 |
| card | #0B0D0E |
| border | #292C2C |
| text | #F2F3F0 |
| muted | #A5A7A3 |
| accent | #C8E9A9 |
| accent-muted | #91B77A |
| purple | #9678C9 (alt realities only) |

## Rules
- Mostly pure black; thin 1px borders; rounded-2xl glass panels (`bg-white/[0.03] backdrop-blur border border-[#292C2C]`)
- No heavy glow, no excess blue/neon
- Font: Inter or Manrope; large clean headings
- Subtle orbit lines (SVG), gentle Framer Motion fades (200 to 400 ms)
- Original reality = sage accent; alternates = purple accent sparingly
- Consistent top nav: Dashboard, Explore, Create Reality, Saved, Archive; user menu holds Profile/Settings
- Responsive: desktop-first, collapses to menu on mobile; right panel becomes bottom sheet

## Planet Visual (MVP)
CSS radial-gradient sphere + SVG orbit ellipses + subtle star dots. Optionally replace with a generated image in `/public/planets/`.

## Components
Button (primary/ghost), Card, Badge, Modal, Spinner, EmptyState, ErrorState, Tabs, Input/Textarea, Toast.
