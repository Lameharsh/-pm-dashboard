import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  RefreshCw, ExternalLink, ChevronDown, ChevronRight, Copy, Check, Sparkles,
  AlertTriangle, Clock, Target, MessageSquare, Activity, Filter, Search, X, Zap,
  Flame, XCircle, TrendingUp, TrendingDown, BarChart2, ShieldAlert
} from 'lucide-react';

const CURRENT_SPRINT_MONTH = 'April 2026';

const PLATINUM_PRIORITY = [
  { gid: "1213709077905968", name: "Wipro CC (11151) - Regularisation option for Deactivated Attendance Norms Policies",   cstPriority: "P1", client: "Wipro Consumer Care", csm: "Arnav",          delivery: "May'26",  status: "",                       source: "Platinum", asana_url: "https://app.asana.com/1/34125054317482/project/1209288554130211/task/1213709077905968" },
  { gid: "1211157997525165", name: "Basket Data API - IOM Date field addition",                                              cstPriority: "P1", client: "Paragon",            csm: "Shubham Saini", delivery: "Apr'26",  status: "Ready for release",      source: "Platinum", asana_url: "https://app.asana.com/1/34125054317482/project/135117810859852/task/1211157997525165" },
  { gid: "1213259421188567", name: "Branch (Region) and Zone Filter Option in Dashboard Report Download",                    cstPriority: "P1", client: "Bisleri",            csm: "Prateek",       delivery: "Apr'26",  status: "Testing",                source: "Platinum", asana_url: "https://app.asana.com/1/34125054317482/project/1212554452128805/task/1213259421188567" },
  { gid: "1212763033836154", name: "Schemes required at and combination in of Zone, region, state and Territory level",      cstPriority: "P2", client: "Everest",            csm: "Rishabh Gupta", delivery: "Apr'26",  status: "",                       source: "Platinum", asana_url: "https://app.asana.com/1/34125054317482/project/139097763031412/task/1212763033836154" },
  { gid: "1213699341495837", name: "Wipro CC (11151) - Attendance Norms (LPC & Avg LPC) to be added in Attendance norms report", cstPriority: "P2", client: "Wipro Consumer Care", csm: "Arnav",    delivery: "Apr'26",  status: "",                       source: "Platinum", asana_url: "https://app.asana.com/1/34125054317482/project/1209288554130211/task/1213699341495837" },
  { gid: "1213570774164472", name: "Require to select column option at the time of downloading Outlet wise sales report",    cstPriority: "P3", client: "Everest",            csm: "Rishabh Gupta", delivery: "Apr'26",  status: "Blocked — low ROI",      source: "Platinum", asana_url: "https://app.asana.com/1/34125054317482/project/139097763031412/task/1213570774164472" },
];

const GOLD_PRIORITY = [
  { gid: "1211463334740341", name: "Auto mapping of returns against invoices in DMS coming from SFA",                                                    cstRank: 1,  status: "Taken Up",                  client: "Too Yumm",      csm: "Vishesh Malik", source: "Gold", asana_url: "https://app.asana.com/1/34125054317482/project/1203408133153942/task/1211463334740341" },
  { gid: "1211043516511672", name: "Desai Brothers - Require setting based scheme should be applicable if there are Multiple schemes on same SKUs",        cstRank: 2,  status: "Taken Up",                  client: "Desai Brother", csm: "",              source: "Gold", asana_url: "https://app.asana.com/1/34125054317482/project/1210673562292647/task/1211043516511672" },
  { gid: "1210751540429457", name: "Requirement of round off amount in the Ledger section",                                                               cstRank: 3,  status: "Hold from CST end",          client: "Intergrow",     csm: "Mir",           source: "Gold", asana_url: "https://app.asana.com/1/34125054317482/project/1203307380205412/task/1210751540429457" },
  { gid: "1211477075861393", name: "Automatic Invoice PDF generation in Delivery Note Module",                                                            cstRank: 4,  status: "Not Taken Up",              client: "HPPL",          csm: "",              source: "Gold", asana_url: "https://app.asana.com/1/34125054317482/project/1208933094240827/task/1211477075861393" },
  { gid: "1211545270771743", name: "DB should be able to transfer current (saleable) stock to promotional stock",                                         cstRank: 5,  status: "Taken Up",                  client: "Lotus",         csm: "",              source: "Gold", asana_url: "https://app.asana.com/1/34125054317482/project/1209594002404166/task/1211545270771743" },
  { gid: "1211477175470050", name: "Desai Brother - Set the quantity limit in ARS",                                                                       cstRank: 6,  status: "Taken Up",                  client: "Desai Brother", csm: "",              source: "Gold", asana_url: "https://app.asana.com/1/34125054317482/project/1210673562292647/task/1211477175470050" },
  { gid: "1211574325637452", name: "SMS Integration - Lotus",                                                                                             cstRank: 7,  status: "Taken Up",                  client: "Lotus",         csm: "Dwitun",        source: "Gold", asana_url: "https://app.asana.com/1/34125054317482/project/1205956357801118/task/1211574325637452" },
  { gid: "1208361462538167", name: "Service Invoices + Credit Note creation for Distributor reimbursement",                                               cstRank: 8,  status: "Hold from CST end",          client: "Intergrow",     csm: "Mir",           source: "Gold", asana_url: "https://app.asana.com/1/34125054317482/project/1205831354634608/task/1208361462538167" },
  { gid: "1211172924350480", name: "Article Number for the SKU of MT Distributors",                                                                       cstRank: 9,  status: "Not Taken Up",              client: "Everest",       csm: "Aayush Singh",  source: "Gold", asana_url: "https://app.asana.com/1/34125054317482/project/1203763220572417/task/1211172924350480" },
  { gid: "1211646271616122", name: "Salesman Name to be autoselected in SO Creation but not mandatory",                                                   cstRank: 10, status: "Discussion not concluded",   client: "HPPL",          csm: "",              source: "Gold", asana_url: "https://app.asana.com/1/34125054317482/project/1208933094240827/task/1211646271616122" },
  { gid: "1211642737074422", name: "DB wise Product Group ID wise Targets for DMS",                                                                       cstRank: 11, status: "Not Taken Up",              client: "HPPL",          csm: "",              source: "Gold", asana_url: "https://app.asana.com/1/34125054317482/project/1203307380205412/task/1211642737074422" },
  { gid: "1211339394182342", name: "Option to Add/Edit Products modal on the SRS Page",                                                                   cstRank: 12, status: "Taken Up",                  client: "Too Yumm",      csm: "Vishesh Malik", source: "Gold", asana_url: "https://app.asana.com/1/34125054317482/project/1206462881208687/task/1211339394182342" },
  { gid: "1211648445993016", name: "Data saving of pieces and cases for PO raised from NS app",                                                           cstRank: 13, status: "Taken Up",                  client: "Cello World",   csm: "Prateek",       source: "Gold", asana_url: "https://app.asana.com/1/34125054317482/project/135117810859852/task/1211648445993016" },
  { gid: "1210675367036468", name: "Superstockist should be able to take returns if Sub is not using DMS",                                                cstRank: 14, status: "Not Taken Up",              client: "Lotus",         csm: "",              source: "Gold", asana_url: "https://app.asana.com/1/34125054317482/project/1209594002404166/task/1210675367036468" },
  { gid: "1211098407352491", name: "Product Margin % and freight auto-calculation in DMS",                                                                cstRank: 15, status: "Discussion not concluded",   client: "Lotte",         csm: "Mir",           source: "Gold", asana_url: "https://app.asana.com/1/34125054317482/project/1203174604067471/task/1211098407352491" },
  { gid: "1211585594027608", name: "In Good Return Dump Report need addition of seller type and seller zone",                                             cstRank: 16, status: "Taken Up",                  client: "Lotus",         csm: "Dwitun",        source: "Gold", asana_url: "https://app.asana.com/1/34125054317482/project/1205967140453121/task/1211585594027608" },
  { gid: "1211371571892819", name: "Report required to get the details for scheme benefits claimed by the distributor from the company",                   cstRank: 17, status: "Not Taken Up",              client: "Too Yumm",      csm: "Vishesh Malik", source: "Gold", asana_url: "https://app.asana.com/1/34125054317482/project/1200558694599701/task/1211371571892819" },
  { gid: "1211648342287574", name: "Desai Brothers - Require ARS order notification in DMS dashboard",                                                    cstRank: 18, status: "Taken Up",                  client: "Desai Brother", csm: "",              source: "Gold", asana_url: "https://app.asana.com/1/34125054317482/project/1203307380205412/task/1211648342287574" },
  { gid: "1211098734377800", name: "Vicco - Require Inactive DBs Data In Reports toggle for Company Executive also",                                      cstRank: 19, status: "Not Taken Up",              client: "Vicco",         csm: "",              source: "Gold", asana_url: "https://app.asana.com/1/34125054317482/project/1206211141735094/task/1211098734377800" },
  { gid: "1207927265535411", name: "Defect: missing batch no, Exp date, Mfg date columns in Primary good return dump report",                             cstRank: 20, status: "Taken Up",                  client: "Deoleo",        csm: "",              source: "Gold", asana_url: "https://app.asana.com/1/34125054317482/project/1206027916764845/task/1207927265535411" },
  { gid: "1211659154389615", name: "Defect - Zone Region Territory details not flowing for returns",                                                      cstRank: 21, status: "Not Taken Up",              client: "Too Yumm",      csm: "Vishesh Malik", source: "Gold", asana_url: "https://app.asana.com/1/34125054317482/project/1203954886571723/task/1211659154389615" },
  { gid: "1211585327441042", name: "Need IDT Invoice column in Net Sales Dump Report",                                                                    cstRank: 22, status: "Taken Up",                  client: "Lotus",         csm: "Dwitun",        source: "Gold", asana_url: "https://app.asana.com/1/34125054317482/project/1209594002404166/task/1211585327441042" },
  { gid: "1211595440974177", name: "Auto-Cancellation Logic for Customer Sales Return upon Primary Sales Return Cancellation",                            cstRank: 23, status: "Not Taken Up",              client: "Too Yumm",      csm: "Vishesh Malik", source: "Gold", asana_url: "https://app.asana.com/1/34125054317482/project/1205967140453121/task/1211595440974177" },
];

