document.getElementById(Player.Position).addEventListener('click', playerclick);

function playerclick() {
    //document.getElementById(Player.Position)如果class有player才會執行
    if (document.getElementById(Player.Position).classList.contains('player')) {
        if (Game.TurnRole == "Player") {
            if (Game.PlayerCurAction == "無操作") {
                Game.PlayerCurAction = "已選擇玩家角色";
                ShowDebugInfo()
                PlayerDrawMoveRange();
                MoveCamera(Player.Position);
            } else {
                alert("已選擇玩家角色，請選擇操作");
                ShowDebugInfo()
            }
        } else {
            alert("現在為敵人行動回合，請等待敵人行動完畢再選擇角色");
            ShowDebugInfo()
        }
    }
}

//玩家移動範圍渲染及點擊事件
function PlayerDrawMoveRange() {
    let playerPos = Player.Position;
    let playermove = Player.Move;
    let cell = Array(Game.Map.rows * Game.Map.cols).fill(0);
    BFSWithoutPlayerAndEnemyAndObstacle(playerPos, cell);
    for (let i = 0; i < Game.Map.rows; i++) {
        for (let j = 0; j < Game.Map.cols; j++) {
            let pos = i * Game.Map.cols + j;
            //如果該格子是玩家可以移動的範圍，以及還要判斷該格子是否有敵人且此敵人的curhp>0
            if (cell[pos] <= playermove && !Game.Obstacles.includes(pos) && !Enemys.some(enemy => enemy.Position == pos && enemy.CurHP > 0) && pos != playerPos) {
                if (cell[pos] != 0) {
                    document.getElementById(pos).classList.add('playercanmove');
                }
            }
        }
    }
    document.querySelectorAll('.playercanmove').forEach(cell => {
        cell.onclick = () => {
            if (Game.TurnRole == "Player") {
                if (Game.PlayerCurAction == "已選擇玩家角色" && cell.classList.contains('playercanmove')) {
                    Game.PlayerCurAction = "移動中";
                    ShowDebugInfo()
                    //渲染動畫
                    let path = findPath(Player.Position, parseInt(cell.id), cell);
                    animatePlayerMove(path);
                    //改變數據資料
                    PlayerMove(cell.id);
                    //等待前面結束後再執行
                    MoveCamera(Player.Position);
                    setTimeout(() => {
                        Game.PlayerCurAction = "已選擇移動位置";
                        ShowDebugInfo()
                    }, path.length * 200);

                } else {
                    alert("已選擇移動位置，請按下確認按鈕");
                    ShowDebugInfo()
                }
            } else {
                alert("現在為敵人行動回合，請等待敵人行動完畢再選擇角色");
                ShowDebugInfo()
            }
        }
    })
}

function findPath(start, end, cell) {
    const row = Math.floor(start / Game.Map.cols);
    const col = start % Game.Map.cols;

    const dx = [0, 1, 0, -1];
    const dy = [-1, 0, 1, 0];

    let queue = [];
    let visited = Array(Game.Map.rows * Game.Map.cols).fill(false);
    let prev = Array(Game.Map.rows * Game.Map.cols).fill(-1);

    queue.push(start);
    visited[start] = true;

    while (queue.length > 0) {
        let cur = queue.shift();
        let curRow = Math.floor(cur / Game.Map.cols);
        let curCol = cur % Game.Map.cols;

        if (cur === end) {
            break;
        }

        for (let i = 0; i < 4; i++) {
            let newRow = curRow + dy[i];
            let newCol = curCol + dx[i];
            let newPos = newRow * Game.Map.cols + newCol;

            if (newRow >= 0 && newRow < Game.Map.rows && newCol >= 0 && newCol < Game.Map.cols && !visited[newPos] && !Game.Obstacles.includes(newPos) && !Enemys.some(enemy => enemy.Position == newPos && enemy.CurHP > 0) && newPos != Player.Position) {
                visited[newPos] = true;
                prev[newPos] = cur;
                queue.push(newPos);
            }
        }
    }

    let path = [];
    for (let at = end; at !== -1; at = prev[at]) {
        path.push(at);
    }
    path.reverse();

    if (path[0] === start) {
        return path;
    } else {
        return [];
    }
}

