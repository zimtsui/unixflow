export abstract class Thread implements AsyncIterator<string> {
    protected static count = 0;

    protected children: Map<number, Thread> = new Map();
    protected attachment: Thread | null = null;

    protected abstract duplicate(): Thread;

    protected async fork(): Promise<string> {
        const child = this.duplicate();
        const id = Thread.count++;
        this.children.set(id, child);
        const message = await this.forked(
            `You are the parent thread. The id of the child thread is ${id}.`,
            await child.forked(`You are the child thread.`),
        );
        return await this.talk(message);
    }
    protected abstract forked(fres: string, tres?: string): Promise<string>;

    protected async detach(): Promise<string> {
        this.attachment = null;
        const message = await this.detached(`You have detached from child threads.`);
        return await this.talk(message);
    }
    protected abstract detached(fres: string): Promise<string>;

    protected async attach(id: number): Promise<string> {
        const child = this.children.get(id);
        if (child) {} else throw new Error();
        this.attachment = child;
        const message = await this.attached(`You have attached to the child thread with id ${id}.`);
        return await this.talk(message);
    }
    protected abstract attached(fres: string): Promise<string>;

    protected async talk(message: string): Promise<string> {
        while (this.attachment) {
            const response = await this.attachment.talked(message);
            message = await this.talked(response);
        }
        return message;
    }
    protected abstract talked(tres: string): Promise<string>;

    protected async join(id: number): Promise<string> {
        const child = this.children.get(id);
        if (child) {} else throw new Error();
        this.children.delete(id);
        this.attachment = null;
        const message = await this.joined(`You have joined the child thread with id ${id}.`);
        return await this.talk(message);
    }
    protected abstract joined(fres: string): Promise<string>;

    public async next(message: string): Promise<IteratorResult<string, never>> {
        return {
            done: false,
            value: await this.talked(message),
        };
    }
}
