// PaCE Report Writer Script
document.addEventListener('DOMContentLoaded', async function () {
    // Global variable to store current result
    let currentResult = '';
    
    // Initialize download manager
    if (!window.downloadManager) {
        window.downloadManager = new DownloadManager();
    }

    // Register standardized copy/download actions
    utils.registerToolActions('pace-report-writer', () => currentResult);
    
    // Load competency data from JSONL file
    await loadCompetencyData();
    
    // Load inclusive behaviours data from JSONL file
    await loadInclusiveBehavioursData();
    
    // Move modals to body level to fix positioning issues
    moveModalsToBody();
    
    // Create info overlay dynamically
    createInfoOverlay();

    // Initialize workflow graph modal controls
    initWorkflowGraphModal();

    // Initialize Competency modal as standards table view
    initCompetencyStandardsModal();

    // Keep workflow modal button-driven only; strip stale deep-link query param if present.
    const url = new URL(window.location.href);
    if (url.searchParams.has('workflowGraph')) {
        url.searchParams.delete('workflowGraph');
        window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    }
});

// Create info overlay for tool description
function createInfoOverlay() {
    const existingOverlay = document.getElementById('infoOverlay');
    
    if (!existingOverlay) {
        const overlayHTML = `
            <div class="info-overlay" id="infoOverlay">
                <div class="info-popup" id="infoPopup">
                    <div class="popup-header">
                        <div class="popup-title">
                            <span class="info-icon-large">ℹ️</span>
                            <strong>About PaCE Report Writer</strong>
                        </div>
                    </div>
                    <div class="popup-content">
                        <p><strong>⚠️ Security Notice:</strong> Do not put sensitive information into the form.</p>
                        <p>From here you can create PaCE Feedback Notes by providing some information. The more details you provide, the better the AI can assist you.</p>
                        <ul>
                            <li>This tool is completely free to use</li>
                            <li>Does not retain any information (handled by your API provider)</li>
                            <li>Can be used offline by selecting a local AI in provider settings</li>
                            <li>Select rank-specific competency frameworks</li>
                            <li>Adjust the number of competencies (1-15) based on your needs</li>
                            <li>Optional pre-selection of up to 3 competencies</li>
                            <li>Toggle CCG assessment and competency analysis as needed</li>
                        </ul>
                        <div class="popup-actions">
                            <button class="btn-acknowledge" onclick="dismissInfoNotice()">I Understand - Proceed</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', overlayHTML);
        
        // Show overlay on first visit
        const infoOverlay = document.getElementById('infoOverlay');
        if (infoOverlay) {
            infoOverlay.style.display = 'flex';
        }
    }
}

// Dismiss info notice
window.dismissInfoNotice = function() {
    const overlay = document.getElementById('infoOverlay');
    const toggleBtn = document.getElementById('infoToggleBtn');
    
    if (overlay) {
        overlay.style.display = 'none';
    }
    if (toggleBtn) {
        toggleBtn.style.display = 'flex';
    }
};

// Show info notice again
window.showInfoNotice = function() {
    const overlay = document.getElementById('infoOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
};

// Rank mapping from JSONL format to dropdown values
const rankMapping = {
    'Pte': 'pte',
    'Cpl': 'cpl',
    'MCpl': 'mcpl-ms',
    'Sgt': 'sgt-po2',
    'WO': 'wo-po1',
    'MWO': 'mwo-cpo2',
    'CWO': 'cwo-cpo1',
    'OCdt': 'ocdt',
    '2Lt': '2lt-aslt',
    'Lt': 'lt-slt',
    'Capt': 'capt-lt',
    'Major': 'maj-lcdr',
    'LCol': 'lcol-cdr',
    'Col': 'col-capt',
    'BGen': 'bgen-cmdre',
    'MGen': 'mgen-radm'
};

// Reverse mapping for display
const rankDisplayNames = {
    'pte': 'Private',
    'cpl': 'Corporal / Sailor 1st Class',
    'mcpl-ms': 'Master Corporal / Master Sailor',
    'sgt-po2': 'Sergeant / Petty Officer 2nd Class',
    'wo-po1': 'Warrant Officer / Petty Officer 1st Class',
    'mwo-cpo2': 'Master Warrant Officer / Chief Petty Officer 2nd Class',
    'cwo-cpo1': 'Chief Warrant Officer / Chief Petty Officer 1st Class',
    'ocdt': 'Officer Cadet',
    '2lt-aslt': 'Second Lieutenant / Acting Sub-Lieutenant',
    'lt-slt': 'Lieutenant / Sub-Lieutenant',
    'capt-lt': 'Captain / Lieutenant (Navy)',
    'maj-lcdr': 'Major / Lieutenant Commander',
    'lcol-cdr': 'Lieutenant Colonel / Commander',
    'col-capt': 'Colonel / Captain (Navy)',
    'bgen-cmdre': 'Brigadier-General / Commodore',
    'mgen-radm': 'Major-General / Rear-Admiral'
};

let _standardsCache = null; // Map<rankCode, {headers, rows}> — populated on first load

const workflowGraphs = [
    {
        id: 'master',
        title: 'Master Workflow Overview',
        context: 'Full annual PaCE cycle overview',
        sourcePath: '/ai-tools/core-services/pace-report-writer/resources/flowcharts/master/',
        notes: [
            'Use this as the top-level annual map.',
            'Use the graph selector or Previous/Next buttons for phase detail.'
        ],
        mermaid: `flowchart TD
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
    HLRR_CHK -->|No| FINAL`
    },
    {
        id: 'initial',
        title: 'Initial Setup',
        context: 'Deadline: NLT 30 April, or ASAP after APS posting',
        sourcePath: '/ai-tools/core-services/pace-report-writer/resources/flowcharts/initial/',
        notes: [
            'Includes JD/MAP interview and initial 3 mandatory FNs.',
            'Opt-Out process (DND 4638) deadline is 15 January.'
        ],
        mermaid: `flowchart TD
    START(["Begin: New Cycle or APS Posting"]) --> SUP_SETUP & MBR_SETUP

    subgraph SUP_SETUP ["Supervisor Actions"]
        ASSIGN_SUP["Assign self as PaCE Supervisor<br/>Repeat for each subordinate"]
        CREATE_JD["Create Job Description<br/>Primary duties only<br/>Do NOT include secondary duties here"]
        FINALIZE_JD["AFTER REVIEWING, Finalize Job Description<br/>(Member notified by email by default)<br/>Up to 7 days to un-finalize without PaCE Manager"]
        ASSIGN_SUP --> CREATE_JD --> FINALIZE_JD
    end

    subgraph MBR_SETUP ["Member Actions"]
        REVIEW_JD["Review Job Description"]
        COMPLETE_MAP["Complete or update MAP<br/>Immediate, Medium, Long-Term Goals<br/>Training, Job Experience, Other Considerations"]
        OPT_CHECK{"Considering Opting Out?"}
        REVIEW_JD --> COMPLETE_MAP --> OPT_CHECK
    end

    FINALIZE_JD --> DEBRIEF_FNS
    DEBRIEF_FNS["Conduct Feedback Session<br/>Debrief member on all 3 FNs<br/>Member acknowledges each FN"]
    --> JOINT
    subgraph JOINT ["Joint: JD and MAP"]

        subgraph JOINT_INTER ["Conduct Joint Interview"]
        direction TB
            JOINT_INTERVIEW["Conduct JD and MAP Interview<br/>Review content together"] -->
            ACK_MAP["Supervisor acknowledges MAP<br/>Not a commitment to fulfill aspirations"]
        end
        JOINT_INTER --> CONVERSE(["Converse, Answer Questions, Note edits, make any applicable changes"]) --> INIT_FNS
        subgraph INIT_FNS ["Create, Send, Sign, Initial Feedback Notes — NLT 30 Apr"]
        direction TB
            FN1["FN 1: Initial Review of JD and MAP - See Template Design<br>Review JD and MAP"]
            FN2["FN 2: Secondary Duties - Auto Template When Created"]
            FN3["FN 3: Inclusive Behaviours - Auto Template When Created"]
            FN1 --> FN2 --> FN3
        end
        
    end

    OPT_CHECK -->|"Yes — Deadline: 15 Jan"| OPTOUT["Submit DND 4638<br/>PaCE Manager processes Opt-Out<br/>Member still receives PAR<br/>Potential will not be appraised"]
    OPT_CHECK -->|No| DEBRIEF_FNS
    OPTOUT --> DEBRIEF_FNS

    JOINT --> SIGNED(["Finalize JD, Sign FNs, and everything is reviewed and signed"]) --> END(["Proceed to Q1"])
    
    style JOINT fill:none`
    },
    {
        id: 'q1-jul',
        title: 'Q1 Review (Apr to Jul)',
        context: 'Deadline: NLT 1st Week of July',
        sourcePath: '/ai-tools/core-services/pace-report-writer/resources/flowcharts/q1-jul/',
        notes: [
            'First regular quarterly FN checkpoint after initial setup.',
            'Capture observed behaviours while details are fresh.'
        ],
        mermaid: `flowchart TD
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
    APS --> END(["Proceed to Q2"])`
    },
    {
        id: 'q2-oct',
        title: 'Q2 Review (Jul to Oct)',
        context: 'Deadline: NLT 1st Week of October',
        sourcePath: '/ai-tools/core-services/pace-report-writer/resources/flowcharts/q2-oct/',
        notes: [
            'Mid-cycle checkpoint to adjust MAP and goals.',
            'Validate JD still reflects actual duties.'
        ],
        mermaid: `flowchart TD
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
    APS --> END(["Proceed to Q3"])`
    },
    {
        id: 'q3-dec',
        title: 'Q3 Review (Oct to Dec)',
        context: 'Deadline: NLT Mid-December',
        sourcePath: '/ai-tools/core-services/pace-report-writer/resources/flowcharts/q3-dec/',
        notes: [
            'Confirm Opt-Out decision before 15 January cutoff.',
            'Prepare for year-end PAR by reviewing cumulative FNs.'
        ],
        mermaid: `flowchart TD
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
    APS --> END(["Proceed to Q4"])`
    },
    {
        id: 'q4-mar',
        title: 'Q4 End-Year Review (Dec to Mar)',
        context: 'Deadline: NLT Mid-March',
        sourcePath: '/ai-tools/core-services/pace-report-writer/resources/flowcharts/q4-mar/',
        notes: [
            'Q4 summary should reflect full-year performance.',
            'Confirm all PAR role assignments before PAR drafting.'
        ],
        mermaid: `flowchart TD
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
    APS --> END(["Proceed to PAR"])`
    },
    {
        id: 'par',
        title: 'PAR Process',
        context: 'Deadline: Complete by End of April',
        sourcePath: '/ai-tools/core-services/pace-report-writer/resources/flowcharts/par/',
        notes: [
            'Author and RO comments must be evidence-based and FN-supported.',
            'Debrief requires minimum notice before member acknowledgment.'
        ],
        mermaid: `flowchart TD
    START(["Begin PAR Process — After Q4 Review"])

    ROLES_CHECK["Confirm PAR role assignments with PaCE Manager<br/>Author — Reviewing Officer — Signing Authority<br/>Intermediary Reviewer if applicable"]

    ROLES_CHECK --> FN_SUMMARY["Author: Review full year FN summary<br/>Open PAR module in Monitor MASS<br/>Select Author View and Get Data"]

    subgraph AUTHOR_PAR ["Author — Writing the PAR"]
        MEMBER_INFO["Verify member information<br/>Preferred language, conduct, subordinates supervised"]
        COURSES["Record significant courses completed<br/>Unit qualifications and secondary duties"]
        EXPAND["Expand all competency facets<br/>Review each Behavioural Indicator"]
        SCORE["Score each Behavioural Indicator<br/>Ensure scores are supported by FNs"]
        JUSTIFICATION["Write Score Justification and Author comments<br/>Reference specific FNs and observed behaviours"]
        PAR_NOTES["Add PAR Notes for Reviewing Officer<br/>if any context or guidance is needed"]
        MEMBER_INFO --> COURSES --> EXPAND --> SCORE --> JUSTIFICATION --> PAR_NOTES
    end

    FN_SUMMARY --> MEMBER_INFO

    PAR_NOTES --> IR_CHECK{"Intermediary Reviewer<br/>assigned?"}
    IR_CHECK -->|Yes| SEND_IR["Author sends PAR to<br/>Intermediary Reviewer"]
    IR_CHECK -->|No| SEND_RO

    subgraph IR_REVIEW ["Intermediary Reviewer"]
        IR_REVIEW_PAR["IR reviews PAR<br/>Scores, comments, member info accuracy"]
        IR_CHANGES{"Changes<br/>Required?"}
        IR_REVIEW_PAR --> IR_CHANGES
        IR_CHANGES -->|Yes| IR_RETURN["IR returns PAR to Author<br/>with notes"]
        IR_CHANGES -->|No| IR_FORWARD["IR forwards PAR to<br/>Reviewing Officer"]
    end

    SEND_IR --> IR_REVIEW_PAR
    IR_RETURN --> SCORE
    IR_FORWARD --> SEND_RO

    SEND_RO["Author sends PAR to<br/>Reviewing Officer"]

    subgraph RO_REVIEW ["Reviewing Officer"]
        RO_REVIEW_PAR["RO reviews PAR<br/>Accuracy of member info, scores, comments,<br/>language preference, conduct"]
        RO_CHANGES{"Changes<br/>Required?"}
        RO_REVIEW_PAR --> RO_CHANGES
        RO_CHANGES -->|Yes| RO_RETURN["RO returns PAR to Author<br/>with notes in PAR Notes section"]
        RO_CHANGES -->|No| RO_SCORE["RO adds Score Justification<br/>if applicable"]
    end

    SEND_RO --> RO_REVIEW_PAR
    RO_RETURN --> SCORE
    RO_SCORE --> SEND_PARMON["RO sends PAR to<br/>PAR Monitor — PARMON"]

    subgraph PARMON_SA ["PAR Monitor and Signing Authority"]
        PARMON["PARMON administers PAR<br/>Final review and tracking"]
        SA_SIGN["Signing Authority e-signs PAR"]
        PARMON --> SA_SIGN
    end

    SEND_PARMON --> PARMON

    SA_SIGN --> DEBRIEF_PREP["Author arranges Debrief Session<br/>Provide member copy of PAR<br/>Minimum 24 hrs notice, preferably 48 hrs"]

    subgraph DEBRIEF_SESSION ["PAR Debrief and Acknowledgment"]
        DEBRIEF["Conduct PAR Debrief Session<br/>Author or designate presents PAR to member"]
        MBR_REVIEW["Member reviews PAR content"]
        MBR_ACK["Member acknowledges PAR<br/>At Author station or own station"]
        DEBRIEF --> MBR_REVIEW --> MBR_ACK
    end

    DEBRIEF_PREP --> DEBRIEF

    MBR_ACK --> INFORMAL{"Member requests<br/>Informal Resolution?"}
    INFORMAL -->|"Yes — deadline: mid/end April"| IR_PROC["Process Informal Resolution Request<br/>Consult CoC for guidance"]
    INFORMAL -->|No| END

    IR_PROC --> END(["PAR Complete — Return to master"])`
    },
    {
        id: 'potential-appraisal',
        title: 'Potential Appraisal Scoring',
        context: 'Cpl/S1 and above; PO2/Sgt+ may opt out of Succession Mgmt',
        sourcePath: '/ai-tools/core-services/pace-report-writer/resources/flowcharts/potential-appraisal/',
        notes: [
            'Potential and IBR are auto-calculated from BI scores.',
            'Potential readiness is distinct from current-rank performance.'
        ],
        mermaid: `flowchart TD
    START(["Begin Potential Appraisal Scoring"])

    CONFIRM_ELIG{"Member Cpl/S1 or above<br/>AND eligible for PAR?<br/>(PO2/Sgt+: must not have opted out)"}
    CONFIRM_ELIG -->|No| NOT_APPLICABLE["Potential Appraisal does not apply<br/>PAR only — skip this chart"]
    CONFIRM_ELIG -->|Yes| OPEN_PAR

    NOT_APPLICABLE --> END_NA(["End"])

    OPEN_PAR["Open PAR in Monitor MASS<br/>Select member from Author View"]

    subgraph SCORE_BIS ["Step 1: Score All Behavioural Indicators (BIs)"]
        EXPAND_ALL["Click 'Expand All' in competency section<br/>View all facets and BIs for the member's rank"]
        SCORE_EACH["Score each BI on the 5-point scale:<br/>1 = Ineffective<br/>2 = Partially Effective<br/>3 = Effective (meets standard)<br/>4 = Above Effective<br/>5 = Extremely Effective"]
        BI_GUIDANCE["Refer to rank-specific competency standards<br/>for guidance on what each score means<br/>→ See competency standards"]
        EXPAND_ALL --> SCORE_EACH --> BI_GUIDANCE
    end

    OPEN_PAR --> EXPAND_ALL

    BI_GUIDANCE --> AUTO_CALC

    subgraph AUTO_CALC ["Step 2: Automatic System Calculations"]
        PERF_BRACKET["System calculates Performance Bracket<br/>Based on aggregated BI scores<br/>across all competencies"]
        IBR_CALC["System auto-generates Inclusive Behaviours Rating (IBR)<br/>Based on scores for the ~14 IBR-mapped competencies<br/>Green = Strong | Neutral | Red = Needs Attention<br/>IBR does not contribute to performance bracket"]
        POT_CALC["System calculates Potential Score<br/>Based on scores for BIs that reflect<br/>next-rank capability indicators"]
        PERF_BRACKET --> IBR_CALC --> POT_CALC
    end

    subgraph SCORE_JUST ["Step 3: Score Justification and Comments"]
        WRITE_JUST["Author writes Score Justification<br/>Must support scores with specific FN references<br/>and observed behaviours"]
        RO_JUST["Reviewing Officer reviews and may add<br/>their own Score Justification"]
        WRITE_JUST --> RO_JUST
    end

    POT_CALC --> WRITE_JUST

    RO_JUST --> SEND_PARMON["Send PAR to PAR Monitor (PARMON)<br/>Signing Authority e-signs"]

    subgraph UPB_INPUT ["Step 4: Unit Potential Board Input"]
        BOARD_INPUT["PEB/UPB reviews Potential Score alongside:<br/>• PAR performance bracket result<br/>• FN history and quality<br/>• Courses and qualifications<br/>• MAP career aspirations<br/>• IBR result"]
        GATE_CHECK{"Performance bracket<br/>meets minimum threshold<br/>for Potential consideration?"}
        BOARD_INPUT --> GATE_CHECK
        GATE_CHECK -->|No| NO_POT["Potential Appraisal not forwarded<br/>Member debriefed at unit level"]
        GATE_CHECK -->|Yes| POT_RATING["Board assigns/confirms Potential Rating<br/>and supporting narrative"]
    end

    SEND_PARMON --> BOARD_INPUT

    POT_RATING --> HLRR_ROUTE{"File recommended<br/>for HLRR?"}
    HLRR_ROUTE -->|No| DEBRIEF_UNIT["Conduct Potential Debrief at unit<br/>June — member e-signs"]
    HLRR_ROUTE -->|Yes| HLRR_FWD["Forward to HLRR Board"]

    NO_POT --> DEBRIEF_UNIT
    DEBRIEF_UNIT --> END(["Potential Appraisal Complete"])
    HLRR_FWD --> END`
    },
    {
        id: 'peb',
        title: 'Potential Evaluation Board (PEB/UPB)',
        context: 'Timeline: May',
        sourcePath: '/ai-tools/core-services/pace-report-writer/resources/flowcharts/peb/',
        notes: [
            'Applies to Cpl/S1 and above. Only PO2/Sgt+ may opt out of Succession Management (DND 4638).',
            'Strong PAR is the gateway to board consideration.'
        ],
        mermaid: `flowchart TD
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
    HLRR_CHECK -->|"Yes — see hlrr"| HLRR(["Proceed to HLRR — see hlrr"])
    HLRR_CHECK -->|No| DEBRIEF["Schedule Potential Debrief<br/>June deadline for final debriefs"]

    DEBRIEF --> ESIGN["Member e-signs Potential Appraisal<br/>June"]
    ESIGN --> END(["PEB Complete — Return to master"])`
    },
    {
        id: 'hlrr',
        title: 'Higher Level Review Ranking (HLRR)',
        context: 'Timeline: May board, June debrief/e-sign',
        sourcePath: '/ai-tools/core-services/pace-report-writer/resources/flowcharts/hlrr/',
        notes: [
            'Ranks files against peers across formations.',
            'Final debrief and e-sign must complete by end of June.'
        ],
        mermaid: `flowchart TD
    START(["Begin HLRR — After PEB/UPB Recommendation"])

    GATEWAY{"PAR and PEB/UPB result<br/>support HLRR?"}
    GATEWAY -->|"No — file does not meet threshold"| NOT_FWD["File not forwarded<br/>Member completes cycle at unit level<br/>Debrief conducted at unit"]
    GATEWAY -->|Yes| PREPARE

    NOT_FWD --> END_NO(["End — No HLRR Process"])

    subgraph PREPARE ["Prepare HLRR File"]
        PREPARE_FILE["Confirm all PAR roles e-signed<br/>PEB/UPB result documented"]
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

    ESIGN --> END(["HLRR Complete — End of PaCE Cycle"])`
    }
];

let workflowGraphIndex = 0;
let workflowMermaid = null;
let workflowJsPdfCtor = null;
let workflowHtml2Canvas = null;

async function ensureWorkflowMermaidLoaded() {
    if (workflowMermaid) return workflowMermaid;
    const mermaidModule = await import('https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs');
    workflowMermaid = mermaidModule.default;
    workflowMermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
        themeVariables: {
            primaryColor: '#ff6b35',
            primaryBorderColor: '#ff6b35',
            lineColor: '#ff6b35',
            secondaryColor: '#2a2a2a',
            tertiaryColor: '#1a1a1a'
        }
    });
    return workflowMermaid;
}

function loadExternalScript(src) {
    return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[data-workflow-lib="${src}"]`);
        if (existing) {
            if (existing.dataset.loaded === 'true') {
                resolve();
                return;
            }
            existing.addEventListener('load', () => resolve(), { once: true });
            existing.addEventListener('error', () => reject(new Error(`Failed to load script: ${src}`)), { once: true });
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.defer = true;
        script.dataset.workflowLib = src;
        script.addEventListener('load', () => {
            script.dataset.loaded = 'true';
            resolve();
        }, { once: true });
        script.addEventListener('error', () => reject(new Error(`Failed to load script: ${src}`)), { once: true });
        document.head.appendChild(script);
    });
}