// 動畫函數
function animatePlayerMove(path) {
    if (path.length == 0) {
        return;
    }

    let currentIndex = 0;

    function step() {
        document.querySelectorAll('.playercanmove').forEach(cell => {
            cell.classList.remove('playercanmove');
            cell.onclick = null;
        });
        if (currentIndex >= path.length) {

            // 玩家停留在目的地，恢復成player.png
            document.getElementById(path[currentIndex - 1]).classList.add('player');
            return;
        }

        if (currentIndex > 0) {
            document.getElementById(path[currentIndex - 1]).classList.remove('player');
        }

        let currentPos = path[currentIndex];
        let nextPos = (currentIndex + 1 < path.length) ? path[currentIndex + 1] : currentPos;

        // 判斷方向
        let rowCurrent = Math.floor(currentPos / Game.Map.cols);
        let colCurrent = currentPos % Game.Map.cols;
        let rowNext = Math.floor(nextPos / Game.Map.cols);
        let colNext = nextPos % Game.Map.cols;

        // 計算方向
        let direction = '';
        if (rowNext < rowCurrent) {
            direction = 'up';
        } else if (colNext > colCurrent) {
            direction = 'right';
        } else if (rowNext > rowCurrent) {
            direction = 'down';
        } else if (colNext < colCurrent) {
            direction = 'left';
        }

        // 顯示對應方向的圖片
        let playerCell = document.getElementById(currentPos);
        playerCell.classList.add('player');

        // 設置方向的背景圖片
        if (direction !== '') {
            playerCell.style.backgroundImage = `url(./Public/${direction}.png)`;
        }

        // 清除上一步的方向
        if (currentIndex > 0) {
            let prevPos = path[currentIndex - 1];
            let prevCell = document.getElementById(prevPos);
            prevCell.style.backgroundImage = '';
        }

        currentIndex++;
        setTimeout(step, 100);
    }

    step();
}

//玩家移動(不渲染畫面只改變數據)
function PlayerMove(pos) {
    Player.OldPosition = Player.Position;
    Player.Position = parseInt(pos);
    ShowDebugInfo()
}

//玩家攻擊範圍渲染及點擊事件
function PlayerDrawAttackRange() {
    let playerPos = Player.Position;
    let playerAtkRange = Player.AtkRange;
    for (let i = 0; i < Game.Map.rows; i++) {
        for (let j = 0; j < Game.Map.cols; j++) {
            let pos = i * Game.Map.cols + j;
            if (ManhattanDistance(playerPos, pos) <= playerAtkRange && !Game.Obstacles.includes(pos) && Enemys.some(enemy => enemy.Position == pos && enemy.CurHP > 0)) {
                document.getElementById(pos).classList.add('playercanattack');
            }
        }
    }
    document.querySelectorAll('.playercanattack').forEach(cell => {
        cell.onclick = () => {
            if (Game.TurnRole == "Player") {
                if (Game.PlayerCurAction == "已按下攻擊按鈕" && cell.classList.contains('playercanattack')) {
                    Game.PlayerCurAction = "已選擇攻擊目標";
                    ShowDebugInfo()
                    document.querySelectorAll('.playercanattack').forEach(cell => {
                        cell.classList.remove('playercanattack');
                        cell.onclick = null;
                    })
                    PlayerAttack(cell.id);
                }
            } else {
                alert("現在為敵人行動回合，請等待敵人行動完畢再選擇角色");
                ShowDebugInfo()
            }
        }
    })
}

