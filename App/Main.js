let currentAudio = null;
var isloadgame = false;
main();

//到達第二關時enemys恢復到預設而重設所有數值
function resetall() {
    if (isloadgame === false) {
        Player.CurHP = Player.HP;
        Player.CurMP = Player.MP + Player.Equipment.Fitting.AddMP;
        Enemys = Game.Level == 0 ? enemyarr0 : enemyarr1;
        Obstaclessetting = Game.Level === 0 ? Obstacles0 : Obstacles1;
        Game.Obstacles = Obstaclessetting;
        Player.OldPosition = 82;
        Player.Position = 82;
        Game.Treasures = Game.Level === 0 ? treasure0 : treasure1;
        Game.Turn = 1;
    }
    Player.Move = 3;
    Dom.GameMap.innerHTML = "";
    Dom.EnemyStatusBar.innerHTML = "";
    Dom.PlayerInfo.innerHTML = "";
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
}

// 添加滑鼠拖動功能
let isDragging = false;
let startX, startY, scrollLeft, scrollTop;
let debounceTimeout;

Dom.GameMap.addEventListener('mousedown', (e) => {
    isDragging = true;
    Dom.GameMap.style.scrollBehavior = 'auto';
    startX = e.pageX - Dom.GameMap.offsetLeft;
    startY = e.pageY - Dom.GameMap.offsetTop;
    scrollLeft = Dom.GameMap.scrollLeft;
    scrollTop = Dom.GameMap.scrollTop;
});

Dom.GameMap.addEventListener('mouseleave', () => {
    isDragging = false;
    Dom.GameMap.style.scrollBehavior = 'smooth';
    clearTimeout(debounceTimeout);
});

Dom.GameMap.addEventListener('mouseup', () => {
    isDragging = false;
    Dom.GameMap.style.scrollBehavior = 'smooth';
    clearTimeout(debounceTimeout);
});

Dom.GameMap.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - Dom.GameMap.offsetLeft;
    const y = e.pageY - Dom.GameMap.offsetTop;
    const walkX = (x - startX);
    const walkY = (y - startY);

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        Dom.GameMap.scrollLeft = scrollLeft - walkX;
        Dom.GameMap.scrollTop = scrollTop - walkY;

    }, 10); // 防抖延遲時間，根據需要調整
});
// 禁用滑鼠滾輪滾動
Dom.GameMap.addEventListener('wheel', (e) => {
    e.preventDefault();
}, { passive: false });

function main() {
    if (Game.Level === 0) {
        init()
        document.addEventListener('click', PlayMusic, { once: true });
        //尋找cookie是否有教學紀錄
        let mdata = document.cookie.match(/ReadTech/);
        if (!mdata) {
            //第一次進入遊戲顯示教學
            techshowfun()
        }

    } else {
        resetall()
        init()
        document.addEventListener('click', PlayMusic, { once: true });
        /*測試跳關時要註解掉*/
        document.getElementById(Player.Position).addEventListener('click', playerclick);
        setTimeout(() => {
            document.getElementById('showdialogarea').innerHTML += `
                                    <dialog id="showyouinlevel">
                                         <div id="showyouinlevel-container">
                                             <div id="showyouinlevel-tit"><img src="./Public/medal.png" width="100px">恭喜您來到第二關</div>
                                             <div id="closebtn-showyouinlevel">關閉</div>
                                         </div>
                                    </dialog>
                                    `;
            document.getElementById('showyouinlevel').showModal();
            document.getElementById('closebtn-showyouinlevel').onclick = () => {
                document.getElementById('showyouinlevel').close();
                document.getElementById('showdialogarea').innerHTML = ""
            }
        }, 100)

    }
}

function PlayMusic() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    let audio = new Audio();
    audio.src = `./Public/bgm${Game.Level}.mp3`;
    audio.volume = 1;
    audio.loop = true;
    audio.play();

    currentAudio = audio;
    Dom.SoundEffectVolumeBar.style.width = audio.volume * 100 + '%';
    Dom.SoundEffectVolumeBar.textContent = Math.round(audio.volume * 100) + '%';
    Dom.BgmVolumeBar.addEventListener('click', (e) => {
        let volume = e.offsetX / e.target.offsetWidth;
        audio.volume = volume;
        Dom.SoundEffectVolumeBar.style.width = volume * 100 + '%';
        Dom.SoundEffectVolumeBar.textContent = Math.round(volume * 100) + '%';
    });

    document.getElementById('switchbgmmute').onclick = () => {
        if (audio.muted == false) {
            document.getElementById('switchbgmmute').style.backgroundImage = "url(./Public/mute.png)";
            audio.muted = true;
        } else {
            document.getElementById('switchbgmmute').style.backgroundImage = "url(./Public/music.png)";
            audio.muted = false;
        }
    };
}

