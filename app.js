// Готовая защитная механика. Не изменяйте эту функцию.
function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function selectAttempts(filter) {
  const source = window.reportData.attempts

  if (filter === 'all') {
    return source
  }

  const needPassed = filter === 'passed'
  return source.filter((one) => one.passed === needPassed)
}

function renderAttempts(attempts) {
  const resultCount = document.querySelector('#result-count')
  const resultList = document.querySelector('#result-list')
  let itemsHtml = ''

  attempts.forEach((one) => {
    const passText = one.passed ? 'Порог пройден' : 'Порог не пройден'
    const safeName = escapeHtml(one.name)

    itemsHtml += `<li class="result-item"><span class="result-name">${safeName}</span> `
    itemsHtml += `<span>${one.score} из ${one.questionCount} (${one.percentage}%) — ${passText}</span></li>`
  })

  resultList.innerHTML = itemsHtml
  resultCount.textContent = `Показано: ${attempts.length} из ${window.reportData.attempts.length}`
}

function startFilter() {
  const filterForm = document.querySelector('#filter-form')
  const filterSelect = document.querySelector('#filter')
  const resultCount = document.querySelector('#result-count')
  const resultList = document.querySelector('#result-list')

  if (!filterForm || !filterSelect || !resultCount || !resultList) {
    return
  }

  filterForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const selectedValue = filterSelect.value
    const selectedAttempts = selectAttempts(selectedValue)
    renderAttempts(selectedAttempts)
  })
}

startFilter()