async function ensureWorkflowJsPdfLoaded() {
    if (workflowJsPdfCtor) return workflowJsPdfCtor;
    if (window.jspdf && window.jspdf.jsPDF) {
        workflowJsPdfCtor = window.jspdf.jsPDF;
        return workflowJsPdfCtor;
    }

    await loadExternalScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');
    if (!window.jspdf || !window.jspdf.jsPDF) {
        throw new Error('jsPDF was not available after loading script.');
    }

    workflowJsPdfCtor = window.jspdf.jsPDF;
    return workflowJsPdfCtor;
}

async function ensureWorkflowHtml2CanvasLoaded() {
    if (workflowHtml2Canvas) return workflowHtml2Canvas;
    if (window.html2canvas) {
        workflowHtml2Canvas = window.html2canvas;
        return workflowHtml2Canvas;
    }

    await loadExternalScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');
    if (!window.html2canvas) {
        throw new Error('html2canvas was not available after loading script.');
    }

    workflowHtml2Canvas = window.html2canvas;
    return workflowHtml2Canvas;
}

function serializeWorkflowSvg(svgElement) {
    const clone = svgElement.cloneNode(true);
    if (!clone.getAttribute('xmlns')) {
        clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }
    if (!clone.getAttribute('xmlns:xlink')) {
        clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    }

    // Exported SVG is rendered standalone in a blob, so inject text styles directly.
    const exportStyle = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    exportStyle.textContent = `
        .label text,
        .label span,
        .label p,
        .nodeLabel,
        .edgeLabel,
        .edgeLabel p,
        .edgeLabel span,
        text,
        tspan,
        foreignObject span,
        foreignObject p {
            fill: #ffffff !important;
            color: #ffffff !important;
        }
    `;
    clone.appendChild(exportStyle);

    clone.querySelectorAll('.label text, .nodeLabel, .edgeLabel, text, tspan').forEach(node => {
        if (node.style && node.style.setProperty) {
            node.style.setProperty('fill', '#ffffff', 'important');
            node.style.setProperty('color', '#ffffff', 'important');
        }
        node.setAttribute('fill', '#ffffff');
    });
    clone.querySelectorAll('foreignObject span, foreignObject p').forEach(node => {
        if (node.style && node.style.setProperty) {
            node.style.setProperty('color', '#ffffff', 'important');
            node.style.setProperty('fill', '#ffffff', 'important');
        }
    });

    return new XMLSerializer().serializeToString(clone);
}

