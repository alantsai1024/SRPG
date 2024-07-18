var playerhasatk = false;
var haskillenemy = false;

function EnemysAction() {
    console.log("敵人行動");
    if (Game.TurnRole == "Enemy" && Game.PlayerCurAction == "無操作") {
        let actionIndex = 0;

        function processEnemyAction() {
            if (actionIndex >= Enemys.length) {
                // 所有敵人行動完畢後，進入玩家回合
                Game.Turn++;
                Game.TurnRole = "Player";
                Game.PlayerCurAction = "無操作";

                showTurnLetter();
                MoveCamera(Player.Position); // 鏡頭移動到玩家位置
                document.getElementById(Player.Position).addEventListener('click', playerclick);
                return;
            }

            const enemy = Enemys[actionIndex];
            MoveCamera(enemy.Position); // 鏡頭移動到敵人位置
            if (enemy.CurHP > 0) {

                // 找出當前敵人的攻擊範圍是否有玩家
                let attackRange = getEnemyAttackRange(enemy);
                console.log("敵人" + actionIndex + "的攻擊範圍：" + attackRange);
                if (attackRange.includes(Player.Position) && enemy.CurHP > 0) {
                    // 如果玩家在攻擊範圍內，執行攻擊
                    console.log("敵人" + actionIndex + "攻擊玩家");
                    MoveCamera(enemy.Position); // 鏡頭移動到敵人位置
                    if (Game.Level == 1 && actionIndex == 2) {
                        BossAttackSkill(enemy, Player, actionIndex);
                    } else {
                        enemyAttack(enemy, Player, actionIndex);
                    }
                    setTimeout(() => {
                        if (playerhasatk === true) {
                            let getexp;
                            getexp = haskillenemy === true ? enemy.GiveEXP : 200 + Math.floor(Math.random() * 50);
                            Player.EXP += getexp;
                            let rewardmsg = haskillenemy === true ? "金幣" + enemy.RewardMoney + "和" : "";
                            showyouwhatget(rewardmsg + "經驗值" + getexp);

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

                                        } else {
                                            actionIndex++;
                                            haskillenemy = false;
                                            playerhasatk = false;
                                            console.log("敵人" + actionIndex + "行動完畢");
                                            console.log(haskillenemy, playerhasatk);
                                            processEnemyAction();
                                            return;
                                        }
                                    }, 4500)
                                } else {
                                    setTimeout(() => {
                                        document.documentElement.style.setProperty('--playerexp-w', `${Player.EXP / Player.MaxEXP * 100}%`);
                                        Dom.PlayerEXPBar.style.width = `${Player.EXP / Player.MaxEXP * 100}%`;
                                        Dom.PlayerEXPBar.textContent = `EXP：${Player.EXP}/${Player.MaxEXP}`;
                                        actionIndex++;
                                        haskillenemy = false;
                                        playerhasatk = false;
                                        console.log("敵人" + actionIndex + "行動完畢");
                                        processEnemyAction();
                                    }, 100)
                                }
                            }, 2500)
                        } else {
                            setTimeout(() => {
                                actionIndex++;
                                haskillenemy = false;
                                playerhasatk = false;
                                console.log("敵人" + actionIndex + "行動完畢");
                                processEnemyAction();
                            }, 100)
                        }
                    }, 5500); // 沒有移動，有戰鬥，延遲5.5秒
                } else {
                    // 如果玩家不在攻擊範圍內，計算移動
                    let moveRange = getEnemyMoveRange(enemy);
                    let targetPosition = findClosestPositionToPlayer(moveRange, enemy.AtkRange, Player.AtkRange);
                    if (targetPosition != -1) {
                        console.log("敵人" + actionIndex + "移動到位置" + targetPosition);
                        // 清除敵人原本的位置
                        document.getElementById(enemy.Position).classList.remove('enemy' + actionIndex);
                        moveEnemyToPosition(enemy, targetPosition, actionIndex);
                        MoveCamera(targetPosition); // 鏡頭移動到敵人新位置
                        setTimeout(() => {
                            // 移動後再次檢查攻擊範圍
                            attackRange = getEnemyAttackRange(enemy);
                            if (attackRange.includes(Player.Position)) {
                                // 如果玩家在攻擊範圍內，執行攻擊
                                console.log("敵人" + actionIndex + "攻擊玩家");
                                if (Game.Level === 1 && actionIndex == 2) {
                                    BossAttacks(enemy, Player, actionIndex);
                                } else {
                                    enemyAttack(enemy, Player, actionIndex);
                                }
                                setTimeout(() => {
                                    if (playerhasatk === true) {
                                        let getexp = haskillenemy === true ? enemy.GiveEXP : 200 + Math.floor(Math.random() * 50);
                                        Player.EXP += getexp;
                                        let rewardmsg = haskillenemy === true ? "金幣" + enemy.RewardMoney + "和" : "";
                                        showyouwhatget(rewardmsg + "經驗值" + getexp);

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
                                                        actionIndex++;
                                                        haskillenemy = false;
                                                        playerhasatk = false;
                                                        processEnemyAction();
                                                    }
                                                }, 4500)
                                            } else {
                                                setTimeout(() => {
                                                    document.documentElement.style.setProperty('--playerexp-w', `${Player.EXP / Player.MaxEXP * 100}%`);
                                                    Dom.PlayerEXPBar.style.width = `${Player.EXP / Player.MaxEXP * 100}%`;
                                                    Dom.PlayerEXPBar.textContent = `EXP：${Player.EXP}/${Player.MaxEXP}`;
                                                    actionIndex++;
                                                    haskillenemy = false;
                                                    playerhasatk = false;
                                                    processEnemyAction();
                                                }, 100)
                                            }
                                        }, 2500)
                                    } else {
                                        setTimeout(() => {
                                            actionIndex++;
                                            haskillenemy = false;
                                            playerhasatk = false;
                                            console.log("敵人" + actionIndex + "行動完畢");
                                            processEnemyAction();
                                        }, 100)
                                    }
                                }, 5500); // 有移動，有戰鬥，延遲5.5秒
                            } else {
                                setTimeout(() => {
                                    actionIndex++;
                                    haskillenemy = false;
                                    playerhasatk = false;
                                    processEnemyAction();
                                }, 1200); // 只有移動，延遲1.2秒
                            }
                        }, 1200); // 移動時間2秒
                    } else {
                        setTimeout(() => {
                            actionIndex++;
                            haskillenemy = false;
                            playerhasatk = false;
                            processEnemyAction();
                        }, 1200); // 只有移動，延遲1.2秒
                    }
                }
            } else {
                // 敵人hp <= 0，跳過
                actionIndex++;
                processEnemyAction();
            }
        }

        processEnemyAction();
    }
}

