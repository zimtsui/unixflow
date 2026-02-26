import * as Unixflow from '@zimtsui/unixflow';
import OpenAI from 'openai';
declare const openai: OpenAI;


class Agent extends Unixflow.Agent {
    public constructor(
        protected messages: OpenAI.ChatCompletionMessageParam[],
        protected currentToolCallId = '',
    ) {
        super();
    }

    protected override duplicated(): Agent {
        return new Agent(structuredClone(this.messages), this.currentToolCallId);
    }

    protected async send(): Promise<string> {
        const completion = await openai.chat.completions.create({
            model: 'gpt-5-mini',
            messages: this.messages,
            tools: Unixflow.functions.map(f => ({
                type: 'function',
                function: {
                    name: f.name,
                    description: f.description,
                    parameters: f.paraschema,
                },
            })),
        });
        this.messages.push({ role: 'assistant', content: completion.choices[0]!.message.content! });
        if (completion.choices[0]!.message.tool_calls?.length === 0) {
            this.currentToolCallId = '';
            return completion.choices[0]!.message.content!;
        }
        if (completion.choices[0]!.message.tool_calls?.length === 1) {} else throw new Error();
        if (completion.choices[0]!.message.tool_calls[0]!.type === 'function') {} else throw new Error();
        this.currentToolCallId = completion.choices[0]!.message.tool_calls[0]!.id;
        switch (completion.choices[0]!.message.tool_calls[0]!.function.name as typeof Unixflow.functions[number]['name']) {
            case 'unixflow:fork': return await this.fork();
            case 'unixflow:attach': return await this.attach(JSON.parse(completion.choices[0]!.message.tool_calls[0]!.function.arguments).id);
            case 'unixflow:detach': return await this.detach();
            case 'unixflow:join': return await this.join(JSON.parse(completion.choices[0]!.message.tool_calls[0]!.function.arguments).id);
            case 'unixflow:list': return await this.list();
            default: throw new Error();
        }
    }

    protected override async replied(message: string): Promise<string> {
        if (this.currentToolCallId)
            this.messages.push({ role: 'tool', content: message, tool_call_id: this.currentToolCallId });
        else
            this.messages.push({ role: 'user', content: message });
        return await this.send();
    }
}

const agent = new Agent([
    { role: 'system', content: 'You are a helpful assistant.' },
]);

const message = await agent.next('Hello, agent!').then(result => result.value);
console.log(message);
