<meta
    content="WMI, WMIConsumer, Wmi Consumer, WMI Query, Command Line, windows registry, 4n6, digital forensics news, tryhackme pyramid of pain, 4n-6, log4j, evtxecmd, ecdfp review, review, alert,forensics, digital, digital forensics, malwarebytes, norton, semantec, bitdefender, bytes, news, posts, drives, hard drives, solid state, ram, blog, sans"
    name="keywords">
</meta>
<p><span style="font-family: helvetica;"><br /></span></p>
<p><span style="font-family: helvetica;">Windows Management Instrumentation (WMI) is a Microsoft technology that
        provides a unified way of managing Windows operating systems and applications. WMI is a management
        infrastructure that is built into Windows operating systems, and it provides a standardized interface for
        accessing system management information. WMI is used by system administrators to gather information about the
        state of their systems, to automate system management tasks, and to perform remote administration. In this blog
        post, we will take a closer look at what WMI is, how it works, and some examples of its normal and malicious use
        cases.</span></p>
<p><span style="font-family: helvetica;"><br /></span></p>
<div class="separator" style="clear: both; text-align: center;"><a
        href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg1thQqYz0jFaC5a6uSzk4Jck743mcFPD85JJ_8Fu38HtiQOP0VMDPm5qS9czw0wMDI_6s3PQ_rkWDFYVL614x-YgbhzcySPWQCY6AF88AzV94_ju57TtGRwL2A012KrMibgFAO86I_0Z_0U0RzTZSNECIxjJr1_0E_gGzGb6aVv2zRp54Mob57FrjvZg/s800/WMI-Logo.png"
        imageanchor="1" style="margin-left: 1em; margin-right: 1em;"><span style="font-family: helvetica;"><img
                border="0" data-original-height="400" data-original-width="800" height="160"
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg1thQqYz0jFaC5a6uSzk4Jck743mcFPD85JJ_8Fu38HtiQOP0VMDPm5qS9czw0wMDI_6s3PQ_rkWDFYVL614x-YgbhzcySPWQCY6AF88AzV94_ju57TtGRwL2A012KrMibgFAO86I_0Z_0U0RzTZSNECIxjJr1_0E_gGzGb6aVv2zRp54Mob57FrjvZg/s320/WMI-Logo.png"
                width="320" /></span></a></div><span style="font-family: helvetica;"><br /></span>
<div class="separator" style="clear: both; text-align: center;"><br /></div><span style="font-family: helvetica;"><br />
    <div>
        <h3 style="text-align: left;">What is Windows Management Instrumentation (WMI)?</h3>
        <div><br /></div>
        <div>WMI is a technology that enables developers and system administrators to access and manipulate information
            about Windows operating systems and applications through a standardized interface. WMI provides a set of
            objects and methods that can be used to query and manage system resources, such as hardware devices,
            software applications, and network settings. WMI also provides an infrastructure for monitoring and
            controlling system events and processes, such as system startup, shutdown, and user logon.</div>
        <div><br /></div>
        <div>The WMI information is stored in a file called Objects.DATA. This can be found at:</div>
        <div><br /></div>
        <div><br /></div>
        <div>
            <div>
                <p
                    style="background: rgb(243, 243, 247); border: 1px solid rgb(222, 222, 227); line-height: 1.3em; margin-bottom: 22px; margin-top: 0px; outline: 0px; overflow: auto; padding: 11px; text-align: center; vertical-align: baseline;">
                    %SYSTEMROOT%\system32\wbem\Repository\<i>OBJECTS.DATA</i></p>
            </div>
            <div><span style="font-family: helvetica;">OBJECTS.DATA can be a valuable source of information for system
                    administrators and security professionals, as it provides a list of WMI
                    classes that can be used to gather information, execute code, and create
                    persistence mechanisms for both Normal and Malicious Purposes.</span></div>
        </div>
        <div><br /></div>
        <h3 style="text-align: left;">How does WMI work?</h3>
        <div><br /></div>
        <div>WMI is based on the Common Information Model (CIM), which is a standard for representing management
            information in a consistent way. CIM defines a set of classes, properties, and methods that can be used to
            access and manipulate management information. WMI provides a CIM-based interface for accessing management
            information on Windows systems. WMI consists of three main components: the WMI service, the WMI repository,
            and the WMI provider.</div>
        <div><br /></div>
        <div>The WMI service is the core component of WMI, and it provides the interface for accessing and manipulating
            management information. The WMI service runs as a system service, and it is responsible for executing WMI
            queries and processing WMI events.</div>
        <div><br /></div>
        <div>The WMI repository is a database that stores the CIM objects that are used by WMI. The WMI repository
            contains information about system resources, such as hardware devices, software applications, and network
            settings. The WMI repository also contains information about system events and processes, such as system
            startup, shutdown, and user logon.</div>
        <div><br /></div>
        <div>The WMI provider is a software component that enables access to management information from a specific
            source, such as a hardware device or a software application. WMI providers are typically provided by
            hardware and software vendors, and they enable access to management information about their products through
            the WMI interface.</div>
    </div>
    <div><br /></div>
