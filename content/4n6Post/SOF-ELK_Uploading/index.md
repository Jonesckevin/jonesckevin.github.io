<span style="font-family: helvetica;">

    <head>
        <meta
            content="shortcut, shortcut files, lnk, shortcut lnk, link files, links, proof of access, POE, Proof Of Execution, 4n6, digital forensics news, tryhackme pyramid of pain, 4n-6, log4j, evtxecmd, ecdfp review, review, alert,forensics, digital, digital forensics, malwarebytes, norton, semantec, bitdefender, bytes, news, posts, drives, hard drives, solid state, ram, blog, sans, nirsoft"
            name="keywords">
        </meta>


        <title>File and Folder Opening - Link Files (lnk)</title>

    </head>
</span>

<p><br /></p>


<div class="separator" style="clear: both; text-align: center;">
    <a href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEigvwQ-4wrJCLU-PlngXNXA8lj-jJdoo7WluxByYQ_x6ZQFPnClBozVd3Tli4h3922kZF4uXkwCVXbVvTq-f3ekmDGgv6014pvD-MGYOPKqQCtST3bse8j_vxs9BZ8DzVm4eQf9faqYqBPc1bAHOlm_mZaZSY-PklhFOWeG8qMdSiOpsGCAvDKTr4spbSsI/w188-h210/SOF-ELK.png"
        style="font-family: helvetica; margin-left: 1em; margin-right: 1em;"><span>
            <br /></span></a><span style="font-family: helvetica;"><br /></span>
    <div class="separator" style="clear: both; text-align: center;"><a
            href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEigvwQ-4wrJCLU-PlngXNXA8lj-jJdoo7WluxByYQ_x6ZQFPnClBozVd3Tli4h3922kZF4uXkwCVXbVvTq-f3ekmDGgv6014pvD-MGYOPKqQCtST3bse8j_vxs9BZ8DzVm4eQf9faqYqBPc1bAHOlm_mZaZSY-PklhFOWeG8qMdSiOpsGCAvDKTr4spbSsI/w188-h210/SOF-ELK.png"
            style="font-family: helvetica; margin-left: 1em; margin-right: 1em;"><img border="0"
                data-original-height="400" data-original-width="800" height="287"
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEigvwQ-4wrJCLU-PlngXNXA8lj-jJdoo7WluxByYQ_x6ZQFPnClBozVd3Tli4h3922kZF4uXkwCVXbVvTq-f3ekmDGgv6014pvD-MGYOPKqQCtST3bse8j_vxs9BZ8DzVm4eQf9faqYqBPc1bAHOlm_mZaZSY-PklhFOWeG8qMdSiOpsGCAvDKTr4spbSsI/w247-h287/SOF-ELK.png"
                width="247" /></a></div>
</div>
<div class="separator" style="clear: both; text-align: center;"><span
        style="font-family: helvetica; text-align: left;">&nbsp;</span></div>
<h3><span style="font-family: helvetica;"><span>Resources to what you need or for help:</span></span></h3>
<div class="separator" style="clear: both; text-align: left;">
    <div class="separator" style="clear: both;"><span style="font-family: helvetica;">A. SOF-ELK from <a
                href="https://github.com/philhagen/sof-elk/wiki/Virtual-Machine-README">GitHub</a> or <a
                href="https://for572.com/sof-elk-vm">VM from FOR572</a></span></div>
    <div class="separator" style="clear: both;"><span style="font-family: helvetica;">B. Kroll - <a
                href="https://s3.amazonaws.com/cyb-us-prd-kape/kape.zip">KAPE</a> Direct Download</span></div>
    <div class="separator" style="clear: both;"><span style="font-family: helvetica;">C. SOF-ELK <a
                href="https://github.com/philhagen/sof-elk/wiki/KAPE-Support">Kape Support</a></span></div>
    <div class="separator" style="clear: both;"><span style="font-family: helvetica;">D. Youtube Video Guide by <a
                href="https://www.youtube.com/watch?v=k-Kc0VhVjZg" target="_blank">SystemForensics</a></span></div>
    <div class="separator" style="clear: both;"><br /></div>
