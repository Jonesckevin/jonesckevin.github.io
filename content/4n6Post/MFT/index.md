+++
title = "MFT"
description = "Complete guide to NTFS Master File Table (MFT) analysis for digital forensics. Learn MFT structure, forensic artifacts, timeline analysis, and tools like MFTECmd for DFIR investigations."
keywords = ["MFT", "Master File Table", "NTFS forensics", "digital forensics", "MFTECmd", "file system forensics", "Windows forensics", "DFIR", "forensic timeline", "MFT records", "file metadata", "$MFT", "forensic artifacts"]
date = "2023-01-01"
lastmod = "2025-09-30"
draft = false
tags = ["4n6", "digital forensics", "windows forensics", "NTFS", "MFT", "DFIR", "MFTECmd", "timeline analysis", "file system", "forensic tools"]
categories = ["4n6", "Digital Forensics", "Windows Forensics", "DFIR"]
type = "4n6post"
seo_title = "MFT Analysis Guide - Master File Table Digital Forensics"
canonical = "/4n6post/mft/"
aliases = ["/4n6post/mft/"]
featured_image = "../images/MFTFile.png"
schema_type = "TechArticle"
author = "JonesCKevin"
sitemap_priority = 0.8
sitemap_changefreq = "monthly"
+++

## MFT Analysis - Master File Table Forensics Guide

![MFT File Overview](../MFT/images/MFTFile.png)

The **$MFT**, or Master File Table, plays a crucial role in the NTFS (New Technology File System) utilized by Windows operating systems. Essentially acting as a master index for all files and directories on an NTFS volume, understanding the nuances of the $MFT file is vital for various professionals, including forensic investigators, system administrators, and security experts. In this blog post, we'll thoroughly explore the $MFT file, examining its structure, functions, and its applications in both normal and potentially malicious scenarios. Additionally, we'll touch upon tools such as MFTECmd.exe by Eric Zimmerman and MACTIME in Linux, highlighting how these tools can be utilized in forensic analysis to parse the $MFT.

## Understanding the $MFT File

The Master File Table is a system file that resides at the heart of NTFS volumes. It contains records for every file and directory on the volume, providing a hierarchical structure and metadata for each entry. The $MFT file is divided into fixed-size entries, each representing a file or directory. These entries include information such as file name, timestamps, permissions, and pointers to the actual data clusters on the disk.

### $MFT File Size and Structure

The size of the $MFT file can vary based on factors such as the size of the volume and the number of files and directories it contains. Generally, the $MFT starts small but expands as more files and directories are created on the NTFS volume. The $MFT file is organized into fixed-size entries, typically 1024 bytes each, and it grows in increments known as MFT records. Understanding the size and structure of the $MFT is crucial for forensic investigators seeking to extract meaningful information from this integral component of the NTFS file system. As of this article, a typical size for a $MFT that is on a regularly used computer tends to be around 250MB to 350MB. The Windows 11 computer I use as an example, is comically huge at a size of 1GB!!!

### Relevant Information within $MFT on NTFS

The $MFT on NTFS contains a wealth of information essential for file system operations and forensic analysis. Each MFT entry holds metadata such as timestamps (creation, modification, and access), file attributes, security descriptors, and pointers to the actual data clusters on the disk. This rich set of data allows investigators to reconstruct timelines, understand file interactions, and delve into the details of file permissions and attributes, providing a comprehensive view of file system activities.

### MFT Zone: A Critical Region

The MFT Zone is a dedicated region on the NTFS volume reserved for the initial placement of $MFT records. This area ensures that the $MFT file remains contiguous, optimizing performance by reducing fragmentation. Forensic analysts often focus on the MFT Zone during investigations, as it can provide valuable insights into the recent file system activities. Analyzing this critical region allows investigators to identify patterns and anomalies, aiding in the detection of suspicious activities.

## Where to Find the $MFT File

