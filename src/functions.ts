import { Type } from '@sinclair/typebox';

export default [
    {
        name: 'unixflow:fork',
        description: 'Duplicate yourself like a unix process, and you will become either the parent or the child agent. If you become the parent agent, your id keeps unchanged, and the response of this function call will be the id of the child agent. If you become the child agent, the response of this function call will be the first message sent to you from the parent.',
        paraschema: Type.Object({}),
    },
    {
        name: 'unixflow:attach',
        description: 'From the next chat round, you will be talking to the child agent who has the specified id.',
        paraschema: Type.Object({
            id: Type.Number({
                description: 'The id of the child agent',
            }),
        }),
    },
    {
        name: 'unixflow:detach',
        description: 'From the next chat round, you are talking to your parent agent if you are a child agent, or you are talking to the user if you are not a child agent.',
        paraschema: Type.Object({}),
    },
    {
        name: 'unixflow:join',
        description: 'Kill your child agent who has the specified id.',
        paraschema: Type.Object({
            id: Type.Number({
                description: 'The id of the child agent',
            }),
        }),
    },
    {
        name: 'unixflow:list',
        description: `Show your and your child agents' ids.`,
        paraschema: Type.Object({}),
    },
] as const;