</div>
<h3><span style="font-family: helvetica;">SOF-ELK Intro</span></h3>
<p><span style="font-family: helvetica;"><span> SOF-ELK, coupled with the powerful capabilities of the KAPE (Kroll
            Artifact Parser and Extractor) software, forms a dynamic duo in the realm of cybersecurity and digital
            forensics. KAPE, developed by Eric Zimmerman, serves as a versatile and efficient tool for acquiring and
            processing forensic artifacts, including Master File Table (MFT) and Event Log files. By seamlessly
            integrating KAPE into the SOF-ELK framework, security practitioners gain a comprehensive solution for
            extracting, parsing, and visualizing critical data. This synergy enhances the efficiency of incident
            response and forensic investigations by allowing analysts to harness the rich insights embedded within MFT
            and Event Log artifacts. Together, SOF-ELK and KAPE create a robust environment that empowers organizations
            to navigate the complex landscape of security data, enabling proactive threat detection and bolstering the
            overall resilience of their digital infrastructure.</span></span></p>
<p><span style="font-family: helvetica;"><span><br /></span></span></p>
<p><span style="font-family: helvetica;">
    </span></p>
<h3 style="text-align: left;">
    <span style="font-family: helvetica;"><span>Installing the SOF-ELK VM</span></span>
</h3>
<p><span style="font-family: helvetica;">You can easily import the Virtual Machine by using the downloaded VMDK and VMX
        files. Depending on the version, you might need to upgrade it to match your current version, as shown in the
        images below. If the image fails to load, it suggests an upgrade. Once you create a clone, the Virtual Machine
        should function properly.</span></p>
<div class="separator" style="clear: both; text-align: center;"><a
        href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiTbA-zHIksfJBFLXJHJxOcdjslcrU8PKg9LY8mdPH2bbchLAnHi3xq44DOVc_f_lvRZWHxwmGoPEQANetkGWNKcMVlOXUfTx8mK1JO4F7lWJBcZlvS9G8HIJyFo5iCGdhjkrdXce8MZAsft5Lnx_dcG4h_onua4Wvg12_o3a5uN2F4OyURGp_XeaF-i9Zq/s1332/SOF-ELK1.PNG"
        style="margin-left: 1em; margin-right: 1em;"><img border="0" data-original-height="889"
            data-original-width="1332" height="327"
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiTbA-zHIksfJBFLXJHJxOcdjslcrU8PKg9LY8mdPH2bbchLAnHi3xq44DOVc_f_lvRZWHxwmGoPEQANetkGWNKcMVlOXUfTx8mK1JO4F7lWJBcZlvS9G8HIJyFo5iCGdhjkrdXce8MZAsft5Lnx_dcG4h_onua4Wvg12_o3a5uN2F4OyURGp_XeaF-i9Zq/w489-h327/SOF-ELK1.PNG"
            width="489" /></a></div>
<div class="separator" style="clear: both; text-align: center;"><br />
    <div class="separator" style="clear: both; text-align: center;"><a
            href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgWksUnR7CGnato4cu6djftykyhYNAWVS01K_J7dnMsKmWahZFf1L-xHM2EQbU1ZSG4rPdVFgMN9_YYeZSTIZDpLTZlki0BAYOD4WHrpSdViTnv_jePHJOMgjai9ZHdu368VfYaSP45BDygOeLGTvAb9ZepNLSjxQPLmoBhN3w3zIgxWD0G2cWbzeQW8lKN/s1330/SOF-ELK2.PNG"
            style="margin-left: 1em; margin-right: 1em;"><img border="0" data-original-height="890"
                data-original-width="1330" height="333"
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgWksUnR7CGnato4cu6djftykyhYNAWVS01K_J7dnMsKmWahZFf1L-xHM2EQbU1ZSG4rPdVFgMN9_YYeZSTIZDpLTZlki0BAYOD4WHrpSdViTnv_jePHJOMgjai9ZHdu368VfYaSP45BDygOeLGTvAb9ZepNLSjxQPLmoBhN3w3zIgxWD0G2cWbzeQW8lKN/w497-h333/SOF-ELK2.PNG"
                width="497" /></a></div>
    <div class="separator" style="clear: both; text-align: center;"><br /></div>
    <div class="separator" style="clear: both; text-align: center;"><a
            href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgQGhfOq5U5mpiq5BJxbPRqyrK7CgkUZ8zcDSuhU8ixCtt4GlVvW5Sh8mVQDuCpyVp7IxyBgKpBO2kRI7BnShyQ5NTNSzcE8UuLzLqZgLwtbme19bDodeYcm8-buV_75WFMWyo0RhpXX73EbOdAHki3tfCwLUxlPWxPmTZTPVgTobo8R5oCksTXwGejtHhE/s1332/SOF-ELK3.PNG"
            style="margin-left: 1em; margin-right: 1em;"><img border="0" data-original-height="889"
                data-original-width="1332" height="330"
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgQGhfOq5U5mpiq5BJxbPRqyrK7CgkUZ8zcDSuhU8ixCtt4GlVvW5Sh8mVQDuCpyVp7IxyBgKpBO2kRI7BnShyQ5NTNSzcE8UuLzLqZgLwtbme19bDodeYcm8-buV_75WFMWyo0RhpXX73EbOdAHki3tfCwLUxlPWxPmTZTPVgTobo8R5oCksTXwGejtHhE/w494-h330/SOF-ELK3.PNG"
                width="494" /></a></div><b>Default User:</b> elk_user
