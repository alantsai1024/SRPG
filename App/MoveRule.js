//排除玩家和敵人以及障礙物的位置的bfs，上下左右的格子都是敵人或障礙物則不會進入該格子
function BFSWithoutPlayerAndEnemyAndObstacle(pos, cell) {
    const row = Math.floor(pos / Game.Map.cols);
    const col = pos % Game.Map.cols;

    const dx = [0, 1, 0, -1];
    const dy = [-1, 0, 1, 0];

    let queue = [];
    queue.push(pos);


    let visited = Array(Game.Map.rows * Game.Map.cols).fill(false);
    visited[pos] = true;

    while (queue.length > 0) {
        let cur = queue.shift();
        let curRow = Math.floor(cur / Game.Map.cols);
        let curCol = cur % Game.Map.cols;

        for (let i = 0; i < 4; i++) {
            let newRow = curRow + dy[i];
            let newCol = curCol + dx[i];
            let newPos = newRow * Game.Map.cols + newCol;

            if (newRow >= 0 && newRow < Game.Map.rows && newCol >= 0 && newCol < Game.Map.cols && !visited[newPos] && !Game.Obstacles.includes(newPos) && !Enemys.some(enemy => enemy.Position == newPos && enemy.CurHP > 0) && newPos != Player.Position) {
                cell[newPos] = cell[cur] + 1;
                visited[newPos] = true;
                queue.push(newPos);

            }
        }
    }
}

//敵人的bfs,敵人不會被同樣是敵人的格子阻擋,但不能站在其他敵人的位置
function BFSWithoutEnemy(pos, cell) {
    const row = Math.floor(pos / Game.Map.cols);
    const col = pos % Game.Map.cols;

    const dx = [0, 1, 0, -1];
    const dy = [-1, 0, 1, 0];

    let queue = [];
    queue.push(pos);

    let visited = Array(Game.Map.rows * Game.Map.cols).fill(false);
    visited[pos] = true;

    while (queue.length > 0) {
        let cur = queue.shift();
        let curRow = Math.floor(cur / Game.Map.cols);
        let curCol = cur % Game.Map.cols;

        for (let i = 0; i < 4; i++) {
            let newRow = curRow + dy[i];
            let newCol = curCol + dx[i];
            let newPos = newRow * Game.Map.cols + newCol;

            if (newRow >= 0 && newRow < Game.Map.rows && newCol >= 0 && newCol < Game.Map.cols && !visited[newPos] && !Game.Obstacles.includes(newPos) && newPos != Player.Position) {
                cell[newPos] = cell[cur] + 1;
                visited[newPos] = true;
                queue.push(newPos);
            }
        }
    }
}

//計算曼哈頓距離
function ManhattanDistance(pos1, pos2) {
    const row1 = Math.floor(pos1 / Game.Map.cols);
    const col1 = pos1 % Game.Map.cols;
    const row2 = Math.floor(pos2 / Game.Map.cols);
    const col2 = pos2 % Game.Map.cols;
    return Math.abs(row1 - row2) + Math.abs(col1 - col2);
}