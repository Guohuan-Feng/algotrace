import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";
import RemoveDuplicatesIIVisualizer from "./Visualizer";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function slider() {
  return screen.getByRole("slider", { name: "Step slider" }) as HTMLInputElement;
}

function seek(step: number | "done") {
  const control = slider();
  fireEvent.change(control, { target: { value: step === "done" ? control.max : String(step) } });
}

describe("Remove Duplicates II visualizer interactions", () => {
  test.each([
    { text: "[1,1,1,2,2,3]" },
    { text: '{"nums":[1,1,1,2,2,3]}' },
  ])("loads a custom input in the supported format $text and resets the trace", async ({ text }) => {
    const user = userEvent.setup();
    render(<RemoveDuplicatesIIVisualizer onBack={vi.fn()} />);
    seek("done");

    const input = screen.getByRole("textbox", { name: "nums JSON" });
    await user.clear(input);
    await user.paste(text);
    await user.click(screen.getByRole("button", { name: "载入数组" }));

    expect((input as HTMLTextAreaElement).value).toBe("[1,1,1,2,2,3]");
    expect(screen.getByText("[1,1,1,2,2,3]", { selector: "code" })).toBeTruthy();
    expect(slider().value).toBe("0");
    expect(screen.getByTestId("valid-prefix").textContent).toBe("[]");
    expect(screen.getByTestId("nums-5").querySelector("strong")!.textContent).toBe("3");
    expect(screen.queryByTestId("nums-6")).toBeNull();
    expect(screen.getByRole("button", { name: "连续跳过与覆盖" }).getAttribute("aria-pressed")).toBe("false");
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByRole("button", { name: "Play" })).toBeTruthy();
  });

  test.each([
    { invalid: "[3,1]", expectedMessage: "非递减" },
    { invalid: "[broken]", expectedMessage: "JSON" },
  ])("preserves the previous loaded run when input is invalid: $invalid", async ({ invalid, expectedMessage }) => {
    const user = userEvent.setup();
    render(<RemoveDuplicatesIIVisualizer onBack={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "官方示例 1" }));
    // First actual overwrite: index 2 has become 2, but left still equals 2.
    seek(5);
    const previousArray = screen.getByRole("group", { name: "当前原地数组" }).textContent;
    const previousPrefix = screen.getByTestId("valid-prefix").textContent;
    const previousStep = slider().value;

    const input = screen.getByRole("textbox", { name: "nums JSON" });
    await user.clear(input);
    await user.paste(invalid);
    await user.click(screen.getByRole("button", { name: "载入数组" }));

    expect(screen.getByRole("alert").textContent).toContain(expectedMessage);
    expect(screen.getByRole("group", { name: "当前原地数组" }).textContent).toBe(previousArray);
    expect(screen.getByTestId("valid-prefix").textContent).toBe(previousPrefix);
    expect(slider().value).toBe(previousStep);
    expect(screen.getByText("[1,1,1,2,2,3]", { selector: "code" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "官方示例 1" }).getAttribute("aria-pressed")).toBe("true");

    await user.clear(input);
    await user.paste("[]");
    await user.click(screen.getByRole("button", { name: "载入数组" }));
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByText("[] 空数组")).toBeTruthy();
    expect(slider().value).toBe("0");
  });

  test("shows both pointers in the same cell and includes a write only after left advances", async () => {
    const user = userEvent.setup();
    render(<RemoveDuplicatesIIVisualizer onBack={vi.fn()} />);
    seek(2);

    const bothPointers = screen.getByTestId("nums-2");
    expect(within(bothPointers).getByText("left")).toBeTruthy();
    expect(within(bothPointers).getByText("right")).toBeTruthy();
    expect(bothPointers.classList.contains("is-reader")).toBe(true);
    expect(bothPointers.classList.contains("is-writer")).toBe(true);
    expect(within(screen.getByTestId("nums-0")).getByText("left − 2")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "官方示例 1" }));
    seek(5);
    expect(screen.getByTestId("nums-2").querySelector("strong")!.textContent).toBe("2");
    expect(screen.getByTestId("nums-2").classList.contains("is-written")).toBe(true);
    expect(screen.getByTestId("nums-2").classList.contains("is-prefix")).toBe(false);
    expect(screen.getByTestId("valid-prefix").textContent).toBe("[1,1]");
    await user.click(screen.getByRole("button", { name: "Next step" }));
    expect(screen.getByTestId("valid-prefix").textContent).toBe("[1,1,2]");
    expect(screen.getByTestId("nums-2").classList.contains("is-prefix")).toBe(true);
    expect(screen.getByText("left = 3")).toBeTruthy();
  });

  test("seeks to the answer without removing the ignored suffix", () => {
    render(<RemoveDuplicatesIIVisualizer onBack={vi.fn()} />);
    seek("done");

    expect(screen.getByTestId("valid-prefix").textContent).toBe("[0,0,1,1,2,3,3]");
    expect(screen.getByText("最终结果 · k = 7")).toBeTruthy();
    for (let index = 0; index < 7; index += 1) {
      expect(screen.getByTestId(`nums-${index}`).classList.contains("is-prefix")).toBe(true);
      expect(screen.getByTestId(`nums-${index}`).classList.contains("is-ignored")).toBe(false);
    }
    for (const index of [7, 8]) {
      const cell = screen.getByTestId(`nums-${index}`);
      expect(cell.classList.contains("is-ignored")).toBe(true);
      expect(cell.querySelector("strong")!.textContent).toBe("3");
      expect(within(cell).getByText("不计入")).toBeTruthy();
    }
    expect(screen.getAllByText("不计入")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Play" })).toBeTruthy();
  });

  test("restarts playback from a completed frame and clears playback when reset", () => {
    vi.useFakeTimers();
    render(<RemoveDuplicatesIIVisualizer onBack={vi.fn()} />);
    seek("done");
    fireEvent.click(screen.getByRole("button", { name: "Play" }));

    expect(slider().value).toBe("0");
    expect(screen.getByTestId("valid-prefix").textContent).toBe("[]");
    expect(screen.getByRole("button", { name: "Pause" })).toBeTruthy();
    act(() => { vi.advanceTimersByTime(1100); });
    expect(slider().value).toBe("1");
    expect(screen.getByTestId("valid-prefix").textContent).toBe("[0,0]");

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(slider().value).toBe("0");
    expect(screen.getByRole("button", { name: "Play" })).toBeTruthy();
    act(() => { vi.advanceTimersByTime(2200); });
    expect(slider().value).toBe("0");
  });

  test("automatically stops on the short-circuit answer and can replay it", () => {
    vi.useFakeTimers();
    render(<RemoveDuplicatesIIVisualizer onBack={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "空数组" }));
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    act(() => { vi.advanceTimersByTime(1100); });

    expect(screen.getByText("最终结果 · k = 0")).toBeTruthy();
    expect(screen.getByText("left = 未初始化")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Play" })).toBeTruthy();
    expect(slider().value).toBe("1");
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    expect(slider().value).toBe("0");
    expect(screen.getByRole("button", { name: "Pause" })).toBeTruthy();
  });

  test("pauses a running trace on invalid input without losing the current frame", () => {
    vi.useFakeTimers();
    render(<RemoveDuplicatesIIVisualizer onBack={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    act(() => { vi.advanceTimersByTime(1100); });
    expect(slider().value).toBe("1");
    fireEvent.change(screen.getByRole("textbox", { name: "nums JSON" }), { target: { value: "[3,1]" } });
    fireEvent.click(screen.getByRole("button", { name: "载入数组" }));

    expect(screen.getByRole("alert").textContent).toContain("非递减");
    expect(screen.getByRole("button", { name: "Play" })).toBeTruthy();
    expect(screen.getByTestId("valid-prefix").textContent).toBe("[0,0]");
    act(() => { vi.advanceTimersByTime(2200); });
    expect(slider().value).toBe("1");
    expect(screen.getByTestId("valid-prefix").textContent).toBe("[0,0]");
  });
});
