'use strict';

// TODO 2010 年から 2015 年にかけて 15〜19 歳の人が増えた割合の都道府県ランキング

// 1.ファイルからデータを読み取る
// repuire … モジュールを読み込む　javaでいうimport
const fs = require('fs');　//fs …　ファイルを扱うモジュール
const readline = require('readline'); //readline …　一行ずつ読み込むモジュール
const rs = fs.createReadStream('./popu-pref.csv'); //ファイルを読み込むスクリームを作成
const rl = readline.createInterface({ 'input': rs, 'output': {} }); //readline オブジェクトの input としてrsを設定
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
//on …　イベント検知
rl.on('line', (lineString) => { //rl で line(一行読んだら) というイベントが発生したら 無名関数を呼ぶ、
    // 2.2010 年と 2015 年のデータを選ぶ
    const colums = lineString.split(',');
    const year = parseInt(colums[0]);
    const prefecture = colums[1];
    const popu = parseInt(colums[3]);
    
    if (year === 2010 || year === 2015) {
        let value = prefectureDataMap.get(prefecture);    
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }//if

        if (year === 2010) {
            value.popu10 = popu;
        }//if
    
        if (year === 2015) {
            value.popu15 = popu;
        }//if

        prefectureDataMap.set(prefecture, value);
    }//if
});

rl.on('close', () => { //全部読み終わったら
    for (let [key, value] of prefectureDataMap ) { //let [key. value]ではkey使っていないが、書かないと動かないので形式的に描く。
        value.change = value.popu15 / value.popu10;
    }//for
    //連想配列を普通の配列に変換する処理をして、ソートしている
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value]) => {
        return `${key}: ${value.popu10} => +${value.popu15} 変化率: ${value.change}`;
    });

    console.log(rankingStrings);
});


/*

都道府県ごとの変化率を計算する
変化率ごとに並べる
並べられたものを表示する


*/

//
