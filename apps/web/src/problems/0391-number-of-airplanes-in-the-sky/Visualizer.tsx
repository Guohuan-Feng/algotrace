import { IntervalTraceVisualizer } from "../../shared/components/IntervalTraceVisualizer";
import type { VisualizerProps } from "../../shared/types";
import { traceDefinition } from "./data";

export default function NumberOfAirplanesVisualizer(props: VisualizerProps) {
  return <IntervalTraceVisualizer {...props} definition={traceDefinition} />;
}
