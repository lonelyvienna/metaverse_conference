/*
 * @Author: guofuyan
 * @Date: 2022-06-16 11:00:17
 * @LastEditTime: 2022-07-16 09:13:39
 * @Description: 玩家数据类
 */

import { SpriteFrame } from "cc";
import BaseModel from "../../default/mvc/core/base/BaseModel";
import Notification from "../Notification";

export default class PlayerModel extends BaseModel {

    private _player: Player;

    public _gameConfig: GameConfig;        //游戏中的设置，例如播放背景音乐等

    public isGaming: boolean = false;          //游戏是否开始

    public init(): void {

        console.log("初始化用户数据模块");

        this._player = new Player("");

        this._gameConfig = new GameConfig();
    }

    /**
     * 开始游戏
     */
    startGame(){

        this.isGaming = true;       //开始游戏

        this.sendNoti(Notification.StartGame,"");
    }

    public getPlayer(): Player {

        return this._player;
    }

    /**
     * 切换音乐播放状态
     * @param isPlaying 音乐的播放状态
     */
    public musicStateChange(isPlaying: boolean): void {

        this._gameConfig.musicIsPlaying = isPlaying;

        if (isPlaying) {

            this.sendNoti(Notification.MUSIC_PLAYING);

        } else {

            this.sendNoti(Notification.MUSIC_PAUSE);
        }
    }

    public clear(): void {

    }
}

/**
 * 游戏中基础信息
 */
export class Player {

    public openid: string;      //微信openid

    public wechatid: string;    //微信wechatid

    public nickname: string;     //微信名称

    public header: string;       //微信头像

    public headersprite: SpriteFrame
    public constructor(openid: string) {

        this.openid = openid;

        //this.writeDebugData();
    }

    /**
     * 测试数据
     */
    /* private writeDebugData() {

         this.areaInfoList.push(new AreaInfo("全部"));
     }*/
}

/**
 * 用户所拥有的的区域和信息
 */
export class GameConfig {

    public musicIsPlaying: boolean = true;        //背景音乐是否正在播放
}