// Lookup map: GID → Asana task (for cross-referencing priority sheet tasks)
const ASANA_GID_MAP = Object.fromEntries(tasks.map(t => [t.gid, t]));

// Urgency labels used for filter toggles (not sections)
const URGENCY_SECTIONS = ["🔴 Overdue", "🟡 Due Today", "⏰ Stale (3d+)"];

// Kanban sections only — urgency is now a filter overlay, not a section
const SECTION_ORDER = [
  "Need to discuss - Kanban",
  "Need to scope",
  "Taken up - Kanban",
  "Groomed - Kanban",
  "Need to provide update later",
  "KPI's",
  "Recently assigned",
  "Defect & Bug"
];

const SECTION_META = {
  "Need to discuss - Kanban":     { emoji: "💬", desc: "Requires a conversation or clarification" },
  "Need to scope":                { emoji: "🔍", desc: "Needs PM scoping before dev handoff" },
  "Taken up - Kanban":            { emoji: "⚡", desc: "Currently being worked on" },
  "Groomed - Kanban":             { emoji: "✅", desc: "Scoped and ready for development" },
  "Need to provide update later": { emoji: "🔔", desc: "Actioned — follow-up update pending" },
  "KPI's":                        { emoji: "📊", desc: "KPI and metrics related tasks" },
  "Recently assigned":            { emoji: "📥", desc: "Newly assigned — needs triage" },
  "Defect & Bug":                 { emoji: "🐛", desc: "Tasks tagged or named as Defect / Bug — assigned to you" },
};

const isDefectOrBug = (task) => {
  const nameLower = (task.name || '').toLowerCase();
  const hasNameMatch = nameLower.includes('defect') || nameLower.includes('bug');
  const hasTagMatch = (task.tags || []).some(tag =>
    (typeof tag === 'string' ? tag : tag.name || '')
      .toLowerCase().match(/defect|bug/)
  );
  return hasNameMatch || hasTagMatch;
};

// Chase risk: notes mention follow-up / status / any update more than twice → CST is chasing
const isChaseRisk = (notes) => {
  if (!notes) return false;
  const lower = notes.toLowerCase();
  return (lower.match(/follow.?up|any update|any updates|status/g) || []).length > 2;
};

// Missing PBI: Groomed or Taken-up tasks that don't have an Azure DevOps link
const isMissingPBI = (task) => {
  const inActiveSection = task.section === 'Groomed - Kanban' || task.section === 'Taken up - Kanban';
  if (!inActiveSection) return false;
  return !(task.notes_preview || '').toLowerCase().includes('dev.azure.com');
};

const getRiskColor = (imp) => {
  if (imp === 'x16') return 'rose';
  if (imp === 'x8') return 'amber';
  return 'emerald';
};

const getImportanceChip = (imp) => {
  if (imp === 'x16') return { label: 'x16', color: 'bg-rose-100 text-rose-800' };
  if (imp === 'x8') return { label: 'x8', color: 'bg-amber-100 text-amber-800' };
  if (imp === 'x4') return { label: 'x4', color: 'bg-slate-100 text-slate-700' };
  return { label: imp, color: 'bg-slate-50 text-slate-600' };
};

// Dynamic today — always reflects actual current date, no hardcoding
const TODAY_STR = new Date().toISOString().split('T')[0];
const TODAY_DATE = new Date(TODAY_STR); // single reference for all comparisons

const getDaysSincedUpdate = (modified) => {
  if (!modified) return 999;
  const lastUpdate = new Date(modified);
  return Math.max(0, Math.floor((TODAY_DATE - lastUpdate) / 86400000));
};

const isOverdue = (due_on) => {
  if (!due_on) return false;
  return new Date(due_on) < TODAY_DATE;
};

const isDueToday = (due_on) => due_on === TODAY_STR;

const daysOverdue = (due_on) => {
  if (!due_on) return 0;
  return Math.max(0, Math.floor((TODAY_DATE - new Date(due_on)) / 86400000));
};

// Returns urgency level for a task so the UI can highlight and sort accordingly
const getUrgencyLevel = (task) => {
  const overdue  = isOverdue(task.due_on);
  const silent   = getDaysSincedUpdate(task.modified) >= 3;
  const dueToday = isDueToday(task.due_on);
  if (overdue && silent) return 'critical';   // worst — past due AND no touch in 3d
  if (overdue)           return 'overdue';    // past due but recently touched
  if (dueToday)          return 'due-today';  // due today — respond before EOD
  if (silent)            return 'stale';      // 3+ days no response
  return null;
};

const URGENCY_SORT = { critical: 0, overdue: 1, 'due-today': 2, stale: 3 };

