/* ObraGest — SPA sin dependencias. Persistencia en localStorage. */
"use strict";
const KEY = "obragest_v1";
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const uid = (p) => p + "_" + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-3);
const todayISO = () => new Date().toISOString().slice(0, 10);
const fmtD = (iso) => { if (!iso) return "—"; const [y, m, d] = iso.split("-"); return `${d}/${m}/${y}`; };
const fmtN = (n) => (n ?? 0).toLocaleString("es-ES");
const money = (n) => (n == null || n === "" ? "—" : Number(n).toLocaleString("es-ES") + " €");
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const ROLES = ["Jefe/a de obra", "Arquitecto/a", "Ingeniero/a caminos", "Aparejador/a", "Topógrafo/a", "Seguridad y salud", "Administrativo/a", "Encargado/a"];
const ESTADOS_TAREA = ["Pendiente", "En curso", "En revisión", "Hecha"];
const ESTADOS_PROY = ["Licitación", "Activo", "En pausa", "Finalizado"];
const COLORS = ["#2563eb", "#0ea5e9", "#7c3aed", "#16a34a", "#d97706", "#dc2626", "#0891b2", "#4f46e5"];

/* ---------- Seed ---------- */
function seed() {
  const miembros = [
    { id: "m_ana", nombre: "Ana Beltrán", rol: "Jefe/a de obra", email: "ana@obragest.es", tel: "600 111 222" },
    { id: "m_luis", nombre: "Luis Ferrer", rol: "Ingeniero/a caminos", email: "luis@obragest.es", tel: "600 333 444" },
    { id: "m_carla", nombre: "Carla Miró", rol: "Arquitecto/a", email: "carla@obragest.es", tel: "600 555 666" },
    { id: "m_pau", nombre: "Pau Serra", rol: "Topógrafo/a", email: "pau@obragest.es", tel: "600 777 888" },
    { id: "m_nuria", nombre: "Nuria Vidal", rol: "Seguridad y salud", email: "nuria@obragest.es", tel: "600 999 000" },
    { id: "m_jordi", nombre: "Jordi Roca", rol: "Encargado/a", email: "jordi@obragest.es", tel: "600 123 456" },
  ];
  const proyectos = [
    { id: "p_puente", nombre: "Rehabilitación puente N-340", expediente: "2026-OB-014", tipo: "Carreteras", ubicacion: "Amposta · Tarragona", presupuesto: 850000, inicio: "2026-02-02", fin: "2026-11-30", estado: "Activo", responsableId: "m_ana", descripcion: "Refuerzo estructural, drenaje y nueva barandilla." },
    { id: "p_cole", nombre: "Ampliación CEIP Les Eres", expediente: "2026-OB-021", tipo: "Edificación", ubicacion: "Ontinyent · Valencia", presupuesto: 1200000, inicio: "2026-03-10", fin: "2026-12-20", estado: "Activo", responsableId: "m_carla", descripcion: "6 aulas nuevas, gimnasio y urbanización patio." },
    { id: "p_agua", nombre: "Red de pluviales barrio Norte", expediente: "2026-OB-007", tipo: "Hidráulica", ubicacion: "Lleida", presupuesto: 430000, inicio: "2026-01-15", fin: "2026-08-15", estado: "En pausa", responsableId: "m_luis", descripcion: "Colectores, imbornales y tanque de tormentas." },
  ];
  const subproyectos = [
    { id: "s_est", proyectoId: "p_puente", nombre: "Lote 1 · Estructura y refuerzo", adjudicadoId: "m_luis", presupuesto: 380000, inicio: "2026-02-02", fin: "2026-07-31", estado: "Activo" },
    { id: "s_acc", proyectoId: "p_puente", nombre: "Lote 2 · Accesos y señalización", adjudicadoId: "m_jordi", presupuesto: 170000, inicio: "2026-06-01", fin: "2026-11-30", estado: "Licitación" },
    { id: "s_aul", proyectoId: "p_cole", nombre: "Lote 1 · Aulario", adjudicadoId: "m_carla", presupuesto: 700000, inicio: "2026-03-10", fin: "2026-10-30", estado: "Activo" },
    { id: "s_urb", proyectoId: "p_cole", nombre: "Lote 2 · Urbanización patio", adjudicadoId: "m_pau", presupuesto: 180000, inicio: "2026-08-01", fin: "2026-12-20", estado: "Licitación" },
    { id: "s_col", proyectoId: "p_agua", nombre: "Lote único · Colectores", adjudicadoId: "m_ana", presupuesto: 430000, inicio: "2026-01-15", fin: "2026-08-15", estado: "En pausa" },
  ];
  const tareas = [
    { id: "t1", proyectoId: "p_puente", subproyectoId: "s_est", titulo: "Inspección y topografía inicial", responsableId: "m_pau", prioridad: "Alta", estado: "Hecha", inicio: "2026-02-02", fin: "2026-02-20", hEst: 60, avance: 100 },
    { id: "t2", proyectoId: "p_puente", subproyectoId: "s_est", titulo: "Refuerzo con fibra de carbono", responsableId: "m_luis", prioridad: "Alta", estado: "En curso", inicio: "2026-03-01", fin: "2026-06-30", hEst: 320, avance: 55 },
    { id: "t3", proyectoId: "p_puente", subproyectoId: "s_est", titulo: "Plan de seguridad y salud", responsableId: "m_nuria", prioridad: "Media", estado: "Hecha", inicio: "2026-02-05", fin: "2026-02-28", hEst: 40, avance: 100 },
    { id: "t4", proyectoId: "p_puente", subproyectoId: "s_acc", titulo: "Asfaltado accesos", responsableId: "m_jordi", prioridad: "Media", estado: "Pendiente", inicio: "2026-08-01", fin: "2026-09-30", hEst: 200, avance: 0 },
    { id: "t5", proyectoId: "p_puente", subproyectoId: "", titulo: "Acta de replanteo con administración", responsableId: "m_ana", prioridad: "Alta", estado: "Hecha", inicio: "2026-02-02", fin: "2026-02-06", hEst: 16, avance: 100 },
    { id: "t6", proyectoId: "p_cole", subproyectoId: "s_aul", titulo: "Cimentación y estructura", responsableId: "m_luis", prioridad: "Alta", estado: "En curso", inicio: "2026-03-10", fin: "2026-07-15", hEst: 400, avance: 60 },
    { id: "t7", proyectoId: "p_cole", subproyectoId: "s_aul", titulo: "Albañilería y envolvente", responsableId: "m_carla", prioridad: "Media", estado: "Pendiente", inicio: "2026-07-01", fin: "2026-10-01", hEst: 350, avance: 5 },
    { id: "t8", proyectoId: "p_cole", subproyectoId: "s_urb", titulo: "Nivelación y red de riego patio", responsableId: "m_pau", prioridad: "Baja", estado: "Pendiente", inicio: "2026-09-01", fin: "2026-11-15", hEst: 120, avance: 0 },
    { id: "t9", proyectoId: "p_cole", subproyectoId: "", titulo: "Licencia y visado colegio", responsableId: "m_carla", prioridad: "Alta", estado: "En revisión", inicio: "2026-03-01", fin: "2026-04-15", hEst: 50, avance: 85 },
    { id: "t10", proyectoId: "p_agua", subproyectoId: "s_col", titulo: "Excavación colector principal", responsableId: "m_jordi", prioridad: "Alta", estado: "En curso", inicio: "2026-02-01", fin: "2026-05-30", hEst: 280, avance: 40 },
    { id: "t11", proyectoId: "p_agua", subproyectoId: "s_col", titulo: "Catas arqueológicas previas", responsableId: "m_nuria", prioridad: "Media", estado: "En revisión", inicio: "2026-01-15", fin: "2026-02-28", hEst: 80, avance: 90 },
  ];
  const partes = [
    { id: uid("pt"), tareaId: "t2", miembroId: "m_luis", fecha: "2026-05-20", horas: 32, nota: "Aplicación 2ª capa refuerzo" },
    { id: uid("pt"), tareaId: "t6", miembroId: "m_luis", fecha: "2026-05-21", horas: 28, nota: "Hormigonado forjado 1" },
    { id: uid("pt"), tareaId: "t1", miembroId: "m_pau", fecha: "2026-02-18", horas: 55, nota: "Levantamiento completo" },
    { id: uid("pt"), tareaId: "t10", miembroId: "m_jordi", fecha: "2026-05-19", horas: 30, nota: "Tramo 3 excavación" },
  ];
  return { miembros, proyectos, subproyectos, tareas, partes };
}

