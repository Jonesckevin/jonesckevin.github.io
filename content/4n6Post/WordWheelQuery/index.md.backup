<head>
    <meta
        content="Registry - WordWheelQuery,4n6, digital forensics news, tryhackme pyramid of pain, 4n-6, log4j, evtxecmd, ecdfp review, review, alert,forensics, digital, digital forensics, malwarebytes, norton, semantec, bitdefender, bytes, news, posts, drives, hard drives, solid state, ram, blog, sans"
        name="keywords">
    </meta>

    <title>Registry - WordWheelQuery</title>

</head>

<p>
    <span style="font-family: helvetica;">&nbsp;</span>
</p>
<div class="separator" style="clear: both; text-align: center;">
    <div class="separator" style="clear: both;"><span style="font-family: helvetica;">The Registry Section of
            WordWheelQuery: An Overview for Digital Forensic Investigators</span></div>
    <div class="separator" style="clear: both;"><span style="font-family: helvetica;"><br /></span></div>
    <div class="separator" style="clear: both; text-align: left;"><span style="font-family: helvetica;">The
            WordWheelQuery registry section is a critical component for digital forensic investigations, as it contains
            information about the user's search queries made using the Windows operating system. In this blog post,
            we'll take a closer look at what exactly can be found in the WordWheelQuery registry section and its
            significance for both normal and malicious use cases.</span></div>
</div>
<p>
    <span style="font-family: helvetica;"><span>
            <br />
        </span>
    </span>
</p>
<p></p>
<div class="separator" style="clear: both; text-align: center;">
    <a href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg-gDoOrxEx5qAG5XRKY07aMNYFZds5hGDOPQRzbww55Fjn_gU-8FULhf7vSvygMnrSSAxsi9kb-LVweJchec5i1L4LCLweDLx6E--CfAJlOHbQCOAz5HCI-G3T6pvH9O5CH5pdU05hD1MxAhsN2-utzcNzdpUFLFCRWn5IRrji9c7AgH0McFz1fp6H8g/s800/RegistryBlock.png"
        style="margin-left: 1em; margin-right: 1em;"><span style="font-family: helvetica;">
            <img border="0" data-original-height="400" data-original-width="800" height="160"
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg-gDoOrxEx5qAG5XRKY07aMNYFZds5hGDOPQRzbww55Fjn_gU-8FULhf7vSvygMnrSSAxsi9kb-LVweJchec5i1L4LCLweDLx6E--CfAJlOHbQCOAz5HCI-G3T6pvH9O5CH5pdU05hD1MxAhsN2-utzcNzdpUFLFCRWn5IRrji9c7AgH0McFz1fp6H8g/s320/RegistryBlock.png"
                width="320" /></span></a>
</div>
<div class="separator" style="clear: both; text-align: center;"><span style="font-family: helvetica;"><br /></span>
</div>
<div class="separator" style="clear: both; text-align: center;"><span
        style="font-family: helvetica; text-align: left;">&nbsp;</span></div>
<h3>
    <span style="font-family: helvetica;"><span>Finding the WordWheelQuery Registry</span></span>
</h3>
<div class="separator" style="clear: both; text-align: left;">
    <div class="separator" style="clear: both;"><span style="font-family: helvetica;">What is the Significance of the
            Registry Section of WordWheelQuery?</span></div>
    <div class="separator" style="clear: both;"><span style="font-family: helvetica;"><br /></span></div>
    <div class="separator" style="clear: both;"><span style="font-family: helvetica;">The registry section of
            WordWheelQuery is significant for digital forensic investigations because it contains information about the
            file paths and search terms that have been entered into the Windows search bar. This information can be used
            to track the user's activities and to determine what files they have been accessing and searching
            for.</span></div>
