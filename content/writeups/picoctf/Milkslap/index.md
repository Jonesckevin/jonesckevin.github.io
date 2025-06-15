---
title: Milkslap
date: 2024-01-01T00:00:00+00:00
author: JonesCKevin
tags:
  - PicoCTF
  - Forensics
  - Write-Up
  - Stego
  - Image Analysis
  - PNG
  - Steganography
  - Zlib
  - Zsteg
  - Stego Toolkit
  - Flag
---

## Description

🥛<http://mercury.picoctf.net:16940/>

## Info

Went to website: <http://mercury.picoctf.net:16940/>

- Right Click and download image / html / css / js.
- Saw there was a `http://mercury.picoctf.net:16940/concat_v.png`
  - so I looked around and found a link for it in the Network tab of the developer tools.
  - `curl -O http://mercury.picoctf.net:16940/concat_v.png`
  - This got me the concat_v.png which was a vertical image scene when you move your mouse on the webpage. The image would move.
- The photo itserf doesn't appear to have anything on it's face.

- The hint says: `Look at the problem category`
  - So I went and found PieSlap repository on the persons github and went to the single comment which the owner commented:
`It simply does not work on Firefox. Probably doesn't like what I'm doing with background-position.`

  <https://github.com/boxmein/pieslap/issues/1>

  - So I went to the website CSS and played with the background-position. But this lead no where quick as the photo appears normal.

- Using Binwalk on the very tall PNG gave me the results:
  
DECIMAL  |  HEXADECIMAL  |  DESCRIPTION|
-|-|-|
41|0x29|Zlib compressed data, default compression|
3210141| 0x30FB9D|  MySQL ISAM compressed data file Version 2|

- The MySQL ISAM is likely not a DB and only picked up due to magic number. Files hex ends with IEND so it is likely not a DB.
- Foremost did not extract anything
- Any simple method of looking at it produces no results except for two exorted files using: `binwalk --dd='.*' concat_v.png`

I think my version of Ubuntu is being annoying when trying to install StegotoolKit - <https://github.com/DominicBreuker/stego-toolkit>

So I manually installed a few PNG tools for stego and zteg which is relevant for now.

After finally getting stegotoolkit working,

```bash
sudo docker run -it --rm -v $(pwd)/data:/data dominicbreuker/stego-toolkit /bin/bash
```

```bash
check_jpg.sh image.jpg
```

## Stego ToolKit Results

There is a lot of output so I will summarize:

```########## zsteg ##########
b1,b,lsb,xy         .. text: "picoCTF{imag3_m4n1pul4t10n_sl4p5}\n"
```

## Zteg results

```bash
sudo gem install zsteg
sudo zsteg -a file
```

```c
imagedata           .. file: dBase III DBT, version number 0, next free block index 3368931841, 1st item "\001\001\001\001"
b1,b,lsb,xy         .. text: "picoCTF{imag3_m4n1pul4t10n_sl4p5}\n"
b1,bgr,lsb,xy       .. <wbStego size=9706075, data="\xB6\xAD\xB6}\xDB\xB2lR\x7F\xDF\x86\xB7c\xFC\xFF\xBF\x02Zr\x8E\xE2Z\x12\xD8q\xE5&MJ-X:\xB5\xBF\xF7\x7F\xDB\xDFI\bm\xDB\xDB\x80m\x00\x00\x00\xB6m\xDB\xDB\xB6\x00\x00\x00\xB6\xB6\x00m\xDB\x12\x12m\xDB\xDB\x00\x00\x00\x00\x00\xB6m\xDB\x00\xB6\x00\x00\x00\xDB\xB6mm\xDB\xB6\xB6\x00\x00\x00\x00\x00m\xDB", even=true, mix=true, controlbyte="[">
b2,r,lsb,xy         .. file: SoftQuad DESC or font file binary
b2,r,msb,xy         .. file: VISX image file
b2,g,lsb,xy         .. file: VISX image file
b2,g,msb,xy         .. file: SoftQuad DESC or font file binary - version 15722
b2,b,msb,xy         .. text: "UfUUUU@UUU"
b4,r,lsb,xy         .. text: "\"\"\"\"\"#4D"
b4,r,msb,xy         .. text: "wwww3333"
b4,g,lsb,xy         .. text: "wewwwwvUS"
b4,g,msb,xy         .. text: "\"\"\"\"DDDD"
b4,b,lsb,xy         .. text: "vdUeVwweDFw"
b4,b,msb,xy         .. text: "UUYYUUUUUUUU"
```

## Flag

`picoCTF{imag3_m4n1pul4t10n_sl4p5}`