function init() {
    Dom.EnemyStatusBar.innerHTML = "";
    //初始化地圖
    for (let i = 0; i < Game.Map.rows; i++) {
        for (let j = 0; j < Game.Map.cols; j++) {
            let cell = document.createElement('div');
            cell.id = (i * Game.Map.cols + j);
            Dom.GameMap.appendChild(cell);
            cell.classList.add('cell');
            //cell.textContent = i * Game.Map.cols + j;
        }
    }
    Dom.GameMap.style.backgroundImage = `url(./Public/bg${Game.Level}.png)`;
    Dom.GameMap.style.filter = Game.Level == 0 ? "brightness(1.5)" : "brightness(1.01)";


    //初始化玩家位置
    document.getElementById(Player.Position).classList.add('player');

    //初始化敵人位置
    Enemys.forEach((enemy, index) => {
        if (enemy.CurHP > 0) {
            document.getElementById(enemy.Position).classList.add('enemy' + index);

            let enemyimgsrc;
            enemyimgsrc = `./Public/${Game.Level}/enemy${index}.gif`;
            let stylesetting = `.enemy${index} {
                background-image: url(${enemyimgsrc});
                }
            `
            let style = document.createElement('style');
            style.innerHTML = stylesetting;
            document.head.appendChild(style);
        }
    })

    //初始化寶箱位置
    Game.Treasures.forEach(treasure => {
        document.getElementById(treasure).classList.add('treasure');
    })

    //初始化障礙物
    Game.Obstacles.forEach(obstacle => {
        document.getElementById(obstacle).classList.add('obstacle');
        document.querySelectorAll('.obstacle').forEach(cell => {
            cell.style.backgroundImage = `url(./Public/obstacle${Game.Level}.png)`;
        })
    })

    //初始化玩家血量
    Dom.PlayerHPBar.style.width = (Player.CurHP / Player.HP) * 100 + '%';
    Dom.PlayerHPBar.textContent = Player.CurHP + '/' + Player.HP;

    //初始化玩家魔力
    Dom.PlayerMPBar.style.width = ((Player.CurMP) / (Player.MP + Player.Equipment.Fitting.AddMP)) * 100 + '%';
    Dom.PlayerMPBar.textContent = (Player.CurMP) + '/' + (Player.MP + Player.Equipment.Fitting.AddMP);

    Dom.PlayerEXPBar.style.width = (Player.EXP / Player.MaxEXP) * 100 + '%';
    Dom.PlayerEXPBar.textContent = 'EXP：' + Player.EXP + '/' + Player.MaxEXP;

    //初始化玩家資訊
    Dom.PlayerInfo.innerHTML = `
                        <p style="display: flex; align-items: center;"><img src="./Public/user.png" width="25px" />等級：
                           ${Player.Level}</p>
                        <p style="display: flex; align-items: center;"><img src="./Public/sword.png" width="25px" />攻擊力：
                           ${Player.Atk + Player.Equipment.Weapon.AddAtk - 20}+</p>
                        <p style="display: flex; align-items: center;"><img src="./Public/defence.png"
                                width="25px" />防禦力： ${Player.Def + Player.Equipment.Armor.AddDef + Player.Equipment.Fitting.AdDef}</p>
                        <p style="display: flex; align-items: center;"><img src="./Public/running.png"
                                width="25px" />移動力： ${Player.Move}</p>
                        <p style="display: flex; align-items: center;"><img src="./Public/lightning.png"
                                width="25px" />閃避： ${Player.AvoidRate}% </p>
    `

    // 初始化敵人狀態欄
    Enemys.forEach((enemy, index) => {
        Dom.EnemyStatusBar.innerHTML += `
                        <div class="EnemyStatus">
                            <img src="./Public/${Game.Level}/enemy${index}.gif" width="65px">
                            <div class="enemyName">${enemy.Name}</div>
                            <div class="enemyHP" id="enemyHP${index}">
                                <div class="enemyhpbar">
                                    <div class="enemy-innerhpbar" id="enemyhpbar${index}">
                                    ${enemy.CurHP}/${enemy.HP}</div>
                                </div>
                            </div>
                        </div>
                        <div class="EnemyInfo">
                            <p style="display: flex; align-items: center;"><img src="./Public/sword.png"
                                    width="25px" />攻擊力：
                                ${enemy.Atk}+</p>
                            <p style="display: flex; align-items: center;"><img src="./Public/defence.png"
                                    width="25px" />防禦力： ${enemy.Def}</p>
                            <p style="display: flex; align-items: center;"><img src="./Public/running.png"
                                    width="25px" />移動力： ${enemy.Move}</p>
                        </div>
       `
        //渲染敵人血量
        document.getElementById(`enemyhpbar${index}`).style.width = (enemy.CurHP / enemy.HP) * 100 + '%';
        document.getElementById(`enemyhpbar${index}`).textContent = enemy.CurHP + '/' + enemy.HP;

    })
    CurCameraPosition = Player.Position;
    MoveCamera(CurCameraPosition);
    Game.PlayerCurAction = "無操作";
    Game.TurnRole = "Player";
    showTurnLetter()
}

