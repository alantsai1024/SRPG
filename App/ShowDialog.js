function showEndTurnMsg(msg) {
    document.getElementById("dialogforendturn").showModal();
    document.getElementById("nobtn").onclick = () => {
        document.getElementById("dialogforendturn").close()
    }
}

function ShowDebugInfo() {
    console.log("當前回合：" + Game.Turn);
    console.log("當前回合角色：" + Game.TurnRole);
    console.log("當前玩家操作：" + Game.PlayerCurAction);
    console.log("玩家位置：" + Player.Position);
    console.log("玩家當前武器：" + Player.Equipment.Weapon.Name);
}

function ShowSkill() {
    Dom.SkillsDialog.showModal();

    let skillList = document.getElementById('skillslists');
    skillList.innerHTML = "";
    Player.Skills.forEach((skill, index) => {
        let skillitem = `<div div id = "skill${index}" class="skill" >
                            <img src="./Public/skill${index}.png" width="50px" />
                            <div class="skillName">${skill.Name}</div>
                            <div class="skillDescription">${skill.Description}</div>
                            <div class="skillMPDescr">消耗法力：${skill.MP}</div>
                        </div> `
        skillList.innerHTML += skillitem;
    });

    Player.Skills.forEach((skill, index) => {
        document.getElementById(`skill${index}`).onclick = () => {
            animateskill(index)
        }
    })
    document.getElementById('skillcancel').onclick = () => {
        document.getElementById('skillsdialog').close();
    }
}

Dom.GameInstructionBtn.onclick = () => {
    document.getElementById('gameinfodialog').showModal();
    document.getElementById('closebtninfo').onclick = () => {
        document.getElementById('gameinfodialog').close();
    }
}

//顯示獲得經驗值、金幣、物品
function showyouwhatget(msg) {
    document.getElementById('showyougetitem-container').style.zIndex = 100;
    document.getElementById('showyougetitem-container').style.opacity = 1;
    Dom.Showyougetitem.showModal()
    if (msg != "寶箱裡沒有東西") {
        document.getElementById('showyougetitem-right').textContent = '獲得' + msg;
    } else {
        document.getElementById('showyougetitem-right').textContent = msg;
    }

    setTimeout(() => {
        document.getElementById('showyougetitem-container').style.zIndex = -1;
        document.getElementById('showyougetitem-container').style.opacity = 0;
        Dom.Showyougetitem.close()
    }, 2500)
}

//顯示升級對話框
function lvupdialog(playeroldlevel, playeroldhp, playeroldmp, playeroldatk, playerolddef, playeroldavoidrate) {
    document.getElementById('lvupcontent-inner').innerHTML = "";
    document.getElementById('lvupcontent-skill').innerHTML = "";
    document.getElementById('lvupcontent').style.opacity = 1;
    document.getElementById('lvupcontent').style.zIndex = 100;

    document.getElementById('lvupcontent-inner').innerHTML = `
                                        <div id="lvuptit">等級提升：${playeroldlevel} ➞ ${Player.Level}</div>
                                        <div id="lvupinfo">
                                            <div id="lvupHP">HP：${playeroldhp} ➞  ${Player.HP}</div>
                                            <div id="lvupMP">法力：${playeroldmp} ➞  ${Player.MP}</div>
                                            <div id="lvupAtk">攻擊：${playeroldatk} ➞  ${Player.Atk}</div>
                                            <div id="lvupDef">防禦：${playerolddef} ➞  ${Player.Def}</div>
                                            <div id="lvupAvd">閃避：${playeroldavoidrate}% ➞  ${Player.AvoidRate}%</div>
                                        </div>
                                        `;

    //學習新技能
    Object.keys(TotalSkills).forEach(function (key) {
        if (TotalSkills[key].LevelLimit <= Player.Level) {
            //防止重複學習，先判斷是否已經學過，如果沒有，則新增技能
            let isSkillExist = false;
            Player.Skills.forEach(skill => {
                if (skill.Name == TotalSkills[key].Name) {
                    isSkillExist = true;
                }
            });
            if (!isSkillExist) {
                Player.Skills.push(TotalSkills[key]);
                document.getElementById('lvupcontent-skill').innerHTML = `技、${TotalSkills[key].Name}`;
            }
        }
    });

    Dom.LVupdialog.showModal();

    setTimeout(() => {
        document.getElementById('lvupcontent').style.zIndex = -1;
        document.getElementById('lvupcontent').style.opacity = 0;
        Dom.LVupdialog.close()
    }, 4000)
}




