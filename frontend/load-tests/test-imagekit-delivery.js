/**
 * ImageKit CDN Delivery & Bandwidth Compression Audit
 * Evaluates real ImageKit CDN response headers, compression ratios, and delivery latencies.
 */

const testAssets = [
    {
        name: 'KALAM Fest Logo',
        original: 'https://ik.imagekit.io/kalam/About%20Page/Logo.png',
        transformed: 'https://ik.imagekit.io/kalam/About%20Page/Logo.png?tr=w-320,q-85,f-auto'
    },
    {
        name: 'Hero Cosmic Background',
        original: 'https://ik.imagekit.io/kalam/About%20Page/Untitled%20design.png',
        transformed: 'https://ik.imagekit.io/kalam/About%20Page/Untitled%20design.png?tr=w-1920,q-75,f-auto'
    },
    {
        name: 'KCE Institution Logo',
        original: 'https://ik.imagekit.io/kalam/About%20Page/KCE%20Logo%202.png',
        transformed: 'https://ik.imagekit.io/kalam/About%20Page/KCE%20Logo%202.png?tr=w-240,q-85,f-auto'
    }
];

async function measureAsset(asset) {
    const t0 = performance.now();
    const origRes = await fetch(asset.original, { method: 'HEAD' });
    const origTime = Math.round(performance.now() - t0);
    const origSize = Number(origRes.headers.get('content-length') || 0);

    const t1 = performance.now();
    const optRes = await fetch(asset.transformed, {
        headers: { 'Accept': 'image/webp,image/avif,image/*,*/*' }
    });
    const optTime = Math.round(performance.now() - t1);
    const optSize = Number(optRes.headers.get('content-length') || 0);
    const optType = optRes.headers.get('content-type') || 'unknown';

    const savings = origSize > 0 ? (((origSize - optSize) / origSize) * 100).toFixed(1) : 'N/A';

    return {
        name: asset.name,
        origStatus: origRes.status,
        optStatus: optRes.status,
        origSizeKB: (origSize / 1024).toFixed(1),
        optSizeKB: (optSize / 1024).toFixed(1),
        savingsPercent: savings,
        optType,
        origLatencyMs: origTime,
        optLatencyMs: optTime
    };
}

async function runAudit() {
    console.log('===============================================================');
    console.log('KALAM 2026: ImageKit CDN Delivery & Bandwidth Reduction Audit');
    console.log('===============================================================\n');

    const results = [];
    for (const asset of testAssets) {
        process.stdout.write(`Evaluating ${asset.name}... `);
        const data = await measureAsset(asset);
        results.push(data);
        console.log(`[Done: ${data.savingsPercent}% saved]`);
    }

    console.log('\n--- IMAGEKIT AUDIT METRICS ---');
    console.table(results);

    const totalOrig = results.reduce((acc, r) => acc + Number(r.origSizeKB), 0);
    const totalOpt = results.reduce((acc, r) => acc + Number(r.optSizeKB), 0);
    const overallSavings = (((totalOrig - totalOpt) / totalOrig) * 100).toFixed(1);

    console.log(`Total Original Sample Size    : ${totalOrig.toFixed(1)} KB`);
    console.log(`Total Transformed Sample Size : ${totalOpt.toFixed(1)} KB`);
    console.log(`Net Bandwidth Reduction       : ${overallSavings}%`);
    console.log('===============================================================\n');
}

runAudit().catch(console.error);
