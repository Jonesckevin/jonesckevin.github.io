+++
title = "4n6Post - Digital Forensics Articles"
date = "2023-01-01"
draft = false
tags = ["4n6", "digital forensics", "windows forensics", "registry analysis", "DFIR"]
categories = ["4n6", "Digital Forensics"]
+++

# 4n6Post Digital Forensics Collection

Welcome to the 4n6Post collection - a comprehensive resource for digital forensics artifacts and Windows registry analysis. These articles provide detailed insights into various Windows forensic artifacts, their locations, and their significance in digital investigations.

## Registry Artifacts

### User Activity Tracking
- **[MRU (Most Recently Used)](/4n6post/mru/)** - Analysis of recently opened files and URLs
- **[runMRU](/4n6post/runmru/)** - Most recently executed applications via Run dialog
- **[TypedPath](/4n6post/typedpath/)** - Manually typed paths in Explorer address bar
- **[WordWheelQuery](/4n6post/wordwheelquery/)** - Windows search queries and terms

### System Information
- **[OS Install Date & Time](/4n6post/osinstalldate&time/)** - Windows installation timestamps
- **[TimeZone Information](/4n6post/timezoneinformation/)** - System timezone settings and changes
- **[Registry Start/Shutdown Count](/4n6post/registry-start-shutdown-count/)** - System boot and shutdown tracking

### File System Artifacts
- **[MFT (Master File Table)](/4n6post/mft/)** - NTFS file system metadata analysis
- **[Prefetch](/4n6post/prefetch/)** - Application execution artifacts
- **[ShortCut (LNK)](/4n6post/shortcut-lnk/)** - Windows shortcut file analysis
- **[JumpList](/4n6post/jumplist/)** - Recent items and application usage
- **[Recycling Bin](/4n6post/recycling.bin-recycler/)** - Deleted file tracking

### Advanced Artifacts
- **[SHIMCACHE](/4n6post/shimcache/)** - Application compatibility cache
- **[UserAssist](/4n6post/userassist/)** - GUI-based program execution tracking
- **[Amcache.hve](/4n6post/amcache.hve/)** - Application installation and execution database
- **[ShellBags](/4n6post/shellbags/)** - Folder access and view preferences

### Hardware & Peripherals
- **[Windows USB Connection](/4n6post/windows-usb-connection/)** - USB device connection history

### System Configuration
- **[Windows Border Size](/4n6post/windows_border_size/)** - UI customization tracking
- **[Windows Generic Installation Keys](/4n6post/windowsgenericinstallationkeys/)** - Installation key information
- **[Ad Disabling Tailored Experience](/4n6post/addisablingtailoredexperience/)** - Privacy settings analysis

### Advanced Analysis
- **[WMI Filter Query Consumer](/4n6post/wmi-filter-query-consumer/)** - WMI persistence mechanisms
- **[SOF-ELK Uploading](/4n6post/sof-elk_uploading/)** - Log analysis and SIEM integration
- **[Enabling Windows BSOD Detail](/4n6post/enablingwindowsbsoddetail/)** - Blue Screen crash analysis

## About These Articles

These articles were originally published on the 4n6Post blog and focus on practical digital forensics techniques for Windows systems. Each article includes:

- **Registry locations** and paths
- **Forensic significance** of each artifact
- **Analysis techniques** and tools
- **SANS poster references** where applicable
- **Practical examples** and screenshots

## Navigation Tips

- Articles are organized by forensic artifact type
- Each article includes relevant tags for easy filtering
- Screenshots and diagrams are included to illustrate key concepts
- Registry paths are highlighted for easy reference

## Contributing

These articles serve as a reference for digital forensics practitioners, law enforcement, and cybersecurity professionals conducting Windows system analysis.

---

*Original content from 4n6Post blog, converted and organized for better accessibility and reference.*