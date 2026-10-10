# Multfilmlar (lokal videolar)

Bu papkaga **ixtiyoriy** ravishda bolalar uchun multfilm/video fayllar qo'yishingiz mumkin.
Fayl nomi `CartoonsPage.jsx` dagi `key` ga mos kelishi kerak:

| key                | izoh                          |
| ------------------ | ----------------------------- |
| `abc-phonics`      | ABC phonics qo'shig'i         |
| `abc-a-z`          | ABC A–Z harflar               |
| `letter-n-akili`   | "N" harfi — Akili bilan       |
| `jkl-chuchu`       | JKL harflari — ChuChu TV      |
| `phonics-food`     | Phonics A-Z                   |
| `count-1to10`      | 1 dan 10 gacha sanash         |
| `numbers-1to10`    | Raqamlar 1–10                 |
| `numbers-counting` | Sonlarni sanash to'plami      |
| `numbers-1to20`    | 1 dan 20 gacha raqamlar       |
| `numbers-lucas`    | Raqamlar — Lucas & Friends    |
| `colors-patty`     | Ranglar qo'shig'i             |
| `colors-rainbow`   | Kamalak ranglari              |
| `colors-nunu`      | Ranglar — NuNu TV             |
| `colors-canticos`  | De Colores — Canticos         |
| `baby-shark`       | Baby Shark Dance              |
| `baby-shark-top7`  | Baby Shark — TOP 7            |

## Format

- `\.mp4` — asosiy format (barcha brauzerlar qo'llab-quvvatlaydi)
- `\.webm` — zaxira format (ixtiyoriy)

Misol:
```
public/videos/abc-phonics.mp4
public/videos/baby-shark.mp4
```

Agar fayl topilmasa, sahifa avtomatik ravishda **YouTube** (youtube-nocookie) embed'iga o'tadi,
shuning uchun internet bo'lmasa ham sayt ishlashda davom etadi.
