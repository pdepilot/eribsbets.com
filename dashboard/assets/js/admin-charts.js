/**
 * ERIBSBETS Admin — Chart.js configurations (frontend demo data)
 */
(function () {
  "use strict";

  var chartDefaults = {
    color: "#8ba8c8",
    borderColor: "rgba(56, 88, 130, 0.35)",
    font: { family: "'Space Grotesk', sans-serif", size: 11 },
  };

  function gradient(ctx, c1, c2) {
    var g = ctx.createLinearGradient(0, 0, 0, 280);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    return g;
  }

  function initRevenueChart() {
    var canvas = document.getElementById("chart-revenue");
    if (!canvas || typeof Chart === "undefined") return;
    var ctx = canvas.getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Revenue (₦M)",
            data: [12.4, 14.1, 13.2, 16.8, 18.2, 22.5, 20.1],
            borderColor: "#00e676",
            backgroundColor: gradient(ctx, "rgba(0,230,118,0.25)", "rgba(0,230,118,0)"),
            fill: true,
            tension: 0.42,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: {
            grid: { color: "rgba(56,88,130,0.2)" },
            ticks: { callback: function (v) { return "₦" + v + "M"; } },
          },
        },
        animation: { duration: 1200, easing: "easeOutQuart" },
      },
    });
  }

  function initUsersChart() {
    var canvas = document.getElementById("chart-users");
    if (!canvas || typeof Chart === "undefined") return;
    new Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: ["00", "04", "08", "12", "16", "20"],
        datasets: [
          {
            label: "Active",
            data: [420, 280, 890, 1240, 1580, 1120],
            backgroundColor: "rgba(61, 139, 255, 0.65)",
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: "rgba(56,88,130,0.2)" } },
        },
        animation: { duration: 1000 },
      },
    });
  }

  function initBettingChart() {
    var canvas = document.getElementById("chart-betting");
    if (!canvas || typeof Chart === "undefined") return;
    new Chart(canvas.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: ["Sports", "Live", "Casino", "Virtuals"],
        datasets: [
          {
            data: [42, 28, 18, 12],
            backgroundColor: ["#00e676", "#3d8bff", "#a78bfa", "#ffab00"],
            borderWidth: 0,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
          legend: {
            position: "bottom",
            labels: { boxWidth: 10, padding: 14 },
          },
        },
        animation: { animateRotate: true, duration: 1100 },
      },
    });
  }

  function initWalletChart() {
    var canvas = document.getElementById("chart-wallet");
    if (!canvas || typeof Chart === "undefined") return;
    var ctx = canvas.getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
        datasets: [
          {
            label: "Deposits",
            data: [8, 12, 9, 14, 11, 16],
            borderColor: "#3d8bff",
            tension: 0.35,
            borderWidth: 2,
          },
          {
            label: "Withdrawals",
            data: [5, 7, 6, 9, 8, 10],
            borderColor: "#ff4d6a",
            tension: 0.35,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "top" } },
        scales: {
          y: { grid: { color: "rgba(56,88,130,0.2)" } },
          x: { grid: { display: false } },
        },
      },
    });
  }

  function initPerformanceChart() {
    var canvas = document.getElementById("chart-performance");
    if (!canvas || typeof Chart === "undefined") return;
    new Chart(canvas.getContext("2d"), {
      type: "radar",
      data: {
        labels: ["Uptime", "Latency", "API", "Odds feed", "Payments", "KYC"],
        datasets: [
          {
            label: "Score",
            data: [98, 92, 88, 95, 90, 85],
            borderColor: "#00e676",
            backgroundColor: "rgba(0,230,118,0.15)",
            pointBackgroundColor: "#00e676",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: "rgba(56,88,130,0.3)" },
            grid: { color: "rgba(56,88,130,0.3)" },
            pointLabels: { color: "#8ba8c8" },
            suggestedMin: 0,
            suggestedMax: 100,
          },
        },
        plugins: { legend: { display: false } },
      },
    });
  }

  function initAnalyticsCharts() {
    initRevenueChart();
    var canvas2 = document.getElementById("chart-analytics-secondary");
    if (!canvas2 || typeof Chart === "undefined") return;
    new Chart(canvas2.getContext("2d"), {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "GGR",
            data: [42, 48, 51, 55, 58, 62],
            backgroundColor: "rgba(0, 230, 118, 0.5)",
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: "rgba(56,88,130,0.2)" } },
        },
      },
    });
  }

  function boot() {
    if (typeof Chart !== "undefined") {
      Chart.defaults.color = chartDefaults.color;
      Chart.defaults.borderColor = chartDefaults.borderColor;
      Chart.defaults.font = chartDefaults.font;
    }
    initRevenueChart();
    initUsersChart();
    initBettingChart();
    initWalletChart();
    initPerformanceChart();
    initAnalyticsCharts();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