</div>
<div class="separator" style="clear: both; text-align: center;"><b>Default Password:</b> forensics<br />
    <div class="separator" style="clear: both; text-align: center;"><br /></div>
    <div class="separator" style="clear: both; text-align: center;"><b><u>Note the IP AND PORT for logging into the
                web-gui later.</u></b></div>
    <div class="separator" style="clear: both; text-align: center;"><br /></div>
</div>
<h3 style="text-align: left;"><span style="font-family: helvetica;">Where you will place your files.</span></h3>
<p style="text-align: left;"><span style="font-family: helvetica;">To start, it's essential to prepare and decide on the
        method you intend to use for transferring files to the designated folder on the machine. In this example, I'll
        be utilizing WinSCP for the connection and transfer process.</span></p>
<p style="text-align: left;"></p>
<div class="separator" style="clear: both; text-align: center;"><a
        href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiwD0ZeyyDOw0ypo9ge7stmmElsaoDFrp1H8bF_ocMJ5oHrV2qqtqW3bznwxWwhckQBoes4iZZV5XcEM8rmIhEigNQt1jss7HcJuYDrzcJMvYP-JfhNKQcKdJ5430Nv4_LzNW8354n8ScOLJW0yw886805qClCNLjocjqvpjoWV5kdZJq460ZF50lPk9b42/s622/SOF-ELK4.PNG"
        style="margin-left: 1em; margin-right: 1em;"><img border="0" data-original-height="420"
            data-original-width="622" height="334"
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiwD0ZeyyDOw0ypo9ge7stmmElsaoDFrp1H8bF_ocMJ5oHrV2qqtqW3bznwxWwhckQBoes4iZZV5XcEM8rmIhEigNQt1jss7HcJuYDrzcJMvYP-JfhNKQcKdJ5430Nv4_LzNW8354n8ScOLJW0yw886805qClCNLjocjqvpjoWV5kdZJq460ZF50lPk9b42/w494-h334/SOF-ELK4.PNG"
            width="494" /></a></div>
<p style="text-align: left;"><b>And from here we can navigate to our destination folder:</b></p>
<h3>
    <div class="separator" style="clear: both; text-align: center;">
        <div>
            <div>
                <p
                    style="background: rgb(243, 243, 247); border: 1px solid rgb(222, 222, 227); line-height: 1.3em; margin-bottom: 22px; margin-top: 0px; outline: 0px; overflow: auto; padding: 11px; vertical-align: baseline;">
                    <span style="font-family: helvetica; text-align: left;">/logstash/kape</span></p>
            </div>
            <div><a href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi1_IZtPxxRsOaqFD66a-pKv1s45UiWgC_nwvm7oSZP5WxhuV0IOpvU7Xnsra3-4Hcqrs4PWndacKkvPg8mV3GFzm1c9deVoxCpFAFnMKS5FyprKk81N1B3E_FVD6UchL_94tZBIErK79UDCwUGIbNDcupfYuXVMOJ7Czgg1Ovn3ylsKDTOQaGgBefgVdT7/s1076/SOF-ELK5.PNG"
                    style="margin-left: 1em; margin-right: 1em;"><img border="0" data-original-height="408"
                        data-original-width="1076" height="215"
                        src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi1_IZtPxxRsOaqFD66a-pKv1s45UiWgC_nwvm7oSZP5WxhuV0IOpvU7Xnsra3-4Hcqrs4PWndacKkvPg8mV3GFzm1c9deVoxCpFAFnMKS5FyprKk81N1B3E_FVD6UchL_94tZBIErK79UDCwUGIbNDcupfYuXVMOJ7Czgg1Ovn3ylsKDTOQaGgBefgVdT7/w568-h215/SOF-ELK5.PNG"
                        width="568" /></a></div>
        </div>
        <div><br /></div>
    </div>
