//交互物件
const Dom = {
    GameMap: document.getElementById('gameBoard'),                          //地圖
    AttackBtn: document.getElementById('attackButton'),                     //攻擊按鈕
    SkillBtn: document.getElementById('skillButton'),                       //法術按鈕
    EndTurnBtn: document.getElementById('EndGameTurn'),                     //結束回合按鈕
    CancelBtn: document.getElementById('cancelButton'),                     //取消按鈕
    EquipmentButton: document.getElementById('equipmentButton'),            //裝備按鈕
    PlayerHPBar: document.querySelector('.player-innerhpbar'),              //玩家血量
    PlayerMPBar: document.querySelector('.player-innermpbar'),              //玩家魔力
    PlayerEXPBar: document.querySelector('.player-innerexpbar'),            //玩家經驗
    Enemyhpbar0: document.getElementById('enemyhpbar0'),                    //敵人1血量
    Enemyhpbar1: document.querySelector('enemyhpbar1'),                     //敵人2血量
    Enemyhpbar2: document.querySelector('enemyhpbar2'),                     //敵人3血量
    OKbtn: document.getElementById('okbtn'),                                //確認按鈕
    NoBtn: document.getElementById('nobtn'),                                //取消按鈕
    DialogForEndTurn: document.getElementById('dialogforendturn'),          //結束回合對話框
    ShowTurnLetter: document.getElementById("showturn"),                    //顯示回合數
    BattleScreen: document.getElementById('BattleScreen'),                  //戰鬥畫面
    GameInstructionBtn: document.getElementById('GameInstructionbtn'),      //遊戲說明按鈕
    BgmVolumeBar: document.getElementById('soundbar'),                      //背景音樂音量條
    SoundEffectVolumeBar: document.getElementById('sound-inner-bar'),       //當前音量條
    SkillsDialog: document.getElementById('skillsdialog'),                  //技能對話框
    EquipmentsDialog: document.getElementById('equipmentsdialog'),          //裝備對話框
    CloseEquipBtn: document.getElementById('closeequipbtn'),                //關閉裝備對話框按鈕
    Attackability: document.getElementById('attackability'),                //玩家攻擊力顯示
    Defenceability: document.getElementById('defenceability'),              //玩家防禦力顯示
    Avoidability: document.getElementById('avoidability'),                  //玩家迴避率顯示
    Weaponicon: document.querySelector('.weaponicon'),                      //武器圖示
    Weaponname: document.getElementById('weaponname'),                      //武器名稱
    Armoricon: document.querySelector('.armoricon'),                        //防具圖示
    Armorname: document.getElementById('armorname'),                        //防具名稱
    Fittingicon: document.querySelector('.fittingicon'),                    //飾品圖示
    Fittingname: document.getElementById('fittingname'),                    //飾品名稱
    BagContainer: document.getElementById('bagcontainer'),                  //背包容器
    ItemInfocontent: document.getElementById('iteminfocontent'),            //物品資訊內容
    DialogForGetTreasure: document.getElementById('dialogforgettreasure'),  //獲得寶物對話框
    OKbtnForGetTreasure: document.getElementById('okbtnforgettreasure'),    //獲得寶物對話框確認按鈕
    TreasureContent: document.getElementById('treasurecontent'),            //寶物內容
    PlayerInfo: document.querySelector('.PlayerInfo'),                      //玩家資訊
    EnemyStatusBar: document.getElementById('EnemyStatusBar'),              //敵人狀態欄
    ShopButton: document.getElementById('ShopButton'),                      //商店按鈕
    SavefileButton: document.getElementById('SavefileButton'),              //存檔按鈕
    ReadfileButton: document.getElementById('ReadfileButton'),              //讀檔按鈕
    Shopdialog: document.getElementById('shopdialog'),                      //商店對話框
    Shopbagcontainer: document.getElementById('shop-bagcontainer'),         //商店背包容器
    ShopRightContainer: document.getElementById('shop-right-container'),    //商店商品容器
    Moneytext: document.getElementById('moneytext'),                        //金錢文字
    Readfiledialog: document.getElementById('readfiledialog'),              //讀檔對話框
    Savegamedialog: document.getElementById('savegamedialog'),              //存檔對話框
    ShowSkillname: document.getElementById('showskillname'),                //顯示技能名稱
    Showyougetitem: document.getElementById('showyougetitem'),              //顯示獲得物品
    LVupdialog: document.getElementById('lvupdialog'),                      //升級對話框
}

let Obstacles0 = [12, 13, 14, 22, 23, 24, 25, 55, 56, 57, 65, 66, 67, 76, 77, 49, 59, 78, 99, 50, 62, 72, 32, 7, 17];
let Obstacles1 = [81, 51, 61, 71, 98, 34, 68, 53, 63, 74, 55, 56, 48, 76, 11, 20, 36, 38, 32, 24, 3, 4, 95];
let treasure0 = [0, 98];
let treasure1 = [99, 10, 64, 60];
let Obstaclessetting;