const URGENCY_META = {
  critical:   { label: '🔴 Overdue + Silent',  badge: 'bg-red-100 text-red-800 border border-red-200',    border: 'border-l-4 border-l-red-500'    },
  overdue:    { label: '🟠 Overdue',            badge: 'bg-rose-100 text-rose-800 border border-rose-200', border: 'border-l-4 border-l-rose-400'   },
  'due-today':{ label: '🟡 Due Today',          badge: 'bg-amber-100 text-amber-800 border border-amber-200', border: 'border-l-4 border-l-amber-400' },
  stale:      { label: '⏰ Silent 3d+',         badge: 'bg-yellow-100 text-yellow-800 border border-yellow-200', border: 'border-l-4 border-l-yellow-300' },
};

// ---------------------------------------------------------------------------
// Notes field parser — converts Asana structured notes into key-value pairs
// Handles both raw newline format and our space-compressed notes_preview
// ---------------------------------------------------------------------------

const KNOWN_FIELDS = new Set([
  'IssueTitle','Platform','Severity','ReasonOfSeverity','CompanyName',
  'ClientId','ClientCategory','IssueDescription','StepsToReproduce','ExpectedOutput',
  'Title','Details','Problem','Alternate','Importance','AppVersion','Geography',
  'UserName','UserContactDetails','IssueReproducedAtYourEnd','Requirement',
  'Solution','AcceptanceCriteria','UserStory','ProblemStatement',
]);

function formatFieldLabel(key) {
  // CamelCase → "Title Case With Spaces"
  return key
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .replace(/^./, s => s.toUpperCase())
    .replace('Issue Reproduced At Your End', 'Reproduced?');
}

function parseNotesFields(raw) {
  if (!raw || raw.length < 10) return null;

  let pairs = [];

  if (raw.includes('\n')) {
    // Real newline format: "FieldName\nValue\n\nNextField\nValue"
    const paragraphs = raw.split(/\n{2,}/);
    for (const para of paragraphs) {
      const lines = para.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) continue;
      if (lines.length >= 2 && KNOWN_FIELDS.has(lines[0])) {
        pairs.push({ label: lines[0], value: lines.slice(1).join(' ') });
      } else if (lines.length === 1 && KNOWN_FIELDS.has(lines[0])) {
        pairs.push({ label: lines[0], value: '' });
      } else {
        pairs.push({ label: null, value: lines.join(' ') });
      }
    }
  } else {
    // Space-compressed format (our notes_preview): double-space = paragraph break
    const chunks = raw.split(/\s{2,}/);
    for (const chunk of chunks) {
      const t = chunk.trim();
      if (!t) continue;
      const spaceIdx = t.indexOf(' ');
      if (spaceIdx === -1) {
        pairs.push(KNOWN_FIELDS.has(t)
          ? { label: t, value: '' }
          : { label: null, value: t });
      } else {
        const first = t.slice(0, spaceIdx);
        const rest  = t.slice(spaceIdx + 1).trim();
        pairs.push(KNOWN_FIELDS.has(first)
          ? { label: first, value: rest }
          : { label: null, value: t });
      }
    }
  }

  const knownCount = pairs.filter(p => p.label).length;
  return knownCount >= 2 ? pairs : null;
}

const FIELD_HIGHLIGHT = {
  Severity:          'text-rose-700 font-semibold',
  Importance:        'text-rose-700 font-semibold',
  ReasonOfSeverity:  'text-amber-700',
  Problem:           'text-amber-700',
  CompanyName:       'text-indigo-700 font-medium',
  ClientId:          'text-slate-500',
  ClientCategory:    'text-slate-500',
};

function NotesDisplay({ notes }) {
  if (!notes) return <p className="text-xs text-slate-400 italic">No description.</p>;

  const fields = parseNotesFields(notes);

  if (!fields) {
    // Fallback: plain text
    return <p className="text-sm text-slate-700 leading-relaxed">{notes}</p>;
  }

  return (
    <dl className="space-y-1.5">
      {fields.map((f, i) =>
        f.label ? (
          <div key={i} className="flex gap-3 text-sm">
            <dt className="w-40 shrink-0 text-xs font-semibold text-slate-500 uppercase tracking-wide pt-0.5">
              {formatFieldLabel(f.label)}
            </dt>
            <dd className={`flex-1 text-sm ${FIELD_HIGHLIGHT[f.label] || 'text-slate-800'}`}>
              {f.value || <span className="text-slate-400 italic">—</span>}
            </dd>
          </div>
        ) : (
          f.value ? (
            <div key={i} className="text-sm text-slate-600 pl-1 border-l-2 border-slate-200 ml-0.5">
              {f.value}
            </div>
          ) : null
        )
      )}
    </dl>
  );
}

// ---------------------------------------------------------------------------
// Extract every structured field from the notes_preview string
// ---------------------------------------------------------------------------
function extractTaskContext(notes) {
  const FIELDS = [
    'IssueTitle','Platform','Severity','ReasonOfSeverity','CompanyName','ClientId',
    'ClientCategory','IssueDescription','StepsToReproduce','ExpectedOutput','Title',
    'Details','Problem','Alternate','Importance','AppVersion','Geography','UserName',
    'UserContactDetails','IssueReproducedAtYourEnd','Requirement','Solution',
    'AcceptanceCriteria','UserStory','ProblemStatement',
  ];
  const ctx = {};
  FIELDS.forEach(f => {
    const m = notes.match(new RegExp(f + '\\s+(.{5,250}?)(?:\\s{2,}|$)'));
    if (m?.[1]) ctx[f] = m[1].trim().replace(/\s+/g, ' ').slice(0, 220);
  });
  // fallback: raw first 300 chars if no structured fields found
  if (Object.keys(ctx).length === 0 && notes.length > 10) {
    ctx._raw = notes.slice(0, 300).replace(/\s+/g, ' ');
  }
  return ctx;
}

