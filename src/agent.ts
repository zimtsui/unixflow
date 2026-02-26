export abstract class Agent implements AsyncIterator<string> {
    protected static count = 0;

    protected children: Map<number, Agent> = new Map();
    protected attachment: Agent | null = null;
    protected parent: Agent | null = null;
    protected id: number = 0;
    protected forking = false;

    protected abstract duplicated(): Agent;

    protected async fork(): Promise<string> {
        const child = this.duplicated();
        child.parent = this;
        child.children = new Map();
        child.id = Agent.count++;
        child.forking = true;
        this.children.set(child.id, child);
        const message = await this.forked(`You are the parent agent. Your id keeps ${this.id}. From now on, you are talking to the child agent, whose id is ${child.id}.`);
        return await this.talk(message);
    }
    protected abstract forked(fres: string, tres?: string): Promise<string>;

    protected async detach(): Promise<string> {
        this.attachment = null;
        const fres = this.parent
            ? `From now on, you are talking to your parent agent, whose id is ${this.parent.id}.`
            : `From now on, you are talking to the user.`;
        const message = await this.detached(fres);
        return await this.talk(message);
    }
    protected abstract detached(fres: string): Promise<string>;

    protected async attach(id: number): Promise<string> {
        const child = this.children.get(id);
        if (child) {} else throw new Error();
        this.attachment = child;
        const message = await this.attached(`From now on, you are talking to your child agent whose id is ${id}.`);
        return await this.talk(message);
    }
    protected abstract attached(fres: string): Promise<string>;

    protected async talk(message: string): Promise<string> {
        while (this.attachment) {
            const response = await this.attachment.next(message).then(result => result.value);
            message = await this.talked(response);
        }
        return message;
    }
    protected abstract talked(tres: string): Promise<string>;

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
        const message = await this.joined(fres);
        return await this.talk(message);
    }
    protected abstract joined(fres: string): Promise<string>;

    protected async list(): Promise<string> {
        const ids = this.children.keys();
        const fres = `Your id is ${this.id}. Your child agents' ids are ${[...ids].join(', ')}.`;
        const message = await this.listed(fres);
        return await this.talk(message);
    }
    protected abstract listed(fres: string): Promise<string>;

    public async next(message: string): Promise<IteratorResult<string, never>> {
        if (this.forking) {
            this.forking = false;
            return { done: false, value: await this.forked(message) };
        } else
            return { done: false, value: await this.talked(message) };
    }

}
