+++
title = "Ad Disabling Tailored Experience"
date = "2023-01-01"
draft = false
tags = ["4n6", "digital forensics", "windows forensics", "registry", "DFIR"]
categories = ["4n6", "Digital Forensics"]
+++

![Registry Block](/RegistryBlock.png)

# Customizing Windows: Ad Disabling and Tailored Experience

## Introduction
`
In the realm of Windows customization, users often seek ways to tailor their experience to suit personal
preferences. This blog post explores a specific aspect of this customization - the modification of registry keys
to disable ads in Windows and control tailored experiences.
## Disabling Ads in Windows

### What is it About?

Windows often displays ads and promotes certain apps to users. However, not everyone appreciates this feature.
To gain more control over your Windows experience, you can disable specific apps' promotional activities using
Registry Keys.

## ### Where to Make the Change?

The changes are made in the Windows Registry, a database that stores low-level settings for the Windows
operating system. Below are the keys associated with disabling ads and controlling tailored experiences:

### Disable Ads:

*`HKU\&lt;SID-RID&gt;\SOFTWARE\Microsoft\Windows\CurrentVersion\`***AdvertisingInfo\Enabled**

### Tailored

Experiences Control:
*`HKU\&lt;SID-RID&gt;\SOFTWARE\Microsoft\Windows\CurrentVersion\`***ContentDeliveryManager\** :
**RotatingLockScreenEnabled**
RotatingLockScreenOverlayEnabled
SoftLandingEnabled
SystemPaneSuggestionsEnabled
SubscribedContent-338387Enabled
SubscribedContent-310093Enabled
SubscribedContent-338393Enabled
SubscribedContent-314563Enabled
## Implementing Changes

### RegEdit:

Open the Registry Editor by pressing Win + R, typing regedit, and hitting Enter.
Navigate to the specified key path.
Modify the values as needed.

### PowerShell

```powershell
# Disable Ads
Set-ItemProperty -Path 'HKU\S-1-5-21-685282480-2200850043-2854793132-1001\SOFTWARE\Microsoft\Windows\CurrentVersion\AdvertisingInfo\' -Name 'Enabled' -Value 0

# Control Tailored Experiences (example for RotatingLockScreenEnabled)

Set-ItemProperty -Path 'HKU\S-1-5-21-685282480-2200850043-2854793132-1001\SOFTWARE\Microsoft\Windows\CurrentVersion\ContentDeliveryManager\' -Name 'RotatingLockScreenEnabled' -Value 0
```
### Python

```python
import winreg

# Disable Ads

key_path_ads = r'S-1-5-21-685282480-2200850043-2854793132-1001\SOFTWARE\Microsoft\Windows\CurrentVersion\AdvertisingInfo'
winreg.SetValueEx(winreg.HKEY_USERS, key_path_ads, 0, winreg.REG_DWORD, 0)

# Control Tailored Experiences (example for RotatingLockScreenEnabled)

key_path_tailored = r'S-1-5-21-685282480-2200850043-2854793132-1001\SOFTWARE\Microsoft\Windows\CurrentVersion\ContentDeliveryManager'
winreg.SetValueEx(winreg.HKEY_USERS, key_path_tailored, 'RotatingLockScreenEnabled', winreg.REG_DWORD, 0)
```

## Potential Risks

While customization is a powerful tool, it's essential to be cautious. Disabling certain features, especially
those related to advertising, may impact the functionality of some Windows features. Always create a backup of
your registry before making changes.