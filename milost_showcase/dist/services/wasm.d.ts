export declare function initializeWasm(): Promise<boolean>;
export declare function getWasmStatus(): {
    initialized: boolean;
    exports: string[];
    modules: Record<string, {
        initialized: boolean;
        available: boolean;
        methods?: string[];
        error?: string;
    }>;
    system: {
        nodeVersion: string;
        platform: NodeJS.Platform;
        arch: NodeJS.Architecture;
        totalMemory: string;
        freeMemory: string;
        uptime: string;
    };
    initTime: string | undefined;
    timeToInit: string | undefined;
};