async function workflowSvgToCanvas(svgElement) {
    const rect = svgElement.getBoundingClientRect();
    const viewBox = svgElement.viewBox && svgElement.viewBox.baseVal;
    const width = Math.max(1, Math.ceil(viewBox && viewBox.width ? viewBox.width : rect.width));
    const height = Math.max(1, Math.ceil(viewBox && viewBox.height ? viewBox.height : rect.height));
    const svgString = serializeWorkflowSvg(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    try {
        const image = await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('Unable to render workflow SVG image for PDF export.'));
            img.src = svgUrl;
        });

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(image, 0, 0, width, height);
        return { canvas, width, height };
    } finally {
        URL.revokeObjectURL(svgUrl);
    }
}

async function workflowElementToCanvasFallback(element) {
    const html2canvas = await ensureWorkflowHtml2CanvasLoaded();
    const canvas = await html2canvas(element, {
        backgroundColor: '#111111',
        useCORS: true,
        scale: 1,
        logging: false
    });

    const width = Math.max(1, canvas.width);
    const height = Math.max(1, canvas.height);
    return { canvas, width, height };
}

function normalizeCanvasForPdf(sourceCanvas, maxDimension = 2400) {
        const width = sourceCanvas.width;
        const height = sourceCanvas.height;
        const largest = Math.max(width, height);

        if (largest <= maxDimension) {
                return { canvas: sourceCanvas, width, height };
        }

        const scale = maxDimension / largest;
        const targetWidth = Math.max(1, Math.round(width * scale));
        const targetHeight = Math.max(1, Math.round(height * scale));

        const resized = document.createElement('canvas');
        resized.width = targetWidth;
        resized.height = targetHeight;
        const ctx = resized.getContext('2d');
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);

        return { canvas: resized, width: targetWidth, height: targetHeight };
}

function openWorkflowPrintFallback(graphTitle, svgMarkup) {
        const printWindow = window.open('', '_blank', 'width=1200,height=900');
        if (!printWindow) {
                alert('Unable to open print window. Please allow pop-ups and try again.');
                return;
        }

        const safeTitle = (graphTitle || 'Workflow Graph').replace(/[<>]/g, '');
        const html = `<!doctype html>
<html>
<head>
    <meta charset="utf-8" />
    <title>${safeTitle}</title>
    <style>
        @page { size: letter portrait; margin: 10mm; }
        html, body { margin: 0; background: #111; color: #fff; font-family: Arial, sans-serif; }
        .page { width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; }
        .canvas-wrap { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
        .canvas-wrap svg { max-width: 100%; max-height: 100%; height: auto; width: auto; }
        .canvas-wrap svg text,
        .canvas-wrap svg tspan,
        .canvas-wrap svg .label,
        .canvas-wrap svg .label text,
        .canvas-wrap svg .nodeLabel,
        .canvas-wrap svg .edgeLabel,
        .canvas-wrap svg foreignObject,
        .canvas-wrap svg foreignObject p,
        .canvas-wrap svg foreignObject span {
            fill: #fff !important;
            color: #fff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            forced-color-adjust: none;
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="canvas-wrap">${svgMarkup}</div>
    </div>
    <script>
        window.addEventListener('load', () => {
            setTimeout(() => {
                window.print();
            }, 200);
        });
    <\/script>
</body>
</html>`;

        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();
}

