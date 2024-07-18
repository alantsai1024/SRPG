Dom.EquipmentButton.onclick = function () {
    if (Game.TurnRole == "Player") {
        if (Game.PlayerCurAction != "移動中" && Game.PlayerCurAction != "已選擇攻擊目標") {
            if (Game.PlayerCurAction == "已選擇玩家角色" || Game.PlayerCurAction == "已選擇移動位置") {
                showequipment()
                ShowDebugInfo()
            } else if (Game.PlayerCurAction == "已按下攻擊按鈕") {
                alert("已按下攻擊按鈕無法點擊裝備，若要使用裝備請按下取消按鈕後再按下裝備按鈕")
                ShowDebugInfo()
            } else {
                alert("請選擇玩家角色後再按下裝備按鈕")
                ShowDebugInfo()
            }
        } else {
            alert("移動中或戰鬥中無法使用裝備")
            ShowDebugInfo()
        }
    } else {
        alert("現在為敵人行動回合，請等待敵人行動完畢再選擇角色")
        ShowDebugInfo()
    }
}

function showequipment() {
    //背包內容清空
    Dom.BagContainer.innerHTML = ""
    //物品資訊內容清空
    Dom.ItemInfocontent.innerHTML = ""
    Dom.EquipmentsDialog.showModal()

    //初始化玩家魔力
    Player.CurMP > Player.MP + Player.Equipment.Fitting.AddMP ? Player.CurMP = Player.MP + Player.Equipment.Fitting.AddMP : Player.CurMP
    Dom.PlayerMPBar.style.width = ((Player.CurMP) / (Player.MP + Player.Equipment.Fitting.AddMP)) * 100 + '%';
    Dom.PlayerMPBar.textContent = (Player.CurMP) + '/' + (Player.MP + Player.Equipment.Fitting.AddMP);

    //初始化玩家資訊
    Dom.PlayerInfo.innerHTML = `
                        <p style="display: flex; align-items: center;"><img src="./Public/sword.png" width="25px" />攻擊力：
                           ${Player.Atk + Player.Equipment.Weapon.AddAtk - 20}+</p>
                        <p style="display: flex; align-items: center;"><img src="./Public/defence.png"
                                width="25px" />防禦力： ${Player.Def + Player.Equipment.Armor.AddDef + Player.Equipment.Fitting.AdDef}</p>
                        <p style="display: flex; align-items: center;"><img src="./Public/running.png"
                                width="25px" />移動力： 3</p>
                        <p style="display: flex; align-items: center;"><img src="./Public/lightning.png"
                                width="25px" />閃避： 30% </p>
                                `;

    //讀取背包內容(武器)
    for (let i = 0; i < Player.Bag.Weapon.length; i++) {
        let Equipments = document.createElement("div")
        Equipments.className = "bagitem"
        Equipments.id = "Weapon" + i
        Equipments.innerHTML = `
        <div class="bagclassify">武器</div>
        <div class="bagitemicon" id="${Player.Bag.Weapon[i].StyleID}"></div>
        <div class="bagitemname">${Player.Bag.Weapon[i].Name}</div>
        `
        Dom.BagContainer.appendChild(Equipments)
    }

    //讀取背包內容(防具)
    for (let i = 0; i < Player.Bag.Armor.length; i++) {
        let Equipments = document.createElement("div")
        Equipments.className = "bagitem"
        Equipments.id = "Armor" + i
        Equipments.innerHTML = `
        <div class="bagclassify">防具</div>
        <div class="bagitemicon" id="${Player.Bag.Armor[i].StyleID}"></div>
        <div class="bagitemname">${Player.Bag.Armor[i].Name}</div>
        `
        Dom.BagContainer.appendChild(Equipments)
    }

    //讀取背包內容(配件)
    for (let i = 0; i < Player.Bag.Fitting.length; i++) {
        let Equipments = document.createElement("div")
        Equipments.className = "bagitem"
        Equipments.id = "Fitting" + i
        Equipments.innerHTML = `
        <div class="bagclassify">飾品</div>
        <div class="bagitemicon" id="${Player.Bag.Fitting[i].StyleID}"></div>
        <div class="bagitemname">${Player.Bag.Fitting[i].Name}</div>
        `
        Dom.BagContainer.appendChild(Equipments)
    }

    for (let i = 0; i < Player.Bag.Eatting.length; i++) {
        let Equipments = document.createElement("div")
        Equipments.className = "bagitem"
        Equipments.id = "Eatting" + i
        Equipments.innerHTML = `
        <div class="bagclassify">用品</div>
        <div class="bagitemicon" id="${Player.Bag.Eatting[i].StyleID}"></div>
        <div class="bagitemname">${Player.Bag.Eatting[i].Name}</div>
        `
        Dom.BagContainer.appendChild(Equipments)
    }

    //玩家目前穿戴裝備綁定
    Dom.Weaponicon.id = Player.Equipment.Weapon.StyleID
    Dom.Weaponname.innerHTML = Player.Equipment.Weapon.Name
    Dom.Armoricon.id = Player.Equipment.Armor.StyleID
    Dom.Armorname.innerHTML = Player.Equipment.Armor.Name
    Dom.Fittingicon.id = Player.Equipment.Fitting.StyleID
    Dom.Fittingname.innerHTML = Player.Equipment.Fitting.Name


    //玩家裝備能力顯示
    Dom.Attackability.innerHTML = "攻擊<br>" + (Player.Atk + Player.Equipment.Weapon.AddAtk - 20) + "+"
    Dom.Defenceability.innerHTML = "防禦<br>" + (Player.Def + Player.Equipment.Armor.AddDef + Player.Equipment.Fitting.AdDef)
    Dom.Avoidability.innerHTML = "閃避<br>" + Player.AvoidRate + "%"

    document.querySelectorAll('.bagitem').forEach(item => {
        item.onclick = function () {
            let itemiconid = this.querySelector('.bagitemicon').id
            let itemname = this.querySelector('.bagitemname').innerHTML

            let index = parseInt(this.id.slice(-1))
            let itemclassify = this.id.slice(0, -1)
            let itemDescripeLetter = Player.Bag[`${itemclassify}`][index].DescripeLetter

            Dom.ItemInfocontent.innerHTML = ""
            if (itemclassify == "Eatting") {
                Dom.ItemInfocontent.innerHTML = `
                                            <div class="iteminfoicon" id="${itemiconid}"></div>
                                            <div class="iteminfoname">${itemname}</div>
                                            <div class="iteminfodescripe">${itemDescripeLetter}</div>
                                            <div class="iteminfobtns">
                                              <div class="requipbtbn" id="${itemclassify}:${index}:useing">使用</div>
                                                <div class="discardbtn" id="${itemclassify}:${index}:discard">丟棄</div>
                                            </div>
                                            `;
                document.getElementById(`${itemclassify}:${index}:useing`).onclick = function () {
                    let itemindex = this.id.split(":")[1]
                    let itemclassify = this.id.split(":")[0]
                    let item = Player.Bag[`${itemclassify}`][itemindex]
                    Player.CurHP += item.RecoverHP
                    Player.CurHP > Player.HP ? Player.CurHP = Player.HP : Player.CurHP
                    Player.CurMP += item.RecoverMP
                    Player.CurMP > Player.MP + Player.Equipment.Fitting.AddMP ? Player.CurMP = Player.MP + Player.Equipment.Fitting.AddMP : Player.CurMP
                    Dom.PlayerHPBar.style.width = ((Player.CurHP) / Player.HP) * 100 + '%';
                    Dom.PlayerHPBar.textContent = (Player.CurHP) + '/' + Player.HP;
                    Dom.PlayerMPBar.style.width = ((Player.CurMP) / (Player.MP + Player.Equipment.Fitting.AddMP)) * 100 + '%';
                    Dom.PlayerMPBar.textContent = (Player.CurMP) + '/' + (Player.MP + Player.Equipment.Fitting.AddMP);
                    Dom.BagContainer.innerHTML = ""
                    let audio = new Audio('./Public/recoversound.mp3');
                    audio.play();
                    Player.Bag[`${itemclassify}`].splice(itemindex, 1)
                    Dom.EquipmentsDialog.close()
                }

                document.getElementById(`${itemclassify}:${index}:discard`).onclick = function () {
                    let itemindex = this.id.split(":")[1]
                    let itemclassify = this.id.split(":")[0]
                    let item = Player.Bag[`${itemclassify}`][itemindex]
                    if (window.confirm("確定要丟棄此物品嗎?")) {
                        Player.Bag[`${itemclassify}`].splice(itemindex, 1)
                        Dom.BagContainer.innerHTML = ""
                        showequipment()
                    }
                }
            } else {
                Dom.ItemInfocontent.innerHTML = `
                                            <div class="iteminfoicon" id="${itemiconid}"></div>
                                            <div class="iteminfoname">${itemname}</div>
                                            <div class="iteminfodescripe">${itemDescripeLetter}</div>
                                            <div class="iteminfobtns">
                                              <div class="requipbtbn" id="${itemclassify}:${index}:equipmentensure">裝備</div>
                                                <div class="discardbtn" id="${itemclassify}:${index}:discard">丟棄</div>
                                            </div>
                                            `;
                document.getElementById(`${itemclassify}:${index}:equipmentensure`).onclick = function () {
                    let itemindex = this.id.split(":")[1]
                    let itemclassify = this.id.split(":")[0]
                    let item = Player.Bag[`${itemclassify}`][itemindex]
                    if (Player.Equipment[`${itemclassify}`].Name != item.Name) {
                        Player.Equipment[`${itemclassify}`] = item
                        Dom[`${itemclassify}icon`].id = item.StyleID
                        Dom[`${itemclassify}name`].innerHTML = item.Name
                        showequipment()
                    } else {
                        alert("已裝備此物品")
                    }
                }
                document.getElementById(`${itemclassify}:${index}:discard`).onclick = function () {
                    let itemindex = this.id.split(":")[1]
                    let itemclassify = this.id.split(":")[0]
                    let item = Player.Bag[`${itemclassify}`][itemindex]
                    if (Player.Equipment[`${itemclassify}`].Name != item.Name) {
                        if (window.confirm("確定要丟棄此物品嗎?")) {
                            Player.Bag[`${itemclassify}`].splice(itemindex, 1)
                            Dom.BagContainer.innerHTML = ""
                            showequipment()
                        } else if (Player.Equipment[`${itemclassify}`].Name == item.Name && Player.Bag[`${itemclassify}`].length > 1) {
                            if (window.confirm("確定要丟棄此物品嗎?")) {
                                Player.Bag[`${itemclassify}`].splice(itemindex, 1)
                                Dom.BagContainer.innerHTML = ""
                                showequipment()
                            }
                        }

                    } else {
                        alert("裝備中無法丟棄")
                    }
                }
            }
        }
    })



    Dom.CloseEquipBtn.onclick = function () {
        Dom.EquipmentsDialog.close()
        Dom.BagContainer.innerHTML = ""
    }
}