</h3>
<p></p>
<p></p>
<div>
    <div>
        <h3 style="text-align: left;"><span style="font-family: helvetica;">Create your KAPE Files</span></h3><span
            style="font-family: helvetica;">
            <div><b>Step 1: Download and Install KAPE:</b> Begin by downloading and installing KAPE on your system.
            </div>
            <div><br /></div>
            <div><b>Step 2: Create a KAPE Target:</b> Define a KAPE target to specify the artifacts you want to collect,
                including MFT and EVTX files. For this example, I will be using the Kape Gui to assist for photos.</div>
            <div><br /></div>
            <div><b>Step 3:</b> Configure Output Destination: Set the destination where KAPE will store the collected
                files. Ensure that there is sufficient storage space available.</div>
            <div><br /></div>
            <div><b>Step 4:</b> Run KAPE Scan: Execute the KAPE scan by providing the appropriate command, specifying
                the target and output location. This target in the example will be the local host, but this could be a
                mounted image that is on a different partition letter such as " F:\ " exporting to " C:\ " .</div>
            <div><br /></div>
            <div><b>Step 5:</b>&nbsp;Process Artifacts: Utilize KAPE's processing capabilities to extract meaningful
                information from the collected MFT and EVTX files. KAPE provides various modules for parsing and
                analyzing different artifacts.</div>
            <div><br /></div>
            <div>Note: For this, you will want to ensure that the JSON files are created. To do so, select on the JSON
                radio button as highlighted in the photo in green.</div>
            <div><br /></div>
            <div><b>Step 6: </b>Review Results: Once the scan completes, review the generated KAPE report to ensure that
                the MFT and EVTX files were successfully collected and processed into timeline files.</div>
            <div><br /></div>
            <div><b>Step 7: Move the results:</b> Once you confirm the files appear correct, use WinSCP to move/copy the
                files to the SOF-ELK Kape Folder and wait a few minutes for the system to import them with the
                preinstalled filebeats process.</div>
            <div><br /></div>
            <div class="separator" style="clear: both; text-align: center;"><a
                    href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi2wkP-fldXYcQOT0aiAahwAL9jpkNvBvRpA-jstTUZDqOPzGNung-ll1ThbT4M4Wh5LrMibXjKTDkYVsxaOV9R1kT3k7o82KOnnN2ddLim220HLPTY7OfOskO4oFfWUG8CSP_XCfuy8yup3CN_Htm4aSl8eyQT2mNC7luR9mQsTbI0kpW9gw1Sw48l4vf9/s1246/SOF-ELK6.png"
                    style="margin-left: 1em; margin-right: 1em;"><img border="0" data-original-height="900"
                        data-original-width="1246" height="361"
                        src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi2wkP-fldXYcQOT0aiAahwAL9jpkNvBvRpA-jstTUZDqOPzGNung-ll1ThbT4M4Wh5LrMibXjKTDkYVsxaOV9R1kT3k7o82KOnnN2ddLim220HLPTY7OfOskO4oFfWUG8CSP_XCfuy8yup3CN_Htm4aSl8eyQT2mNC7luR9mQsTbI0kpW9gw1Sw48l4vf9/w500-h361/SOF-ELK6.png"
                        width="500" /></a></div>
            <div class="separator" style="clear: both; text-align: center;"><br /></div>
            <div class="separator" style="clear: both; text-align: center;"><a
                    href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjNOyUx3yaFgZMda4lncyih0e6mBW7QLrWjgAH9yFkRBTT1rWZqIiFt3nOytS1aeMZTGjosgMvzuRbsOR_wuddjnkyLC1YC8lbGd1BbbX3NMjyVbIW4uggBgvsuPS2jWkzbRG80LMGTJU99nJ6rCIx12JINcfiltnXfjY5gjhWYFWEN_beihsjGHUUbj-Be/s977/SOF-ELK6-2.png"
                    style="margin-left: 1em; margin-right: 1em;"><img border="0" data-original-height="233"
                        data-original-width="977" height="119"
                        src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjNOyUx3yaFgZMda4lncyih0e6mBW7QLrWjgAH9yFkRBTT1rWZqIiFt3nOytS1aeMZTGjosgMvzuRbsOR_wuddjnkyLC1YC8lbGd1BbbX3NMjyVbIW4uggBgvsuPS2jWkzbRG80LMGTJU99nJ6rCIx12JINcfiltnXfjY5gjhWYFWEN_beihsjGHUUbj-Be/w499-h119/SOF-ELK6-2.png"
                        width="499" /></a></div>
            <div class="separator" style="clear: both; text-align: center;"><br /></div>
            <div class="separator" style="clear: both; text-align: center;"><a
                    href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhlWgwlqp01bW_Kw79e2IhvtwybTTsi1-e7cVa3HpkVY5ZQnUT3BubZTo1zZh-uZoio4i9akdWmArFLR8OPTv-AXTEZhqXsr0HK8wBQhwGbmXT56gGG7a2zP2D_Ljc965poFxMbIjnfTomxiGH4QeixN5OCiBLu7lHck2aq9k0fKux9wxqwHOssmrdd6aZl/s979/SOF-ELK6-3.png"
                    style="margin-left: 1em; margin-right: 1em;"><img border="0" data-original-height="512"
                        data-original-width="979" height="261"
                        src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhlWgwlqp01bW_Kw79e2IhvtwybTTsi1-e7cVa3HpkVY5ZQnUT3BubZTo1zZh-uZoio4i9akdWmArFLR8OPTv-AXTEZhqXsr0HK8wBQhwGbmXT56gGG7a2zP2D_Ljc965poFxMbIjnfTomxiGH4QeixN5OCiBLu7lHck2aq9k0fKux9wxqwHOssmrdd6aZl/w500-h261/SOF-ELK6-3.png"
                        width="500" /></a></div><br />
            <div class="separator" style="clear: both; text-align: center;"><br /></div>
            <div class="separator" style="clear: both; text-align: center;"><a
                    href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEicvvKkdTt8fTTbKmXwfjohlBlBtweXjW-Hs-7NpEakAy2q7RcZA8oA72U5D5wTKb37F5pJ6f5AUYBxkuhUt70PvcCX5LpdPW5vrK_ATea8qZtiUijcO6lfjeh46zUsBoztNjtUvwMipVtr9cJ0abzbukVX4iGr5gSWp_DuheENm49Ua_tyixFjtsD4LJrD/s1076/SOF-ELK7.png"
                    style="margin-left: 1em; margin-right: 1em;"><img border="0" data-original-height="407"
                        data-original-width="1076" height="189"
                        src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEicvvKkdTt8fTTbKmXwfjohlBlBtweXjW-Hs-7NpEakAy2q7RcZA8oA72U5D5wTKb37F5pJ6f5AUYBxkuhUt70PvcCX5LpdPW5vrK_ATea8qZtiUijcO6lfjeh46zUsBoztNjtUvwMipVtr9cJ0abzbukVX4iGr5gSWp_DuheENm49Ua_tyixFjtsD4LJrD/w501-h189/SOF-ELK7.png"
                        width="501" /></a></div><br />
            <div class="separator" style="clear: both; text-align: center;"><a
                    href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi8Ta8Gmw_LiWKXyaA93AsSBDFK2JgHa0FosS3g8AD3E7ViqRovDjUoD3Bm6Tv4UDF6jEOJgPKHn1OHZcH-85AYHZcNq4TFdxsM03BfzuKBouPAfc2UAfwmh-rJ_AYtGNsLmTmAFwUtIBtU5hKcT66ivprr50xKPFT11q-PTp4KFzrXSmTsNLY0qboBCB_S/s434/SOF-ELK8.png"
                    style="margin-left: 1em; margin-right: 1em;"><img border="0" data-original-height="198"
                        data-original-width="434" height="228"
                        src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi8Ta8Gmw_LiWKXyaA93AsSBDFK2JgHa0FosS3g8AD3E7ViqRovDjUoD3Bm6Tv4UDF6jEOJgPKHn1OHZcH-85AYHZcNq4TFdxsM03BfzuKBouPAfc2UAfwmh-rJ_AYtGNsLmTmAFwUtIBtU5hKcT66ivprr50xKPFT11q-PTp4KFzrXSmTsNLY0qboBCB_S/w500-h228/SOF-ELK8.png"
                        width="500" /></a></div>
            <div class="separator" style="clear: both; text-align: center;"><br /></div>
        </span>
    </div>
    <h3 style="text-align: left;"><span style="font-family: helvetica;">Exploring the SOF-ELK Web GUI</span></h3><span
        style="font-family: helvetica;">Using the IP:Port of your Server, we can go to http://&lt;IP&gt;:5601.</span>
