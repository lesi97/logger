declare global {
    interface Console {
        fmt: Fmt;
    }
}

export type LogOptionsType = {
    type: keyof Console;
    lineBreakStart: boolean;
    lineBreakEnd: boolean;
    pad: boolean;
    jsonSpacer: number;
};

export type CustomLogOptionsType = {
    type: keyof Console;
    lineBreakStart: boolean;
    lineBreakEnd: boolean;
    pad: boolean;
    jsonSpacer: boolean;
    bg: keyof Fmt['ansiBackground'];
    text: keyof Fmt['ansiText'];
};

export type Printable =
    | string
    | number
    | boolean
    | object
    | symbol
    | null
    | undefined
    | Error
    | unknown
    | never
    | any;

type LogMethod =
    | 'log'
    | 'info'
    | 'warn'
    | 'error'
    | 'debug'
    | 'trace'
    | 'table'
    | 'assert';

export class Fmt {
    private isBrowser = typeof window !== 'undefined';
    private ansiText = {
        BLACK: '\x1b[30m',
        RED: '\x1b[31m',
        GREEN: '\x1b[32m',
        YELLOW: '\x1b[33m',
        BLUE: '\x1b[34m',
        MAGENTA: '\x1b[35m',
        WHITE: '\x1b[37m',
    };
    private ansiBackground = {
        BLACK: '\x1b[40m',
        RED: '\x1b[41m',
        GREEN: '\x1b[42m',
        YELLOW: '\x1b[43m',
        BLUE: '\x1b[44m',
        MAGENTA: '\x1b[45m',
        CYAN: '\x1b[46m',
        WHITE: '\x1b[47m',
    };
    private RESET = '\x1b[0m';

    private ansiToHex(colour: keyof Fmt['ansiBackground']): string {
        const map: Record<keyof Fmt['ansiBackground'], string> = {
            BLACK: '#000000',
            RED: '#FF0000',
            GREEN: '#00FF00',
            YELLOW: '#FFFF00',
            BLUE: '#0000FF',
            MAGENTA: '#FF00FF',
            CYAN: '#00FFFF',
            WHITE: '#FFFFFF',
        };

        return map[colour] ?? '#000000';
    }

    private stringify(val: Printable, jsonSpacer = 2): string {
        if (typeof val === 'string') return val;
        if (val instanceof Error) {
            return val.message;
        }
        if (
            typeof val === 'number' ||
            typeof val === 'boolean' ||
            val === null ||
            val === undefined
        )
            return String(val);
        try {
            return JSON.stringify(val, null, jsonSpacer);
        } catch {
            return '[Unserialisable Object]';
        }
    }

    private getFormatting(type: LogMethod) {
        const formattingServer = {
            log: this.ansiText.WHITE,
            info: this.ansiText.BLUE,
            warn: this.ansiText.YELLOW,
            error: `${this.ansiBackground.RED}${this.ansiText.WHITE}`,
            debug: this.ansiText.MAGENTA,
            trace: this.ansiText.BLUE,
            table: this.ansiText.GREEN,
            assert: this.ansiText.WHITE,
            custom: '',
        };

        const formattingClient = {
            log: '',
            info: 'color: aqua;',
            warn: 'color: yellow;',
            error: '',
            debug: 'color: magenta;',
            trace: 'color: cyan;',
            table: 'color: green;',
            assert: '',
            custom: '',
        };

        return {
            server: formattingServer[type] ?? this.ansiText.WHITE,
            client: formattingClient[type] ?? '',
        };
    }

    private write(type: LogMethod, args: Printable[]) {
        let options: Partial<LogOptionsType> = {};
        let messages: Printable[] = args;

        const lastArg = args[args.length - 1];
        if (
            typeof lastArg === 'object' &&
            !Array.isArray(lastArg) &&
            lastArg !== null &&
            ('type' in lastArg ||
                'pad' in lastArg ||
                'lineBreakStart' in lastArg ||
                'lineBreakEnd' in lastArg ||
                'jsonSpacer' in lastArg)
        ) {
            options = lastArg as Partial<LogOptionsType>;
            messages = args.slice(0, -1);
        }

        const {
            pad = false,
            lineBreakStart = this.isBrowser ? false : true,
            lineBreakEnd = this.isBrowser ? false : true,
            jsonSpacer,
        } = options;

        const { server, client } = this.getFormatting(type);

        const padMessage = pad ? ' ' : '';
        const formattedMessages = messages.map((message) =>
            this.stringify(message, jsonSpacer)
        );
        const joinedMessage = formattedMessages.join(' ');

        const output = `${
            lineBreakStart ? '\n' : ''
        }${padMessage}${joinedMessage}${padMessage}${lineBreakEnd ? '\n' : ''}`;

        const method = (...args: any[]) =>
            typeof console[type] === 'function'
                ? (console[type] as (...args: any[]) => void)(...args)
                : console.log(...args);

        if (this.isBrowser) {
            method(`%c${output}${lineBreakEnd && '\n'}`, client);
        } else {
            let fullMessage = `${
                lineBreakStart ? '\n' : ''
            }${server}${padMessage}${joinedMessage}${padMessage}${this.RESET}`;

            if (lineBreakEnd) {
                fullMessage += '\n';
            }

            method(fullMessage);
        }
    }

    /**
     * @see {@link https://npm.lesi.dev.dev/@c_lesi/better-logger Read the docs}
     */
    log(...args: Printable[]) {
        this.write('log', args);
    }

    /**
     * Logs to the console with blue text
     * @param {...Printable[]} args Values to be printed to the console
     * @defaults_client
     * ```json
     * {
     *  pad: false,
     *  lineBreakStart: true,
     *  lineBreakEnd: true,
     *  jsonSpacer: 2
     * }
     * ```
     *
     * @defaults_server
     * ```json
     * {
     *  pad: false,
     *  lineBreakStart: false,
     *  lineBreakEnd: false,
     *  jsonSpacer: 2
     * }
     * ```
     *
     * @see {@link https://npm.lesi.dev/-/web/detail/@c_lesi/better-logger Read the docs}
     */
    info(...args: Printable[]) {
        this.write('info', args);
    }

    /**
     * Logs to the console with yellow text
     * @param {...Printable[]} args Values to be printed to the console
     * @defaults_client
     * ```json
     * {
     *  pad: false,
     *  lineBreakStart: true,
     *  lineBreakEnd: true,
     *  jsonSpacer: 2
     * }
     * ```
     *
     * @defaults_server
     * ```json
     * {
     *  pad: false,
     *  lineBreakStart: false,
     *  lineBreakEnd: false,
     *  jsonSpacer: 2
     * }
     * ```
     *
     * @see {@link https://npm.lesi.dev/-/web/detail/@c_lesi/better-logger Read the docs}
     */
    warn(...args: Printable[]) {
        this.write('warn', args);
    }

    /**
     * Logs to the console with white text and a red background
     *
     * @param {...Printable[]} args Values to be printed to the console
     * @defaults_client
     * ```json
     * {
     *  pad: false,
     *  lineBreakStart: true,
     *  lineBreakEnd: true,
     *  jsonSpacer: 2
     * }
     * ```
     *
     * @defaults_server
     * ```json
     * {
     *  pad: false,
     *  lineBreakStart: false,
     *  lineBreakEnd: false,
     *  jsonSpacer: 2
     * }
     * ```
     *
     * @see {@link https://npm.lesi.dev/-/web/detail/@c_lesi/better-logger Read the docs}
     */
    error(...args: Printable[]) {
        this.write('error', args);
    }
}

(() => {
    const fmt = new Fmt();
    console.fmt = fmt;
})();
