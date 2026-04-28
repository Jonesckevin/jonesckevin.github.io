# PaCE — Q1 Quarterly Review (April to July)

> **Deadline:** NLT 1st Week of July
> Back to [master.md](master.md)

```mermaid
flowchart TD
    START(["Begin Q1 — After Initial Setup"])

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
    SESSION_CHK -->|"No — end of quarter"| Q1_FN

    subgraph Q1_SUMMARY ["Q1 Summary Feedback Note — NLT 1st Week of July"]
        Q1_FN["Supervisor writes Q1 Summary FN<br/>Key tasks and performance this quarter<br/>Must reflect observed behaviours"]
        Q1_DEBRIEF["Conduct Q1 Feedback Session<br/>Debrief member on Q1 Summary FN"]
        Q1_ACK["Member acknowledges Q1 FN<br/>At supervisor station or own station"]
        Q1_FN --> Q1_DEBRIEF --> Q1_ACK
    end

    Q1_ACK --> POSTING{"APS Posting<br/>Occurring?"}
    POSTING -->|Yes| APS["Losing Unit: Write Summary FN<br/>Debrief member before departure<br/>Member acknowledges before leaving"]
    POSTING -->|No| END
    APS --> END(["Proceed to Q2 — see q2-oct.md"])
```

### Q1 Context (April – July)
- First regular FN quarter following Initial Setup.
- Confirm the JD and MAP reflect the member's actual duties after settling into the cycle.
- Address any early performance trends — positive, corrective, or developmental — before they become entrenched.
- Remind member to review competencies associated with their rank.
