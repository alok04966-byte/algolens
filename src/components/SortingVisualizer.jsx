import { useCallback, useEffect, useState } from 'react'

const DEFAULT_MIN_VALUE = 20
const DEFAULT_MAX_VALUE = 300
const DEFAULT_ARRAY_SIZE = 25

const createRandomArray = (size, minValue, maxValue) =>
  Array.from({ length: size }, () =>
    Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue,
  )

function SortingVisualizer() {
  const [arraySize, setArraySize] = useState(DEFAULT_ARRAY_SIZE)
  const [minValue, setMinValue] = useState(DEFAULT_MIN_VALUE)
  const [maxValue, setMaxValue] = useState(DEFAULT_MAX_VALUE)
  const [tempArraySize, setTempArraySize] = useState(DEFAULT_ARRAY_SIZE)
  const [tempMinValue, setTempMinValue] = useState(DEFAULT_MIN_VALUE)
  const [tempMaxValue, setTempMaxValue] = useState(DEFAULT_MAX_VALUE)
  const [array, setArray] = useState(() =>
    createRandomArray(DEFAULT_ARRAY_SIZE, DEFAULT_MIN_VALUE, DEFAULT_MAX_VALUE),
  )
  const [initialArray, setInitialArray] = useState(() =>
    createRandomArray(DEFAULT_ARRAY_SIZE, DEFAULT_MIN_VALUE, DEFAULT_MAX_VALUE),
  )
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [explanation, setExplanation] = useState('Press Start Sorting to begin step-by-step.')
  const [speed] = useState(100)
  const [activeIndices, setActiveIndices] = useState([])
  const [sortedIndices, setSortedIndices] = useState([])
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble')
  const selectedAlgorithmLabel =
    selectedAlgorithm === 'bubble' ? 'Bubble Sort' : 'Selection Sort (Coming Soon)'
  const isExecutionLocked = isPlaying || steps.length > 0

  const getValidatedTempSettings = () => {
    const safeSize = Math.max(5, Math.min(100, Number(tempArraySize) || DEFAULT_ARRAY_SIZE))
    const safeMin = Number(tempMinValue)
    const safeMax = Number(tempMaxValue)

    if (!Number.isFinite(safeMin) || !Number.isFinite(safeMax) || safeMin >= safeMax) {
      alert('Min Value must be smaller than Max Value.')
      return null
    }

    return {
      size: safeSize,
      min: safeMin,
      max: safeMax,
    }
  }

  const handleGenerateNewArray = () => {
    if (isExecutionLocked) return

    if (minValue >= maxValue) return
    if (arraySize <= 0) return
    const nextArray = createRandomArray(arraySize, minValue, maxValue)
    setArray(nextArray)
    setInitialArray([...nextArray])
    setActiveIndices([])
    setSortedIndices([])
    setSteps([])
    setCurrentStep(0)
    setIsPlaying(false)
    setIsPaused(false)
    setExplanation('Press Start Sorting to begin step-by-step.')
  }

  const handleApplySettings = () => {
    if (isExecutionLocked) return
    const settings = getValidatedTempSettings()
    if (!settings) return

    setArraySize(settings.size)
    setMinValue(settings.min)
    setMaxValue(settings.max)
    setTempArraySize(settings.size)
    setTempMinValue(settings.min)
    setTempMaxValue(settings.max)
  }

  const generateBubbleSortSteps = (sourceArray) => {
    const workingArray = [...sourceArray]
    const generatedSteps = []
    const length = workingArray.length

    for (let i = 0; i < length - 1; i += 1) {
      const sortedTail = Array.from({ length: i }, (_, offset) => length - i + offset)

      for (let j = 0; j < length - i - 1; j += 1) {
        const leftValue = workingArray[j]
        const rightValue = workingArray[j + 1]
        let swapped = false
        let nextExplanation = `Comparing ${leftValue} and ${rightValue}`

        if (leftValue > rightValue) {
          const temp = workingArray[j]
          workingArray[j] = workingArray[j + 1]
          workingArray[j + 1] = temp
          swapped = true
          nextExplanation = `Swapping because ${leftValue} > ${rightValue}`
        }

        generatedSteps.push({
          array: [...workingArray],
          compared: [j, j + 1],
          sortedIndices: sortedTail,
          swapped,
          explanation: nextExplanation,
        })
      }
    }

    return generatedSteps
  }

  const applyStep = useCallback(
    (stepIndex) => {
      if (stepIndex >= steps.length) return

      const step = steps[stepIndex]
      setArray(step.array)
      setActiveIndices(step.compared)
      setSortedIndices(step.sortedIndices)
      setExplanation(step.explanation)
      setCurrentStep(stepIndex + 1)

      if (stepIndex + 1 >= steps.length) {
        setIsPlaying(false)
        setIsPaused(false)
        setActiveIndices([])
        setSortedIndices(Array.from({ length: step.array.length }, (_, index) => index))
        setExplanation('Bubble Sort complete. The array is now sorted.')
      }
    },
    [steps],
  )

  useEffect(() => {
    if (!isPlaying || isPaused || currentStep >= steps.length) return

    const timeoutId = setTimeout(() => {
      applyStep(currentStep)
    }, speed)

    return () => clearTimeout(timeoutId)
  }, [isPlaying, isPaused, currentStep, steps, speed, applyStep])

  const handleStartOrPlay = () => {
    if (selectedAlgorithm !== 'bubble') return

    if (steps.length === 0) {
      const generatedSteps = generateBubbleSortSteps(array)
      if (generatedSteps.length === 0) return

      setInitialArray([...array])
      setSteps(generatedSteps)
      setCurrentStep(0)
      setSortedIndices([])
      setActiveIndices([])
      setExplanation('Starting Bubble Sort.')
      setIsPaused(false)
      setIsPlaying(true)
      return
    }

    if (currentStep < steps.length) {
      setIsPaused(false)
      setIsPlaying(true)
    }
  }

  const handleTogglePause = () => {
    if (steps.length === 0 || currentStep >= steps.length) return
    setIsPaused((prev) => !prev)
  }

  const handleNextStep = () => {
    if (steps.length === 0 || currentStep >= steps.length) return
    setIsPlaying(false)
    setIsPaused(true)
    applyStep(currentStep)
  }

  const handleResetExecution = () => {
    setArray([...initialArray])
    setActiveIndices([])
    setSortedIndices([])
    setSteps([])
    setCurrentStep(0)
    setIsPlaying(false)
    setIsPaused(false)
    setExplanation('Execution reset. Press Start Sorting to begin again.')
  }

  const getBarClassName = (index) => {
    if (sortedIndices.includes(index)) return 'array-bar sorted'
    if (activeIndices.includes(index)) return 'array-bar comparing'
    return 'array-bar'
  }

  return (
    <section className="sorting-visualizer">
      <div className="visualizer-controls">
        <div className="controls-container">
          <div className="input-group">
            <label htmlFor="algorithm-select">Algorithm</label>
            <select
              id="algorithm-select"
              value={selectedAlgorithm}
              onChange={(event) => setSelectedAlgorithm(event.target.value)}
              disabled={isExecutionLocked}
            >
              <option value="bubble">Bubble Sort</option>
              <option value="selection" disabled>
                Selection Sort (Coming Soon)
              </option>
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="array-size-input">Array Size</label>
            <input
              id="array-size-input"
              type="number"
              min={5}
              max={100}
              value={tempArraySize}
              onChange={(event) => setTempArraySize(Number(event.target.value))}
              disabled={isExecutionLocked}
            />
          </div>
          <div className="input-group">
            <label htmlFor="min-value-input">Min Value</label>
            <input
              id="min-value-input"
              type="number"
              value={tempMinValue}
              onChange={(event) => setTempMinValue(Number(event.target.value))}
              disabled={isExecutionLocked}
            />
          </div>
          <div className="input-group">
            <label htmlFor="max-value-input">Max Value</label>
            <input
              id="max-value-input"
              type="number"
              value={tempMaxValue}
              onChange={(event) => setTempMaxValue(Number(event.target.value))}
              disabled={isExecutionLocked}
            />
          </div>
        </div>

        <div className="buttons-row">
          <button
            type="button"
            className="control-button control-button-secondary"
            onClick={handleApplySettings}
            disabled={isExecutionLocked}
          >
            Apply
          </button>
          <button
            type="button"
            className="control-button control-button-secondary"
            onClick={handleGenerateNewArray}
            disabled={isExecutionLocked}
          >
            Generate New Array
          </button>
          <button
            type="button"
            className="control-button control-button-primary"
            onClick={handleStartOrPlay}
            disabled={steps.length > 0 && currentStep >= steps.length}
          >
            {isPlaying && !isPaused ? 'Playing...' : steps.length > 0 ? 'Play' : 'Start Sorting'}
          </button>
          <button
            type="button"
            className="control-button control-button-secondary"
            onClick={handleTogglePause}
            disabled={steps.length === 0 || currentStep >= steps.length}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            type="button"
            className="control-button control-button-secondary"
            onClick={handleNextStep}
            disabled={steps.length === 0 || currentStep >= steps.length || (isPlaying && !isPaused)}
          >
            Next Step
          </button>
          <button
            type="button"
            className="control-button control-button-secondary"
            onClick={handleResetExecution}
            disabled={steps.length === 0 && !isPlaying && currentStep === 0}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="status-row">
        <p className="algorithm-label">Selected Algorithm: {selectedAlgorithmLabel}</p>
        <p className="step-counter">Step {currentStep} / {steps.length}</p>
      </div>

      <div className="bars-wrapper" aria-label="Array visualization">
        {array.map((value, index) => (
          <div key={`${value}-${index}`} className="bar-outer">
            <div className={getBarClassName(index)} style={{ height: `${value}px` }} />
          </div>
        ))}
      </div>

      <section className="explanation-panel" aria-live="polite">
        <h2 className="explanation-title">What is happening?</h2>
        <p className="explanation-text">{explanation}</p>
      </section>
    </section>
  )
}

export default SortingVisualizer
