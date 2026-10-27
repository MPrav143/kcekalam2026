import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateReports } from './reporters/generate-report.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RESULTS_DIR = path.join(__dirname, 'results');
if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

// Find k6 binary
function getK6Path() {
    const candidates = [
        'C:\\Program Files\\k6\\k6.exe',
        path.join(process.env.LOCALAPPDATA || '', 'Programs', 'k6', 'k6.exe')
    ];
    for (const c of candidates) {
        if (fs.existsSync(c)) {
            return `"${c}"`;
        }
    }
    return 'k6';
}

const scenarioArg = process.argv[2] || 'smoke';
const targetApi = process.env.API_URL || 'http://localhost:5000/api';
const targetFrontend = process.env.FRONTEND_URL || 'http://[::1]:5173';

const SCENARIOS = {
    smoke: {
        file: '01-smoke.js',
        name: 'Smoke Test (1-3 VUs)',
    },
    'ramp-up': {
        file: '02-ramp-up.js',
        name: 'Ramp-Up Test (0 to 500 VUs)',
    },
    sustained: {
        file: '03-sustained-500vu.js',
        name: 'Sustained 500-VU Peak Load Test',
    },
    spike: {
        file: '04-spike.js',
        name: 'Traffic Spike Test (20 to 500 VUs)',
    },
    recovery: {
        file: '05-recovery.js',
        name: 'Overload Recovery Test',
    },
    admin: {
        file: '06-admin-isolated.js',
        name: 'Isolated Admin Operations Test',
    }
};

const chosen = SCENARIOS[scenarioArg];
if (!chosen) {
    console.error(`Unknown scenario: "${scenarioArg}". Available: ${Object.keys(SCENARIOS).join(', ')}`);
    process.exit(1);
}

const scriptPath = path.join(__dirname, 'scenarios', chosen.file);
const summaryJson = path.join(RESULTS_DIR, `${scenarioArg}-summary.json`);
const k6Bin = getK6Path();

console.log('=================================================================');
console.log(`KALAM 2026: Executing ${chosen.name}`);
console.log(`Script       : ${scriptPath}`);
console.log(`API Target   : ${targetApi}`);
console.log(`FE Target    : ${targetFrontend}`);
console.log(`Output File  : ${summaryJson}`);
console.log('=================================================================\n');

const envVars = {
    ...process.env,
    API_URL: targetApi,
    FRONTEND_URL: targetFrontend,
};

const args = [
    'run',
    `--summary-export="${summaryJson}"`,
    `"${scriptPath}"`
];

const proc = spawnSync(k6Bin, args, {
    stdio: 'inherit',
    env: envVars,
    shell: true
});

if (fs.existsSync(summaryJson)) {
    console.log('\n--- Generating Analysis Reports ---');
    generateReports(summaryJson, chosen.name, targetApi);
} else {
    console.warn('\nWarning: k6 summary file was not generated.');
}

process.exit(proc.status || 0);