function MoveCamera(position) {
    const cellSize = 90; // 每個單元格的大小
    const mapSize = Game.Map.cols; // 地圖大小為10x10
    const mapElement = Dom.GameMap; // 地圖DOM元素

    // 計算位置的行和列
    const row = Math.floor(position / mapSize);
    const col = position % mapSize;

    // 計算攝像機的中心位置
    const cameraCenterRow = Math.max(0, Math.min(row - 4.5, mapSize - 1));
    const cameraCenterCol = Math.max(0, Math.min(col - 4.5, mapSize - 1));

    // 計算滾動偏移量
    const scrollTop = cameraCenterRow * cellSize;
    const scrollLeft = cameraCenterCol * cellSize;

    // 將滾動應用到地圖上
    mapElement.scrollTo(scrollLeft, scrollTop);
}





function showTurnLetter() {
    if (Game.TurnRole == "Player") {
        Dom.ShowTurnLetter.style.backgroundColor = "rgb(250, 250, 112)"
        Dom.ShowTurnLetter.style.setProperty('--showturn-letter', '"' + "陽之陣 其" + switchchinese(Game.Turn) + '"" ');
    } else {
        Dom.ShowTurnLetter.style.backgroundColor = "rgb(250, 112, 112)"
        Dom.ShowTurnLetter.style.setProperty('--showturn-letter', '"' + "陰之陣 其" + switchchinese(Game.Turn) + '"" ');
    }
    Dom.ShowTurnLetter.style.zIndex = 100;
    Dom.ShowTurnLetter.style.animation = "showturn 1s ease-in-out forwards";
    setTimeout(() => {
        Dom.ShowTurnLetter.style.zIndex = "-1";
        Dom.ShowTurnLetter.style.animation = "none";
    }, 1200)
}

//結束回合按鈕
Dom.EndTurnBtn.onclick = () => {
    if (Game.TurnRole == "Player") {
        if (Game.PlayerCurAction != "移動中" && Game.PlayerCurAction != "已選擇攻擊目標") {
            showEndTurnMsg();
            Dom.OKbtn.onclick = () => {
                Game.TurnRole = "Enemy";
                Dom.DialogForEndTurn.close();
                EndTurnProcess();
            }
        } else {
            alert("移動中與戰鬥中無法結束回合")
            ShowDebugInfo()
        }
    } else {
        alert("當前為敵人行動，請等待敵人行動完畢再結束回合")
        ShowDebugInfo()
    }
}

//處理結束回合功能
function EndTurnProcess() {
    let isgettreasure = false;
    //清除玩家的移動範圍
    document.querySelectorAll('.playercanmove').forEach(cell => {
        cell.classList.remove('playercanmove');
        cell.onclick = null;
    })
    //清除玩家的攻擊範圍
    document.querySelectorAll('.playercanattack').forEach(cell => {
        cell.classList.remove('playercanattack');
        cell.onclick = null;
    })
    Game.Treasures.forEach(treasure => {
        if (Player.Position == treasure) {
            GetTreasure(Player.Position);
            setTimeout(() => {
                showTurnLetter()
                Game.PlayerCurAction = "無操作";
                document.getElementById(Player.Position).removeEventListener('click', playerclick);
                //將舊的位置監聽點擊事件移除從記憶體中移除
                document.getElementById(Player.OldPosition).removeEventListener('click', playerclick);
                Player.OldPosition = Player.Position;
                //更新Player.Position的點擊事件
                document.getElementById(Player.Position).removeEventListener('click', playerclick);
                setTimeout(() => {
                    EnemysAction()
                }, 2000);
            }, 2500)
            isgettreasure = true;
            return;
        }
    })
    if (isgettreasure === false) {
        showTurnLetter()
        Game.PlayerCurAction = "無操作";
        document.getElementById(Player.Position).removeEventListener('click', playerclick);
        //將舊的位置監聽點擊事件移除從記憶體中移除
        document.getElementById(Player.OldPosition).removeEventListener('click', playerclick);
        Player.OldPosition = Player.Position;
        //更新Player.Position的點擊事件
        document.getElementById(Player.Position).removeEventListener('click', playerclick);
        setTimeout(() => {
            EnemysAction()
        }, 2000);
        return;
    }
}