function techshowfun() {
    document.getElementById('showdialogarea').innerHTML = "";

    document.getElementById('showdialogarea').innerHTML = `
                                                            <dialog id="dialogfortech">
                                                                <div id="techcontainer">
                                                                    <div id="text-tit">
                                                                        <img src="./Public/win.png" width="50px">
                                                                        歡迎來到JS的RPG回合戰棋遊戲
                                                                        <img src="./Public/win.png" width="50px">
                                                                    </div>
                                                                    <div id="techleftarr"></div>
                                                                    <div id="texhcontent">
                                                                        <div class="step">
                                                                            <div class="steptit">操作教學 Step1：移動</div>
                                                                            <div class="stepcontent">
                                                                                <div class="stepcontent-page">
                                                                                    <img src="./Teching/step1.gif" width="400px">
                                                                                    滑鼠點擊地圖角色 ➞ 移動角色
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="step">
                                                                            <div class="steptit">操作教學 Step2：結束回合</div>
                                                                            <div class="stepcontent">
                                                                                <div class="stepcontent-page">
                                                                                    <img src="./Teching/step2.gif" width="600px">
                                                                                    移動後若無其他操作 ➞ 結束回合
                                                                                    <br><br>
                                                                                    (攻擊或法術會直接到敵人回合)
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="step">
                                                                            <div class="steptit">操作教學 Step3：取消</div>
                                                                            <div class="stepcontent">
                                                                                <div class="stepcontent-page">
                                                                                    <img src="./Teching/step3.gif" width="430px">
                                                                                    同一回合操作失誤 ➞ 取消
                                                                                    <br><br>
                                                                                    (裝備、商店除外)
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="step">
                                                                            <div class="steptit">操作教學 Step4：存檔 & 讀取存檔</div>
                                                                            <div class="stepcontent">
                                                                                <div class="stepcontent-page">
                                                                                    <img src="./Teching/step4.gif" width="700px">
                                                                                    保存進度 ➞ 存檔

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="step">
                                                                            <div class="steptit">操作教學 Step5：查看地圖</div>
                                                                            <div class="stepcontent">
                                                                                <div class="stepcontent-page">
                                                                                    <img src="./Teching/step5.gif" width="450px">
                                                                                    <div id="rightpagetech">
                                                                                        <div> 滑鼠長按拖洩移動 ➞ 移動視角</div>
                                                                                        <div id="texhforstart">開始玩</div>
                                                                                    </div>
                                                                                                                
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div id="techrightarr"></div>
                                                                </div>
                                                            </dialog>
                                                          `
    document.getElementById('dialogfortech').showModal();

    document.getElementById('texhforstart').onclick = () => {
        document.getElementById('dialogfortech').close();
        document.cookie = "ReadTech=true";
    }
    let isscroll = false;
    document.getElementById('techleftarr').onclick = () => {
        if (isscroll === false) {
            document.getElementById('texhcontent').scrollLeft -= 1008;
            isscroll = true;
            setTimeout(() => {
                isscroll = false;
            }, 700)
        }
    }
    document.getElementById('techrightarr').onclick = () => {
        if (isscroll === false) {
            document.getElementById('texhcontent').scrollLeft += 1008;
            isscroll = true;
            setTimeout(() => {
                isscroll = false;
            }, 700)
        }
    }
}




