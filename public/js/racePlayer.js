// public/js/racePlayer.js

let snapshotsList = [[], [], [], []];
let currentIndex = 0;
let maxSteps = 0;
let isPlaying = false;
let playbackInterval = null;
let speedDelay = 300; // default 300ms
let currentArray = [];
let modules = [null, null, null, null];

document.addEventListener('DOMContentLoaded', async () => {
  setupThemeToggle();
  
  // Initial dataset generation
  const sizeSelect = document.getElementById('select-dataset-size');
  const initialSize = sizeSelect ? parseInt(sizeSelect.value, 10) || 30 : 30;
  generateDataset(initialSize);
  
  // Load initial algorithms
  await loadAlgorithms();

  // Bind controls
  document.getElementById('btn-load-race').addEventListener('click', loadAlgorithms);
  document.getElementById('btn-randomize-dataset').addEventListener('click', () => {
    const sizeSelect = document.getElementById('select-dataset-size');
    const size = sizeSelect ? parseInt(sizeSelect.value, 10) || 30 : 30;
    generateDataset(size);
    resetPlayroom();
  });

  if (sizeSelect) {
    sizeSelect.addEventListener('change', () => {
      const size = parseInt(sizeSelect.value, 10) || 30;
      generateDataset(size);
      resetPlayroom();
    });
  }
  
  document.getElementById('btn-play').addEventListener('click', togglePlay);
  document.getElementById('btn-next').addEventListener('click', stepNext);
  document.getElementById('btn-prev').addEventListener('click', stepPrev);
  document.getElementById('btn-reset').addEventListener('click', resetPlayroom);
  
  const sliderSpeed = document.getElementById('slider-speed');
  if (sliderSpeed) {
    sliderSpeed.addEventListener('input', (e) => {
      speedDelay = parseInt(e.target.value, 10);
      document.getElementById('text-speed').textContent = `${speedDelay}ms`;
      if (isPlaying) {
        pauseAnimation();
        startAnimation();
      }
    });
  }
});

function setupThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const toggleIcon = document.getElementById('theme-toggle-icon');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light-theme');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      if (toggleIcon) toggleIcon.textContent = isLight ? '🌙' : '☀️';
    });
  }
}

function generateDataset(length) {
  // Generate random integers between 10 and 490
  currentArray = Array.from({ length }, () => Math.floor(Math.random() * 480) + 10);
}

async function loadAlgorithms() {
  pauseAnimation();
  
  const name1 = document.getElementById('select-algo-1').value;
  const name2 = document.getElementById('select-algo-2').value;
  const name3 = document.getElementById('select-algo-3').value;
  const name4 = document.getElementById('select-algo-4').value;

  try {
    const [mod1, mod2, mod3, mod4] = await Promise.all([
      import(`/algorithms/${name1}.js`),
      import(`/algorithms/${name2}.js`),
      import(`/algorithms/${name3}.js`),
      import(`/algorithms/${name4}.js`)
    ]);

    modules[0] = mod1.algorithm;
    modules[1] = mod2.algorithm;
    modules[2] = mod3.algorithm;
    modules[3] = mod4.algorithm;

    for (let k = 0; k < 4; k++) {
      document.getElementById(`title-viewport-${k+1}`).textContent = `Engine ${k+1}: ${modules[k].name}`;
      document.getElementById(`legend-name-${k+1}`).textContent = modules[k].name;
    }

    resetPlayroom();
  } catch (err) {
    console.error('Failed to load race algorithms:', err);
  }
}

function resetPlayroom() {
  pauseAnimation();
  if (!modules.some(m => !m)) {
    for (let k = 0; k < 4; k++) {
      snapshotsList[k] = modules[k].generator([...currentArray]);
    }
    
    maxSteps = Math.max(
      snapshotsList[0].length,
      snapshotsList[1].length,
      snapshotsList[2].length,
      snapshotsList[3].length
    );

    currentIndex = 0;
    renderStep(0);
  }
}

