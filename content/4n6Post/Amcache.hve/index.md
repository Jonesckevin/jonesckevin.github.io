+++
title = "Amcache.hve - Windows Amcache.hve Forensics"
date = "2024-10-01"
draft = false
tags = ["4n6", "digital forensics", "windows forensics", "registry", "DFIR"]
categories = ["4n6", "Digital Forensics"]
type = "4n6post"
author = "JonesCKevin"
seo_title = "Amcache.hve - Windows Amcache.hve Forensics"
description = "An in-depth look at the Amcache.hve registry file and its significance for digital forensic investigations."
keywords = ["Amcache.hve", "Windows Forensics", "Registry Analysis", "Digital Forensics", "DFIR", "Forensic Artifacts"]
canonical = "/4n6Post/Amcache.hve/"
featured_image = "/images/SHIMCache-Logo.png"
schema_type = "Article"
sitemap_priority = 0.7
+++

![Registry Block](../Amcache.hve/images/RegistryBlock.png)

# Enabling Windows BSOD Detail Information

## Introduction

By default, Windows displays a simple emoticon (smiley face) when a Blue Screen of Death (BSOD) occurs. However, if you prefer to see detailed information about the error, you can modify specific registry entries. This guide will walk you through the process.

## Disabling Ads in Windows

### What is it About?

Windows often displays ads and promotes certain apps to users. However, not everyone appreciates this feature. To gain more control over your Windows experience, you can disable specific apps' promotional activities using Registry Keys.

### Making the Change

### Windows Registry Edit

1. Open Registry Editor:
    - Press Win + R, type regedit, and press Enter.
2. Navigate to the Appropriate Key

#### For CrashControl in ControlSet001:

```
HKLM\SYSTEM\ControlSet001\Control\CrashControl\DisplayParameters
```

#### For CrashControl in CurrentControlSet:

```
HKLM\SYSTEM\CurrentControlSet\Control\CrashControl\DisplayParameters
```

#### For User-Specific Settings:

```
HKU\<SID-RID>\SOFTWARE\Winaero.com\Winaero Tweaker\Changes
```

- Modify the Value:
  - For both ControlSet001 and CurrentControlSet, locate or create a DWORD value named DisplayParameters.
  - Set the value to 0x00000001.
- User-Specific Settings:
  - For user-specific settings, navigate to the specified path:

```
HKU\<SID-RID>\SOFTWARE\Winaero.com\Winaero Tweaker\Changes
```

  - Create a new String Value (REG_SZ) named pageShowBSODDetails and set its value to "202312251613518424".

## Implementing Changes

### PowerShell

```powershell
# Set DisplayParameters for ControlSet001
Set-ItemProperty -Path 'HKLM:\SYSTEM\ControlSet001\Control\CrashControl\' -Name 'DisplayParameters' -Value 0x00000001

# Set DisplayParameters for CurrentControlSet
Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\CrashControl\' -Name 'DisplayParameters' -Value 0x00000001

# Set user-specific BSOD details
$regPath = 'HKU:\S-1-5-21-685282480-2200850043-2854793132-1001\SOFTWARE\Winaero.com\Winaero Tweaker\Changes'
New-Item -Path $regPath -Force
Set-ItemProperty -Path $regPath -Name 'pageShowBSODDetails' -Value '202312251613518424'
```

### Caution

Modifying the registry is a powerful action that can affect system stability. Always ensure that you have a backup of your registry or create a system restore point before making changes. Additionally, follow the instructions carefully to avoid unintended consequences.