/* ---------- Store ---------- */
let DB = load();
function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) { const d = JSON.parse(raw); if (d.proyectos) return d; } } catch {}
  const d = seed(); save(d); return d;
}
function save(d) { DB = d || DB; localStorage.setItem(KEY, JSON.stringify(DB)); }
const getM = (id) => DB.miembros.find((m) => m.id === id);
const getP = (id) => DB.proyectos.find((p) => p.id === id);
const getS = (id) => DB.subproyectos.find((s) => s.id === id);
const getT = (id) => DB.tareas.find((t) => t.id === id);
const colorOf = (id) => COLORS[Math.abs(hash(id)) % COLORS.length];
const hash = (s) => String(s).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
const initials = (n) => String(n || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
const horasReales = (tareaId) => DB.partes.filter((p) => p.tareaId === tareaId).reduce((a, p) => a + Number(p.horas || 0), 0);
function avanceTareas(list) {
  const w = list.reduce((a, t) => a + Number(t.hEst || 0), 0);
  if (!w) { if (!list.length) return 0; return Math.round(list.reduce((a, t) => a + Number(t.avance || 0), 0) / list.length); }
  return Math.round(list.reduce((a, t) => a + Number(t.avance || 0) * Number(t.hEst || 0), 0) / w);
}
const tareasDeProyecto = (pid) => DB.tareas.filter((t) => t.proyectoId === pid);
const tareasDeSub = (sid) => DB.tareas.filter((t) => t.subproyectoId === sid);
const avanceSub = (sid) => avanceTareas(tareasDeSub(sid));
const avanceProy = (pid) => avanceTareas(tareasDeProyecto(pid));
function estadoBadge(e) {
  const m = { "Pendiente": "b-pend", "En curso": "b-curso", "En revisión": "b-rev", "Hecha": "b-hecha", "Licitación": "b-lic", "Activo": "b-activo", "En pausa": "b-pausa", "Finalizado": "b-fin" };
  return `<span class="badge ${m[e] || "b-lic"}">${esc(e)}</span>`;
}
const prioBadge = (p) => `<span class="badge ${p === "Alta" ? "b-alta" : p === "Media" ? "b-media" : "b-baja"}">${esc(p)}</span>`;
function toast(msg) { const el = $("#toast"); el.textContent = msg; el.classList.add("show"); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("show"), 2200); }

