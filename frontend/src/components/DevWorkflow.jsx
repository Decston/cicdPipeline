"use client";

import { useState, useRef, useEffect } from "react";

// ─── Paleta & tipografia (inline styles via CSS vars) ───────────────────────
const THEME = {
  bg: "#0d1117",
  surface: "#161b22",
  border: "#30363d",
  accent: "#58a6ff",
  green: "#3fb950",
  yellow: "#d29922",
  red: "#f85149",
  purple: "#bc8cff",
  text: "#c9d1d9",
  muted: "#8b949e",
  fontMono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  fontSans: "'Outfit', 'DM Sans', sans-serif",
};

// ─── Dados dos passos ────────────────────────────────────────────────────────
const STEPS = [
  { id: "branch", label: "01 · Branch", icon: "⎇" },
  { id: "code",   label: "02 · Code",   icon: "⌨" },
  { id: "commit", label: "03 · Commit", icon: "✦" },
  { id: "pr",     label: "04 · PR",     icon: "⤴" },
  { id: "ci",     label: "05 · CI/CD",  icon: "⚙" },
];

// ─── Componente principal ────────────────────────────────────────────────────
export default function DevWorkflow() {
  const [step, setStep] = useState(0); // 0..4
  const [done, setDone] = useState([]); // índices concluídos

  const markDone = (i) => setDone((p) => [...new Set([...p, i])]);
  const goNext   = (i) => { markDone(i); setStep(i + 1); };

  return (
    <div style={s.root}>
      <GoogleFonts />
      <header style={s.header}>
        <span style={s.logo}>⬡ devflow</span>
        <span style={s.subtitle}>Simulated Git Workflow</span>
      </header>

      {/* Stepper */}
      <nav style={s.stepper}>
        {STEPS.map((st, i) => (
          <button
            key={st.id}
            style={{
              ...s.stepBtn,
              ...(i === step ? s.stepActive : {}),
              ...(done.includes(i) ? s.stepDone : {}),
            }}
            onClick={() => (done.includes(i) || i === step) && setStep(i)}
          >
            <span style={s.stepIcon}>{st.icon}</span>
            <span>{st.label}</span>
            {done.includes(i) && <span style={s.check}>✓</span>}
          </button>
        ))}
      </nav>

      {/* Painel ativo */}
      <main style={s.panel}>
        {step === 0 && <StepBranch onDone={() => goNext(0)} />}
        {step === 1 && <StepCode   onDone={() => goNext(1)} />}
        {step === 2 && <StepCommit onDone={() => goNext(2)} />}
        {step === 3 && <StepPR     onDone={() => goNext(3)} />}
        {step === 4 && <StepCI />}
      </main>
    </div>
  );
}

// ─── STEP 1 – Git Branch ─────────────────────────────────────────────────────
function StepBranch({ onDone }) {
  const PROMPTS = [
    { cmd: "git checkout main", out: "Switched to branch 'main'" },
    { cmd: "git pull origin main", out: "Already up to date." },
    { cmd: "git checkout -b feat/my-feature", out: "Switched to a new branch 'feat/my-feature'" },
  ];
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [idx, setIdx] = useState(0);
  const [error, setError] = useState("");
  const ref = useRef();

  useEffect(() => { ref.current?.focus(); }, []);

  const handleKey = (e) => {
    if (e.key !== "Enter") return;
    const val = input.trim();
    if (!val) return;

    if (val === PROMPTS[idx].cmd) {
      setHistory((h) => [...h, { cmd: val, out: PROMPTS[idx].out, ok: true }]);
      setInput("");
      setError("");
      if (idx + 1 === PROMPTS.length) {
        setTimeout(onDone, 600);
      } else {
        setIdx((i) => i + 1);
      }
    } else {
      setHistory((h) => [...h, { cmd: val, out: `bash: command not recognized`, ok: false }]);
      setInput("");
      setError(`💡 Dica: tente "${PROMPTS[idx].cmd}"`);
    }
  };

  return (
    <div style={s.stepWrap}>
      <h2 style={s.stepTitle}>Criar uma branch de feature</h2>
      <p style={s.stepDesc}>
        Execute os comandos abaixo no terminal Git Bash simulado.<br />
        <span style={{ color: THEME.muted }}>
          Comando esperado: <code style={s.code}>{PROMPTS[idx].cmd}</code>
        </span>
      </p>
      <div style={s.terminal}>
        <TerminalBar title="Git Bash" />
        <div style={s.termBody}>
          {history.map((h, i) => (
            <div key={i}>
              <div style={s.termLine}>
                <span style={s.prompt}>~/project $</span>
                <span style={s.termCmd}>{h.cmd}</span>
              </div>
              <div style={{ color: h.ok ? THEME.green : THEME.red, paddingLeft: 16, marginBottom: 6 }}>
                {h.out}
              </div>
            </div>
          ))}
          <div style={s.termLine}>
            <span style={s.prompt}>~/project $</span>
            <input
              ref={ref}
              style={s.termInput}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              spellCheck={false}
              autoComplete="off"
              placeholder="digite o comando…"
            />
          </div>
          {error && <div style={{ color: THEME.yellow, fontSize: 12, paddingLeft: 16, marginTop: 4 }}>{error}</div>}
        </div>
      </div>
      <ProgressBar total={PROMPTS.length} done={idx} />
    </div>
  );
}

