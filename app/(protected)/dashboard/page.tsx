"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Select,
  Button,
  Tag,
  Table,
  Upload,
  Typography,
  Space,
  Progress,
  Tooltip,
  Badge,
  Divider,
  Alert,
} from "antd";
import { UploadOutlined, ReloadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip as CJTooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  CJTooltip,
  Legend,
  Filler
);

const { Title, Text } = Typography;
const { Dragger } = Upload;

// ─── Constants ────────────────────────────────────────────────
const STAGES = [
  "Screening",
  "Reserved Applicant",
  "Initial Interview",
  "Exam",
  "Background Investigation",
  "Final Interview",
  "Orientation",
  "Hired",
];
const AGE_BANDS = ["18-25", "26-30", "31-35", "36-40", "41-45", "46-50", "51+"];
const PRIMARY = "#389e0d";
const COLORS = [
  "#389e0d",
  "#52c41a",
  "#1677ff",
  "#faad14",
  "#f5222d",
  "#722ed1",
  "#13c2c2",
  "#fa8c16",
  "#eb2f96",
  "#2f54eb",
  "#a0d911",
];

const CHART_OPTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: "#888", font: { size: 11 } } },
    y: { grid: { color: "rgba(0,0,0,0.06)" }, ticks: { color: "#888", font: { size: 11 } } },
  },
};

// ─── Helpers ──────────────────────────────────────────────────
const groupBy = (arr, key) =>
  arr.reduce((acc, r) => { (acc[r[key]] = acc[r[key]] || []).push(r); return acc; }, {});
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
const ageBand = (a) => {
  if (!a) return "Unknown";
  if (a <= 25) return "18-25";
  if (a <= 30) return "26-30";
  if (a <= 35) return "31-35";
  if (a <= 40) return "36-40";
  if (a <= 45) return "41-45";
  if (a <= 50) return "46-50";
  return "51+";
};
const toDate = (v) => {
  if (!v) return null;
  if (v instanceof Date) return v;
  if (typeof v === "number") return new Date(Math.round((v - 25569) * 86400000));
  if (typeof v === "string" && v.trim()) return new Date(v);
  return null;
};
const parseRow = (row) => {
  const K = Object.keys(row);
  const g = (cands) => {
    const k = K.find((k) => cands.some((c) => k.toLowerCase().replace(/[\s_\-]/g, "").includes(c)));
    return k ? row[k] : "";
  };
  const da_ = toDate(g(["dateapplied", "applieddate", "date", "applicationdate"]));
  const dh_ = toDate(g(["datehired", "hireddate", "hired"]));
  const age = parseInt(g(["age"])) || null;
  const dth =
    parseFloat(g(["daystohire", "timetohire", "daystoprocess"])) ||
    (da_ && dh_ ? Math.round((dh_ - da_) / 86400000) : null);
  const stage = String(g(["stage", "currentstage", "status", "recruitmentstage"]) || "Screening");
  return {
    name: String(g(["name", "applicant", "fullname"]) || ""),
    dateApplied: da_,
    dateHired: dh_,
    source: String(g(["source", "sourceof", "sourceofapplication"]) || "Others"),
    position: String(g(["position", "job", "role", "jobposition"]) || "Unknown"),
    branch: String(g(["branch", "location", "site"]) || "Unknown"),
    gender: String(g(["gender", "sex"]) || "Unknown"),
    age,
    ageGroup: ageBand(age),
    stage,
    hired: /hired|yes/i.test(stage),
    daysToHire: dth,
    offerAccepted: String(g(["offeraccepted", "accepted", "offer"]) || ""),
    nps: String(g(["nps", "recommend", "wouldrecommend"]) || ""),
  };
};

