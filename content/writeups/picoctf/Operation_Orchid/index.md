---
title: Operation_Orchid
date: 2024-01-01T00:00:00+00:00
author: JonesCKevin
tags:
  - PicoCTF
  - Forensics
  - Write-Up
  - Disk Image
  - Flag
  - Encryption
  - OpenSSL
  - Ash History
  - Command History
  - File Decryption
  - File Analysis
---

## Description

Download this image and find the flag.

<https://artifacts.picoctf.net/c/216/pico.flag.png>

## Info

1. gunzip disk.img.gz
1. Mounted disk.img to /mnt or use FTK Imager
1. Navigate to root directory and find flag.txt.enc and .ash_history
1. The Ash history file contains the command used to encrypt the flag

```bash
touch flag.txt
nano flag.txt 
apk get nano
apk --help
apk add nano
nano flag.txt 
openssl
openssl aes256 -salt -in flag.txt -out flag.txt.enc -k unbreakablepassword1234567
shred -u flag.txt
ls -al
halt
```

1.  Export these or just use the command to get the flag.txt
1.  cat the flag.txt

```bash
# Decrypt the encrypted file
openssl aes256 -d -in flag.txt.enc -out flag.txt -k unbreakablepassword1234567

# View the contents of the decrypted file
cat flag.txt
```

## Flag

`picoCTF{h4un71ng_p457_5113beab}`