// ─── STEP 2 – Code Editor ────────────────────────────────────────────────────
function StepCode({ onDone }) {
  const placeholder = `// Escreva sua feature aqui
// Exemplo:
function greet(name) {
  return \`Hello, \${name}!\`;
}

module.exports = { greet };`;

  const [code, setCode] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!code.trim()) return;
    setSaved(true);
    setTimeout(onDone, 800);
  };

  return (
    <div style={s.stepWrap}>
      <h2 style={s.stepTitle}>Escrever o código</h2>
      <p style={s.stepDesc}>
        Edite o arquivo <code style={s.code}>src/feature.js</code> com sua implementação.
      </p>
      <div style={s.editorWrap}>
        <EditorBar filename="src/feature.js" saved={saved} />
        <div style={{ display: "flex" }}>
          <LineNumbers count={Math.max(code.split("\n").length, 12)} />
          <textarea
            style={s.editor}
            value={code}
            onChange={(e) => { setCode(e.target.value); setSaved(false); }}
            placeholder={placeholder}
            spellCheck={false}
          />
        </div>
      </div>
      <div style={s.actions}>
        <span style={{ color: THEME.muted, fontSize: 13 }}>
          {code.trim() ? `${code.split("\n").length} linhas · ${code.length} chars` : "Arquivo vazio"}
        </span>
        <button
          style={{ ...s.btn, ...(code.trim() ? {} : s.btnDisabled) }}
          disabled={!code.trim()}
          onClick={handleSave}
        >
          {saved ? "✓ Salvo!" : "💾 Salvar arquivo"}
        </button>
      </div>
    </div>
  );
}