function generateSmartDraft(task, _variant) {
  // _variant is passed by Regenerate to force different phrasing even for same task
  const v = typeof _variant === 'number' ? _variant : Math.floor(Math.random() * 4);

  const daysSinceUpdate = getDaysSincedUpdate(task.modified);
  const daysOverdueVal  = daysOverdue(task.due_on);
  const imp      = task.importance;
  const isCritical   = imp === 'x16' || imp === 'x8';
  const isVeryOld    = daysSinceUpdate > 180;
  const isDefect     = /defect|bug|error|fix|issue/i.test(task.name);
  const isDiscussion = /discussion|clarity|align|discuss/i.test(task.name);
  const isScoping    = task.section === 'Need to scope' && !isDefect;
  const isFeedback   = /feedback|fb/i.test(task.name);

  const daysToAdd  = imp === 'x16' ? 2 : imp === 'x8' ? 4 : 7;
  const nextDate   = new Date(TODAY_DATE);
  nextDate.setDate(nextDate.getDate() + daysToAdd);
  const nextDateStr = nextDate.toISOString().slice(0, 10);

  // ── Full context extraction ──────────────────────────────────────────────
  const notes = task.notes_preview || '';
  const ctx   = extractTaskContext(notes);

  const issueTitle   = ctx.IssueTitle   || task.name;
  const severity     = ctx.Severity     || imp;
  const reason       = ctx.ReasonOfSeverity || ctx.ProblemStatement || '';
  const company      = ctx.CompanyName  || task.client || '';
  const clientId     = ctx.ClientId     ? ` (ID: ${ctx.ClientId})` : '';
  const category     = ctx.ClientCategory ? ` · Category ${ctx.ClientCategory}` : '';
  const issueDesc    = ctx.IssueDescription || ctx.Details || ctx.Problem || ctx._raw || '';
  const steps        = ctx.StepsToReproduce || '';
  const expected     = ctx.ExpectedOutput   || '';
  const requirement  = ctx.Requirement      || ctx.UserStory || '';
  const solution     = ctx.Solution         || '';
  const appVersion   = ctx.AppVersion ? ` (App v${ctx.AppVersion})` : '';
  const geography    = ctx.Geography ? ` · Region: ${ctx.Geography}` : '';

  const clientText   = company || (task.platform !== 'General' ? task.platform : 'the team');
  const platformText = task.platform !== 'General' ? ` on ${task.platform}` : '';
  const followerNote = task.follower_count > 10 ? ` (${task.follower_count} stakeholders watching)` : '';

  // Context block that appears in every draft template
  const contextBlock = [
    `📌 Task: ${issueTitle}`,
    company     ? `🏢 Client: ${company}${clientId}${category}` : null,
    severity    ? `⚠️  Severity: ${severity}` : null,
    reason      ? `💡 Root cause / reason: ${reason.slice(0, 160)}` : null,
    issueDesc   ? `📝 Description: ${issueDesc.slice(0, 200)}` : null,
    steps       ? `🔁 Steps to reproduce: ${steps.slice(0, 120)}` : null,
    expected    ? `✅ Expected output: ${expected.slice(0, 120)}` : null,
    requirement ? `📋 Requirement: ${requirement.slice(0, 160)}` : null,
    solution    ? `🛠  Proposed solution: ${solution.slice(0, 160)}` : null,
    appVersion || geography ? `🗺  ${[appVersion, geography].filter(Boolean).join(' ')}` : null,
  ].filter(Boolean).join('\n');

  // Defer: top 2 most-recently-modified P0/P1 tasks (most live context for trade-off)
  const criticalTasksList = ASANA_TASKS
    .filter(t => t.gid !== task.gid && ['P0', 'P1'].includes(t.priority))
    .sort((a, b) => new Date(b.modified) - new Date(a.modified))
    .slice(0, 2)
    .map(t => `  • "${t.name.slice(0, 70)}${t.name.length > 70 ? '…' : ''}" [${t.priority}] — last updated ${getDaysSincedUpdate(t.modified)}d ago`)
    .join('\n');

  const pbiPlaceholder = `[Link: dev.azure.com/flick2know/_workitems/edit/XXXX — add before sending]`;
  const followUpLine   = `📅 Next follow-up: ${nextDateStr} | Owner: Harsh Pal`;

  // Variant openers so Regenerate produces visibly different text
  const acceptOpen = [
    'Taking this on.',
    'Acknowledged and picking this up.',
    'Moving forward on this.',
    'On it.',
  ][v % 4];

  const deferOpen = [
    'Giving a direct answer rather than leaving this silent.',
    'I want to be transparent about the current priority conflict.',
    'Rather than keeping this open without a response, here is where things stand.',
    'Providing a structured response instead of silence.',
  ][v % 4];

  let draft = '';

  // ── Template selection ───────────────────────────────────────────────────

  if (isScoping) {
    draft =
`SCOPING NEEDED: Before committing a sprint slot I need clarity on the points below${followerNote}. Once aligned I can size and schedule this correctly.

── Context on file ──────────────────────────────────
${contextBlock || '  (No structured notes found — please add context to the Asana task)'}

── Requirement Clarity needed ───────────────────────
  • What is the expected behavior vs. current behavior${platformText}${appVersion}?
  • Which ${clientText} users/flows are impacted and at what scale${geography}?
  • Is this blocking a live customer flow or requesting a new capability?
  • What is the acceptance criteria for this to be considered done?
  • What is the business impact if not resolved by ${nextDateStr}?
  • Does this map to an existing Azure PBI or sprint milestone?

🔗 Azure PBI: ${pbiPlaceholder}

${followUpLine}`;

  } else if (isVeryOld && !isCritical) {
    draft =
`DEFER: ${deferOpen} This has been open ${daysOverdueVal > 0 ? `${daysOverdueVal} days` : 'for an extended period'}${platformText}${followerNote}.

── Task context ─────────────────────────────────────
${contextBlock || '  (No structured notes — see Asana task for details)'}

── Current priority conflict ────────────────────────
To slot this now, I'd need to deprioritize one of these active items (most recently in-flight):
${criticalTasksList || '  • [Current active P0/P1 sprint items — check Asana]'}

Help me understand the current impact so I can make the right trade-off. I'm not closing this — I need clarity to slot it correctly.

── What I need to move forward ──────────────────────
  • Is this still blocking a live customer flow?
  • Has the urgency or scope changed since it was raised?
  • Can we agree on a grooming review by ${nextDateStr}?

🔗 Azure PBI: ${pbiPlaceholder}

${followUpLine}`;

  } else if (isDefect && isCritical) {
    draft =
`ACCEPT: ${acceptOpen} This is a ${severity} severity defect${platformText}${followerNote} and needs immediate sprint action.

── Full task context ────────────────────────────────
${contextBlock || '  (No structured notes — see Asana task for full details)'}

── Action plan ──────────────────────────────────────
  • Defect confirmed${platformText ? ' on ' + task.platform : ''}${appVersion}${geography}
  • Client: ${clientText}${clientId}${category}
  • Root cause on file: ${reason.slice(0, 120) || 'As described above'}
  • I'll assign a dev owner and confirm fix ETA by ${nextDateStr}
  • Will post sprint ticket link in this thread once raised

🔗 Azure PBI: ${pbiPlaceholder}

${followUpLine}`;

  } else if (isDefect) {
    draft =
`ACCEPT: ${acceptOpen} Acknowledging this defect${platformText}${followerNote}.

── Full task context ────────────────────────────────
${contextBlock || '  (No structured notes — see Asana task for full details)'}

── Scoping notes ────────────────────────────────────
  • Platform: ${task.platform}${appVersion} · Client: ${clientText}${category}
  • Steps to reproduce: ${steps || 'Documented in task'}
  • Expected output: ${expected || 'As described in task notes'}
  • I'll scope this and get a dev owner confirmed for next sprint
  • ETA to be shared in thread by ${nextDateStr}

🔗 Azure PBI: ${pbiPlaceholder}

${followUpLine}`;

  } else if (isFeedback || isDiscussion) {
    draft =
`ACCEPT: ${acceptOpen} Reviewing the feedback / discussion point${platformText}${followerNote}.

── Full task context ────────────────────────────────
${contextBlock || '  (No structured notes — see Asana task for full details)'}

── Discussion plan ──────────────────────────────────
  • Scheduling a structured discussion with the right stakeholders
  • Agenda: problem alignment → options → decision criteria → owner
  • Will come back with a concrete decision — not just a conversation
  • Outcome and follow-up action to be posted by ${nextDateStr}

🔗 Azure PBI: ${pbiPlaceholder}

${followUpLine}`;

  } else if (isCritical) {
    draft =
`ACCEPT: ${acceptOpen} ${severity || imp} priority item${platformText}${followerNote}.

── Full task context ────────────────────────────────
${contextBlock || '  (No structured notes — see Asana task for full details)'}

── Commitment ───────────────────────────────────────
  • Client: ${clientText}${clientId}${category}
  • Platform: ${task.platform}${appVersion}${geography}
  • Driving to sprint scheduling — dev owner to be confirmed by ${nextDateStr}
  • Help me understand the impact scale so I can slot this against current P0s accurately
  • Will post requirement doc + sprint slot confirmation in thread

🔗 Azure PBI: ${pbiPlaceholder}

${followUpLine}`;

  } else {
    draft =
`ACCEPT: ${acceptOpen}${platformText}${followerNote}.

── Full task context ────────────────────────────────
${contextBlock || '  (No structured notes — see Asana task for full details)'}

── Next steps ───────────────────────────────────────
  • Platform: ${task.platform}${appVersion} · Client: ${clientText}${category}
  • Effort sizing to be confirmed with dev team
  • Sprint slot and owner to be confirmed by ${nextDateStr}
  • Will post confirmation in this thread

🔗 Azure PBI: ${pbiPlaceholder}

${followUpLine}`;
  }

  return draft;
}