/* ---------- Navegación ---------- */
$$("#nav .nav-btn").forEach((b) => b.addEventListener("click", () => {
  $$("#nav .nav-btn").forEach((x) => x.classList.remove("active")); b.classList.add("active");
  $$(".view").forEach((v) => v.classList.remove("active"));
  $("#view-" + b.dataset.view).classList.add("active");
}));

/* ---------- Renders ---------- */
function renderAll() { renderKpis(); renderCharts(); renderAlertas(); renderProy(); renderSub(); renderTareas(); renderEquipo(); renderTiempos(); renderInformes(); fillSelects(); }

function renderKpis() {
  const pAct = DB.proyectos.filter((p) => p.estado === "Activo").length;
  const tAb = DB.tareas.filter((t) => t.estado !== "Hecha").length;
  const hEst = DB.tareas.reduce((a, t) => a + Number(t.hEst || 0), 0);
  const hRe = DB.partes.reduce((a, p) => a + Number(p.horas || 0), 0);
  const av = avanceTareas(DB.tareas);
  const html = `
    <div class="card kpi"><div class="n">${DB.proyectos.length}</div><div class="l">Proyectos (${pAct} activos)</div></div>
    <div class="card kpi"><div class="n">${DB.tareas.length}</div><div class="l">Tareas (${tAb} abiertas)</div></div>
    <div class="card kpi"><div class="n">${DB.miembros.length}</div><div class="l">Miembros del equipo</div></div>
    <div class="card kpi"><div class="n">${fmtN(hRe)} h</div><div class="l">Registradas de ${fmtN(hEst)} h estimadas</div><div class="bar"><i style="width:${hEst ? Math.min(100, Math.round(hRe / hEst * 100)) : 0}%"></i></div></div>
    <div class="card kpi"><div class="n">${av} %</div><div class="l">Avance medio global</div><div class="bar"><i style="width:${av}%"></i></div></div>`;
  $("#kpis").innerHTML = html; $("#kpis2").innerHTML = html;
}

function renderCharts() {
  $("#chartProy").innerHTML = DB.proyectos.map((p) => { const av = avanceProy(p.id); return `<div class="crow"><span class="t" title="${esc(p.nombre)}">${esc(p.nombre)}</span><div class="pbar"><i style="width:${av}%"></i></div><b>${av}%</b></div>`; }).join("") || `<div class="empty">Sin proyectos</div>`;
  const counts = ESTADOS_TAREA.map((e) => ({ e, n: DB.tareas.filter((t) => t.estado === e).length }));
  const total = DB.tareas.length || 1;
  const circ = 2 * Math.PI * 40; let off = 0;
  const cols = { "Pendiente": "#eab308", "En curso": "#2563eb", "En revisión": "#7c3aed", "Hecha": "#16a34a" };
  const segs = counts.map((c) => { const len = (c.n / total) * circ; const s = `<circle cx="55" cy="55" r="40" fill="none" stroke="${cols[c.e]}" stroke-width="16" stroke-dasharray="${len} ${circ - len}" stroke-dashoffset="${-off}" />`; off += len; return s; }).join("");
  $("#donut").innerHTML = `<svg width="110" height="110" viewBox="0 0 110 110"><g transform="rotate(-90 55 55)">${segs}</g><text x="55" y="60" text-anchor="middle" font-size="18" font-weight="800">${Math.round(DB.tareas.filter(t=>t.estado==="Hecha").length/total*100)||0}%</text></svg>
    <div class="legend">${counts.map((c) => `<span><i class="dot" style="background:${cols[c.e]}"></i>${c.e}: <b>${c.n}</b></span>`).join("")}</div>`;
  const max = Math.max(1, ...DB.miembros.map((m) => DB.tareas.filter((t) => t.responsableId === m.id && t.estado !== "Hecha").length));
  $("#chartCarga").innerHTML = DB.miembros.map((m) => { const n = DB.tareas.filter((t) => t.responsableId === m.id && t.estado !== "Hecha").length; return `<div class="crow"><span class="t">${esc(m.nombre)}</span><div class="pbar"><i style="width:${Math.round(n / max * 100)}%;background:linear-gradient(90deg,#7c3aed,#0ea5e9)"></i></div><b>${n}</b></div>`; }).join("");
}

function renderAlertas() {
  const now = new Date(todayISO()); const lim = new Date(); lim.setDate(lim.getDate() + 14);
  const items = DB.tareas.filter((t) => t.estado !== "Hecha" && t.fin).map((t) => ({ t, d: new Date(t.fin) }))
    .filter((x) => x.d <= lim).sort((a, b) => a.d - b.d);
  $("#alertas").innerHTML = items.length ? items.slice(0, 8).map(({ t, d }) => {
    const late = d < now; const m = getM(t.responsableId);
    return `<div class="alert" style="${late ? "background:#fef2f2;border-color:#fecaca" : ""}"><b>${late ? "🔴 Retrasada" : "🟡 Próxima"} · ${esc(t.titulo)}</b><br><span>${esc(getP(t.proyectoId)?.nombre || "")} · ${esc(m?.nombre || "Sin asignar")} · entrega ${fmtD(t.fin)} · ${t.avance}%</span></div>`;
  }).join("") : `<div class="empty">Sin entregas próximas. Buen ritmo 👍</div>`;
}

