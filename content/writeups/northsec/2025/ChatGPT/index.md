---
layout: post
title: "ChatGPT"
subtitle: "NorthSec 2025"
author: JonesCKevin
date: 2025-05-24
tags:
- NorthSec
- AI
- CTF
- 2025
- ChatGPT
- Write-Up
- Montreal
---

## Potential Flag Data

```md
NOHRVPX11JGCF
LYRZIDU8LV9478OA
```

---

## Flag 1

**Flag:** `FLAG-LYRZIDU8LV9478OA`

![ChatGPT_Video_Still](1.png)

> Your team submitted flag "metadata chapters" for 0 point!  
> [video] 1/4 To construct the flag you need `FLAG-` concat with florence2 output from drumm cover concat with the other drumm string from VP to the end.

---

## Flag 2

You can find Flag two by looking at the Chapter Name in the video player or using `strings`.

**Flag:** `Chapter 2: FLAG-HK28BQZ2RDFZ0N6F`

![Image2](2.png)

![Image3](3.png)

![Image4](4.png)

---

## Flag 3

You can extract the PNG from the video using a bunch of different methods. Formost, Binwalk, Scalpel, etc.

![Image5](5.png)

I have attached the [PNG](5.png) extracted from the video along with the MetaData of the PNG in the [textfile](chatgpt_png.txt).

Video: [https://photos.app.goo.gl/CWwXqJ58m3rqHpKr8](https://photos.app.goo.gl/CWwXqJ58m3rqHpKr8)

## Notes

**From Creator:**

### ComfyUI - Steps for a Fresh Run

1. **Run ComfyUI.**
2. **Drag and drop** the extracted image into ComfyUI.
3. **Install missing nodes** (if prompted), then restart ComfyUI.
4. **Add the node**: `fairy-root_ComfyUI-Show-Text`.
5. **Link** `fairy-root_ComfyUI-Show-Text` to the `Florence2Run` caption output.
6. **Click "Run".**
7. **Check the Show Text UI** for `VQA>`.
8. If you see `VQA>`, **look at the logs**.
9. In the logs, you should find:  
    `</s><s>VQA>FLKUKUAB</s>`

[COMFYUI Download for Windows Portable](https://objects.githubusercontent.com/github-production-release-asset-2e65be/589831718/13676d9f-ae8f-4b2f-b64c-d1997e41d703?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=releaseassetproduction%2F20250520%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250520T232118Z&X-Amz-Expires=300&X-Amz-Signature=33b17af60370d5be1d102a2817a04fb3aa9309e171bd0805b5196052c231c450&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3DComfyUI_windows_portable_nvidia.7z&response-content-type=application%2Foctet-stream)

---

**Final Rebuilt:** `FLAG-FLKUKUABVPX11JGCF`
