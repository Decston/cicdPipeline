"use client";
import { useState } from "react";

export default function PipelineSimulator() {
    const [step, setStep] = useState("idle");

    const runPipeline = async () => {
        setStep("build");

        await new Promise(r => setTimeout(r, 1200));
        setStep("docker");

        await new Promise(r => setTimeout(r, 1200));
        setStep("push");

        await new Promise(r => setTimeout(r, 1200));
        setStep("deploy");

        await new Promise(r => setTimeout(r, 1200));
        setStep("done");
    };

    const getStatus = (current) => {
        const order = ["build", "docker", "push", "deploy"];
        const currentIndex = order.indexOf(step);
        const itemIndex = order.indexOf(current);

        if (step === "done") return "done";
        if (itemIndex < currentIndex) return "done";
        if (itemIndex === currentIndex) return "active";
        return "idle";
    };

    const renderStatus = (status) => {
        if (status === "done") return "🟢";
        if (status === "active") return "🟡";
        return "⚪";
    };

    return (
        <div style={{ border: "1px solid #ccc", padding: 20, borderRadius: 10 }}> <h2>🚀 Simulador de Pipeline CI/CD</h2>

        <button
            onClick={runPipeline}
            style={{
            padding: "10px 20px",
            marginBottom: 20,
            cursor: "pointer"
            }}
        >
            Executar Pipeline
        </button>

        <ul style={{ listStyle: "none", padding: 0 }}>
            <li>{renderStatus(getStatus("build"))} Build da aplicação</li>
            <li>{renderStatus(getStatus("docker"))} Build Docker</li>
            <li>{renderStatus(getStatus("push"))} Push para Docker Hub</li>
            <li>{renderStatus(getStatus("deploy"))} Deploy em produção</li>
        </ul>

        {step === "done" && (
            <p style={{ marginTop: 20, fontWeight: "bold" }}>
            ✅ Pipeline concluído com sucesso!
            </p>
        )}
        </div>
    );
}