//玩家攻擊
function PlayerAttack(pos) {
    //查詢他是enemy的對象
    let enemy = Enemys.find(enemy => enemy.Position == parseInt(pos));
    //查詢他是enemy的index
    let index = Enemys.findIndex(enemy => enemy.Position == parseInt(pos));

    Player.OldPosition = Player.Position;

    CreateBattleScreen(index)

    //如果攻擊的對象是第二關的BOSS
    if (index === 2 && Game.Level == 1) {
        PlayerAttackBoss(enemy, index);
    } else {
        let damage = Player.Atk + Player.Equipment.Weapon.AddAtk - enemy.Def;
        damage = damage < 0 ? 1 : damage;
        if (index != 2) {
            enemy.CurHP -= damage;
            enemy.CurHP = enemy.CurHP < 0 ? 0 : enemy.CurHP;
            setTimeout(() => {
                //該enemy的生命條渲染
                updateEnemyHealthBar(enemy, index)
                if (enemy.CurHP <= 0) {
                    Game.MyMoney += enemy.RewardMoney;
                    document.getElementById(enemy.Position).classList.remove(`enemy${index}`);
                    Game.PlayerCurAction = "無操作";
                    Game.TurnRole = "Enemy";
                    enemy.Position = -1;
                    ClearBattleScreen();
                    Player.EXP += enemy.GiveEXP;
                    showyouwhatget("金幣" + enemy.RewardMoney + "和經驗值" + enemy.GiveEXP);
                    setTimeout(() => {
                        if (Player.EXP >= Player.MaxEXP) {
                            while (Player.EXP / Player.MaxEXP >= 1) {
                                LevelUp();
                            }
                            setTimeout(() => {
                                if (Enemys.every(enemy => enemy.CurHP <= 0)) {
                                    Game.PlayerCurAction = "無操作";
                                    Game.TurnRole = "Player";
                                    Game.Level++;
                                    main()
                                    return;
                                } else {
                                    Game.PlayerCurAction = "無操作";
                                    Game.TurnRole = "Enemy";
                                    showTurnLetter()
                                    setTimeout(() => {
                                        EnemysAction()
                                    }, 2000)
                                }
                            }, 4000)
                            return
                        } else {
                            setTimeout(() => {
                                if (Enemys.every(enemy => enemy.CurHP <= 0)) {
                                    Game.PlayerCurAction = "無操作";
                                    Game.TurnRole = "Player";
                                    Game.Level++;
                                    main()
                                    return;
                                }
                            }, 100)
                        }
                    }, 2500)
                } else {
                    let enemydamege = enemy.Atk - Player.Def - Player.Equipment.Armor.AddDef - Player.Equipment.Fitting.AdDef;
                    enemydamege = enemydamege < 0 ? 1 : enemydamege;
                    Player.CurHP -= enemydamege;
                    Player.CurHP = Player.CurHP < 0 ? 0 : Player.CurHP;

                    setTimeout(() => {
                        //updateEnemyHealthBar()
                        updatePlayerHealthBar()
                    }, 1700)
                    setTimeout(() => {
                        if (Player.CurHP <= 0) {
                            ClearBattleScreen()
                            setTimeout(() => {
                                alert("你已經死亡了");
                                window.location.reload();
                            }, 1000)
                        } else {
                            Game.PlayerCurAction = "無操作";
                            Game.TurnRole = "Enemy";
                            ClearBattleScreen();
                            let getexp = 200 + Math.floor(Math.random() * 100);
                            Player.EXP += getexp;
                            showyouwhatget(getexp + "經驗值");
                            setTimeout(() => {
                                setTimeout(() => {
                                    if (Player.EXP >= Player.MaxEXP) {
                                        while (Player.EXP / Player.MaxEXP >= 1) {
                                            LevelUp();
                                        }
                                        setTimeout(() => {
                                            Game.PlayerCurAction = "無操作";
                                            Game.TurnRole = "Enemy";
                                            showTurnLetter()
                                            setTimeout(() => {
                                                EnemysAction()
                                            }, 2000)
                                        }, 4000)
                                        return;
                                    }
                                    updatePlayerEXPBar();
                                    setTimeout(() => {
                                        Game.PlayerCurAction = "無操作";
                                        Game.TurnRole = "Enemy";
                                        showTurnLetter()
                                        setTimeout(() => {
                                            EnemysAction()
                                        }, 2000)
                                    }, 100)
                                    return;
                                })
                            }, 2500)
                        }
                    }, 1800)
                }
            }, 2300);
        } else {
            enemy.CurHP -= damage;
            enemy.CurHP = enemy.CurHP < 0 ? 0 : enemy.CurHP;
            setTimeout(() => {
                //該enemy的生命條渲染
                updateEnemyHealthBar(enemy, index)
                if (enemy.CurHP <= 0) {
                    Game.MyMoney += enemy.RewardMoney;
                    document.getElementById(enemy.Position).classList.remove(`enemy${index}`);
                    Game.PlayerCurAction = "無操作";
                    Game.TurnRole = "Enemy";
                    enemy.Position = -1;
                    ClearBattleScreen();
                    Player.EXP += enemy.GiveEXP;
                    showyouwhatget("金幣" + enemy.RewardMoney + "和經驗值" + enemy.GiveEXP);
                    setTimeout(() => {
                        if (Player.EXP >= Player.MaxEXP) {
                            while (Player.EXP / Player.MaxEXP >= 1) {
                                LevelUp();
                            }
                            setTimeout(() => {
                                if (Enemys.every(enemy => enemy.CurHP <= 0)) {
                                    Game.PlayerCurAction = "無操作";
                                    Game.TurnRole = "Player";
                                    Game.Level++;
                                    main()
                                    return;
                                } else {
                                    Game.PlayerCurAction = "無操作";
                                    Game.TurnRole = "Enemy";
                                    showTurnLetter()
                                    setTimeout(() => {
                                        EnemysAction()
                                    }, 2000)
                                }
                            }, 4000)
                            return
                        } else {
                            setTimeout(() => {
                                if (Enemys.every(enemy => enemy.CurHP <= 0)) {
                                    Game.PlayerCurAction = "無操作";
                                    Game.TurnRole = "Player";
                                    Game.Level++;
                                    main()
                                    return;
                                }
                            }, 100)
                        }
                    }, 2500)
                } else {
                    let enemydamege = enemy.Atk - Player.Def - Player.Equipment.Armor.AddDef - Player.Equipment.Fitting.AdDef;
                    enemydamege = enemydamege < 0 ? 1 : enemydamege;
                    setTimeout(() => {
                        Player.CurHP -= Math.floor(enemydamege / 10)
                        Player.CurHP = Player.CurHP < 0 ? 0 : Player.CurHP;
                        document.documentElement.style.setProperty('--playerhp-w', `${Player.CurHP / Player.HP * 100}%`);
                        Dom.PlayerHPBar.style.width = `${Player.CurHP / Player.HP * 100}%`;
                        Dom.PlayerHPBar.textContent = `${Player.CurHP}/${Player.HP}`;
                    }, 500);

                    setTimeout(() => {
                        Player.CurHP -= Math.floor(enemydamege / 10)
                        Player.CurHP = Player.CurHP < 0 ? 0 : Player.CurHP;
                        document.documentElement.style.setProperty('--playerhp-w', `${Player.CurHP / Player.HP * 100}%`);
                        Dom.PlayerHPBar.style.width = `${Player.CurHP / Player.HP * 100}%`;
                        Dom.PlayerHPBar.textContent = `${Player.CurHP}/${Player.HP}`;
                    }, 600);

                    setTimeout(() => {
                        Player.CurHP -= Math.floor(enemydamege / 27)
                        Player.CurHP = Player.CurHP < 0 ? 0 : Player.CurHP;
                        document.documentElement.style.setProperty('--playerhp-w', `${Player.CurHP / Player.HP * 100}%`);
                        Dom.PlayerHPBar.style.width = `${Player.CurHP / Player.HP * 100}%`;
                        Dom.PlayerHPBar.textContent = `${Player.CurHP}/${Player.HP}`;
                    }, 700);

                    setTimeout(() => {
                        Player.CurHP -= Math.floor(enemydamege / 27)
                        Player.CurHP = Player.CurHP < 0 ? 0 : Player.CurHP;
                        document.documentElement.style.setProperty('--playerhp-w', `${Player.CurHP / Player.HP * 100}%`);
                        Dom.PlayerHPBar.style.width = `${Player.CurHP / Player.HP * 100}%`;
                        Dom.PlayerHPBar.textContent = `${Player.CurHP}/${Player.HP}`;
                    }, 800);

                    setTimeout(() => {
                        Player.CurHP -= Math.floor(enemydamege / 27)
                        Player.CurHP = Player.CurHP < 0 ? 0 : Player.CurHP;
                        document.documentElement.style.setProperty('--playerhp-w', `${Player.CurHP / Player.HP * 100}%`);
                        Dom.PlayerHPBar.style.width = `${Player.CurHP / Player.HP * 100}%`;
                        Dom.PlayerHPBar.textContent = `${Player.CurHP}/${Player.HP}`;
                    }, 900);
                    setTimeout(() => {
                        Player.CurHP -= Math.floor(enemydamege / 27)
                        Player.CurHP = Player.CurHP < 0 ? 0 : Player.CurHP;
                        document.documentElement.style.setProperty('--playerhp-w', `${Player.CurHP / Player.HP * 100}%`);
                        Dom.PlayerHPBar.style.width = `${Player.CurHP / Player.HP * 100}%`;
                        Dom.PlayerHPBar.textContent = `${Player.CurHP}/${Player.HP}`;
                    }, 1000);

                    setTimeout(() => {
                        Player.CurHP -= Math.floor(enemydamege / 1.5)
                        Player.CurHP = Player.CurHP < 0 ? 0 : Player.CurHP;
                        document.documentElement.style.setProperty('--playerhp-w', `${Player.CurHP / Player.HP * 100}%`);
                        Dom.PlayerHPBar.style.width = `${Player.CurHP / Player.HP * 100}%`;
                        Dom.PlayerHPBar.textContent = `${Player.CurHP}/${Player.HP}`;
                    }, 1800);
                    setTimeout(() => {
                        if (Player.CurHP <= 0) {
                            ClearBattleScreen()
                            setTimeout(() => {
                                alert("你已經死亡了");
                                window.location.reload();
                            }, 500)
                        } else {
                            Game.PlayerCurAction = "無操作";
                            Game.TurnRole = "Enemy";
                            ClearBattleScreen();
                            let getexp = 200 + Math.floor(Math.random() * 100);
                            Player.EXP += getexp;
                            showyouwhatget(getexp + "經驗值");
                            setTimeout(() => {
                                setTimeout(() => {
                                    if (Player.EXP >= Player.MaxEXP) {
                                        while (Player.EXP / Player.MaxEXP >= 1) {
                                            LevelUp();
                                        }
                                        setTimeout(() => {
                                            Game.PlayerCurAction = "無操作";
                                            Game.TurnRole = "Enemy";
                                            showTurnLetter()
                                            setTimeout(() => {
                                                EnemysAction()
                                            }, 2000)
                                        }, 4000)
                                        return;
                                    }
                                    updatePlayerEXPBar();
                                    setTimeout(() => {
                                        Game.PlayerCurAction = "無操作";
                                        Game.TurnRole = "Enemy";
                                        showTurnLetter()
                                        setTimeout(() => {
                                            EnemysAction()
                                        }, 2000)
                                    }, 100)
                                    return;
                                })
                            }, 2500)
                        }
                    }, 3600)
                }
            }, 1400);
        }
    }
}

