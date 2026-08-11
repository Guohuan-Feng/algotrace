import { ChevronLeft, ChevronRight, Pause, Play, RefreshCcw } from "lucide-react";

type StepControlsProps = {
  frameCount: number;
  playing: boolean;
  step: number;
  onPlayingChange: (playing: boolean) => void;
  onStepChange: (step: number) => void;
};

export function StepControls({ frameCount, playing, step, onPlayingChange, onStepChange }: StepControlsProps) {
  const lastStep = Math.max(0, frameCount - 1);

  return (
    <>
      <div className="controls-row">
        <button className="icon-button" onClick={() => onStepChange(Math.max(0, step - 1))} aria-label="Previous step">
          <ChevronLeft size={18} />
        </button>
        <button className="icon-button primary" onClick={() => onPlayingChange(!playing)} aria-label={playing ? "Pause" : "Play"}>
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button className="icon-button" onClick={() => onStepChange(Math.min(lastStep, step + 1))} aria-label="Next step">
          <ChevronRight size={18} />
        </button>
        <button
          className="icon-button"
          onClick={() => {
            onStepChange(0);
            onPlayingChange(false);
          }}
          aria-label="Reset"
        >
          <RefreshCcw size={18} />
        </button>
      </div>

      <input
        aria-label="Step slider"
        className="slider"
        max={lastStep}
        min={0}
        onChange={(event) => onStepChange(Number(event.target.value))}
        type="range"
        value={step}
      />
    </>
  );
}
