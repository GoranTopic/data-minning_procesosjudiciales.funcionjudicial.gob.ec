// Declaration file for modules without TypeScript definitions

declare module 'files-js' {
    export function mkdir(path: string): void;
}

declare module 'proxy-rotator-js' {
    export default class ProxyRotator {
        constructor(path: string, options: { shuffle: boolean; returnAs: string });
        next(): { ip: string; port: number; [key: string]: any } | null;
    }
}

declare module 'checklist-js' {
    export default class Checklist {
        constructor(values: string[], options: {
            name: string;
            path: string;
            recalc_on_check: boolean;
            save_every_check: number;
        });
        next(): string | undefined;
        check(value: string): void;
        isDone(): boolean;
        delete(): void;
        valuesDone(): number;
        valuesCount(): number;
    }
}

declare module 'dstore-js' {
    export default class Storage {
        constructor(options: {
            type: string;
            url: string;
            database: string;
        });
        open(name: string): Promise<{
            push: (data: any) => Promise<void>;
            get: (query: any) => Promise<any[]>;
            close: () => Promise<void>;
        }>;
    }
}

declare module 'waiting-for-js' {
    const wait: {
        for: {
            shortTime(): Promise<void>;
            longTime(): Promise<void>;
        }
    };
    export default wait;
}

declare module 'slavery-js' {
    export default function slavery(options: {
        timeout?: number;
        numberOfSlaves?: number;
        host: string;
        port: number;
    }): {
        master: (callback: (master: any) => Promise<void>) => void;
        slave: (callback: (params: any, slave: any) => Promise<any>) => void;
    };
}
