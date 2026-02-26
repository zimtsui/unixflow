# Unixflow

Unixflow is a TypeScript framework for multi agent systems.

## Rationale

The mechanism of Agents in Unixflow is similar to Unix processes.

| Unix processes | Unixflow agents |
| --- | --- |
| A process can fork into two, one of which is the child process. | An agent can fork into two, one of which is the child agent. |
| A child process duplicates the context of the parent process. | A child agent duplicates the context of the parent agent. |
| The first thing a process should do after forking is to check whether it is the parent process or the child process. | The first thing an agent should do after forking is to check whether it is the parent agent or the child agent. |

## Motivation

In legacy multi agent systems, child agents are spawned with empty contexts. It's difficult for the parent agent to pass detailed task requirements to the child agent.

In Unixflow, child agents are spawned with duplicated contexts, and thoroughly understand every detail of the task requirements.
