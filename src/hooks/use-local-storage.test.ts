import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./use-local-storage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("should initialize with initial value when localStorage is empty", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default-val"));
    expect(result.current[0]).toBe("default-val");
  });

  it("should load persisted value from localStorage on mount", () => {
    window.localStorage.setItem("test-key", JSON.stringify("persisted-val"));
    const { result } = renderHook(() => useLocalStorage("test-key", "default-val"));
    expect(result.current[0]).toBe("persisted-val");
  });

  it("should update localStorage when state changes", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default-val"));

    act(() => {
      result.current[1]("new-val");
    });

    expect(result.current[0]).toBe("new-val");
    expect(window.localStorage.getItem("test-key")).toBe(JSON.stringify("new-val"));
  });

  it("should support updater function", () => {
    const { result } = renderHook(() => useLocalStorage("test-counter", 5));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(6);
    expect(window.localStorage.getItem("test-counter")).toBe("6");
  });
});
