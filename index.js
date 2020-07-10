const listWrapper = document.getElementById('example-list')
const loadChartButton = document.getElementById('loadChart')
const loadChartGLButton = document.getElementById('loadChartGL')
const chartView = document.getElementById('example-view')
const loading = document.getElementById('loading')
const filterInput = document.getElementById('filter-input')
const filterClear = document.getElementById('filter-clear')
const categoryList = document.getElementById('category-list')

let keyword = null

let lazyLoader = null

function loadView (id, isGL) {
  loading.classList.add('active');
  chartView.src = `https://echarts.apache.org/examples/zh/editor.html?c=${id}${isGL ? '&gl=1' : ''}`
  const currentActive = document.querySelector('.example-item.active')
  currentActive && currentActive.classList.remove('active')
  document.querySelector(`.example-item[data-chart-id="${id}"]`).classList.add('active')
}

window.loadView = loadView

function renderChartList (data, isGL) {
  const categories = {}
  const list = data.map(item => {
    const category = item.category
    if (Array.isArray(category)) {
      item.category.forEach(key => {
        categories[key] ? categories[key]++ : (categories[key] = 1)
      })
    } else {
      categories[category] ? categories[category]++ : (categories[category] = 1)
    }
    const src = `https://echarts-www.cdn.bcebos.com/examples/data${!isGL ? '' : '-gl'}/thumb/${item.id}.jpg`
    return `
      <div class="example-item" title="${item.title}" data-chart-id="${item.id}" onclick="loadView('${item.id}', ${isGL})">
        <img class="example-thumbnail" data-src="${src}" />
        <h4>${item.title}</h4>
      </div>
    `
  })
  listWrapper.innerHTML = list.join('')
  filterChart()
  updateCategoryList(categories)
}

function filterChart () {
  const charts = document.querySelectorAll('.example-item.hide')
  charts.forEach(chart => {
    chart.classList.remove('hide')
  })
  if (keyword) {
    const charts = document.querySelectorAll('.example-item')
    charts.forEach(chart => {
      const title = chart.getAttribute('title').toLowerCase()
      if (title.indexOf(keyword) === -1) chart.classList.add('hide')
    })
  }
  setTimeout(function () {
    if (lazyLoader) lazyLoader.destroy()
    const images = document.querySelectorAll(".example-thumbnail")
    lazyLoader = lazyload(images)
  })
}

function updateCategoryList (categories = {}) {
  categoryList.innerHTML = Object.keys(categories).map(key => {
    const value = categories[key]
    return `<div class="category-item" data-value="${key}">${key} (${value})</div>`
  }).join('')
}

loadChartButton.addEventListener('click', function () {
  if (this.classList.contains('active')) return
  loadChartGLButton.classList.remove('active')
  renderChartList(EXAMPLES)
  this.classList.add('active')
})
loadChartGLButton.addEventListener('click', function () {
  if (this.classList.contains('active')) return
  loadChartButton.classList.remove('active')
  renderChartList(EXAMPLES_GL, true)
  this.classList.add('active')
})

categoryList.addEventListener('click', function (e) {
  if (e.target.classList.contains('category-item')) {
    filterInput.value = keyword = e.target.dataset.value
    filterChart()
  }
})

filterClear.addEventListener('click', function () { 
  filterInput.value = keyword = ''
  filterChart()
})

filterInput.addEventListener('keyup', function (e) {
  if (e.keyCode === 13) {
    keyword = filterInput.value
    filterChart()
  }
})

window.onload = function () {
  renderChartList(EXAMPLES)
}

chartView.onload = function () {
  loading.classList.remove('active');
}