function renderProy() {
  const q = ($("#qProy").value || "").toLowerCase(), fe = $("#fProyEstado").value;
  const rows = DB.proyectos.filter((p) => (!fe || p.estado === fe) && (!q || (p.nombre + p.expediente + p.ubicacion).toLowerCase().includes(q)));
  $("#tblProy").innerHTML = `<tr><th>Obra / expediente</th><th>Tipo · Ubicación</th><th>Responsable</th><th>Presupuesto</th><th>Fechas</th><th>Estado</th><th>Avance</th><th></th></tr>` +
    (rows.map((p) => { const av = avanceProy(p.id); const r = getM(p.responsableId); const nsub = DB.subproyectos.filter(s=>s.proyectoId===p.id).length; const ntar = tareasDeProyecto(p.id).length;
      return `<tr><td><b>${esc(p.nombre)}</b><br><small style="color:#64748b">${esc(p.expediente)} · ${nsub} sublotes · ${ntar} tareas</small></td>
      <td>${esc(p.tipo)}<br><small>${esc(p.ubicacion)}</small></td>
      <td>${r ? `<span class="avatar" style="background:${colorOf(r.id)}">${initials(r.nombre)}</span> ${esc(r.nombre)}` : "—"}</td>
      <td>${money(p.presupuesto)}</td><td><small>${fmtD(p.inicio)} → ${fmtD(p.fin)}</small></td>
      <td>${estadoBadge(p.estado)}</td>
      <td><div class="prow"><div class="pbar"><i style="width:${av}%"></i></div><b>${av}%</b></div></td>
      <td style="white-space:nowrap"><button class="btn small" onclick="openModal('proyecto','${p.id}')">✏️</button> <button class="btn small danger" onclick="delItem('proyecto','${p.id}')">🗑</button></td></tr>`; }).join("") || `<tr><td colspan="8"><div class="empty">Sin proyectos. Crea el primero.</div></td></tr>`);
}

function renderSub() {
  const q = ($("#qSub").value || "").toLowerCase(), fp = $("#fSubProy").value;
  const rows = DB.subproyectos.filter((s) => (!fp || s.proyectoId === fp) && (!q || s.nombre.toLowerCase().includes(q)));
  $("#tblSub").innerHTML = `<tr><th>Sublote</th><th>Proyecto</th><th>Adjudicado a</th><th>Presupuesto</th><th>Fechas</th><th>Avance (auto)</th><th></th></tr>` +
    (rows.map((s) => { const av = avanceSub(s.id); const nt = tareasDeSub(s.id).length; const a = getM(s.adjudicadoId);
      return `<tr><td><b>${esc(s.nombre)}</b><br><small>${nt} tareas · ${estadoBadge(s.estado)}</small></td>
      <td><small>${esc(getP(s.proyectoId)?.nombre || "—")}</small></td>
      <td>${a ? `<span class="avatar" style="background:${colorOf(a.id)}">${initials(a.nombre)}</span> ${esc(a.nombre)}<br><small style="color:#64748b">${esc(a.rol)}</small>` : `<i style="color:#dc2626">Sin adjudicar</i>`}</td>
      <td>${money(s.presupuesto)}</td><td><small>${fmtD(s.inicio)} → ${fmtD(s.fin)}</small></td>
      <td><div class="prow"><div class="pbar"><i style="width:${av}%"></i></div><b>${av}%</b></div></td>
      <td style="white-space:nowrap"><button class="btn small" onclick="openModal('subproyecto','${s.id}')">✏️</button> <button class="btn small danger" onclick="delItem('subproyecto','${s.id}')">🗑</button></td></tr>`; }).join("") || `<tr><td colspan="7"><div class="empty">Sin subproyectos.</div></td></tr>`);
}

function renderTareas() {
  const q = ($("#qTar").value || "").toLowerCase(), fp = $("#fTarProy").value, fm = $("#fTarMiembro").value, fe = $("#fTarEstado").value;
  const rows = DB.tareas.filter((t) => (!fp || t.proyectoId === fp) && (!fm || t.responsableId === fm) && (!fe || t.estado === fe) && (!q || t.titulo.toLowerCase().includes(q)));
  const kc = { "Pendiente": "#854d0e", "En curso": "#1d4ed8", "En revisión": "#6d28d9", "Hecha": "#166534" };
  $("#kanban").innerHTML = ESTADOS_TAREA.map((e) => {
    const cards = rows.filter((t) => t.estado === e);
    return `<div class="kcol"><h4 style="color:${kc[e]}">● ${e} (${cards.length})</h4>${cards.map((t) => { const m = getM(t.responsableId);
      return `<div class="kcard"><b>${esc(t.titulo)}</b><div class="meta">${esc(getP(t.proyectoId)?.nombre || "")}${t.subproyectoId ? " · " + esc(getS(t.subproyectoId)?.nombre || "") : ""}<br>👷 ${esc(m?.nombre || "Sin asignar")} · ${prioBadge(t.prioridad)}<br>📅 ${fmtD(t.fin)} · ${t.avance}% · ${fmtN(horasReales(t.id))}/${fmtN(t.hEst)} h</div>
      <div class="row"><select onchange="moveTask('${t.id}',this.value)" style="flex:1;border:1px solid #e2e8f0;border-radius:8px;padding:5px">${ESTADOS_TAREA.map((x) => `<option ${x === t.estado ? "selected" : ""}>${x}</option>`).join("")}</select>
      <button class="btn small" onclick="openModal('tarea','${t.id}')">✏️</button></div></div>`; }).join("") || `<div class="empty">—</div>`}</div>`; }).join("");
  $("#tblTar").innerHTML = `<tr><th>Tarea</th><th>Asignada a</th><th>Prior.</th><th>Estado</th><th>Entrega</th><th>Horas est/real</th><th>Avance</th><th></th></tr>` +
    (rows.map((t) => { const m = getM(t.responsableId); const hr = horasReales(t.id);
      return `<tr><td><b>${esc(t.titulo)}</b><br><small style="color:#64748b">${esc(getP(t.proyectoId)?.nombre || "")}${t.subproyectoId ? " · " + esc(getS(t.subproyectoId)?.nombre || "") : ""}</small></td>
      <td>${m ? esc(m.nombre) : "<i>Sin asignar</i>"}</td><td>${prioBadge(t.prioridad)}</td><td>${estadoBadge(t.estado)}</td><td><small>${fmtD(t.fin)}</small></td>
      <td><small>${fmtN(t.hEst)} / <b>${fmtN(hr)}</b>${hr > Number(t.hEst || 0) ? ' <span class="badge b-alta">desvío</span>' : ""}</small><br><input type="range" min="0" max="100" value="${t.avance}" onchange="setAvance('${t.id}',this.value)" style="width:90px"></td>
      <td><b>${t.avance}%</b></td>
      <td style="white-space:nowrap"><button class="btn small" onclick="openModal('tarea','${t.id}')">✏️</button> <button class="btn small danger" onclick="delItem('tarea','${t.id}')">🗑</button></td></tr>`; }).join("") || `<tr><td colspan="8"><div class="empty">Sin tareas con esos filtros.</div></td></tr>`);
}

