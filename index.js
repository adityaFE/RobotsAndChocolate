const N = 3
let grid = []
//to track the progress of robots
//const initialChocolateForR1= 
let robot1 = {x: 0, y: 0, chocolates: 0}
let robot2 = {x: 0, y: N - 1, chocolates: 0}
//track which robot's turn
let currentRobot = 1
let totalChocolates = 0
//checking if a particluar grid is visited
//let visited = []

const gridContainer = document.getElementById('grid-container')
const robot1Counter = document.getElementById('robot1-counter')
const robot2Counter = document.getElementById('robot2-counter')
const totalCounter = document.getElementById('total-counter')
const resetBtn = document.getElementById('reset-btn')
const autoBtn = document.getElementById('auto-btn')

//create Grid and Initialize Game
function createGrid () {
  grid = []
  gridContainer.style.gridTemplateColumns = `repeat(${N}, 50px)`

  for (let i = 0; i < N; i++) {
    const row = []
    for (let j = 0; j < N; j++) {
      //random value from 1 to 10
      const cellValue = Math.floor(Math.random() * 10) + 1
      row.push(cellValue)
      //console.log(row)
      const cell = document.createElement('div')
      cell.id = `cell-${i}-${j}`
      cell.classList.add('grid-cell')
      cell.textContent = cellValue
      //console.log(cell)
      gridContainer.appendChild(cell)
    }
    grid.push(row)
  }

  robot1.chocolates = grid[0][0]
  robot2.chocolates = grid[0][N - 1]
  robot1Counter.textContent = robot1.chocolates
  robot2Counter.textContent = robot2.chocolates
  totalChocolates = robot1.chocolates + robot2.chocolates
  totalCounter.textContent = robot1.chocolates + robot2.chocolates

  //initialize robots on the grid
  highlightRobot(robot1, 'robot1')
  highlightRobot(robot2, 'robot2')
}

//move a robot based on the direction
function moveRobot (robot, direction) {
  unhighlightRobot(robot)
  switch (direction) {
    case 'down':
      if (robot.x < N - 1) {
        robot.x += 1
      }
      break
    case 'left-down':
      if (robot.x < N - 1 && robot.y > 0) {
        robot.x += 1
        robot.y -= 1
      }
      break
    case 'right-down':
      if (robot.x < N - 1 && robot.y < N - 1) {
        robot.x += 1
        robot.y += 1
      }
      break
  }
  console.log(robot)
  collectChocolates(robot)
  highlightRobot(robot, currentRobot === 1 ? 'robot1' : 'robot2')

  if (robot.x === N - 1) checkGameEnd()
}

//highlight current robot position
function highlightRobot (robot, className) {
  //first time it will be the starting position of the robots
  const cell = document.getElementById(`cell-${robot.x}-${robot.y}`)
  //console.log(cell)
  cell.classList.add(className)
}

//unhighlight previous robot position
function unhighlightRobot (robot) {
  const cell = document.getElementById(`cell-${robot.x}-${robot.y}`)
  cell.classList.remove('robot1', 'robot2')
}

//collect chocolates at the robot's current position
function collectChocolates (robot) {
  const chocolates = grid[robot.x][robot.y]
  console.log(chocolates)
  console.log(totalChocolates)
  totalChocolates += chocolates

  if (currentRobot === 1) {
    robot1.chocolates += chocolates
    robot1Counter.textContent = robot1.chocolates
  } else {
    robot2.chocolates += chocolates
    robot2Counter.textContent = robot2.chocolates
  }

  totalCounter.textContent = totalChocolates
}

//keyboard movement for robots
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault()
    toggleRobot()
  }

  if (currentRobot === 1) {
    if (e.key === 'ArrowDown') moveRobot(robot1, 'down')
    if (e.key === 'ArrowLeft') moveRobot(robot1, 'left-down')
    if (e.key === 'ArrowRight') moveRobot(robot1, 'right-down')
  } else {
    if (e.key === 'ArrowDown') moveRobot(robot2, 'down')
    if (e.key === 'ArrowLeft') moveRobot(robot2, 'left-down')
    if (e.key === 'ArrowRight') moveRobot(robot2, 'right-down')
  }
})

