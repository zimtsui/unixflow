import { Type } from '@sinclair/typebox';

export default [
    {
        name: 'unixflow:fork',
        description: `
Duplicate yourself like a unix process, and you will become either the parent or the child agent.

If you become the parent agent, your agent id keeps unchanged, and the response of this function call will be the id of the child agent, and you will be talking to the child agent from the next chat round on.

If you become the child agent, the response of this function call will be the first message sent to you from the parent agent, and you will be talking to the parent agent from the next chat round on.
`,
        paraschema: Type.Object({}),
    },
    {
        name: 'unixflow:attach',
        description: `
Attach yourself to one of your child agents.

You will be talking to the child agent who has the specified id from the next chat round on.

Your conversation with your parent agent and with other child agents will be hanged on.
`,
        paraschema: Type.Object({
            id: Type.Number({
                description: 'The id of the child agent',
            }),
        }),
    },
    {
        name: 'unixflow:detach',
        description: `
Detach yourself from your child agents.

If you are a child agent, you will be talking to your parent agent from the next chat round on.

If you are not a child agent, you are talking to the user.

Your conversation with all your own child agents will be hanged on.
`,
        paraschema: Type.Object({}),
    },
    {
        name: 'unixflow:join',
        description: 'Kill your child agent who has the specified id.',
        paraschema: Type.Object({
            id: Type.Number(),
        }),
    },
    {
        name: 'unixflow:list',
        description: `Show your and your child agents' ids.`,
        paraschema: Type.Object({}),
    },
] as const;