let Game = {
    Level: 0,                                                   //遊戲關卡
    Turn: 1,                                                    //回合數
    TurnRole: "Player",                                         //當前回合角色
    /*定義PlayerCurAction只能存在是以下幾個值，否則會報錯
    1. PlayerCurAction =="無操作"
    2. PlayerCurAction =="已選擇玩家角色"
    3. PlayerCurAction =="已選擇移動位置"
    4. PlayerCurAction =="已按下攻擊按鈕"
    5. PlayerCurAction =="已選擇攻擊目標"
    */
    PlayerCurAction: "無操作",                                  //玩家目前操作
    Obstacles: Obstaclessetting,      //障礙物
    Map: {
        rows: 10,
        cols: 10,
    },
    BattleisProcess: 0,
    Treasures: [],
    MyMoney: 200,
    CurCameraPosition: 0,
}

Obstaclessetting = Game.Level === 0 ? Obstacles0 : Obstacles1;
Game.Obstacles = Obstaclessetting;
Game.Treasures = Game.Level === 0 ? treasure0 : treasure1;



let EquipmentItsms = [
    Weapon = [
        {
            Name: "長劍",
            AddAtk: 10,
            DescripeLetter: "攻擊力+10",
            StyleID: "normal-sword-icon",
            TypecorItem: "Weapon",
            CostMoney: 10,
        },
        {
            Name: "青鋼劍",
            AddAtk: 55,
            DescripeLetter: "攻擊力+55",
            StyleID: "normal2-sword-icon",
            TypecorItem: "Weapon",
            CostMoney: 800,
        },
        {
            Name: "紫金劍",
            AddAtk: 320,
            DescripeLetter: "攻擊力+320",
            StyleID: "purple-sword-icon",
            TypecorItem: "Weapon",
            CostMoney: 2000,
        },
        {
            Name: "古劍‧龍形",
            AddAtk: 550,
            DescripeLetter: "攻擊力+550",
            StyleID: "gold-sword-icon",
            TypecorItem: "Weapon",
            CostMoney: 5000,
        },
    ],
    Armor = [
        {
            Name: "棉衣",
            AddDef: 10,
            DescripeLetter: "防禦力+5",
            StyleID: "normal-armor-icon",
            TypecorItem: "Armor",
            CostMoney: 10,
        },
        {
            Name: "皮甲",
            AddDef: 50,
            DescripeLetter: "防禦力+50",
            StyleID: "silver-armor-icon",
            TypecorItem: "Armor",
            CostMoney: 700,
        }, {
            Name: "蟒神甲",
            AddDef: 280,
            DescripeLetter: "防禦力+280",
            StyleID: "brown-armor-icon",
            TypecorItem: "Armor",
            CostMoney: 2000,
        },
        {
            Name: "龍王鎧",
            AddDef: 500,
            DescripeLetter: "防禦力+500",
            StyleID: "green-armor-icon",
            TypecorItem: "Armor",
            CostMoney: 5500,
        }
    ],
    Fitting = [
        {
            Name: "避邪玉珮",
            AddMP: 0,
            AdDef: 5,
            DescripeLetter: "防禦力+5",
            StyleID: "normal-fitting-icon",
            TypecorItem: "Fitting",
            CostMoney: 10,
        },
        {
            Name: "妖磷石",
            AddMP: 5,
            AdDef: 70,
            DescripeLetter: "法力+5 防禦力+70",
            StyleID: "demon-fitting-icon",
            TypecorItem: "Fitting",
            CostMoney: 1500,
        },
        {
            Name: "雲龍珠",
            AddMP: 50,
            AdDef: 150,
            DescripeLetter: "法力+50 防禦力+150",
            StyleID: "clouded-ring-icon",
            TypecorItem: "Fitting",
            CostMoney: 3000,
        },
        {
            Name: "兩儀玄石",
            AddMP: 220,
            AdDef: 300,
            DescripeLetter: "法力+220 防禦力+300",
            StyleID: "Liangyi-fitting-icon",
            TypecorItem: "Fitting",
            CostMoney: 6000,
        }
    ],
    Eatting = [
        {
            Name: "金創藥",
            RecoverHP: 250 + Math.floor(Math.random() * 20),
            RecoverMP: 0,
            DescripeLetter: "回復自身250點以上 HP",
            StyleID: "Eating-recoverhp0-icon",
            TypecorItem: "Eatting",
            CostMoney: 1200,
        },
        {
            Name: "返氣丸",
            RecoverHP: 0,
            RecoverMP: 200 + Math.floor(Math.random() * 10),
            DescripeLetter: "回復自身200點以上 法力",
            StyleID: "Eating-recovermp0-icon",
            TypecorItem: "Eatting",
            CostMoney: 3000,
        },
        {
            Name: "大補丸",
            RecoverHP: 600 + Math.floor(Math.random() * 20),
            RecoverMP: 0,
            DescripeLetter: "回復自身600點以上 HP",
            StyleID: "Eating-recoverhp1-icon",
            TypecorItem: "Eatting",
            CostMoney: 2200,
        },
    ]
]