const generateSample = () => {
  const branches = ["HO", "Agoo", "Tuguegarao", "Cauayan", "Ilagan", "Santiago", "Bayombong", "Solano", "Aparri", "Roxas"];
  const positions = ["Branch Manager", "IT Head", "Cashier", "Sales Associate", "Accounting Staff", "Loan Officer", "Customer Service Rep", "Teller", "Security Guard", "HR Assistant", "Operations Supervisor", "Credit Analyst", "Encoder", "Janitor", "Driver"];
  const sources = ["Facebook", "Indeed", "Walk In", "Employee Referral", "Job Fair", "School Referral", "PESO Office", "Recruitment Agency", "Print Ads", "Customer Referral", "Others"];
  const firstNames = ["Bhem","Wilbert","Maria","Juan","Ana","Jose","Carla","Mark","Liza","Ramon","Grace","Edgar","Rowena","Danilo","Sheila","Arnold","Maricel","Ronald","Jennifer","Michael","Cristina","Roberto","Marites","Eduardo","Rosario","Patrick","Lovely","Jerome","Aileen","Dennis","Hazel","Neil","Rhodora","Adrian","Fatima","Jayson","Clarissa","Felix","Pamela","Roel"];
  const lastNames = ["Baldillo","Reyes","Santos","Cruz","Garcia","Mendoza","Torres","Flores","Villanueva","Ramos","Dela Cruz","Bautista","Aquino","Gonzales","Ramirez","Lopez","Castillo","Morales","Diaz","Hernandez","Soriano","Fernandez","Pascual","Evangelista","Aguilar","Navarro","Robles","Salazar","Miranda","Perez"];
  const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // 10 fixed starter rows matching your screenshot format
  const starter = [
    { name:"Bhem Baldillo",    dateApplied:new Date(2026,3,23), source:"Indeed",            position:"IT Head",           branch:"HO",         gender:"Male",   age:19, stage:"Screening",           offerAccepted:"", nps:"" },
    { name:"Wilbert Baldillo", dateApplied:new Date(2026,3,24), source:"Facebook",           position:"Branch Manager",    branch:"Agoo",       gender:"Male",   age:25, stage:"Screening",           offerAccepted:"", nps:"" },
    { name:"Maria Santos",     dateApplied:new Date(2026,3,10), source:"Walk In",            position:"Cashier",           branch:"Tuguegarao", gender:"Female", age:22, stage:"Initial Interview",    offerAccepted:"", nps:"" },
    { name:"Juan Reyes",       dateApplied:new Date(2026,3,5),  source:"Employee Referral",  position:"Loan Officer",      branch:"Cauayan",    gender:"Male",   age:30, stage:"Exam",                offerAccepted:"", nps:"" },
    { name:"Ana Garcia",       dateApplied:new Date(2026,2,28), source:"Job Fair",           position:"Teller",            branch:"Ilagan",     gender:"Female", age:24, stage:"Background Investigation", offerAccepted:"", nps:"" },
    { name:"Carla Mendoza",    dateApplied:new Date(2026,2,15), source:"School Referral",    position:"Accounting Staff",  branch:"Santiago",   gender:"Female", age:21, stage:"Final Interview",     offerAccepted:"", nps:"" },
    { name:"Mark Torres",      dateApplied:new Date(2026,2,10), source:"PESO Office",        position:"Operations Supervisor", branch:"Bayombong", gender:"Male", age:35, stage:"Orientation",        offerAccepted:"Yes", nps:"" },
    { name:"Liza Flores",      dateApplied:new Date(2026,1,20), source:"Facebook",           position:"HR Assistant",      branch:"Solano",     gender:"Female", age:27, stage:"Hired",               offerAccepted:"Yes", nps:"Yes", dateHired:new Date(2026,2,5),  daysToHire:13 },
    { name:"Ramon Cruz",       dateApplied:new Date(2026,1,14), source:"Indeed",             position:"Credit Analyst",    branch:"Aparri",     gender:"Male",   age:29, stage:"Hired",               offerAccepted:"Yes", nps:"Yes", dateHired:new Date(2026,2,1),  daysToHire:15 },
    { name:"Grace Villanueva", dateApplied:new Date(2026,0,30), source:"Recruitment Agency", position:"Branch Manager",    branch:"Roxas",      gender:"Female", age:38, stage:"Hired",               offerAccepted:"Yes", nps:"No",  dateHired:new Date(2026,2,10), daysToHire:39 },
  ].map(r => ({ ...r, ageGroup: ageBand(r.age), hired: r.stage === "Hired", daysToHire: r.daysToHire || null, dateHired: r.dateHired || null }));

  // Generate additional random rows for chart variety (past 12 months)
  const extra = [];
  for (let m = 0; m < 12; m++) {
    const cnt = 25 + Math.floor(Math.random() * 20);
    for (let i = 0; i < cnt; i++) {
      const da = new Date(2025, m, 1 + Math.floor(Math.random() * 27));
      const si = Math.floor(Math.random() * 8);
      const st = STAGES[si];
      const isHired = si === 7;
      const dth = isHired ? 10 + Math.floor(Math.random() * 20) : null;
      const dh = isHired ? new Date(da.getTime() + dth * 86400000) : null;
      const age = 18 + Math.floor(Math.random() * 35);
      extra.push({
        name: `${rand(firstNames)} ${rand(lastNames)}`,
        dateApplied: da, dateHired: dh,
        source: rand(sources), position: rand(positions), branch: rand(branches),
        gender: Math.random() < 0.55 ? "Female" : "Male",
        age, ageGroup: ageBand(age), stage: st, hired: isHired, daysToHire: dth,
        offerAccepted: isHired ? (Math.random() < 0.85 ? "Yes" : "No") : "",
        nps: isHired ? (Math.random() < 0.78 ? "Yes" : "No") : "",
      });
    }
  }
  return [...starter, ...extra];
};