//攻擊按鈕
Dom.AttackBtn.onclick = () => {
    if (Game.TurnRole == "Player") {
        if (Game.PlayerCurAction != "移動中" && Game.PlayerCurAction != "已選擇攻擊目標") {
            if (Game.PlayerCurAction == "已選擇玩家角色" || Game.PlayerCurAction == "已選擇移動位置") {
                if (CheckCanAttack(Player.AtkRange, Player.Position, Enemys.map(enemy => enemy.Position))) {
                    Game.PlayerCurAction = "已按下攻擊按鈕";
                    ShowDebugInfo()
                    document.querySelectorAll('.playercanmove').forEach(cell => {
                        cell.classList.remove('playercanmove');
                        cell.onclick = null;
                    })
                    PlayerDrawAttackRange();
                } else {
                    alert("無法攻擊到敵人，請選擇其他角色或移動位置")
                    ShowDebugInfo()
                }
            } else {
                alert("請選擇玩家角色後再按下攻擊按鈕")
                ShowDebugInfo()
            }
        } else {
            alert("移動中或戰鬥中無法攻擊")
            ShowDebugInfo()
        }
    } else {
        alert("現在為敵人行動回合，請等待敵人行動完畢再選擇角色")
        ShowDebugInfo()
    }
}

//確認自己的攻擊範圍是否有敵人且敵人血量大於0
function CheckCanAttack(myAtkRange, myPos, AllEnemysPos) {
    let canAttack = false;
    AllEnemysPos.forEach(enemyPos => {
        if (ManhattanDistance(myPos, enemyPos) <= myAtkRange && Enemys.some(enemy => enemy.Position == enemyPos && enemy.CurHP > 0)) {
            canAttack = true;
        }
    })
    return canAttack;
}

//用來於所有敵人確認自己的攻擊範圍內是否有玩家
function CheckCanAttackPlayer(Enemys, PlayerPos) {
    let canAttack = false;

    Enemys.forEach(enemy => {
        if (ManhattanDistance(enemy.Position, PlayerPos) <= enemy.AtkRange) {
            canAttack = true;
        }
    })
    return canAttack
}

//移除玩家的移動範圍以及此點擊格子的事件
function PlayerCancelDrawMoveRange() {
    //玩家位置還原
    document.getElementById(Player.Position).classList.remove('player');

    Player.Position = Player.OldPosition;
    CurCameraPosition = Player.Position;
    MoveCamera(CurCameraPosition);
    document.getElementById(Player.Position).classList.add('player');

    //清除玩家的移動範圍
    document.querySelectorAll('.playercanmove').forEach(cell => {
        cell.classList.remove('playercanmove');
        cell.onclick = null;
    })
}

//取消按鈕
Dom.CancelBtn.onclick = () => {
    if (Game.TurnRole == "Player") {
        if (Game.PlayerCurAction != "移動中") {
            if (Game.PlayerCurAction == "已選擇玩家角色") {
                Game.PlayerCurAction = "無操作";
                ShowDebugInfo()
                PlayerCancelDrawMoveRange();
            } else if (Game.PlayerCurAction == "已選擇移動位置") {
                Game.PlayerCurAction = "無操作";
                ShowDebugInfo()
                PlayerCancelDrawMoveRange();
            } else if (Game.PlayerCurAction == "已按下攻擊按鈕") {
                Game.PlayerCurAction = "無操作";
                ShowDebugInfo()
                PlayerCancelDrawMoveRange();
                document.querySelectorAll('.playercanattack').forEach(cell => {
                    cell.classList.remove('playercanattack');
                    cell.onclick = null;
                })
            } else if (Game.PlayerCurAction == "已選擇攻擊目標") {
                ShowDebugInfo()
                alert("已選擇攻擊目標無法取消")
            }
        } else {
            ShowDebugInfo()
            alert("移動中無法取消")
        }

    } else {
        alert("現在為敵人行動回合，請等待敵人行動完畢再選擇角色")
        ShowDebugInfo()
    }
}

