/**
 * YIN pitch detection algorithm.
 *
 * Reference: de Cheveigné, A. & Kawahara, H. (2002).
 * "YIN, a fundamental frequency estimator for speech and music."
 * Journal of the Acoustical Society of America, 111(4), 1917–1930.
 */

const DEFAULT_THRESHOLD = 0.15;
const MIN_FREQ_HZ = 60;   // Below low B on a 7-string guitar
const MAX_FREQ_HZ = 1300; // Above high notes on violin

/**
 * Detects the fundamental frequency (pitch) in a PCM audio buffer.
 *
 * @param buffer     Float32Array of PCM samples in range [-1.0, 1.0]
 * @param sampleRate Sample rate in Hz (typically 44100)
 * @param threshold  YIN threshold. Lower = stricter detection. Default 0.15.
 * @returns          Fundamental frequency in Hz, or -1 if no pitch detected.
 */
export function detectPitch(
  buffer: Float32Array,
  sampleRate: number,
  threshold: number = DEFAULT_THRESHOLD,
): number {
  const bufferSize = buffer.length;
  const halfSize = Math.floor(bufferSize / 2);

  if (halfSize < 2) return -1;

  const yinBuffer = new Float32Array(halfSize);

  // Step 1 & 2 combined: Difference function + Cumulative Mean Normalized
  // Difference Function (CMNDF).
  yinBuffer[0] = 1;
  let runningSum = 0;

  for (let tau = 1; tau < halfSize; tau++) {
    let delta = 0;
    for (let j = 0; j < halfSize; j++) {
      const diff = buffer[j] - buffer[j + tau];
      delta += diff * diff;
    }
    runningSum += delta;
    yinBuffer[tau] = runningSum === 0 ? 0 : (delta * tau) / runningSum;
  }

  // Step 3: Find the first tau below threshold, then slide to local minimum.
  const tauMin = Math.ceil(sampleRate / MAX_FREQ_HZ);
  const tauMax = Math.min(Math.floor(sampleRate / MIN_FREQ_HZ), halfSize - 2);

  let minTau = -1;

  for (let tau = tauMin; tau <= tauMax; tau++) {
    if (yinBuffer[tau] < threshold) {
      // Slide forward to the local minimum within this dip
      while (tau + 1 <= tauMax && yinBuffer[tau + 1] < yinBuffer[tau]) {
        tau++;
      }
      minTau = tau;
      break;
    }
  }

  if (minTau === -1) return -1;

  // Step 4: Parabolic interpolation for sub-sample precision.
  const refinedTau = parabolicInterpolation(yinBuffer, minTau, halfSize);

  return sampleRate / refinedTau;
}

/**
 * Refines a period estimate using parabolic interpolation around a minimum.
 */
function parabolicInterpolation(
  yinBuffer: Float32Array,
  tau: number,
  size: number,
): number {
  const x0 = tau > 0 ? tau - 1 : tau;
  const x2 = tau + 1 < size ? tau + 1 : tau;

  if (x0 === tau) return yinBuffer[tau] <= yinBuffer[x2] ? tau : x2;
  if (x2 === tau) return yinBuffer[tau] <= yinBuffer[x0] ? tau : x0;

  const s0 = yinBuffer[x0];
  const s1 = yinBuffer[tau];
  const s2 = yinBuffer[x2];

  const denom = 2 * (2 * s1 - s2 - s0);
  if (denom === 0) return tau;

  return tau + (s2 - s0) / denom;
}
