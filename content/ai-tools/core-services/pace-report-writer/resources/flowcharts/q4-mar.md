# PaCE — Q4 End-Year Review (December to March)

> **Deadline:** NLT Mid-March
> Back to [master.md](master.md)

```mermaid
flowchart TD
    START(["Begin Q4 — After Q3 Review"])

    subgraph ONGOING ["Ongoing Throughout the Quarter"]
        MBR_FNS["Member: Create own FNs monthly<br/>Summarize key tasks and outcomes"]
        SUP_OBS["Supervisor: Observe and document<br/>performance throughout the period"]
        OPT_DEADLINE["Process any approved Opt-Out or Opt-In<br/>Deadline 15 Jan — PaCE Manager handles"]
        MBR_FNS ~~~ SUP_OBS ~~~ OPT_DEADLINE
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
    SESSION_CHK -->|"No — end of quarter"| Q4_FN

    subgraph Q4_SUMMARY ["Q4 End-Year Summary Feedback Note — NLT Mid-March"]
        Q4_FN["Supervisor writes Q4 End-Year Summary FN<br/>Comprehensive review of full year performance<br/>Ensure all significant events are captured"]
        Q4_DEBRIEF["Conduct Q4 Feedback Session<br/>Debrief member on Q4 Summary FN<br/>Discuss overall year performance"]
        Q4_ACK["Member acknowledges Q4 FN<br/>At supervisor station or own station"]
        Q4_FN --> Q4_DEBRIEF --> Q4_ACK
    end

    Q4_ACK --> FN_REVIEW["Review full year FN record<br/>Confirm all FNs are acknowledged<br/>Confirm Author, RO, SA, IR roles are assigned<br/>by PaCE Manager"]

    FN_REVIEW --> POSTING{"APS Posting<br/>Occurring?"}
    POSTING -->|Yes| APS["Losing Unit: Write Summary FN<br/>Debrief member before departure<br/>Member acknowledges before leaving"]
    POSTING -->|No| END
    APS --> END(["Proceed to PAR — see par.md"])
```

### Q4 Context (December – March)
- This is the end-year quarter. The Q4 FN should reflect the full year's performance, not just this quarter.
- Confirm all PaCE roles are assigned (Author, Reviewing Officer, Signing Authority, Intermediary Reviewer if required) — contact PaCE Manager to assign or correct.
- Ensure the member's cumulative FN record is complete before the PAR is written.
- This is the last opportunity to capture any significant events in writing before the PAR cycle begins.
