

## General CTF Resources

|  | External Resource & Notes / Cheat Sheets  |
|---------|------------------------|
| **Getting Started**     | [How to install Kali Linux in VMware Player + VMware Tools](https://www.shaileshjha.com/how-to-install-kali-linux-in-vmware-player-vmware-tools/)   |
|                         | [How to install Kali Linux on VirtualBox](https://www.nakivo.com/blog/how-to-install-kali-linux-on-virtualbox/) |
|                         | [First CTF Info and Setup](https://berzerk0.github.io/GitPage/How-To-Guides/FirstCTF_1of2_InfoAndSetup.html)    |
| **Preparation Guides**  | [What exactly is CTF and how can I prepare?](https://security.stackexchange.com/questions/193004/what-exactly-is-ctf-and-how-can-i-as-programmer-prepare-for-a-ctf-with-beginner) |
|                         | [How to prepare for a Capture the Flag hacking competition](https://www.cbtnuggets.com/blog/training/exam-prep/how-to-prepare-for-a-capture-the-flag-hacking-competition) |
|                         | [Trail of Bits CTF Guide](https://trailofbits.github.io/ctf/)  |
|                         | [Tools of Trade and Resources for CTF](https://resources.infosecinstitute.com/tools-of-trade-and-resources-to-prepare-in-a-hacker-ctf-competition-or-challenge/#gref) |
|                         | [Capture the Flag - Like a Girl](https://code.likeagirl.io/capture-the-flag-58c17cdc103)    |
| **Virtual Machines**    | [SIFT VM](https://www.sans.org/tools/sift-workstation/) &#124; [SIFT Cheat Sheet](https://www.sans.org/posters/sift-cheat-sheet/) |
|                         | [Kali VM](https://www.kali.org/docs/introduction/download-official-kali-linux-images/) &#124; [Kali Cheat Sheet](https://www.comparitech.com/net-admin/kali-linux-cheat-sheet/)  |
|                         | [Flare VM (Windows)](https://github.com/mandiant/flare-vm)    |
|                         | [REMnux](https://docs.remnux.org/)    |
| **Tools**               | [Wireshark](https://www.wireshark.org) |
|                         | [NetworkMiner](https://www.netresec.com/?page=NetworkMiner)  |
| **Web Tools**           | [CyberChef](https://gchq.github.io/CyberChef/#input=UFBLS3tSU0dfSFNIX0lTRV9UklOTU1YX1dDX0NMU0pEfQ)|
|                         | [XOR Online](https://xor.pw/)|
|                         | [PHP Decoder](https://www.unphp.net/)  |
|                         | [DCode](https://www.dcode.fr/) |
|                         | [Steganography Tools](https://0xrick.github.io/lists/stego/)   |

**Tips:**
- CTFs require a variety of tools; check the questions for hints.
- Switching between Windows and Linux tools is common (e.g., Ghidra is easier to install on Kali).
- Organize your files in a dedicated CTF folder.
- Kali and SIFT VMs come with many useful tools; having both is helpful.


---

## Ubuntu Only

### Install Sift_cli to Linux

```bash
sudo apt install curl -y
cd /opt/ || exit
sudo curl -Lo /usr/local/bin/sift https://github.com/teamdfir/sift-cli/releases/download/v1.14.0-rc1/sift-cli-linux
sudo chmod +x /usr/local/bin/sift
sudo apt-get update
sift install --mode=desktop
```

### Install Remnux_cli to Linux

```bash
sudo apt install wget -y
cd /opt/ || exit
sudo wget https://REMnux.org/remnux-cli
echo 'Check to make sure these match'
echo '23c7f4eefa7599ea2c4156f083906ea5fd99df18f306e4bb43eec0430073985a'
sha256sum remnux-cli
sudo mv remnux-cli /usr/local/bin/remnux
sudo chmod +x /usr/local/bin/remnux
sudo apt-get update
sudo remnux install --mode=addon
```

### Install NetworkMiner

```bash
cd ~/Desktop || exit
sudo apt install mono-devel -y
wget https://www.netresec.com/?download=NetworkMiner -O /tmp/nm.zip
sudo unzip /tmp/nm.zip -d /opt/
cd /opt/NetworkMiner* || exit
sudo chmod +x NetworkMiner.exe
sudo chmod -R go+w AssembledFiles/
sudo chmod -R go+w Captures/
sudo apt install gnupg ca-certificates
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
echo "deb https://download.mono-project.com/repo/ubuntu stable-bionic main" | sudo tee /etc/apt/sources.list.d/mono-official-stable.list
sudo apt update -y
sudo apt install mono-devel -y
cd ~/Desktop/ || exit
echo '#!/bin/bash' > NetworkMiner
echo 'sudo /opt/NetworkMiner_2-7-1/NetworkMiner.exe' >> CLI-Type-networkminer-to-run
chmod +x NetworkMiner
sudo cp NetworkMiner /bin/networkminer
```
