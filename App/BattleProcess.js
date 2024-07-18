function RenderPlayerInfo() {
    //初始化玩家血量
    Dom.PlayerHPBar.style.width = (Player.CurHP / Player.HP) * 100 + '%';
    Dom.PlayerHPBar.textContent = Player.CurHP + '/' + Player.HP;

    //初始化玩家魔力
    Dom.PlayerMPBar.style.width = ((Player.CurMP) / (Player.MP + Player.Equipment.Fitting.AddMP)) * 100 + '%';
    Dom.PlayerMPBar.textContent = (Player.CurMP) + '/' + (Player.MP + Player.Equipment.Fitting.AddMP);

    Dom.PlayerEXPBar.style.width = (Player.EXP / Player.MaxEXP) * 100 + '%';
    Dom.PlayerEXPBar.textContent = 'EXP：' + Player.EXP + '/' + Player.MaxEXP;
}
//渲染玩家血量
function updatePlayerHealthBar() {
    document.documentElement.style.setProperty('--playerhp-w', `${Player.CurHP / Player.HP * 100}%`);
    Dom.PlayerHPBar.style.width = `${Player.CurHP / Player.HP * 100}%`;
    Dom.PlayerHPBar.textContent = `${Player.CurHP}/${Player.HP}`;
}
//渲染玩家經驗
function updatePlayerEXPBar() {
    document.documentElement.style.setProperty('--playerexp-w', `${Player.EXP / Player.MaxEXP * 100}%`);
    Dom.PlayerEXPBar.style.width = `${Player.EXP / Player.MaxEXP * 100}%`;
    Dom.PlayerEXPBar.textContent = `EXP：${Player.EXP}/${Player.MaxEXP}`;
}
//渲染敵人血量
function updateEnemyHealthBar(enemy, index) {
    document.documentElement.style.setProperty(`--enemyhpbar${index}-w`, `${(enemy.CurHP / enemy.HP) * 100}%`);
    document.getElementById(`enemyhpbar${index}`).style.width = `${(enemy.CurHP / enemy.HP) * 100}%`;
    document.getElementById(`enemyhpbar${index}`).textContent = `${enemy.CurHP}/${enemy.HP}`;
}
//處理玩家死亡
function handlePlayerDeath() {
    ClearBattleScreen();
    setTimeout(() => {
        alert("你已經死亡了");
        window.location.reload();
    }, 500);
}
//處理結束玩家回合
function endPlayerTurn() {
    Game.PlayerCurAction = "無操作";
    Game.TurnRole = "Enemy";
    ClearBattleScreen();
    showTurnLetter();
    setTimeout(() => {
        EnemysAction();
    }, 2000);
    ShowDebugInfo();
}

function PlayerAttackBoss(enemy, index) {
    let damage = Player.Atk + Player.Equipment.Weapon.AddAtk - enemy.Def;
    damage = damage < 0 ? 1 : damage;
    enemy.CurHP -= damage;
    enemy.CurHP = enemy.CurHP < 0 ? 0 : enemy.CurHP;
    Player.OldPosition = Player.Position;
    setTimeout(() => {
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
                            alert("恭喜你打敗了所有敵人");
                            window.location.reload();
                        } else {
                            Game.PlayerCurAction = "無操作";
                            Game.TurnRole = "Enemy";
                            showTurnLetter()
                            EnemysAction()
                        }
                    }, 4000)
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
            }, 1800)
        } else {
            let enemydamege = enemy.Atk - Player.Def - Player.Equipment.Armor.AddDef - Player.Equipment.Fitting.AdDef;
            enemydamege = enemydamege < 0 ? 1 : enemydamege;
            let bossrecover = Math.floor(enemydamege / 8);
            setTimeout(() => {
                Player.CurHP -= Math.floor(enemydamege / 4)
                Player.CurHP = Player.CurHP < 0 ? 0 : Player.CurHP;
                document.documentElement.style.setProperty('--playerhp-w', `${Player.CurHP / Player.HP * 100}%`);
                Dom.PlayerHPBar.style.width = `${Player.CurHP / Player.HP * 100}%`;
                Dom.PlayerHPBar.textContent = `${Player.CurHP}/${Player.HP}`;
            }, 800);
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
            }, 1600);
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
            }, 3000)
        }
    }, 2100)
}

function LevelUp() {
    let playeroldlevel = Player.Level;
    let playeroldhp = Player.HP;
    let playeroldmp = Player.MP;
    let playeroldatk = Player.Atk;
    let playerolddef = Player.Def;
    let playeroldavoidrate = Player.AvoidRate;

    Player.EXP -= Player.MaxEXP;
    Player.MaxEXP = Player.Level * 150 + 500;
    Player.Level++;
    Player.HP += Player.Level * 10 + 100;
    Player.MP += Player.Level * 2 + 5;
    Player.Atk += Player.Level * 5 + 10;
    Player.Def += Player.Level * 5 + 15;
    Player.AvoidRate += 1;

    RenderPlayerInfo();
    setTimeout(() => {
        lvupdialog(playeroldlevel, playeroldhp, playeroldmp, playeroldatk, playerolddef, playeroldavoidrate)
        playeroldlevel = Player.Level;
        playeroldhp = Player.HP;
        playeroldmp = Player.MP;
        playeroldatk = Player.Atk;
        playerolddef = Player.Def;
        playeroldavoidrate = Player.AvoidRate;
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
                                    `;
    }, 10)
}