// ─── STEP 3 – Git Add / Commit / Merge ──────────────────────────────────────
function StepCommit({ onDone }) {
  const FLOW = [
    { cmd: "git status",                   out: "modified:   src/feature.js" },
    { cmd: "git add src/feature.js",       out: "Changes staged for commit." },
    { cmd: 'git commit -m "feat: my feature"', out: "[feat/my-feature abc1234] feat: my feature\n 1 file changed, 10 insertions(+)" },
    { cmd: "git push origin feat/my-feature", out: "Branch 'feat/my-feature' set up to track remote." },
  ];
  const [history, setHistory] = useState([]);
  const [input, setInput]   = useState("");
  const [idx, setIdx]       = useState(0);
  const [error, setError]   = useState("");
  const ref = useRef();

  useEffect(() => { ref.current?.focus(); }, []);

  const handleKey = (e) => {
    if (e.key !== "Enter") return;
    const val = input.trim();
    if (!val) return;
    if (val === FLOW[idx].cmd) {
      setHistory((h) => [...h, { cmd: val, out: FLOW[idx].out, ok: true }]);
      setInput(""); setError("");
      if (idx + 1 === FLOW.length) setTimeout(onDone, 600);
      else setIdx((i) => i + 1);
    } else {
      setHistory((h) => [...h, { cmd: val, out: "bash: command not recognized", ok: false }]);
      setInput("");
      setError(`💡 "${FLOW[idx].cmd}"`);
    }
  };

  return (
    <div style={s.stepWrap}>
      <h2 style={s.stepTitle}>Add · Commit · Push</h2>
      <p style={s.stepDesc}>
        Adicione, faça commit e envie as alterações.<br />
        <span style={{ color: THEME.muted }}>Próximo: <code style={s.code}>{FLOW[idx]?.cmd}</code></span>
      </p>
      <div style={s.terminal}>
        <TerminalBar title="Git Bash" />
        <div style={s.termBody}>
          {history.map((h, i) => (
            <div key={i}>
              <div style={s.termLine}>
                <span style={s.prompt}>~/project (feat/my-feature) $</span>
                <span style={s.termCmd}>{h.cmd}</span>
              </div>
              {h.out.split("\n").map((line, j) => (
                <div key={j} style={{ color: h.ok ? THEME.green : THEME.red, paddingLeft: 16, marginBottom: 2 }}>{line}</div>
              ))}
            </div>
          ))}
          {idx < FLOW.length && (
            <div style={s.termLine}>
              <span style={s.prompt}>~/project (feat/my-feature) $</span>
              <input ref={ref} style={s.termInput} value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey} spellCheck={false} autoComplete="off"
                placeholder="digite o comando…" />
            </div>
          )}
          {error && <div style={{ color: THEME.yellow, fontSize: 12, paddingLeft: 16, marginTop: 4 }}>{error}</div>}
        </div>
      </div>
      <ProgressBar total={FLOW.length} done={idx} />
    </div>
  );
}

// ─── STEP 4 – Pull Request ───────────────────────────────────────────────────
function StepPR({ onDone }) {
  const [title, setTitle]   = useState("feat: my feature");
  const [body, setBody]     = useState("## O que mudou\n\n- Adicionei `greet()` em `src/feature.js`\n\n## Como testar\n\n```bash\nnode -e \"require('./src/feature').greet('World')\"\n```");
  const [opened, setOpened] = useState(false);

  const openPR = () => { setOpened(true); setTimeout(onDone, 800); };

  return (
    <div style={s.stepWrap}>
      <h2 style={s.stepTitle}>Abrir Pull Request</h2>
      <p style={s.stepDesc}>
        <span style={prS.badge("purple")}>feat/my-feature</span>
        {" → "}
        <span style={prS.badge("blue")}>main</span>
      </p>

      {!opened ? (
        <div style={prS.form}>
          <label style={prS.label}>Título</label>
          <input style={prS.input} value={title} onChange={(e) => setTitle(e.target.value)} />
          <label style={prS.label}>Descrição</label>
          <textarea style={prS.textarea} value={body} onChange={(e) => setBody(e.target.value)} rows={8} />
          <div style={s.actions}>
            <Reviewers />
            <button style={s.btn} onClick={openPR}>⤴ Abrir PR</button>
          </div>
        </div>
      ) : (
        <PRCard title={title} body={body} />
      )}
    </div>
  );
}

const prS = {
  badge: (color) => ({
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontFamily: THEME.fontMono,
    background: color === "purple" ? "#3d1d6b" : "#0d2440",
    color: color === "purple" ? THEME.purple : THEME.accent,
    border: `1px solid ${color === "purple" ? THEME.purple : THEME.accent}`,
  }),
  form: { display: "flex", flexDirection: "column", gap: 12 },
  label: { color: THEME.muted, fontSize: 12, fontFamily: THEME.fontSans, letterSpacing: "0.08em", textTransform: "uppercase" },
  input: {
    background: THEME.bg, border: `1px solid ${THEME.border}`, borderRadius: 6,
    color: THEME.text, fontFamily: THEME.fontSans, fontSize: 14, padding: "8px 12px", outline: "none",
  },
  textarea: {
    background: THEME.bg, border: `1px solid ${THEME.border}`, borderRadius: 6,
    color: THEME.text, fontFamily: THEME.fontMono, fontSize: 13, padding: "8px 12px",
    outline: "none", resize: "vertical",
  },
};