</span>
<div>
    <h3 style="text-align: left;">
        <span style="font-family: helvetica;"><span>Normal Use Case</span>
        </span>
    </h3>
    <p><span style="font-family: helvetica;">WMI is widely used by system administrators and developers to automate
            system management tasks, such as monitoring system performance, managing software installations, and
            configuring network settings. Some examples of normal use cases for WMI include:</span></p>
    <p><span style="font-family: helvetica;"><br /></span></p>
    <p></p>
    <ul style="text-align: left;">
        <li><span style="font-family: helvetica;">&nbsp; &nbsp; <b>System monitoring and troubleshooting</b> - WMI can
                be used to monitor system performance, such as CPU usage, memory usage, and disk space usage. WMI can
                also be used to diagnose system problems, such as application crashes and system errors.</span></li>
    </ul><span style="font-family: helvetica;"><br /></span>
    <ul style="text-align: left;">
        <li><span style="font-family: helvetica;">&nbsp; &nbsp; <b>Software management </b>- WMI can be used to install,
                uninstall, and update software applications on remote computers. WMI can also be used to query
                information about installed software, such as version numbers and installation dates.</span></li>
    </ul><span style="font-family: helvetica;"><br /></span>
    <ul style="text-align: left;">
        <li><span style="font-family: helvetica;">&nbsp; &nbsp; <b>Network management </b>- WMI can be used to configure
                network settings, such as IP addresses, DNS servers, and network adapters. WMI can also be used to
                monitor network traffic and network performance.</span></li>
    </ul>
    <p></p>
    <p><span style="font-family: helvetica;"><br /></span></p>
    <h3 style="text-align: left;">
        <span style="font-family: helvetica;"><span>Malicious Use Case</span>
        </span>
    </h3>
    <p><span style="font-family: helvetica;">Unfortunately, WMI can also be used for malicious purposes, such as
            gathering sensitive information, executing malicious code, and creating persistence mechanisms. Some
            examples of malicious use cases for WMI include:</span></p>
    <p><span style="font-family: helvetica;"><br /></span></p>
    <p></p>
    <ul style="text-align: left;">
        <li><span style="font-family: helvetica;">&nbsp; &nbsp;<b> Information gathering</b> - WMI can be used to gather
                information about a system, such as installed software, network settings, and user accounts. This
                information can be used by attackers to identify vulnerabilities and plan further attacks.</span></li>
    </ul><span style="font-family: helvetica;"><br /></span>
    <ul style="text-align: left;">
        <li><span style="font-family: helvetica;">&nbsp; &nbsp; <b>Code execution</b> - WMI can be used to execute
                arbitrary code on a remote system. This is done by creating a new WMI class that contains the code to be
                executed, and then registering that class with the WMI provider. Once the class is registered, the
                attacker can use WMI to execute the code on the remote system. This technique is known as WMI hijacking
                and it has been used in several high-profile attacks, such as the WannaCry ransomware attack.</span>
        </li>
    </ul><span style="font-family: helvetica;"><br /></span>
    <ul style="text-align: left;">
        <li><span style="font-family: helvetica;">&nbsp; &nbsp; <b>Persistence mechanisms</b> - WMI can be used to
                create persistence mechanisms that enable an attacker to maintain access to a system even after it has
                been rebooted or patched. This is done by creating a new WMI class that contains the code to be executed
                at system startup, and then registering that class with the WMI provider. Once the class is registered,
                the code will be executed every time the system starts up, giving the attacker persistent access to the
                system.</span></li>
    </ul>
    <p></p>
    <h4><span style="font-family: helvetica;"><br /></span></h4>
    <h3 style="text-align: left;"><span style="font-family: helvetica;">Parsing
            With&nbsp;PyWMIPersistenceFinder.py</span></h3>
    <div><span style="font-family: helvetica;">PyWMIPersistenceFinder.py is a Python script that can be used to search
            for persistence mechanisms in the WMI repository. The script takes a path to the OBJECTS.DATA file as input,
            and it searches the WMI repository for classes that contain specific keywords, such as "startup" or
            "autorun". PyWMIPersistenceFinder.py can be a useful tool for identifying persistence mechanisms that have
            been created using WMI.</span></div>
    <div><span style="font-family: helvetica;"><br /></span></div>
    <div><span style="font-family: helvetica;">Keep in mind it could still be using Python2.</span></div>
    <div>
        <pre><div class="bg-black mb-4 rounded-md"><div style="font-family: helvetica; white-space: normal;"><pre style="--tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-ring-color: rgba(59,130,246,0.5); --tw-ring-offset-color: #fff; --tw-ring-offset-shadow: 0 0 transparent; --tw-ring-offset-width: 0px; --tw-ring-shadow: 0 0 transparent; --tw-rotate: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-scroll-snap-strictness: proximity; --tw-shadow-colored: 0 0 transparent; --tw-shadow: 0 0 transparent; --tw-skew-x: 0; --tw-skew-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; background-color: #444654; border-radius: 0.375rem; border: 0px solid rgb(217, 217, 227); box-sizing: border-box; font-family: &quot;Söhne Mono&quot;, Monaco, &quot;Andale Mono&quot;, &quot;Ubuntu Mono&quot;, monospace; font-size: 0.875em; line-height: 1.71429; margin-bottom: 0px; margin-top: 0px; overflow-x: auto; padding: 0px;"><div class="bg-black mb-4 rounded-md" style="--tw-bg-opacity: 1; --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-ring-color: rgba(59,130,246,0.5); --tw-ring-offset-color: #fff; --tw-ring-offset-shadow: 0 0 transparent; --tw-ring-offset-width: 0px; --tw-ring-shadow: 0 0 transparent; --tw-rotate: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-scroll-snap-strictness: proximity; --tw-shadow-colored: 0 0 transparent; --tw-shadow: 0 0 transparent; --tw-skew-x: 0; --tw-skew-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; background-color: rgba(0,0,0,var(--tw-bg-opacity)); border-radius: 0.375rem; border: 0px solid rgb(217, 217, 227); box-sizing: border-box; margin-bottom: 1rem;"><div class="flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans" style="--tw-bg-opacity: 1; --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-ring-color: rgba(59,130,246,0.5); --tw-ring-offset-color: #fff; --tw-ring-offset-shadow: 0 0 transparent; --tw-ring-offset-width: 0px; --tw-ring-shadow: 0 0 transparent; --tw-rotate: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-scroll-snap-strictness: proximity; --tw-shadow-colored: 0 0 transparent; --tw-shadow: 0 0 transparent; --tw-skew-x: 0; --tw-skew-y: 0; --tw-text-opacity: 1; --tw-translate-x: 0; --tw-translate-y: 0; align-items: center; background-color: rgba(52,53,65,var(--tw-bg-opacity)); border: 0px solid rgb(217, 217, 227); box-sizing: border-box; color: #d1d5db; display: flex; font-family: Söhne, ui-sans-serif, system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, Ubuntu, Cantarell, &quot;Noto Sans&quot;, sans-serif, &quot;Helvetica Neue&quot;, Arial, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: 0.75rem; line-height: 1rem; padding: 0.5rem 1rem; position: relative;"><button class="flex ml-auto gap-2" style="--tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-ring-color: rgba(59,130,246,0.5); --tw-ring-offset-color: #fff; --tw-ring-offset-shadow: 0 0 transparent; --tw-ring-offset-width: 0px; --tw-ring-shadow: 0 0 transparent; --tw-rotate: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-scroll-snap-strictness: proximity; --tw-shadow-colored: 0 0 transparent; --tw-shadow: 0 0 transparent; --tw-skew-x: 0; --tw-skew-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; appearance: button; background-image: none; border-color: rgb(217, 217, 227); border-style: solid; border-width: 0px; cursor: pointer; display: flex; font-family: inherit; font-size: 12px; font-weight: inherit; gap: 0.5rem; line-height: inherit; margin: 0px 0px 0px auto; padding: 0px;">Copy code</button></div><div class="p-4 overflow-y-auto" style="--tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-ring-color: rgba(59,130,246,0.5); --tw-ring-offset-color: #fff; --tw-ring-offset-shadow: 0 0 transparent; --tw-ring-offset-width: 0px; --tw-ring-shadow: 0 0 transparent; --tw-rotate: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-scroll-snap-strictness: proximity; --tw-shadow-colored: 0 0 transparent; --tw-shadow: 0 0 transparent; --tw-skew-x: 0; --tw-skew-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; border: 0px solid rgb(217, 217, 227); box-sizing: border-box; overflow-y: auto; padding: 1rem;"><pre><code class="!whitespace-pre hljs language-bash"><span class="hljs-comment"><span style="color: #6aa84f;"># Navigate to the directory where PyWMIPersistenceFinder.py is located</span></span><span style="color: #d1d5db;">
