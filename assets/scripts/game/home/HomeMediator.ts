import BaseMediator from "../../../default/mvc/core/base/BaseMediator";
import HomeView from "./HomeView";
import PlayerModel, { Player } from "../../model/PlayerModel";
import HttpUtils from "../../../default/mvc/util/HttpUtils";
import { Facade } from "../../../default/mvc/core/Facade";
import OtherMediator from "../other/OtherMediator";
import OtherView from "../other/OtherView";
import Utils from "../../../default/standar/Utils";
import { assetManager, ImageAsset, SpriteFrame, Texture2D } from "cc";


export default class HomeMediator extends BaseMediator {

    public view: HomeView;

    private player: Player;     //玩家数据

    public init(data?: any): void {

        //下面进行一些简单的示例，开发时经常用到这些功能，微信内开发几乎必不可少

        //this.initwechatBaseData();      //处理微信基础数据，例如头像、昵称、openid

        //this.dataStatistics();      //上传到服务器，进行数据统计

        //进入下一个界面
        this.bindEvent(HomeView.Enter, (str: "") => {

            Facade.getInstance().openView(OtherMediator, OtherView, "");        //进入下一个页面

            this.view.closeView();      //关闭面板

        }, this);
    }

    /**
     * 处理微信基础数据，例如头像、昵称、openid
     */
    initwechatBaseData() {

        const self = this;

        //获取地址栏信息，并保存
        this.player = this.getModel(PlayerModel).getPlayer();
        this.player.openid = Utils.getQueryVariable("openid");
        this.player.nickname = decodeURIComponent(Utils.getQueryVariable("nickname"));
        this.player.header = Utils.getQueryVariable("header");

        //下载微信头像
        if (this.player.header != null) {

            assetManager.loadRemote<ImageAsset>(this.player.header + '?aa=aa.jpg', function (err, imageAsset) {

                if (!err) {

                    const spriteFrame = new SpriteFrame();

                    const texture = new Texture2D();

                    texture.image = imageAsset;

                    spriteFrame.texture = texture;

                    self.player.headersprite = spriteFrame;
                }
            });
        }
    }

    /**
     * 上传到服务器，进行数据统计
     */
    dataStatistics() {

        let url = "http://platform.qdmedia.cc/ActivityData/addData";

        let param = {
            serial: "4xgn4C",
            data: new Date().toLocaleString() + "," + this.player.nickname + "," + this.player.header + "," + this.player.openid,
        }

        return;     //由于会真正上传，所以暂时关闭

        HttpUtils.Post(url, param, function (err: string, res: any) {

            if (!err) {

                console.log("上传统计数据成功");
            }
        });
    }

    //页面初始化时，调用
    public viewDidAppear(): void {

        //this.view.init();
    }

    //删除时调用
    public destroy(): void {

    }
}