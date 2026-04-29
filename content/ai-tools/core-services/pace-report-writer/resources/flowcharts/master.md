# PaCE Supervisor Workflow — Master Flowchart

> Full annual PaCE cycle overview. Each phase links to a detailed sub-flowchart.

```mermaid
flowchart TD
    START(["Start of PaCE Cycle"])

    INIT["📋 Initial Setup<br/>NLT 30 Apr or ASAP after posting"]
    Q1["Q1 Quarterly Review<br/>NLT 1st Week of July"]
    Q2["Q2 Quarterly Review<br/>NLT 1st Week of October"]
    Q3["Q3 Quarterly Review<br/>NLT Mid-December"]
    Q4["Q4 End-Year Review<br/>NLT Mid-March"]
    PAR_PHASE["📝 PAR Process<br/>Complete by End of April"]
    DEBRIEF["PAR Debrief and Acknowledgment<br/>Mid to End of April<br/>Informal Resolution if required"]
    POT{"Member eligible for PEB?<br/>Cpl/S1 and above<br/>(PO2/Sgt+ may opt out of Succession Mgmt)"}
    PEB_PHASE["🏛️ Potential Evaluation Board<br/>Unit Potential Board — May"]
    HLRR_CHK{"HLRR<br/>Eligible?"}
    HLRR_PHASE["📊 Higher Level Review Ranking<br/>May"]
    FINAL["Final Debriefs and E-Sign<br/>June"]
    END(["End of PaCE Cycle"])

    START --> INIT
    INIT --> Q1 --> Q2 --> Q3 --> Q4 --> PAR_PHASE --> DEBRIEF
    DEBRIEF --> POT
    POT -->|Yes| PEB_PHASE
    POT -->|No| END
    PEB_PHASE --> HLRR_CHK
    HLRR_CHK -->|Yes| HLRR_PHASE --> FINAL --> END
    HLRR_CHK -->|No| FINAL

    click INIT "initial.md" "View Initial Setup"
    click Q1 "q1-jul.md" "View Q1 Details"
    click Q2 "q2-oct.md" "View Q2 Details"
    click Q3 "q3-dec.md" "View Q3 Details"
    click Q4 "q4-mar.md" "View Q4 Details"
    click PAR_PHASE "par.md" "View PAR Process"
    click PEB_PHASE "peb.md" "View PEB Process"
    click HLRR_PHASE "hlrr.md" "View HLRR Process"
```

## Supporting References

| Document | Purpose |
|---|---|
| [initial.md](initial.md) | Initial Setup — JD, MAP, 3x FNs |
| [q1-jul.md](q1-jul.md) | Q1 Quarterly Review (NLT 1st Week July) |
| [q2-oct.md](q2-oct.md) | Q2 Quarterly Review (NLT 1st Week October) |
| [q3-dec.md](q3-dec.md) | Q3 Quarterly Review (NLT Mid-December) |
| [q4-mar.md](q4-mar.md) | Q4 End-Year Review (NLT Mid-March) |
| [par.md](par.md) | PAR — Author → IR → RO → PARMON → Debrief |
| [peb.md](peb.md) | Unit Potential Board — May |
| [hlrr.md](hlrr.md) | Higher Level Review Ranking — May/June |
| [potential-appraisal.md](potential-appraisal.md) | How Potential is scored (BI ratings, IBR, 5-point scale) |
