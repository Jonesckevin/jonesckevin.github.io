# PaCE — Q2 Quarterly Review (July to October)

> **Deadline:** NLT 1st Week of October
> Back to [master.md](master.md)

```mermaid
flowchart TD
    START(["Begin Q2 — After Q1 Review"])

    subgraph ONGOING ["Ongoing Throughout the Quarter"]
        MBR_FNS["Member: Create own FNs monthly<br/>Summarize key tasks and outcomes"]
        SUP_OBS["Supervisor: Observe and document<br/>performance throughout the period"]
        MBR_FNS ~~~ SUP_OBS
    end

    ONGOING --> SESSION_CHK{"Feedback Session<br/>Required?"}

    SESSION_CHK -->|"Yes — either party may request"| SESSION

    subgraph SESSION ["Feedback Session Process"]
        CONDUCT["Conduct Feedback Session<br/>Discuss tasks, MAP, JD, concerns<br/>or any problems"]
        WRITE_FN["Supervisor writes Feedback Note<br/>Event Description and Outcome"]
        SET_READY["Set FN status to Ready<br/>Send to member for acknowledgment"]
        ACK{"Member co-located<br/>with Supervisor?"}
        ACK_SUP_STA["Member acknowledges at<br/>Supervisor station — preferred"]
        ACK_MBR_STA["Supervisor transfers FN to member<br/>Member acknowledges from own station"]
        CONDUCT --> WRITE_FN --> SET_READY --> ACK
        ACK -->|Yes| ACK_SUP_STA
        ACK -->|No| ACK_MBR_STA
    end

    ACK_SUP_STA --> SESSION_CHK
    ACK_MBR_STA --> SESSION_CHK
    SESSION_CHK -->|"No — end of quarter"| Q2_FN

    subgraph Q2_SUMMARY ["Q2 Summary Feedback Note — NLT 1st Week of October"]
        Q2_FN["Supervisor writes Q2 Summary FN<br/>Key tasks and performance this quarter"]
        Q2_DEBRIEF["Conduct Q2 Feedback Session<br/>Debrief member on Q2 Summary FN"]
        Q2_ACK["Member acknowledges Q2 FN<br/>At supervisor station or own station"]
        Q2_FN --> Q2_DEBRIEF --> Q2_ACK
    end

    Q2_ACK --> POSTING{"APS Posting<br/>Occurring?"}
    POSTING -->|Yes| APS["Losing Unit: Write Summary FN<br/>Debrief member before departure<br/>Member acknowledges before leaving"]
    POSTING -->|No| END
    APS --> END(["Proceed to Q3 — see q3-dec.md"])
```

### Q2 Context (July – October)
- Mid-year review — a good checkpoint to evaluate whether the JD still reflects current duties.
- Discuss whether the member's MAP goals remain realistic and relevant.
- If the member is considering Opting Out, this is a good time to discuss ramifications before the 15 January deadline.
- Address any significant events, courses, or qualifications completed this quarter.