let Player = {
    Level: 1,
    MaxEXP: 500,
    EXP: 0,
    HP: 130,
    CurHP: 130,
    MP: 22,
    CurMP: 22,
    Atk: (Math.floor(Math.random() * 20) + 56), //56
    AtkRange: 1,
    Def: 23,//23
    Move: 4,
    AvoidRate: 30,
    Skills: [

    ],
    Position: Game.Level === 0 ? 9 : 82, //37
    OldPosition: Game.Level === 0 ? 9 : 82, //37
    Bag: {
        Weapon: [
            EquipmentItsms[0][0],
        ],
        Armor: [
            EquipmentItsms[1][0],
        ],
        Fitting: [
            EquipmentItsms[2][0],
        ],
        Eatting: [
            EquipmentItsms[3][0],
        ]
    },
    Equipment: {
        Weapon: {
            Name: EquipmentItsms[0][0].Name,
            AddAtk: EquipmentItsms[0][0].AddAtk,
            DescripeLetter: EquipmentItsms[0][0].DescripeLetter,
            StyleID: EquipmentItsms[0][0].StyleID,
        },
        Armor: {
            Name: EquipmentItsms[1][0].Name,
            AddDef: EquipmentItsms[1][0].AddDef,
            DescripeLetter: EquipmentItsms[1][0].DescripeLetter,
            StyleID: EquipmentItsms[1][0].StyleID,
        },
        Fitting: {
            Name: EquipmentItsms[2][0].Name,
            AddMP: EquipmentItsms[2][0].AddMP,
            AdDef: EquipmentItsms[2][0].AdDef,
            DescripeLetter: EquipmentItsms[2][0].DescripeLetter,
            StyleID: EquipmentItsms[2][0].StyleID,
        }
    }
}

let enemyarr0 = [
    {
        Name: "敵人",
        HP: 150,
        CurHP: 150,
        Atk: Math.floor(Math.random() * 15) + 90,
        AtkRange: 2,
        Def: 20,
        Move: 5,
        RewardMoney: 900,
        GiveEXP: 1000,
        Position: 75, //26
    },
    {
        Name: "敵人",
        HP: 200,
        CurHP: 200,
        Atk: Math.floor(Math.random() * 10) + 50,
        AtkRange: 1,
        Def: 40,
        Move: 5,
        RewardMoney: 1000,
        GiveEXP: 1000,
        Position: 42, //36
    },
    {
        Name: "BOSS",
        HP: 500,
        CurHP: 500,
        Atk: Math.floor(Math.random() * 50) + 230,
        AtkRange: 1,
        Def: 50,
        Move: 5,
        RewardMoney: 2500,
        GiveEXP: 2000,
        Position: 71, //35
    }
]

let enemyarr1 = [
    {
        Name: "敵人",
        HP: 700,
        CurHP: 700,
        Atk: Math.floor(Math.random() * 15) + 600,
        AtkRange: 2,
        Def: 100,
        Move: 4,
        RewardMoney: 1200,
        GiveEXP: 1800,
        Position: 16, //16
    },
    {
        Name: "敵人",
        HP: 700,
        CurHP: 700,
        Atk: Math.floor(Math.random() * 15) + 600,
        AtkRange: 2,
        Def: 100,
        Move: 4,
        RewardMoney: 1200,
        GiveEXP: 1800,
        Position: 18, //18
    },
    {
        Name: "BOSS",
        HP: 4000,
        CurHP: 4000,
        Atk: Math.floor(Math.random() * 100) + 950,
        AtkRange: 1,
        Def: 600,
        Move: 4,
        RewardMoney: 2000,
        GiveEXP: 6000,
        Skills: {
            Name: "絕煞劍",
            DescripeLetter: "以自身攻擊2倍以上傷害且玩家不可反擊，無視玩家防禦力",
            AddAtk: 2,
            CanUseSkill: false,
        },
        Position: 7, //7
    },
    {
        Name: "敵人",
        HP: 2000,
        CurHP: 2000,
        Atk: Math.floor(Math.random() * 10) + 480,
        AtkRange: 1,
        Def: 180,
        Move: 4,
        RewardMoney: 1200,
        GiveEXP: 1500,
        Position: 25, //25
    },
    {
        Name: "敵人",
        HP: 2000,
        CurHP: 2000,
        Atk: Math.floor(Math.random() * 10) + 480,
        AtkRange: 1,
        Def: 180,
        Move: 4,
        RewardMoney: 1200,
        GiveEXP: 1500,
        Position: 29, //29
    },
]

let Enemys = Game.Level == 0 ? enemyarr0 : enemyarr1;





