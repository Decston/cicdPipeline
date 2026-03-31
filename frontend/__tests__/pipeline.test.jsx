import React from "react";
import { render, screen } from "@testing-library/react";
import PipelineSimulator from "@/src/components/PipelineSimulator";

test("renderiza botão de executar pipeline", () => {
    render(<PipelineSimulator />);

    const button = screen.getByText("SEM BOTAO");

    expect(button).toBeInTheDocument();
});
