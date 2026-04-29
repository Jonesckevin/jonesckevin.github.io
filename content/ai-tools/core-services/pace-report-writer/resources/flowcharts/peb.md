# PaCE — Potential Evaluation Board (PEB) / Unit Potential Board (UPB)

> **Timeline:** May
> Back to [master.md](master.md)
> How Potential is **scored** in PaCE → [potential-appraisal.md](potential-appraisal.md)
> Applies to: **Cpl/S1 and above** (all qualifying PAR recipients). Only **PO2/Sgt and above** may opt out of Succession Management via DND 4638.

```mermaid
flowchart TD
    START(["Begin PEB — After PAR Signed by RO"])

    ELIGIBILITY{"Member eligible<br/>for Potential Appraisal?"}

    ELIGIBILITY -->|"No — Below Cpl/S1, or PO2/Sgt+ opted out"| NOT_ELIGIBLE["Member receives PAR only<br/>Potential not appraised<br/>No board file prepared"]
    ELIGIBILITY -->|"Yes — Cpl/S1+; PO2/Sgt+ must not have opted out"| PAR_GATEWAY

    NOT_ELIGIBLE --> END_NO(["End — No Board Process"])

    PAR_GATEWAY{"PAR supports<br/>Potential Appraisal?"}
    PAR_GATEWAY -->|"No — PAR does not meet threshold"| WEAK_PAR["Strong PAR required as gateway<br/>Consult CoC — member may not proceed<br/>to Potential Appraisal or HLRR"]
    PAR_GATEWAY -->|Yes| PREPARE_FILE

    WEAK_PAR --> END_WEAK(["End — No Board Recommendation"])

    subgraph PREPARE ["Prepare Board File"]
        PREPARE_FILE["Confirm Author assigned<br/>PAR acknowledged by member"]
        REVIEW_DOCS["Review all supporting documents<br/>FNs, courses, qualifications, MAP"]
        PREPARE_FILE --> REVIEW_DOCS
    end

    REVIEW_DOCS --> UPB_PROCESS

    subgraph UPB ["Unit Potential Board — May"]
        UPB_PROCESS["PaCE Manager administers board<br/>One rank group at a time<br/>Requires DWAN and Monitor MASS access"]
        BOARD_REVIEW["Board reviews member files<br/>PAR scores, FN history, courses, MAP"]
        POT_RATING["Board assigns Potential Rating<br/>Based on evidence of readiness for next rank"]
        UPB_PROCESS --> BOARD_REVIEW --> POT_RATING
    end

    POT_RATING --> HLRR_CHECK{"File selected<br/>for HLRR?"}
    HLRR_CHECK -->|"Yes — see hlrr.md"| HLRR(["Proceed to HLRR — see hlrr.md"])
    HLRR_CHECK -->|No| DEBRIEF["Schedule Potential Debrief<br/>June deadline for final debriefs"]

    DEBRIEF --> ESIGN["Member e-signs Potential Appraisal<br/>June"]
    ESIGN --> END(["PEB Complete — Return to master.md"])
```

### Key Notes
- **Eligibility:** Cpl/S1 and above (all qualifying PAR recipients). Only PO2/Sgt and above may opt out of Succession Management via DND 4638 — Cpl/S1 and MCpl/MS are included automatically.
- **Gateway requirement:** A strong PAR is required before a member's file can be forwarded for Potential Appraisal.
- **Board rooms:** UPBs require access to DWAN and Monitor MASS.
- **One rank at a time:** Boards are held per rank group — not all members at once.
- **Timeline:** UPBs are held in May. Final debriefs and e-signs complete by end of June.
- **PaCE Manager role:** The PaCE Manager administers the board and manages file access.
