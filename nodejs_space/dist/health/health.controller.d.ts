export declare class HealthController {
    check(): {
        status: string;
        timestamp: string;
        service: string;
    };
    keepWarm(): {
        status: string;
        timestamp: string;
        message: string;
    };
}
