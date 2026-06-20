// Build-time overrides: ASCII diagram blocks (matched by hash) -> nicer rendered forms.
// type: 'mermaid' | 'math' | 'table' | 'filetree'
// Source .md files are never modified; these are applied only when generating the website.

export const overrides = {
  // ---------------- Probability.md ----------------
  // Bayes components: PRIOR x LIKELIHOOD ÷ P(B) = POSTERIOR
  '48aa9592a278dc12': { type: 'mermaid', code:
`flowchart LR
  prior["PRIOR — P(A)<br/>what you believed before"] -->|"×"| lik["LIKELIHOOD — P(B∣A)<br/>how well evidence fits hypothesis"]
  lik -->|"÷"| evid["EVIDENCE — P(B)<br/>how common is this evidence overall"]
  evid -->|"="| post["POSTERIOR — P(A∣B)<br/>updated belief after evidence"]` },

  // Bayes theorem fraction
  'd7bdb86f3d148df8': { type: 'math', code:
`$$P(A \\mid B) = \\frac{P(A) \\times P(B \\mid A)}{P(B)}$$` },

  // Total probability of evidence
  '94b593767d684e7b': { type: 'math', code:
`$$P(B) = \\underbrace{P(B \\mid A)\\,P(A)}_{\\text{from people WITH the hypothesis}} + \\underbrace{P(B \\mid \\lnot A)\\,P(\\lnot A)}_{\\text{from people WITHOUT the hypothesis}}$$` },

  // 10,000 people breakdown tree
  '88932edd0c90a9e6': { type: 'mermaid', code:
`flowchart TD
  pop["10,000 people"] --> dis["100 HAVE the disease (1%)"]
  pop --> well["9,900 DON'T have it (99%)"]
  dis --> tp["99 test POSITIVE ✓<br/>true positives"]
  dis --> fn["1 tests negative<br/>false negative"]
  well --> fp["99 test POSITIVE ✗<br/>false alarms!"]
  well --> tn["9,801 test negative<br/>true negatives"]` },

  // Numeric Bayes worked example
  '3fcdeb383dac001b': { type: 'math', code:
`$$P(\\text{sick} \\mid +) = \\frac{P(+ \\mid \\text{sick}) \\times P(\\text{sick})}{P(B)} = \\frac{0.99 \\times 0.01}{0.0198} = \\frac{0.0099}{0.0198} = 50\\%$$` },

  // START -> posterior battle flow
  '62833e69d747aab5': { type: 'mermaid', code:
`flowchart TD
  s(["START"]) --> prior["Your prior belief<br/>how likely is A?"]
  prior --> ev["New evidence B arrives"]
  ev --> fit["How well does B fit A?<br/>P(B∣A) — pushes UP"]
  ev --> common["How common is B in the world?<br/>P(B) — pushes DOWN"]
  fit --> battle["These two forces battle each other"]
  common --> battle
  battle --> post["Your posterior belief<br/>P(A∣B) — the winner"]` },

  // ---------------- Statistics.md ----------------
  // Hypothesis testing flow
  'b82c2b75268e6882': { type: 'mermaid', code:
`flowchart TD
  d["Collect data"] --> t["Compute test statistic<br/>(t, z, F, χ²)"]
  t --> p["Compute p-value"]
  p --> cmp{"Compare to significance level α"}
  cmp -->|"p ≤ α"| rej["Reject H₀<br/>evidence for H₁"]
  cmp -->|"p &gt; α"| fail["Fail to reject H₀<br/>not enough evidence"]` },

  // ---------------- Core MCP.md ----------------
  // LLM tool-calling loop
  'ab228fd7b016f18a': { type: 'mermaid', code:
`flowchart TD
  a["LLM receives:<br/>system prompt + all tool schemas + message history"] --> b["Returns AIMessage with<br/>tool_calls = [name, args, id]"]
  b --> c{"Orchestrator routes<br/>by tool name"}
  c -->|"MCP tool"| d["mcp_client.call_tool(server, tool, args)<br/>network call"]
  c -->|"Local tool"| e["direct function invocation"]
  d --> f["ToolMessage(result, tool_call_id)<br/>appended to state"]
  e --> f
  f --> g["Re-invoke LLM with updated history"]
  g --> h{"AIMessage still<br/>has tool_calls?"}
  h -->|"yes"| b
  h -->|"no"| i(["Final answer"])` },

  // Orchestrator MCP / A2A concept tree
  '9a8fbf70352fb5a0': { type: 'mermaid', code:
`flowchart TD
  o["Orchestrator"] -->|"MCP — tool plumbing"| m["SearchServer, DBServer, FileServer"]
  o -->|"A2A — specialist delegation"| a["FinanceAgent, LegalAgent"]
  a --> ai["each internally uses MCP"]` },

  // ---------------- MCP Connection.md ----------------
  // Client / Server SSE handshake (sequence)
  '314014fd1d3087c4': { type: 'mermaid', code:
`sequenceDiagram
  participant C as Client
  participant S as MCP Server
  C->>S: GET /sse
  S-->>C: 200 OK, Content-Type text/event-stream
  S-->>C: event endpoint, data /messages
  Note over C,S: connection stays open
  C->>S: POST /messages (tools/list)
  S-->>C: event message, data {result...}
  C->>S: POST /messages (tools/call)
  S-->>C: event message, data {result...}` },

  // Orchestrator spawns MCP subprocess (stdio)
  '4586056b7dbcb0eb': { type: 'mermaid', code:
`flowchart LR
  o["Orchestrator Process"] -->|"spawns subprocess"| m["MCP Server Process"]
  o -->|"writes JSON-RPC to stdin"| m
  m -->|"reads JSON-RPC from stdout"| o` },

  // Per-client SSE sessions
  'a963e84b221a6a38': { type: 'mermaid', code:
`flowchart LR
  a["Client A"] -->|"GET /sse"| s1["Server · session s1"]
  b["Client B"] -->|"GET /sse"| s2["Server · session s2"]
  c["Client C"] -->|"GET /sse"| s3["Server · session s3"]
  s1 -.->|"tools/call results"| a
  s2 -.->|"tools/call results"| b
  s3 -.->|"tools/call results"| c` },

  // ---------------- COPILOT_SDK_GUIDE.md ----------------
  // 3-box transport pipeline
  'a0d9acbfafb93de9': { type: 'mermaid', code:
`flowchart LR
  a["Our Python Code<br/>CopilotClient · CopilotSession · define_tool"] <-->|"JSON-RPC / stdio"| b["Copilot CLI (bundled binary)<br/>Agent Loop · Tool Executor · Session Manager"]
  b <-->|"HTTPS / API"| c["Azure OpenAI<br/>(BYOK)"]` },

  // Token provider flow
  'b3a33c82676ea87b': { type: 'mermaid', code:
`flowchart TD
  a["App starts"] --> b["AzureTokenProvider<br/>cached, auto-refresh at expiry minus 5 min"]
  b --> c["Azure AD Token Endpoint"]
  c -->|"bearer_token"| d["ProviderConfig<br/>type=azure · base_url=… · bearer_token=token"]` },

  // SessionManager.process_query try/catch
  'e6b01393ed144112': { type: 'mermaid', code:
`flowchart TD
  req["Request at /chat_v3<br/>conversationId = abc-123"] --> sm["SessionManager.process_query()"]
  sm --> g["1 · _get_or_create_session(abc-123)"]
  g --> tryr["TRY: client.resume_session(abc-123)"]
  tryr -->|"success"| resumed["session resumed — CLI has history"]
  tryr -->|"not found"| create["CATCH: client.create_session(abc-123)"]
  create --> newc["new session created"]
  resumed --> bp["2 · Build prompt"]
  newc --> bp
  bp -->|"resumed"| raw["send raw query (CLI has context)"]
  bp -->|"new"| ctx["prepend context from previousPrompts"]
  raw --> log["3 · Log full prompt"]
  ctx --> log
  log --> send["4 · session.send_and_wait(prompt)<br/>SDK→CLI JSON-RPC · agent loop · tools · final response"]
  send --> alive["session stays alive — no disconnect"]` },

  // Two-turn agent loop
  '47f616285074fb36': { type: 'mermaid', code:
`flowchart TD
  p["Prompt: What can VL Central do?"] --> t1["Turn 1<br/>LLM sees system + user prompt<br/>decides: call copilot_capability_skill<br/>CLI executes tool → returns JSON"]
  t1 --> t2["Turn 2<br/>LLM sees prompt + tool result<br/>decides: final text answer<br/>no more tool calls → loop ends"]
  t2 --> idle["session.idle<br/>send_and_wait resolves"]` },

  // Tool call lifecycle
  '590b20723da583d8': { type: 'mermaid', code:
`flowchart TD
  a["LLM decides to call<br/>copilot_capability_skill"] --> b["CLI sends JSON-RPC to SDK<br/>tool_name + arguments {query}"]
  b --> c["SDK deserializes args →<br/>CopilotCapabilityParams(query)"]
  c --> d["our handler runs → returns JSON string"]
  d --> e["SDK wraps as ToolResult<br/>(text_result_for_llm, result_type=success)"]
  e --> f["CLI feeds ToolResult back to LLM<br/>for next turn"]` },

  // SDK event -> SSE output mapping (table)
  'e974219a89af09f3': { type: 'table', code:
`| SDK side | Our SSE output |
| --- | --- |
| session created | \`event: acknowledge\` |
| agent processing | \`event: update\` |
| first response chunk | \`event: firstResponse\` |
| subsequent chunks | \`event: stream\` |
| send_and_wait resolves | \`event: final\` (ServiceResponse JSON) |` },

  // {COPILOT_HOME}/ directory tree
  '30e16114ae4969fd': { type: 'filetree' },

  // Agent loop write + resume read
  '72043deb16576fee': { type: 'mermaid', code:
`flowchart TD
  s["session.send_and_wait(Fix the bug)"] --> t1["Turn 1: LLM call + tool execution<br/>→ CLI writes checkpoint to disk (file write)"]
  t1 --> t2["Turn 2: LLM call + final response<br/>→ CLI writes checkpoint to disk (file write)"]
  t2 --> r["resume_session(conv-abc-123)"]
  r --> read["CLI reads checkpoints from disk (file read)<br/>→ full conversation history restored · LLM sees all turns"]` },

  // App Service <-> Azure Storage via SMB
  '5156159c2201053c': { type: 'mermaid', code:
`flowchart LR
  a["App Service<br/>COPILOT_HOME=/mnt/copilot-state<br/>CLI reads/writes as if local disk"] <-->|"SMB"| b["Azure Storage · File Share<br/>copilot-sessions<br/>conv-123/checkpoints · conv-456/"]` },

  // Full POST /chat_v3 lifecycle
  '9d0d1158b7b8ef6d': { type: 'mermaid', code:
`flowchart TD
  u["POST /chat_v3<br/>{message, conversationId: abc}"] --> app["app.py<br/>1 Verify VLAuth token · 2 Parse ServiceInput<br/>3 Extract conversation context"]
  app --> pq["session_manager.process_query()"]
  pq --> ack["yield event: acknowledge"]
  ack --> pc["4 ProviderConfigFactory.create()<br/>AzureTokenProvider.get_token()<br/>→ ProviderConfig(azure, bearer_token)"]
  pc --> sess["5 _get_or_create_session(abc)<br/>TRY resume_session / CATCH create_session"]
  sess --> upd["yield event: update"]
  upd --> bp["6 Build prompt<br/>resumed → raw query · new → prepend context"]
  bp --> logp["7 Log full prompt"]
  logp --> snd["8 session.send_and_wait(full_prompt)<br/>CLI agent loop · tools · final AssistantMessageEvent"]
  snd --> parse["9 ResponseParser.parse()<br/>→ display_answer, references, sources"]
  parse --> fr["yield event: firstResponse · stream ×N"]
  fr --> fin["10 SSEAdapter.final_response()<br/>ServiceResponse JSON + copilotMetadata"]
  fin --> final["yield event: final"]
  final --> alive["session stays alive — no disconnect"]` },

  // ---------------- DESIGN.md ----------------
  // Per-request construction
  'e8119691b7a0b2d1': { type: 'mermaid', code:
`flowchart TD
  r["Request arrives (FastAPI endpoint)"] --> q["Queue — asyncio.Queue, per request"]
  r --> t["Tools — built per request, filtered by user claims"]
  r --> a["Adapter — SSEAdapter, AGUIAdapter, …"]
  r --> sm["SessionManager — orchestrates the session"]
  sm --> s1["creates/resumes Copilot SDK session"]
  sm --> s2["sends prompt via session.send()"]
  sm --> s3["consumes events from queue"]
  sm --> s4["calls adapter lifecycle methods"]
  sm --> s5["yields formatted output to caller"]` },

  // UberOrchestrator/ directory tree
  'c2cd6aad680393cc': { type: 'filetree' },

  // ---------------- REPORTING_AGENT_DESIGN.md ----------------
  '4a1dc0ed9f8dd6be': { type: 'mermaid', code:
`flowchart TD
  core["Reporting Agent Core Logic<br/>query understanding → data fetch → viz build"] --> tool["@define_tool wrapper<br/>in-process, fast<br/>used by: UberOrchestrator (Copilot SDK)"]
  core --> a2a["A2A endpoint wrapper<br/>HTTP/SSE, interop<br/>used by: M365 Copilot · third-party agents"]` },

  // ---------------- SESSION_PERSISTENCE_DESIGN.md ----------------
  // Front Door -> 2 app svc -> storage
  '52c4ac34d765ac57': { type: 'mermaid', code:
`flowchart TD
  fd["Azure Front Door<br/>(Round Robin)"] --> e["App Svc · East US :8001"]
  fd --> w["App Svc · West EU :8001"]
  e --> st["Session Storage Layer<br/>Azure File Share OR Cosmos DB"]
  w --> st` },

  // Read/write checkpoint timeline
  'd2cd60e14afd090a': { type: 'mermaid', code:
`flowchart TD
  r["Request arrives (resume session conv-123)"] --> op1["Op 1 · READ — load checkpoint file<br/>resume_session reads saved state"]
  op1 --> loop["Agent loop begins…"]
  loop --> t1["Turn 1: LLM call + tool execution<br/>Op 2 · WRITE — save checkpoint"]
  t1 --> t2["Turn 2: LLM call + tool execution<br/>Op 3 · WRITE — save checkpoint"]
  t2 --> t3["Turn 3: LLM call + final response<br/>Op 4 · WRITE — save checkpoint"]
  t3 --> resp["Response sent to user"]` },

  // Front Door SMB latency
  '2484a7103ad31a9b': { type: 'mermaid', code:
`flowchart TD
  fd["Azure Front Door<br/>(Round Robin)"] --> e["App Svc · East US"]
  fd --> w["App Svc · West EU"]
  e -->|"SMB ~1-5ms (local)"| fs["Azure File Share (East US)<br/>single region — all I/O goes here"]
  w -->|"SMB ~60-120ms (cross-region)"| fs` },

  // Cosmos replica
  'c91b46a1d747582c': { type: 'mermaid', code:
`flowchart TD
  fd["Azure Front Door<br/>(Round Robin)"] --> e["App Svc · East US"]
  fd --> w["App Svc · West EU"]
  e -->|"REST &lt;10ms (local replica)"| ce["Cosmos DB Replica · East US"]
  w -->|"REST &lt;10ms (local replica)"| cw["Cosmos DB Replica · West EU"]
  ce <-->|"replication"| cw` },

  // Latency-based routing
  'e172544719981c60': { type: 'mermaid', code:
`flowchart TD
  fd["Azure Front Door<br/>Latency-based routing → nearest region"] --> eu["EU users → West EU (all msgs)"]
  fd --> us["US users → East US (all msgs)"]
  eu --> cw["Cosmos DB · West EU"]
  us --> ce["Cosmos DB · East US"]
  cw <-->|"replication"| ce` },

  // ---------------- SESSION_PERSISTENCE_IMPL.md ----------------
  // core/ directory tree
  '1a5ac44360c275bf': { type: 'filetree' },

  // ---------------- AgentContextEngineering.md ----------------
  // 3-tier context strategy
  'ffb05ad3cb196740': { type: 'mermaid', code:
`flowchart TD
  t1["Tier 1 · Recent Context (Detailed) — tokens 0-2000<br/>full execution details · complete decision history<br/>detailed constraints · recent errors/warnings<br/>strategy: store as-is, no compression"]
  t2["Tier 2 · Medium-Age (Compressed) — tokens 2000-5000<br/>summarized executions · compressed decisions<br/>important constraints only · aggregated errors<br/>strategy: lossless compression / externalize + ref links"]
  t3["Tier 3 · Old Context (Summarized) — tokens 5000+<br/>1-2 line summary each · cross-cutting constraints only<br/>ref links to full context · high-level timeline<br/>strategy: keep essence, externalize to key-value store"]
  t1 --> t2 --> t3` },

  // Caller / Orchestrator / Decision layers
  '283978c99b35b82e': { type: 'mermaid', code:
`flowchart TD
  subgraph C1["Caller / Invoker Layer"]
    a1["1 RETRIEVE stored external_context (agent-specific)<br/>2 get other relevant data<br/>3 PACKAGE: format for invocation"]
    a2["Prepared input:<br/>query · pageContext · aad_token · conversation_context (agent memory)"]
    a1 --> a2
  end
  subgraph C2["Agent Orchestrator Execution"]
    b1["1 PARSE prior context · 2 APPLY prior decisions/constraints<br/>3 EXECUTE tools · 4 EXTRACT execution & external context<br/>5 RETURN structured data"]
    b2["Return structure:<br/>agent_type · response · execution_context (internal) · external_context (memorize)"]
    b1 --> b2
  end
  subgraph C3["Caller Decision Layer"]
    c1["1 EXTRACT external_context · 2 EVALUATE token size & relevance<br/>3 TIERED strategy: compress if needed<br/>4 STORE in history · 5 READY for next invocation"]
    c2["Stored in history:<br/>agent_type · external_context · timestamp · execution_id"]
    c1 --> c2
  end
  C1 --> C2 --> C3` },

  // ---------------- Multi agent Architectures.md / MultiAgentArchitecture.md ----------------
  // 4-Agent Hierarchy (identical block in both files -> same hash)
  'fe57c870ce632743': { type: 'mermaid', code:
`flowchart TD
  u["User → FastAPI"] --> vlc["VLC Agent · Router/Dispatcher<br/>8-13 skill tools depending on perms"]
  vlc -->|"only for quote operations"| od["OnDemand Quote Agent · Coordinator<br/>8 meta-tools: Planner, Think, PushBack, PushFront,<br/>Pop, View, Delete, UpdateArgs"]
  od --> pl["Planner Agent<br/>~12 read tools: FetchEntity, FetchEnum,<br/>FetchSchema, ProductSearch, CustomerResearch"]
  od --> ex["Execution Agent<br/>~100+ CRUD sub-tools: Products, Enrollments,<br/>Contacts, Tenants, Orgs, CPS, Exceptions, DCO workflows"]` },

  // pop_task_queue execution breakdown
  'f5f368d77fbd06df': { type: 'mermaid', code:
`flowchart TD
  a["OnDemand Agent → pop_task_queue(pop_and_execute=True)"] --> b["task_queue.pop() — FIFO dequeue"]
  b --> c["mark INPROGRESS + emit TaskStatusEvent"]
  c --> d["convert_task_to_query(task) — NL render"]
  d --> e["get_filtered_tools_for_execution() — entity narrowing"]
  e --> f["hydrate page_context, aad_token, conv_ctx"]
  f --> g["inject per-tool runtime attrs"]
  g --> h["asyncio.wait_for → ExecutionOrchestrator.invoke()"]
  h --> h1["_filter_tools_by_role() — second narrowing (role)"]
  h1 --> h2["LlamaIndex agent loop — tool calls + reasoning<br/>each sub-tool emits Progress/Refresh/TaskStatus events"]
  h2 --> h3["FINAL event with ServiceResponse"]
  h3 --> i["process_stream re-emits all events upward"]
  i --> j["map_executor_task_to_task_queue() — reconcile UUID spaces"]
  j --> k{"_is_task_failed(response)?"}
  k -->|"failed"| k1["_clear_remaining_tasks()"]
  k -->|"ok"| l["persist execution context + task_queue to ctx.store"]
  k1 --> l
  l --> m["return PopTaskQueueOutput JSON<br/>success · task · task_response · queue_size · message"]` },

  // ---------------- Approach for Interviews.md ----------------
  '0bf9b9377a6e648e': { type: 'mermaid', code:
`flowchart LR
  c["Client"] --> g["API Gateway"] --> a["AI Layer"] --> l["LLM(s)"]
  a --> d["Data / RAG"]` },

  // ---------------- IndianQuestionBank.md ----------------
  // Support agent flow
  '00eafca106795ba5': { type: 'mermaid', code:
`flowchart TD
  i["Intake — initial classification"] --> r["Research — RAG retrieval"]
  r --> ca{"Can answer?"}
  ca -->|"No"| esc["Escalate"]
  ca -->|"Yes"| resp["Respond"]
  resp --> conf["Confirm — user satisfied?"]` },

  // Request -> Smart Router
  '5a9ae8a1c06dd211': { type: 'mermaid', code:
`flowchart TD
  r["Request"] --> sr["Smart Router"]` },
};
