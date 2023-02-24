/*
 * @Author: guofuyan
 * @Date: 2022-06-16 01:02:47
 * @LastEditTime: 2023-02-23 23:49:25
 * @LastEditors: guofuyan
 * @Description:
 */
import { Button, director, Sprite, SpriteFrame, _decorator } from "cc";
import { BaseView } from "../../../default/mvc/core/base/BaseView";
import AudioUtil from "../../../default/mvc/util/AudioUtil";
import UIEffectHelper from "../../../default/standar/UIEffectHelper";
import { PlayerState } from "../../model/PlayerModel";
const { ccclass, property } = _decorator;

@ccclass
export default class HomeView extends BaseView {

    public static readonly Enter = "Enter";

    public static readonly EventChangeAnimationState = "ChangeAnimationState";

    @property(Button)
    public walkOrRunButton : Button = null;

    @property(SpriteFrame)
    public walkSpriteFrame: SpriteFrame = null;        //走的贴图

    @property(SpriteFrame)
    public runSpriteFrame: SpriteFrame = null;     //跑的贴图

    public init(data?: any): void {

        //UIEffectHelper.fade(this.node);     //淡入效果
    }

    OnClick() {

        var self = this;

        AudioUtil.playEffect("audioclip/effect");       //播放音效

        UIEffectHelper.fade(this.node, false, function () {

            //AudioUtil.removeEffectFromPool("audioclip/effect");       //移除音效

            self.sendEvent(HomeView.Enter, "");     //跳转到下一个页面
        });
    }

    /**
     * 改变玩家动画的状态，走或者跑
     */
    onChangeAnimationState() {

        this.sendEvent(HomeView.EventChangeAnimationState, "");

        AudioUtil.playEffect("audio/Click");       //播放音效
    }

    /**
     * 设置走或者跑的贴图
     * @param state 运动状态
     */
    setWalkOrRunSpriteFrameByState(state: PlayerState) {

        if(state == PlayerState.walk)
            this.walkOrRunButton.getComponent(Sprite).spriteFrame = this.walkSpriteFrame;

        else if(state == PlayerState.run)
            this.walkOrRunButton.getComponent(Sprite).spriteFrame = this.runSpriteFrame;
    }

    public static path(): string {

        return "prefab/ui/HomePage";
    }
}