function renderEquipo() {
  $("#teamGrid").innerHTML = DB.miembros.map((m) => {
    const tabs = DB.tareas.filter((t) => t.responsableId === m.id && t.estado !== "Hecha").length;
    const hechas = DB.tareas.filter((t) => t.responsableId === m.id && t.estado === "Hecha").length;
    const hreg = DB.partes.filter((p) => p.miembroId === m.id).reduce((a, p) => a + Number(p.horas || 0), 0);
    return `<div class="card"><div style="display:flex;gap:10px;align-items:center"><span class="avatar" style="background:${colorOf(m.id)};width:44px;height:44px;font-size:15px">${initials(m.nombre)}</span>
      <div><b>${esc(m.nombre)}</b><br><small style="color:#64748b">${esc(m.rol)}</small></div></div>
      <p style="font-size:13px;color:#475569">✉️ ${esc(m.email || "—")}<br>📞 ${esc(m.tel || "—")}</p>
      <div class="prow" style="font-size:13px">Abiertas: <b>${tabs}</b> · Hechas: <b>${hechas}</b> · Horas: <b>${fmtN(hreg)}</b></div>
      <div class="toolbar"><button class="btn small" onclick="openModal('miembro','${m.id}')">✏️ Editar</button><button class="btn small danger" onclick="delItem('miembro','${m.id}')">Eliminar</button></div></div>`; }).join("");
}

function renderTiempos() {
  $("#tblPartes").innerHTML = `<tr><th>Fecha</th><th>Tarea</th><th>Miembro</th><th>Horas</th><th></th></tr>` +
    ([...DB.partes].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 30).map((p) => `<tr><td><small>${fmtD(p.fecha)}</small></td><td><small>${esc(getT(p.tareaId)?.titulo || "—")}</small></td><td><small>${esc(getM(p.miembroId)?.nombre || "—")}</small></td><td><b>${p.horas}</b></td><td><button class="btn small danger" onclick="delItem('parte','${p.id}')">✕</button></td></tr>`).join("") || `<tr><td colspan="5"><div class="empty">Sin partes registrados.</div></td></tr>`);
  $("#chartHoras").innerHTML = DB.tareas.slice(0, 10).map((t) => { const hr = horasReales(t.id); const max = Math.max(Number(t.hEst || 0), hr, 1);
    return `<div style="font-size:13px"><b>${esc(t.titulo.slice(0, 34))}</b><div class="prow"><span style="min-width:120px;font-size:12px;color:#64748b">Est ${fmtN(t.hEst)}h · Real ${fmtN(hr)}h</span><div class="pbar" style="flex:1"><i style="width:${Math.round(hr / max * 100)}%;${hr > t.hEst ? "background:linear-gradient(90deg,#dc2626,#f97316)" : ""}"></i></div></div></div>`; }).join("");
  const pid = $("#fGanttProy").value;
  const list = DB.tareas.filter((t) => !pid || t.proyectoId === pid).filter((t) => t.inicio && t.fin).sort((a, b) => a.inicio.localeCompare(b.inicio));
  $("#ganttTitle").textContent = "Cronograma Gantt" + (pid ? " · " + (getP(pid)?.nombre || "") : " (todas)");
  if (!list.length) { $("#gantt").innerHTML = `<div class="empty">Selecciona un proyecto con tareas fechadas.</div>`; return; }
  const min = list.reduce((a, t) => a < t.inicio ? a : t.inicio, list[0].inicio);
  const maxD = list.reduce((a, t) => a > t.fin ? a : t.fin, list[0].fin);
  const span = Math.max(1, (new Date(maxD) - new Date(min)) / 864e5);
  $("#gantt").innerHTML = `<div class="grow head"><div>Tarea</div><div>${fmtD(min)} → ${fmtD(maxD)} (${Math.round(span)} días)</div></div>` + list.map((t) => {
    const l = (new Date(t.inicio) - new Date(min)) / 864e5 / span * 100, w = Math.max(3, (new Date(t.fin) - new Date(t.inicio)) / 864e5 / span * 100);
    const late = t.estado !== "Hecha" && t.fin < todayISO();
    return `<div class="grow"><div><b>${esc(t.titulo.slice(0, 30))}</b><br><small style="color:#64748b">${esc(getM(t.responsableId)?.nombre || "")} · ${t.avance}%</small></div>
      <div><div class="gtrack"><div class="gfill ${late ? "late" : ""}" style="left:${l}%;width:${w}%" title="${fmtD(t.inicio)} → ${fmtD(t.fin)}"></div></div></div></div>`; }).join("");
}

