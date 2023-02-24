/*
 * @Author: guofuyan
 * @Date: 2023-02-24 18:17:19
 * @LastEditTime: 2023-02-24 19:10:24
 * @Description: 
 */
import { _decorator, Component, Node, ITriggerEvent, BoxCollider, director, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Chair')
export class Chair extends Component {

    private sitTip: Node = null;        //坐下的标识

    private mainCamera: Node = null;

    public start() {

        //默认隐藏坐下的标识
        this.sitTip = this.node.getChildByName("SitTip");
        if (this.sitTip != null) this.sitTip.setScale(Vec3.ZERO);

        //查找相机
        this.mainCamera = director.getScene().getChildByName("Main Camera");

        //注册触发器
        let collider = this.node.getComponents(BoxCollider)[1];

        collider.on('onTriggerEnter', this.onTriggerEnter, this);
        collider.on('onTriggerExit', this.onTriggerExit, this);
    }

    update(dt: number) {

        if (this.sitTip.activeInHierarchy) this.sitTip.lookAt(this.mainCamera.position);        //面向主相机
    }

    /**
     * 人靠近椅子
     */
    private onTriggerEnter(event: ITriggerEvent) {

        let node = event.otherCollider.node;        //触发器碰撞到的物体;

        if (node.name == "Player") {

            tween(this.sitTip)
                .to(.2, { scale: new Vec3(.8, .8, .8) })
                .start()
        }
    }

    /**
     * 人离开椅子
     */
    private onTriggerExit(event: ITriggerEvent) {

        let node = event.otherCollider.node;        //触发器碰撞到的物体;

        if (node.name == "Player") {

            tween(this.sitTip)
            .to(.2, { scale: Vec3.ZERO })
            .start()
        }
    }
}