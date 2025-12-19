---
title: "RED"
description: "picoCTF Writeup for the RED challenge involving image steganography and color channel analysis."
keywords: ["picoCTF", "RED", "Steganography", "Image Analysis", "Color Channels", "PNG Forensics", "picoCTF Writeup", "Flag Retrieval"]
date: 2025-10-24
lastmod: 2025-10-24
draft: false
tags: ["picoCTF", "Writeups", "Forensics", "Steganography", "Image Analysis"]
type: writeups
categories: ["Writeups"]
seo_title: "RED - picoCTF Image Steganography Writeup"
schema_type: "TechArticle"
sitemap_priority: 0.6
sitemap_changefreq: "monthly"
---

## Description

**Author:** Shuailin Pan (LeConjuror)

_Description_  

RED, RED, RED, RED  

Download the image:
![RED_Image](red.png)

<https://challenge-files.picoctf.net/c_verbal_sleep/831307718b34193b288dde31e557484876fb84978b5818e2627e453a54aa9ba6/red.png>

---

## What I did

1. First it's always a good idea to check out if the file claims to be what it is by using `file` command

```bash
file red.png

# red.png: PNG image data, 128 x 128, 8-bit/color RGBA, non-interlaced
```

2. I Checked Metadata with Exiftool and cat
```bash
sudo apt install libimage-exiftool-perl
exiftool red.png
cat red.png
```

```yaml
ExifTool Version Number         : 12.76
File Name                       : red.png
Directory                       : .
File Size                       : 796 bytes
File Modification Date/Time     : 2025:10:24 15:29:07-04:00
File Access Date/Time           : 2025:10:24 15:32:49-04:00
File Inode Change Date/Time     : 2025:10:24 15:29:07-04:00
File Permissions                : -rwxrwxrwx
File Type                       : PNG
File Type Extension             : png
MIME Type                       : image/png
Image Width                     : 128
Image Height                    : 128
Bit Depth                       : 8
Color Type                      : RGB with Alpha
Compression                     : Deflate/Inflate
Filter                          : Adaptive
Interlace                       : Noninterlaced
Poem                            : Crimson heart, vibrant and bold,.Hearts flutter at your sight..Evenings glow softly red,.Cherries burst with sweet life..Kisses linger with your warmth..Love deep as merlot..Scarlet leaves falling softly,.Bold in every stroke.
Image Size                      : 128x128
Megapixels                      : 0.016
```

```
�PNG
␦
IHDR��>a��tEXtPoemCrimson heart, vibrant and bold,
Hearts flutter at your sight.
Evenings glow softly red,
Cherries burst with sweet life.
Kisses linger with your warmth.
Love deep as merlot.
Scarlet leaves falling softly,
Bold in every stroke.x���IDATx���Kr1Q)�?3���"�A��P0��M�վ�4ݒ6ɚݟ�5ɒ$M�4i��'�zO��K�-k֤;×���;9M�$]����=���M��v�γ��ri��՞��=��y�{������_zN�{Yٙ���_�s��y�!���}�g�;-�����R�x�~�����n�y��o��8����;P$gpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgp߱�v�&�֑IEND�B`�
```

1. From the poem in the metadata, I noticed certain words that could be colors: Crimson, Red, Cherries, Merlot, Scarlet. This gave me: `CRCMS` which turned to be nothing.
2. But if you take the capital letters of those words: provided you get `CHECKLSB` which means to check the least significant bit of the image.

```bash
echo "Crimson heart, vibrant and bold,.Hearts flutter at your sight..Evenings glow softly red,.Cherries burst with sweet life..Kisses linger with your warmth..Love deep as merlot..Scarlet leaves falling softly,.Bold in every stroke." | zsteg -E 'b1,r,lsb,xy' red.png
```
`checklsb`

3. I used zsteg to check the least significant bit of the image. 

```bash
sudo apt update
sudo apt install ruby
sudo gem install zsteg
```

```bash
zsteg --lsb red.png
```

```yaml
meta Poem           .. text: "Crimson heart, vibrant and bold,\nHearts flutter at your sight.\nEvenings glow softly red,\nCherries burst with sweet life.\nKisses linger with your warmth.\nLove deep as merlot.\nScarlet leaves falling softly,\nBold in every stroke."
b1,rgba,lsb,xy      .. text: "cGljb0NURntyM2RfMXNfdGgzX3VsdDFtNHQzX2N1cjNfZjByXzU0ZG4zNTVffQ==cGljb0NURntyM2RfMXNfdGgzX3VsdDFtNHQzX2N1cjNfZjByXzU0ZG4zNTVffQ==cGljb0NURntyM2RfMXNfdGgzX3VsdDFtNHQzX2N1cjNfZjByXzU0ZG4zNTVffQ==cGljb0NURntyM2RfMXNfdGgzX3VsdDFtNHQzX2N1cjNfZjByXzU0ZG4zNTVffQ=="
b2,g,lsb,xy         .. text: "ET@UETPETUUT@TUUTD@PDUDDDPE"
b2,rgb,lsb,xy       .. file: OpenPGP Secret Key
b2,rgba,lsb,xy      .. file: OpenPGP Secret Key
b2,abgr,lsb,xy      .. file: OpenPGP Secret Key
b4,b,lsb,xy         .. file: 0421 Alliant compact executable not stripped
```

4. I found a hidden base64 message in the least significant bits.

What is the LSB?
This is the smallest part of a pixel’s data. It’s often used to hide info because changing it doesn’t noticeably affect the image. One way to find hidden data is to look at the LSBs of the color channels (Red, Green, Blue, Alpha) in the image pixels. In this case, the hidden message was in the LSB of the RGBA channels of the image. and visible in a photo would be very minimal difference in color.

You can see here what it kinda looks like visibly but it's not helpful on it's own, which is why you check the LSBs directly with a tool like zsteg.

![LSB_Visualization](red_lsb_visible.png)


You will be provided with `cGljb0NURntyM2RfMXNfdGgzX3VsdDFtNHQzX2N1cjNfZjByXzU0ZG4zNTVffQ==`

1. Decoding the base64 string gives the flag.

```bash
echo "cGljb0NURntyM2RfMXNfdGgzX3VsdDFtNHQzX2N1cjNfZjByXzU0ZG4zNTVffQ==" | base64 -d

# picoCTF{r3d_1s_th3_ult1m4t3_cur3_f0r_54dn355_}
```

---

### Extra Resource:

If you are up for cheating you can use this online tool to extract LSB data:  
<https://www.aperisolve.com/>