//讀取檔案
let SaveData = [];
let alireadysavelength;
Dom.SavefileButton.onclick = function () {
    if (Game.TurnRole == "Player") {
        if (Game.PlayerCurAction != "移動中" && Game.PlayerCurAction != "已選擇攻擊目標") {
            if (Game.PlayerCurAction === "無操作") {
                SaveGameSave();
            } else {
                alert("每一回合的行動前才能存檔，若要存檔請按下取消按鈕")
                ShowDebugInfo()
            }
        } else {
            alert("移動中與戰鬥中無法存檔")
            ShowDebugInfo()
        }
    } else {
        alert("當前為敵人行動，請等待敵人行動完畢再結束回合")
        ShowDebugInfo()
    }
}

function SaveGameSave() {
    Dom.Savegamedialog.showModal();
    document.getElementById("savegamecontainer-inner").innerHTML = "";
    SaveData = [];
    for (let i = 0; i < localStorage.length; i++) {
        let mydata = localStorage.getItem("srpggame" + i);
        //將資料轉換成json格式
        let obj = JSON.parse(mydata);
        //將資料放入變數
        let data = obj
        //將讀取的資料放入陣列
        SaveData.push(data);
        console.log(SaveData);
    }
    alireadysavelength = SaveData.length;
    let savelength;
    savelength = 5 - SaveData.length;
    console.log("可以存新檔的長度：" + savelength);
    console.log("已存檔的長度：" + SaveData.length);

    if (SaveData.length > 0) {
        SaveData.forEach(function (item, index) {
            let chineseindex;
            switch (index) {
                case 0:
                    chineseindex = "一";
                    break;
                case 1:
                    chineseindex = "二";
                    break;
                case 2:
                    chineseindex = "三";
                    break;
                case 3:
                    chineseindex = "四";
                    break;
                case 4:
                    chineseindex = "五";
                    break;
                case 5:
                    chineseindex = "六";
                    break;
            }
            document.getElementById("savegamecontainer-inner").innerHTML += `
                            <div class="saveitem" id="hadsave${index}">
                                <div class="savetititem">${chineseindex}、</div>
                                <div id="leveltext">關卡：${item.Game.Level + 1}</div>
                                <div id="playersaveicon"></div>
                                <div id="timestamp">${item.Time}</div>
                            </div>
            `
        });


    }


    for (let i = 0; i < savelength; i++) {
        document.getElementById("savegamecontainer-inner").innerHTML += `
                                            <div class="saveitem" id="youcansave${i}">
                                                <div class="savetititem"></div>
                                                <div id="leveltext"></div>
                                                <div id="playersaveicon" style="display:none;"></div>
                                                <div id="timestamp"></div>
                                            </div>
                                            `;
    }

    for (let i = 0; i < savelength; i++) {
        document.getElementById("youcansave" + i).onclick = function () {

            if (window.confirm("確定要要存檔嗎？") === true) {
                let SaveData = {
                    "Game": Game,
                    "Player": Player,
                    "Enemys": Enemys,
                    "Time": new Date().toLocaleString()
                }
                localStorage.setItem("srpggame" + (i + alireadysavelength), JSON.stringify(SaveData));
                console.log(localStorage);
                SaveGame(i);
            }
        }
    }

    SaveData.forEach(function (item, index) {
        document.getElementById("hadsave" + index).onclick = function () {

            if (window.confirm("確定要覆蓋存檔嗎？") === true) {

                Enemys.forEach((enemy) => {
                    console.log(enemy.CurHP);
                })

                let SaveData = {
                    "Game": Game,
                    "Player": Player,
                    "Enemys": Enemys,
                    "Time": new Date().toLocaleString()
                }
                localStorage.setItem("srpggame" + index, JSON.stringify(SaveData));
                console.log(localStorage);
                SaveGame(index);
            }
        }
    })



    document.getElementById("closebtnsavebtn").onclick = function () {
        Dom.Savegamedialog.close();
    }
}
Dom.ReadfileButton.onclick = function () {
    if (Game.TurnRole == "Player") {
        if (Game.PlayerCurAction != "移動中" && Game.PlayerCurAction != "已選擇攻擊目標") {
            ReadGameSave();
        } else {
            alert("移動中與戰鬥中無法讀取檔案")
            ShowDebugInfo()
        }
    } else {
        alert("當前為敵人行動，請等待敵人行動完畢再結束回合")
        ShowDebugInfo()
    }

}

function ReadGameSave() {
    document.getElementById("readfilecontainer-inner").innerHTML = "";
    SaveData = [];
    Dom.Readfiledialog.showModal();

    for (let i = 0; i < localStorage.length; i++) {
        let mydata = localStorage.getItem("srpggame" + i);
        //將資料轉換成json格式
        let obj = JSON.parse(mydata);
        //將資料放入變數
        let data = obj
        //將讀取的資料放入陣列
        SaveData.push(data);
        console.log(SaveData);
    }
    SaveData.forEach(function (item, index) {
        let chineseindex;
        switch (index) {
            case 0:
                chineseindex = "一";
                break;
            case 1:
                chineseindex = "二";
                break;
            case 2:
                chineseindex = "三";
                break;
            case 3:
                chineseindex = "四";
                break;
            case 4:
                chineseindex = "五";
                break;
            case 5:
                chineseindex = "六";
                break;
        }

        document.getElementById("readfilecontainer-inner").innerHTML += `
                        <div class="saveitem">
                            <div class="savetititem">${chineseindex}、</div>
                            <div id="leveltext">關卡：${item.Game.Level + 1}</div>
                            <div id="playersaveicon"></div>
                            <div id="timestamp">${item.Time}</div>
                        </div>
        `
    });
    document.getElementById("closebtnreadfile").onclick = function () {
        document.getElementById("readfilecontainer-inner").innerHTML = "";
        Dom.Readfiledialog.close();
    }

    for (let i = 0; i < SaveData.length; i++) {
        document.getElementById("readfilecontainer-inner").children[i].onclick = function () {
            if (window.confirm("確定要讀取存檔嗎？") === true) {
                let SaveData = localStorage.getItem("srpggame" + i);
                //將資料轉換成json格式
                let obj = JSON.parse(SaveData);
                //將資料放入變數
                Game = obj.Game;
                Player = obj.Player;
                Enemys = obj.Enemys;
                console.log(Game);
                console.log(Player);
                console.log(Enemys);
                alert("讀取成功")
                ShowDebugInfo()
                isloadgame = obj.Game.Level === 0 ? false : true;
                Dom.Readfiledialog.close();
                Dom.GameMap.innerHTML = "";
                setTimeout(() => {
                    main();
                    document.getElementById(Player.Position).addEventListener('click', playerclick);
                }, 100)

            }
        }
    }
}

function SaveGame(index) {
    SaveGameSave();
    alert("存檔成功")
}



