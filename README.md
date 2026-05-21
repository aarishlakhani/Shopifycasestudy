# Shopify

A React + Vite app exported from Figma. Original design: [Figma file](https://www.figma.com/design/ZhAaodiIZK6PIeGP4MQ5ck/Recreate-Existing-Design).

## Prerequisites

Before you start, install:

- **[Node.js](https://nodejs.org/)** — use the **LTS** version (18 or 20+). On Apple Silicon Macs, use the **arm64** installer, not the Intel (x64) build.
- **npm** — included with Node.js

Verify your setup:

```bash
node -v    # e.g. v20.x.x
npm -v     # e.g. 10.x.x
node -p "process.arch"   # on M1/M2/M3 Macs, should print: arm64
```

## First-time setup (new computer)

### 1. Get the code

```bash
git clone <your-repo-url>
cd Shopifycasestudy
```

> **Tip:** Avoid keeping the project only on **Desktop** or **iCloud Drive** if you hit install errors — use a local folder like `~/Projects/Shopifycasestudy` instead.

### 2. Install dependencies

```bash
npm install
```

Wait until it finishes with no errors. You should see a `package-lock.json` file and a `node_modules` folder.

### 3. Start the dev server

```bash
npm run dev
```

Open the URL shown in the terminal (usually **http://localhost:5173**).

To install and start in one step (only runs dev if install succeeds):

```bash
npm install && npm run dev
```

### 4. Production build (optional)

```bash
npm run build
```

Output goes to the `dist/` folder.

## Available scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies (run once per machine, or after pulling changes) |
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Create a production build |

> Use **`npm run dev`**, not `npm dev`. The latter is not a valid npm command.

## Troubleshooting

### `sh: vite: command not found`

`npm install` did not complete successfully. Vite is never installed until install finishes.

```bash
rm -rf node_modules
npm cache clean --force
npm install
npm run dev
```

### `esbuild` install error — `Unknown system error -88`

This usually means macOS blocked or could not run the esbuild binary (common after a partial install, security software, or iCloud/Desktop sync issues).

Try in order:

1. **Clean reinstall**
   ```bash
   rm -rf node_modules
   npm install
   ```

2. **Clear extended attributes** (if step 1 still fails)
   ```bash
   xattr -cr node_modules
   npm install
   ```

3. **Move the project** off Desktop/iCloud to e.g. `~/Projects/`, then run `npm install` again.

4. **Check Node architecture** on Apple Silicon:
   ```bash
   node -p "process.arch"
   ```
   If this prints `x64` instead of `arm64`, reinstall Node using the arm64 installer from [nodejs.org](https://nodejs.org).

### Dev server runs even though install failed

If you run these as two separate commands, `npm run dev` runs even when `npm install` fails:

```bash
npm install
npm run dev   # still runs!
```

Use `&&` so dev only starts after a successful install:

```bash
npm install && npm run dev
```

## Project structure

```
├── src/           # React components and app code
├── index.html     # App entry HTML
├── vite.config.ts # Vite configuration
└── package.json   # Dependencies and scripts
```

## Need help?

- Check the [Vite docs](https://vite.dev/guide/)
- Review the npm debug log path shown in terminal errors (under `~/.npm/_logs/`)
