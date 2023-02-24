/*
 * @Author: guofuyan
 * @Date: 2022-06-16 21:34:12
 * @LastEditTime: 2022-06-16 23:15:56
 * @LastEditors: guofuyan
 * @Description:
 */
import { _decorator } from "cc";
import { BaseView } from "../../../default/mvc/core/base/BaseView";
import AudioUtil from "../../../default/mvc/util/AudioUtil";
import UIEffectHelper from "../../../default/standar/UIEffectHelper";

const { ccclass, property } = _decorator;

@ccclass
export default class OtherView extends BaseView {

    public static readonly Enter = "Enter";

    public init(data?: any): void {

        UIEffectHelper.fade(this.node);     //淡入
    }

    OnClick() {

        var self = this;

        AudioUtil.playEffect("audioclip/effect");       //播放音效

        //淡出效果
        UIEffectHelper.fade(this.node, false, function () {

            self.sendEvent(OtherView.Enter, "");     //返回上一页
        });
    }

    public static path(): string {

        return "prefab/ui/OtherPage";
    }
}