Locating the $MFT file is a fundamental step in forensic analysis. In Windows systems, the $MFT is typically found in the root directory of each NTFS volume and is a super hidden system file. The absolute path to the $MFT on the C: drive, and should look like "C:\$MFT". Forensic investigators often create disk images to preserve the state of the file system, and tools like MFTECmd.exe can be employed to parse these images for analysis.

At a deep level, you can find the $MFT file sitting on Logical Sector 1 (Which is the second one after the boot sector) of the each of the NTFS Volume. To help demonstrate this, see below for how to put it together, find it manually using FTKImager and HXD.

1. Even with Super Hidden Files Enabled in Windows 11, the MFT cannot be seen. Using FTKImager or other tools can help you find and or extract the file.

![FTK Imager Hidden Files](../MFT/images/4n6Post_$MFT(1).png)

## Carving Out the $MFT File: From Start to End

Carving out the $MFT file involves extracting its content from a disk image or live file system for further analysis. Forensic tools and techniques are employed to carve out the $MFT, starting from its initial location on the disk. Analysts can use specialized tools like dd (disk dump) or forensic suites to create a copy of the $MFT file. This process involves identifying the signature of the $MFT and extracting its content byte by byte, ensuring the integrity of the data for subsequent forensic analysis. Carving out the $MFT file is a critical step in unraveling the mysteries it holds, allowing investigators to meticulously examine each entry for insights into file system activities.

2. This part is more detailed than you really need and will be it's own post, but I'll add this version here.

In the screenshot below, you can see PHYSICALDRIVE1, in Sector 1 of the drive we have the EFI part section. This is the Partition manager, for the GPT and tracks where all the partitions are on disk.

These are partitions start being listed on at offset 400 or 1024 bytes. Each Partition header is 128 Bytes long (0x80).

![EFI Partition Table](../MFT/images/4n6Post_$MFT(2).png)

![Partition Analysis View](../MFT/images/4n6Post_$MFT(3-1).png)

![Partition Header Details](../MFT/images/4n6Post_$MFT(4-1).png)

3. *The break down of how these are built will be on a new page once I create one, and I will replace this text when it's ready to be linked.*

If we do the math by looking at the Offset for the first partition, it brings us to the below image. You can see in the image that I havn't clicked a partition yet and scrolled down / searched for it. The first and typically the mostly likely area for the first partition is to be at sector 2,048 (0x800).

The following partitions start and end at Hex:

**Partition 1:**
- **Start:** 0x0800
- **End:** 0x827FF

**Partition 2:** *(feel free to try this on the other partitions if you want)*
- **Start:** 0x082800
- **End:** 0x08A7FF
- **Size:** 16,776,704 Bytes (16.7 MB)
  - *( End Sector Minus Start Sector = Sector Size * 512 for Total Size)*
  - *576,295 Minus 534,528 = 41,767*
  - *41,767 * 512 bytes = 16,776,704*

**Partition 3:**
- **Start:** 0x08A800
- **End:** 0x38BB528E

**Partition 4:**
- **Start:** 0x38BB5800
- **End:** 0x38D7C7FF

**Partition 5:**
- **Start:** 0x38D7D000
- **End:** 0x3B97CFFF

**For now you can click on the appropriate partion in FTKimager to logically navigate to where you want to go.**

![Partition Navigation](../MFT/images/4n6Post_$MFT(5).png)

4. Where we want to go is to one of the NTFS partitions. You might notice that in my example, the largest one which is C: Drive is encrypted. This may dampen your style, depending on your scenarios.

What can be seen by looking at this partition is the encrypted value showing **eX FVE-FS which is a nice way to say BitLocker Encrypted.**
- Because I am using the drive, it can be seen unencrypted.
- You will have to mount Encrypted ones separately or use an unencrypted partition for your testing.

![BitLocker Encrypted Partition](../MFT/images/4n6Post_$MFT(6).png)

![Unencrypted NTFS Partition](../MFT/images/4n6Post_$MFT(7).png)

