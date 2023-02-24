/*
 * @Author: guofuyan
 * @Date: 2022-07-15 20:58:53
 * @LastEditTime: 2023-02-23 23:09:19
 * @LastEditors: guofuyan
 * @Description: 玩家角色控制
 */
const CELL_TIME = 0.016;

//走路速度
const walkSpeed = 1;

//跑步速度
const runSpeed = 3;

import { _decorator, Component, Node, Vec3, SkeletalAnimationComponent, macro, Button, animation, math, v3 } from 'cc';
import { Facade } from '../../../default/mvc/core/Facade';
import AudioUtil from '../../../default/mvc/util/AudioUtil';
import EventMgr from '../../../default/standar/event/EventMgr';
import PlayerModel, { Player, PlayerState } from '../../model/PlayerModel';
const { ccclass, property } = _decorator;

@ccclass('PlayerCtl')
export class PlayerCtl extends Component {

    @property(Node)
    node_role: Node | null = null;

    private _animationController: animation.AnimationController | null = null;

    // 移动速度
    private _vector: Vec3 = Vec3.ZERO;

    @property(Node)
    node_camera: Node | null = null;

    //用户数据
    private player: Player = null;

    start() {

        this._animationController = this.node_role!.getComponent(animation.AnimationController);

        EventMgr.getInstance().registerListener("joysitck", this, this.joysitckHandle);       //监听摇杆数据
    }

    /** 移动摇杆触发回调 */
    private joysitckCallback(vector: Vec3, angle: number) {

        // 根据摄像机的角度旋转
        Vec3.rotateZ(vector, vector, Vec3.ZERO, this.node_camera!.eulerAngles.y * macro.RAD);

        this._vector = vector.normalize();

        if (angle) {

            // 模型初始朝前，补个90度
            this.node_role!.eulerAngles = new Vec3(0, angle + 90 + this.node_camera!.eulerAngles.y, 0);
        }
    }

    /**
     * 摇杆数据处理
     * @param self
     * @param params object
     */
    private joysitckHandle(self, params) {
        if (params.angle) {

            self.joysitckCallback(params.pos, params.angle);

        } else {

            self.joysitckCallback(params.pos);
        }
    }

    private fix_update(dt: number) {

        this.player = Facade.getInstance().getModel(PlayerModel).getPlayer();

        switch (this.player.state) {

            case PlayerState.idle:

                this._animationController?.setValue('walk', false);       //设置动画状态，待机
                this._animationController?.setValue('run', false);       //设置动画状态，待机

                break;

            case PlayerState.walk:

                this.node.setPosition(this.node.position.add3f(this._vector.x * walkSpeed * dt, 0, -this._vector.y * walkSpeed * dt));

                //设置动画状态，走路
                this._animationController?.setValue('walk', true);
                this._animationController?.setValue('run', false);

                break;

            case PlayerState.run:

                this.node.setPosition(this.node.position.add3f(this._vector.x * runSpeed * dt, 0, -this._vector.y * runSpeed * dt));

                //设置动画状态，跑步
                this._animationController?.setValue('walk', false);
                this._animationController?.setValue('run', true);

                break;
        }

        if (this._vector.lengthSqr() > 0) {

            this.player.state = this.player.sportMode;

        } else {

            this.player.state = PlayerState.idle;
        }

        // if (this._vector.lengthSqr() > 0) {

        //     //this.node.setPosition(this.node.position.add3f(this._vector.x * SPEED * dt, 0, -this._vector.y * SPEED * dt));

        //     //this._animationController?.setValue('walk', true);        //设置动画状态，走路

        //     //AudioUtil.playLoopEffect("audio/Walk");       //播放音效

        // } else {

        //     //this._animationController?.setValue('walk', false);       //设置动画状态，待机

        //     //AudioUtil.stopLoopEffect("audio/Walk");       //暂停音效
        // }
    }

    private _now_time = 0;

    update(dt: number) {

        this._now_time += dt;

        while (this._now_time >= CELL_TIME) {

            this.fix_update(CELL_TIME);

            this._now_time -= CELL_TIME;
        }
    }
}