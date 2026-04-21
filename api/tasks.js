// Vercel Serverless Function — Live Asana sync
// Fetches tasks WITH correct sections by querying the user task list sections directly
// Requires: ASANA_PAT environment variable in Vercel project settings

const WORKSPACE_GID = '34125054317482';
const BASE = 'https://app.asana.com/api/1.0';

async function asana(pat, path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${pat}`, Accept: 'application/json' }
  });
  if (!res.ok) throw new Error(`Asana ${path} → ${res.status} ${res.statusText}`);
  return res.json();
}

// Parse structured notes (Platform, Severity, CompanyName etc.)
function parseNotes(notes = '') {
  const get = (label) => {
    const m = notes.match(new RegExp(label + '\\s*\\n\\s*([^\\n]+)', 'i'));
    return m ? m[1].trim() : null;
  };
  return {
    platform: get('Platform') || 'General',
    severity: get('Severity') || get('Importance') || null,
    client:   get('CompanyName') || get('Client') || '',
  };
}

function toPriority(sev = '', tags = []) {
  const all = [sev, ...tags].join(' ').toLowerCase();
  if (all.includes('x16')) return 'P0';
  if (all.includes('x8'))  return 'P1';
  return 'P2';
}

function toImportance(sev = '', tags = []) {
  const all = [sev, ...tags].join(' ').toLowerCase();
  if (all.includes('x16')) return 'x16';
  if (all.includes('x8'))  return 'x8';
  if (all.includes('x4'))  return 'x4';
  if (all.includes('x2'))  return 'x2';
  return 'unknown';
}

function transform(raw, section = 'Recently assigned') {
  const notes  = raw.notes || '';
  const tags   = (raw.tags || []).map(t => t.name);
  const parsed = parseNotes(notes);
  const sev    = parsed.severity || tags.find(t => /^[xX]\d+/.test(t)) || '';

  return {
    gid:           raw.gid,
    name:          raw.name || '',
    due_on:        raw.due_on || null,
    modified:      (raw.modified_at || '').slice(0, 10),
    follower_count: (raw.followers || []).length,
    importance:    toImportance(sev, tags),
    platform:      parsed.platform,
    client:        parsed.client,
    priority:      toPriority(sev, tags),
    section,
    notes_preview: notes.replace(/\n/g, ' ').slice(0, 200),
    num_subtasks:  raw.num_subtasks || 0,
    tags,
    asana_url:     `https://app.asana.com/1/${WORKSPACE_GID}/task/${raw.gid}`,
  };
}

// Fetch all tasks in a section (paginated)
async function fetchSectionTasks(pat, sectionGid, sectionName, fields) {
  let tasks = [];
  let url = `${BASE}/sections/${sectionGid}/tasks?opt_fields=${fields}&limit=100`;

  while (url) {
    const data = await asana(pat, url.replace(BASE, ''));
    for (const t of data.data || []) {
      if (!t.completed) tasks.push(transform(t, sectionName));
    }
    url = data.next_page?.uri || null;
  }
  return tasks;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const pat = process.env.ASANA_PAT;
  if (!pat) {
    return res.status(500).json({ error: 'ASANA_PAT environment variable is not set.' });
  }

  try {
    const fields = [
      'gid', 'name', 'due_on', 'modified_at', 'completed',
      'followers', 'num_subtasks', 'notes', 'tags.name'
    ].join(',');

    // Step 1: Get the user's task list GID
    const me = await asana(pat, `/users/me/user_task_list?workspace=${WORKSPACE_GID}&opt_fields=gid`);
    const taskListGid = me.data?.gid;

    if (!taskListGid) throw new Error('Could not find user task list');

    // Step 2: Get all sections in the user task list
    const sectionsRes = await asana(pat, `/user_task_lists/${taskListGid}/sections?opt_fields=gid,name&limit=100`);
    const sections = sectionsRes.data || [];

    // Step 3: Fetch tasks for each section in parallel
    const sectionResults = await Promise.all(
      sections.map(s => fetchSectionTasks(pat, s.gid, s.name, fields))
    );

    // Flatten, deduplicate by GID
    const seen = new Set();
    const allTasks = [];
    for (const group of sectionResults) {
      for (const task of group) {
        if (!seen.has(task.gid)) {
          seen.add(task.gid);
          allTasks.push(task);
        }
      }
    }

    // Cache for 5 minutes on Vercel edge
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    return res.status(200).json({
      tasks: allTasks,
      syncedAt: new Date().toISOString(),
      totalSections: sections.map(s => s.name),
    });

  } catch (err) {
    console.error('Sync error:', err);
    return res.status(500).json({ error: err.message });
  }
}
