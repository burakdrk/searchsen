import { area, curveBasis } from "d3-shape";
import { scaleLinear } from "d3-scale";
import type { Logs } from "~types";

const calculateOptimalBinCount = (width: number) => {
  // Target 1 bin per ~3px
  const suggestedBins = Math.floor(width / 3);
  return Math.max(100, Math.min(1000, suggestedBins));
};

type HeatmapOptions = {
  fillColor?: string;
  strokeColor?: string;
  height?: number;
  binCount?: number;
};

export function drawHeatmap(
  results: Logs[],
  videoDuration: number,
  options: HeatmapOptions = {}
) {
  document.getElementById("searchsen-heatmap")?.remove();

  if (!results.length || videoDuration <= 0) return;

  const searchBar: HTMLElement | null = document.querySelector(".seekbar-bar");
  if (!searchBar) return;

  // Default options
  const {
    fillColor = "#6600ff",
    strokeColor = "#a970ff",
    height = 40,
    binCount = calculateOptimalBinCount(searchBar.offsetWidth)
  } = options;

  const filteredTimestamps = results.map((log) => log.s);
  const width = searchBar.offsetWidth;

  const bins: Array<number> = new Array(binCount).fill(0);

  filteredTimestamps.forEach((timestamp) => {
    const clampedTime = Math.max(0, Math.min(timestamp, videoDuration - 0.001));
    const binIndex = Math.floor((clampedTime / videoDuration) * binCount);
    bins[binIndex]++;
  });

  const maxCount = Math.max(...bins);
  const normalizedBins = bins.map((count) =>
    maxCount > 0 ? count / maxCount : 0
  );

  const xScale = scaleLinear()
    .domain([0, binCount - 1])
    .range([0, width]);

  const yScale = scaleLinear().domain([0, 1]).range([height, 0]);

  const areaGenerator = area<number>()
    .x((_, i) => xScale(i))
    .y0(height) // Add baseline at bottom
    .y1((d) => yScale(d)) // Rename y to y1 for top line
    .curve(curveBasis);

  const pathData = areaGenerator(normalizedBins) || "";

  const element = document.createElement("div");

  element.style.position = "absolute";
  element.style.top = "-2px";
  element.style.paddingInline = "16px";
  element.id = "searchsen-heatmap";

  element.innerHTML = `
    <svg width="${width}" height=${height} viewBox="0 0 ${width} ${height}">
      <path
        d="${pathData}"
        fill="${fillColor}"
        stroke="${strokeColor}"
        stroke-width="2"
      />
    </svg>
  `;

  document.querySelector(".player-controls")?.prepend(element);
}
