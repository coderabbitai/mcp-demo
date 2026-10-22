import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

const addTodo = async (label: string) => {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/new todo/i), label);
  await user.click(screen.getByRole("button", { name: /add todo/i }));
};

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
    render(<App />);
  });

  it("creates and displays todos", async () => {
    await addTodo("Review the demo");

    expect(screen.getByText("Review the demo")).toBeInTheDocument();
    expect(screen.getByText("1 active")).toBeInTheDocument();
  });

  it("updates a todo title inline", async () => {
    const user = userEvent.setup();
    await addTodo("Draft UI");

    await user.click(screen.getByRole("button", { name: /edit Draft UI/i }));
    await user.clear(screen.getByLabelText(/editing Draft UI/i));
    await user.type(screen.getByLabelText(/editing Draft UI/i), "Polish UI");
    await user.click(screen.getByRole("button", { name: /save todo/i }));

    expect(screen.getByText("Polish UI")).toBeInTheDocument();
    expect(screen.queryByText("Draft UI")).not.toBeInTheDocument();
  });

  it("toggles completion and filters todos", async () => {
    const user = userEvent.setup();
    await addTodo("Ship demo");
    await addTodo("Write notes");

    await user.click(screen.getByRole("checkbox", { name: /mark Ship demo complete/i }));
    await user.click(screen.getByRole("button", { name: /^completed$/i }));

    expect(screen.getByText("Ship demo")).toBeInTheDocument();
    expect(screen.queryByText("Write notes")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^active$/i }));
    expect(screen.getByText("Write notes")).toBeInTheDocument();
    expect(screen.queryByText("Ship demo")).not.toBeInTheDocument();
  });

  it("deletes a todo", async () => {
    const user = userEvent.setup();
    await addTodo("Temporary item");

    await user.click(screen.getByRole("button", { name: /delete Temporary item/i }));

    expect(screen.queryByText("Temporary item")).not.toBeInTheDocument();
    expect(screen.getByText("No todos match this view.")).toBeInTheDocument();
  });

  it("clears completed todos", async () => {
    const user = userEvent.setup();
    await addTodo("Done item");
    await addTodo("Open item");

    await user.click(screen.getByRole("checkbox", { name: /mark Done item complete/i }));
    await user.click(screen.getByRole("button", { name: /clear completed/i }));

    const list = screen.getByRole("list", { name: /todo list/i });
    expect(within(list).queryByText("Done item")).not.toBeInTheDocument();
    expect(within(list).getByText("Open item")).toBeInTheDocument();
  });
});
