# PaCE — Initial Setup

> **Deadline:** NLT 30 April, or ASAP after APS posting.
> Back to [master.md](master.md)

```mermaid
flowchart TD
    START(["Begin: New Cycle or APS Posting"])

    subgraph BOTH ["Both Member and Supervisor"]
        TRAIN["Complete PaCE Training on DLN 3.0"]
        GET_MASS["Obtain Monitor MASS account<br/>if not already active"]
        TRAIN --> GET_MASS
    end

    GET_MASS --> ASSIGN_SUP

    subgraph SUP_SETUP ["Supervisor Actions"]
        ASSIGN_SUP["Assign self as PaCE Supervisor<br/>Repeat for each subordinate"]
        CREATE_JD["Create Job Description<br/>Primary duties only<br/>Do NOT include secondary duties here"]
        FINALIZE_JD["Finalize Job Description<br/>Member notified by email<br/>Up to 7 days to un-finalize without PaCE Manager"]
        ASSIGN_SUP --> CREATE_JD --> FINALIZE_JD
    end

    subgraph MBR_SETUP ["Member Actions"]
        REVIEW_JD["Review Job Description"]
        COMPLETE_MAP["Complete or update MAP<br/>Immediate, Medium, Long-Term Goals<br/>Training, Job Experience, Other Considerations"]
        OPT_CHECK{"Considering Opting Out?"}
        REVIEW_JD --> COMPLETE_MAP --> OPT_CHECK
    end

    FINALIZE_JD --> JOINT_INTERVIEW

    subgraph JOINT ["Joint: JD and MAP Interview"]
        JOINT_INTERVIEW["Conduct JD and MAP Interview<br/>Review content together"]
        ACK_MAP["Supervisor acknowledges MAP<br/>Not a commitment to fulfill aspirations"]
        JOINT_INTERVIEW --> ACK_MAP
    end

    OPT_CHECK -->|"Yes — Deadline: 15 Jan"| OPTOUT["Submit DND 4638<br/>PaCE Manager processes Opt-Out<br/>Member still receives PAR<br/>Potential will not be appraised"]
    OPT_CHECK -->|No| JOINT_INTERVIEW
    OPTOUT --> ACK_MAP

    ACK_MAP --> FN_INITIAL

    subgraph INIT_FNS ["Initial Feedback Notes — NLT 30 Apr"]
        FN1["FN 1: Initial Review of JD and MAP"]
        FN2["FN 2: Secondary Duties"]
        FN3["FN 3: Inclusive Behaviours"]
        FN1 --> FN2 --> FN3
    end

    FN3 --> DEBRIEF_FNS["Conduct Feedback Session<br/>Debrief member on all 3 FNs<br/>Member acknowledges each FN"]
    DEBRIEF_FNS --> END(["Proceed to Q1 — see q1-jul.md"])
```

### Key Notes
- **Posted member:** Losing unit must produce a summary FN and debrief before departure. Member must acknowledge before departure.
- **Gaining unit:** Complete Initial Setup steps ASAP after member arrives.
- **Opt-Out deadline:** DND 4638 must be approved by 15 January.
- **Succession Management:** Only PO2/Sgt and above complete this field in the MAP.
- **Secondary Streams:** Only LCdr/Maj and above complete this section.
- **Career Interests:** Only CPO1/CWO complete this section.
