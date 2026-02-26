export abstract class Agent implements AsyncIterator<string> {
    protected static count = 0;

    protected children: Map<number, Agent> = new Map();
    protected attachment: Agent | null = null;
    protected parent: Agent | null = null;
    protected id: number = 0;

    protected abstract duplicated(): Agent;
    protected abstract replied(message: string): Promise<string>;

    protected async fork(): Promise<string> {
        const child = this.duplicated();
        child.parent = this;
        child.children = new Map();
        child.id = ++Agent.count;
        this.children.set(child.id, child);
        this.attachment = child;
        const message = await this.replied(`${child.id}`);
        return await this.talk(message);
    }

    protected async detach(): Promise<string> {
        this.attachment = null;
        const fres = this.parent
            ? `From now on, you are talking to your parent agent, whose id is ${this.parent.id}.`
            : `From now on, you are talking to the user.`;
        const message = await this.replied(fres);
        return await this.talk(message);
    }

    protected async attach(id: number): Promise<string> {
        const child = this.children.get(id);
        if (child) {} else throw new Error();
        this.attachment = child;
        const message = await this.replied(`From now on, you are talking to your child agent whose id is ${id}.`);
        return await this.talk(message);
    }

    protected async talk(message: string): Promise<string> {
        while (this.attachment) {
            const response = await this.attachment.next(message).then(result => result.value);
            message = await this.replied(response);
        }
        return message;
    }

    protected async join(id: number): Promise<string> {
        const child = this.children.get(id);
        if (child) {} else throw new Error();
        this.children.delete(id);
        let fres = '';
        if (this.attachment === child)
            fres += `You have killed and detached from your child agent whose id is ${id}. `;
        else
            fres += `You have killed your child agent whose id is ${id}. `;
        if (this.attachment === child) this.attachment = null;
        if (this.attachment)
            fres += `You are still talking to your child agent whose id is ${this.attachment.id}.`;
        else if (this.parent)
            fres += `From now on, you are talking to your parent agent, whose id is ${this.parent.id}.`;
        else
            fres += `From now on, you are talking to the user.`;
        const message = await this.replied(fres);
        return await this.talk(message);
    }

    protected async list(): Promise<string> {
        const ids = this.children.keys();
        const fres = `Your id is ${this.id}. Your child agents' ids are ${[...ids].join(', ')}.`;
        const message = await this.replied(fres);
        return await this.talk(message);
    }

    public async next(message: string): Promise<IteratorResult<string, never>> {
        return { done: false, value: await this.replied(message) };
    }

}