</span><span class="hljs-built_in"><span style="color: #e69138;">cd</span></span><span style="color: #d1d5db;"> /path/to/PyWMIPersistenceFinder

</span><span class="hljs-comment"><span style="color: #6aa84f;"># Run the script with the Python interpreter and provide the path to the OBJECTS.DATA file</span></span><span style="color: #d1d5db;">
</span><span style="color: #e69138;">python</span><span style="color: #d1d5db;"> PyWMIPersistenceFinder.py /path/to/OBJECTS.DATA</span></code></pre>
    </div>
</div>
</pre>
</div>
<div style="font-family: helvetica; white-space: normal;"><br /></div>
<h3 style="text-align: left;"><span style="font-family: helvetica;">Getting WMI using PoSH</span></h3>
<div>
    <p><span style="font-family: helvetica; white-space: normal;"><span>&nbsp;</span></span><span
            style="font-family: helvetica;"><span style="white-space: normal;">PowerShell can also be used to search for
                persistence mechanisms in the WMI repository. The Get-WMIObject cmdlet can be used to query the WMI
                repository for specific classes and properties.&nbsp;</span></span></p>
    <p><span style="font-family: helvetica;"><span style="white-space: normal;"><br /></span></span></p>
    <p><span style="font-family: helvetica;"><span style="white-space: normal;">For example, the following PowerShell
                command can be used to list the WMI:</span></span></p>
    <p><span style="font-family: helvetica;"><span style="white-space: normal;"><br /></span></span></p>
    <div style="background-color: #1e1e1e; line-height: 19px;">
        <div style="font-family: helvetica; white-space: normal;">
            <pre
                style="--tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-ring-color: rgba(59,130,246,0.5); --tw-ring-offset-color: #fff; --tw-ring-offset-shadow: 0 0 transparent; --tw-ring-offset-width: 0px; --tw-ring-shadow: 0 0 transparent; --tw-rotate: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-scroll-snap-strictness: proximity; --tw-shadow-colored: 0 0 transparent; --tw-shadow: 0 0 transparent; --tw-skew-x: 0; --tw-skew-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; background-color: #444654; border-radius: 0.375rem; border: 0px solid rgb(217, 217, 227); box-sizing: border-box; font-family: &quot;Söhne Mono&quot;, Monaco, &quot;Andale Mono&quot;, &quot;Ubuntu Mono&quot;, monospace; font-size: 0.875em; line-height: 1.71429; margin-bottom: 0px; margin-top: 0px; overflow-x: auto; padding: 0px;"><div class="bg-black mb-4 rounded-md" style="--tw-bg-opacity: 1; --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-ring-color: rgba(59,130,246,0.5); --tw-ring-offset-color: #fff; --tw-ring-offset-shadow: 0 0 transparent; --tw-ring-offset-width: 0px; --tw-ring-shadow: 0 0 transparent; --tw-rotate: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-scroll-snap-strictness: proximity; --tw-shadow-colored: 0 0 transparent; --tw-shadow: 0 0 transparent; --tw-skew-x: 0; --tw-skew-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; background-color: rgba(0,0,0,var(--tw-bg-opacity)); border-radius: 0.375rem; border: 0px solid rgb(217, 217, 227); box-sizing: border-box; margin-bottom: 1rem;"><div class="flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans" style="--tw-bg-opacity: 1; --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-ring-color: rgba(59,130,246,0.5); --tw-ring-offset-color: #fff; --tw-ring-offset-shadow: 0 0 transparent; --tw-ring-offset-width: 0px; --tw-ring-shadow: 0 0 transparent; --tw-rotate: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-scroll-snap-strictness: proximity; --tw-shadow-colored: 0 0 transparent; --tw-shadow: 0 0 transparent; --tw-skew-x: 0; --tw-skew-y: 0; --tw-text-opacity: 1; --tw-translate-x: 0; --tw-translate-y: 0; align-items: center; background-color: rgba(52,53,65,var(--tw-bg-opacity)); border: 0px solid rgb(217, 217, 227); box-sizing: border-box; color: #d1d5db; display: flex; font-family: Söhne, ui-sans-serif, system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, Ubuntu, Cantarell, &quot;Noto Sans&quot;, sans-serif, &quot;Helvetica Neue&quot;, Arial, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: 0.75rem; line-height: 1rem; padding: 0.5rem 1rem; position: relative;"><button class="flex ml-auto gap-2" style="--tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-ring-color: rgba(59,130,246,0.5); --tw-ring-offset-color: #fff; --tw-ring-offset-shadow: 0 0 transparent; --tw-ring-offset-width: 0px; --tw-ring-shadow: 0 0 transparent; --tw-rotate: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-scroll-snap-strictness: proximity; --tw-shadow-colored: 0 0 transparent; --tw-shadow: 0 0 transparent; --tw-skew-x: 0; --tw-skew-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; appearance: button; background-image: none; border-color: rgb(217, 217, 227); border-style: solid; border-width: 0px; cursor: pointer; display: flex; font-family: inherit; font-size: 12px; font-weight: inherit; gap: 0.5rem; line-height: inherit; margin: 0px 0px 0px auto; padding: 0px;">Copy code</button></div><div class="p-4 overflow-y-auto" style="--tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-ring-color: rgba(59,130,246,0.5); --tw-ring-offset-color: #fff; --tw-ring-offset-shadow: 0 0 transparent; --tw-ring-offset-width: 0px; --tw-ring-shadow: 0 0 transparent; --tw-rotate: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-scroll-snap-strictness: proximity; --tw-shadow-colored: 0 0 transparent; --tw-shadow: 0 0 transparent; --tw-skew-x: 0; --tw-skew-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; border: 0px solid rgb(217, 217, 227); box-sizing: border-box; overflow-y: auto; padding: 1rem;"><pre><div style="font-size: medium;"><span style="white-space: normal;"><span style="font-family: helvetica;">&nbsp;&nbsp;</span></span><span style="color: #dcdcaa; font-family: Consolas, &quot;Courier New&quot;, monospace; font-size: 14px; white-space: normal;">Get-WMIObject</span><span style="color: #d4d4d4; font-family: Consolas, &quot;Courier New&quot;, monospace; font-size: 14px; white-space: normal;">&nbsp;</span><span style="color: #9cdcfe; font-family: Consolas, &quot;Courier New&quot;, monospace; font-size: 14px; white-space: normal;">-Namespace</span><span style="color: #d4d4d4; font-family: Consolas, &quot;Courier New&quot;, monospace; font-size: 14px; white-space: normal;">&nbsp;</span><span style="color: #dcdcaa; font-family: Consolas, &quot;Courier New&quot;, monospace; font-size: 14px; white-space: normal;">root\Subscription</span><span style="color: #d4d4d4; font-family: Consolas, &quot;Courier New&quot;, monospace; font-size: 14px; white-space: normal;">&nbsp;</span><span style="color: #9cdcfe; font-family: Consolas, &quot;Courier New&quot;, monospace; font-size: 14px; white-space: normal;">-Class</span><span style="color: #d4d4d4; font-family: Consolas, &quot;Courier New&quot;, monospace; font-size: 14px; white-space: normal;">&nbsp;__EventFilter</span></div><div style="color: #d4d4d4; font-family: Consolas, &quot;Courier New&quot;, monospace; font-size: 14px;"><span style="color: #dcdcaa;"> Get-WMIObject</span> <span style="color: #9cdcfe;">-Namespace</span> <span style="color: #dcdcaa;">root\Subscription</span> <span style="color: #9cdcfe;">-Class</span> __EventConsumer</div><div style="color: #d4d4d4; font-family: Consolas, &quot;Courier New&quot;, monospace; font-size: 14px;"><span style="color: #dcdcaa;"> Get-WMIObject</span> <span style="color: #9cdcfe;">-Namespace</span> <span style="color: #dcdcaa;">root\Subscription</span> <span style="color: #9cdcfe;">-Class</span> __FilterToConsumerBinding</div></pre>
        </div>
    </div>
    </pre>