//法術按鈕
Dom.SkillBtn.onclick = () => {
    if (Game.TurnRole == "Player") {
        if (Game.PlayerCurAction != "移動中" && Game.PlayerCurAction != "已選擇攻擊目標") {
            if (Game.PlayerCurAction == "已選擇玩家角色" || Game.PlayerCurAction == "已選擇移動位置") {
                ShowSkill();
            } else if (Game.PlayerCurAction == "已按下攻擊按鈕") {
                alert("已按下攻擊按鈕無法使用法術，若要使用法術請按下取消按鈕後再按下法術按鈕")
                ShowDebugInfo()
            } else {
                alert("請選擇玩家角色後再按下法術按鈕")
                ShowDebugInfo()
            }
        } else {
            alert("移動中或戰鬥中無法使用法術")
            ShowDebugInfo()
        }
    } else {
        alert("現在為敵人行動回合，請等待敵人行動完畢再選擇角色")
        ShowDebugInfo()
    }
}

//抽寶箱(還要待修改)
function GetTreasure(playerpos) {
    let treasure;
    if (playerpos === Game.Treasures[1]) {
        treasure = EquipmentItsms[Math.floor(Math.random() * EquipmentItsms.length)][Math.floor(Math.min(Math.random() * EquipmentItsms[0].length, 1))];
        if (treasure) {
            showyouwhatget(treasure["Name"])
            Player.Bag[treasure["TypecorItem"]].push(treasure);
            Game.Treasures.forEach((treasure, index) => {
                if (treasure == Player.Position) {
                    Game.Treasures.splice(index, 1);
                }
            })
            document.getElementById(Player.Position).classList.remove('treasure');
        } else {
            showyouwhatget("寶箱裡沒有東西")
            Game.Treasures.forEach((treasure, index) => {
                if (treasure == Player.Position) {
                    Game.Treasures.splice(index, 1);
                }
            })
            document.getElementById(Player.Position).classList.remove('treasure');
        }
    } else {
        treasure = EquipmentItsms[Math.floor(Math.random() * EquipmentItsms.length)][Math.floor(Math.max(Math.random() * EquipmentItsms[0].length, 2))];
        if (treasure) {
            showyouwhatget(treasure["Name"])
            Player.Bag[treasure["TypecorItem"]].push(treasure);
            Game.Treasures.forEach((treasure, index) => {
                if (treasure == Player.Position) {
                    Game.Treasures.splice(index, 1);
                }
            })
            document.getElementById(Player.Position).classList.remove('treasure');
        } else {
            showyouwhatget("寶箱裡沒有東西")
            Game.Treasures.forEach((treasure, index) => {
                if (treasure == Player.Position) {
                    Game.Treasures.splice(index, 1);
                }
            })
            document.getElementById(Player.Position).classList.remove('treasure');
        }
    }
}




// =========================================創建戰鬥畫面============================================

//清除任意的戰鬥畫面
function ClearBattleScreen() {
    Dom.BattleScreen.style.display = "none";
    Dom.GameMap.style.display = "grid";
    Dom.AttackBtn.style.display = "block";
    Dom.EndTurnBtn.style.display = "block";
    Dom.CancelBtn.style.display = "block";
    Dom.BattleScreen.innerHTML = "";
}

//玩家->敵人的戰鬥畫面
function CreateBattleScreen(index) {
    Dom.BattleScreen.style.display = "block";
    Dom.GameMap.style.display = "none";
    Dom.BattleScreen.style.width = "700px";//850
    Dom.BattleScreen.style.height = "500px";
    Dom.BattleScreen.style.backgroundColor = "black";
    Dom.BattleScreen.style.overflow = "hidden";
    Dom.BattleScreen.style.border = "3px solid black";
    const battlemovie = document.createElement('video');
    battlemovie.src = `./BattleScreen/${Game.Level}/PlayerAccessBattle${index}.mp4`;
    battlemovie.width = "700";
    battlemovie.height = "500";
    battlemovie.style.transform = "scale(1.05)";
    battlemovie.autoplay = true;
    battlemovie.controls = false;
    Dom.BattleScreen.appendChild(battlemovie);
}

/*====================================敵人先攻的戰鬥畫面創建======================================= */