</div>
<div class="separator" style="clear: both; text-align: left;"><span style="font-family: helvetica;"><br /></span></div>
<div class="separator" style="clear: both; text-align: left;"><span style="font-family: helvetica;">
        <div style="font-family: &quot;Times New Roman&quot;;"><span
                style="font-family: helvetica;"><span><br /></span></span></div>
        <div style="font-family: &quot;Times New Roman&quot;;"><span style="font-family: helvetica;"><span>
                    <pre
                        style="background: rgb(243, 243, 247); border: 1px solid rgb(222, 222, 227); line-height: 1.3em; margin-bottom: 22px; margin-top: 0px; overflow: auto; padding: 11px; text-align: center; vertical-align: baseline;"><b style="font-size: 12px;">HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\WordWheelQuery</b>	</pre>
                    <div class="separator" style="clear: both; text-align: left;">Taking a look at the image below. You
                        can see the registry query for <b>WordWheelQuery </b>making the search for Test_WordWheelQ2 in
                        the explorer search bar. Looking at entry 1, we have the hex showing with it's relevant null
                        bytes that everyone loves.&nbsp;</div>
                    <div class="separator" style="clear: both; text-align: left;"><br /></div>
                    <div class="separator" style="clear: both; text-align: left;">Just below entry 0 and Entry 1, we
                        have the MRUListEx (Most Recently Used List Executed) in it's sequential order of 01 00 as in 01
                        was used most recent and 00 used originally.</div>
                    <div class="separator" style="clear: both; text-align: left;"><br /></div>
                    <div class="separator" style="clear: both; text-align: center;"><a
                            href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiG1ukFK0C1ZIxd6hsczlT5phRUAF4Kp0QAq0LNQywjac81P5ywkqnDXOLt22zVGanluGpNP7zG1MpxFp9BjCvyajj2iU87Zk7UOiVO18f6JiqKd0GurmbLcOxkJ-xl4TNIFOjDEaY8F_mfHQFvlMlFBl7RY98IDcDhApflXu91xVHtr6yHygfBErV1FQ/s850/WordWheelQuery_Reg1.PNG"
                            style="margin-left: 1em; margin-right: 1em;"><img border="0" data-original-height="646"
                                data-original-width="850" height="402"
                                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiG1ukFK0C1ZIxd6hsczlT5phRUAF4Kp0QAq0LNQywjac81P5ywkqnDXOLt22zVGanluGpNP7zG1MpxFp9BjCvyajj2iU87Zk7UOiVO18f6JiqKd0GurmbLcOxkJ-xl4TNIFOjDEaY8F_mfHQFvlMlFBl7RY98IDcDhApflXu91xVHtr6yHygfBErV1FQ/w529-h402/WordWheelQuery_Reg1.PNG"
                                width="529" /></a></div><br />
                    <div class="separator" style="clear: both; text-align: center;"><br /></div>
                </span></span></div>
    </span></div>
<h3 style="text-align: left;">
    <span style="font-family: helvetica;"><span>Normal Use Case</span>
    </span>
</h3>
<p>
    <span style="font-family: helvetica;">
        <span>&nbsp; &nbsp;</span></span><span style="font-family: helvetica;">In a normal use case, a digital forensic
        investigator would want to find information about the user's search queries in order to gain insight into their
        online behavior and activities. This information can be useful for various purposes such as identifying any
        potential privacy breaches, uncovering any evidence of intellectual property theft, or determining the user's
        online habits and interests.</span>
</p>
<p><span style="font-family: helvetica;"><br /></span></p>
<p><span style="font-family: helvetica;">For example, if a digital forensic investigator is conducting an investigation
        into a suspected data breach, they may want to examine the WordWheelQuery registry section to determine what
        search queries the user made that may have led to the compromise of their information. If the user searched for
        sensitive information such as login credentials or financial information, this could indicate that they may have
        fallen victim to a phishing scam or other type of malicious activity.</span></p>
<p></p>
<p>
    <span style="font-family: helvetica;"><span>
            <br />
        </span>
    </span>
