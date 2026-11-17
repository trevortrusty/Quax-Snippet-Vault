import { createSdkMcpServer, tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

// The only things Quax can do besides talk: call the snippets API. Each tool is a thin wrapper
// around a fetch to /api/snippets, so the API's own validation applies. There is deliberately no
// delete tool. Add one here (and to TOOL_NAMES) if you want Quax to be able to delete.

const text = (value) => ({ content: [{ type: "text", text: typeof value === "string" ? value : JSON.stringify(value) }] });
const failure = (message) => ({ isError: true, content: [{ type: "text", text: message }] });

// `origin` is the running app's own origin (e.g. http://127.0.0.1:3000), taken from the incoming request.
// `onChange` is called after a successful write so the route can tell the browser to refresh its list.
export function createQuaxServer(origin, onChange = () => {}) {
  const call = async (path, init) => {
    try {
      const res = await fetch(`${origin}/api/snippets${path}`, {
        ...init,
        headers: { "Content-Type": "application/json" },
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) return failure(body?.error ?? `Request failed (${res.status})`);
      return { body };
    } catch (err) {
      return failure(`Request failed: ${err.message}`);
    }
  };

  return createSdkMcpServer({
    name: "quax",
    tools: [
      tool(
        "list_snippets",
        "List all saved snippets (id, title, language, code).",
        {},
        async () => {
          const r = await call("");
          return r.body ? text(r.body) : r;
        },
        { annotations: { readOnlyHint: true } }
      ),
      tool(
        "get_snippet",
        "Get one saved snippet by id.",
        { id: z.string() },
        async ({ id }) => {
          const r = await call(`/${encodeURIComponent(id)}`);
          return r.body ? text(r.body) : r;
        },
        { annotations: { readOnlyHint: true } }
      ),
      tool(
        "create_snippet",
        "Save a new snippet. The code goes here, in `code`, not in your chat reply.",
        {
          title: z.string().describe("Short descriptive title"),
          language: z.string().describe("Language name, lowercase, e.g. cpp, python, js"),
          code: z.string().describe("The snippet's code only, with no markdown fences"),
        },
        async (args) => {
          const r = await call("", { method: "POST", body: JSON.stringify(args) });
          if (!r.body) return r;
          onChange();
          return text({ saved: true, snippet: r.body });
        }
      ),
      tool(
        "update_snippet",
        "Change an existing snippet. Send only the fields that should change.",
        {
          id: z.string(),
          title: z.string().optional(),
          language: z.string().optional(),
          code: z.string().optional().describe("The full new code, with no markdown fences"),
        },
        async ({ id, ...fields }) => {
          const r = await call(`/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(fields) });
          if (!r.body) return r;
          onChange();
          return text({ updated: true, snippet: r.body });
        }
      ),
    ],
  });
}

// SDK tool names are mcp__<server>__<tool>. Listing them in allowedTools lets them run without a permission prompt.
export const TOOL_NAMES = ["list_snippets", "get_snippet", "create_snippet", "update_snippet"].map((n) => `mcp__quax__${n}`);
