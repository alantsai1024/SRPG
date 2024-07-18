function AdvancedLoaded() {
    for (let i = 0; i < Enemys.length; i++) {
        const battlemovie = document.createElement('video');
        battlemovie.src = `./BattleScreen/${Game.Level}/PlayerAccessBattle${i}.mp4`;
        battlemovie.load();
    }

    const img = new Image();
    img.src = './Public/warnbg.png';
}

AdvancedLoaded()

