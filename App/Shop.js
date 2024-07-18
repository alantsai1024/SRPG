Dom.ShopButton.onclick = function () {
    if (Game.TurnRole == "Player") {
        if (Game.PlayerCurAction != "移動中" && Game.PlayerCurAction != "已選擇攻擊目標") {
            showshop()
        } else {
            alert("移動中與戰鬥中無法進入商店")
            ShowDebugInfo()
        }
    } else {
        alert("當前為敵人行動，請等待敵人行動完畢再結束回合")
        ShowDebugInfo()
    }
}

function showshop() {
    Dom.Shopdialog.showModal();
    Dom.Shopbagcontainer.innerHTML = "";
    Dom.ShopRightContainer.innerHTML = "";
    Dom.Moneytext.innerHTML = Game.MyMoney;

    //綁定背包(武器)
    for (let i = 0; i < Player.Bag.Weapon.length; i++) {
        let Equipments = document.createElement("div")
        Equipments.className = "shopbagitem"
        Equipments.id = "Weapon" + i
        Equipments.innerHTML = `
        <div class="shopbagclassify">武器</div>
        <div class="shopbagicon" id="${Player.Bag.Weapon[i].StyleID}"></div>
        <div class="shopbagname">${Player.Bag.Weapon[i].Name}</div>
        `
        Dom.Shopbagcontainer.appendChild(Equipments)
    }

    //綁定背包(防具)
    for (let i = 0; i < Player.Bag.Armor.length; i++) {
        let Equipments = document.createElement("div")
        Equipments.className = "shopbagitem"
        Equipments.id = "Armor" + i
        Equipments.innerHTML = `
        <div class="shopbagclassify">防具</div>
        <div class="shopbagicon" id="${Player.Bag.Armor[i].StyleID}"></div>
        <div class="shopbagname">${Player.Bag.Armor[i].Name}</div>
        `
        Dom.Shopbagcontainer.appendChild(Equipments)
    }

    //綁定背包(飾品)
    for (let i = 0; i < Player.Bag.Fitting.length; i++) {
        let Equipments = document.createElement("div")
        Equipments.className = "shopbagitem"
        Equipments.id = "Fitting" + i
        Equipments.innerHTML = `
        <div class="shopbagclassify">飾品</div>
        <div class="shopbagicon" id="${Player.Bag.Fitting[i].StyleID}"></div>
        <div class="shopbagname">${Player.Bag.Fitting[i].Name}</div>
        `
        Dom.Shopbagcontainer.appendChild(Equipments)
    }

    //綁定背包(用品)
    for (let i = 0; i < Player.Bag.Eatting.length; i++) {
        let Equipments = document.createElement("div")
        Equipments.className = "shopbagitem"
        Equipments.id = "Eatting" + i
        Equipments.innerHTML = `
        <div class="shopbagclassify">用品</div>
        <div class="shopbagicon" id="${Player.Bag.Eatting[i].StyleID}"></div>
        <div class="shopbagname">${Player.Bag.Eatting[i].Name}</div>
        `
        Dom.Shopbagcontainer.appendChild(Equipments)
    }

    let EquipmentItsmsLength = EquipmentItsms.flat().length;

    for (let i = 0; i < EquipmentItsmsLength; i++) {
        let Equipments = document.createElement("div")
        Equipments.className = "shopitem"
        Equipments.id = "Item" + i
        let classifyname;
        switch (EquipmentItsms.flat()[i].TypecorItem) {
            case "Weapon":
                classifyname = "武器"
                break;
            case "Armor":
                classifyname = "盔甲"
                break;
            case "Fitting":
                classifyname = "飾品"
                break;
            case "Eatting":
                classifyname = "用品"
                break;
        }
        Equipments.innerHTML = `
        <div class="shopclassify">${classifyname}</div>
        <div class="shopitem-icon" id="${EquipmentItsms.flat()[i].StyleID}"></div>
        <div class="shopitem-name">${EquipmentItsms.flat()[i].Name}</div>
        <div class="moneyneed">$${EquipmentItsms.flat()[i].CostMoney}</div>
        <div class="buybtn" id="${EquipmentItsms.flat()[i].TypecorItem}:${i}:buy">購買</div>
        `
        Equipments.title = EquipmentItsms.flat()[i].DescripeLetter; // 添加懸浮文本
        Dom.ShopRightContainer.appendChild(Equipments)

        document.getElementById(`${EquipmentItsms.flat()[i].TypecorItem}:${i}:buy`).onclick = function () {
            let buyitem = EquipmentItsms.flat()[i]
            if (Game.MyMoney >= buyitem.CostMoney) {
                if (window.confirm(`確定要購買${buyitem.Name}嗎?`)) {
                    Game.MyMoney -= buyitem.CostMoney;
                    Dom.Moneytext.innerHTML = Game.MyMoney;
                    Player.Bag[buyitem.TypecorItem].push(buyitem);
                    showshop();
                }
            } else {
                alert("金錢不夠多")
            }
        }
    }

    document.getElementById("close-shopbtn").onclick = function () {
        Dom.Shopdialog.close();
    }
}