//toggle active robot and show the user which robot is active
function toggleRobot () {
  currentRobot = currentRobot === 1 ? 2 : 1
  let currentRobotText = `R${currentRobot}`
  document.getElementById('current-robot').innerHTML = currentRobotText
}

//check if both robots reached the last row
function checkGameEnd () {
  if (robot1.x === N - 1 && robot2.x === N - 1) {
    alert(`Game Over! Total Chocolates Collected: ${totalChocolates}`)
  }
}

//reset Game
resetBtn.addEventListener('click', () => {
  resetGame()
});

function resetGame () {
  gridContainer.innerHTML = ''
  robot1 = {x: 0, y: 0, chocolates: 0}
  robot2 = {x: 0, y: N - 1, chocolates: 0}
  currentRobot = 1
  totalChocolates = 0
  robot1Counter.textContent = '0'
  robot2Counter.textContent = '0'
  totalCounter.textContent = '0'
  createGrid()
}

autoBtn.addEventListener('click', () => {
  const [maxChocolates, path] = autoPlay()
  console.log([maxChocolates, path])
  console.log(maxChocolates)
  markRobotPaths(path)
  document.getElementById('total-counter').innerHTML = maxChocolates
})

//DP function to calculate maximum chocolates
function autoPlay () {
  const dp = []

  //initialize a 3D DP array where dp[x][y1][y2] will store the maximum chocolates
  for (let i = 0; i < N; i++) {
    const row = []
    for (let j = 0; j < N; j++) {
      const subArray = []
      for (let k = 0; k < N; k++) {
        subArray.push(-1)
      }
      row.push(subArray)
    }
    dp.push(row)
  }
  //console.log(dp)
  const path = []
  for (let i = 0; i < N; i++) {
    const row = []
    for (let j = 0; j < N; j++) {
      const subArray = []
      for (let k = 0; k < N; k++) {
        subArray.push([])
      }
      row.push(subArray)
    }
    path.push(row)
  }
  console.log(path)

  function getMaxChocolates (r, c1, c2) {
    if (r === N) return 0
    if (dp[r][c1][c2] !== -1) return dp[r][c1][c2]

    let chocolates = grid[r][c1]
    console.log(chocolates, 'choco')
    if (c1 !== c2) chocolates += grid[r][c2]

    let maxChocolates = 0
    let bestMoves = []

    for (let move1 = -1; move1 <= 1; move1++) {
      for (let move2 = -1; move2 <= 1; move2++) {
        const newC1 = c1 + move1
        const newC2 = c2 + move2
        if (newC1 >= 0 && newC1 < N && newC2 >= 0 && newC2 < N) {
          const chocolatesCollected = getMaxChocolates(r + 1, newC1, newC2)
          if (chocolatesCollected > maxChocolates) {
            maxChocolates = chocolatesCollected
            bestMoves = [[newC1, newC2]]
          }
        }
      }
    }

    dp[r][c1][c2] = chocolates + maxChocolates
    path[r][c1][c2] = bestMoves
    return dp[r][c1][c2]
  }

  const maxChocolates = getMaxChocolates(0, 0, N - 1)
  return [maxChocolates, path]
}

//mark the optimal path on the grid
function markRobotPaths (path) {
  let r = 0
  let c1 = 0
  let c2 = N - 1

  while (r < N) {
    highlightRobot({x: r, y: c1}, 'robot1-path')
    highlightRobot({x: r, y: c2}, 'robot2-path')

    //ensure path[r][c1][c2] exists and has a valid move
    if (path[r][c1][c2] && path[r][c1][c2].length > 0) {
      const [nextC1, nextC2] = path[r][c1][c2][0]
      r++
      c1 = nextC1
      c2 = nextC2
    } else {
      console.error(`No valid path found at row ${r} for c1: ${c1}, c2: ${c2}`)
      break
    }
  }
}

// Start the game
createGrid()
