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
```

Each log method accepts optional formatting settings as the last argument:

```TS
{
    pad: boolean;
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
        pad: true,
        lineBreakStart: false,
        lineBreakEnd: true
    }
    console.fmt.error(error, "AARRGGHHH", consoleParams);
}
```
