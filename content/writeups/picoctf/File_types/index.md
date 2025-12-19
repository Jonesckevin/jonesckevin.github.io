---
title: "File Types"
description: "picoCTF Writeup for the File Types challenge involving PDF corruption and bash script analysis."
keywords: ["picoCTF", "File Types", "PDF Analysis", "Bash Script", "File Type Forensics", "picoCTF Writeup", "Flag Retrieval"]
date: 2024-01-01
lastmod: 2024-01-01
draft: false
tags: ["picoCTF", "Writeups", "Forensics", "File Types", "PDF", "Bash"]
type: writeups
categories: ["Writeups"]
seo_title: "File Types - picoCTF File Forensics Writeup"
schema_type: "TechArticle"
sitemap_priority: 0.6
sitemap_changefreq: "monthly"
---

## Description

This file was found among some files marked confidential but my pdf reader cannot read it, maybe yours can.
You can download the file from here.

## Info

1. File is a PDF. Cannot be opened as it is Corrupt or broken of sorts.
2. Looking at the file, it appears to be a bash script. I used a text editor but you can just use `file Flag.pdf`
3. When you run it it gives you 3 options, to choose from. Putting `bash flag.pdf` will export a `flag` file.

```bash
$ bash /mnt/c/Users/forensics/Desktop/Flag.pdf c
x - created lock directory _sh00046.
x - extracting flag (text)
x - removed lock directory _sh00046.
```

1. Checking the file type using `file flag` says this is an archive file.
2. So I opened it in 7zip and extracted it. It is another flag file.
3. Doing `file flag` tells you it's, what ever a cpio archive is, but with another flag file.
4. Then a bzip2 archive
5. Then `flag~` which is a gzip
6. Then an lzip
   1. Might have to apt install lzip to unzip it.
7.  

```bash
sudo apt lzip
sudo apt install lzop

bash Flag.pdf
mv flag flag.ar && ar -x flag.ar && file flag # flag: cpio archive
mv flag flag.cpio && cpio -idv < flag.cpio && file flag # flag: bzip2 compressed data, block size = 900k
mv flag flag.bz2 && bzip2 -d flag.bz2 && file flag # flag: gzip compressed data, was "flag", last modified: Thu Mar 16 01:40:17 2023, from Unix, original size modulo 2^32 327
mv flag flag.gz && gzip -d flag.gz && file flag # flag: lzip compressed data, version: 1
mv flag flag.lzip && lzip -d flag.lzip && file flag.lzip.out #
mv flag.lzip.out flag.lzip && lzip -d flag.lzip && file flag.lzip #lzip: flag.lzip: Bad magic number (file not in lzip format).
mv flag.lzip flag.lz4 && lz4 -d flag.lz4 && file flag # flag: LZMA compressed data, non-streamed, size 254
mv flag flag.lzma && lzma -d flag.lzma && file flag # flag: lzop compressed data - version 1.040, LZO1X-1, os: Unix
mv flag flag.lzo && lzop -d flag.lzo && file flag # flag: lzip compressed data, version: 1
mv flag flag.lzip && lzip -d flag.lzip && file flag.lzip.out # flag.lzip.out: XZ compressed data
mv flag.lzip.out flag.xz && unxz flag.xz && file flag # flag: ASCII text
cat flag
# 7069636f4354467b66316c656e406d335f6d406e3170756c407431306e5f
# 6630725f3062326375723137795f37396230316332367d0a
cat flag | xxd -r -p
# echo "7069636f4354467b66316c656e406d335f6d406e3170756c407431306e5f6630725f3062326375723137795f37396230316332367d0a" | xxd -r -p
```

- Now that you finally reached the final file with data you have:

```txt
7069636f4354467b66316c656e406d335f6d406e3170756c407431306e5f
6630725f3062326375723137795f33343765616536357d0a
```

Doing a convert from hex you get:

`picoCTF{f1len@m3_m@n1pul@t10n_f0r_0b2cur17y_347eae65}`

## Co Pilot data on the script

Here is some notes on the script:

```txt
GitHub Copilot: The script you've shared is a shell archive (shar) file. It's a type of self-extracting archive, which is a form of executable software installer. The shar file contains a series of shell commands that will extract the embedded files when executed.

The script starts by defining some variables and checks for the existence of certain tools (like `md5sum` and `gettext`). It then checks for command-line arguments and sets some more variables based on the system's capabilities.

The main part of the script is the extraction of a file named 'flag'. The file's content is encoded and embedded in the script. The `sed` command is used to remove a leading 'X' from each line of the encoded file, and `uudecode` is used to decode the file. After the file is extracted, its permissions are set to 0644 (read and write for the owner, and read for the group and others).

The script ends by removing the lock directory it created at the beginning.

If you're seeing errors about "Literal carriage return", it's likely because the script was written for a Unix-like system but is being run on a Windows system. Windows uses a different character to represent the end of a line in text files (a carriage return and a line feed, represented as `\r\n`), while Unix-like systems just use a line feed (`\n`). You can convert the file to use Unix-style line endings with a tool like `dos2unix` or the `tr -d '\r'` command mentioned in the error messages.

Here are some suggestions for your next steps:

- If you're trying to run this script, ensure you're doing so in a Unix-like environment. If you're on Windows, you might use a tool like Git Bash, Cygwin, or the Windows Subsystem for Linux.
- If you're trying to understand this script, you might look up the commands it uses in the man pages (`man command_name`).
- If you're seeing errors when running this script, please share the exact error messages for more specific help.
```

## Flag

`picoCTF{f1len@m3_m@n1pul@t10n_f0r_0b2cur17y_79b01c26}`