function TaskRow({ task, expanded, onToggle, sourceSection }) {
  const [draft, setDraft] = React.useState('');
  const [showDraft, setShowDraft] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [edited, setEdited] = React.useState(false);
  const [variantIdx, setVariantIdx] = React.useState(0);
  const textareaRef = useRef(null);

  const overdue = isOverdue(task.due_on);
  const daysOverdueVal = overdue ? daysOverdue(task.due_on) : 0;
  const daysSilent = getDaysSincedUpdate(task.modified);
  const imp = getImportanceChip(task.importance);
  const riskColor = getRiskColor(task.importance);

  const generateDraft = useCallback((vIdx) => {
    try {
      const generated = generateSmartDraft(task, vIdx ?? variantIdx);
      setDraft(generated);
      setEdited(false);
    } catch (err) {
      setDraft(`[Draft error: ${err.message} — please try Regenerate]`);
    }
  }, [task, variantIdx]);

  const regenerateDraft = useCallback(() => {
    const next = variantIdx + 1;
    setVariantIdx(next);
    try {
      const generated = generateSmartDraft(task, next);
      setDraft(generated);
      setEdited(false);
    } catch (err) {
      setDraft(`[Draft error: ${err.message}]`);
    }
  }, [task, variantIdx]);

  const handleDraftChange = (e) => {
    setDraft(e.target.value);
    setEdited(true);
  };

  const copyToClipboard = useCallback(() => {
    // Try modern clipboard API first; fall back to execCommand for iframe sandboxes
    const doFallbackCopy = (text) => {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;';
      document.body.appendChild(el);
      el.focus();
      el.select();
      try { document.execCommand('copy'); } catch (_) {}
      document.body.removeChild(el);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(draft).catch(() => doFallbackCopy(draft));
    } else {
      doFallbackCopy(draft);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [draft]);

  const urgency = getUrgencyLevel(task);
  const chaseRisk = isChaseRisk(task.notes_preview);
  const missingPBI = isMissingPBI(task);

  // Left border reflects worst urgency condition
  const borderClass =
    urgency === 'critical' || (overdue && daysSilent >= 3) ? 'border-l-4 border-l-red-500' :
    urgency === 'overdue'  ? 'border-l-4 border-l-rose-400' :
    urgency === 'due-today'? 'border-l-4 border-l-amber-400' :
    urgency === 'stale'    ? 'border-l-4 border-l-yellow-300' :
    task.priority === 'P0' ? 'border-l-4 border-l-rose-600' : '';

  return (
    <div className={`bg-white rounded-lg border border-slate-200 shadow-sm mb-3 ${borderClass}`}>
      <button
        onClick={() => onToggle(task.gid)}
        className="w-full text-left p-4 flex items-center gap-3 hover:bg-slate-50 transition"
      >
        <div className={`w-3 h-3 rounded-full bg-${riskColor}-400 flex-shrink-0`}></div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">{task.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            {task.client && <span className="text-xs text-slate-500">{task.client}</span>}
            {/* Show original Kanban section when task is displayed in an urgency section */}
            {URGENCY_SECTIONS.includes(sourceSection) && task.section && (
              <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-medium">
                ← {task.section}
              </span>
            )}
            {/* Chase Risk Alert */}
            {chaseRisk && (
              <span className="flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded-full font-bold border border-orange-200">
                🔥 HIGH CHASE RISK
              </span>
            )}
            {/* Missing PBI Alert */}
            {missingPBI && (
              <span className="flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 bg-red-100 text-red-800 rounded-full font-bold border border-red-200">
                ❌ Missing PBI
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${imp.color}`}>{imp.label}</span>
          <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-full font-medium">{task.platform}</span>

          {overdue && (
            <span className="text-xs px-2 py-1 bg-rose-100 text-rose-800 rounded-full font-medium">
              {daysOverdueVal}d overdue
            </span>
          )}

          {/* SLA Response Timer — tiered by staleness */}
          {daysSilent === 0 ? (
            <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 font-medium">✓ Updated today</span>
          ) : daysSilent >= 3 ? (
            <span className="flex items-center gap-1 text-xs px-2 py-1 bg-red-50 text-red-700 rounded-full border border-red-200 font-semibold">
              <Clock size={11} /> Response Needed · {daysSilent}d
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100 font-medium">
              <Clock size={11} /> {daysSilent}d silent
            </span>
          )}
        </div>

        {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 bg-indigo-50/20">
          <div className="mb-4 bg-white border border-slate-100 rounded-lg p-4">
            <NotesDisplay notes={task.notes_preview} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs mb-4 text-slate-600">
            <div><span className="font-medium">Created:</span> {task.created}</div>
            <div><span className="font-medium">Updated:</span> {task.modified}</div>
            <div><span className="font-medium">Followers:</span> {task.follower_count}</div>
            <div><span className="font-medium">Subtasks:</span> {task.num_subtasks}</div>
          </div>

          <div className="flex gap-2 mb-4">
            <a
              href={task.asana_url || `https://app.asana.com/1/34125054317482/task/${task.gid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-2 text-xs bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-medium transition"
            >
              <ExternalLink size={14} /> Asana
            </a>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!showDraft) generateDraft(0); // always generate fresh on first open
                setShowDraft(v => !v);
              }}
              className="flex items-center gap-1 px-3 py-2 text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded font-medium transition"
            >
              <Sparkles size={14} /> {showDraft ? 'Hide Draft' : 'Draft'}
            </button>
          </div>

          {showDraft && (
            <div className="bg-white border border-slate-200 rounded p-3">
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={handleDraftChange}
                className="w-full h-56 text-xs font-mono p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{draft.length} chars</span>
                  {edited && <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded font-medium">edited</span>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); regenerateDraft(); }}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-medium transition"
                  >
                    <RefreshCw size={12} /> Regenerate
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded font-medium transition"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-600 flex items-center gap-2">
                <Check size={12} className="text-green-600" />
                Commitment Guardrail · cites task context · PBI placeholder · dated owner
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CST Priority View — shows Platinum + Gold sprint tasks matched to Asana data
// ---------------------------------------------------------------------------
function PriorityView() {
  const statusColor = (s = '') => {
    if (/taken up/i.test(s))   return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (/testing|release/i.test(s)) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (/hold/i.test(s))       return 'bg-amber-50 text-amber-700 border-amber-200';
    if (/blocked/i.test(s))    return 'bg-red-50 text-red-700 border-red-200';
    if (/not taken/i.test(s))  return 'bg-slate-100 text-slate-600 border-slate-200';
    if (/discussion/i.test(s)) return 'bg-purple-50 text-purple-700 border-purple-200';
    return 'bg-slate-50 text-slate-600 border-slate-200';
  };

  const PriorityRow = ({ pTask }) => {
    const asanaTask = ASANA_GID_MAP[pTask.gid];
    const daysSilent  = asanaTask ? getDaysSincedUpdate(asanaTask.modified) : null;
    const overdue     = asanaTask ? isOverdue(asanaTask.due_on) : false;
    const overduedays = overdue ? daysOverdue(asanaTask.due_on) : 0;
    const chipLabel   = pTask.source === 'Platinum' ? pTask.cstPriority : `#${pTask.cstRank}`;
    const chipColor   = pTask.source === 'Platinum'
      ? (pTask.cstPriority === 'P1' ? 'bg-rose-100 text-rose-800' : pTask.cstPriority === 'P2' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600')
      : (pTask.cstRank <= 5 ? 'bg-rose-100 text-rose-800' : pTask.cstRank <= 12 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600');

    return (
      <div className="bg-white border border-slate-200 rounded-lg p-3 mb-2 shadow-sm hover:shadow-md transition">
        <div className="flex items-start gap-3">
          <span className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 mt-0.5 ${chipColor}`}>{chipLabel}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 leading-snug">{pTask.name}</p>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <span className="text-xs text-slate-500 font-medium">{pTask.client}</span>
              {pTask.csm && <span className="text-xs px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-100">CSM: {pTask.csm}</span>}
              {pTask.delivery && <span className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">📅 {pTask.delivery}</span>}
              {pTask.status && <span className={`text-xs px-1.5 py-0.5 rounded border ${statusColor(pTask.status)}`}>{pTask.status}</span>}
              {overdue && <span className="text-xs px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded font-semibold border border-rose-200">{overduedays}d overdue</span>}
              {daysSilent >= 3 && <span className="text-xs px-1.5 py-0.5 bg-red-50 text-red-700 rounded border border-red-100">⏱ {daysSilent}d silent</span>}
              {asanaTask?.section && <span className="text-xs px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded border border-slate-200">← {asanaTask.section}</span>}
              {!asanaTask && <span className="text-xs px-1.5 py-0.5 bg-yellow-50 text-yellow-700 rounded border border-yellow-200">⚠ Not in your Asana board</span>}
            </div>
          </div>
          <a href={asanaTask?.asana_url || pTask.asana_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium transition shrink-0">
            <ExternalLink size={12} /> Asana
          </a>
        </div>
      </div>
    );
  };

  const SectionHeader = ({ title, subtitle, link, color }) => (
    <div className="flex items-center gap-2 mb-3 mt-6 first:mt-0">
      <div className={`h-4 w-1 rounded ${color}`}></div>
      <h3 className="text-sm font-bold text-slate-700">{title}</h3>
      <span className="text-xs text-slate-400">{subtitle}</span>
      <a href={link} target="_blank" rel="noopener noreferrer"
        className="ml-auto flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 transition">
        <ExternalLink size={11} /> Open Sheet
      </a>
    </div>
  );

  return (
    <div>
      <SectionHeader
        title="Platinum Sprint Priority"
        subtitle={`— SFA ${CURRENT_SPRINT_MONTH}`}
        link="https://docs.google.com/spreadsheets/d/1RLilJuHaJM2C_1a2wM-4JuOIYW0UabonBfIdcRxNXM8/edit"
        color="bg-indigo-500"
      />
      {PLATINUM_PRIORITY.map(p => <PriorityRow key={p.gid} pTask={p} />)}

      <SectionHeader
        title="Gold Sprint Priority"
        subtitle={`— SFA ${CURRENT_SPRINT_MONTH}`}
        link="https://docs.google.com/spreadsheets/d/1I0YOJ7iF-YH28Xjxw3Uq4aXO3Wm82FB4BXmMIFlgjUs/edit"
        color="bg-amber-500"
      />
      {GOLD_PRIORITY.map(p => <PriorityRow key={p.gid} pTask={p} />)}
    </div>
  );
}

function PMPerformanceDashboard() {
  // Live tasks state — fetched from Asana API on mount
  const [tasks, setTasks]         = React.useState([]);
  const [loading, setLoading]     = React.useState(true);
  const [fetchError, setFetchError] = React.useState(null);
  const [lastSynced, setLastSynced] = React.useState(null);

  React.useEffect(() => {
    const load = () => {
      setLoading(true);
      fetch('/api/tasks')
        .then(r => { if (!r.ok) throw new Error(`API error ${r.status}`); return r.json(); })
        .then(data => {
          setTasks(data);
          setLastSynced(new Date().toLocaleTimeString());
          setLoading(false);
        })
        .catch(err => {
          setFetchError(err.message);
          setLoading(false);
        });
    };
    load();
  }, []);

  // Live ASANA_GID_MAP derived from tasks state
  const ASANA_GID_MAP = React.useMemo(
    () => Object.fromEntries(tasks.map(t => [t.gid, t])),
    [tasks]
  );

  const [expandedTask, setExpandedTask]         = React.useState(null);
  const [activeTab, setActiveTab]               = React.useState('all');       // 'all' | 'assigned' | 'collaborating' | 'priority'
  const [searchText, setSearchText]             = React.useState('');
  const [activeSection, setActiveSection]       = React.useState("Need to discuss - Kanban");
  const [urgencyFilters, setUrgencyFilters]     = React.useState([]);          // [] | ['overdue'] | ['due-today'] | ['stale'] | combo
  const [kanbanSectionFilter, setKanbanFilter]  = React.useState('all');       // Asana section sub-filter when urgency active

  const toggleUrgencyFilter = (f) => {
    setUrgencyFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
    setExpandedTask(null);
  };

  const totalTasks       = tasks.length;
  const overdueTasks     = tasks.filter(t => isOverdue(t.due_on)).length;
  const dueTodayCount    = tasks.filter(t => isDueToday(t.due_on)).length;
  const staleTasks       = tasks.filter(t => getDaysSincedUpdate(t.modified) >= 3).length;
  const highPriorityTasks = tasks.filter(t => ['P0', 'P1'].includes(t.priority)).length;

  // Engagement Rate: % of tasks updated in the last 24h (daysSilent === 0)
  const updatedToday     = tasks.filter(t => getDaysSincedUpdate(t.modified) === 0).length;
  const engagementRate   = Math.round((updatedToday / totalTasks) * 100);

  // Loop Closure Rate: % of Groomed / Taken up tasks that have a PBI link
  const activeDevTasks   = tasks.filter(t => t.section === 'Groomed - Kanban' || t.section === 'Taken up - Kanban');
  const tasksWithPBI     = activeDevTasks.filter(t => (t.notes_preview || '').toLowerCase().includes('dev.azure.com')).length;
  const loopClosureRate  = activeDevTasks.length > 0 ? Math.round((tasksWithPBI / activeDevTasks.length) * 100) : 0;

  // Chase Risk count
  const chaseRiskCount   = tasks.filter(t => isChaseRisk(t.notes_preview)).length;

  // Live Performance Score — weighted composite
  const computeQualityScore = () => {
    const overdueScore     = Math.max(0, 10 - (overdueTasks / totalTasks) * 50);
    const slaScore         = Math.max(0, 10 - (staleTasks / totalTasks) * 20);
    const closureScore     = loopClosureRate / 10;
    const chaseScore       = Math.max(0, 10 - chaseRiskCount * 1.5);
    const weighted = overdueScore * 0.35 + slaScore * 0.30 + closureScore * 0.20 + chaseScore * 0.15;
    return weighted.toFixed(1);
  };

  const qualityScore = parseFloat(computeQualityScore());
  const getQualityLabel = (score) => {
    if (score >= 7) return { label: 'Healthy', color: 'text-emerald-600' };
    if (score >= 5) return { label: 'Needs Attention', color: 'text-amber-600' };
    return { label: 'Critical', color: 'text-red-600' };
  };
  const qualityMeta = getQualityLabel(qualityScore);

  // Base filter: search text only (P0/P1/Overdue pills removed)
  const filteredTasks = tasks.filter(t =>
    !searchText || t.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Urgency cross-section view — applies when any urgency filter toggle is active
  const urgencyViewTasks = useMemo(() => {
    if (urgencyFilters.length === 0) return [];
    return filteredTasks
      .filter(t => {
        const ov = isOverdue(t.due_on) || getDaysSincedUpdate(t.modified) > 365;
        const dt = isDueToday(t.due_on);
        const st = getDaysSincedUpdate(t.modified) >= 3;
        return (urgencyFilters.includes('overdue') && ov) ||
               (urgencyFilters.includes('due-today') && dt) ||
               (urgencyFilters.includes('stale') && st);
      })
      .filter(t => kanbanSectionFilter === 'all' || (t.section || 'Recently assigned') === kanbanSectionFilter)
      .sort((a, b) => {
        // Sort: overdue worst-first, then stale longest-first
        const aOv = daysOverdue(a.due_on); const bOv = daysOverdue(b.due_on);
        if (bOv !== aOv) return bOv - aOv;
        return getDaysSincedUpdate(b.modified) - getDaysSincedUpdate(a.modified);
      });
  }, [filteredTasks, urgencyFilters, kanbanSectionFilter]);

  // Standard section grouping (tasks always in their Kanban section)
  const tasksBySection = useMemo(() => {
    const groups = {};
    SECTION_ORDER.forEach(s => groups[s] = []);
    filteredTasks.forEach(t => {
      const sec = t.section || 'Recently assigned';
      if (groups[sec] !== undefined) groups[sec].push(t);
      else groups['Recently assigned'].push(t);
    });
    groups['Defect & Bug'] = filteredTasks.filter(isDefectOrBug);
    return groups;
  }, [filteredTasks]);

  if (loading) return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-slate-600 font-medium">Loading your Asana tasks...</p>
      </div>
    </div>
  );

  if (fetchError) return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <p className="text-red-600 font-semibold mb-2">Failed to load tasks</p>
        <p className="text-slate-500 text-sm mb-4">{fetchError}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">Retry</button>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">PM Performance</h1>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
              <Zap size={14} className="text-amber-500" /> Live · 100+ tasks
            </p>
          </div>
        </div>

        {/* ── Live Performance Scoreboard ─────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={16} className="text-indigo-500" />
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Live Performance Score</span>
            <span className="ml-auto text-[11px] text-slate-400">Audit baseline: 3/10 · Target: 7/10</span>
          </div>
          <div className="flex items-end gap-6 mb-4">
            <div>
              <p className={`text-5xl font-black ${qualityMeta.color}`}>{qualityScore}</p>
              <p className="text-xs text-slate-400 mt-1">/ 10</p>
            </div>
            <div className="flex-1 mb-1">
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all ${qualityScore >= 7 ? 'bg-emerald-400' : qualityScore >= 5 ? 'bg-amber-400' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(100, qualityScore * 10)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0 · Critical</span><span>5 · Needs attention</span><span>10 · Healthy</span>
              </div>
            </div>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${qualityScore >= 7 ? 'bg-emerald-100 text-emerald-700' : qualityScore >= 5 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
              {qualityMeta.label}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Engagement Rate</p>
              <p className={`text-xl font-bold mt-1 ${engagementRate >= 30 ? 'text-emerald-600' : 'text-red-600'}`}>{engagementRate}%</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{updatedToday} tasks updated today</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Loop Closure Rate</p>
              <p className={`text-xl font-bold mt-1 ${loopClosureRate >= 60 ? 'text-emerald-600' : 'text-amber-600'}`}>{loopClosureRate}%</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{tasksWithPBI}/{activeDevTasks.length} dev tasks have PBI</p>
            </div>
            <div
              className={`bg-slate-50 rounded-lg p-3 border cursor-pointer transition ${urgencyFilters.includes('stale') ? 'border-orange-400 bg-orange-50' : 'border-slate-100 hover:bg-orange-50 hover:border-orange-200'}`}
              onClick={() => toggleUrgencyFilter('stale')}
            >
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Chase Risk Tasks</p>
              <p className={`text-xl font-bold mt-1 ${chaseRiskCount > 3 ? 'text-red-600' : 'text-orange-600'}`}>{chaseRiskCount}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">🔥 flagged for follow-up chasing</p>
            </div>
            <div
              className={`bg-slate-50 rounded-lg p-3 border cursor-pointer transition ${urgencyFilters.includes('overdue') ? 'border-rose-400 bg-rose-50' : 'border-slate-100 hover:bg-rose-50 hover:border-rose-200'}`}
              onClick={() => toggleUrgencyFilter('overdue')}
            >
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Overdue Tasks</p>
              <p className="text-xl font-bold mt-1 text-rose-600">{overdueTasks}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Click → filter Overdue tasks</p>
            </div>
          </div>
        </div>

        {/* ── Today's Focus Alert Strip ────────────────────────────────────── */}
        {(overdueTasks > 0 || dueTodayCount > 0 || staleTasks > 0) && (
          <div className="flex gap-3 mb-6">
            {overdueTasks > 0 && (
              <button
                onClick={() => toggleUrgencyFilter('overdue')}
                className={`flex-1 flex items-center gap-3 rounded-xl p-3 transition text-left border ${urgencyFilters.includes('overdue') ? 'bg-red-100 border-red-400 ring-2 ring-red-300' : 'bg-red-50 border-red-200 hover:bg-red-100'}`}
              >
                <ShieldAlert size={20} className="text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-red-800">{overdueTasks} Overdue {urgencyFilters.includes('overdue') && '✓'}</p>
                  <p className="text-xs text-red-600">Past due — immediate response</p>
                </div>
              </button>
            )}
            {dueTodayCount > 0 && (
              <button
                onClick={() => toggleUrgencyFilter('due-today')}
                className={`flex-1 flex items-center gap-3 rounded-xl p-3 transition text-left border ${urgencyFilters.includes('due-today') ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-300' : 'bg-amber-50 border-amber-200 hover:bg-amber-100'}`}
              >
                <Target size={20} className="text-amber-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-amber-800">{dueTodayCount} Due Today {urgencyFilters.includes('due-today') && '✓'}</p>
                  <p className="text-xs text-amber-600">Respond before EOD</p>
                </div>
              </button>
            )}
            {staleTasks > 0 && (
              <button
                onClick={() => toggleUrgencyFilter('stale')}
                className={`flex-1 flex items-center gap-3 rounded-xl p-3 transition text-left border ${urgencyFilters.includes('stale') ? 'bg-yellow-100 border-yellow-400 ring-2 ring-yellow-300' : 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'}`}
              >
                <Clock size={20} className="text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-yellow-800">{staleTasks} Silent 3d+ {urgencyFilters.includes('stale') && '✓'}</p>
                  <p className="text-xs text-yellow-700">High chase risk — respond now</p>
                </div>
              </button>
            )}
          </div>
        )}

        {/* ── KPI Summary Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Total Tasks</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{totalTasks}</p>
          </div>
          <div
            className={`bg-white rounded-xl border shadow-sm p-4 cursor-pointer transition ${urgencyFilters.includes('overdue') ? 'border-rose-400 bg-rose-50 ring-2 ring-rose-200' : 'border-slate-200 hover:border-rose-300'}`}
            onClick={() => toggleUrgencyFilter('overdue')}
          >
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Overdue</p>
            <p className="text-2xl font-bold text-rose-600 mt-2">{overdueTasks}</p>
          </div>
          <div
            className={`bg-white rounded-xl border shadow-sm p-4 cursor-pointer transition ${urgencyFilters.includes('due-today') ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-200' : 'border-slate-200 hover:border-amber-300'}`}
            onClick={() => toggleUrgencyFilter('due-today')}
          >
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Due Today</p>
            <p className="text-2xl font-bold text-amber-600 mt-2">{dueTodayCount}</p>
          </div>
          <div
            className={`bg-white rounded-xl border shadow-sm p-4 cursor-pointer transition ${urgencyFilters.includes('stale') ? 'border-yellow-400 bg-yellow-50 ring-2 ring-yellow-200' : 'border-slate-200 hover:border-yellow-300'}`}
            onClick={() => toggleUrgencyFilter('stale')}
          >
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Silent 3d+</p>
            <p className="text-2xl font-bold text-yellow-600 mt-2">{staleTasks}</p>
          </div>
        </div>

        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-full font-medium text-sm transition ${activeTab === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
          >
            All Tasks
          </button>
          <button
            onClick={() => setActiveTab('assigned')}
            className={`px-4 py-1.5 rounded-full font-medium text-sm transition ${activeTab === 'assigned' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
          >
            Assigned to Me
          </button>
          <button
            onClick={() => setActiveTab('collaborating')}
            className={`px-4 py-1.5 rounded-full font-medium text-sm transition ${activeTab === 'collaborating' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
          >
            Collaborating
          </button>
          <button
            onClick={() => { setActiveTab('priority'); setUrgencyFilters([]); setExpandedTask(null); }}
            className={`px-4 py-1.5 rounded-full font-medium text-sm transition ${activeTab === 'priority' ? 'bg-indigo-700 text-white' : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'}`}
          >
            🎯 CST Priority
          </button>
        </div>

        {activeTab === 'collaborating' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <MessageSquare size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">77 tasks found where you're a follower — these require individual task lookups.</p>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
          <div className="flex gap-2 flex-wrap items-center">
            {/* Urgency toggle pills */}
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mr-1">Filter:</span>
            <button
              onClick={() => toggleUrgencyFilter('overdue')}
              className={`px-3 py-1 text-xs rounded-full font-medium transition flex items-center gap-1 ${urgencyFilters.includes('overdue') ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'}`}
            >
              🔴 Overdue
              {urgencyFilters.includes('overdue') && <span className="ml-1 font-bold">×</span>}
            </button>
            <button
              onClick={() => toggleUrgencyFilter('due-today')}
              className={`px-3 py-1 text-xs rounded-full font-medium transition flex items-center gap-1 ${urgencyFilters.includes('due-today') ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'}`}
            >
              🟡 Due Today
              {urgencyFilters.includes('due-today') && <span className="ml-1 font-bold">×</span>}
            </button>
            <button
              onClick={() => toggleUrgencyFilter('stale')}
              className={`px-3 py-1 text-xs rounded-full font-medium transition flex items-center gap-1 ${urgencyFilters.includes('stale') ? 'bg-yellow-500 text-white' : 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100'}`}
            >
              ⏰ Stale 3d+
              {urgencyFilters.includes('stale') && <span className="ml-1 font-bold">×</span>}
            </button>
            {urgencyFilters.length > 0 && (
              <button
                onClick={() => { setUrgencyFilters([]); setKanbanFilter('all'); }}
                className="px-3 py-1 text-xs rounded-full font-medium text-slate-500 border border-slate-200 hover:bg-slate-100 transition"
              >
                Clear filters
              </button>
            )}
            <div className="flex-1"></div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Kanban section sub-filter — visible only when urgency filter active */}
          {urgencyFilters.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-3 pt-3 border-t border-slate-100 items-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mr-1">Section:</span>
              <button
                onClick={() => setKanbanFilter('all')}
                className={`px-3 py-1 text-xs rounded-full font-medium transition ${kanbanSectionFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                All sections ({urgencyViewTasks.length})
              </button>
              {SECTION_ORDER.map(sec => {
                const count = urgencyViewTasks.filter(t => (t.section || 'Recently assigned') === sec).length;
                if (count === 0) return null;
                const meta = SECTION_META[sec] || { emoji: '📋' };
                return (
                  <button
                    key={sec}
                    onClick={() => setKanbanFilter(sec)}
                    className={`px-3 py-1 text-xs rounded-full font-medium transition flex items-center gap-1 ${kanbanSectionFilter === sec ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {meta.emoji} {sec} <span className="font-bold">({count})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Conditional rendering: Priority / Urgency filter / Standard Kanban ── */}
        {activeTab === 'priority' ? (
          <PriorityView />
        ) : urgencyFilters.length > 0 ? (
          /* Urgency cross-section view */
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-slate-700">
                {urgencyViewTasks.length} task{urgencyViewTasks.length !== 1 ? 's' : ''} matching urgency filter
              </span>
              <span className="text-xs text-slate-400">
                {urgencyFilters.map(f => f === 'overdue' ? '🔴 Overdue' : f === 'due-today' ? '🟡 Due Today' : '⏰ Stale 3d+').join(' + ')}
              </span>
            </div>
            <div className="space-y-2">
              {urgencyViewTasks.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
                  No tasks match these urgency filters.
                </div>
              ) : (
                urgencyViewTasks.map(task => (
                  <TaskRow
                    key={task.gid}
                    task={task}
                    expanded={expandedTask === task.gid}
                    onToggle={() => setExpandedTask(expandedTask === task.gid ? null : task.gid)}
                    sourceSection={task.section || 'Recently assigned'}
                  />
                ))
              )}
            </div>
          </div>
        ) : (
          /* Standard Kanban section tab bar */
          <>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
              <div className="flex overflow-x-auto scrollbar-hide border-b border-slate-100">
                {SECTION_ORDER.map(section => {
                  const sectionTasks = tasksBySection[section] || [];
                  const meta = SECTION_META[section] || { emoji: "📋" };
                  const isActive = activeSection === section;
                  const overdueCount = sectionTasks.filter(t => isOverdue(t.due_on)).length;
                  const dueTodaySectionCount = sectionTasks.filter(t => isDueToday(t.due_on)).length;
                  return (
                    <button
                      key={section}
                      onClick={() => { setActiveSection(section); setExpandedTask(null); }}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap
                        ${isActive
                          ? 'border-indigo-500 text-indigo-700 bg-indigo-50/50'
                          : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                    >
                      <span>{meta.emoji}</span>
                      <span>{section}</span>
                      <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ml-0.5
                        ${isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                        {sectionTasks.length}
                      </span>
                      {overdueCount > 0 && (
                        <span className="text-[10px] font-medium bg-rose-50 text-rose-500 px-1 py-0.5 rounded-full">⚠{overdueCount}</span>
                      )}
                      {dueTodaySectionCount > 0 && !overdueCount && (
                        <span className="text-[10px] font-medium bg-amber-50 text-amber-500 px-1 py-0.5 rounded-full">📅</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Active section description */}
              {(() => {
                const meta = SECTION_META[activeSection] || {};
                const sectionTasks = tasksBySection[activeSection] || [];
                const overdueCount = sectionTasks.filter(t => isOverdue(t.due_on)).length;
                return (
                  <div className="px-4 py-2 flex items-center justify-between bg-slate-50/60 border-b border-slate-100">
                    <p className="text-xs text-slate-500">{meta.desc}</p>
                    <div className="flex items-center gap-2">
                      {overdueCount > 0 && (
                        <span className="text-[11px] font-medium text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                          {overdueCount} overdue
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400">{sectionTasks.length} tasks</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Tasks for active section */}
            <div className="space-y-2">
              {(tasksBySection[activeSection] || []).length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
                  No tasks in this section.
                </div>
              ) : (
                (tasksBySection[activeSection] || []).map(task => (
                  <TaskRow
                    key={task.gid}
                    task={task}
                    expanded={expandedTask === task.gid}
                    onToggle={() => setExpandedTask(expandedTask === task.gid ? null : task.gid)}
                    sourceSection={task.section || 'Recently assigned'}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PMPerformanceDashboard;
