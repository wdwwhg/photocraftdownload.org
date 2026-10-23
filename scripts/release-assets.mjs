export function parseChecksums(text) {
  const checksums = new Map();
  for (const line of text.split(/\r?\n/).filter(Boolean)) {
    const match = line.match(/^([a-fA-F0-9]{64})\s+\*?([a-zA-Z0-9._-]+)$/);
    if (!match || checksums.has(match[2]))
      throw new Error('Invalid or duplicate checksum entry.');
    checksums.set(match[2], match[1].toLowerCase());
  }
  return checksums;
}

export function assetChecksum(asset, checksums) {
  const sha256 = checksums.get(asset.name);
  if (!sha256) throw new Error(`Missing SHA256: ${asset.name}`);
  if (asset.digest && asset.digest !== `sha256:${sha256}`)
    throw new Error(`SHA256 mismatch: ${asset.name}`);
  return sha256;
}
