# PaCE — Higher Level Review Ranking (HLRR)

> **Timeline:** May (Board) — June (Final Debriefs and E-Sign)
> Back to [master.md](master.md)

```mermaid
flowchart TD
    START(["Begin HLRR — After UPB Recommendation"])

    GATEWAY{"PAR and UPB result<br/>support HLRR?"}
    GATEWAY -->|"No — file does not meet threshold"| NOT_FWD["File not forwarded<br/>Member completes cycle at unit level<br/>Debrief conducted at unit"]
    GATEWAY -->|Yes| PREPARE

    NOT_FWD --> END_NO(["End — No HLRR Process"])

    subgraph PREPARE ["Prepare HLRR File"]
        PREPARE_FILE["Confirm all PAR roles e-signed<br/>UPB result documented"]
        COMPILE["Compile HLRR file<br/>PAR, Potential Rating, FN history<br/>Courses, qualifications, MAP"]
        PREPARE_FILE --> COMPILE
    end

    COMPILE --> SUBMIT["Submit file to higher formation<br/>for HLRR Board"]

    subgraph HLRR_BOARD ["HLRR Board — May"]
        BOARD_REVIEW["Higher formation reviews files<br/>Cross-unit comparison at rank level"]
        RANKING["Files ranked against peers<br/>Across multiple units or formations"]
        RESULT["HLRR result assigned<br/>Reflects member's standing relative to peers"]
        BOARD_REVIEW --> RANKING --> RESULT
    end

    SUBMIT --> BOARD_REVIEW

    RESULT --> DEBRIEF_PREP["Arrange HLRR Debrief Session<br/>June deadline for final debriefs"]

    subgraph DEBRIEF_SESSION ["Final Debrief and E-Sign — June"]
        DEBRIEF["Conduct HLRR Debrief Session<br/>Present result and context to member"]
        MBR_REVIEW["Member reviews HLRR result"]
        INFORMAL{"Member requests<br/>Informal Resolution?"}
        ESIGN["Member e-signs HLRR result"]
        DEBRIEF --> MBR_REVIEW --> INFORMAL
        INFORMAL -->|"Yes — consult CoC"| IR_PROC["Process Informal Resolution<br/>Consult CoC for guidance and deadlines"]
        INFORMAL -->|No| ESIGN
        IR_PROC --> ESIGN
    end

    DEBRIEF_PREP --> DEBRIEF

    ESIGN --> END(["HLRR Complete — End of PaCE Cycle"])
```

### Key Notes
- **Gateway requirements:** A strong PAR is the entry point. A UPB recommendation is required before a file proceeds to HLRR.
- **Cross-unit comparison:** HLRR ranks members against peers across multiple units or formations — not just within the unit.
- **Timeline:** Boards held in May. All final debriefs and e-signs must be complete by end of June.
- **Consult CoC:** PaCE Managers and CoC provide direction on appropriate HLRR guidance and key deadlines.
- **Informal Resolution:** If the member disputes the result, the Informal Resolution process applies. Consult CoC for deadlines.