function PRCard({ title, body }) {
  return (
    <div style={{ border: `1px solid ${THEME.green}`, borderRadius: 10, padding: 20, background: "#0d1f0d" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 20 }}>⤴</span>
        <span style={{ color: THEME.green, fontFamily: THEME.fontSans, fontWeight: 700, fontSize: 16 }}>PR #42 — {title}</span>
        <span style={{ ...prS.badge("green"), background: "#0d2a0d", color: THEME.green, border: `1px solid ${THEME.green}` }}>Open</span>
      </div>
      <pre style={{ color: THEME.text, fontFamily: THEME.fontMono, fontSize: 12, whiteSpace: "pre-wrap", margin: 0 }}>{body}</pre>
    </div>
  );
}

function Reviewers() {
  const avatars = ["🧑‍💻", "👩‍💻", "🧑‍🔬"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ color: THEME.muted, fontSize: 12 }}>Revisores:</span>
      {avatars.map((a, i) => (
        <span key={i} style={{ fontSize: 18, cursor: "default" }} title={`dev-${i + 1}`}>{a}</span>
      ))}
    </div>
  );
}

// ─── STEP 5 – CI/CD Pipeline ─────────────────────────────────────────────────
function StepCI() {
  const JOBS = [
    { name: "Lint",          duration: 1200 },
    { name: "Unit Tests",    duration: 2400 },
    { name: "Build",         duration: 3200 },
    { name: "Docker Push",   duration: 1800 },
    { name: "Deploy Staging",duration: 2600 },
  ];
  const [statuses, setStatuses] = useState(JOBS.map(() => "pending"));
  const [running, setRunning]   = useState(false);
  const [log, setLog]           = useState([]);

  const run = () => {
    if (running) return;
    setRunning(true);
    setStatuses(JOBS.map(() => "pending"));
    setLog([]);
    let acc = 0;
    JOBS.forEach((job, i) => {
      acc += i === 0 ? 400 : JOBS[i - 1].duration;
      setTimeout(() => {
        setStatuses((s) => { const n = [...s]; n[i] = "running"; return n; });
        setLog((l) => [...l, `▶ [${job.name}] started`]);
      }, acc);
      acc += job.duration;
      setTimeout(() => {
        setStatuses((s) => { const n = [...s]; n[i] = "success"; return n; });
        setLog((l) => [...l, `✓ [${job.name}] passed`]);
      }, acc);
    });
  };

  const overall = statuses.every((s) => s === "success")
    ? "success" : statuses.some((s) => s === "running") ? "running" : "pending";

  return (
    <div style={s.stepWrap}>
      <h2 style={s.stepTitle}>CI/CD Pipeline</h2>
      <p style={s.stepDesc}>Disparado pelo PR · branch <code style={s.code}>feat/my-feature</code></p>

      <div style={ciS.pipeline}>
        {JOBS.map((job, i) => (
          <div key={i} style={ciS.job(statuses[i])}>
            <span style={ciS.jobIcon(statuses[i])}>
              {statuses[i] === "success" ? "✓" : statuses[i] === "running" ? "⟳" : "○"}
            </span>
            <div>
              <div style={{ color: THEME.text, fontFamily: THEME.fontSans, fontSize: 14, fontWeight: 600 }}>{job.name}</div>
              <div style={{ color: THEME.muted, fontSize: 11 }}>
                {statuses[i] === "success" ? `${(job.duration / 1000).toFixed(1)}s` :
                 statuses[i] === "running" ? "em execução…" : "aguardando"}
              </div>
            </div>
            {i < JOBS.length - 1 && <div style={ciS.arrow}>→</div>}
          </div>
        ))}
      </div>

      {/* Log */}
      <div style={ciS.log}>
        {log.length === 0 && <span style={{ color: THEME.muted }}>Nenhuma execução ainda…</span>}
        {log.map((l, i) => (
          <div key={i} style={{ color: l.startsWith("✓") ? THEME.green : THEME.accent }}>{l}</div>
        ))}
      </div>

      <div style={{ ...s.actions, marginTop: 16 }}>
        <StatusBadge status={overall} />
        <button
          style={{ ...s.btn, ...(running && overall !== "success" ? s.btnDisabled : {}) }}
          onClick={run}
          disabled={running && overall !== "success"}
        >
          {overall === "success" ? "✓ Pipeline concluído!" : running ? "⟳ Rodando…" : "▶ Rodar Pipeline"}
        </button>
      </div>
    </div>
  );
}

