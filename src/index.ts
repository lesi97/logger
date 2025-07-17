declare global {
    interface Console {
        fmt: Fmt;
    }
}

export type CustomLogOptionsType = {
    type: keyof Console;
    lineBreakStart: boolean;
    lineBreakEnd: boolean;
    padMessage: boolean;
    jsonSpacer: number;
    backgroundValue: keyof Fmt['ansiBackground'] | string;
    textValue: keyof Fmt['ansiText'] | string;
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

type CustomLogMethod = 'success' | 'custom';

export class Fmt {
    private isBrowser = typeof window !== 'undefined';
    private ansiText = {
        BLACK: '\x1b[30m',
        RED: '\x1b[31m',
        GREEN: '\x1b[32m',
        YELLOW: '\x1b[33m',
        BLUE: '\x1b[34m',
        MAGENTA: '\x1b[35m',
        CYAN: '\x1b[36m',
        WHITE: '\x1b[37m',
        LIGHT_GRAY: '\x1b[37m',
        DARK_GRAY: '\x1b[90m',
        LIGHT_RED: '\x1b[91m',
        LIGHT_GREEN: '\x1b[92m',
        LIGHT_YELLOW: '\x1b[93m',
        LIGHT_BLUE: '\x1b[94m',
        LIGHT_MAGENTA: '\x1b[95m',
        LIGHT_CYAN: '\x1b[96m',
        LIGHT_WHITE: '\x1b[97m',
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
        LIGHT_RED: '\x1b[48;5;196m',
        LIGHT_GREEN: '\x1b[48;5;46m',
        LIGHT_YELLOW: '\x1b[48;5;226m',
        LIGHT_BLUE: '\x1b[48;5;39m',
        LIGHT_MAGENTA: '\x1b[48;5;201m',
        LIGHT_CYAN: '\x1b[48;5;51m',
        LIGHT_WHITE: '\x1b[48;5;15m',
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
            LIGHT_RED: '#FF6347',
            LIGHT_GREEN: '#90EE90',
            LIGHT_YELLOW: '#FFFFE0',
            LIGHT_BLUE: '#ADD8E6',
            LIGHT_MAGENTA: '#DDA0DD',
            LIGHT_CYAN: '#E0FFFF',
            LIGHT_WHITE: '#F8F8FF',
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

    private getFormatting(type: LogMethod | CustomLogMethod) {
        const formattingServer = {
            log: this.ansiText.WHITE,
            info: this.ansiText.BLUE,
            warn: this.ansiText.YELLOW,
            error: `${this.ansiBackground.RED}${this.ansiText.WHITE}`,
            debug: this.ansiText.MAGENTA,
            trace: this.ansiText.BLUE,
            table: this.ansiText.GREEN,
            assert: this.ansiText.WHITE,
            success: this.ansiText.GREEN,
            custom: '',
        };

        const formattingClient = {
            log: '',
            info: 'color: aqua;',
            warn: 'color: yellow;',
            error: '',
            debug: 'color: magenta;',
            trace: 'color: cyan;',
            table: 'color: lime;',
            assert: '',
            success: 'color: lime',
            custom: '',
        };

        return {
            server: formattingServer[type] ?? this.ansiText.WHITE,
            client: formattingClient[type] ?? '',
        };
    }

    private getCustomFormatting(options: Partial<CustomLogOptionsType>) {
        const colours = {} as Partial<CustomLogOptionsType>;
        if (options.backgroundValue) {
            colours.backgroundValue = options.backgroundValue;
        }
        if (options.textValue) {
            colours.textValue = options.textValue;
        }
        const server = Object.entries(colours)
            .map(([key, value]) => {
                const stringValue = value as string;
                if (key === 'backgroundValue') {
                    const typedValue =
                        stringValue.toUpperCase() as keyof Fmt['ansiBackground'];
                    const formattedValue = stringValue
                        .toLowerCase()
                        .startsWith('\\x1b')
                        ? stringValue
                        : this.ansiBackground[typedValue];
                    return formattedValue;
                }
                if (key === 'textValue') {
                    const typedValue =
                        stringValue.toUpperCase() as keyof Fmt['ansiText'];
                    const formattedValue = stringValue
                        .toLowerCase()
                        .startsWith('\\x1b')
                        ? stringValue
                        : this.ansiText[typedValue];
                    return formattedValue;
                }
            })
            .join(' ');
        const client = Object.entries(colours)
            .map(([key, value]) => {
                const stringValue = value as string;
                if (key === 'backgroundValue') {
                    const typedValue =
                        stringValue.toUpperCase() as keyof Fmt['ansiBackground'];
                    const formattedValue =
                        stringValue.startsWith('#') ||
                        stringValue.toLowerCase().startsWith('rgb')
                            ? stringValue
                            : this.ansiToHex(typedValue);
                    return `background-color:${formattedValue}`;
                }
                if (key === 'textValue') {
                    const typedValue =
                        stringValue.toUpperCase() as keyof Fmt['ansiBackground'];
                    const formattedValue =
                        stringValue.startsWith('#') ||
                        stringValue.toLowerCase().startsWith('rgb')
                            ? stringValue
                            : this.ansiToHex(typedValue);
                    return `color:${formattedValue}`;
                }
            })
            .join(';');
        return {
            server: server ?? this.ansiText.WHITE,
            client: client ?? '',
        };
    }

    private write(
        type: LogMethod,
        args: Printable[],
        customType?: CustomLogMethod
    ) {
        let options: Partial<CustomLogOptionsType> = {};
        let messages: Printable[] = args;

        const lastArg = args[args.length - 1];
        if (
            typeof lastArg === 'object' &&
            !Array.isArray(lastArg) &&
            lastArg !== null &&
            ('type' in lastArg ||
                'padMessage' in lastArg ||
                'lineBreakStart' in lastArg ||
                'lineBreakEnd' in lastArg ||
                'jsonSpacer' in lastArg ||
                'backgroundValue' in lastArg ||
                'textValue' in lastArg)
        ) {
            options = lastArg as Partial<CustomLogOptionsType>;
            messages = args.slice(0, -1);
        }

        const {
            padMessage = false,
            lineBreakStart = this.isBrowser ? false : true,
            lineBreakEnd = this.isBrowser ? false : true,
            jsonSpacer,
        } = options;

        const { server, client } =
            customType && customType === 'custom'
                ? this.getCustomFormatting(options)
                : this.getFormatting(customType ?? type);

        const padMessageMessage = padMessage ? ' ' : '';
        const formattedMessages = messages.map((message) =>
            this.stringify(message, jsonSpacer)
        );
        const joinedMessage = formattedMessages.join(' ');

        const output = `${
            lineBreakStart ? '\n' : ''
        }${padMessageMessage}${joinedMessage}${padMessageMessage}${
            lineBreakEnd ? '\n' : ''
        }`;

        const method = (...args: any[]) =>
            typeof console[type] === 'function'
                ? (console[type] as (...args: any[]) => void)(...args)
                : console.log(...args);

        if (this.isBrowser) {
            method(`%c${output}${lineBreakEnd ? '\n' : ''}`, client);
        } else {
            let fullMessage = `${
                lineBreakStart ? '\n' : ''
            }${server}${padMessageMessage}${joinedMessage}${padMessageMessage}${
                this.RESET
            }`;

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
     * Logs to the console with green text
     *
     * @param {...Printable[]} args Values to be printed to the console
     * @defaults_client
     * ```json
     * {
     *  padMessage: false,
     *  lineBreakStart: false,
     *  lineBreakEnd: false,
     *  jsonSpacer: 2
     * }
     * ```
     *
     * @defaults_server
     * ```json
     * {
     *  padMessage: false,
     *  lineBreakStart: true,
     *  lineBreakEnd: true,
     *  jsonSpacer: 2
     * }
     * ```
     *
     * @see {@link https://npm.lesi.dev/-/web/detail/@c_lesi/better-logger Read the docs}
     */
    success(...args: Printable[]) {
        this.write('log', args, 'success');
    }

    /**
     * Logs to the console with blue text
     * @param {...Printable[]} args Values to be printed to the console
     * @defaults_client
     * ```json
     * {
     *  padMessage: false,
     *  lineBreakStart: false,
     *  lineBreakEnd: false,
     *  jsonSpacer: 2
     * }
     * ```
     *
     * @defaults_server
     * ```json
     * {
     *  padMessage: false,
     *  lineBreakStart: true,
     *  lineBreakEnd: true,
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
     *  padMessage: false,
     *  lineBreakStart: false,
     *  lineBreakEnd: false,
     *  jsonSpacer: 2
     * }
     * ```
     *
     * @defaults_server
     * ```json
     * {
     *  padMessage: false,
     *  lineBreakStart: true,
     *  lineBreakEnd: true,
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
     *  padMessage: false,
     *  lineBreakStart: false,
     *  lineBreakEnd: false,
     *  jsonSpacer: 2
     * }
     * ```
     *
     * @defaults_server
     * ```json
     * {
     *  padMessage: false,
     *  lineBreakStart: true,
     *  lineBreakEnd: true,
     *  jsonSpacer: 2
     * }
     * ```
     *
     * @see {@link https://npm.lesi.dev/-/web/detail/@c_lesi/better-logger Read the docs}
     */
    error(...args: Printable[]) {
        this.write('error', args);
    }

    /**
     * Logs to the console with custom colours
     *
     * Client side logs accept hex/rgb values or a pre-defined variable code
     *
     * Server side logs accept ansi character codes or a pre-defined variable code
     *
     * @param {...Printable[]} args Values to be printed to the console
     * @defaults_client
     * ```json
     * {
     *  padMessage: false,
     *  lineBreakStart: false,
     *  lineBreakEnd: false,
     *  jsonSpacer: 2,
     * }
     * ```
     * @additional_client_params
     * ```json
     * {
     *  backgroundValue: string | keyof Fmt['ansiBackground'],
     *  text: string | keyof Fmt['ansiText'],
     * }
     * ```
     *
     * @defaults_server
     * ```json
     * {
     *  padMessage: false,
     *  lineBreakStart: true,
     *  lineBreakEnd: true,
     *  jsonSpacer: 2,
     * }
     * ```
     * @additional_server_params
     * ```json
     * {
     *  backgroundValue: keyof Fmt['ansiBackground'],
     *  text: keyof Fmt['ansiText'],
     * }
     * ```
     *
     *  Text Colors:
     * - BLACK
     * - RED
     * - GREEN
     * - YELLOW
     * - BLUE
     * - MAGENTA
     * - CYAN
     * - WHITE
     * - LIGHT_GRAY
     * - DARK_GRAY
     * - LIGHT_RED
     * - LIGHT_GREEN
     * - LIGHT_YELLOW
     * - LIGHT_BLUE
     * - LIGHT_MAGENTA
     * - LIGHT_CYAN
     * - LIGHT_WHITE
     *
     * Background Colors:
     * - BLACK
     * - RED
     * - GREEN
     * - YELLOW
     * - BLUE
     * - MAGENTA
     * - CYAN
     * - WHITE
     * - LIGHT_RED
     * - LIGHT_GREEN
     * - LIGHT_YELLOW
     * - LIGHT_BLUE
     * - LIGHT_MAGENTA
     * - LIGHT_CYAN
     * - LIGHT_WHITE
     *
     * @see {@link https://npm.lesi.dev/-/web/detail/@c_lesi/better-logger Read the docs}
     */
    custom(...args: Printable[]) {
        this.write('log', args, 'custom');
    }
}

(() => {
    const fmt = new Fmt();
    console.fmt = fmt;
})();