// 找出敵人的攻擊範圍
function getEnemyAttackRange(enemy) {
    let attackRange = [];
    attackRange = calculateAttackRange(enemy.Position, enemy.AtkRange);
    return attackRange;
}

// 找出敵人的移動範圍
function getEnemyMoveRange(enemy) {
    let moveRange = [];
    let pos = enemy.Position;
    let cell = Array(Game.Map.rows * Game.Map.cols).fill(0);
    BFSWithoutEnemy(pos, cell);
    for (let i = 0; i < Game.Map.rows; i++) {
        for (let j = 0; j < Game.Map.cols; j++) {
            let pos = i * Game.Map.cols + j;
            if (cell[pos] <= enemy.Move && !Game.Obstacles.includes(pos) && pos != Player.Position && pos != enemy.Position && !Enemys.some(enemy => enemy.Position == pos && enemy.CurHP > 0)) {
                if (cell[pos] != 0) {
                    moveRange.push(pos);
                }
            }
        }
    }
    return moveRange;
}

// 找出移動範圍中最接近玩家的位置
function findClosestPositionToPlayer(moveRange, attackRange, playeratkrange) {
    /*
    優先級：
    1.優先找出可以攻擊到玩家且玩家無法攻擊到敵人的位置
    2.找出可以攻擊到玩家的位置
    3.找出距離玩家最近的位置
    */
    let targetPosition = -1;
    let minDistance = Number.MAX_SAFE_INTEGER;
    let canAttackPlayer = [];
    let canAttackPlayerButPlayerCantAttack = [];
    let cantAttackPlayer = [];
    moveRange.forEach(pos => {
        let distance = calculateDistance(pos, Player.Position);
        if (distance <= attackRange) {
            if (distance > playeratkrange) {
                canAttackPlayerButPlayerCantAttack.push(pos);
            } else {
                canAttackPlayer.push(pos);
            }
        } else {
            cantAttackPlayer.push(pos);
        }
    });
    if (canAttackPlayerButPlayerCantAttack.length > 0) {
        targetPosition = canAttackPlayerButPlayerCantAttack[0];
    } else if (canAttackPlayer.length > 0) {
        targetPosition = canAttackPlayer[0];
    } else if (cantAttackPlayer.length > 0) {
        cantAttackPlayer.forEach(pos => {
            let distance = calculateDistance(pos, Player.Position);
            if (distance < minDistance) {
                minDistance = distance;
                targetPosition = pos;
            }
        });
    }
    return targetPosition;
}