function renderInformes() {
  $("#tblInf").innerHTML = `<tr><th>Proyecto</th><th>Estado</th><th>Tareas</th><th>Horas est/real</th><th>Presupuesto</th><th>Avance</th></tr>` +
    DB.proyectos.map((p) => { const ts = tareasDeProyecto(p.id); const he = ts.reduce((a, t) => a + Number(t.hEst || 0), 0); const hr = ts.reduce((a, t) => a + horasReales(t.id), 0);
      return `<tr><td><b>${esc(p.nombre)}</b><br><small>${esc(p.expediente)}</small></td><td>${estadoBadge(p.estado)}</td><td>${ts.filter(t=>t.estado==="Hecha").length}/${ts.length} hechas</td><td>${fmtN(he)} / ${fmtN(hr)} h</td><td>${money(p.presupuesto)}</td><td><div class="prow"><div class="pbar"><i style="width:${avanceProy(p.id)}%"></i></div><b>${avanceProy(p.id)}%</b></div></td></tr>`; }).join("");
}

function fillSelects() {
  const keep = (id, val) => { const el = $(id); el.innerHTML = el.innerHTML.split("</option>")[0] + "</option>"; };
  const po = DB.proyectos.map((p) => `<option value="${p.id}">${esc(p.nombre)}</option>`).join("");
  const mo = DB.miembros.map((m) => `<option value="${m.id}">${esc(m.nombre)} (${esc(m.rol)})</option>`).join("");
  const setOpts = (sel, first, opts) => { const cur = $(sel).value; $(sel).innerHTML = first + opts; if ([...$(sel).options].some((o) => o.value === cur)) $(sel).value = cur; };
  setOpts("#fSubProy", `<option value="">Todos los proyectos</option>`, po);
  setOpts("#fTarProy", `<option value="">Todos los proyectos</option>`, po);
  setOpts("#fTarMiembro", `<option value="">Todos los miembros</option>`, mo);
  setOpts("#fGanttProy", `<option value="">Selecciona proyecto para Gantt…</option>`, po);
}

/* ---------- Acciones globales ---------- */
window.moveTask = (id, estado) => { const t = getT(id); t.estado = estado; if (estado === "Hecha") t.avance = 100; if (estado !== "Hecha" && Number(t.avance) === 100) t.avance = 90; save(); renderAll(); };
window.setAvance = (id, v) => { const t = getT(id); t.avance = Number(v); if (t.avance === 100) t.estado = "Hecha"; if (t.avance < 100 && t.estado === "Hecha") t.estado = "En revisión"; save(); renderAll(); };
window.delItem = (tipo, id) => {
  if (!confirm("¿Eliminar este registro?")) return;
  if (tipo === "proyecto") { DB.proyectos = DB.proyectos.filter((x) => x.id !== id); DB.subproyectos = DB.subproyectos.filter((x) => x.proyectoId !== id); const tids = DB.tareas.filter((t) => t.proyectoId === id).map((t) => t.id); DB.tareas = DB.tareas.filter((t) => t.proyectoId !== id); DB.partes = DB.partes.filter((p) => !tids.includes(p.tareaId)); }
  if (tipo === "subproyecto") { DB.subproyectos = DB.subproyectos.filter((x) => x.id !== id); DB.tareas.forEach((t) => { if (t.subproyectoId === id) t.subproyectoId = ""; }); }
  if (tipo === "tarea") { DB.tareas = DB.tareas.filter((x) => x.id !== id); DB.partes = DB.partes.filter((p) => p.tareaId !== id); }
  if (tipo === "miembro") { if (DB.tareas.some((t) => t.responsableId === id) || DB.subproyectos.some((s) => s.adjudicadoId === id)) { alert("No se puede eliminar: tiene tareas o sublotes asignados. Reasigna primero."); return; } DB.miembros = DB.miembros.filter((x) => x.id !== id); }
  if (tipo === "parte") { DB.partes = DB.partes.filter((x) => x.id !== id); }
  save(); renderAll(); toast("Registro eliminado");
};