async function openChecklistPrint(url, title) {
    const printWindow = window.open('', '_blank', 'width=900,height=1100');
    if (!printWindow) {
        alert('Unable to open print window. Please allow pop-ups and try again.');
        return false;
    }

    const safeTitle = (title || 'Checklist').replace(/[<>]/g, '');

    // Write loading state immediately
    printWindow.document.open();
    printWindow.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${safeTitle}</title></head><body style="font-family:Arial,sans-serif;padding:40px;color:#333">Loading checklist...</body></html>`);
    printWindow.document.close();

    let mdText;
    let resolvedUrl;
    try {
        resolvedUrl = new URL(url, window.location.href).toString();
    } catch (e) {
        resolvedUrl = String(url || '');
    }

    const fetchCandidates = [];
    if (resolvedUrl) fetchCandidates.push(resolvedUrl);
    try {
        const parsed = new URL(resolvedUrl || url, window.location.href);
        fetchCandidates.push(`${window.location.origin}${parsed.pathname}`);
    } catch (e) {
        // No-op: we still try with the original resolved URL.
    }

    let fetchError = null;
    for (const candidate of [...new Set(fetchCandidates)]) {
        try {
            const resp = await fetch(candidate, { cache: 'no-store', credentials: 'same-origin' });
            if (!resp.ok) {
                fetchError = new Error(`HTTP ${resp.status}`);
                continue;
            }
            mdText = await resp.text();
            if (mdText && mdText.trim()) break;
        } catch (e) {
            fetchError = e;
        }
    }

    if (!mdText) {
        const safeHref = (resolvedUrl || '').replace(/"/g, '&quot;');
        printWindow.document.body.innerHTML = `
            <h2 style="margin:0 0 12px 0;">Could not load checklist content</h2>
            <p style="margin:0 0 8px 0;">The print parser could not fetch the markdown file from this page context.</p>
            <p style="margin:0 0 16px 0;">You can open the source checklist directly and print from there:</p>
            <p style="margin:0;"><a href="${safeHref}" target="_self" rel="noopener">Open checklist source</a></p>
        `;
        console.error('Checklist print fetch failed:', fetchError);
        return false;
    }

    // Convert markdown to print-ready HTML
    function mdToHtml(md) {
        const lines = md.split('\n');
        const out = [];
        let inList = false;
        let inBlockquote = false;
        let inTable = false;
        let tableHeaderDone = false;

        function closeOpenBlocks() {
            if (inList) { out.push('</ul>'); inList = false; }
            if (inBlockquote) { out.push('</blockquote>'); inBlockquote = false; }
            if (inTable) { out.push('</tbody></table>'); inTable = false; tableHeaderDone = false; }
        }

        function inlineFormat(text) {
            return text
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.+?)\*/g, '<em>$1</em>')
                .replace(/`(.+?)`/g, '<code>$1</code>')
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
        }

        for (let i = 0; i < lines.length; i++) {
            const raw = lines[i];
            const line = raw.trimEnd();

            // Horizontal rule
            if (/^---+$/.test(line.trim())) {
                closeOpenBlocks();
                out.push('<hr>');
                continue;
            }

            // Headings
            const hMatch = line.match(/^(#{1,6})\s+(.*)/);
            if (hMatch) {
                closeOpenBlocks();
                const level = hMatch[1].length;
                out.push(`<h${level}>${inlineFormat(hMatch[2])}</h${level}>`);
                continue;
            }

            // Table rows
            if (/^\|/.test(line)) {
                if (!inTable) {
                    closeOpenBlocks();
                    inTable = true;
                    tableHeaderDone = false;
                    out.push('<table><thead>');
                    const cells = line.replace(/^\||\|$/g, '').split('|').map(c => `<th>${inlineFormat(c.trim())}</th>`).join('');
                    out.push(`<tr>${cells}</tr></thead><tbody>`);
                    tableHeaderDone = false;
                } else if (!tableHeaderDone && /^[\|\s\-:]+$/.test(line)) {
                    tableHeaderDone = true; // separator row — skip
                } else {
                    const cells = line.replace(/^\||\|$/g, '').split('|').map(c => `<td>${inlineFormat(c.trim())}</td>`).join('');
                    out.push(`<tr>${cells}</tr>`);
                }
                continue;
            }

            // Blockquote
            const bqMatch = line.match(/^>\s*(.*)/);
            if (bqMatch) {
                if (!inBlockquote) { closeOpenBlocks(); out.push('<blockquote>'); inBlockquote = true; }
                out.push(`<p>${inlineFormat(bqMatch[1])}</p>`);
                continue;
            }

            // Checkbox list items (any indent)
            const cbMatch = line.match(/^(\s*)- \[([ xX])\]\s+(.*)/);
            if (cbMatch) {
                if (!inList) { closeOpenBlocks(); out.push('<ul class="checklist">'); inList = true; }
                const checked = cbMatch[2].trim().toLowerCase() === 'x' ? ' checked' : '';
                const indent = cbMatch[1].length > 0 ? ' class="nested"' : '';
                out.push(`<li${indent}><label><input type="checkbox"${checked}> ${inlineFormat(cbMatch[3])}</label></li>`);
                continue;
            }

            // Plain list items
            const liMatch = line.match(/^(\s*)[-*]\s+(.*)/);
            if (liMatch) {
                if (!inList) { closeOpenBlocks(); out.push('<ul>'); inList = true; }
                out.push(`<li>${inlineFormat(liMatch[2])}</li>`);
                continue;
            }

            // Empty line
            if (line.trim() === '') {
                closeOpenBlocks();
                out.push('');
                continue;
            }

            // Paragraph
            closeOpenBlocks();
            out.push(`<p>${inlineFormat(line)}</p>`);
        }

        closeOpenBlocks();
        return out.join('\n');
    }

    const bodyHtml = mdToHtml(mdText);

    const fullHtml = `<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>${safeTitle}</title>
    <style>
        @page { size: letter portrait; margin: 15mm 15mm 15mm 15mm; }
        * { box-sizing: border-box; }
        html, body {
            margin: 0; padding: 0;
            font-family: Arial, sans-serif;
            font-size: 11pt;
            color: #000;
            background: #fff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        .page { max-width: 750px; margin: 0 auto; padding: 20px 10px; }
        h1 { font-size: 16pt; border-bottom: 2px solid #333; padding-bottom: 6px; margin-bottom: 12px; }
        h2 { font-size: 13pt; border-bottom: 1px solid #999; padding-bottom: 4px; margin-top: 18px; margin-bottom: 8px; }
        h3 { font-size: 11pt; margin-top: 14px; margin-bottom: 6px; }
        h4 { font-size: 10pt; margin-top: 10px; margin-bottom: 4px; }
        hr { border: none; border-top: 1px solid #ccc; margin: 14px 0; }
        blockquote { border-left: 3px solid #aaa; margin: 8px 0 8px 10px; padding: 4px 10px; color: #555; font-size: 10pt; }
        blockquote p { margin: 2px 0; }
        ul { margin: 4px 0 4px 16px; padding: 0; list-style: none; }
        ul li { margin: 3px 0; }
        ul.checklist li label { display: flex; align-items: flex-start; gap: 6px; cursor: default; }
        ul.checklist li.nested { margin-left: 20px; }
        input[type="checkbox"] {
            margin-top: 2px;
            width: 13px; height: 13px;
            flex-shrink: 0;
            accent-color: #000;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        table { border-collapse: collapse; width: 100%; margin: 8px 0; font-size: 10pt; }
        th, td { border: 1px solid #999; padding: 4px 8px; text-align: left; }
        th { background: #eee; font-weight: bold; }
        code { font-family: monospace; background: #f4f4f4; padding: 1px 4px; border-radius: 2px; font-size: 10pt; }
        p { margin: 4px 0; }
        @media print {
            body { background: #fff; }
            input[type="checkbox"] { -webkit-appearance: checkbox; appearance: checkbox; }
        }
    </style>
</head>
<body>
    <div class="page">
        ${bodyHtml}
    </div>
    <script>
        window.addEventListener('load', () => {
            setTimeout(() => { window.print(); }, 300);
        });
    <\/script>
</body>
</html>`;

    printWindow.document.open();
    printWindow.document.write(fullHtml);
    printWindow.document.close();
    return false;
}

async function downloadCurrentWorkflowPdf() {
    const downloadBtn = document.getElementById('workflowDownloadPdfBtn');
    const renderRoot = document.getElementById('workflowGraphRender');
    const graph = workflowGraphs[workflowGraphIndex];

    if (!renderRoot || !graph) return;

    const svg = renderRoot.querySelector('svg');
    if (!svg) {
        alert('Workflow graph is still rendering. Please try again in a moment.');
        return;
    }

    const originalLabel = downloadBtn ? downloadBtn.textContent : '';
    if (downloadBtn) {
        downloadBtn.disabled = true;
        downloadBtn.textContent = 'Generating...';
    }

    try {
        const jsPDF = await ensureWorkflowJsPdfLoaded();
        let canvasPayload;

        try {
            canvasPayload = await workflowSvgToCanvas(svg);
        } catch (svgError) {
            console.warn('Primary SVG export failed, falling back to html2canvas:', svgError);
            const graphCanvas = renderRoot.querySelector('.workflow-graph-canvas') || renderRoot;
            canvasPayload = await workflowElementToCanvasFallback(graphCanvas);
        }

        const normalized = normalizeCanvasForPdf(canvasPayload.canvas);
        const canvas = normalized.canvas;
        const width = normalized.width;
        const height = normalized.height;

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'letter',
            compress: true
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 24;
        const maxWidth = pageWidth - margin * 2;
        const maxHeight = pageHeight - margin * 2;
        const scale = Math.min(maxWidth / width, maxHeight / height);
        const imageWidth = width * scale;
        const imageHeight = height * scale;
        const imageX = (pageWidth - imageWidth) / 2;
        const imageY = (pageHeight - imageHeight) / 2;

        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        pdf.addImage(imageData, 'JPEG', imageX, imageY, imageWidth, imageHeight, undefined, 'FAST');
        pdf.save(`pace-workflow-${graph.id}.pdf`);
    } catch (error) {
        console.error('Workflow PDF export failed:', error);
        const currentSvg = renderRoot.querySelector('svg');
        if (currentSvg) {
            const svgMarkup = serializeWorkflowSvg(currentSvg);
            openWorkflowPrintFallback(graph.title, svgMarkup);
            return;
        }
        alert('Unable to export workflow PDF. Please try again after the graph fully loads.');
    } finally {
        if (downloadBtn) {
            downloadBtn.disabled = false;
            downloadBtn.textContent = originalLabel || '⬇ Download PDF';
        }
    }
}

function initWorkflowGraphModal() {
    const select = document.getElementById('workflowGraphSelect');
    const prevBtn = document.getElementById('workflowPrevBtn');
    const nextBtn = document.getElementById('workflowNextBtn');
    const downloadPdfBtn = document.getElementById('workflowDownloadPdfBtn');
    if (!select || !prevBtn || !nextBtn || !downloadPdfBtn) return;

    select.innerHTML = workflowGraphs
        .map((graph, index) => `<option value="${index}">${index + 1}. ${graph.title}</option>`)
        .join('');

    select.addEventListener('change', function() {
        renderWorkflowGraph(parseInt(this.value, 10));
    });

    prevBtn.addEventListener('click', function() {
        renderWorkflowGraph((workflowGraphIndex - 1 + workflowGraphs.length) % workflowGraphs.length);
    });

    nextBtn.addEventListener('click', function() {
        renderWorkflowGraph((workflowGraphIndex + 1) % workflowGraphs.length);
    });

    downloadPdfBtn.addEventListener('click', function() {
        downloadCurrentWorkflowPdf();
    });

    renderWorkflowGraph(0);
}

function initCompetencyStandardsModal() {
    const printBtn = document.getElementById('standardsPrintBtn');
    const formRankSelect = document.getElementById('rankSelect');
    if (!printBtn) return;

    printBtn.addEventListener('click', function() {
        const tableWrap = document.querySelector('#competencyStandardsContent .standards-table-wrap');
        if (!tableWrap) return;

        const rankSelect = document.getElementById('rankSelect');
        const rankLabel  = rankSelect ? rankSelect.options[rankSelect.selectedIndex]?.text || '' : '';

        // Clone the table and replace colgroup with tight print-optimised widths.
        // Competency ~8%, Facet ~10%, 5 score cols share the rest (~16.4% each).
        const srcTable = tableWrap.querySelector('table');
        const tableClone = srcTable.cloneNode(true);
        const existingCg = tableClone.querySelector('colgroup');
        if (existingCg) existingCg.remove();
        const cg = document.createElement('colgroup');
        cg.innerHTML = '<col style="width:8%"><col style="width:10%">'
                     + '<col style="width:16.4%">'.repeat(5);
        tableClone.prepend(cg);

        const win = window.open('', '_blank', 'width=1100,height=750');
        win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Competency Standards${rankLabel ? ' \u2014 ' + rankLabel : ''}</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 8pt; margin: 0; color: #000; }
  h2 { font-size: 10pt; margin: 0 0 6px; }
  table { border-collapse: collapse; width: 100%; table-layout: fixed; }
  th, td { border: 1px solid #888; padding: 3px 5px; vertical-align: top; word-break: break-word; }
  th { background: #dce6f1; font-weight: 600; }
  tr:nth-child(odd) td { background: #f5f5f5; }
  tr[style*="display: none"] { display: none !important; }
  @page { size: letter landscape; margin: 6.35mm; }
</style></head><body>
<h2>Competency Standards${rankLabel ? ' \u2014 ' + rankLabel : ''}</h2>
${tableClone.outerHTML}
</body></html>`);
        win.document.close();
        win.focus();
        win.onload = function() { win.print(); win.close(); };
    });

    if (formRankSelect) {
        formRankSelect.addEventListener('change', function() {
            const modal = document.getElementById('frameworkModal');
            const isOpen = modal && modal.classList.contains('active');
            if (isOpen) {
                loadCompetencyStandards(this.value);
            }
        });
    }
}

function escapeHtml(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

async function loadStandardsJsonl() {
    if (_standardsCache) return _standardsCache;
    const urls = [
        new URL('competency-standards.jsonl', window.location.href).toString(),
        `${window.location.origin}/ai-tools/core-services/pace-report-writer/competency-standards.jsonl`
    ];
    let lastError = null;
    for (const url of urls) {
        try {
            const response = await fetch(url, { cache: 'no-store' });
            if (!response.ok) { lastError = new Error(`HTTP ${response.status}`); continue; }
            const text = await response.text();
            const map = new Map();
            for (const line of text.split('\n')) {
                const trimmed = line.trim();
                if (!trimmed) continue;
                const entry = JSON.parse(trimmed);
                map.set(entry.rank, entry);
            }
            _standardsCache = map;
            return _standardsCache;
        } catch (err) { lastError = err; }
    }
    throw lastError || new Error('Failed to load competency-standards.jsonl');
}

function normalizeStandardsRows(rows) {
    return (rows || [])
        .map(row => {
            if (!row) return null;

            return [
                row.competency || '',
                row.facet || '',
                row.score1 || '',
                row.score2 || '',
                row.score3 || '',
                row.score4 || '',
                row.score5 || ''
            ];
        })
        .filter(row => row && row.some(cell => cell));
}

function buildStandardsTableHtml(headerCells, rowCells) {
    const normalizedHeader = headerCells;

    const thead = `<thead><tr>${normalizedHeader.map(cell => `<th>${escapeHtml(cell)}</th>`).join('')}</tr></thead>`;
    const tbody = `<tbody>${rowCells.map(row => `<tr data-competency="${escapeHtml(row[0])}" data-facet="${escapeHtml(row[1])}">${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody>`;

    return `
        <div class="standards-table-wrap">
            <table class="standards-table">
                <colgroup>
                    <col class="col-competency">
                    <col class="col-facet">
                    <col class="col-score">
                    <col class="col-score">
                    <col class="col-score">
                    <col class="col-score">
                    <col class="col-score">
                </colgroup>
                ${thead}
                ${tbody}
            </table>
        </div>
    `;
}

function applyStandardsFilters() {
    const compSelect = document.getElementById('stdFilterCompetency');
    const facetSelect = document.getElementById('stdFilterFacet');
    const searchInput = document.getElementById('stdFilterSearch');
    const table = document.querySelector('#competencyStandardsContent .standards-table');
    if (!table) return;

    const compFilter = (compSelect ? compSelect.value : '').toLowerCase();
    const facetFilter = (facetSelect ? facetSelect.value : '').toLowerCase();
    const searchFilter = (searchInput ? searchInput.value : '').trim().toLowerCase();

    const dataRows = table.querySelectorAll('tbody tr:not(.standards-no-results)');
    let visibleCount = 0;
    dataRows.forEach(row => {
        const comp  = (row.dataset.competency || '').toLowerCase();
        const facet = (row.dataset.facet || '').toLowerCase();
        const text  = row.textContent.toLowerCase();
        const show  = (!compFilter   || comp  === compFilter)
                   && (!facetFilter  || facet === facetFilter)
                   && (!searchFilter || text.includes(searchFilter));
        row.style.display = show ? '' : 'none';
        if (show) visibleCount++;
    });

    // No-results placeholder row
    let noResults = table.querySelector('.standards-no-results');
    if (visibleCount === 0) {
        if (!noResults) {
            noResults = document.createElement('tr');
            noResults.className = 'standards-no-results';
            noResults.innerHTML = '<td colspan="7" style="text-align:center;color:#aaa;padding:24px;">No rows match the current filters.</td>';
            table.querySelector('tbody').appendChild(noResults);
        }
        noResults.style.display = '';
    } else if (noResults) {
        noResults.style.display = 'none';
    }
}

function populateStandardsFilters(bodyRows) {
    const compSelect  = document.getElementById('stdFilterCompetency');
    const facetSelect = document.getElementById('stdFilterFacet');
    const searchInput = document.getElementById('stdFilterSearch');
    const clearBtn    = document.getElementById('stdFilterClear');
    if (!compSelect || !facetSelect) return;

    // Derive ordered unique values and the competency→facets map
    const competencies = [...new Set(bodyRows.map(r => r[0]).filter(Boolean))];
    const facetsByComp = {};
    const allFacets    = [];
    bodyRows.forEach(row => {
        const comp  = row[0];
        const facet = row[1];
        if (!facetsByComp[comp]) facetsByComp[comp] = [];
        if (facet && !facetsByComp[comp].includes(facet)) facetsByComp[comp].push(facet);
        if (facet && !allFacets.includes(facet)) allFacets.push(facet);
    });

    // Reset controls to initial state
    compSelect.innerHTML  = '<option value="">All Competencies</option>';
    facetSelect.innerHTML = '<option value="">All Facets</option>';
    if (searchInput) searchInput.value = '';

    competencies.forEach(comp => {
        const opt = document.createElement('option');
        opt.value = comp;
        opt.textContent = comp;
        compSelect.appendChild(opt);
    });
    allFacets.forEach(facet => {
        const opt = document.createElement('option');
        opt.value = facet;
        opt.textContent = facet;
        facetSelect.appendChild(opt);
    });

    // Competency change → restrict facet list to relevant entries
    compSelect.onchange = function () {
        const selectedComp = this.value;
        facetSelect.innerHTML = '<option value="">All Facets</option>';
        const facets = selectedComp ? (facetsByComp[selectedComp] || []) : allFacets;
        facets.forEach(facet => {
            const opt = document.createElement('option');
            opt.value = facet;
            opt.textContent = facet;
            facetSelect.appendChild(opt);
        });
        facetSelect.value = '';
        applyStandardsFilters();
    };
    facetSelect.onchange = applyStandardsFilters;
    if (searchInput) searchInput.oninput = applyStandardsFilters;

    if (clearBtn) {
        clearBtn.onclick = function () {
            compSelect.value = '';
            facetSelect.innerHTML = '<option value="">All Facets</option>';
            allFacets.forEach(facet => {
                const opt = document.createElement('option');
                opt.value = facet;
                opt.textContent = facet;
                facetSelect.appendChild(opt);
            });
            if (searchInput) searchInput.value = '';
            applyStandardsFilters();
        };
    }
}

async function loadCompetencyStandards(rankCode) {
    const content = document.getElementById('competencyStandardsContent');
    if (!content) return;

    if (!rankCode) {
        content.innerHTML = '<p style="text-align: center; color: #aaa; padding: 36px 20px;">Select a Member Rank in the form to view competency standards.</p>';
        const badge = document.getElementById('stdLoadedRankBadge');
        if (badge) badge.style.display = 'none';
        return;
    }

    content.innerHTML = '<p style="text-align: center; color: #aaa; padding: 36px 20px;">Loading competency standards...</p>';

    try {
        const map = await loadStandardsJsonl();
        const standardsData = map.get(rankCode);
        if (!standardsData) {
            content.innerHTML = `<p style="text-align: center; color: #ff9b9b; padding: 36px 20px;">No competency standards found for ${escapeHtml(rankDisplayNames[rankCode] || rankCode)}.</p>`;
            return;
        }
        const headerCells = Array.isArray(standardsData.headers) ? standardsData.headers.slice(0, 7) : [];
        const bodyRows = normalizeStandardsRows(standardsData.rows);
        if (headerCells.length < 7 || !bodyRows.length) {
            throw new Error('Standards data is empty or malformed.');
        }
        content.innerHTML = buildStandardsTableHtml(headerCells, bodyRows);
        populateStandardsFilters(bodyRows);
        const badge = document.getElementById('stdLoadedRankBadge');
        const badgeText = document.getElementById('stdLoadedRankText');
        if (badge && badgeText) {
            badgeText.textContent = 'Loaded: ' + (rankDisplayNames[rankCode] || rankCode);
            badge.style.display = '';
        }
    } catch (error) {
        console.error('Failed to load competency standards:', error);
        content.innerHTML = `<p style="text-align: center; color: #ff9b9b; padding: 36px 20px;">Unable to load competency standards for ${escapeHtml(rankDisplayNames[rankCode] || rankCode)}.</p>`;
    }
}

async function renderWorkflowGraph(index) {
    workflowGraphIndex = index;
    const graph = workflowGraphs[index];

    const select = document.getElementById('workflowGraphSelect');
    const titleEl = document.getElementById('workflowGraphTitle');
    const contextEl = document.getElementById('workflowGraphContext');
    const notesEl = document.getElementById('workflowGraphNotes');
    const renderEl = document.getElementById('workflowGraphRender');
    if (!select || !titleEl || !contextEl || !notesEl || !renderEl || !graph) return;

    select.value = String(index);
    titleEl.textContent = graph.title;
    contextEl.textContent = graph.context;
    notesEl.innerHTML = `<ul>${graph.notes.map(note => `<li>${note}</li>`).join('')}</ul>`;

    const diagramId = `workflow-graph-${Date.now()}`;
    renderEl.innerHTML = `<div class="workflow-graph-canvas" id="${diagramId}"><span>Rendering workflow graph...</span></div>`;

    try {
        const mermaid = await ensureWorkflowMermaidLoaded();
        const { svg } = await mermaid.render(`${diagramId}-svg`, graph.mermaid);
        document.getElementById(diagramId).innerHTML = svg;
    } catch (error) {
        console.error('Failed to render workflow graph:', error);
        document.getElementById(diagramId).innerHTML = `<pre>${graph.mermaid}</pre>`;
    }
}

// Function to move modals to body level for proper fixed positioning
function moveModalsToBody() {
    const competencyModal = document.getElementById('frameworkModal');
    const referencesModal = document.getElementById('referencesModal');
    const workflowGraphModal = document.getElementById('workflowGraphModal');
    
    if (competencyModal && competencyModal.parentElement !== document.body) {
        document.body.appendChild(competencyModal);
    }
    
    if (referencesModal && referencesModal.parentElement !== document.body) {
        document.body.appendChild(referencesModal);
    }

    if (workflowGraphModal && workflowGraphModal.parentElement !== document.body) {
        document.body.appendChild(workflowGraphModal);
    }
}

// Function to load and parse competency JSONL data
async function loadCompetencyData() {
    try {
        const response = await fetch('/ai-tools/core-services/pace-report-writer/competency.jsonl');
        const text = await response.text();
        const lines = text.trim().split('\n');
        
        // Parse each JSONL line
        const rawData = lines.map(line => JSON.parse(line));
        
        // Transform data into rank-specific structure
        window.competencyData = {};
        
        // Initialize all ranks
        Object.values(rankMapping).forEach(rankCode => {
            window.competencyData[rankCode] = {
                name: rankCode.toUpperCase(),
                fullName: rankDisplayNames[rankCode],
                competencies: []
            };
        });
        
        // Process each competency from JSONL
        rawData.forEach(compData => {
            const competencyName = compData.Competency;
            const facets = compData.Facets;
            
            // For each facet in the competency
            Object.keys(facets).forEach(facetName => {
                const behavioralIndicators = facets[facetName]['Behavioural Indicators'];
                
                // For each rank in the behavioral indicators
                Object.keys(behavioralIndicators).forEach(jsonlRank => {
                    const rankCode = rankMapping[jsonlRank];
                    if (!rankCode || !window.competencyData[rankCode]) return;
                    
                    const indicators = behavioralIndicators[jsonlRank];
                    if (!indicators || indicators.length === 0) return;
                    
                    // Find or create the competency category
                    let category = window.competencyData[rankCode].competencies.find(
                        c => c.category === competencyName
                    );
                    
                    if (!category) {
                        category = {
                            category: competencyName,
                            facets: []
                        };
                        window.competencyData[rankCode].competencies.push(category);
                    }
                    
                    // Add facet with behavioral indicators
                    category.facets.push({
                        name: facetName,
                        indicators: indicators
                    });
                });
            });
        });
        
        // Populate the competency dropdowns with all available competencies
        populateAllCompetencies();
        
        // Update dropdown to disable ranks without data
        updateRankDropdownState();
    } catch (error) {
        console.error('Error loading competency data:', error);
        // Fallback to empty data structure
        window.competencyData = {};
        Object.values(rankMapping).forEach(rankCode => {
            window.competencyData[rankCode] = {
                name: rankCode.toUpperCase(),
                fullName: rankDisplayNames[rankCode],
                competencies: []
            };
        });
        
        // Update dropdown even on error
        updateRankDropdownState();
    }
}

// Function to load and parse inclusive behaviours JSONL data
async function loadInclusiveBehavioursData() {
    try {
        const response = await fetch('/ai-tools/core-services/pace-report-writer/inclusive-behaviours.jsonl');
        const text = await response.text();
        const lines = text.trim().split('\n');
        
        // Parse each JSONL line
        const rawData = lines.map(line => JSON.parse(line));
        
        // Transform data into meta-competency-indexed structure
        window.inclusiveBehavioursData = {};
        
        rawData.forEach(item => {
            const metaCompetencyName = item.MetaCompetency;
            const definition = item.Definition;
            const behaviours = item.InclusiveBehaviours;
            const frequencyScale = item.FrequencyScale;
            
            window.inclusiveBehavioursData[metaCompetencyName] = {
                definition: definition,
                behaviours: behaviours,
                frequencyScale: frequencyScale
            };
        });
        
    } catch (error) {
        console.error('Error loading inclusive behaviours data:', error);
        window.inclusiveBehavioursData = {};
    }
}

// Function to populate competency dropdowns with all available competencies from JSONL
function populateAllCompetencies() {
    const comp1 = document.getElementById('competency1');
    const comp2 = document.getElementById('competency2');
    const comp3 = document.getElementById('competency3');
    
    if (!comp1 || !comp2 || !comp3) {
        console.warn('Competency dropdowns not found');
        return;
    }
    
    // Collect all unique competencies across all ranks
    const allCompetencies = new Set();
    
    Object.values(window.competencyData).forEach(rankData => {
        if (rankData.competencies && rankData.competencies.length > 0) {
            rankData.competencies.forEach(category => {
                category.facets.forEach(facet => {
                    allCompetencies.add(`${category.category} -> ${facet.name}`);
                });
            });
        }
    });
    
    // Sort competencies alphabetically
    const sortedCompetencies = Array.from(allCompetencies).sort();
    
    // Build options HTML
    let optionsHTML = '';
    sortedCompetencies.forEach(comp => {
        const displayComp = comp.replace(' -> ', ' → ');
        optionsHTML += `<option value="${comp}">${displayComp}</option>`;
    });
    
    // Populate all three dropdowns
    comp1.innerHTML = '<option value="">-- Optional: Select 1st Competency --</option>' + optionsHTML;
    comp2.innerHTML = '<option value="">-- Optional: Select 2nd Competency --</option>' + optionsHTML;
    comp3.innerHTML = '<option value="">-- Optional: Select 3rd Competency --</option>' + optionsHTML;
    
}

// Function to disable ranks without competency data in the dropdown
function updateRankDropdownState() {
    const rankSelect = document.getElementById('rankSelect');
    if (!rankSelect) return;
    
    const options = rankSelect.querySelectorAll('option[value]');
    
    options.forEach(option => {
        const rankCode = option.value;
        if (!rankCode) return; // Skip the "-- Select Rank --" option
        
        const rankData = window.competencyData[rankCode];
        const hasData = rankData && rankData.competencies && rankData.competencies.length > 0;
        
        if (!hasData) {
            option.disabled = true;
            option.textContent = option.textContent + ' (Data not available)';
            option.style.color = '#888';
        } else {
            option.disabled = false;
            // Remove any "(Data not available)" suffix if it exists
            option.textContent = option.textContent.replace(' (Data not available)', '');
            option.style.color = '';
        }
    });
}

// Ensure competency data store is initialized
if (!window.competencyData) {
    window.competencyData = {};
}

// Modal functions for Competency (standards table)
window.openCompetencyModal = function() {
    const modal = document.getElementById('frameworkModal');
    const formRankSelect = document.getElementById('rankSelect');

    if (!modal) return;

    const selectedRank = formRankSelect ? formRankSelect.value : '';
    loadCompetencyStandards(selectedRank);

    modal.classList.add('active');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
};

window.closeCompetencyModal = function() {
    const modal = document.getElementById('frameworkModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

// Backward compatibility aliases
window.openFrameworkModal = window.openCompetencyModal;
window.closeFrameworkModal = window.closeCompetencyModal;

// Modal functions for References
window.openReferencesModal = function() {
    const modal = document.getElementById('referencesModal');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
};

window.closeReferencesModal = function() {
    const modal = document.getElementById('referencesModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

window.openWorkflowGraphModal = function() {
    const modal = document.getElementById('workflowGraphModal');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        renderWorkflowGraph(workflowGraphIndex);
    }
};

window.closeWorkflowGraphModal = function() {
    const modal = document.getElementById('workflowGraphModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const competencyModal = document.getElementById('frameworkModal');
    const referencesModal = document.getElementById('referencesModal');
    const workflowGraphModal = document.getElementById('workflowGraphModal');
    
    if (event.target === competencyModal) {
        closeCompetencyModal();
    }
    if (event.target === referencesModal) {
        closeReferencesModal();
    }
    if (event.target === workflowGraphModal) {
        closeWorkflowGraphModal();
    }
});

// Close modals with Escape key
window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeCompetencyModal();
        closeReferencesModal();
        closeWorkflowGraphModal();
    }

    const workflowGraphModal = document.getElementById('workflowGraphModal');
    const isWorkflowOpen = workflowGraphModal && workflowGraphModal.classList.contains('active');
    if (isWorkflowOpen && event.key === 'ArrowRight') {
        renderWorkflowGraph((workflowGraphIndex + 1) % workflowGraphs.length);
    }
    if (isWorkflowOpen && event.key === 'ArrowLeft') {
        renderWorkflowGraph((workflowGraphIndex - 1 + workflowGraphs.length) % workflowGraphs.length);
    }
});

// Update competency state from rank selection
window.updateCompetencyState = function() {
    const rankSelect = document.getElementById('rankSelect');
    const selectedRank = rankSelect.value;
    const rankWarning = document.getElementById('rankWarning');
    const comp1 = document.getElementById('competency1');
    const comp2 = document.getElementById('competency2');
    const comp3 = document.getElementById('competency3');
    
    if (!selectedRank) {
        // Hide warning when no rank selected
        if (rankWarning) {
            rankWarning.style.display = 'none';
        }
        // Reset competency selectors
        if (comp1) comp1.innerHTML = '<option value="">-- Optional: Select 1st Competency --</option>';
        if (comp2) comp2.innerHTML = '<option value="">-- Optional: Select 2nd Competency --</option>';
        if (comp3) comp3.innerHTML = '<option value="">-- Optional: Select 3rd Competency --</option>';
        return;
    }
    
    const rankData = window.competencyData[selectedRank];
    
    if (!rankData || !rankData.competencies || rankData.competencies.length === 0) {
        // Show warning under rank selection
        if (rankWarning) {
            rankWarning.innerHTML = `
                <div style="background: rgba(255, 180, 50, 0.1); border: 2px solid #ffb432; border-radius: 8px; padding: 15px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.5em;">⚠️</span>
                        <div>
                            <strong style="color: #ffb432;">Competency Data Not Yet Available</strong><br>
                            <span style="color: #e0e0e0; font-size: 0.9em;">The competency framework for <strong>${rankData.fullName}</strong> is being prepared. You can still generate reports using the AI's knowledge.</span>
                        </div>
                    </div>
                </div>
            `;
            rankWarning.style.display = 'block';
        }
        // Reset competency selectors
        if (comp1) comp1.innerHTML = '<option value="">-- Optional: Select 1st Competency --</option>';
        if (comp2) comp2.innerHTML = '<option value="">-- Optional: Select 2nd Competency --</option>';
        if (comp3) comp3.innerHTML = '<option value="">-- Optional: Select 3rd Competency --</option>';
        return;
    }
    
    // Hide warning and show success message
    if (rankWarning) {
        rankWarning.innerHTML = `
            <div style="background: rgba(107, 255, 107, 0.1); border: 2px solid #6bff6b; border-radius: 8px; padding: 12px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.2em;">✅</span>
                    <span style="color: #6bff6b; font-weight: 500;">Loaded ${rankData.fullName} </span>
                </div>
            </div>
        `;
        rankWarning.style.display = 'block';
    }
    
    // Update competency selectors with category and facet names
    let optionsHTML = '<option value="">-- Optional: Select Competency --</option>';
    rankData.competencies.forEach(category => {
        category.facets.forEach(facet => {
            optionsHTML += `<option value="${category.category} -> ${facet.name}">${category.category} → ${facet.name}</option>`;
        });
    });
    
    if (comp1) comp1.innerHTML = optionsHTML.replace('-- Optional: Select Competency --', '-- Optional: Select 1st Competency --');
    if (comp2) comp2.innerHTML = optionsHTML.replace('-- Optional: Select Competency --', '-- Optional: Select 2nd Competency --');
    if (comp3) comp3.innerHTML = optionsHTML.replace('-- Optional: Select Competency --', '-- Optional: Select 3rd Competency --');
};

// Backward compatibility alias
window.updateCompetencyFramework = window.updateCompetencyState;

// Main PaCE Report generation function
window.generatePaceReport = async function () {
    // Hide previous results/errors (safely check for existence)
    const errorDiv = document.getElementById('errorDiv');
    const resultDiv = document.getElementById('resultDiv');
    const loadingDiv = document.getElementById('loadingDiv');
    
    if (errorDiv) errorDiv.style.display = 'none';
    if (resultDiv) resultDiv.style.display = 'none';
    
    // Get form values
    const rankSelect = document.getElementById('rankSelect').value;
    const jobTrade = document.getElementById('jobTrade')?.value.trim() || '';
    const eventDescription = document.getElementById('eventDescription').value.trim();
    const competency1 = document.getElementById('competency1').value;
    const competency2 = document.getElementById('competency2').value;
    const competency3 = document.getElementById('competency3').value;
    const includeCCG = document.getElementById('ccgToggle')?.checked || false;
    const includeAnalysis = document.getElementById('analysisToggle')?.checked || false;
    const includeMetaCompetency = document.getElementById('metaCompetencyToggle')?.checked || false;
    const includeMetaCompetencyDetailed = document.getElementById('metaCompetencyDetailedToggle')?.checked || false;
    const competencyCount = parseInt(document.getElementById('competencyCount')?.value) || 3;
    
    // Validation
    if (!rankSelect) {
        utils.showError(document.getElementById('errorDiv'), 'Please select the member\'s rank from the dropdown.');
        document.getElementById('errorDiv').style.display = 'block';
        return;
    }
    
    // Get rank data
    const rankData = window.competencyData[rankSelect];
    if (!rankData) {
        utils.showError(document.getElementById('errorDiv'), 'Invalid rank selected.');
        document.getElementById('errorDiv').style.display = 'block';
        return;
    }
    
    // Check if rank has competency data
    if (!rankData.competencies || rankData.competencies.length === 0) {
        utils.showError(document.getElementById('errorDiv'), `Competency data for ${rankData.fullName} is not yet available. Please select a different rank with available data.`);
        document.getElementById('errorDiv').style.display = 'block';
        return;
    }
    
    if (!eventDescription) {
        utils.showError(document.getElementById('errorDiv'), 'Please provide an event description.');
        document.getElementById('errorDiv').style.display = 'block';
        return;
    }
    
    // Collect user-selected competencies (remove duplicates)
    const selectedCompetencies = [competency1, competency2, competency3]
        .filter(c => c && c.trim() !== '');
    
    // Check for duplicates
    const uniqueCompetencies = [...new Set(selectedCompetencies)];
    if (selectedCompetencies.length !== uniqueCompetencies.length) {
        utils.showError(document.getElementById('errorDiv'), 'Please select different competencies. Duplicates are not allowed.');
        document.getElementById('errorDiv').style.display = 'block';
        return;
    }
    
    // Build competency framework string for AI prompt with behavioral indicators
    let competencyFramework = '';
    if (rankData.competencies && rankData.competencies.length > 0) {
        competencyFramework = `\nRANK-SPECIFIC COMPETENCY FRAMEWORK FOR ${rankData.fullName.toUpperCase()}:\n`;
        competencyFramework += `(Select 3-5 most relevant competencies from the following framework based on the behavioral indicators)\n\n`;
        
        rankData.competencies.forEach((category, index) => {
            competencyFramework += `${index + 1}. ${category.category}:\n`;
            category.facets.forEach(facet => {
                competencyFramework += `\n   ${facet.name}:\n`;
                competencyFramework += `   Behavioral Indicators for ${rankData.fullName}:\n`;
                facet.indicators.forEach(indicator => {
                    competencyFramework += `   • ${indicator}\n`;
                });
            });
            competencyFramework += '\n';
        });
    } else {
        // Fallback to generic framework if rank-specific data not available
        competencyFramework = `\nGENERIC COMPETENCY FRAMEWORK (Rank-specific framework not yet available for ${rankData.fullName}):\n`;
        competencyFramework += `1. Communication: Oral Communication, Written Communication, Tailored Communication, Active Listening\n`;
        competencyFramework += `2. Personal Development: Self-Development, Adaptability, Resilience, Self-Awareness\n`;
        competencyFramework += `3. Leadership: Team Leadership, Decision Making, Mentorship, Influence\n`;
        competencyFramework += `4. Teamwork: Collaboration, Cooperation, Conflict Resolution, Building Relationships\n`;
        competencyFramework += `5. Technical/Professional Competence: Technical Expertise, Problem Solving, Innovation, Quality Focus\n`;
        competencyFramework += `6. Military Ethos: Discipline, Integrity, Loyalty, Professionalism\n`;
        competencyFramework += `7. Strategic Thinking: Vision, Planning, Risk Assessment, Resource Management\n`;
        competencyFramework += `8. Change Management: Initiative, Innovation Implementation, Continuous Improvement, Change Leadership\n`;
    }
    
    // Build meta-competency framework based on toggle states
    let metaCompetencyFramework = '';
    if ((includeMetaCompetency || includeMetaCompetencyDetailed) && window.inclusiveBehavioursData) {
        metaCompetencyFramework = `\n\nMETA-COMPETENCIES FOR POTENTIAL ASSESSMENT (Next Rank Level):\n`;
        metaCompetencyFramework += `Potential is a member's readiness to perform at the next rank. Evaluate five meta-competencies with inclusive behaviours.\n\n`;
        
        Object.keys(window.inclusiveBehavioursData).forEach((metaCompetency, index) => {
            const data = window.inclusiveBehavioursData[metaCompetency];
            metaCompetencyFramework += `${index + 1}. ${metaCompetency}\n`;
            
            // Only include detailed information if detailed toggle is enabled
            if (includeMetaCompetencyDetailed) {
                metaCompetencyFramework += `   Definition: ${data.definition}\n\n`;
                metaCompetencyFramework += `   Inclusive Behaviours:\n`;
                data.behaviours.forEach(behaviour => {
                    metaCompetencyFramework += `   • ${behaviour}\n`;
                });
                metaCompetencyFramework += `\n   Frequency Scale:\n`;
                metaCompetencyFramework += `   • Rarely (Unexploited): ${data.frequencyScale.Rarely}\n`;
                metaCompetencyFramework += `   • Occasionally (Developing): ${data.frequencyScale.Occasionally}\n`;
                metaCompetencyFramework += `   • Frequently (Consolidating): ${data.frequencyScale.Frequently}\n`;
                metaCompetencyFramework += `   • Consistently (Mastered): ${data.frequencyScale.Consistently}\n`;
            }
            metaCompetencyFramework += '\n';
        });
    }
    
    // Build the AI prompt
    let systemPrompt = `You are a professional Canadian Armed Forces (CAF) PaCE (Performance and Career Evaluation) report writer with expertise in the CAF competency framework. You help members create structured, professional performance evaluations that highlight their achievements using appropriate competencies.

Your task is to analyze the provided event description and generate a PaCE report following this EXACT format:

*Quality Assessment: [Choose one: Routine | Above Average | Exceptional] — [One sentence of honest rationale. Routine = expected performance for this rank/trade; Above Average = shows initiative or skill meaningfully beyond typical expectations; Exceptional = genuinely remarkable and uncommon. Be honest — most events are Routine or Above Average.]*

---

## PaCE Report

### Member Information
- **Rank/Position:** ${rankData.fullName}${jobTrade ? `\n- **Military Occupation/Trade:** ${jobTrade}` : ''}

### Event Summary
**Event Title:** [2-5 word capitalized summary of the event, e.g., "OPERATIONAL READINESS TRAINING EXERCISE" or "LEADERSHIP MENTORSHIP PROGRAM"]

**Relevant Competencies:**
[List EXACTLY ${competencyCount} competencies in this EXACT format - each competency MUST include both category and specific competency name:
"1. [Category Name] -> [Specific Competency Name]"
"2. [Category Name] -> [Specific Competency Name]"
etc.

CRITICAL: Do NOT list only category names. ALWAYS include the arrow (->) and the specific competency name.
Example CORRECT format: "1. Leadership -> Team Building"
Example INCORRECT format: "1. Leadership" (missing specific competency)
]

**Performance Summary:**
[Write 2-5 sentences scaled to the detail provided and calibrated to the Quality Assessment at the top. INFER likely associated behaviours from brief statements — phrase these conditionally so the member can confirm (e.g., "Mbr likely managed subordinate scheduling and admin throughout this period", "This role would have required coordinating..."). Do NOT over-inflate; if the event is routine or expected for this rank, use measured, grounded language. If the description is sparse, generate the most probable scenario and note it is inferred.${jobTrade ? ` Consider how this event relates to their ${jobTrade} occupation.` : ''}]

### Event Outcome
[Describe the outcome proportional to the evidence provided. Avoid vague phrases like "improved morale", "enhanced unit effectiveness", or "demonstrated leadership" unless directly supported by specifics in the description. If the outcome is routine or expected, state that plainly. If details are sparse, infer the most probable outcome and note it as inferred so the member can confirm or expand. Write 2-4 sentences scaled to the complexity of the event — do not pad with generic filler.]

${includeCCG ? `

**Assessment Context (CCG):**
- **Complexity:** [Low / Medium / High — Low = task is routine and within primary trade duties; Medium = requires meaningful effort or skill but broadly expected at this rank; High = requires skills, knowledge, or effort clearly outside the member's primary trade or role]
- **Consistency:** [Occasional / Frequent / Sustained]
- **Guidance:** [Independent / Minimum / Moderate / Close]` : ''}

${includeAnalysis ? `

### Competency Analysis
[For EACH competency listed in Event Summary, provide a detailed paragraph explaining:
- How the member specifically demonstrated this competency during the event
- Concrete examples from the event description that showcase the competency in action
- The impact or significance of demonstrating this competency]` : ''}

${includeMetaCompetency && !includeMetaCompetencyDetailed ? `

### Meta-Competency Assessment (Next Rank Potential)
[Identify which of the five meta-competencies (Expertise, Cognitive Capacities, Social Capacities, Change Capacities, Professional Ideology) are relevant to this event. List only the names of relevant meta-competencies.

**Relevant Meta-Competencies:**
- [List each relevant meta-competency name]

Note: Only list meta-competencies where clear evidence exists in the event description.]` : ''}

${includeMetaCompetencyDetailed ? `

### Meta-Competency Assessment (Next Rank Potential)
[Conduct detailed assessment of member's readiness to perform at the next rank level by evaluating each of the five meta-competencies. For each meta-competency that was demonstrated:

1. **Meta-Competency Name** (e.g., Expertise, Cognitive Capacities, Social Capacities, Change Capacities, Professional Ideology)
   - **Definition:** [Provide the definition of this meta-competency]
   - **Frequency Assessment:** [Rarely/Occasionally/Frequently/Consistently]
   - **Inclusive Behaviours Demonstrated:** List specific inclusive behaviours from the framework that were evident
   - **Evidence from Event:** Concrete examples showing demonstration at next rank level
   - **Impact:** How these behaviours contribute to readiness for next rank

Note: Only assess meta-competencies where clear evidence exists in the event description. If insufficient evidence for a meta-competency, note "Insufficient evidence to assess at next rank level."]` : ''}

${uniqueCompetencies.length > 0 ? `

### Competency Selection Rationale
List ${uniqueCompetencies.join(', ')}

If you chose DIFFERENT competencies than the member's selections, provide a brief explanation for each pre-selected competency that you did NOT include in the final report, explaining why it was not the best fit for this specific event. If you used all of the member's selections, state that they were appropriate and briefly explain why.` : ''}
${competencyFramework}
${metaCompetencyFramework}
IMPORTANT GUIDELINES:
- **HONEST QUALITY ASSESSMENT:** Evaluate the event objectively against what is expected at this rank. Most events are Routine or Above Average — do NOT default to Exceptional. The Quality Assessment at the top must be set honestly and calibrates the tone of the entire report. A routine task should not read like a career-defining achievement.
- **COMPETENCY-TIER CONSISTENCY:** The competencies you select MUST directly support your Quality Assessment rationale. If the rationale mentions a specific behaviour or skill (e.g., initiative, innovation, technical problem-solving), that competency MUST appear in the top 3. Never assess the quality of an event using language that implies a competency you then fail to include. If "Initiative" drove the rating, "Initiative" must be selected.
- **NO CITATIONS OR REFERENCES:** NEVER include citation markers, footnote numbers, or reference brackets of any kind in the output — no [1], [2], [^1], [^7], etc. Do not cite sources. Write all content as plain professional prose only.
- **INFERENTIAL DETAIL:** When the description is brief, infer the most likely associated behaviours and tasks, but phrase them conditionally ("Mbr likely...", "This would have required...", "It can be inferred that...") so the member can confirm accuracy or provide corrections. The goal is to jog the member's memory and prompt them to supply more specific detail.
- **PROPORTIONAL OUTPUT:** Scale the length and depth of the narrative to the detail provided. A one-sentence description should produce 2-3 inferential sentences. A detailed multi-sentence description warrants a fuller, multi-paragraph response. Do not pad sparse input with generic filler.
- **AVOID GENERIC OUTCOMES:** Do not default to outcomes like "improved morale", "enhanced unit cohesion", or "demonstrated strong leadership" without specific supporting evidence. If no outcome is described, infer the most probable one and flag it as inferred.
- **CCG COMPLEXITY:** Complexity = High if the task requires skills or knowledge clearly outside the member's primary trade or role (e.g., a Sgt creating software programs, an Infanteer doing logistics analysis). Complexity = Medium if the task is within rank expectations but requires meaningful effort. Complexity = Low only if the task is entirely routine and within the member's primary duties.
- **CRITICAL FORMATTING RULE:** When listing competencies under "Relevant Competencies", you MUST use the format "1. [Category Name] -> [Specific Competency Name]". NEVER list only the category name without the specific competency.
- Select exactly ${competencyCount} competencies that are MOST relevant to the event description, listed in order of priority (most relevant first)
- Each competency listed MUST include BOTH the category AND the specific competency name separated by an arrow (->)
- Use the rank-specific competency framework provided above to identify both category names and specific competency names${jobTrade ? `
- **Military Occupation Context:** The member's trade is ${jobTrade}. When assessing complexity, consider whether tasks align with typical ${jobTrade} responsibilities or demonstrate versatility beyond their primary role. Tasks outside normal trade scope indicate higher complexity and broader capability.` : ''}
- Use proper markdown formatting with headers (##, ###) and bullet points
- Be specific and provide concrete examples
- Focus on measurable outcomes and impacts
- Maintain professional military tone
- Follow the EXACT format template provided above - do not add or remove sections
- Ensure every section follows the template structure precisely${includeCCG ? `
- **CCG output rule:** Output only the single-word rating for each CCG field. Strip all bracket text and rationale from the output (e.g., output "High" not "High — task is outside primary trade"). No explanatory text, no brackets, no dashes after the rating.` : ''}${includeAnalysis ? `
- Provide detailed competency demonstration analysis with concrete examples from the event
- Ensure the Competency Analysis section analyzes EACH competency listed in the Event Summary` : `
- DO NOT include a "Competency Analysis" section - only provide the Event Outcome`}${includeMetaCompetency && !includeMetaCompetencyDetailed ? `
- Identify which of the five meta-competencies are relevant to this event for next-rank readiness
- List only the meta-competency names without detailed descriptions
- Only identify meta-competencies with clear evidence from the event description` : ''}${includeMetaCompetencyDetailed ? `
- Assess member's potential for next rank using the five meta-competencies framework with detailed analysis
- Include definitions, frequency ratings (Rarely/Occasionally/Frequently/Consistently), and inclusive behaviours
- Identify specific inclusive behaviours demonstrated that support next-rank readiness
- Provide concrete evidence and impact assessment for each meta-competency
- Only assess meta-competencies with clear evidence from the event description` : includeMetaCompetency ? '' : `
- DO NOT include a "Meta-Competency Assessment" section`}
- Ensure competencies selected match the responsibilities expected at the ${rankData.fullName} rank level
- Follow the EXACT format template provided above - do not add or remove sections`;

    let userPrompt = `**Event Description:**\n${eventDescription}\n\n`;
    
    if (jobTrade) {
        userPrompt += `**Member's Military Occupation/Trade:**\n${jobTrade}\n\n`;
        userPrompt += `Context: Use this occupation to assess task complexity and relevance. Tasks aligned with ${jobTrade} duties show normal competency development. Tasks significantly outside ${jobTrade} scope demonstrate exceptional versatility, learning agility, and higher complexity (e.g., an Armored soldier developing software, an Infantry member doing supply chain analysis).\n\n`;
    }
    
    if (uniqueCompetencies.length > 0) {
        userPrompt += `**Member's Pre-Selected Competencies:**\n${uniqueCompetencies.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\n`;
        userPrompt += `Note: Evaluate whether these pre-selected competencies are the best fit. If not, choose more appropriate ones and explain why the pre-selected ones were not optimal for this specific event.\n\n`;
    }
    
    userPrompt += `Please generate a complete PaCE report following the exact format specified in your system instructions.\n\n`;
    userPrompt += `REMINDER: Under "Relevant Competencies" section, you MUST format each competency as:\n`;
    userPrompt += `"1. [Category Name] -> [Specific Competency Name]"\n`;
    userPrompt += `"2. [Category Name] -> [Specific Competency Name]"\n`;
    userPrompt += `Do NOT write only the category name without the specific competency.`;
    
    // Show loading indicator
    utils.showLoading(
        document.getElementById('loadingDiv'),
        'Analyzing event and generating PaCE report...'
    );
    document.getElementById('loadingDiv').style.display = 'block';
    
    try {
        const messages = [
            {
                role: 'system',
                content: systemPrompt
            },
            {
                role: 'user',
                content: userPrompt
            }
        ];
        
        // Make the API request
        const response = await apiManager.makeRequest(messages, {
            maxTokens: 3000,
            temperature: 0.4 // Moderate temperature for professional but tailored output
        });
        
        // Hide loading
        document.getElementById('loadingDiv').style.display = 'none';
        
        if (response && response.length > 0) {
            currentResult = response;
            // Use centralized formatMarkdown from utils
            document.getElementById('resultContent').innerHTML = utils.formatMarkdown(currentResult);
            document.getElementById('resultDiv').style.display = 'block';
            
            // Set content for download manager
            window.downloadManager.setContent(currentResult, 'markdown');
            
            // Scroll to results
            document.getElementById('resultDiv').scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            throw new Error('No content received from AI');
        }
        
    } catch (error) {
        console.error('Error generating PaCE report:', error);
        document.getElementById('loadingDiv').style.display = 'none';
        
        let errorMessage = 'Failed to generate PaCE report. ';
        if (error.message.includes('API key')) {
            errorMessage += 'Please check your API key configuration in the AI Settings.';
        } else if (error.message.includes('rate limit')) {
            errorMessage += 'Rate limit reached. Please try again in a moment.';
        } else if (error.message.includes('timeout')) {
            errorMessage += 'Request timed out. Please try again.';
        } else {
            errorMessage += error.message || 'Please try again.';
        }
        
        utils.showError(document.getElementById('errorDiv'), errorMessage);
        document.getElementById('errorDiv').style.display = 'block';
    }
};

// Toggle visibility of optional competency selectors
window.toggleCompetencySelectors = function() {
    const container = document.getElementById('competencySelectors');
    const toggle = document.getElementById('competencyToggle');
    if (!container || !toggle) return;
    const show = !!toggle.checked;
    container.style.display = show ? 'block' : 'none';
    toggle.setAttribute('aria-expanded', show.toString());
    // If hiding, clear any selected values
    if (!show) {
        ['competency1','competency2','competency3'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
    }
};

// Toggle visibility of CCG info
window.toggleCCG = function() {
    const infoDiv = document.getElementById('ccgInfo');
    const toggle = document.getElementById('ccgToggle');
    if (!infoDiv || !toggle) return;
    const show = !!toggle.checked;
    infoDiv.style.display = show ? 'block' : 'none';
    toggle.setAttribute('aria-expanded', show.toString());
};

// Toggle visibility of competency analysis info
window.toggleAnalysis = function() {
    const infoDiv = document.getElementById('analysisInfo');
    const toggle = document.getElementById('analysisToggle');
    if (!infoDiv || !toggle) return;
    const show = !!toggle.checked;
    infoDiv.style.display = show ? 'block' : 'none';
    toggle.setAttribute('aria-expanded', show.toString());
};

// Toggle visibility of meta-competency options
window.toggleMetaCompetency = function() {
    const optionsDiv = document.getElementById('metaCompetencyOptions');
    const toggle = document.getElementById('metaCompetencyToggle');
    const detailedToggle = document.getElementById('metaCompetencyDetailedToggle');
    
    if (!optionsDiv || !toggle) return;
    
    const show = !!toggle.checked;
    optionsDiv.style.display = show ? 'block' : 'none';
    toggle.setAttribute('aria-expanded', show.toString());
    
    // If hiding primary toggle, also hide and uncheck secondary toggle
    if (!show && detailedToggle) {
        detailedToggle.checked = false;
        toggleMetaCompetencyDetailed();
    }
};

// Toggle visibility of detailed meta-competency analysis
window.toggleMetaCompetencyDetailed = function() {
    const infoDiv = document.getElementById('metaCompetencyDetailedInfo');
    const toggle = document.getElementById('metaCompetencyDetailedToggle');
    if (!infoDiv || !toggle) return;
    const show = !!toggle.checked;
    infoDiv.style.display = show ? 'block' : 'none';
    toggle.setAttribute('aria-expanded', show.toString());
};
