---
title: The Clock
author: JonesCKevin
date: 2023-05-21
tags:
- NorthSec
- DFIR
- CTF
- 2023
- The_Clock
- Write-Up
- Montreal
- The Clock
---

[Other Write-Up](https://pymodbus.readthedocs.io/en/latest/source/library/REPL.html)

See [SD Card Data](SDCARD.7z) for more information.

---

## Challenge Walkthrough

### 1. Splash Screen Flag

- When the device boots, a flag flashes very quickly on the splash screen.
- Capture it by recording a video (e.g., with a phone) and extracting the frame.

### 2. Debug Mode & PIN

- The device initially functions as a clock with a serial port option to enable debug mode.
- Debug mode requires a "pin" (a number between 0 and 9999), generated on first boot and unique per device.
- The pin can be brute-forced.

### 3. Debug Commands & Log Flag

- Enabling debug mode reveals several commands; the most useful is `log_level`.
- The flag is logged under the "flag" tag at boot.
- Use `log_level * info` or `log_level flag info` and reboot to see the flag.
- The flag appears as black text on a black background (easier to see on default terminals).

> Return string:  
> _"they say real hackers have black terminals"_

### 4. SD Card & Mount Points

- The `flag` command errors out, referencing `/flags/data/flag.txt` (not mounted).
- The SD card mount point is the FAT partition label.
- Rename the partition to `flags` (using `fatlabel`) to mount at `/flags`.
- If `/flags` is occupied, use `/flags/data` as the mount point (may require hexediting the partition table or modifying `fatlabel`).
- Running the `flag` command again writes a flag to `/flags/flag.txt`.
- To access this, perform a path traversal: create a file (e.g., `aaa`), then hexedit its name to `../` to reach `/flags/data/../`.

> Note:  
> An unintended logic bug allowed unmounting `/flags` by reinserting the SD card, making this step easier.

### 5. Deleted Partition on SD Card

- A deleted partition with a filesystem exists on the SD card.
- Easiest solution: recreate the partition with `fdisk` (default options).
- Harder: locate and `dd` the filesystem, then mount with a loop device.
- This partition contains:
  - Hints for the BLE mesh challenge.
  - An STL model of the screen device with "FLAG" stenciled on the back.
    - Use a 3D printer slicer to split the file; one part contains a tiny flag (scale up to read).

### 6. WiFi AP & Modbus

- The device can enable a WiFi AP.
- A Modbus server runs on port 502.
- Reading the registers reveals the flag.

### 7. BLE Mesh (Unsolved)

- The device screen lists all BLE mesh commands, including "flag request" and "flag response".
- The badges and screens form a BLE mesh network.
- Dumping and disassembling the badge firmware (no ESP secure boot) provides a starting point for interacting with the mesh.
- Most badge/screen code is based on ESP-IDF examples.
- Enabling logs on the screen reveals the BLE mesh `net_key` and `app_key`, needed for mesh interaction.

---
