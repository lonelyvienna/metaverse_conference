/*
 * @Author: guofuyan
 * @Date: 2022-06-16 01:02:47
 * @LastEditTime: 2023-02-22 23:49:53
 * @LastEditors: guofuyan
 * @Description:
 */
import { director, _decorator } from "cc";
import { BaseView } from "../../../default/mvc/core/base/BaseView";
import AudioUtil from "../../../default/mvc/util/AudioUtil";
import UIEffectHelper from "../../../default/standar/UIEffectHelper";
const { ccclass, property } = _decorator;

@ccclass
export default class HomeView extends BaseView {

    public static readonly Enter = "Enter";

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

    public static path(): string {

        return "prefab/ui/HomePage";
    }
}