/* ---------- Modal / formularios ---------- */
let editing = null;
const F = {
  proyecto: (d = {}) => `
    <div class="form">
    <label class="full">Nombre de la obra<input name="nombre" required value="${esc(d.nombre || "")}" placeholder="Rehabilitación puente…"></label>
    <label>Código expediente<input name="expediente" value="${esc(d.expediente || "")}" placeholder="2026-OB-000"></label>
    <label>Tipo de obra<select name="tipo">${["Carreteras", "Hidráulica", "Edificación", "Urbanización", "Ferroviaria", "Medio ambiente", "Otra"].map((t) => `<option ${d.tipo === t ? "selected" : ""}>${t}</option>`).join("")}</select></label>
    <label class="full">Ubicación<input name="ubicacion" value="${esc(d.ubicacion || "")}" placeholder="Municipio · Provincia"></label>
    <label>Presupuesto (€)<input name="presupuesto" type="number" min="0" value="${esc(d.presupuesto ?? "")}"></label>
    <label>Responsable<select name="responsableId"><option value="">—</option>${DB.miembros.map((m) => `<option value="${m.id}" ${d.responsableId === m.id ? "selected" : ""}>${esc(m.nombre)}</option>`).join("")}</select></label>
    <label>Inicio<input name="inicio" type="date" value="${esc(d.inicio || todayISO())}"></label>
    <label>Fin previsto<input name="fin" type="date" value="${esc(d.fin || "")}"></label>
    <label>Estado<select name="estado">${ESTADOS_PROY.map((e) => `<option ${d.estado === e ? "selected" : ""}>${e}</option>`).join("")}</select></label>
    <label class="full">Descripción<textarea name="descripcion" rows="2">${esc(d.descripcion || "")}</textarea></label></div>`,
  subproyecto: (d = {}) => `
    <div class="form">
    <label class="full">Nombre del sublote<input name="nombre" required value="${esc(d.nombre || "")}" placeholder="Lote 1 · Estructura"></label>
    <label class="full">Proyecto<select name="proyectoId">${DB.proyectos.map((p) => `<option value="${p.id}" ${d.proyectoId === p.id ? "selected" : ""}>${esc(p.nombre)}</option>`).join("")}</select></label>
    <label class="full">Adjudicar a (miembro del equipo)<select name="adjudicadoId"><option value="">— Sin adjudicar —</option>${DB.miembros.map((m) => `<option value="${m.id}" ${d.adjudicadoId === m.id ? "selected" : ""}>${esc(m.nombre)} · ${esc(m.rol)}</option>`).join("")}</select></label>
    <label>Presupuesto (€)<input name="presupuesto" type="number" min="0" value="${esc(d.presupuesto ?? "")}"></label>
    <label>Estado<select name="estado">${ESTADOS_PROY.map((e) => `<option ${d.estado === e ? "selected" : ""}>${e}</option>`).join("")}</select></label>
    <label>Inicio<input name="inicio" type="date" value="${esc(d.inicio || todayISO())}"></label>
    <label>Fin<input name="fin" type="date" value="${esc(d.fin || "")}"></label></div>`,
  tarea: (d = {}) => `
    <div class="form">
    <label class="full">Título<input name="titulo" required value="${esc(d.titulo || "")}" placeholder="Qué hay que hacer…"></label>
    <label>Proyecto<select name="proyectoId" id="fTProy">${DB.proyectos.map((p) => `<option value="${p.id}" ${(d.proyectoId || DB.proyectos[0]?.id) === p.id ? "selected" : ""}>${esc(p.nombre)}</option>`).join("")}</select></label>
    <label>Subproyecto<select name="subproyectoId" id="fTSub"><option value="">— Directa del proyecto —</option>${DB.subproyectos.filter((s) => !d.proyectoId || s.proyectoId === (d.proyectoId || DB.proyectos[0]?.id)).map((s) => `<option value="${s.id}" ${d.subproyectoId === s.id ? "selected" : ""}>${esc(s.nombre)}</option>`).join("")}</select></label>
    <label>Asignar a<select name="responsableId"><option value="">— Sin asignar —</option>${DB.miembros.map((m) => `<option value="${m.id}" ${d.responsableId === m.id ? "selected" : ""}>${esc(m.nombre)}</option>`).join("")}</select></label>
    <label>Prioridad<select name="prioridad">${["Alta", "Media", "Baja"].map((p) => `<option ${d.prioridad === p ? "selected" : ""}>${p}</option>`).join("")}</select></label>
    <label>Estado<select name="estado">${ESTADOS_TAREA.map((e) => `<option ${d.estado === e ? "selected" : ""}>${e}</option>`).join("")}</select></label>
    <label>Avance %<input name="avance" type="number" min="0" max="100" value="${esc(d.avance ?? 0)}"></label>
    <label>Inicio<input name="inicio" type="date" value="${esc(d.inicio || todayISO())}"></label>
    <label>Fin<input name="fin" type="date" value="${esc(d.fin || "")}"></label>
    <label>Horas estimadas<input name="hEst" type="number" min="0" value="${esc(d.hEst ?? 8)}"></label></div>`,
  miembro: (d = {}) => `
    <div class="form">
    <label class="full">Nombre<input name="nombre" required value="${esc(d.nombre || "")}" placeholder="Nombre y apellidos"></label>
    <label class="full">Rol / especialidad<select name="rol">${ROLES.map((r) => `<option ${d.rol === r ? "selected" : ""}>${r}</option>`).join("")}</select></label>
    <label>Email<input name="email" value="${esc(d.email || "")}"></label>
    <label>Teléfono<input name="tel" value="${esc(d.tel || "")}"></label></div>`,
  parte: (d = {}) => `
    <div class="form">
    <label class="full">Tarea<select name="tareaId">${DB.tareas.map((t) => `<option value="${t.id}" ${d.tareaId === t.id ? "selected" : ""}>${esc(t.titulo)} (${esc(getP(t.proyectoId)?.nombre || "")})</option>`).join("")}</select></label>
    <label>Miembro<select name="miembroId">${DB.miembros.map((m) => `<option value="${m.id}" ${d.miembroId === m.id ? "selected" : ""}>${esc(m.nombre)}</option>`).join("")}</select></label>
    <label>Fecha<input name="fecha" type="date" value="${esc(d.fecha || todayISO())}"></label>
    <label>Horas<input name="horas" type="number" min="0.5" step="0.5" value="${esc(d.horas ?? 8)}"></label>
    <label class="full">Nota<input name="nota" value="${esc(d.nota || "")}" placeholder="Tajo realizado…"></label></div>`,
};
const TITLES = { proyecto: "Proyecto de obra", subproyecto: "Subproyecto / adjudicación", tarea: "Tarea", miembro: "Miembro del equipo", parte: "Parte de horas" };
window.openModal = (tipo, id) => {
  if (tipo === "tarea" && !DB.proyectos.length) { alert("Crea primero un proyecto."); return; }
  if (tipo === "subproyecto" && !DB.proyectos.length) { alert("Crea primero un proyecto."); return; }
  editing = { tipo, id: id || null };
  const data = id ? { proyecto: getP, subproyecto: getS, tarea: getT, miembro: getM, parte: (x) => DB.partes.find((p) => p.id === x) }[tipo](id) : {};
  $("#mTitle").textContent = (id ? "Editar · " : "Nuevo · ") + TITLES[tipo];
  $("#mBody").innerHTML = F[tipo](data || {});
  $("#modalBack").classList.add("open");
  const selP = $("#fTProy");
  if (selP) selP.addEventListener("change", () => {
    const pid = selP.value;
    $("#fTSub").innerHTML = `<option value="">— Directa del proyecto —</option>` + DB.subproyectos.filter((s) => s.proyectoId === pid).map((s) => `<option value="${s.id}">${esc(s.nombre)}</option>`).join("");
  });
};
$("#mCancel").addEventListener("click", () => $("#modalBack").classList.remove("open"));
$("#modalBack").addEventListener("click", (e) => { if (e.target.id === "modalBack") $("#modalBack").classList.remove("open"); });
$("#mSave").addEventListener("click", () => {
  const fd = new FormData(); $$("#mBody [name]").forEach((el) => fd.append(el.name, el.value));
  const o = Object.fromEntries(fd.entries());
  ["presupuesto", "avance", "hEst", "horas"].forEach((k) => { if (o[k] !== undefined && o[k] !== "") o[k] = Number(o[k]); });
  const { tipo, id } = editing;
  if (tipo === "proyecto") { if (id) Object.assign(getP(id), o); else DB.proyectos.push({ id: uid("p"), estado: "Activo", ...o }); }
  if (tipo === "subproyecto") { if (id) Object.assign(getS(id), o); else DB.subproyectos.push({ id: uid("s"), estado: "Activo", ...o }); }
  if (tipo === "tarea") { o.avance = Math.max(0, Math.min(100, Number(o.avance || 0))); if (o.estado === "Hecha") o.avance = 100; if (id) Object.assign(getT(id), o); else DB.tareas.push({ id: uid("t"), estado: "Pendiente", prioridad: "Media", ...o }); }
  if (tipo === "miembro") { if (id) Object.assign(getM(id), o); else DB.miembros.push({ id: uid("m"), ...o }); }
  if (tipo === "parte") { if (id) Object.assign(DB.partes.find((p) => p.id === id), o); else DB.partes.push({ id: uid("pt"), ...o }); const t = getT(o.tareaId); if (t && horasReales(t.id) > 0 && t.estado === "Pendiente") t.estado = "En curso"; }
  save(); $("#modalBack").classList.remove("open"); renderAll(); toast("Guardado correctamente");
});
$$("[data-add]").forEach((b) => b.addEventListener("click", () => openModal(b.dataset.add)));
$("#btnQuickTask").addEventListener("click", () => openModal("tarea"));