</div>
<div><span style="font-family: helvetica;"><br /></span></div>
<div>
    <div class="separator" style="clear: both; text-align: center;"><a
            href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi7xJJXSrqjlNM4Z1oZ_9YCZTHlWlHkauxiCZDYx-AAiZCh7X3StAwAF9gFXNkWcD9RaiAnvtmwodk1hLsIejRUobNsrY1JntCzQCtRU05fJEzDVyuPGCdwWN-7BEziWaaqb1PCu8WEL-reg0Jj06LPH621I8yrBjL5yRDJe5tanJ4c4hnQzyGvmwKtBsrR/s1563/SOF-ELK10.png"
            style="margin-left: 1em; margin-right: 1em;"><img border="0" data-original-height="815"
                data-original-width="1563" height="261"
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi7xJJXSrqjlNM4Z1oZ_9YCZTHlWlHkauxiCZDYx-AAiZCh7X3StAwAF9gFXNkWcD9RaiAnvtmwodk1hLsIejRUobNsrY1JntCzQCtRU05fJEzDVyuPGCdwWN-7BEziWaaqb1PCu8WEL-reg0Jj06LPH621I8yrBjL5yRDJe5tanJ4c4hnQzyGvmwKtBsrR/w500-h261/SOF-ELK10.png"
                width="500" /></a></div><br />
