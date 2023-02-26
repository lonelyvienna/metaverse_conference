/*
 * @Author: guofuyan
 * @Date: 2023-02-24 18:17:19
 * @LastEditTime: 2023-02-26 22:53:58
 * @Description:
 */
import { _decorator, Component, Node, director, Vec3, instantiate, Prefab, tween, BoxCollider } from 'cc';
import { Facade } from '../../../default/mvc/core/Facade';
import ITResourceLoader from '../../../default/mvc/loader/ITResourceLoader';
import PlayerModel, { Player, PlayerState } from '../../model/PlayerModel';
const { ccclass, property } = _decorator;

@ccclass('Chair')
export class Chair extends Component {

    public personSittingState: boolean = false;     //位置是否有人

    private sitTip: Node = null;        //坐下的标识

    private mainCamera: Node = null;

    private playerNode: Node = null;

    private isPlayerIn: boolean = false;       //玩家是否进入
    private preIsPlayerIn: boolean = false;        //玩家是否进入的前一个状态
    private player: Player = null;      //用户数据

    public start() {

        //查找相机
        this.mainCamera = director.getScene().getChildByName("Main Camera");

        this.playerNode = director.getScene().getChildByName("Player");

        this.player = Facade.getInstance().getModel(PlayerModel).getPlayer();

        this.creatSitTip();     //如果不存在节点，创建
    }

    update(dt: number) {

        if (this.personSittingState || !this.sitTip) return;     //如果有人坐在位置，则不进行以下的操作

        //面向摄像机
        if (this.sitTip.activeInHierarchy) this.sitTip.lookAt(this.mainCamera.position);

        //判断与玩家的距离，决定是否显示“坐下”标记
        if (Vec3.distance(this.node.worldPosition, this.playerNode.worldPosition) < 2) this.isPlayerIn = true;
        else this.isPlayerIn = false;

        //如果用户是坐着的，则任何椅子不再检测是否靠近
        if (this.player.state == PlayerState.sit) this.isPlayerIn = false;

        //用户进入或者离开识别范围，进行“坐下”标记的动画
        if (this.isPlayerIn != this.preIsPlayerIn) {

            if (this.isPlayerIn)
                tween(this.sitTip)
                    .to(.5, { scale: Vec3.ONE })
                    .start()
            else
                tween(this.sitTip)
                    .to(.5, { scale: Vec3.ZERO })
                    .start()

            this.preIsPlayerIn = this.isPlayerIn;
        }
    }

    /**
     * 创建提示
     */
    creatSitTip() {

        var self = this;

        ITResourceLoader.loadRes("prefab/game/SitTip", Prefab, (err: any, res: Prefab) => {

            if (!err) {

                self.sitTip = instantiate(res);        //实例化

                self.node.addChild(self.sitTip);     //添加到场景

                self.sitTip.setScale(Vec3.ZERO);        //默认隐藏
            }
        });
    }

    /**
     * 坐下
     */
    takeASeat() {

        this.personSittingState = true;

        this.sitTip.setScale(Vec3.ZERO);
    }

    /**
     * 站起来
     */
    standUp() { this.personSittingState = false; }
}