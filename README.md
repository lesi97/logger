# Lesi Logger

Custom `console.fmt` logger with formatted output and styling

## Installation

This package is self hosted so you must add a registry in your `.npmrc` file first
Your `.npmrc` file can be found at `~/.npmrc` on Mac and Linux or `C:\Users\%username%\.npmrc` on Windows
The line you must add is `@c_lesi:registry=https://npm.lesi.dev/`

The below commands will append this for you

### Mac/Linux

```bash
registry_line="c_lesi:registry=https://npm.lesi.dev/"; npmrc_path="${HOME}/.npmrc"; grep -Fxq "$registry_line" "$npmrc_path" 2>/dev/null || echo "$registry_line" >> "$npmrc_path"
```

### Windows

```powershell
$line = '@c_lesi:registry=https://npm.lesi.dev/'; $path = "$HOME\.npmrc"; $escaped = [regex]::Escape($line); if (-not (Test-Path $path)) { New-Item -ItemType File -Path $path -Force | Out-Null }; if (-not (Select-String -Path $path -Pattern $escaped -Quiet)) { Add-Content -Path $path -Value $line }
```

### Install with package manager

```bash
npm install @c_lesi/logger
# or
pnpm install @c_lesi/logger
# or
yarn add @c_lesi/logger
```

## Usage

Import the package into a single file with

```TS
import "@c_lesi/logger"
```

This then grants you access to use the below commands in all your files

```TS
console.fmt.info("This is info");
console.fmt.warn("This is a warning");
console.fmt.error("This is an error");
console.fmt.success("This is a success");
```

Each log method accepts optional formatting settings as the last argument:

```TS
{
    padMessage: boolean;
    lineBreakStart: boolean;
    lineBreakEnd: boolean;
    jsonSpacer: number;
}
```

Example:

```TS
try {
    throw new Error("An error has occurred!");
} catch (error) {
    const consoleParams = {
        padMessage: true,
        lineBreakStart: false,
        lineBreakEnd: true
    }
    console.fmt.error(error, "AARRGGHHH", consoleParams);
}
```

### Custom Logs

You can run a custom colour combination using the below

```TS
console.fmt.custom();
```

This accepts the optional parameters above as well as 2 other parameters in the options object:

```TS
{
    backgroundValue: string;
    textValue: string
}
```

You can use pre-defined colour codes which are listed below or your own custom colours
Within a server environment you will need to use ANSI codes and in a client browser you can use rgb/hex values

Example with custom colours:

```TS
const consoleParams = {
        padMessage: true,
        lineBreakStart: true,
        lineBreakEnd: true,
        backgroundValue: '#e8cd7e',
        textValue: 'rgb(227, 50, 75)'
    }
console.fmt.custom('Luffy will be King of the Pirates', consoleParams);
```

Example with pre-defined colours:

```TS
const consoleParams = {
        backgroundValue: 'red',
        textValue: 'blue'
    }
console.fmt.custom('Buggy might become King first 😬', consoleParams);
```

### Pre-defined Colours

#### Text Colors:

-   <span style="color:#000000;background-color:white;padding:0px 8px;">BLACK</span>
-   <span style="color:#FF0000;background-color:black;padding:0px 8px;">RED</span>
-   <span style="color:#00FF00;background-color:black;padding:0px 8px;">GREEN</span>
-   <span style="color:#FFFF00;background-color:black;padding:0px 8px;">YELLOW</span>
-   <span style="color:#0000FF;background-color:black;padding:0px 8px;">BLUE</span>
-   <span style="color:#FF00FF;background-color:black;padding:0px 8px;">MAGENTA</span>
-   <span style="color:#00FFFF;background-color:black;padding:0px 8px;">CYAN</span>
-   <span style="color:#FFFFFF;background-color:black;padding:0px 8px;">WHITE</span>
-   <span style="color:#FF6347;background-color:black;padding:0px 8px;">LIGHT_RED</span>
-   <span style="color:#90EE90;background-color:black;padding:0px 8px;">LIGHT_GREEN</span>
-   <span style="color:#FFFFE0;background-color:black;padding:0px 8px;">LIGHT_YELLOW</span>
-   <span style="color:#ADD8E6;background-color:black;padding:0px 8px;">LIGHT_BLUE</span>
-   <span style="color:#DDA0DD;background-color:black;padding:0px 8px;">LIGHT_MAGENTA</span>
-   <span style="color:#E0FFFF;background-color:black;padding:0px 8px;">LIGHT_CYAN</span>
-   <span style="color:#F8F8FF;background-color:black;padding:0px 8px;">LIGHT_WHITE</span>

#### Background Colors:

-   <span style="background-color:#000000;color:white;padding: 0px 8px;">BLACK</span>
-   <span style="background-color:#FF0000;color:white;padding: 0px 8px;">RED</span>
-   <span style="background-color:#00FF00;color:black;padding: 0px 8px;">GREEN</span>
-   <span style="background-color:#FFFF00;color:black;padding: 0px 8px;">YELLOW</span>
-   <span style="background-color:#0000FF;color:white;padding: 0px 8px;">BLUE</span>
-   <span style="background-color:#FF00FF;color:white;padding: 0px 8px;">MAGENTA</span>
-   <span style="background-color:#00FFFF;color:black;padding: 0px 8px;">CYAN</span>
-   <span style="background-color:#FFFFFF;color:black;padding: 0px 8px;">WHITE</span>
-   <span style="background-color:#FF6347;color:black;padding: 0px 8px;">LIGHT_RED</span>
-   <span style="background-color:#90EE90;color:black;padding: 0px 8px;">LIGHT_GREEN</span>
-   <span style="background-color:#FFFFE0;color:black;padding: 0px 8px;">LIGHT_YELLOW</span>
-   <span style="background-color:#ADD8E6;color:black;padding: 0px 8px;">LIGHT_BLUE</span>
-   <span style="background-color:#DDA0DD;color:black;padding: 0px 8px;">LIGHT_MAGENTA</span>
-   <span style="background-color:#E0FFFF;color:black;padding: 0px 8px;">LIGHT_CYAN</span>
-   <span style="background-color:#F8F8FF;color:black;padding: 0px 8px;">LIGHT_WHITE</span>
