+++
title = "Enable Windows BSOD Detail"
date = "2023-01-01"
draft = false
tags = ["registry", "4n6", "digital forensics", "windows forensics"]
categories = ["4n6", "Digital Forensics"]
type = "Artifacts"
author = "JonesCKevin"
seo_title = "Enable Windows BSOD Detailed Information - Registry Forensics Guide"
description = "Step-by-step guide to enabling detailed Blue Screen of Death (BSOD) information in Windows through registry modifications. Essential for forensic analysis, troubleshooting, and crash investigation."
keywords = ["BSOD detail", "Blue Screen of Death", "Windows crash analysis", "registry forensics", "DisplayParameters", "system troubleshooting", "crash dump analysis", "Windows forensics", "DFIR", "error diagnostics", "stop error", "Windows debugging", "forensic investigation"]
canonical = "/artifacts/EnablingWindowsBSODDetail/"
aliases = ["/artifacts/EnablingWindowsBSODDetail/", "/2023/12/windows-mod-enabling-windows-bsod-detail.html"]
featured_image = "/images/featured/RegistryBlock.png"
schema_type = "Article"
+++

![Registry Block](/images/featured/artifacts/RegistryBlock.png)

## Introduction

By default, Windows displays a simple emoticon (smiley face) when a Blue Screen of Death (BSOD) occurs. However,
if you prefer to see detailed information about the error, you can modify specific registry entries. This guide
will walk you through the process.

## Disabling Ads in Windows

### What is it About?

Windows often displays ads and promotes certain apps to users. However, not everyone appreciates this feature.
To gain more control over your Windows experience, you can disable specific apps' promotional activities using
Registry Keys.

### Making the Change

### Windows Registry Edit

Open Registry Editor:
- `Press Win + R, type regedit, and press Enter.`
`Navigate to the Appropriate Key`

#### For CrashControl in ControlSet001:

*`HKLM\SYSTEM\ControlSet001\Control\CrashControl\DisplayParameters`*

#### For CrashControl in CurrentControlSet:

*`HKLM\SYSTEM\CurrentControlSet\Control\CrashControl\DisplayParameters`*

#### For User-Specific Settings:

**Modify the Value:**

For both ControlSet001 and CurrentControlSet, locate or
create a DWORD value named DisplayParameters.
Set the value to 0x00000001.
User-Specific Settings:
For user-specific settings, navigate to the specified
path:

#### Create a new String Value (REG_SZ) named

`pageShowBSODDetails` and set its value to "202312251613518424".

## Implementing Changes

### PowerShell

```powershell
# Set DisplayParameters for ControlSet001
Set-ItemProperty -Path 'HKLM:\SYSTEM\ControlSet001\Control\CrashControl\' -Name 'DisplayParameters' -Value 0x00000001

# Set DisplayParameters for CurrentControlSet

Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\CrashControl\' -Name 'DisplayParameters' -Value 0x00000001
```

### Caution

Modifying the registry is a powerful action that can affect system stability. Always ensure that you have a
backup of your registry or create a system restore point before making changes. Additionally, follow the
instructions carefully to avoid unintended consequences.