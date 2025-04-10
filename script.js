
const arrayContainer = document.getElementById('array-container');
const generateBtn = document.getElementById('generate-btn');
const sortBtn = document.getElementById('sort-btn');
const pauseBtn = document.getElementById('pause-btn');
const stopBtn = document.getElementById('stop-btn');
const arraySizeSlider = document.getElementById('array-size');
const speedSlider = document.getElementById('speed');
const algorithmSelect = document.getElementById('algorithm');
const sizeValue = document.getElementById('size-value');
const speedValue = document.getElementById('speed-value');
const comparisonsDisplay = document.getElementById('comparisons');
const swapsDisplay = document.getElementById('swaps');
const timeDisplay = document.getElementById('time');
const algorithmInfo = document.getElementById('algorithm-info');
const themeSwitch = document.getElementById('theme-switch');

let array = [];
let arraySize = parseInt(arraySizeSlider.value);
let speed = parseInt(speedSlider.value);
let isSorting = false;
let isPaused = false;
let sortingAlgorithm = algorithmSelect.value;
let animationSpeed = 1000 / speed;
let comparisons = 0;
let swaps = 0;
let startTime = 0;
let sortingPromise = null;
let shouldStop = false;

const algorithmDetails = {
    bubble: {
        name: "Bubble Sort",
        description: "Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
        complexity: {
            time: {
                best: "O(n)",
                average: "O(n²)",
                worst: "O(n²)"
            },
            space: "O(1)"
        }
    },
    selection: {
        name: "Selection Sort",
        description: "Selection Sort divides the input list into two parts: a sorted sublist and a sublist of remaining unsorted items.",
        complexity: {
            time: {
                best: "O(n²)",
                average: "O(n²)",
                worst: "O(n²)"
            },
            space: "O(1)"
        }
    },
    insertion: {
        name: "Insertion Sort",
        description: "Insertion Sort builds the final sorted array one item at a time. Efficient for small data sets or nearly sorted data.",
        complexity: {
            time: {
                best: "O(n)",
                average: "O(n²)",
                worst: "O(n²)"
            },
            space: "O(1)"
        }
    },
    merge: {
        name: "Merge Sort",
        description: "Merge Sort is a divide-and-conquer algorithm that divides the input array into two halves and then merges the two sorted halves.",
        complexity: {
            time: {
                best: "O(n log n)",
                average: "O(n log n)",
                worst: "O(n log n)"
            },
            space: "O(n)"
        }
    },
    quick: {
        name: "Quick Sort",
        description: "Quick Sort picks an element as pivot and partitions the array around the pivot. Generally faster than Merge Sort for small data sets.",
        complexity: {
            time: {
                best: "O(n log n)",
                average: "O(n log n)",
                worst: "O(n²)"
            },
            space: "O(log n)"
        }
    }
};

function init() {
    updateAlgorithmInfo();
    generateNewArray();
    setupEventListeners();
    checkThemePreference();
}


function generateNewArray() {
    if (isSorting && !shouldStop) return;
    
    resetState();
    
    array = [];
    for (let i = 0; i < arraySize; i++) {
        array.push(Math.floor(Math.random() * 100) + 5);
    }
    
    renderArray();
}

function renderArray() {
    arrayContainer.innerHTML = '';
    const maxValue = Math.max(...array);
    const containerHeight = arrayContainer.clientHeight;
    
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'array-bar';
        bar.style.height = `${(value / maxValue) * containerHeight}px`;
        bar.setAttribute('data-value', value);
        arrayContainer.appendChild(bar);
    });
}

function updateAlgorithmInfo() {
    const algo = algorithmDetails[sortingAlgorithm];
    
    let html = `
        <h3>${algo.name}</h3>
        <p>${algo.description}</p>
        <h4>Time Complexity:</h4>
        <ul>
            <li>Best Case: ${algo.complexity.time.best}</li>
            <li>Average Case: ${algo.complexity.time.average}</li>
            <li>Worst Case: ${algo.complexity.time.worst}</li>
        </ul>
        <h4>Space Complexity: ${algo.complexity.space}</h4>
    `;
    
    algorithmInfo.innerHTML = html;
}