function renderStep(index) {
  // Determine overall operations scale
  let maxOps = 100;
  for (let k = 0; k < 4; k++) {
    const snaps = snapshotsList[k];
    if (snaps && snaps.length > 0) {
      const finalSnap = snaps[snaps.length - 1];
      const finalOps = (finalSnap?.stats?.comparisons || 0) + (finalSnap?.stats?.swaps || 0);
      if (finalOps > maxOps) maxOps = finalOps;
    }
  }

  // Update Y-axis label scale
  const maxLabel = document.getElementById('chart-label-max');
  if (maxLabel) maxLabel.textContent = maxOps;

  for (let k = 0; k < 4; k++) {
    const snaps = snapshotsList[k];
    const isCompleted = index >= snaps.length - 1;
    const snap = snaps[Math.min(index, snaps.length - 1)];

    // Render Bars
    renderBars(`container-bars-${k+1}`, snap, isCompleted);

    // Update Stats counters
    document.getElementById(`stat-comp-${k+1}`).textContent = snap?.stats?.comparisons || 0;
    document.getElementById(`stat-swap-${k+1}`).textContent = snap?.stats?.swaps || 0;
    document.getElementById(`stat-step-${k+1}`).textContent = Math.min(index + 1, snaps.length);

    // Update Status Badge
    const badge = document.getElementById(`badge-status-${k+1}`);
    if (badge) {
      if (isCompleted) {
        badge.textContent = 'FINISHED';
        badge.className = 'text-[8px] font-technical bg-emerald-950/80 border border-emerald-800 text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase';
      } else {
        badge.textContent = 'RUNNING';
        badge.className = 'text-[8px] font-technical bg-cyan-950/80 border border-cyan-800 text-cyan-400 px-1.5 py-0.5 rounded font-bold uppercase';
      }
    }

    // Draw Chart path up to the current index
    const points = [];
    for (let i = 0; i <= index; i++) {
      const chartSnap = snaps[Math.min(i, snaps.length - 1)];
      const ops = (chartSnap?.stats?.comparisons || 0) + (chartSnap?.stats?.swaps || 0);
      const x = 50 + (i / (maxSteps - 1 || 1)) * 730;
      const y = 180 - (ops / (maxOps || 1)) * 160;
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    const pathData = points.length > 0 ? 'M ' + points.join(' L ') : '';
    document.getElementById(`chart-line-${k+1}`).setAttribute('d', pathData);
  }

  document.getElementById('step-counter').textContent = `Step ${index + 1} / ${maxSteps}`;
}

function renderBars(containerId, snapshot, isEngineFinished) {
  const container = document.getElementById(containerId);
  if (!container || !snapshot || !snapshot.array) return;

  const arr = snapshot.array;
  const maxVal = Math.max(...arr, 1);
  const highlights = snapshot.highlights || [];
  let html = '';

  for (let idx = 0; idx < arr.length; idx++) {
    const val = arr[idx];
    const pct = Math.max(2, Math.round((val / maxVal) * 100));
    let barClass = 'race-bar';
    if (isEngineFinished) {
      barClass += ' completed';
    } else if (highlights.includes(idx)) {
      barClass += ' highlight';
    }
    html += `<div class="${barClass}" style="height:${pct}%"></div>`;
  }
  container.innerHTML = html;
}

function togglePlay() {
  if (isPlaying) {
    pauseAnimation();
  } else {
    startAnimation();
  }
}

function startAnimation() {
  if (isPlaying) return;
  isPlaying = true;
  document.getElementById('btn-play').innerHTML = '<span>⏸</span> Pause';

  playbackInterval = setInterval(() => {
    if (currentIndex < maxSteps - 1) {
      currentIndex++;
      renderStep(currentIndex);
    } else {
      pauseAnimation();
    }
  }, speedDelay);
}

function pauseAnimation() {
  if (!isPlaying) return;
  isPlaying = false;
  document.getElementById('btn-play').innerHTML = '<span>▶</span> Start Race';
  if (playbackInterval) {
    clearInterval(playbackInterval);
    playbackInterval = null;
  }
}

function stepNext() {
  pauseAnimation();
  if (currentIndex < maxSteps - 1) {
    currentIndex++;
    renderStep(currentIndex);
  }
}

function stepPrev() {
  pauseAnimation();
  if (currentIndex > 0) {
    currentIndex--;
    renderStep(currentIndex);
  }
}