</p>
<h3 style="text-align: left;">
    <span style="font-family: helvetica;"><span>Malicious Use Case</span>
    </span>
</h3>
<p>
    <span style="font-family: helvetica;"><span>&nbsp; &nbsp;</span></span><span style="font-family: helvetica;">In a
        malicious use case, a digital forensic investigator may want to examine the WordWheelQuery registry section to
        determine if the user's computer has been infected with malware. Malware can often manipulate the WordWheelQuery
        registry section to hide its presence and steal sensitive information, such as login credentials or financial
        information.</span>
</p>
<p><span style="font-family: helvetica;"><br /></span></p>
<p></p>
<ul style="text-align: left;">
    <li><span style="font-family: helvetica;">For example, if a digital forensic investigator is conducting an
            investigation into a suspected malware infection, they may want to examine the WordWheelQuery registry
            section to determine if any suspicious or unusual search queries have been made. If the user searched for
            terms related to malware or hacking, this could indicate that they may have been attempting to infect their
            own computer or were searching for information on how to remove an infection.</span></li>
</ul>
<p></p>
<p><span style="font-family: helvetica;"><br /></span></p>
<p></p>
<ul style="text-align: left;">
    <li><span style="font-family: helvetica;">Another example of a malicious use case is the use of the WordWheelQuery
            registry section by an attacker to hide their tracks and cover up their activities. An attacker may
            manipulate the WordWheelQuery registry section to hide their search queries and cover up their tracks. This
            can be accomplished by modifying the information stored in the WordWheelQuery registry section to reflect
            search queries that are not related to their actual activities.</span></li>
</ul><br />
<p></p>
<p><span style="font-family: helvetica;"><span>&nbsp;&nbsp; &nbsp;</span>In conclusion, the WordWheelQuery registry
        section is a valuable source of information for digital forensic investigations. Whether the investigation is
        focused on a normal use case or a malicious use case, the information stored in this section can provide
        valuable insight into the user's online behavior and activities. Digital forensic investigators should always
        consider examining the WordWheelQuery registry section as part of their investigations, as it can often provide
        critical evidence that can help to uncover the truth.</span></p>
<p>
    <span style="font-family: helvetica;"><span>
            <br />
        </span>
    </span>
</p>
<p></p>
<div class="separator" style="clear: both; text-align: center;">
    <div class="separator" style="clear: both; text-align: center;"><a
            href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgFHcOvhIz-6_ajj3SW32U3d6pLYNRxLLXtSELh3slg78X4iQanFZSZlDrkUJ5Eq7fttNaygjZjNiLA1sWsTykjAnDMKVXvsFkXiuB2tijNRoEg8d15N5qYW7rrryzi9fEgZAAe14dl3AO4RcQ56ts7rlmUdyc1JdSh_gQtT5mSSJdlQOvONs1d3hFugg/s1211/WordWheelQuery_Poster.png"
            style="margin-left: 1em; margin-right: 1em;"><img border="0" data-original-height="378"
                data-original-width="1211" height="177"
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgFHcOvhIz-6_ajj3SW32U3d6pLYNRxLLXtSELh3slg78X4iQanFZSZlDrkUJ5Eq7fttNaygjZjNiLA1sWsTykjAnDMKVXvsFkXiuB2tijNRoEg8d15N5qYW7rrryzi9fEgZAAe14dl3AO4RcQ56ts7rlmUdyc1JdSh_gQtT5mSSJdlQOvONs1d3hFugg/w566-h177/WordWheelQuery_Poster.png"
                width="566" /></a></div>
    <div class="separator" style="clear: both; text-align: center;"><br /></div>
    <div class="separator" style="clear: both; text-align: center;"><a
            href="https://www.sans.org/posters/windows-forensic-analysis/"
            style="font-family: helvetica;">https://www.sans.org/posters/windows-forensic-analysis/</a></div>
</div>
<p></p>
<p></p>