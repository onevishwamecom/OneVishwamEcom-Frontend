# AI & LLM Operating Instructions

> **MANDATORY NOTICE FOR ALL AI / LLM CODING ASSISTANTS:**
> Read and adhere strictly to these instructions on **EVERY PROMPT RUN** before executing commands, inspecting files, creating commits, or modifying code in this workspace.

---

## 1. Mandatory Pre-Execution Rule

- **MUST READ AGENTS.MD ON EVERY RUN:**
  - AI assistants MUST read and enforce all instructions in `AGENTS.md` before performing any tasks or edits.

---

## 2. Strict Git & Version Control Guidelines

- **NO PERMISSION, NO GIT ACTIONS:**
  - **DO NOT** run `git add`, `git commit`, `git push`, or `git merge` without explicit permission from the user.
  - Always request confirmation or wait for direct instruction before touching git index, commits, or remotes.

- **JUST PUSH (NO FULL CYCLE):**
  - When the user instructs to "push" or "push all code", **ONLY push the active branch / target code directly**.
  - **DO NOT** perform a full cycle (do not automatically checkout other branches or perform cascading merges across branches). Just push what was requested.

- **MERGE WORKFLOW CUTOFF (CUT OFF AFTER QA):**
  - If the user explicitly asks to "merge the code", the merge chain **MUST CUT OFF after `qa`**:
    $$\text{feature / fix} \longrightarrow \text{develop} \longrightarrow \text{qa}$$
  - **NEVER merge into `main`** unless the user specifically and explicitly states to merge into `main`.

---

## 3. Branch & Data Source Policy

- **STATIC SITE BRANCH (`StaticSite`):**
  - **ONLY** the `StaticSite` branch is permitted to use local dummy data files (`dummyProperties`, `dummyAutomobiles`, `dummyBedding`, etc.).

- **ALL OTHER BRANCHES (`fix/*`, `feature/*`, `develop`, `qa`, `main`, etc.):**
  - **MUST** connect to and rely on pure API backend endpoints for all product listings, properties, vehicles, categories, and marketplace data.
  - **NEVER** replace API hooks or backend calls with local dummy data files in non-`StaticSite` branches.

- **PORTING COMMITS / CHERRY-PICKING TO NON-STATIC BRANCHES:**
  - When asked to port changes from a commit ID (e.g., from `StaticSite` to `fix/*`, `feature/*`, `develop`, `qa`, `main`), **ONLY apply UI, structural, styling, and functional component changes**.
  - **NEVER** copy or introduce local product dummy data files or replace API hooks with dummy data imports when porting commits to non-`StaticSite` branches.

---

## 4. Testing & Verification

- Test code changes with `npm run build` or appropriate unit tests before declaring completion.
- Keep the working directory clean and do not leave untracked temporary scripts or files.