function setupEventListeners() {
    generateBtn.addEventListener('click', generateNewArray);
    sortBtn.addEventListener('click', startSorting);
    pauseBtn.addEventListener('click', togglePause);
    stopBtn.addEventListener('click', stopSorting);
    
    arraySizeSlider.addEventListener('input', () => {
        arraySize = parseInt(arraySizeSlider.value);
        sizeValue.textContent = arraySize;
        generateNewArray();
    });
    
    speedSlider.addEventListener('input', () => {
        speed = parseInt(speedSlider.value);
        speedValue.textContent = speed;
        animationSpeed = 1000 / speed;
    });
    
    algorithmSelect.addEventListener('change', () => {
        sortingAlgorithm = algorithmSelect.value;
        updateAlgorithmInfo();
    });
    
    themeSwitch.addEventListener('change', toggleTheme);
}

function startSorting() {
    if (isSorting) return;
    
    resetState();
    isSorting = true;
    shouldStop = false;
    startTime = performance.now();
    
    toggleButtons(true);

    switch (sortingAlgorithm) {
        case 'bubble':
            sortingPromise = bubbleSort([...array]);
            break;
        case 'selection':
            sortingPromise = selectionSort([...array]);
            break;
        case 'insertion':
            sortingPromise = insertionSort([...array]);
            break;
        case 'merge':
            sortingPromise = mergeSort([...array]);
            break;
        case 'quick':
            sortingPromise = quickSort([...array]);
            break;
    }
    
    sortingPromise.then(() => {
        if (!shouldStop) {
            completeSorting();
        }
    });
}


function togglePause() {
    if (!isSorting) return;
    
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
    
    if (!isPaused) {

        startSorting();
    }
}

function stopSorting() {
    if (!isSorting) return;
    
    shouldStop = true;
    isSorting = false;
    isPaused = false;
    

    toggleButtons(false);
    pauseBtn.textContent = 'Pause';

    const bars = document.querySelectorAll('.array-bar');
    bars.forEach(bar => {
        bar.classList.remove('sorted', 'comparing', 'pivot');
    });
}

function resetState() {
    comparisons = 0;
    swaps = 0;
    comparisonsDisplay.textContent = "0";
    swapsDisplay.textContent = "0";
    timeDisplay.textContent = "0 ms";
}


function toggleButtons(sorting) {
    generateBtn.disabled = sorting;
    sortBtn.disabled = sorting;
    pauseBtn.disabled = !sorting;
    stopBtn.disabled = !sorting;
    arraySizeSlider.disabled = sorting;
    algorithmSelect.disabled = sorting;
}


function highlightBars(index1, index2) {
    const bars = document.querySelectorAll('.array-bar');

    bars.forEach(bar => {
        bar.classList.remove('comparing');
    });

    if (index1 >= 0 && index1 < bars.length) {
        bars[index1].classList.add('comparing');
    }
    if (index2 >= 0 && index2 < bars.length) {
        bars[index2].classList.add('comparing');
    }
}

function markSorted(index) {
    const bars = document.querySelectorAll('.array-bar');
    if (index >= 0 && index < bars.length) {
        bars[index].classList.add('sorted');
    }
}

function markPivot(index) {
    const bars = document.querySelectorAll('.array-bar');

    bars.forEach(bar => {
        bar.classList.remove('pivot');
    });

    if (index >= 0 && index < bars.length) {
        bars[index].classList.add('pivot');
    }
}

async function updateArray(newArray, highlights = [], sortedIndices = [], pivotIndex = -1) {
    if (shouldStop) throw new Error("Sorting stopped");
    
    while (isPaused && !shouldStop) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return new Promise(resolve => {
        setTimeout(() => {
            if (shouldStop) return;
            
            array = [...newArray];
            renderArray();

            if (highlights.length > 0) {
                highlightBars(highlights[0], highlights[1]);
            }

            sortedIndices.forEach(index => {
                markSorted(index);
            });

            if (pivotIndex !== -1) {
                markPivot(pivotIndex);
            }
            
            resolve();
        }, animationSpeed);
    });
}

function updateStats(newComparisons, newSwaps) {
    comparisons += newComparisons;
    swaps += newSwaps;
    
    comparisonsDisplay.textContent = comparisons;
    swapsDisplay.textContent = swaps;
    
    const currentTime = performance.now();
    const elapsedTime = currentTime - startTime;
    timeDisplay.textContent = `${elapsedTime.toFixed(2)} ms`;
}

function completeSorting() {
    isSorting = false;
    isPaused = false;
    toggleButtons(false);

    const bars = document.querySelectorAll('.array-bar');
    bars.forEach(bar => {
        bar.classList.add('sorted');
        bar.classList.remove('comparing', 'pivot');
    });
}

