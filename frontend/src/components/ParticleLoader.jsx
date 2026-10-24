import { useEffect, useRef, useState, useCallback } from 'react';
import { useGlobalConfig } from '../context/GlobalConfigContext';

// Module-level cache for sampled logo particles and offscreen image asset
let cachedParticles = null;
let cachedTargetW = 0;
let cachedTargetH = 0;
let cachedImageElement = null;

// The official Logo.png has an intrinsic ratio of 1080 / 394 = ~2.7411
const LOGO_ASPECT_RATIO = 1080 / 394;

function generateTextParticles(targetW, targetH, label) {
    const offscreen = document.createElement('canvas');
    offscreen.width = targetW;
    offscreen.height = targetH;
    const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
    if (!offCtx) return { particles: [], imgElement: null };

    offCtx.clearRect(0, 0, targetW, targetH);
    const fontSize = Math.min(Math.floor(targetW / 8), Math.floor(targetH * 0.45));
    offCtx.font = `900 ${fontSize}px sans-serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';

    const grad = offCtx.createLinearGradient(0, 0, targetW, 0);
    grad.addColorStop(0, '#24BCE0');
    grad.addColorStop(0.5, '#D62C76');
    grad.addColorStop(1, '#F5A623');
    offCtx.fillStyle = grad;
    offCtx.fillText(label || 'KALAM 2026', targetW / 2, targetH / 2);

    const imageData = offCtx.getImageData(0, 0, targetW, targetH);
    const data = imageData.data;
    const particles = [];
    const stride = 2;
    const centerX = targetW / 2;
    const centerY = targetH / 2;

    for (let y = 0; y < targetH; y += stride) {
        for (let x = 0; x < targetW; x += stride) {
            const index = (y * targetW + x) * 4;
            const alpha = data[index + 3];
            if (alpha > 40) {
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                const angle = Math.random() * Math.PI * 2;
                const distance = 250 + Math.random() * 500;
                particles.push({
                    targetX: x - centerX,
                    targetY: y - centerY,
                    initialX: Math.cos(angle) * distance,
                    initialY: Math.sin(angle) * distance,
                    r, g, b, alpha: alpha / 255,
                    size: 1.5 + Math.random() * 1.5,
                    delay: Math.random() * 0.25,
                    color: `rgba(${r},${g},${b},${(alpha / 255).toFixed(2)})`
                });
            }
        }
    }
    return { particles, imgElement: offscreen };
}

function sampleLogoParticles(targetW, targetH, logoSrc = null, label = 'KALAM 2026') {
    return new Promise((resolve) => {
        if (!logoSrc) {
            resolve(generateTextParticles(targetW, targetH, label));
            return;
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = logoSrc;

        img.onload = () => {
            cachedImageElement = img;
            try {
                const offscreen = document.createElement('canvas');
                offscreen.width = targetW;
                offscreen.height = targetH;
                const offCtx = offscreen.getContext('2d', { willReadFrequently: true });

                if (!offCtx) {
                    reject(new Error('Canvas 2D context not available'));
                    return;
                }

                offCtx.clearRect(0, 0, targetW, targetH);
                offCtx.drawImage(img, 0, 0, targetW, targetH);

                const imageData = offCtx.getImageData(0, 0, targetW, targetH);
                const data = imageData.data;
                const particles = [];

                // Stride: step of 2 provides ~4,000 to ~7,500 particles for high density
                const stride = 2;
                const centerX = targetW / 2;
                const centerY = targetH / 2;

                const topScriptBoundary = targetH * 0.28;
                const bottomTaglineBoundary = targetH * 0.70;

                for (let y = 0; y < targetH; y += stride) {
                    for (let x = 0; x < targetW; x += stride) {
                        const index = (y * targetW + x) * 4;
                        const alpha = data[index + 3];

                        // Sample visible pixels
                        if (alpha > 30) {
                            const r = data[index];
                            const g = data[index + 1];
                            const b = data[index + 2];

                            const relX = x - centerX;
                            const relY = y - centerY;
                            const distFromCenter = Math.hypot(relX, relY);

                            // Section detection
                            const isTopScript = y < topScriptBoundary;
                            const isBottomTagline = y > bottomTaglineBoundary && x > targetW * 0.45;
                            const isMainGeometric = !isTopScript && !isBottomTagline;

                            // Directional splitting: Left group (-1) vs Right group (+1)
                            const splitGroup = (relX + (relY * 0.22)) < 0 ? -1 : 1;

                            // Dispersal vector: outward explosion with lateral shear & vortex curl
                            const disperseAngle = Math.atan2(relY * 1.3, relX) + (Math.random() - 0.5) * 0.5;
                            const disperseDistance = 140 + Math.random() * 260;

                            const shearX = splitGroup * (140 + Math.random() * 220);
                            const shearY = (relY < 0 ? -1 : 1) * (70 + Math.random() * 150) + (Math.random() - 0.5) * 60;

                            // Organic swirl
                            const vortexSpeed = (Math.random() * 1.8 + 1.2) * (Math.random() > 0.5 ? 1 : -1);
                            const vortexRadius = 25 + Math.random() * 45;

                            // Staggered progressive arrival:
                            // 1. Center geometric letters arrive first
                            // 2. Top script arrives next
                            // 3. Bottom tagline finishes
                            let arrivalDelay = 0;
                            if (isMainGeometric) {
                                arrivalDelay = Math.random() * 0.25;
                            } else if (isTopScript) {
                                arrivalDelay = 0.12 + Math.random() * 0.28;
                            } else {
                                arrivalDelay = 0.20 + Math.random() * 0.30;
                            }

                            // Dot size: slightly larger for geometric facets, finer for script
                            const dotSize = isMainGeometric ? (1.7 + Math.random() * 0.7) : (1.4 + Math.random() * 0.5);

                            particles.push({
                                origX: x,
                                origY: y,
                                relX,
                                relY,
                                r,
                                g,
                                b,
                                a: alpha / 255,
                                size: dotSize,

                                // Section
                                isTopScript,
                                isBottomTagline,
                                isMainGeometric,

                                // Dispersal physics
                                splitGroup,
                                disperseAngle,
                                disperseDistance,
                                shearX,
                                shearY,
                                vortexSpeed,
                                vortexRadius,
                                distFromCenter,

                                // Arrival timing
                                arrivalDelay,
                            });
                        }
                    }
                }

                cachedParticles = particles;
                cachedTargetW = targetW;
                cachedTargetH = targetH;
                resolve({ particles, imgElement: img });
            } catch (err) {
                resolve(generateTextParticles(targetW, targetH, label));
            }
        };

        img.onerror = () => {
            resolve(generateTextParticles(targetW, targetH, label));
        };
    });
}

// Easing functions for natural particle motion
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

const ParticleLoader = ({
    isActive = true,
    isInitial = false,
    onComplete = () => { },
    pageLabel = 'KALAM 2026'
}) => {
    const { config } = useGlobalConfig() || {};
    const adminLogoUrl = config?.navbar_logo || null;
    const canvasRef = useRef(null);
    const animFrameRef = useRef(null);
    const startTimeRef = useRef(null);
    const isExitingRef = useRef(false);
    const [opacity, setOpacity] = useState(1);
    const [showOverlay, setShowOverlay] = useState(isActive);

    // Reduced motion accessibility
    const prefersReducedMotion = typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Timeline durations:
    // Initial entry: ~2.7s total (cinematic, dramatic dispersal & progressive emergence)
    // Route changes: ~1.75s total (snappy, energetic, doesn't delay page exploration)
    const timings = isInitial ? {
        disperse: 0.65,    // Outward split & scattering
        reassemble: 1.35,  // Reversal, inward flocking & progressive logo formation
        hold: 0.45,        // Fully assembled razor-sharp logo hold
        exit: 0.30,        // Smooth fade out into page
        total: 2.75,
    } : {
        disperse: 0.40,
        reassemble: 0.90,
        hold: 0.30,
        exit: 0.22,
        total: 1.82,
    };

    const handleComplete = useCallback(() => {
        if (!isExitingRef.current) {
            isExitingRef.current = true;
            document.body.style.overflow = '';
            setOpacity(0);
            setTimeout(() => {
                setShowOverlay(false);
                document.body.style.overflow = '';
                onComplete();
            }, timings.exit * 1000);
        }
    }, [onComplete, timings.exit]);

    // Safety timeout to prevent any infinite loading screen
    useEffect(() => {
        if (!isActive) return;
        setShowOverlay(true);
        setOpacity(1);
        isExitingRef.current = false;
        document.body.style.overflow = 'hidden';

        const safetyTimer = setTimeout(() => {
            handleComplete();
        }, (timings.total + 2.0) * 1000);

        return () => {
            clearTimeout(safetyTimer);
            document.body.style.overflow = '';
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
            }
        };
    }, [isActive, timings.total, handleComplete]);

    // Main Canvas Animation Loop
    useEffect(() => {
        if (!showOverlay || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            handleComplete();
            return;
        }

        let isRunning = true;
        startTimeRef.current = performance.now();

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Calculate exact responsive dimensions preserving 1080:394 aspect ratio
        let targetW = Math.min(680, Math.max(280, viewportWidth * 0.86));
        let targetH = targetW / LOGO_ASPECT_RATIO;
        if (targetH > viewportHeight * 0.42) {
            targetH = viewportHeight * 0.42;
            targetW = targetH * LOGO_ASPECT_RATIO;
        }
        targetW = Math.round(targetW);
        targetH = Math.round(targetH);

        // HiDPI Canvas setup for 4K / Retina sharpness
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = viewportWidth * dpr;
        canvas.height = viewportHeight * dpr;
        canvas.style.width = `${viewportWidth}px`;
        canvas.style.height = `${viewportHeight}px`;

        // If reduced motion is requested, show clean fade reveal
        if (prefersReducedMotion) {
            const timer = setTimeout(() => {
                handleComplete();
            }, 700);
            return () => clearTimeout(timer);
        }

        // Offscreen buffers for progressive logo mask emergence
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = targetW;
        maskCanvas.height = targetH;
        const maskCtx = maskCanvas.getContext('2d');

        const logoCanvas = document.createElement('canvas');
        logoCanvas.width = targetW;
        logoCanvas.height = targetH;
        const logoCtx = logoCanvas.getContext('2d');

        sampleLogoParticles(targetW, targetH, adminLogoUrl, pageLabel)
            .then(({ particles, imgElement }) => {
                if (!isRunning) return;

                const centerX = viewportWidth / 2;
                const centerY = viewportHeight / 2;

                const renderFrame = (now) => {
                    if (!isRunning) return;

                    const elapsed = (now - startTimeRef.current) / 1000;

                    ctx.save();
                    ctx.scale(dpr, dpr);

                    // Deep KALAM base background (#14050E)
                    ctx.fillStyle = '#14050E';
                    ctx.fillRect(0, 0, viewportWidth, viewportHeight);

                    // Ambient cosmic radial glow behind the logo - KALAM 6 colors
                    const ambientGlow = ctx.createRadialGradient(
                        centerX, centerY, 20,
                        centerX, centerY, targetW * 0.65
                    );
                    ambientGlow.addColorStop(0, 'rgba(214, 44, 118, 0.28)'); // Magenta #D62C76
                    ambientGlow.addColorStop(0.35, 'rgba(36, 188, 224, 0.20)'); // Cyan #24BCE0
                    ambientGlow.addColorStop(0.65, 'rgba(244, 119, 33, 0.14)'); // Orange #F47721
                    ambientGlow.addColorStop(1, 'rgba(20, 5, 14, 0)');
                    ctx.fillStyle = ambientGlow;
                    ctx.fillRect(0, 0, viewportWidth, viewportHeight);

                    const tDisp = timings.disperse;
                    const tReas = tDisp + timings.reassemble;
                    const tHold = tReas + timings.hold;
                    const tTotal = timings.total;

                    // Shockwave properties on final reassembly lock
                    let shockwaveProgress = 0;

                    // Prepare progressive mask canvas for image emergence
                    if (maskCtx) {
                        maskCtx.clearRect(0, 0, targetW, targetH);
                    }

                    // Loop through particles to calculate motion & update emergence mask
                    for (let i = 0; i < particles.length; i++) {
                        const p = particles[i];
                        const targetX = centerX + p.relX;
                        const targetY = centerY + p.relY;

                        let curX = targetX;
                        let curY = targetY;
                        let particleAlpha = p.a;
                        let arrivalRatio = 0; // 0 = in flight; 1 = fully settled in logo

                        if (elapsed < tDisp) {
                            // Phase 1: Splitting and Dispersal outward
                            const pProgress = Math.min(1, elapsed / tDisp);
                            const ease = easeInOutCubic(pProgress);

                            // Outward burst along shear + scatter angle
                            const burstX = p.shearX * ease + Math.cos(p.disperseAngle) * p.disperseDistance * ease;
                            const burstY = p.shearY * ease + Math.sin(p.disperseAngle) * p.disperseDistance * ease;

                            // Organic vortex twist
                            const vortex = Math.sin(pProgress * Math.PI) * p.vortexRadius * p.splitGroup;

                            curX = targetX + burstX - vortex * 0.3;
                            curY = targetY + burstY + vortex;
                            particleAlpha = p.a * (0.8 + 0.2 * Math.sin(pProgress * Math.PI));
                        } else if (elapsed < tReas) {
                            // Phase 2: Reverse motion & magnetic reassembly into exact logo coordinates
                            const reassembleTime = elapsed - tDisp;
                            const totalReassembleTime = timings.reassemble;
                            const rawProgress = reassembleTime / totalReassembleTime;

                            // Staggered arrival calculation per particle
                            const particleProgress = Math.min(1, Math.max(0, (rawProgress - p.arrivalDelay) / (1 - p.arrivalDelay * 0.7)));
                            const ease = easeOutQuart(particleProgress);

                            // Starting point at peak dispersal
                            const peakX = targetX + p.shearX + Math.cos(p.disperseAngle) * p.disperseDistance;
                            const peakY = targetY + p.shearY + Math.sin(p.disperseAngle) * p.disperseDistance;

                            curX = peakX + (targetX - peakX) * ease;
                            curY = peakY + (targetY - peakY) * ease;

                            // Arrival ratio determines how much this particle has merged into the real logo
                            arrivalRatio = particleProgress;
                            particleAlpha = p.a;

                            // Subtle shockwave trigger near end of reassembly
                            if (rawProgress > 0.85) {
                                shockwaveProgress = (rawProgress - 0.85) / 0.15;
                            }
                        } else {
                            // Phase 3 & 4: Fully assembled logo hold
                            curX = targetX;
                            curY = targetY;
                            particleAlpha = p.a;
                            arrivalRatio = 1.0;
                        }

                        // Progressive Revelation:
                        // As particles near their destination (arrivalRatio > 0.4),
                        // stamp a soft mask footprint onto maskCanvas.
                        // This allows the authentic high-resolution Logo.png to physically
                        // emerge from the uniting particles stroke by stroke and letter by letter!
                        if (maskCtx && arrivalRatio > 0.3) {
                            const stampAlpha = Math.min(1, (arrivalRatio - 0.3) / 0.6);
                            const stampRadius = 4.5 + (1 - arrivalRatio) * 6;

                            maskCtx.fillStyle = `rgba(255, 255, 255, ${stampAlpha})`;
                            maskCtx.beginPath();
                            maskCtx.arc(p.origX, p.origY, stampRadius, 0, Math.PI * 2);
                            maskCtx.fill();
                        }

                        // Draw flying particle if not yet fully merged into the logo
                        if (arrivalRatio < 0.95) {
                            const flyingAlpha = (1 - arrivalRatio * 0.85) * particleAlpha;
                            ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${flyingAlpha})`;
                            ctx.beginPath();
                            ctx.arc(curX, curY, p.size / 2, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }

                    // Composite and render the emerging authentic Logo.png
                    if (maskCtx && logoCtx && elapsed >= tDisp) {
                        logoCtx.clearRect(0, 0, targetW, targetH);

                        if (elapsed >= tReas) {
                            // When completely assembled, draw the clean unmasked original logo with crystal clarity
                            logoCtx.drawImage(imgElement, 0, 0, targetW, targetH);
                        } else {
                            // During reassembly, draw the original logo clipped by the progressive arrival mask
                            logoCtx.drawImage(imgElement, 0, 0, targetW, targetH);
                            logoCtx.globalCompositeOperation = 'destination-in';
                            logoCtx.drawImage(maskCanvas, 0, 0);
                            logoCtx.globalCompositeOperation = 'source-over';
                        }

                        // Render the emerging logo onto the main screen centered
                        const logoLeft = centerX - targetW / 2;
                        const logoTop = centerY - targetH / 2;
                        ctx.drawImage(logoCanvas, logoLeft, logoTop);
                    }

                    // Reassembly Impact Shockwave Ring
                    if (shockwaveProgress > 0) {
                        const swRadius = shockwaveProgress * (targetW * 0.6);
                        const swAlpha = (1 - shockwaveProgress) * 0.55;

                        ctx.save();
                        ctx.strokeStyle = `rgba(36, 188, 224, ${swAlpha})`; // KALAM Cyan #24BCE0
                        ctx.lineWidth = 2.2;
                        ctx.beginPath();
                        ctx.arc(centerX, centerY, swRadius, 0, Math.PI * 2);
                        ctx.stroke();

                        ctx.strokeStyle = `rgba(214, 44, 118, ${swAlpha * 0.75})`; // KALAM Magenta #D62C76
                        ctx.lineWidth = 1.4;
                        ctx.beginPath();
                        ctx.arc(centerX, centerY, Math.max(0, swRadius - 12), 0, Math.PI * 2);
                        ctx.stroke();
                        ctx.restore();
                    }

                    // Festival Typography Brand Label
                    const labelY = centerY + (targetH / 2) + 42;
                    ctx.textAlign = 'center';

                    ctx.font = '700 13px "Space Grotesk", sans-serif';
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
                    ctx.letterSpacing = '5px';
                    ctx.fillText('KALAM 2026', centerX, labelY);

                    ctx.font = '500 10px "Instrument Sans", sans-serif';
                    ctx.fillStyle = 'rgba(242, 209, 10, 0.95)'; // KALAM Yellow #F2D10A
                    ctx.letterSpacing = '2px';
                    ctx.fillText('INTER-COLLEGE SCIENCE FESTIVAL', centerX, labelY + 18);

                    ctx.restore();

                    // Loop or exit
                    if (elapsed >= tTotal) {
                        handleComplete();
                    } else {
                        animFrameRef.current = requestAnimationFrame(renderFrame);
                    }
                };

                animFrameRef.current = requestAnimationFrame(renderFrame);
            })
            .catch(() => {
                handleComplete();
            });

        return () => {
            isRunning = false;
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
            }
        };
    }, [showOverlay, prefersReducedMotion, timings, handleComplete]);

    if (!showOverlay) return null;

    return (
        <div
            id="kalam-global-particle-loader"
            role="status"
            aria-live="polite"
            aria-label="Loading KALAM 2026 Inter-College Science Fest"
            style={{
                opacity,
                transition: `opacity ${timings.exit}s cubic-bezier(0.16, 1, 0.3, 1)`,
            }}
            className="fixed inset-0 z-[999999] bg-[#14050E] flex items-center justify-center pointer-events-auto select-none overflow-hidden touch-none"
        >
            <canvas
                ref={canvasRef}
                className="w-full h-full block"
            />
        </div>
    );
};

export default ParticleLoader;
