import "./js/ui.js";

const ctx = document.getElementById("main-graph");
const totalDuration = 2000;

const animation = {
  x: {
    type: 'number',
    easing: 'linear',
    duration: (ctx) => totalDuration / ctx.chart.data.labels.length,
    from: NaN,
    delay: (ctx) => ctx.index * (totalDuration / ctx.chart.data.labels.length),
  },
  y: {
    type: 'number',
    easing: 'linear',
    duration: (ctx) => totalDuration / ctx.chart.data.labels.length,
    from: (ctx) => {
    if (ctx.index === 0) return ctx.chart.scales.y.getPixelForValue(0)
    const prev = ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1]
    if (!prev) return ctx.chart.scales.y.getPixelForValue(0)
    return prev.getProps(['y'], true).y
    },
    delay: (ctx) => ctx.index * (totalDuration / ctx.chart.data.labels.length),
  }
}