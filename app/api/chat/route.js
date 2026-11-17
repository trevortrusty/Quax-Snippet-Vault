// import Anthropic from '@anthropic-ai/sdk';
// // import 'dotenv/config';
//
// const anthropic = new Anthropic();
import { query } from "@anthropic-ai/claude-agent-sdk";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createQuaxServer, TOOL_NAMES } from "@/app/lib/quaxTools";

// Edit prompts/quax-system-prompt.md to change how Quax behaves. Read on every request, so no restart needed.
const PROMPT_PATH = path.join(process.cwd(), "prompts", "quax-system-prompt.md");

// POST user chat with CLAUDE and get response
export async function POST(request) {
  const { messages } = await request.json();

  const systemPrompt = (await readFile(PROMPT_PATH, "utf8")).trim();

  let snippetsChanged = false; // set by the tools after a successful create/update
  const quax = createQuaxServer(new URL(request.url).origin, () => { snippetsChanged = true; });

  const prompt = messages
    .map((m) => `${m.role === "assistant" ? "Assistant" : "User"}: ${m.content}`)
    .join("\n\n");

  try {
    let reply = "";
    for await (const message of query({
      prompt,
      options: {
        systemPrompt,
        tools: [],                          // no built-in tools: no file, shell or web access
        mcpServers: { quax },               // the snippet API tools, the only thing Quax can do
        allowedTools: TOOL_NAMES,           // run them without asking for permission
        maxTurns: 6,                        // room for: tool call(s), then the final reply
        settingSources: [],    // don't load this repo's CLAUDE.md/AGENTS.md/hooks
        persistSession: false, // don't save a session file per message
      },
    })) {
      if (message.type === "result") {
        if (message.subtype !== "success") throw new Error(message.subtype);
        reply = message.result;
      }
    }
    return Response.json({ reply, snippetsChanged });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch response from Claude" }, { status: 500 });
  }
}