/* ---------- Filtros ---------- */
["qProy", "fProyEstado"].forEach((id) => $("#" + id).addEventListener("input", renderProy));
["qSub", "fSubProy"].forEach((id) => $("#" + id).addEventListener("input", renderSub));
["qTar", "fTarProy", "fTarMiembro", "fTarEstado"].forEach((id) => $("#" + id).addEventListener("input", renderTareas));
$("#fGanttProy").addEventListener("change", renderTiempos);

/* ---------- Export / import ---------- */
function dl(name, content, type) { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([content], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }
const exportJSON = () => dl(`obragest-copia-${todayISO()}.json`, JSON.stringify(DB, null, 2), "application/json");
$("#btnJSON").addEventListener("click", exportJSON);
$("#btnBackupTop").addEventListener("click", exportJSON);
$("#btnCSV").addEventListener("click", () => {
  const rows = [["Proyecto", "Expediente", "Subproyecto", "Tarea", "Responsable", "Prioridad", "Estado", "Avance%", "Inicio", "Fin", "HorasEst", "HorasReal"]];
  DB.tareas.forEach((t) => rows.push([getP(t.proyectoId)?.nombre || "", getP(t.proyectoId)?.expediente || "", getS(t.subproyectoId)?.nombre || "", t.titulo, getM(t.responsableId)?.nombre || "", t.prioridad, t.estado, t.avance, t.inicio, t.fin, t.hEst, horasReales(t.id)]));
  dl(`obragest-tareas-${todayISO()}.csv`, "\ufeff" + rows.map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(";")).join("\n"), "text/csv");
  toast("CSV descargado");
});
$("#btnImport").addEventListener("click", () => $("#fileImport").click());
$("#fileImport").addEventListener("change", (e) => {
  const f = e.target.files[0]; if (!f) return;
  const rd = new FileReader();
  rd.onload = () => { try { const d = JSON.parse(rd.result); if (!d.proyectos || !d.tareas) throw 0; save(d); renderAll(); toast("Copia importada"); } catch { alert("Archivo no válido."); } };
  rd.readAsText(f); e.target.value = "";
});
$("#btnReset").addEventListener("click", () => { if (confirm("¿Restablecer los datos de ejemplo? Se perderán los cambios.")) { save(seed()); renderAll(); toast("Datos de ejemplo restaurados"); } });

renderAll();
