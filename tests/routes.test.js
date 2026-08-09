// tests/routes.test.js
const request = require('supertest');
const app = require('../server');

describe('AlgoVisual Routes', () => {
  test('GET / should render the dashboard page successfully', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('AlgoVisual');
    expect(res.text).toContain('Sorting Systems');
    expect(res.text).toContain('Searching Systems');
  });

  test('GET /visualizer should load visualizer default (bubbleSort) successfully', async () => {
    const res = await request(app).get('/visualizer');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Algorithm Playground - AlgoVisual');
    // Verify it injects 'bubbleSort' by default
    expect(res.text).toContain("initPlayer('bubbleSort')");
  });

  test('GET /visualizer?algo=binarySearch should load visualizer with binarySearch successfully', async () => {
    const res = await request(app).get('/visualizer?algo=binarySearch');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Algorithm Playground - AlgoVisual');
    expect(res.text).toContain("initPlayer('binarySearch')");
  });

  test('GET /visualizer?algo=selectionSort should load visualizer with selectionSort successfully', async () => {
    const res = await request(app).get('/visualizer?algo=selectionSort');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Algorithm Playground - AlgoVisual');
    expect(res.text).toContain("initPlayer('selectionSort')");
  });

  test('GET /visualizer?algo=linearSearch should load visualizer with linearSearch successfully', async () => {
    const res = await request(app).get('/visualizer?algo=linearSearch');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Algorithm Playground - AlgoVisual');
    expect(res.text).toContain("initPlayer('linearSearch')");
  });

  test('GET /visualizer?algo=insertionSort should load visualizer with insertionSort successfully', async () => {
    const res = await request(app).get('/visualizer?algo=insertionSort');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Algorithm Playground - AlgoVisual');
    expect(res.text).toContain("initPlayer('insertionSort')");
  });

  test('GET /visualizer?algo=dijkstra should load visualizer with dijkstra successfully', async () => {
    const res = await request(app).get('/visualizer?algo=dijkstra');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Algorithm Playground - AlgoVisual');
    expect(res.text).toContain("initPlayer('dijkstra')");
  });

  test('GET /visualizer?algo=minMaxFinder should load visualizer with minMaxFinder successfully', async () => {
    const res = await request(app).get('/visualizer?algo=minMaxFinder');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Algorithm Playground - AlgoVisual');
    expect(res.text).toContain("initPlayer('minMaxFinder')");
  });

  test('GET /visualizer?algo=reverseArray should load visualizer with reverseArray successfully', async () => {
    const res = await request(app).get('/visualizer?algo=reverseArray');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Algorithm Playground - AlgoVisual');
    expect(res.text).toContain("initPlayer('reverseArray')");
  });

  test('GET /visualizer?algo=quickSort should load visualizer with quickSort successfully', async () => {
    const res = await request(app).get('/visualizer?algo=quickSort');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Algorithm Playground - AlgoVisual');
    expect(res.text).toContain("initPlayer('quickSort')");
  });

  test('GET /compare should load comparison board successfully', async () => {
    const res = await request(app).get('/compare');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Algorithm Comparison Board - AlgoVisual');
  });

  test('GET /compare?algoA=bubbleSort&algoB=quickSort should load comparison board with params', async () => {
    const res = await request(app).get(
      '/compare?algoA=bubbleSort&algoB=quickSort',
    );
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('bubbleSort');
    expect(res.text).toContain('quickSort');
  });

  test('GET /visualizer?algo=mergeSort should load visualizer with mergeSort successfully', async () => {
    const res = await request(app).get('/visualizer?algo=mergeSort');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Algorithm Playground - AlgoVisual');
    expect(res.text).toContain("initPlayer('mergeSort')");
  });

  test('GET /visualizer?algo=aStar should load visualizer with aStar successfully', async () => {
    const res = await request(app).get('/visualizer?algo=aStar');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Algorithm Playground - AlgoVisual');
    expect(res.text).toContain("initPlayer('aStar')");
  });

  test('GET /room/:roomId should load visualizer room successfully', async () => {
    const res = await request(app).get('/room/ABCDEF?algo=bubbleSort');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Algorithm Playground - AlgoVisual');
    expect(res.text).toContain('window.ROOM_ID = "ABCDEF"');
    expect(res.text).toContain("initPlayer('bubbleSort')");
  });

  test('GET /graph-editor should load the interactive graph editor page successfully', async () => {
    const res = await request(app).get('/graph-editor');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Graph Editor');
    expect(res.text).toContain('graph-editor-canvas');
  });

  test('GET /race should load the multi-agent algorithm race arena successfully', async () => {
    const res = await request(app).get('/race');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('4-Agent Race Room');
    expect(res.text).toContain('racePlayer.js');
  });
});