</div>
<div><span style="font-family: helvetica;">The Key area you will want to be aware of is the different dashboards you can
        pick from as each of the different artifacts are shown using a different dashboard.&nbsp;</span></div>
<div><span style="font-family: helvetica;"><br /></span></div>
<div><span style="font-family: helvetica;">These are each called:</span></div>
<div><span style="font-family: helvetica;">&nbsp;- <i><b>Eventlog Dashboard</b></i></span></div>
<div><span style="font-family: helvetica;">&nbsp;- <b><i>LNK File Dashboard</i></b></span></div>
<div><span style="font-family: helvetica;">&nbsp;- <b><i>Filesystem Dashboard</i></b></span></div>
<div><span style="font-family: helvetica;"><br /></span></div>
<div>
    <div class="separator" style="clear: both; text-align: center;"><a
            href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjYhwZaWVdbKqys6N4MHOwV83JiWxu7UnrAt_q95nsYRrytosSbcXu_XukqwfgIjuc4txyUM0MecCHHieLVWh_yB2tZabPdYjeqKsozo0LYXK4WCuoMJYOi6A8X6M8S3f5x-QawY0l1sdTsFN3ZRTNe0FEASIHyfgIPFMfpC6PONEpLOk4v7ewDWdMs7KiU/s1563/SOF-ELK11.png"
            style="margin-left: 1em; margin-right: 1em;"><img border="0" data-original-height="814"
                data-original-width="1563" height="286"
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjYhwZaWVdbKqys6N4MHOwV83JiWxu7UnrAt_q95nsYRrytosSbcXu_XukqwfgIjuc4txyUM0MecCHHieLVWh_yB2tZabPdYjeqKsozo0LYXK4WCuoMJYOi6A8X6M8S3f5x-QawY0l1sdTsFN3ZRTNe0FEASIHyfgIPFMfpC6PONEpLOk4v7ewDWdMs7KiU/w549-h286/SOF-ELK11.png"
                width="549" /></a></div><br />
    <div class="separator" style="clear: both; text-align: center;"><a
            href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj8FlMkYN4gXrkTQtkLmDgjhgfteUVgKs9p6K1KBednyM2HnR98VgvzxLY75qQINPAWEOHjSgc4_R7CuE-UIml7ZkXSS44Cwp3B6qfif9cC4XD3mY1HihyphenhyphenNj6HoHNxmjUOJe_rNiI9UfKTZqY62guuv3ZhXJKqBvNN2Xv8Wiw42yyXxDloaNfQHqY8oIdNg/s1563/SOF-ELK12.png"
            style="margin-left: 1em; margin-right: 1em;"><img border="0" data-original-height="816"
                data-original-width="1563" height="288"
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj8FlMkYN4gXrkTQtkLmDgjhgfteUVgKs9p6K1KBednyM2HnR98VgvzxLY75qQINPAWEOHjSgc4_R7CuE-UIml7ZkXSS44Cwp3B6qfif9cC4XD3mY1HihyphenhyphenNj6HoHNxmjUOJe_rNiI9UfKTZqY62guuv3ZhXJKqBvNN2Xv8Wiw42yyXxDloaNfQHqY8oIdNg/w551-h288/SOF-ELK12.png"
                width="551" /></a></div><br />
    <div style="text-align: center;"><b style="font-family: helvetica;"><u>NOTE:</u></b></div>
