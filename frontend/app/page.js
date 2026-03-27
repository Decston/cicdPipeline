import PipelineSimulator from "@/src/components/PipelineSimulator";
import DevWorkflow from "@/src/components/DevWorkflow";

async function getMessage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hello`, {
    cache: "no-store"
  });

  return res.text();
}

export default async function Home() {
  const message = await getMessage();

  return (
    <main style={{ textAlign: "center", marginTop: "50px" }}>
      <DevWorkflow />
      {/*<h1>Geração Tech</h1>
      <h2>{message}</h2>
      <h1>-----------</h1>
      <PipelineSimulator />*/}
    </main>
  );
}