5. Here you can see Partition 4 is not encrypted and allows me to go to the MFT. (FILE0)

- Each MFT Entry starts with FILE0 and the $MFT will always be the very first entry.
  - Starting at Logical Sector 10 (0x2000) of the partition, not the disk.
  - You can see from the image the physical sector is actually 0x38bb5810 (or Sector 951,801,872)
  - If you look back at the Start and End Partition in step 3 you can see that the Partition Starts at 0x38BB5800, which is hex 10 or 16 sectors in difference. Everything appears to line up, which is nice.

![MFT FILE0 Entry](../MFT/images/4n6Post_$MFT(8).png)

![MFT Structure Hex View](../MFT/images/4n6Post_$MFT(9).png)

6. You can see the $MFT file itself, by scrolling to find the attributes.

![MFT File Attributes](../MFT/images/4n6Post_$MFT(10).png)

![MFT File Analysis](../MFT/images/4n6Post_$MFT(11).png)

![MFT Entry Details](../MFT/images/4n6Post_$MFT(12).png)

![MFT Records Structure](../MFT/images/4n6Post_$MFT(13).png)

![MFT Data Analysis](../MFT/images/4n6Post_$MFT(14).png)

## Forensic Analysis Tools

### MFTECmd.exe by Eric Zimmerman

MFTECmd.exe is a powerful command-line tool designed for parsing and analyzing $MFT files. Developed by Eric Zimmerman, this tool extracts metadata from MFT entries and presents the information in a readable format. Forensic investigators can use MFTECmd.exe to reconstruct file timelines, identify deleted files, and gather intelligence about file system activities.

### MACTIME in Linux

MACTIME is a tool within The Sleuth Kit (TSK) that creates a timeline of file system activities based on MAC (Modified, Accessed, Created) timestamps. When used in conjunction with tools like fls and ils, MACTIME can process MFT data extracted from NTFS volumes, providing investigators with a chronological view of file system events.

## Normal Use Cases

In normal operation, the $MFT serves as the backbone of the NTFS file system, facilitating efficient file and directory management. Understanding the normal behavior of the $MFT helps forensic investigators distinguish between legitimate system activities and potentially malicious actions.

### System Performance Optimization

The $MFT contributes to system performance by providing quick access to file metadata. The contiguous layout of MFT records and the reserved MFT Zone ensure efficient file operations, reducing the time required for file system activities.

### File System Integrity

The $MFT plays a crucial role in maintaining file system integrity. Backup copies of critical MFT entries, such as the first few records, help ensure the recoverability of the file system in case of corruption or damage.

## Malicious Use Cases

While the $MFT primarily serves legitimate file system functions, malicious actors can exploit its structure and behavior for nefarious purposes. Understanding these potential misuses is essential for forensic investigators and cybersecurity professionals.

### Anti-Forensics Techniques

Attackers may attempt to manipulate MFT entries to hide their activities or make forensic analysis more challenging. Techniques such as timestamp manipulation, file attribute modification, or deliberate corruption of MFT entries can hinder investigations.

### Data Hiding

The complex structure of the $MFT provides opportunities for sophisticated attackers to hide data within MFT records or use alternate data streams (ADS) to conceal malicious payloads. Understanding these techniques helps investigators uncover hidden evidence.

## Conclusion

The $MFT file stands as a critical component of the NTFS file system, offering a wealth of information for forensic analysis. Whether investigating legitimate system activities or uncovering malicious actions, a thorough understanding of the $MFT structure and behavior is essential for digital forensics professionals. Tools like MFTECmd.exe and MACTIME provide powerful capabilities for extracting and analyzing MFT data, empowering investigators to reconstruct timelines and gather crucial evidence in their pursuit of digital truth.

As technology continues to evolve, so too will the techniques and tools for MFT analysis. Staying current with developments in this field and maintaining a deep understanding of file system internals will remain essential for effective forensic investigations.