// ─── Sub-components ───────────────────────────────────────────

function KpiCard({ icon, label, value, sub, color = PRIMARY, suffix = "" }) {
  const strLen = String(value).length;
  const fontSize = strLen > 12 ? 13 : strLen > 8 ? 16 : strLen > 5 ? 18 : 22;
  return (
    <Card size="small" styles={{ body: { padding: "12px 16px" } }}
      style={{ borderTop: `3px solid ${color}`, height: "100%" }}>
      <Space orientation="vertical" size={4} style={{ width: "100%" }}>
        <Space size={6}>
          <span style={{ fontSize: 16 }}>{icon}</span>
          <Text type="secondary" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>
            {label}
          </Text>
        </Space>
        <div style={{ fontSize, fontWeight: 800, lineHeight: 1.3, color, wordBreak: "break-word" }}>
          {value}{suffix}
        </div>
        <Text type="secondary" style={{ fontSize: 11 }}>{sub}</Text>
      </Space>
    </Card>
  );
}

function PipelineViz({ data }) {
  const counts = STAGES.map((s) => ({ s, n: data.filter((r) => r.stage === s).length }));
  return (
    <Row gutter={4} wrap={false} style={{ overflowX: "auto", paddingBottom: 4 }}>
      {counts.map((x, i) => (
        <Col key={x.s} flex="1" style={{ minWidth: 80, textAlign: "center" }}>
          <Card size="small" styles={{ body: { padding: "10px 6px" } }}
            style={{ borderColor: `${COLORS[i % COLORS.length]}44`, marginBottom: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: COLORS[i % COLORS.length] }}>{x.n}</div>
            <div style={{ fontSize: 10, color: "#888", marginTop: 2, lineHeight: 1.3 }}>{x.s}</div>
          </Card>
          {i < counts.length - 1 && (
            <Text type="secondary" style={{ fontSize: 14, display: "block", marginTop: 10 }}>›</Text>
          )}
        </Col>
      ))}
    </Row>
  );
}

function FunnelViz({ data }) {
  const total = data.length || 1;
  const rows = [
    { l: "Applications", n: data.length },
    { l: "Initial Interview", n: data.filter((r) => STAGES.indexOf(r.stage) >= 2).length },
    { l: "Exam", n: data.filter((r) => STAGES.indexOf(r.stage) >= 3).length },
    { l: "Background Inv.", n: data.filter((r) => STAGES.indexOf(r.stage) >= 4).length },
    { l: "Final Interview", n: data.filter((r) => STAGES.indexOf(r.stage) >= 5).length },
    { l: "Orientation", n: data.filter((r) => STAGES.indexOf(r.stage) >= 6).length },
    { l: "Hired", n: data.filter((r) => STAGES.indexOf(r.stage) >= 7 || r.hired).length },
  ];
  const max = rows[0].n || 1;
  return (
    <Space orientation="vertical" size={8} style={{ width: "100%" }}>
      {rows.map((f, i) => (
        <div key={f.l}>
          <Row justify="space-between" style={{ marginBottom: 2 }}>
            <Text style={{ fontSize: 11, color: "#666" }}>{f.l}</Text>
            <Space size={8}>
              <Text style={{ fontSize: 11, fontWeight: 700 }}>{f.n}</Text>
              <Text type="secondary" style={{ fontSize: 10 }}>{pct(f.n, total)}%</Text>
            </Space>
          </Row>
          <Progress
            percent={pct(f.n, max)} showInfo={false} size="small"
            strokeColor={COLORS[i % COLORS.length]} railColor="#f0f0f0"
          />
        </div>
      ))}
    </Space>
  );
}