const ciS = {
  pipeline: {
    display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center",
    background: THEME.bg, border: `1px solid ${THEME.border}`,
    borderRadius: 10, padding: 20, marginBottom: 12,
  },
  job: (status) => ({
    display: "flex", alignItems: "center", gap: 8,
    background: status === "success" ? "#0d2a0d" : status === "running" ? "#1a1a0d" : THEME.surface,
    border: `1px solid ${status === "success" ? THEME.green : status === "running" ? THEME.yellow : THEME.border}`,
    borderRadius: 8, padding: "10px 14px", transition: "all 0.3s",
  }),
  jobIcon: (status) => ({
    fontSize: 18,
    color: status === "success" ? THEME.green : status === "running" ? THEME.yellow : THEME.muted,
    animation: status === "running" ? "spin 1s linear infinite" : "none",
  }),
  arrow: { color: THEME.muted, fontSize: 18, marginLeft: 8 },
  log: {
    background: THEME.bg, border: `1px solid ${THEME.border}`, borderRadius: 8,
    padding: 12, fontFamily: THEME.fontMono, fontSize: 12, minHeight: 80,
    maxHeight: 160, overflowY: "auto", display: "flex", flexDirection: "column", gap: 3,
  },
};

function StatusBadge({ status }) {
  const map = {
    pending: { color: THEME.muted, label: "● Aguardando" },
    running: { color: THEME.yellow, label: "⟳ Rodando" },
    success: { color: THEME.green,  label: "✓ Aprovado" },
  };
  const { color, label } = map[status];
  return <span style={{ color, fontFamily: THEME.fontSans, fontSize: 13, fontWeight: 600 }}>{label}</span>;
}

// ─── Sub-componentes reutilizáveis ───────────────────────────────────────────
function TerminalBar({ title }) {
  return (
    <div style={s.termBar}>
      <div style={{ display: "flex", gap: 6 }}>
        {["#f85149", "#d29922", "#3fb950"].map((c, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
        ))}
      </div>
      <span style={{ color: THEME.muted, fontSize: 12, fontFamily: THEME.fontSans }}>{title}</span>
      <div />
    </div>
  );
}

function EditorBar({ filename, saved }) {
  return (
    <div style={{ ...s.termBar, background: "#1c2128" }}>
      <div style={{ display: "flex", gap: 4 }}>
        {["#f85149", "#d29922", "#3fb950"].map((c, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
        ))}
      </div>
      <span style={{ color: saved ? THEME.green : THEME.accent, fontSize: 12, fontFamily: THEME.fontMono }}>
        {filename}{saved ? " ✓" : " ●"}
      </span>
      <span style={{ color: THEME.muted, fontSize: 11 }}>JavaScript</span>
    </div>
  );
}

function LineNumbers({ count }) {
  return (
    <div style={s.lineNums}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>{i + 1}</div>
      ))}
    </div>
  );
}

function ProgressBar({ total, done }) {
  const pct = Math.round((done / total) * 100);
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ color: THEME.muted, fontSize: 11, fontFamily: THEME.fontSans }}>Progresso do passo</span>
        <span style={{ color: THEME.accent, fontSize: 11, fontFamily: THEME.fontMono }}>{done}/{total}</span>
      </div>
      <div style={{ height: 4, background: THEME.border, borderRadius: 4 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: THEME.accent, borderRadius: 4, transition: "width 0.4s" }} />
      </div>
    </div>
  );
}

function GoogleFonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Outfit:wght@400;600;700&display=swap');
      @keyframes spin { to { transform: rotate(360deg); } }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      textarea:focus, input:focus { outline: none; }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: ${THEME.bg}; }
      ::-webkit-scrollbar-thumb { background: ${THEME.border}; border-radius: 3px; }
    `}</style>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = {
  root: {
    background: THEME.bg,
    color: THEME.text,
    fontFamily: THEME.fontSans,
    minHeight: "100vh",
    padding: "32px 24px",
    maxWidth: 900,
    margin: "0 auto",
  },
  header: {
    display: "flex", alignItems: "baseline", gap: 16, marginBottom: 32,
    borderBottom: `1px solid ${THEME.border}`, paddingBottom: 20,
  },
  logo: {
    fontFamily: THEME.fontSans, fontWeight: 700, fontSize: 22,
    color: THEME.accent, letterSpacing: "-0.02em",
  },
  subtitle: { color: THEME.muted, fontSize: 13 },
  stepper: {
    display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28,
  },
  stepBtn: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "8px 14px", borderRadius: 8, border: `1px solid ${THEME.border}`,
    background: THEME.surface, color: THEME.muted,
    fontFamily: THEME.fontSans, fontSize: 13, cursor: "pointer",
    transition: "all 0.2s",
  },
  stepActive: {
    background: "#0d2040", borderColor: THEME.accent, color: THEME.accent,
  },
  stepDone: {
    background: "#0d2a0d", borderColor: THEME.green, color: THEME.green,
  },
  stepIcon: { fontSize: 16 },
  check:    { color: THEME.green, fontWeight: 700 },

  panel: {
    background: THEME.surface, borderRadius: 12,
    border: `1px solid ${THEME.border}`, padding: 28,
    minHeight: 400,
  },
  stepWrap: { display: "flex", flexDirection: "column", gap: 16 },
  stepTitle: { fontFamily: THEME.fontSans, fontSize: 20, fontWeight: 700, color: THEME.text },
  stepDesc:  { color: THEME.muted, fontSize: 14, lineHeight: 1.6 },
  code:      { fontFamily: THEME.fontMono, fontSize: 12, color: THEME.accent, background: "#0d2040", padding: "1px 6px", borderRadius: 4 },

  terminal: { borderRadius: 10, overflow: "hidden", border: `1px solid ${THEME.border}` },
  termBar: {
    background: "#21262d", padding: "8px 14px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  termBody: {
    background: "#0d1117", padding: 16, fontFamily: THEME.fontMono, fontSize: 13,
    minHeight: 180, maxHeight: 320, overflowY: "auto",
  },
  termLine: { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 },
  prompt:   { color: THEME.green, whiteSpace: "nowrap" },
  termCmd:  { color: THEME.text },
  termInput: {
    background: "transparent", border: "none", outline: "none",
    color: THEME.text, fontFamily: THEME.fontMono, fontSize: 13,
    flex: 1, caretColor: THEME.accent,
  },

  editorWrap: { border: `1px solid ${THEME.border}`, borderRadius: 10, overflow: "hidden" },
  lineNums: {
    background: "#161b22", color: THEME.muted, fontFamily: THEME.fontMono,
    fontSize: 13, padding: "12px 10px", textAlign: "right",
    lineHeight: "1.7", userSelect: "none", minWidth: 36,
  },
  editor: {
    flex: 1, background: "#0d1117", color: THEME.text,
    fontFamily: THEME.fontMono, fontSize: 13, lineHeight: 1.7,
    border: "none", outline: "none", padding: 12,
    resize: "none", minHeight: 200, width: "100%",
  },

  actions: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  btn: {
    padding: "9px 20px", borderRadius: 8, border: "none", cursor: "pointer",
    background: THEME.accent, color: "#0d1117",
    fontFamily: THEME.fontSans, fontSize: 14, fontWeight: 700,
    transition: "opacity 0.2s",
  },
  btnDisabled: { opacity: 0.4, cursor: "not-allowed" },
};