//敵人的攻擊被閃避的戰鬥畫面且不反擊
function CreateBattleEnemyAvoid(index) {
    Dom.BattleScreen.style.display = "block";
    Dom.GameMap.style.display = "none";
    Dom.BattleScreen.style.width = "700px";
    Dom.BattleScreen.style.height = "500px";
    Dom.BattleScreen.style.backgroundColor = "black";
    Dom.BattleScreen.style.overflow = "hidden";
    Dom.BattleScreen.style.border = "3px solid black";
    const battlemovie = document.createElement('video');
    battlemovie.src = `./BattleScreen/${Game.Level}/EnemyBattleAvoid&notattack${index}.mp4`;
    battlemovie.width = "700";
    battlemovie.height = "500";
    battlemovie.style.transform = "scale(1.1)";
    battlemovie.autoplay = true;
    battlemovie.controls = false;
    Dom.BattleScreen.appendChild(battlemovie);
}

//敵人攻擊未閃避的戰鬥畫面且不反擊
function CreateEnemyBattlenotattack(index) {
    Dom.BattleScreen.style.display = "block";
    Dom.GameMap.style.display = "none";
    Dom.BattleScreen.style.width = "650px";
    Dom.BattleScreen.style.height = "500px";
    Dom.BattleScreen.style.backgroundColor = "black";
    Dom.BattleScreen.style.overflow = "hidden";
    Dom.BattleScreen.style.border = "3px solid black";
    const battlemovie = document.createElement('video');
    battlemovie.src = `./BattleScreen/${Game.Level}/EnemyBattleAvoid&atattack${index}.mp4`;
    battlemovie.width = "650";
    battlemovie.height = "500";
    battlemovie.style.transform = "scale(1.3)";
    battlemovie.autoplay = true;
    battlemovie.controls = false;
    Dom.BattleScreen.appendChild(battlemovie);
}

//敵人攻擊被閃避的戰鬥畫面且反擊
function CreateEnemyBattleAtkAvoid(index) {
    Dom.BattleScreen.style.display = "block";
    Dom.GameMap.style.display = "none";
    Dom.BattleScreen.style.width = "650px";
    Dom.BattleScreen.style.height = "500px";
    Dom.BattleScreen.style.backgroundColor = "black";
    Dom.BattleScreen.style.overflow = "hidden";
    Dom.BattleScreen.style.border = "3px solid black";
    const battlemovie = document.createElement('video');
    battlemovie.src = `./BattleScreen/${Game.Level}/EAA${index}.mp4`;
    battlemovie.width = "650";
    battlemovie.height = "500";
    battlemovie.style.transform = "scale(1.3)";
    battlemovie.autoplay = true;
    battlemovie.controls = false;
    Dom.BattleScreen.appendChild(battlemovie);
}

//敵人攻擊未被閃避的戰鬥畫面且反擊
function CreateEnemyBattleAtk(index) {
    Dom.BattleScreen.style.display = "block";
    Dom.GameMap.style.display = "none";
    Dom.BattleScreen.style.width = "700px";
    Dom.BattleScreen.style.height = "500px";
    Dom.BattleScreen.style.backgroundColor = "black";
    Dom.BattleScreen.style.overflow = "hidden";
    Dom.BattleScreen.style.border = "3px solid black";
    const battlemovie = document.createElement('video');
    battlemovie.src = `./BattleScreen/${Game.Level}/EA${index}.mp4`;
    battlemovie.width = "700";
    battlemovie.height = "500";
    battlemovie.style.transform = "scale(1.1)";
    battlemovie.autoplay = true;
    battlemovie.controls = false;
    Dom.BattleScreen.appendChild(battlemovie);
}

//boss使用絕技的戰鬥畫面
function CreateBossSkill(index) {
    Dom.BattleScreen.style.display = "block";
    Dom.GameMap.style.display = "none";
    Dom.BattleScreen.style.width = "700px";
    Dom.BattleScreen.style.height = "500px";
    Dom.BattleScreen.style.backgroundColor = "black";
    Dom.BattleScreen.style.overflow = "hidden";
    Dom.BattleScreen.style.border = "3px solid black";
    const battlemovie = document.createElement('video');
    battlemovie.src = `./BattleScreen/${Game.Level}/ESA${index}.mp4`;
    battlemovie.width = "700";
    battlemovie.height = "500";
    battlemovie.style.transform = "scale(1.1)";
    battlemovie.autoplay = true;
    battlemovie.controls = false;
    Dom.BattleScreen.appendChild(battlemovie);
}