// 第一種方式移動敵人不能穿過其他敵人
function findPathenemy(start, end, cell) {
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

// 第二種方式移動敵人可以穿過其他敵人
function findPathenemy2(start, end, cell) {
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

            if (newRow >= 0 && newRow < Game.Map.rows && newCol >= 0 && newCol < Game.Map.cols && !visited[newPos] && !Game.Obstacles.includes(newPos) && newPos != Player.Position) {
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

// 移動動畫函數
function animateEnemyMove(path, enemy, index) {
    if (path.length === 0) {
        return;
    }

    let currentIndex = 0;

    function step() {
        if (currentIndex >= path.length) {

            enemy.Position = path[path.length - 1];
            return;
        }

        let currentPos = path[currentIndex];
        let nextPos = (currentIndex + 1 < path.length) ? path[currentIndex + 1] : currentPos;

        // 移動敵人
        let enemyElement = document.getElementById(currentPos);

        enemyElement.classList.remove('enemy' + index);


        enemyElement = document.getElementById(nextPos);
        if (enemyElement) {
            enemyElement.classList.add('enemy' + index);
        }

        currentIndex++;
        setTimeout(step, 120);
    }

    step();
}

// 敵人移動到目標位置
function moveEnemyToPosition(enemy, targetPosition, index) {
    const path = findPathenemy2(enemy.Position, targetPosition, Game.Map);
    animateEnemyMove(path, enemy, index);
    enemy.Position = targetPosition;
}

// 計算兩個位置之間的距離
function calculateDistance(pos1, pos2) {
    let x1 = Math.floor(pos1 / Game.Map.cols);
    let y1 = pos1 % Game.Map.cols;
    let x2 = Math.floor(pos2 / Game.Map.cols);
    let y2 = pos2 % Game.Map.cols;
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// 計算攻擊範圍
function calculateAttackRange(pos, attackRange) {
    let attackRangePos = [];
    let x = Math.floor(pos / Game.Map.cols);
    let y = pos % Game.Map.cols;
    for (let i = x - attackRange; i <= x + attackRange; i++) {
        for (let j = y - attackRange; j <= y + attackRange; j++) {
            if (i >= 0 && i < Game.Map.rows && j >= 0 && j < Game.Map.cols) {
                let distance = Math.abs(i - x) + Math.abs(j - y);
                if (distance <= attackRange) {
                    attackRangePos.push(i * Game.Map.cols + j);
                }
            }
        }
    }
    return attackRangePos;
}

// =========================================敵人攻擊玩家=========================================
function enemyAttack(enemy, player, index) {
    const playeratkrange = Player.AtkRange;
    const playerpos = player.Position;
    const enemypos = enemy.Position;
    const playeratk = player.Atk + player.Equipment.Weapon.AddAtk;
    const playerdef = player.Def + player.Equipment.Armor.AddDef + player.Equipment.Fitting.AdDef;
    const enemyatk = enemy.Atk;
    let aviodrate;
    aviodrate = player.AvoidRate + Math.floor(Math.random() * 85)
    if (calculateDistance(playerpos, enemypos) > playeratkrange) {
        //玩家無法反擊的情況
        if (aviodrate > 80) {
            console.log("玩家閃避成功，閃避：" + aviodrate);

            setTimeout(() => {
                CreateBattleEnemyAvoid(index)
            }, 500)

            setTimeout(() => {
                ClearBattleScreen()
            }, 3800)
            return;
        } else {
            console.log("玩家閃避失敗，閃避：" + aviodrate);

            setTimeout(() => {
                CreateEnemyBattlenotattack(index)
            }, 500)

            setTimeout(() => {
                let enemydamege = enemyatk - playerdef;
                enemydamege = enemydamege < 0 ? 1 : enemydamege;
                Player.CurHP -= enemydamege;
                player.CurHP = player.CurHP < 0 ? 0 : player.CurHP;
                document.documentElement.style.setProperty('--playerhp-w', `${Player.CurHP / Player.HP * 100}%`);
                Dom.PlayerHPBar.style.width = `${Player.CurHP / Player.HP * 100}%`;
                Dom.PlayerHPBar.textContent = `${Player.CurHP}/${Player.HP}`;


            }, 2500)

            setTimeout(() => {
                ClearBattleScreen()
                if (player.CurHP <= 0) {
                    ClearBattleScreen()
                    setTimeout(() => {
                        alert("你已經死亡了");
                        window.location.reload();
                    }, 1000)
                }
            }, 3500)
        }

    } else {
        //玩家可以反擊
        playerhasatk = true;
        if (index != 2) {
            if (aviodrate > 80) {
                console.log("玩家閃避成功，閃避：" + aviodrate);

                setTimeout(() => {
                    CreateEnemyBattleAtkAvoid(index)
                }, 500)

                setTimeout(() => {
                    //敵人被攻擊
                    enemy.CurHP -= playeratk - enemy.Def;
                    enemy.CurHP = enemy.CurHP < 0 ? 0 : enemy.CurHP;

                    document.documentElement.style.setProperty(`--enemyhpbar${index}-w`, `${(enemy.CurHP / enemy.HP) * 100}%`);
                    document.getElementById(`enemyhpbar${index}`).style.width = `${(enemy.CurHP / enemy.HP) * 100}%`;
                    document.getElementById(`enemyhpbar${index}`).textContent = `${enemy.CurHP}/${enemy.HP}`;
                    if (enemy.CurHP <= 0) {
                        haskillenemy = true;
                        Game.MyMoney += enemy.RewardMoney;
                        ClearBattleScreen()
                        document.getElementById(enemy.Position).classList.remove(`enemy${index}`);
                        enemy.Position = -1;
                    }
                    if (Enemys.every(enemy => enemy.CurHP <= 0)) {
                        ClearBattleScreen()
                        setTimeout(() => {
                            Game.Level++;
                            setTimeout(() => {
                                main()
                            }, 1000)
                        }, 1000)
                    }
                }, 4500)

                setTimeout(() => {
                    ClearBattleScreen()
                }, 5500)

            } else {
                console.log("玩家閃避失敗，閃避：" + aviodrate);

                setTimeout(() => {
                    CreateEnemyBattleAtk(index)
                }, 500)

                setTimeout(() => {
                    let enemydamege = enemyatk - playerdef;
                    enemydamege = enemydamege < 0 ? 1 : enemydamege;
                    Player.CurHP -= enemydamege;
                    player.CurHP = player.CurHP < 0 ? 0 : player.CurHP;
                    document.documentElement.style.setProperty('--playerhp-w', `${Player.CurHP / Player.HP * 100}%`);
                    Dom.PlayerHPBar.style.width = `${Player.CurHP / Player.HP * 100}%`;
                    Dom.PlayerHPBar.textContent = `${Player.CurHP}/${Player.HP}`;
                }, 2500)

                setTimeout(() => {
                    if (player.CurHP <= 0) {
                        player.Atk = 0;
                        ClearBattleScreen()
                        setTimeout(() => {
                            alert("你已經死亡了");
                            window.location.reload();
                        }, 1000)
                    }
                }, 4000)

                setTimeout(() => {
                    //敵人受到玩家攻擊
                    enemy.CurHP -= playeratk - enemy.Def;
                    enemy.CurHP = enemy.CurHP < 0 ? 0 : enemy.CurHP;
                    console.log("敵人" + index + "受到玩家攻擊：" + (playeratk - enemy.Def));
                    document.documentElement.style.setProperty(`--enemyhpbar${index}-w`, `${(enemy.CurHP / enemy.HP) * 100}%`);
                    document.getElementById(`enemyhpbar${index}`).style.width = `${(enemy.CurHP / enemy.HP) * 100}%`;
                    document.getElementById(`enemyhpbar${index}`).textContent = `${enemy.CurHP}/${enemy.HP}`;
                    if (enemy.CurHP <= 0) {
                        haskillenemy = true;
                        Game.MyMoney += enemy.RewardMoney;
                        ClearBattleScreen()
                        document.getElementById(enemy.Position).classList.remove(`enemy${index}`);
                        enemy.Position = -1;
                    }
                    if (Enemys.every(enemy => enemy.CurHP <= 0)) {
                        ClearBattleScreen()
                        setTimeout(() => {
                            Game.Level++;
                            Game.PlayerCurAction = "無操作";
                            Game.TurnRole = "Player";
                            setTimeout(() => {
                                main()
                            }, 1000)
                        }, 1000)
                    }
                }, 4500)

                setTimeout(() => {
                    ClearBattleScreen()
                }, 5500)
            }

        } else {
            playerhasatk = true;
            setTimeout(() => {
                CreateEnemyBattleAtk(index)
            }, 500)

            let enemydamege = enemyatk - playerdef;
            enemydamege = enemydamege < 0 ? 1 : enemydamege;
            setTimeout(() => {
                Player.CurHP -= Math.floor(enemydamege / 10)
                Player.CurHP = Player.CurHP < 0 ? 0 : Player.CurHP;
                document.documentElement.style.setProperty('--playerhp-w', `${Player.CurHP / Player.HP * 100}%`);
                Dom.PlayerHPBar.style.width = `${Player.CurHP / Player.HP * 100}%`;
                Dom.PlayerHPBar.textContent = `${Player.CurHP}/${Player.HP}`;

            }, 900);

            setTimeout(() => {
                Player.CurHP -= Math.floor(enemydamege / 10)
                Player.CurHP = Player.CurHP < 0 ? 0 : Player.CurHP;
                document.documentElement.style.setProperty('--playerhp-w', `${Player.CurHP / Player.HP * 100}%`);
                Dom.PlayerHPBar.style.width = `${Player.CurHP / Player.HP * 100}%`;
                Dom.PlayerHPBar.textContent = `${Player.CurHP}/${Player.HP}`;
            }, 1100);

            setTimeout(() => {
                Player.CurHP -= Math.floor(enemydamege / 27)
                Player.CurHP = Player.CurHP < 0 ? 0 : Player.CurHP;
                document.documentElement.style.setProperty('--playerhp-w', `${Player.CurHP / Player.HP * 100}%`);
                Dom.PlayerHPBar.style.width = `${Player.CurHP / Player.HP * 100}%`;
                Dom.PlayerHPBar.textContent = `${Player.CurHP}/${Player.HP}`;

            }, 1200);

            setTimeout(() => {
                Player.CurHP -= Math.floor(enemydamege / 27)
                Player.CurHP = Player.CurHP < 0 ? 0 : Player.CurHP;
                document.documentElement.style.setProperty('--playerhp-w', `${Player.CurHP / Player.HP * 100}%`);
                Dom.PlayerHPBar.style.width = `${Player.CurHP / Player.HP * 100}%`;
                Dom.PlayerHPBar.textContent = `${Player.CurHP}/${Player.HP}`;

            }, 1300);

            setTimeout(() => {
                Player.CurHP -= Math.floor(enemydamege / 27)
                Player.CurHP = Player.CurHP < 0 ? 0 : Player.CurHP;
                document.documentElement.style.setProperty('--playerhp-w', `${Player.CurHP / Player.HP * 100}%`);
                Dom.PlayerHPBar.style.width = `${Player.CurHP / Player.HP * 100}%`;
                Dom.PlayerHPBar.textContent = `${Player.CurHP}/${Player.HP}`;

            }, 1400);
            setTimeout(() => {
                Player.CurHP -= Math.floor(enemydamege / 27)
                Player.CurHP = Player.CurHP < 0 ? 0 : Player.CurHP;
                document.documentElement.style.setProperty('--playerhp-w', `${Player.CurHP / Player.HP * 100}%`);
                Dom.PlayerHPBar.style.width = `${Player.CurHP / Player.HP * 100}%`;
                Dom.PlayerHPBar.textContent = `${Player.CurHP}/${Player.HP}`;

            }, 1500);

            setTimeout(() => {
                Player.CurHP -= Math.floor(enemydamege / 1.5)
                Player.CurHP = Player.CurHP < 0 ? 0 : Player.CurHP;
                document.documentElement.style.setProperty('--playerhp-w', `${Player.CurHP / Player.HP * 100}%`);
                Dom.PlayerHPBar.style.width = `${Player.CurHP / Player.HP * 100}%`;
                Dom.PlayerHPBar.textContent = `${Player.CurHP}/${Player.HP}`;

            }, 2300);

            setTimeout(() => {
                if (player.CurHP <= 0) {
                    ClearBattleScreen()
                    player.Atk = 0;
                    setTimeout(() => {
                        alert("你已經死亡了");
                        window.location.reload();
                    }, 1000)
                    clearTimeout()
                }
            }, 3500)

            setTimeout(() => {

                //敵人受到玩家攻擊
                enemy.CurHP -= playeratk - enemy.Def;
                enemy.CurHP = enemy.CurHP < 0 ? 0 : enemy.CurHP;
                console.log("敵人" + index + "受到玩家攻擊：" + (playeratk - enemy.Def));
                document.documentElement.style.setProperty(`--enemyhpbar${index}-w`, `${(enemy.CurHP / enemy.HP) * 100}%`);
                document.getElementById(`enemyhpbar${index}`).style.width = `${(enemy.CurHP / enemy.HP) * 100}%`;
                document.getElementById(`enemyhpbar${index}`).textContent = `${enemy.CurHP}/${enemy.HP}`;
                if (enemy.CurHP <= 0) {
                    haskillenemy = true;
                    Game.MyMoney += enemy.RewardMoney;
                    setTimeout(() => {
                        ClearBattleScreen()
                        document.getElementById(enemy.Position).classList.remove(`enemy${index}`);
                        enemy.Position = -1;
                    })
                }
                if (Enemys.every(enemy => enemy.CurHP <= 0)) {
                    ClearBattleScreen()
                    setTimeout(() => {
                        Game.Level++;
                        Game.PlayerCurAction = "無操作";
                        Game.TurnRole = "Player";
                        setTimeout(() => {
                            main()
                        }, 1000)
                    }, 1000)
                }
            }, 4500)

            setTimeout(() => {
                ClearBattleScreen()
            }, 5500)



        }

    }
}

function BossAttackSkill(enemy, player, index) {
    const playerpos = player.Position;
    const enemypos = enemy.Position;
    const playeratk = player.Atk + player.Equipment.Weapon.AddAtk;
    const playerdef = player.Def + player.Equipment.Armor.AddDef + player.Equipment.Fitting.AdDef;
    const enemyatk = enemy.Atk * enemy.Skills.AddAtk;

    setTimeout(() => {
        CreateBossSkill(index)
        Dom.ShowSkillname.showModal()
        Dom.ShowSkillname.innerHTML = ` <div id="showskillnamecontainer">
                                        ${enemy.Skills.Name}
                                        </div>
                                    `
        setTimeout(() => {
            Dom.ShowSkillname.close()
            Dom.ShowSkillname.innerHTML = ""
        }, 2600)
    }, 500)
    let enemydamege = enemyatk;
    enemydamege = enemydamege < 0 ? 1 : enemydamege;

    setTimeout(() => {
        Player.CurHP -= Math.floor(enemydamege / 4)
        Player.CurHP = Player.CurHP < 0 ? 0 : Player.CurHP;
        document.documentElement.style.setProperty('--playerhp-w', `${Player.CurHP / Player.HP * 100}%`);
        Dom.PlayerHPBar.style.width = `${Player.CurHP / Player.HP * 100}%`;
        Dom.PlayerHPBar.textContent = `${Player.CurHP}/${Player.HP}`;
    }, 2200)

    setTimeout(() => {
        Player.CurHP -= Math.floor(enemydamege / 4) * 3
        Player.CurHP = Player.CurHP < 0 ? 0 : Player.CurHP;
        document.documentElement.style.setProperty('--playerhp-w', `${Player.CurHP / Player.HP * 100}%`);
        Dom.PlayerHPBar.style.width = `${Player.CurHP / Player.HP * 100}%`;
        Dom.PlayerHPBar.textContent = `${Player.CurHP}/${Player.HP}`;
        if (player.CurHP <= 0) {
            ClearBattleScreen()
            player.Atk = 0;
            setTimeout(() => {
                alert("你已經死亡了");
                window.location.reload();
            }, 1000)
            clearTimeout()
        }
    }, 3100)

    setTimeout(() => {
        ClearBattleScreen()
    }, 4500)
}

function BossAttacks(enemy, player, index) {
    const playerpos = player.Position;
    const enemypos = enemy.Position;
    const playeratk = player.Atk + player.Equipment.Weapon.AddAtk;
    const playerdef = player.Def + player.Equipment.Armor.AddDef + player.Equipment.Fitting.AdDef;
    const enemyatk = enemy.Atk;
    playerhasatk = true;
    setTimeout(() => {
        CreateEnemyBattleAtk(index)
    }, 500)

    let enemydamege = enemyatk - playerdef;
    enemydamege = enemydamege < 0 ? 1 : enemydamege;
    let bossrecover = Math.floor(enemydamege / 4);

    setTimeout(() => {
        Player.CurHP -= Math.floor(enemydamege / 4)
        Player.CurHP = Player.CurHP < 0 ? 0 : Player.CurHP;
        document.documentElement.style.setProperty('--playerhp-w', `${Player.CurHP / Player.HP * 100}%`);
        Dom.PlayerHPBar.style.width = `${Player.CurHP / Player.HP * 100}%`;
        Dom.PlayerHPBar.textContent = `${Player.CurHP}/${Player.HP}`;
    }, 1500)

    setTimeout(() => {
        Player.CurHP -= Math.floor(enemydamege / 4) * 3
        Player.CurHP = Player.CurHP < 0 ? 0 : Player.CurHP;
        document.documentElement.style.setProperty('--playerhp-w', `${Player.CurHP / Player.HP * 100}%`);
        Dom.PlayerHPBar.style.width = `${Player.CurHP / Player.HP * 100}%`;
        Dom.PlayerHPBar.textContent = `${Player.CurHP}/${Player.HP}`;

        enemy.CurHP += bossrecover;
        enemy.CurHP = enemy.CurHP > enemy.HP ? enemy.HP : enemy.CurHP;
        document.documentElement.style.setProperty(`--enemyhpbar${index}-w`, `${(enemy.CurHP / enemy.HP) * 100}%`);
        document.getElementById(`enemyhpbar${index}`).style.width = `${(enemy.CurHP / enemy.HP) * 100}%`;
        document.getElementById(`enemyhpbar${index}`).textContent = `${enemy.CurHP}/${enemy.HP}`;

        if (player.CurHP <= 0) {
            ClearBattleScreen()
            player.Atk = 0;
            setTimeout(() => {
                alert("你已經死亡了");
                window.location.reload();
            }, 1000)
            clearTimeout()
        }
    }, 2300)

    setTimeout(() => {
        //敵人受到玩家攻擊
        enemy.CurHP -= playeratk - enemy.Def;
        enemy.CurHP = enemy.CurHP < 0 ? 0 : enemy.CurHP;

        document.documentElement.style.setProperty(`--enemyhpbar${index}-w`, `${(enemy.CurHP / enemy.HP) * 100}%`);
        document.getElementById(`enemyhpbar${index}`).style.width = `${(enemy.CurHP / enemy.HP) * 100}%`;
        document.getElementById(`enemyhpbar${index}`).textContent = `${enemy.CurHP}/${enemy.HP}`;
        if (enemy.CurHP <= 0) {
            haskillenemy = true;
            Game.MyMoney += enemy.RewardMoney;
            ClearBattleScreen()
            document.getElementById(enemy.Position).classList.remove(`enemy${index}`);
            enemy.Position = -1;
        }
        if (Enemys.every(enemy => enemy.CurHP <= 0)) {
            ClearBattleScreen()
            setTimeout(() => {
                Game.Level++;
                setTimeout(() => {
                    main()
                }, 1000)
            }, 1000)
        }
    }, 4500)

    setTimeout(() => {
        ClearBattleScreen()
    }, 5500)
}   
