let TotalSkills = {
    "氣愈之術": {
        "Name": "氣愈之術",
        "Description": "恢復以自身攻擊1.2倍以上的HP",
        "MP": 18,
        "Type": "Recover",
        "Effect": Player.Atk * 1.2 + Math.floor(Math.random() * 20),
        "LevelLimit": 3,
    },
    "無方飛劍": {
        "Name": "無方飛劍",
        "Description": "對遠方敵人單體造成1.5倍攻擊的傷害",
        "MP": 30,
        "Type": "Attack",
        "Effect": Player.Atk * 1.5,
        "LevelLimit": 10,
    },
}

function animateskill(index) {
    if (index == 0 && Player.CurMP >= TotalSkills["氣愈之術"].MP) {
        Player.OldPosition = Player.Position;
        Game.PlayerCurAction = "移動中"
        Player.CurMP -= TotalSkills["氣愈之術"].MP;
        Player.CurHP += Math.floor(Player.Atk * 1.2 + Math.floor(Math.random() * 20));
        Player.CurMP = Player.CurMP < 0 ? 0 : Player.CurMP;
        Player.CurMP = Player.CurMP > (Player.MP + Player.Equipment.Fitting.AddMP) ? (Player.MP + Player.Equipment.Fitting.AddMP) : Player.CurMP;
        Player.CurHP = Player.CurHP > Player.HP ? Player.HP : Player.CurHP;
        document.getElementById('skillsdialog').close();

        Dom.ShowSkillname.showModal()
        Dom.ShowSkillname.innerHTML = `<div id ="showskillnamecontainer">${Player.Skills[index].Name}</div>`
        setTimeout(() => {
            Dom.ShowSkillname.close()
            Dom.ShowSkillname.innerHTML = ""
        }, 2600)

        document.documentElement.style.setProperty(`--playermpbar - w`, `${Player.CurMP / Player.MP * 100}% `);
        Dom.PlayerMPBar.style.width = `${Player.CurMP / (Player.MP + Player.Equipment.Fitting.AddMP) * 100}% `;
        Dom.PlayerMPBar.textContent = `${Player.CurMP}/${(Player.MP + Player.Equipment.Fitting.AddMP)}`;
        //黑色透明遮罩
        Dom.GameMap.style.backgroundColor = "rgba(0, 0, 0, 0.99)";
        Dom.GameMap.style.backgroundBlendMode = "multiply";
        //插入<img src='./Public/skillanimate0.gif' width='50px' />並且位置是玩家位置
        document.getElementById(Player.Position).innerHTML += `<img src='./Public/skillanimate${index}.gif' style="margin-top: 50px; opacity: 0.9;transform: scale(1.2);" />`;
        //創建音效
        let audio = new Audio(`./Public/skillsound${index}.mp3`);
        audio.play();
        setTimeout(() => {
            document.documentElement.style.setProperty(`--playerhpbar-w`, `${Player.CurHP / Player.HP * 100}%`);
            Dom.PlayerHPBar.style.width = `${Player.CurHP / Player.HP * 100}%`;
            Dom.PlayerHPBar.textContent = `${Player.CurHP}/${Player.HP}`;
            Dom.GameMap.style.backgroundColor = "rgba(0, 0, 0, 0)";
            Dom.GameMap.style.backgroundBlendMode = "normal";
            document.getElementById(Player.Position).innerHTML = "";
            audio.remove();
            Game.PlayerCurAction = "無操作";
            Game.TurnRole = "Enemy";
            //清除玩家的移動範圍
            document.querySelectorAll('.playercanmove').forEach(cell => {
                cell.classList.remove('playercanmove');
                cell.onclick = null;
            })
        }, 3800);

        setTimeout(() => {
            let getexp = 200 + Math.floor(Math.random() * 50);
            Player.EXP += getexp;
            showyouwhatget(getexp + "經驗值")
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
                } else {
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
                }

            }, 2500)

        }, 4000)
    }
}