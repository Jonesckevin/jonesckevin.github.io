# PaCE — Q3 Quarterly Review (October to December)

> **Deadline:** NLT Mid-December
> Back to [master.md](master.md)

```mermaid
flowchart TD
    START(["Begin Q3 — After Q2 Review"])

    subgraph ONGOING ["Ongoing Throughout the Quarter"]
        MBR_FNS["Member: Create own FNs monthly<br/>Summarize key tasks and outcomes"]
        SUP_OBS["Supervisor: Observe and document<br/>performance throughout the period"]
        OPT_REMIND["Remind member: Opt-Out deadline<br/>DND 4638 must be approved NLT 15 Jan"]
        MBR_FNS ~~~ SUP_OBS ~~~ OPT_REMIND
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
    SESSION_CHK -->|"No — end of quarter"| Q3_FN

    subgraph Q3_SUMMARY ["Q3 Summary Feedback Note — NLT Mid-December"]
        Q3_FN["Supervisor writes Q3 Summary FN<br/>Key tasks and performance this quarter"]
        Q3_DEBRIEF["Conduct Q3 Feedback Session<br/>Debrief member on Q3 Summary FN"]
        Q3_ACK["Member acknowledges Q3 FN<br/>At supervisor station or own station"]
        Q3_FN --> Q3_DEBRIEF --> Q3_ACK
    end

    Q3_ACK --> OPT_DEADLINE["Confirm Opt-Out status<br/>DND 4638 deadline is 15 January<br/>PaCE Manager must process"]

    OPT_DEADLINE --> POSTING{"APS Posting<br/>Occurring?"}
    POSTING -->|Yes| APS["Losing Unit: Write Summary FN<br/>Debrief member before departure<br/>Member acknowledges before leaving"]
    POSTING -->|No| END
    APS --> END(["Proceed to Q4 — see q4-mar.md"])
```

### Q3 Context (October – December)
- The Opt-Out deadline (15 Jan) is approaching — confirm the member's decision and process DND 4638 if applicable.
- Begin reviewing the member's cumulative FN record in preparation for the upcoming year-end PAR.
- Ensure all significant events, courses, and qualifications from this period are captured in FNs while details are fresh.
- Consider whether any additional FNs are needed before year-end to accurately reflect performance.