function toggleTheme() {
    const isDark = themeSwitch.checked;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function checkThemePreference() {
    const savedTheme = localStorage.getItem('theme') || 
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (savedTheme === 'dark') {
        themeSwitch.checked = true;
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        themeSwitch.checked = false;
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

async function bubbleSort(arr) {
    let n = arr.length;
    let newSwaps = 0;
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (shouldStop) return;
            
            await updateArray(arr, [j, j + 1], [], -1);
            updateStats(1, 0);
            
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                newSwaps++;
                await updateArray(arr, [j, j + 1], [], -1);
                updateStats(0, 1);
            }
        }
        markSorted(n - i - 1);
    }
    markSorted(0);
}

async function selectionSort(arr) {
    let n = arr.length;
    let newSwaps = 0;
    
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        
        for (let j = i + 1; j < n; j++) {
            if (shouldStop) return;
            
            await updateArray(arr, [minIndex, j], [], -1);
            updateStats(1, 0);
            
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            newSwaps++;
            await updateArray(arr, [i, minIndex], [], -1);
            updateStats(0, 1);
        }
        
        markSorted(i);
    }
    markSorted(n - 1);
}

async function insertionSort(arr) {
    let n = arr.length;
    let newSwaps = 0;
    
    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        
        await updateArray(arr, [j, i], [], -1);
        updateStats(1, 0);
        
        while (j >= 0 && arr[j] > key) {
            if (shouldStop) return;
            
            arr[j + 1] = arr[j];
            newSwaps++;
            await updateArray(arr, [j, j + 1], [], -1);
            updateStats(1, 1);
            j--;
        }
        
        arr[j + 1] = key;
        await updateArray(arr, [], [], -1);
    }
    
    for (let i = 0; i < n; i++) {
        markSorted(i);
        await new Promise(resolve => setTimeout(resolve, animationSpeed / 2));
    }
}

async function mergeSort(arr, startIdx = 0, sortedIndices = []) {
    if (arr.length <= 1 || shouldStop) {
        return arr;
    }
    
    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);
    
    const leftSortedIndices = sortedIndices.filter(i => i < middle);
    const rightSortedIndices = sortedIndices.filter(i => i >= middle).map(i => i - middle);
    
    const sortedLeft = await mergeSort(left, startIdx, leftSortedIndices);
    if (shouldStop) return [];
    
    const sortedRight = await mergeSort(right, startIdx + middle, rightSortedIndices);
    if (shouldStop) return [];
    
    return await merge(sortedLeft, sortedRight, startIdx);
}

async function merge(left, right, startIdx) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;
    let newSwaps = 0;
    
    while (leftIndex < left.length && rightIndex < right.length && !shouldStop) {
        const leftPos = startIdx + leftIndex;
        const rightPos = startIdx + left.length + rightIndex;
        await updateArray([...left, ...right], [leftPos, rightPos], [], -1);
        updateStats(1, 0);
        
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
            newSwaps++;
            updateStats(0, 1);
        }
    }
    
    const merged = result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
    await updateArray(merged, [], [], -1);
    
    return merged;
}

async function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high && !shouldStop) {
        const pivotIndex = await partition(arr, low, high);
        markSorted(pivotIndex);
        
        await quickSort(arr, low, pivotIndex - 1);
        await quickSort(arr, pivotIndex + 1, high);
    }
    
    if (low === 0 && high === arr.length - 1 && !shouldStop) {
        for (let i = 0; i < arr.length; i++) {
            markSorted(i);
            await new Promise(resolve => setTimeout(resolve, animationSpeed / 2));
        }
    }
    
    return arr;
}

async function partition(arr, low, high) {
    const pivotValue = arr[high];
    let pivotIndex = low;
    let newSwaps = 0;
    
    await updateArray(arr, [], [], high);
    
    for (let i = low; i < high && !shouldStop; i++) {
        await updateArray(arr, [i, high], [], high);
        updateStats(1, 0);
        
        if (arr[i] < pivotValue) {
            [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
            newSwaps++;
            await updateArray(arr, [i, pivotIndex], [], high);
            updateStats(0, 1);
            pivotIndex++;
        }
    }
    
    [arr[pivotIndex], arr[high]] = [arr[high], arr[pivotIndex]];
    newSwaps++;
    await updateArray(arr, [pivotIndex, high], [], high);
    updateStats(0, 1);
    
    return pivotIndex;
}

document.addEventListener('DOMContentLoaded', init);