"use client";

import { useState, useRef, useEffect } from "react";

// ─── Tema ────────────────────────────────────────────────────────────────────
const THEME = {
  bg: "#0d1117",
  surface: "#161b22",
  border: "#30363d",
  accent: "#58a6ff",
  green: "#3fb950",
  yellow: "#d29922",
  red: "#f85149",
  purple: "#bc8cff",
  orange: "#f0883e",
  text: "#c9d1d9",
  muted: "#8b949e",
  fontMono: "'JetBrains Mono', 'Fira Code', monospace",
  fontSans: "'Outfit', 'DM Sans', sans-serif",
};

// ─── Passos ──────────────────────────────────────────────────────────────────
const STEPS = [
  { id: "branch", label: "01 · Branch",   icon: "⎇",  group: "dev" },
  { id: "code",   label: "02 · Code",     icon: "⌨",  group: "dev" },
  { id: "commit", label: "03 · Commit",   icon: "✦",  group: "dev" },
  { id: "pr",     label: "04 · PR",       icon: "⤴",  group: "dev" },
  { id: "ci",     label: "05 · CI",       icon: "🔍", group: "ci"  },
  { id: "merge",  label: "06 · Merge",    icon: "⇌",  group: "dev" },
  { id: "cd",     label: "07 · CD",       icon: "🚀", group: "cd"  },
];

const GROUP_COLORS = {
  dev: THEME.accent,
  ci:  THEME.yellow,
  cd:  THEME.purple,
};