</div>
</div>
</div>
</div>
</pre>
</div>
<h3 style="text-align: left;">
    <div class="separator" style="clear: both; text-align: center;"><a
            href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhZhOZ12KyjPc7A8dJgHJv1c66Qlp6nRuhSalqKxCqQtCGFECnq6kniFsPDtTQmk69dH6MaVtBzVPNNHDztD37tI9q_7-IrjUMmolP6UOtC_h0-mhFC1F8bjAncL7gPVg1qlhjLOx9-9VEKtfpOsEYBUgEHiQwE4QQULORQLfmNk5CyARVY8S7LxFBCAw/s817/WMI-PoSH1.png"
            imageanchor="1" style="margin-left: 1em; margin-right: 1em;"><img border="0" data-original-height="399"
                data-original-width="817" height="311"
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhZhOZ12KyjPc7A8dJgHJv1c66Qlp6nRuhSalqKxCqQtCGFECnq6kniFsPDtTQmk69dH6MaVtBzVPNNHDztD37tI9q_7-IrjUMmolP6UOtC_h0-mhFC1F8bjAncL7gPVg1qlhjLOx9-9VEKtfpOsEYBUgEHiQwE4QQULORQLfmNk5CyARVY8S7LxFBCAw/w637-h311/WMI-PoSH1.png"
                width="637" /></a></div><br /><span style="font-family: helvetica;"><br /></span>
