const PASSING_PERCENTAGE = 67

function isArray(value) {
  return Array.isArray(value)
}

export function validateQuizData(data) {
  const rootIsObject = typeof data === 'object' && data !== null && !isArray(data)
  if (!rootIsObject) {
    return false
  }

  const titleIsValid = typeof data.quizTitle === 'string' && data.quizTitle.trim() !== ''
  if (!titleIsValid) {
    return false
  }

  if (!isArray(data.correctAnswers) || data.correctAnswers.length === 0) {
    return false
  }

  if (!isArray(data.attempts) || data.attempts.length === 0) {
    return false
  }

  const questionTotal = data.correctAnswers.length
  let allAttemptsValid = true

  data.attempts.forEach((attempt) => {
    const attemptIsObject = typeof attempt === 'object' && attempt !== null && !isArray(attempt)

    if (!attemptIsObject) {
      allAttemptsValid = false
      return
    }

    if (typeof attempt.name !== 'string' || attempt.name.trim() === '') {
      allAttemptsValid = false
    }

    if (!isArray(attempt.answers) || attempt.answers.length !== questionTotal) {
      allAttemptsValid = false
    }
  })

  return allAttemptsValid
}

export function calculateAttempt(attempt, correctAnswers) {
  let rightCount = 0

  attempt.answers.forEach((answer, position) => {
    if (answer === correctAnswers[position]) {
      rightCount += 1
    }
  })

  const percentValue = Math.round((rightCount / correctAnswers.length) * 100)

  return {
    name: attempt.name.trim(),
    score: rightCount,
    percentage: percentValue,
    passed: percentValue >= PASSING_PERCENTAGE,
  }
}

export function calculateReport(data) {
  const calculated = []
  let percentTotal = 0
  let passedTotal = 0
  let topAttempt = null

  data.attempts.forEach((attempt) => {
    const result = calculateAttempt(attempt, data.correctAnswers)
    calculated.push(result)
    percentTotal += result.percentage

    if (result.passed) {
      passedTotal += 1
    }

    if (topAttempt === null || result.score > topAttempt.score) {
      topAttempt = result
    }
  })

  return {
    quizTitle: data.quizTitle.trim(),
    questionCount: data.correctAnswers.length,
    participantCount: calculated.length,
    averagePercentage: Math.round(percentTotal / calculated.length),
    passedCount: passedTotal,
    threshold: PASSING_PERCENTAGE,
    best: topAttempt,
    attempts: calculated,
  }
}