// ─── Root ────────────────────────────────────────────────────────────────────
export default function DevWorkflow() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState([]);

  const markDone = (i) => setDone((p) => [...new Set([...p, i])]);
  const goNext   = (i) => { markDone(i); setStep(i + 1); };

  return (
    <div style={s.root}>
      <GoogleFonts />
      <header style={s.header}>
        <span style={s.logo}>⬡ devflow</span>
        <span style={s.subtitle}>Simulação de Fluxo Dev - Git e CI/CD</span>
      </header>

      <PipelineTrack step={step} done={done} />

      <nav style={s.stepper}>
        {STEPS.map((st, i) => (
          <button
            key={st.id}
            style={{
              ...s.stepBtn,
              ...(i === step ? s.stepActive(GROUP_COLORS[st.group]) : {}),
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

      <main style={s.panel}>
        {step === 0 && <StepBranch onDone={() => goNext(0)} />}
        {step === 1 && <StepCode   onDone={() => goNext(1)} />}
        {step === 2 && <StepCommit onDone={() => goNext(2)} />}
        {step === 3 && <StepPR     onDone={() => goNext(3)} />}
        {step === 4 && <StepCI     onDone={() => goNext(4)} />}
        {step === 5 && <StepMerge  onDone={() => goNext(5)} />}
        {step === 6 && <StepCD />}
      </main>
    </div>
  );
}

// ─── Pipeline Track Visual ───────────────────────────────────────────────────
function PipelineTrack({ step, done }) {
  return (
    <div style={pt.wrap}>
      {STEPS.map((st, i) => {
        const isDone   = done.includes(i);
        const isActive = i === step;
        const color    = GROUP_COLORS[st.group];
        return (
          <div key={st.id} style={pt.item}>
            <div style={pt.dot(isDone, isActive, color)}>
              {isDone ? "✓" : st.icon}
            </div>
            {i < STEPS.length - 1 && (
              <div style={pt.line(isDone, color)} />
            )}
          </div>
        );
      })}
    </div>
  );
}

const pt = {
  wrap: { display: "flex", alignItems: "center", marginBottom: 20, overflowX: "auto", paddingBottom: 4 },
  item: { display: "flex", alignItems: "center" },
  dot: (done, active, color) => ({
    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: done ? 13 : 15,
    background: done ? color : active ? `${color}22` : THEME.surface,
    border: `2px solid ${done || active ? color : THEME.border}`,
    color: done ? THEME.bg : active ? color : THEME.muted,
    fontWeight: 700, transition: "all 0.3s",
    boxShadow: active ? `0 0 12px ${color}66` : "none",
  }),
  line: (done, color) => ({
    height: 2, width: 24, flexShrink: 0,
    background: done ? color : THEME.border,
    transition: "background 0.4s",
  }),
};

// ─── STEP 1 – Branch ─────────────────────────────────────────────────────────
function StepBranch({ onDone }) {
  const prompts = [
    { cmd: "git checkout main",               out: "Switched to branch 'main'" },
    { cmd: "git pull origin main",            out: "Already up to date." },
    { cmd: "git checkout -b feat/my-feature", out: "Switched to a new branch 'feat/my-feature'" },
  ];
  return (
    <TerminalStep
      title="Criar uma branch de feature"
      desc={<>Execute os comandos no terminal Git Bash simulado.</>}
      prompts={prompts}
      promptLabel="~/project $"
      onDone={onDone}
    />
  );
}

// ─── STEP 2 – Code ───────────────────────────────────────────────────────────
function StepCode({ onDone }) {
  const placeholder = `// Escreva sua feature aqui\n// Exemplo:\nfunction greet(name) {\n  return \`Hello, \${name}!\`;\n}\n\nmodule.exports = { greet };`;
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
      <p style={s.stepDesc}>Edite o arquivo <code style={s.inlineCode}>src/feature.js</code> com sua implementação.</p>
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
        <button style={{ ...s.btn(), ...(code.trim() ? {} : s.btnDisabled) }} disabled={!code.trim()} onClick={handleSave}>
          {saved ? "✓ Salvo!" : "💾 Salvar arquivo"}
        </button>
      </div>
    </div>
  );
}

// ─── STEP 3 – Commit ─────────────────────────────────────────────────────────
function StepCommit({ onDone }) {
  const prompts = [
    { cmd: "git status",                        out: "modified:   src/feature.js" },
    { cmd: "git add src/feature.js",            out: "Changes staged for commit." },
    { cmd: 'git commit -m "feat: my feature"',  out: "[feat/my-feature abc1234] feat: my feature\n 1 file changed, 10 insertions(+)" },
    { cmd: "git push origin feat/my-feature",   out: "Branch 'feat/my-feature' set up to track remote." },
  ];
  return (
    <TerminalStep
      title="Add · Commit · Push"
      desc="Adicione, faça commit e envie as alterações para o remoto."
      prompts={prompts}
      promptLabel="~/project (feat/my-feature) $"
      onDone={onDone}
    />
  );
}

// ─── STEP 4 – Pull Request ───────────────────────────────────────────────────
function StepPR({ onDone }) {
  const [title, setTitle] = useState("feat: my feature");
  const [body, setBody]   = useState("## O que mudou\n\n- Adicionei `greet()` em `src/feature.js`\n\n## Como testar\n\n```bash\nnode -e \"require('./src/feature').greet('World')\"\n```");
  const [opened, setOpened] = useState(false);

  const openPR = () => { setOpened(true); setTimeout(onDone, 800); };

  return (
    <div style={s.stepWrap}>
      <h2 style={s.stepTitle}>Abrir Pull Request</h2>
      <p style={s.stepDesc}>
        <span style={mkBadge("purple")}>feat/my-feature</span>
        {" → "}
        <span style={mkBadge("blue")}>main</span>
      </p>
      {!opened ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={lbl}>Título</label>
          <input style={inp} value={title} onChange={(e) => setTitle(e.target.value)} />
          <label style={lbl}>Descrição</label>
          <textarea style={{ ...inp, fontFamily: THEME.fontMono, fontSize: 13, resize: "vertical" }} value={body} onChange={(e) => setBody(e.target.value)} rows={7} />
          <div style={s.actions}>
            <Reviewers />
            <button style={s.btn()} onClick={openPR}>⤴ Abrir PR</button>
          </div>
        </div>
      ) : (
        <PRCard title={title} body={body} />
      )}
    </div>
  );
}

// ─── STEP 5 – CI Pipeline ────────────────────────────────────────────────────
function StepCI({ onDone }) {
  const jobs = [
    { name: "Unit Tests", icon: "🧪", duration: 2400, logs: ["Executando jest…", "PASS src/feature.test.js", "3 testes passaram."] },
    { name: "Build",      icon: "📦", duration: 2800, logs: ["Compilando TypeScript…", "Bundling assets…", "Build concluído: dist/"] },
  ];
  return (
    <PipelineStep
      title="Pipeline · CI"
      subtitle="Disparado pelo PR · Validação antes do merge"
      accentColor={THEME.yellow}
      jobs={jobs}
      onDone={onDone}
      doneLabel="✓ CI passou! Pronto para merge."
      runLabel="▶ Rodar CI"
    />
  );
}

// ─── STEP 6 – Merge ──────────────────────────────────────────────────────────
function StepMerge({ onDone }) {
  const [mergeType, setMergeType] = useState("squash");
  const [merged, setMerged]       = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [deleted, setDeleted]     = useState(false);

  const MERGE_OPTIONS = [
    { id: "merge",  label: "Create a merge commit",        desc: "Todos os commits da branch serão adicionados ao main via merge commit." },
    { id: "squash", label: "Squash and merge",             desc: "Combina todos os commits em um único commit antes de fazer merge." },
    { id: "rebase", label: "Rebase and merge",             desc: "Reaplica os commits da branch no topo do main individualmente." },
  ];

  const handleMerge = () => {
    setMerged(true);
    setTimeout(onDone, 900);
  };

  const handleDelete = () => {
    setDeleting(true);
    setTimeout(() => setDeleted(true), 800);
  };

  const selected = MERGE_OPTIONS.find((o) => o.id === mergeType);

  return (
    <div style={s.stepWrap}>
      <h2 style={s.stepTitle}>Merge do Pull Request</h2>

      {/* Cabeçalho do PR estilo GitHub */}
      <div style={mg.prHeader}>
        <div style={mg.prTitleRow}>
          <span style={mg.prIcon}>⤴</span>
          <span style={mg.prTitle}>feat: my feature</span>
          <span style={mkBadge("purple")}>Open</span>
          <span style={{ ...mkBadge("green"), marginLeft: "auto" }}>CI ✓</span>
          <span style={mkBadge("green")}>Approved ✓</span>
        </div>
        <div style={mg.prMeta}>
          <span style={mg.prMetaItem}>🧑‍💻 <strong>dev-01</strong> quer fazer merge de</span>
          <span style={mkBadge("purple")}>feat/my-feature</span>
          <span style={mg.prMetaItem}>→</span>
          <span style={mkBadge("blue")}>main</span>
          <span style={mg.prMetaItem}>· 3 commits · 1 arquivo alterado</span>
        </div>
      </div>

      {/* Checks */}
      <div style={mg.checksBox}>
        <div style={mg.checkRow}>
          <span style={{ color: THEME.green, fontSize: 18 }}>✓</span>
          <div>
            <div style={{ color: THEME.text, fontSize: 13, fontWeight: 600 }}>2 checks passed</div>
            <div style={{ color: THEME.muted, fontSize: 12 }}>Unit Tests · Build</div>
          </div>
        </div>
        <div style={mg.checkRow}>
          <span style={{ color: THEME.green, fontSize: 18 }}>✓</span>
          <div>
            <div style={{ color: THEME.text, fontSize: 13, fontWeight: 600 }}>1 approving review</div>
            <div style={{ color: THEME.muted, fontSize: 12 }}>👩‍💻 dev-02 aprovou esta pull request</div>
          </div>
        </div>
        <div style={mg.checkRow}>
          <span style={{ color: THEME.green, fontSize: 18 }}>✓</span>
          <div>
            <div style={{ color: THEME.text, fontSize: 13, fontWeight: 600 }}>Sem conflitos</div>
            <div style={{ color: THEME.muted, fontSize: 12 }}>Esta branch pode ser mergeada automaticamente.</div>
          </div>
        </div>
      </div>

      {/* Diff resumido */}
      <div style={mg.diffBox}>
        <div style={mg.diffHeader}>
          <span style={{ color: THEME.muted, fontSize: 12, fontFamily: THEME.fontMono }}>src/feature.js</span>
          <span style={{ color: THEME.green, fontSize: 12, fontFamily: THEME.fontMono }}>+10</span>
          <span style={{ color: THEME.red,   fontSize: 12, fontFamily: THEME.fontMono }}>-0</span>
        </div>
        {[
          { t: "add", l: "+ function greet(name) {" },
          { t: "add", l: '+   return `Hello, ${name}!`;' },
          { t: "add", l: "+ }" },
          { t: "add", l: "+ " },
          { t: "add", l: "+ module.exports = { greet };" },
        ].map((line, i) => (
          <div key={i} style={mg.diffLine(line.t)}>{line.l}</div>
        ))}
      </div>

      {!merged ? (
        <>
          {/* Seletor de estratégia de merge */}
          <div style={mg.mergeBox}>
            <div style={mg.mergeBoxTitle}>Estratégia de merge</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {MERGE_OPTIONS.map((opt) => (
                <label key={opt.id} style={mg.radioRow(mergeType === opt.id)}>
                  <input
                    type="radio"
                    name="mergeType"
                    value={opt.id}
                    checked={mergeType === opt.id}
                    onChange={() => setMergeType(opt.id)}
                    style={{ accentColor: THEME.green, marginRight: 10, cursor: "pointer" }}
                  />
                  <div>
                    <div style={{ color: THEME.text, fontSize: 13, fontWeight: 600 }}>{opt.label}</div>
                    <div style={{ color: THEME.muted, fontSize: 11, marginTop: 2 }}>{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div style={s.actions}>
            <div style={{ color: THEME.muted, fontSize: 13 }}>
              Estratégia: <span style={{ color: THEME.green, fontFamily: THEME.fontMono }}>{selected.label}</span>
            </div>
            <button style={s.btn(THEME.green)} onClick={handleMerge}>
              ⇌ Confirm {selected.label}
            </button>
          </div>
        </>
      ) : (
        /* Estado pós-merge */
        <div style={mg.mergedState}>
          <div style={mg.mergedBanner}>
            <span style={{ fontSize: 24 }}>⇌</span>
            <div>
              <div style={{ color: THEME.purple, fontFamily: THEME.fontSans, fontWeight: 700, fontSize: 15 }}>
                Pull request merged
              </div>
              <div style={{ color: THEME.muted, fontSize: 13 }}>
                feat/my-feature foi mergeada na main com sucesso · {selected.label}
              </div>
            </div>
          </div>

          {!deleted ? (
            <button
              style={{ ...s.btn(deleting ? THEME.muted : THEME.red), fontSize: 13, padding: "7px 16px" }}
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "⟳ Deletando…" : "🗑 Delete branch"}
            </button>
          ) : (
            <div style={{ color: THEME.muted, fontSize: 13 }}>
              ✓ Branch <code style={s.inlineCode}>feat/my-feature</code> deletada.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const mg = {
  prHeader: {
    border: `1px solid ${THEME.border}`, borderRadius: 10,
    padding: 16, background: THEME.bg,
    display: "flex", flexDirection: "column", gap: 10,
  },
  prTitleRow: {
    display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
  },
  prIcon:  { fontSize: 20, color: THEME.green },
  prTitle: { color: THEME.text, fontFamily: THEME.fontSans, fontWeight: 700, fontSize: 16, marginRight: 4 },
  prMeta:  { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  prMetaItem: { color: THEME.muted, fontSize: 13 },

  checksBox: {
    border: `1px solid ${THEME.green}44`, borderRadius: 10,
    padding: 16, background: "#0d1f0d",
    display: "flex", flexDirection: "column", gap: 12,
  },
  checkRow: { display: "flex", alignItems: "flex-start", gap: 12 },

  diffBox: {
    border: `1px solid ${THEME.border}`, borderRadius: 8,
    overflow: "hidden", fontFamily: THEME.fontMono, fontSize: 12,
  },
  diffHeader: {
    background: "#1c2128", padding: "6px 14px",
    display: "flex", gap: 12, alignItems: "center",
  },
  diffLine: (type) => ({
    padding: "2px 14px",
    background: type === "add" ? "#0d2a0d" : type === "del" ? "#2a0d0d" : "transparent",
    color: type === "add" ? THEME.green : type === "del" ? THEME.red : THEME.text,
    whiteSpace: "pre",
  }),

  mergeBox: {
    border: `1px solid ${THEME.border}`, borderRadius: 10,
    padding: 16, background: THEME.bg,
    display: "flex", flexDirection: "column", gap: 12,
  },
  mergeBoxTitle: {
    color: THEME.muted, fontSize: 12, fontFamily: THEME.fontSans,
    letterSpacing: "0.08em", textTransform: "uppercase",
  },
  radioRow: (active) => ({
    display: "flex", alignItems: "flex-start",
    padding: "10px 14px", borderRadius: 8, cursor: "pointer",
    border: `1px solid ${active ? THEME.green : THEME.border}`,
    background: active ? "#0d2a0d" : THEME.surface,
    transition: "all 0.2s",
  }),

  mergedState: {
    border: `1px solid ${THEME.purple}`, borderRadius: 10,
    padding: 16, background: "#1a0d2e",
    display: "flex", flexDirection: "column", gap: 14,
  },
  mergedBanner: { display: "flex", alignItems: "flex-start", gap: 14 },
};

// ─── STEP 7 – CD Pipeline ────────────────────────────────────────────────────
function StepCD() {
  const jobs = [
    { name: "Login Docker Hub", icon: "🔐", duration: 900,  logs: ["Autenticando no Docker Hub…", "Login Succeeded."] },
    { name: "Build Image",      icon: "🐳", duration: 3200, logs: ["Building Dockerfile…", "Step 1/8: FROM node:20-alpine", "Step 8/8: CMD node dist/index.js", "Image: org/app:def5678"] },
    { name: "Push Docker",      icon: "⬆",  duration: 1800, logs: ["Pushing org/app:def5678…", "Pushed 12 layers.", "Digest: sha256:abc…"] },
    { name: "Deploy Staging",   icon: "🚀", duration: 2600, logs: ["Conectando ao cluster k8s…", "kubectl set image deployment/app…", "Deployment atualizado.", "✓ https://staging.app.io"] },
  ];
  return (
    <PipelineStep
      title="Pipeline · CD"
      subtitle="Disparado pelo merge na main · Deploy automático em staging"
      accentColor={THEME.purple}
      jobs={jobs}
      onDone={null}
      doneLabel="🚀 Deploy no Staging concluído!"
      runLabel="▶ Rodar CD"
    />
  );
}

// ─── Pipeline Step (CI e CD) ─────────────────────────────────────────────────
function PipelineStep({ title, subtitle, accentColor, jobs, onDone, doneLabel, runLabel }) {
  const [statuses, setStatuses] = useState(jobs.map(() => "pending"));
  const [log, setLog]           = useState([]);
  const [running, setRunning]   = useState(false);
  const logRef = useRef();

  useEffect(() => { logRef.current?.scrollTo(0, 99999); }, [log]);

  const overall = statuses.every((s) => s === "success")
    ? "success" : statuses.some((s) => s === "running") ? "running" : "pending";

  const run = () => {
    if (running && overall !== "success") return;
    setRunning(true);
    setStatuses(jobs.map(() => "pending"));
    setLog([]);
    let acc = 0;
    jobs.forEach((job, i) => {
      const start = acc + (i === 0 ? 400 : jobs[i - 1].duration);
      acc = start;
      setTimeout(() => {
        setStatuses((s) => { const n = [...s]; n[i] = "running"; return n; });
        setLog((l) => [...l, `▶ [${job.name}] iniciado`]);
        job.logs.forEach((line, j) => {
          setTimeout(() => setLog((l) => [...l, `  ${line}`]),
            (j + 1) * Math.floor(job.duration / (job.logs.length + 1)));
        });
      }, start);
      setTimeout(() => {
        setStatuses((s) => { const n = [...s]; n[i] = "success"; return n; });
        setLog((l) => [...l, `✓ [${job.name}] concluído`]);
        if (i + 1 === jobs.length && onDone) setTimeout(onDone, 600);
      }, start + job.duration);
    });
  };

  return (
    <div style={s.stepWrap}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h2 style={{ ...s.stepTitle, color: accentColor }}>{title}</h2>
        <StatusBadge status={overall} color={overall === "running" ? accentColor : undefined} />
      </div>
      <p style={s.stepDesc}>{subtitle}</p>

      {/* Jobs */}
      <div style={pipe.track}>
        {jobs.map((job, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <div style={pipe.job(statuses[i], accentColor)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={pipe.jobIcon(statuses[i], accentColor)}>
                  {statuses[i] === "success" ? "✓" : statuses[i] === "running" ? "⟳" : job.icon}
                </span>
                <span style={{ color: THEME.text, fontFamily: THEME.fontSans, fontSize: 13, fontWeight: 600 }}>
                  {job.name}
                </span>
              </div>
              <div style={{ color: THEME.muted, fontSize: 11, fontFamily: THEME.fontMono, marginTop: 4 }}>
                {statuses[i] === "success" ? `${(job.duration / 1000).toFixed(1)}s`
                 : statuses[i] === "running" ? "em execução…" : "aguardando"}
              </div>
            </div>
            {i < jobs.length - 1 && (
              <div style={pipe.arrow(statuses[i] === "success", accentColor)}>→</div>
            )}
          </div>
        ))}
      </div>

      {/* Log */}
      <div ref={logRef} style={pipe.log}>
        {log.length === 0 && <span style={{ color: THEME.muted }}>Nenhuma execução ainda…</span>}
        {log.map((l, i) => (
          <div key={i} style={{
            color: l.startsWith("✓") ? THEME.green : l.startsWith("▶") ? accentColor : THEME.text,
            opacity: l.startsWith("  ") ? 0.65 : 1,
          }}>{l}</div>
        ))}
      </div>

      <div style={s.actions}>
        <span />
        <button
          style={{ ...s.btn(accentColor), ...(running && overall !== "success" ? s.btnDisabled : {}) }}
          disabled={running && overall !== "success"}
          onClick={run}
        >
          {overall === "success" ? doneLabel : running ? "⟳ Rodando…" : runLabel}
        </button>
      </div>
    </div>
  );
}

// ─── Terminal Step (Branch, Commit, Merge) ───────────────────────────────────
function TerminalStep({ title, desc, prompts, promptLabel, onDone, inline }) {
  const [history, setHistory] = useState([]);
  const [input, setInput]     = useState("");
  const [idx, setIdx]         = useState(0);
  const [error, setError]     = useState("");
  const inputRef = useRef();
  const bodyRef  = useRef();

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { bodyRef.current?.scrollTo(0, 99999); }, [history]);

  const finished = idx >= prompts.length;

  const handleKey = (e) => {
    if (e.key !== "Enter") return;
    const val = input.trim();
    if (!val) return;
    if (val === prompts[idx].cmd) {
      setHistory((h) => [...h, { cmd: val, out: prompts[idx].out, ok: true }]);
      setInput(""); setError("");
      if (idx + 1 === prompts.length) { if (onDone) setTimeout(onDone, 600); }
      else setIdx((i) => i + 1);
    } else {
      setHistory((h) => [...h, { cmd: val, out: "bash: command not recognized", ok: false }]);
      setInput("");
      setError(`💡 Dica: tente "${prompts[idx].cmd}"`);
    }
  };

  const inner = (
    <>
      {!inline && !finished && (
        <p style={s.stepDesc}>
          <span style={{ color: THEME.muted }}>Próximo: <code style={s.inlineCode}>{prompts[idx]?.cmd}</code></span>
        </p>
      )}
      <div style={s.terminal}>
        <TerminalBar title="Git Bash" />
        <div ref={bodyRef} style={s.termBody}>
          {history.map((h, i) => (
            <div key={i}>
              <div style={s.termLine}>
                <span style={s.prompt}>{promptLabel}</span>
                <span style={s.termCmd}>{h.cmd}</span>
              </div>
              {h.out.split("\n").map((line, j) => (
                <div key={j} style={{ color: h.ok ? THEME.green : THEME.red, paddingLeft: 16, marginBottom: 2 }}>{line}</div>
              ))}
            </div>
          ))}
          {!finished && (
            <div style={s.termLine}>
              <span style={s.prompt}>{promptLabel}</span>
              <input ref={inputRef} style={s.termInput} value={input}
                onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
                spellCheck={false} autoComplete="off" placeholder="digite o comando…" />
            </div>
          )}
          {error && <div style={{ color: THEME.yellow, fontSize: 12, paddingLeft: 16, marginTop: 4 }}>{error}</div>}
        </div>
      </div>
      {!inline && <ProgressBar total={prompts.length} done={Math.min(idx, prompts.length)} />}
    </>
  );

  if (inline) return inner;

  return (
    <div style={s.stepWrap}>
      {title && <h2 style={s.stepTitle}>{title}</h2>}
      {desc && <p style={s.stepDesc}>{desc}</p>}
      {inner}
    </div>
  );
}

// ─── PR Card ─────────────────────────────────────────────────────────────────
function PRCard({ title, body }) {
  return (
    <div style={{ border: `1px solid ${THEME.green}`, borderRadius: 10, padding: 20, background: "#0d1f0d" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 20 }}>⤴</span>
        <span style={{ color: THEME.green, fontFamily: THEME.fontSans, fontWeight: 700, fontSize: 16 }}>PR #42 — {title}</span>
        <span style={{ ...mkBadge("green"), fontSize: 11 }}>Open</span>
      </div>
      <pre style={{ color: THEME.text, fontFamily: THEME.fontMono, fontSize: 12, whiteSpace: "pre-wrap", margin: 0 }}>{body}</pre>
    </div>
  );
}

// ─── Utilitários visuais ─────────────────────────────────────────────────────
function mkBadge(color) {
  const map = {
    purple: { bg: "#3d1d6b", fg: THEME.purple, br: THEME.purple },
    blue:   { bg: "#0d2440", fg: THEME.accent,  br: THEME.accent  },
    green:  { bg: "#0d2a0d", fg: THEME.green,   br: THEME.green   },
  };
  const { bg, fg, br } = map[color] || map.blue;
  return { display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontFamily: THEME.fontMono, background: bg, color: fg, border: `1px solid ${br}` };
}

function Reviewers() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ color: THEME.muted, fontSize: 12 }}>Revisores:</span>
      {["🧑‍💻", "👩‍💻", "🧑‍🔬"].map((a, i) => <span key={i} style={{ fontSize: 18 }}>{a}</span>)}
    </div>
  );
}

function StatusBadge({ status, color }) {
  const map = {
    pending: { c: THEME.muted,  l: "● Aguardando" },
    running: { c: THEME.yellow, l: "⟳ Rodando"    },
    success: { c: THEME.green,  l: "✓ Aprovado"   },
  };
  const { c, l } = map[status];
  return <span style={{ color: color || c, fontFamily: THEME.fontSans, fontSize: 13, fontWeight: 600 }}>{l}</span>;
}

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
      {Array.from({ length: count }, (_, i) => <div key={i}>{i + 1}</div>)}
    </div>
  );
}

function ProgressBar({ total, done }) {
  const pct = Math.round((done / total) * 100);
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ color: THEME.muted, fontSize: 11 }}>Progresso do passo</span>
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
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: ${THEME.bg}; }
      ::-webkit-scrollbar-thumb { background: ${THEME.border}; border-radius: 3px; }
    `}</style>
  );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────
const lbl = { color: THEME.muted, fontSize: 12, fontFamily: THEME.fontSans, letterSpacing: "0.08em", textTransform: "uppercase" };
const inp = { background: THEME.bg, border: `1px solid ${THEME.border}`, borderRadius: 6, color: THEME.text, fontFamily: THEME.fontSans, fontSize: 14, padding: "8px 12px", outline: "none", width: "100%" };

const pipe = {
  track: { display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", background: THEME.bg, border: `1px solid ${THEME.border}`, borderRadius: 10, padding: 16 },
  job: (status, color) => ({
    padding: "10px 14px", borderRadius: 8, minWidth: 130,
    background: status === "success" ? `${color}15` : status === "running" ? "#1a1a0d" : THEME.surface,
    border: `1px solid ${status === "success" ? color : status === "running" ? THEME.yellow : THEME.border}`,
    transition: "all 0.3s",
  }),
  jobIcon: (status, color) => ({
    fontSize: 16,
    color: status === "success" ? color : status === "running" ? THEME.yellow : THEME.muted,
    display: "inline-block",
    animation: status === "running" ? "spin 1s linear infinite" : "none",
  }),
  arrow: (done, color) => ({ color: done ? color : THEME.muted, fontSize: 18, margin: "0 4px", transition: "color 0.3s" }),
  log: { background: THEME.bg, border: `1px solid ${THEME.border}`, borderRadius: 8, padding: 12, fontFamily: THEME.fontMono, fontSize: 12, minHeight: 100, maxHeight: 180, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 },
};

const s = {
  root: { background: THEME.bg, color: THEME.text, fontFamily: THEME.fontSans, minHeight: "100vh", padding: "32px 24px", maxWidth: 960, margin: "0 auto" },
  header: { display: "flex", alignItems: "baseline", gap: 16, marginBottom: 24, borderBottom: `1px solid ${THEME.border}`, paddingBottom: 20 },
  logo:     { fontFamily: THEME.fontSans, fontWeight: 700, fontSize: 22, color: THEME.accent, letterSpacing: "-0.02em" },
  subtitle: { color: THEME.muted, fontSize: 13 },
  stepper:  { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 },
  stepBtn: { display: "flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: 8, border: `1px solid ${THEME.border}`, background: THEME.surface, color: THEME.muted, fontFamily: THEME.fontSans, fontSize: 12, cursor: "pointer", transition: "all 0.2s" },
  stepActive: (color) => ({ background: `${color}18`, borderColor: color, color }),
  stepDone:   { background: "#0d2a0d", borderColor: THEME.green, color: THEME.green },
  stepIcon:   { fontSize: 14 },
  check:      { color: THEME.green, fontWeight: 700 },
  panel:    { background: THEME.surface, borderRadius: 12, border: `1px solid ${THEME.border}`, padding: 28, minHeight: 400 },
  stepWrap: { display: "flex", flexDirection: "column", gap: 16 },
  stepTitle: { fontFamily: THEME.fontSans, fontSize: 20, fontWeight: 700, color: THEME.text },
  stepDesc:  { color: THEME.muted, fontSize: 14, lineHeight: 1.6 },
  inlineCode: { fontFamily: THEME.fontMono, fontSize: 12, color: THEME.accent, background: "#0d2040", padding: "1px 6px", borderRadius: 4 },
  terminal:  { borderRadius: 10, overflow: "hidden", border: `1px solid ${THEME.border}` },
  termBar:   { background: "#21262d", padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  termBody:  { background: "#0d1117", padding: 16, fontFamily: THEME.fontMono, fontSize: 13, minHeight: 180, maxHeight: 280, overflowY: "auto" },
  termLine:  { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 },
  prompt:    { color: THEME.green, whiteSpace: "nowrap", fontSize: 12 },
  termCmd:   { color: THEME.text },
  termInput: { background: "transparent", border: "none", outline: "none", color: THEME.text, fontFamily: THEME.fontMono, fontSize: 13, flex: 1, caretColor: THEME.accent },
  editorWrap: { border: `1px solid ${THEME.border}`, borderRadius: 10, overflow: "hidden" },
  lineNums: { background: "#161b22", color: THEME.muted, fontFamily: THEME.fontMono, fontSize: 13, padding: "12px 10px", textAlign: "right", lineHeight: "1.7", userSelect: "none", minWidth: 36 },
  editor: { flex: 1, background: "#0d1117", color: THEME.text, fontFamily: THEME.fontMono, fontSize: 13, lineHeight: 1.7, border: "none", outline: "none", padding: 12, resize: "none", minHeight: 200, width: "100%" },
  actions: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  btn: (color = THEME.accent) => ({ padding: "9px 20px", borderRadius: 8, border: "none", cursor: "pointer", background: color, color: "#0d1117", fontFamily: THEME.fontSans, fontSize: 14, fontWeight: 700, transition: "opacity 0.2s" }),
  btnDisabled: { opacity: 0.4, cursor: "not-allowed" },
};