</h3>
<h3 style="text-align: left;"><span style="font-family: helvetica;">Conclusion</span></h3>
<p><span style="font-family: helvetica;">While WMI is a powerful tool for system administrators and developers, it can
        also be used for malicious purposes. Attackers can use WMI to gather information, execute code, and create
        persistence mechanisms. It's important for system administrators to be aware of the potential for misuse and to
        take steps to secure their systems against WMI-based attacks.</span></p>
<p></p>
<h3 style="text-align: left;"><span style="font-family: helvetica;"><br /></span></h3>
<h3 style="text-align: left;"><span style="font-family: helvetica;">Additional Resources:</span></h3>
<p></p>
<ul style="text-align: left;">
    <li><span style="font-family: helvetica;">SysInternal -&nbsp;<a
                href="https://learn.microsoft.com/en-us/sysinternals/downloads/autoruns">AutoRuns</a></span></li>
    <li><span style="font-family: helvetica;">GitHub -&nbsp;<a
                href="https://github.com/davidpany/WMI_Forensics/blob/master/PyWMIPersistenceFinder.py">PyWMIPersistenceFinder.py</a></span>
    </li>
    <li><span style="font-family: helvetica;">13Cube -&nbsp;<a href="https://www.youtube.com/watch?v=k-_O59BnsHg">The
                ABC's of WMI</a></span></li>
</ul>
<p></p>
<p></p>
<p></p>
</div>