function GenderViz({ data }) {
  const total = data.length || 1;
  const hired = data.filter((r) => r.hired || /hired/i.test(r.stage));
  const genders = [...new Set(data.map((r) => r.gender))].filter((g) => g && g !== "Unknown");
  if (!genders.length) return <Text type="secondary">No gender data available.</Text>;
  return (
    <Row gutter={[12, 12]}>
      {genders.map((g, i) => {
        const n = data.filter((r) => r.gender === g).length;
        const h = hired.filter((r) => r.gender === g).length;
        return (
          <Col key={g} xs={24} sm={12}>
            <Card size="small" styles={{ body: { textAlign: "center", padding: "14px 10px" } }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: COLORS[i] }}>{n}</div>
              <Text type="secondary" style={{ fontSize: 10 }}>{g} Applicants</Text>
              <div style={{ marginTop: 6, fontSize: 12, color: "#52c41a", fontWeight: 600 }}>
                {h} hired ({pct(h, n)}%)
              </div>
              <Progress percent={pct(n, total)} showInfo={false} size="small"
                strokeColor={COLORS[i]} style={{ marginTop: 8 }} />
              <Text type="secondary" style={{ fontSize: 10 }}>{pct(n, total)}% of total</Text>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}

function HeatmapViz({ data }) {
  const sources = [...new Set(data.map((r) => r.source))].sort().slice(0, 8);
  const stages = STAGES.slice(0, 7);
  const grid = {};
  data.forEach((r) => { const k = r.source + "||" + r.stage; grid[k] = (grid[k] || 0) + 1; });
  const maxV = Math.max(...Object.values(grid), 1);
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "separate", borderSpacing: 3, fontSize: 11, minWidth: "100%" }}>
        <thead>
          <tr>
            <th style={{ padding: "4px 8px", color: "#888", textAlign: "left", fontWeight: 700 }} />
            {stages.map((s) => (
              <th key={s} style={{ padding: "4px 6px", color: "#888", fontWeight: 700, fontSize: 10,
                writingMode: "vertical-rl", minWidth: 38, whiteSpace: "nowrap" }}>
                {s.length > 12 ? s.slice(0, 11) + "…" : s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sources.map((src) => (
            <tr key={src}>
              <td style={{ padding: "4px 8px", color: "#555", fontWeight: 600, whiteSpace: "nowrap" }}>{src}</td>
              {stages.map((st) => {
                const v = grid[src + "||" + st] || 0;
                const inten = v / maxV;
                const alpha = (0.12 + inten * 0.75).toFixed(2);
                const bg = `rgba(56,158,13,${alpha})`;
                const tc = inten > 0.5 ? "#fff" : "#555";
                return (
                  <Tooltip key={st} title={`${src} × ${st}: ${v}`}>
                    <td style={{ padding: 6, textAlign: "center", background: bg,
                      borderRadius: 4, color: tc, fontWeight: inten > 0.3 ? 700 : 400,
                      cursor: "default" }}>
                      {v || ""}
                    </td>
                  </Tooltip>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InsightsList({ data }) {
  if (!data.length) return <Alert title="No data available." type="info" />;
  const hired = data.filter((r) => r.hired || /hired/i.test(r.stage));
  const hireRate = pct(hired.length, data.length);
  const bySrc = groupBy(data, "source");
  const topSrc = Object.entries(bySrc).sort((a, b) => b[1].length - a[1].length)[0];
  const byPos = groupBy(data, "position");
  const topPos = Object.entries(byPos).sort((a, b) => b[1].length - a[1].length)[0];
  const byBr = groupBy(data, "branch");
  const topBr = Object.entries(byBr).sort((a, b) => b[1].length - a[1].length)[0];
  const ttArr = data.filter((r) => r.daysToHire > 0).map((r) => r.daysToHire);
  const avgTTH = ttArr.length ? Math.round(ttArr.reduce((a, b) => a + b, 0) / ttArr.length) : null;
  const npsArr = data.filter((r) => r.nps);
  const npsRate = npsArr.length ? pct(npsArr.filter((r) => /yes/i.test(r.nps)).length, npsArr.length) : null;
  const reserved = data.filter((r) => /reserved/i.test(r.stage)).length;

  const ins = [
    { color: PRIMARY, type: "success", text: `Overall hire rate stands at ${hireRate}% — ${hired.length} hired out of ${data.length} total applicants this period.` },
    topSrc && { color: "#1677ff", type: "info", text: `${topSrc[0]} is the top applicant source with ${topSrc[1].length} applicants (${pct(topSrc[1].length, data.length)}%). Prioritize budget here.` },
    topPos && { color: "#faad14", type: "warning", text: `${topPos[0]} is the most-applied position (${topPos[1].length} applicants). Check headcount targets.` },
    topBr && { color: "#722ed1", type: "info", text: `${topBr[0]} branch has highest recruitment activity (${topBr[1].length} applicants). Ensure interviewer capacity.` },
    avgTTH && { color: "#13c2c2", type: avgTTH > 15 ? "warning" : "success", text: `Average time-to-hire is ${avgTTH} days. ${avgTTH > 15 ? "Consider streamlining to reduce delay." : "Processing speed is within healthy range."}` },
    reserved > 0 && { color: "#f5222d", type: "error", text: `${reserved} reserved applicants (qualified but lacking requirements) are pending. Follow up to convert.` },
    npsRate != null && { color: PRIMARY, type: npsRate >= 75 ? "success" : npsRate >= 50 ? "warning" : "error", text: `Candidate NPS is ${npsRate}%. ${npsRate >= 75 ? "Excellent experience — maintain standards." : npsRate >= 50 ? "Moderate — review pain points." : "Below target — conduct exit surveys."}` },
  ].filter(Boolean);

  return (
    <Space orientation="vertical" size={10} style={{ width: "100%" }}>
      {ins.map((item, i) => (
        <Alert key={i} type={item.type} showIcon title={item.text}
          style={{ borderRadius: 8, fontSize: 13 }} />
      ))}
    </Space>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────
export default function RecruitmentDashboard() {
  const [raw, setRaw] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [allMonths, setAllMonths] = useState([]);
  const [selMonths, setSelMonths] = useState(new Set());
  const [filters, setFilters] = useState({ branch: "", position: "", source: "", gender: "", stage: "" });

  // Auto-load starter records on first render
  useEffect(() => { loadData(generateSample()); }, []);

  // Unique filter options
  const opts = (key) => [...new Set(raw.map((r) => r[key]))].sort().map((v) => ({ label: v, value: v }));

  // Apply filters whenever deps change
  useEffect(() => {
    if (!raw.length) return;
    const d = raw.filter((r) => {
      if (filters.branch && r.branch !== filters.branch) return false;
      if (filters.position && r.position !== filters.position) return false;
      if (filters.source && r.source !== filters.source) return false;
      if (filters.gender && r.gender !== filters.gender) return false;
      if (filters.stage && r.stage !== filters.stage) return false;
      if (r.dateApplied) {
        const mk = r.dateApplied.getFullYear() + "-" + String(r.dateApplied.getMonth() + 1).padStart(2, "0");
        if (!selMonths.has(mk)) return false;
      }
      return true;
    });
    setFiltered(d);
  }, [raw, filters, selMonths]);

  const loadData = (rows) => {
    const parsed = rows.map(parseRow).filter((r) => r.name || r.position || r.branch);
    if (!parsed.length) { alert("No valid rows found."); return; }
    const ms = new Set();
    parsed.forEach((r) => {
      if (r.dateApplied) ms.add(r.dateApplied.getFullYear() + "-" + String(r.dateApplied.getMonth() + 1).padStart(2, "0"));
    });
    const months = [...ms].sort();
    setAllMonths(months);
    setSelMonths(new Set(months));
    setRaw(parsed);
  };

  const handleFile = (file) => {
    const rd = new FileReader();
    rd.onload = (e) => {
      const wb = XLSX.read(new Uint8Array(e.target.result), { type: "array", cellDates: true });
      const ws = wb.Sheets[wb.SheetNames[0]];
      loadData(XLSX.utils.sheet_to_json(ws, { defval: "" }));
    };
    rd.readAsArrayBuffer(file);
    return false;
  };

  const resetFilters = () => {
    setFilters({ branch: "", position: "", source: "", gender: "", stage: "" });
    setSelMonths(new Set(allMonths));
  };

  // Derived KPIs
  const hired = filtered.filter((r) => r.hired || /hired/i.test(r.stage));
  const ttArr = filtered.filter((r) => r.daysToHire > 0).map((r) => r.daysToHire);
  const avgTTH = ttArr.length ? Math.round(ttArr.reduce((a, b) => a + b, 0) / ttArr.length) : null;
  const offered = filtered.filter((r) => r.offerAccepted);
  const accepted = offered.filter((r) => /yes/i.test(r.offerAccepted)).length;
  const npsArr = filtered.filter((r) => r.nps);
  const npsYes = npsArr.filter((r) => /yes/i.test(r.nps)).length;
  const bySrc = groupBy(filtered, "source");
  const topSrc = Object.entries(bySrc).sort((a, b) => b[1].length - a[1].length)[0];

  // Chart data builders
  const srcAppData = () => {
    const entries = Object.entries(bySrc).sort((a, b) => b[1].length - a[1].length);
    return {
      labels: entries.map((e) => e[0]),
      datasets: [{ label: "Applicants", data: entries.map((e) => e[1].length),
        backgroundColor: COLORS.map((c) => c + "99"), borderColor: COLORS, borderWidth: 1, borderRadius: 4 }],
    };
  };

  const srcHireData = () => {
    const byS = groupBy(hired, "source");
    const entries = Object.entries(byS).sort((a, b) => b[1].length - a[1].length);
    return {
      labels: entries.map((e) => e[0]),
      datasets: [{ data: entries.map((e) => e[1].length),
        backgroundColor: COLORS.slice(0, entries.length), borderWidth: 2, borderColor: "#fff", hoverOffset: 5 }],
    };
  };

  const monthlyData = () => {
    const byM = {}, byMH = {};
    filtered.forEach((r) => {
      if (!r.dateApplied) return;
      const k = r.dateApplied.getFullYear() + "-" + String(r.dateApplied.getMonth() + 1).padStart(2, "0");
      byM[k] = (byM[k] || 0) + 1;
      if (r.hired || /hired/i.test(r.stage)) byMH[k] = (byMH[k] || 0) + 1;
    });
    const labels = Object.keys(byM).sort();
    const pretty = labels.map((l) => { const [y, m] = l.split("-"); return new Date(y, m - 1).toLocaleDateString("en", { month: "short", year: "2-digit" }); });
    return {
      labels: pretty,
      datasets: [
        { label: "Applications", data: labels.map((k) => byM[k] || 0), borderColor: "#1677ff", backgroundColor: "rgba(22,119,255,0.1)", fill: true, tension: 0.4, pointRadius: 4, borderWidth: 2 },
        { label: "Hired", data: labels.map((k) => byMH[k] || 0), borderColor: PRIMARY, backgroundColor: "rgba(56,158,13,0.1)", fill: true, tension: 0.4, pointRadius: 4, borderWidth: 2 },
      ],
    };
  };

  const ageData = () => {
    const appCounts = AGE_BANDS.map((b) => filtered.filter((r) => r.ageGroup === b).length);
    const hireCounts = AGE_BANDS.map((b) => hired.filter((r) => r.ageGroup === b).length);
    return {
      labels: AGE_BANDS,
      datasets: [
        { label: "Applied", data: appCounts, backgroundColor: "rgba(22,119,255,0.6)", borderRadius: 4 },
        { label: "Hired", data: hireCounts, backgroundColor: "rgba(56,158,13,0.7)", borderRadius: 4 },
      ],
    };
  };

  // Position table
  const posEntries = Object.entries(groupBy(filtered, "position"))
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 10)
    .map((e, i) => ({ key: i, rank: i + 1, position: e[0], applied: e[1].length, hired: hired.filter((r) => r.position === e[0]).length }));

  const branchEntries = Object.entries(groupBy(filtered, "branch"))
    .sort((a, b) => b[1].length - a[1].length)
    .map((e, i) => ({ key: i, rank: i + 1, branch: e[0], applied: e[1].length, hired: hired.filter((r) => r.branch === e[0]).length }));

  const rankColor = (r) => r === 1 ? "#faad14" : r === 2 ? "#1677ff" : r === 3 ? "#722ed1" : "#888";


  if (!raw.length) {
    return (
      <div style={{ padding: 32 }}>
        <Card>
          <div style={{ textAlign: "center", padding: "32px 24px 24px" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <Title level={3} style={{ marginBottom: 4 }}>Recruitment Dashboard</Title>
            <Text type="secondary">Human Resource Division · Recruitment &amp; Hiring Department</Text>
            <Divider />
            <Row gutter={[16, 16]} style={{ maxWidth: 680, margin: "0 auto 24px" }}>
              <Col span={24}>
                <Upload.Dragger accept=".xlsx,.xls,.csv" beforeUpload={handleFile} showUploadList={false}>
                  <p className="ant-upload-drag-icon"><UploadOutlined style={{ fontSize: 28, color: PRIMARY }} /></p>
                  <p className="ant-upload-text">Click or drag your Excel / CSV file here</p>
                  <p className="ant-upload-hint">
                    Expected columns: Applicant Name · Date Applied · Source · Position · Branch · Gender · Age · Stage · Date Hired · Days to Hire · Offer Accepted · NPS
                  </p>
                </Upload.Dragger>
              </Col>
              <Col span={24} style={{ textAlign: "center" }}>
                <Text type="secondary">Don't have a file yet? </Text>
                <Button type="primary" size="small" onClick={() => loadData(generateSample())}>
                  Load 400+ sample records
                </Button>
              </Col>
            </Row>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px 12px 40px" }} className="recruitment-dashboard">
      {/* Status bar */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Space>
          <Badge status="success" text={<Text strong>Data loaded</Text>} />
          <Tag color="green">{raw.length} records</Tag>
        </Space>
        <Button size="small" icon={<UploadOutlined />} onClick={() => setRaw([])}>Upload New File</Button>
      </Row>

      {/* FILTERS */}
      <Card size="small" style={{ marginBottom: 20 }}>
        <Row gutter={[12, 12]} align="bottom">
          {[
            { label: "Branch", key: "branch" },
            { label: "Position", key: "position" },
            { label: "Source", key: "source" },
            { label: "Stage", key: "stage" },
          ].map(({ label, key }) => (
            <Col key={key} xs={24} sm={12} md={4}>
              <div style={{ marginBottom: 4 }}>
                <Text type="secondary" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</Text>
              </div>
              <Select allowClear placeholder={`All ${label}s`} style={{ width: "100%" }}
                options={opts(key)} value={filters[key] || undefined}
                onChange={(v) => setFilters((f) => ({ ...f, [key]: v || "" }))} />
            </Col>
          ))}
          <Col xs={24} sm={12} md={4}>
            <div style={{ marginBottom: 4 }}>
              <Text type="secondary" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Gender</Text>
            </div>
            <Select allowClear placeholder="All" style={{ width: "100%" }}
              options={[{ label: "Male", value: "Male" }, { label: "Female", value: "Female" }]}
              value={filters.gender || undefined}
              onChange={(v) => setFilters((f) => ({ ...f, gender: v || "" }))} />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button icon={<ReloadOutlined />} onClick={resetFilters} block>Reset</Button>
          </Col>
        </Row>
      </Card>

      {/* TIMELINE */}
      <Card size="small" style={{ marginBottom: 20 }}>
        <Row align="middle" gutter={[8, 8]}>
          <Col>
            <Text type="secondary" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Month</Text>
          </Col>
          <Col flex={1}>
            <Space size={4} wrap>
              {allMonths.map((m) => {
                const [y, mo] = m.split("-");
                const lbl = new Date(y, mo - 1).toLocaleDateString("en", { month: "short", year: "2-digit" });
                const on = selMonths.has(m);
                return (
                  <Tag key={m} color={on ? "green" : "default"} style={{ cursor: "pointer", userSelect: "none" }}
                    onClick={() => setSelMonths((prev) => {
                      const next = new Set(prev);
                      next.has(m) ? next.delete(m) : next.add(m);
                      return next;
                    })}>
                    {lbl}
                  </Tag>
                );
              })}
            </Space>
          </Col>
          <Col>
            <Button size="small" type="link" onClick={() => setSelMonths(new Set(allMonths))}>All</Button>
          </Col>
        </Row>
      </Card>

      {/* KPIs */}
      <Divider titlePlacement="left" style={{ fontSize: 11, color: "#888" }} styles={{ content: { margin: "0 8px 0 0" } }}>KEY PERFORMANCE INDICATORS</Divider>
      <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={12} md={8} lg={4}>
          <KpiCard icon="📥" label="Total Applicants" value={filtered.length} color="#1677ff"
            sub={`${pct(hired.length, filtered.length)}% hire rate`} />
        </Col>
        <Col xs={12} sm={12} md={8} lg={4}>
          <KpiCard icon="✅" label="Total Hired" value={hired.length} color={PRIMARY}
            sub={`${hired.length} confirmed hires`} />
        </Col>
        <Col xs={12} sm={12} md={8} lg={4}>
          <KpiCard icon="⏱️" label="Avg Time to Hire" value={avgTTH != null ? avgTTH : "N/A"} suffix={avgTTH != null ? "d" : ""}
            color="#faad14" sub={`${ttArr.length} data points`} />
        </Col>
        <Col xs={12} sm={12} md={8} lg={4}>
          <KpiCard icon="🎯" label="Offer Acceptance" value={offered.length ? `${pct(accepted, offered.length)}%` : "N/A"}
            color="#13c2c2" sub={`${accepted} of ${offered.length} offers`} />
        </Col>
        <Col xs={12} sm={12} md={8} lg={4}>
          <KpiCard icon="📣" label="Top Source" value={topSrc ? topSrc[0] : "—"}
            color="#722ed1" sub={topSrc ? `${topSrc[1].length} applicants` : ""} />
        </Col>
        <Col xs={12} sm={12} md={8} lg={4}>
          <KpiCard icon="⭐" label="Candidate NPS" value={npsArr.length ? `${pct(npsYes, npsArr.length)}%` : "N/A"}
            color={PRIMARY} sub={`${npsArr.length} respondents`} />
        </Col>
      </Row>

      {/* PIPELINE */}
      <Divider titlePlacement="left" style={{ fontSize: 11, color: "#888" }} styles={{ content: { margin: "0 8px 0 0" } }}>APPLICANT PIPELINE</Divider>
      <Card title="Stage Distribution" size="small" style={{ marginBottom: 24 }}
        extra={<Text type="secondary" style={{ fontSize: 11 }}>Count per recruitment stage</Text>}>
        <PipelineViz data={filtered} />
      </Card>

      {/* FUNNEL + STAGE TIME */}
      <Divider titlePlacement="left" style={{ fontSize: 11, color: "#888" }} styles={{ content: { margin: "0 8px 0 0" } }}>RECRUITMENT FUNNEL</Divider>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Recruitment Funnel" size="small" extra={<Text type="secondary" style={{ fontSize: 11 }}>Drop-off per stage</Text>}>
            <FunnelViz data={filtered} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Avg. Days per Stage" size="small">
            <div style={{ height: "clamp(180px, 30vw, 220px)" }}>
              <Bar data={{
                labels: ["Screening", "Initial Int.", "Exam", "BG Invest.", "Final Int.", "Orientation"],
                datasets: [{ label: "Avg Days", data: [6, 8, 10, 14, 12, 7], backgroundColor: COLORS.slice(0, 6), borderRadius: 6, borderSkipped: false }],
              }} options={{ ...CHART_OPTS, plugins: { legend: { display: false } } }} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* SOURCING */}
      <Divider titlePlacement="left" style={{ fontSize: 11, color: "#888" }} styles={{ content: { margin: "0 8px 0 0" } }}>SOURCING METRICS</Divider>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Source of Application" size="small">
            <div style={{ height: "clamp(200px, 35vw, 240px)" }}>
              <Bar data={srcAppData()} options={{ ...CHART_OPTS, indexAxis: "y", plugins: { legend: { display: false } } }} />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Hired by Source" size="small">
            <div style={{ height: "clamp(200px, 35vw, 240px)" }}>
              <Doughnut data={srcHireData()} options={{ responsive: true, maintainAspectRatio: false, cutout: "58%",
                plugins: { legend: { position: "right", labels: { font: { size: 10 }, boxWidth: 9, padding: 6 } } } }} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* MONTHLY + AGE */}
      <Divider titlePlacement="left" style={{ fontSize: 11, color: "#888" }} styles={{ content: { margin: "0 8px 0 0" } }}>APPLICANT DISTRIBUTION</Divider>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Applications & Hires by Month" size="small">
            <div style={{ height: "clamp(200px, 35vw, 230px)" }}>
              <Line data={monthlyData()} options={{ ...CHART_OPTS, plugins: { legend: { labels: { font: { size: 11 }, boxWidth: 10, padding: 12 } } } }} />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Age Group Distribution" size="small">
            <div style={{ height: "clamp(200px, 35vw, 230px)" }}>
              <Bar data={ageData()} options={{ ...CHART_OPTS, plugins: { legend: { labels: { font: { size: 11 }, boxWidth: 10, padding: 12 } } } }} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* GENDER + OUTCOMES */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Gender Breakdown" size="small">
            <GenderViz data={filtered} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Stage Outcome Distribution" size="small">
            <div style={{ height: "clamp(200px, 35vw, 230px)" }}>
              <Bar data={{
                labels: ["Screening", "Recruitment", "Hiring", "Contract Signing"],
                datasets: [
                  { label: "Qualified", data: [35, 28, 22, 18], backgroundColor: PRIMARY + "cc", borderRadius: 4 },
                  { label: "Failed", data: [20, 15, 10, 5], backgroundColor: "#f5222dcc", borderRadius: 4 },
                  { label: "Non-Compliant", data: [10, 8, 5, 3], backgroundColor: "#faad14cc", borderRadius: 4 },
                  { label: "On Process", data: [25, 20, 15, 10], backgroundColor: "#1677ffcc", borderRadius: 4 },
                ],
              }} options={{ ...CHART_OPTS, plugins: { legend: { labels: { font: { size: 10 }, boxWidth: 9, padding: 8 } } },
                scales: { x: { stacked: true, grid: { display: false }, ticks: { color: "#888", font: { size: 10 } } }, y: { stacked: true, ticks: { color: "#888", font: { size: 10 } } } } }} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* TABLES */}
      <Divider titlePlacement="left" style={{ fontSize: 11, color: "#888" }} styles={{ content: { margin: "0 8px 0 0" } }}>DEEP ANALYSIS</Divider>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Top Positions Applied" size="small">
            <Table size="small" pagination={false} dataSource={posEntries}
              columns={[
                { title: "#", dataIndex: "rank", width: 36, render: (v) => <span style={{ fontWeight: 800, color: rankColor(v) }}>{v}</span> },
                { title: "Position", dataIndex: "position" },
                { title: "Applied", dataIndex: "applied", align: "right" },
                { title: "Hired", dataIndex: "hired", align: "right" },
                { title: "Rate", key: "rate", align: "right", render: (_, r) => <Tag color="green">{pct(r.hired, r.applied)}%</Tag> },
              ]} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Branch Breakdown" size="small">
            <Table size="small" pagination={false} dataSource={branchEntries}
              columns={[
                { title: "#", dataIndex: "rank", width: 36, render: (v) => <span style={{ fontWeight: 800, color: rankColor(v) }}>{v}</span> },
                { title: "Branch", dataIndex: "branch" },
                { title: "Applied", dataIndex: "applied", align: "right" },
                { title: "Hired", dataIndex: "hired", align: "right" },
                { title: "Rate", key: "rate", align: "right", render: (_, r) => <Tag color="green">{pct(r.hired, r.applied)}%</Tag> },
              ]} />
          </Card>
        </Col>
        <Col xs={24}>
          <Card title="Source × Stage Heatmap" size="small"
            extra={<Text type="secondary" style={{ fontSize: 11 }}>Applicant volume intensity matrix</Text>}>
            <HeatmapViz data={filtered} />
          </Card>
        </Col>
      </Row>

      {/* INSIGHTS */}
      <Divider titlePlacement="left" style={{ fontSize: 11, color: "#888" }} styles={{ content: { margin: "0 8px 0 0" } }}>RECRUITMENT INSIGHTS</Divider>
      <Card title="AI-Style Recruitment Insights" size="small">
        <InsightsList data={filtered} />
      </Card>
    </div>
  );
}