</div>
<div style="text-align: center;"><span style="font-family: helvetica;"><b><u>ENSURE YOU CHANGE THE TIMEFRAME AT THE TOP
                RIGHT TO FIT THE PROPER TIMEFRAME YOU ARE LOOKING FOR!!</u></b></span></div>
<div><span style="font-family: helvetica;"><br /></span></div>
<div><span style="font-family: helvetica;"><br /></span></div>
<div>
    <div class="separator" style="clear: both; text-align: center;">
        <div class="separator" style="clear: both; text-align: center;">
            <div class="separator" style="clear: both; text-align: center;">
                <h3 style="text-align: left;"><span style="font-family: helvetica;">Deleting Imported Data</span></h3>
                <span style="font-family: helvetica; text-align: left;">
                    <div class="separator" style="clear: both; text-align: center;"><span
                            style="font-family: helvetica; text-align: left;"><span
                                style="font-family: helvetica;"><br /></span></span></div>
                    <div style="text-align: center;">
                        <p
                            style="background: rgb(243, 243, 247); border: 1px solid rgb(222, 222, 227); font-family: &quot;Times New Roman&quot;; font-size: 18.72px; font-weight: 700; line-height: 1.3em; margin-bottom: 22px; margin-top: 0px; outline: 0px; overflow: auto; padding: 11px; vertical-align: baseline;">
                            <span style="font-family: helvetica; text-align: left;">curl -X DELETE
                                'http://localhost:9200/_all'<br /></span></p>
                        <p
                            style="background: rgb(243, 243, 247); border: 1px solid rgb(222, 222, 227); line-height: 1.3em; margin-bottom: 22px; margin-top: 0px; outline: 0px; overflow: auto; padding: 11px; text-align: center; vertical-align: baseline;">
                            <span style="font-size: 18.72px;"><b>Invoke-WebRequest -method DELETE
                                    http://localhost:9200/_all</b></span></p>
                    </div>
                    <div class="separator" style="clear: both; text-align: center;">Source: <a
                            href="https://stackoverflow.com/questions/22924300/removing-data-from-elasticsearch">StackOverflow</a>
                    </div>
                    <div class="separator" style="clear: both; text-align: center;"><br /></div>
                    <div class="separator" style="clear: both; text-align: center;"><br /></div>
                </span>
            </div>
        </div>
        <h3 style="clear: both; text-align: left;"><span style="font-family: helvetica;">Additional Resources</span>
        </h3>
        <div class="separator" style="clear: both; text-align: left;">
            <ul style="text-align: left;">
                <li><span style="font-family: helvetica;">EricZimmerman - <a
                            href="https://ericzimmerman.github.io/#!index.md">LECmd </a></span><span
                        style="font-family: helvetica;">- Parse lnk files</span></li>
                <li><span style="font-family: helvetica;">EricZimmerman - <a
                            href="https://ericzimmerman.github.io/#!index.md" target="_blank">MFTECmd</a> - Parse $MFT /
                        $J file</span></li>
                <li><span style="font-family: helvetica;">EricZimmerman -&nbsp;<a
                            href="https://ericzimmerman.github.io/#!index.md" target="_blank">EvtxECmd</a>&nbsp;- Parse
                        EVTX Files</span></li>
                <li><span style="font-family: helvetica;">KROLL -&nbsp;<a
                            href="https://s3.amazonaws.com/cyb-us-prd-kape/kape.zip" target="_blank">KAPE</a>&nbsp;-
                        Modular Triage Tool</span></li>
            </ul>
        </div>
    </div>
    <p></p>
    <p></p>
</div>