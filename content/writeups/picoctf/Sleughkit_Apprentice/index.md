---
title: Sleughkit Apprentice
date: 2023-10-01
tags: ["picoctf", "sleuthkit", "disk image", "ash history", "shred"]
---

# Sleughkit Apprentice

## Description

Download this disk image and find the flag.
Note: if you are using the webshell, download and extract the disk image into /tmp not your home directory.

## Info

```bash
$ gunzip disk.img.gz
$ mount -o loop disk.img /mnt
$ ls /mnt
```
<https://artifacts.picoctf.net/c/164/disk.img.gz>
Access checker program: `nc saturn.picoctf.net 64605`

```bash
$ nc saturn.picoctf.net 64605
```

1. gunzip disk.img.gz
2. Mounted disk.img to /mnt or use FTK Imager
3. Navigate to root directory and find .ash_history and a folder called `my_folder`
4. Skipping everything else to the end. The my_folder has the file flag.uni.txt with the flag itself.

`picoCTF{by73_5urf3r_2f22df38}`

## Anything past here might as well be theoretical worthless stuff

5. The Ash history file contains the command used to encrypt the flag

```bash
apk add nano
mkdir my_folder
cd my_folder/
nano flag.txt
ls -al
iconv -f ascii -t utf16 > flag.uni.txt
l
ls -al
iconv -f ascii -t utf16 flag.txt > flag.uni.txt
ls -al
shred
shred -zu flag.txt 
ls -al
halt
```

```bash
# Reverse the shredding process (assuming flag.txt was shredded)
shred -u flag.txt

# Reverse the encoding process (assuming flag.txt was originally encoded from ASCII to UTF-16)
iconv -f utf16 -t ascii flag.uni.txt > flag.txt

# View the contents of the recovered file
cat flag.txt
```

## Flag

`picoCTF{by73_5urf3r_2f22df38}`
