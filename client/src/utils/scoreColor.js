const TAG_RGB = {
  safe: [34, 197, 94],
  unsafe: [239, 68, 68],
  lively: [168, 85, 247],
  calm: [59, 130, 246],
  crowded: [249, 115, 22],
  deserted: [107, 114, 128],
};

const DEFAULT_RGB = TAG_RGB.deserted;

export const getScoreColor = (dominantTag, score) => {
  const rgb = TAG_RGB[dominantTag] || DEFAULT_RGB;
  const clampedScore = Math.max(0.5, Math.min(1, score));
  const opacityPercent = 30 + ((clampedScore - 0.5) / 0.5) * 40;
  const alpha = Math.round((opacityPercent / 100) * 255);
  return [...rgb, alpha];
};

export const getScoreOpacity = (score) => {
  const clampedScore = Math.max(0.5, Math.min(1, score));
  return 0.3 + ((clampedScore - 0.5) / 0.5) * 0.4;
};
