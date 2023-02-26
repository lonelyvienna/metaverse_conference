/*
 * @Author: guofuyan
 * @Date: 2022-07-15 20:58:53
 * @LastEditTime: 2023-02-26 23:17:33
 * @LastEditors: guofuyan
 * @Description: 玩家角色控制
 */
const CELL_TIME = 0.016;

//走路速度
const walkSpeed = 1;

//跑步速度
const runSpeed = 3;

import { _decorator, Component, Node, Vec3, macro, animation, geometry, PhysicsSystem, Camera, EventTouch, Input, input, director, RigidBody, CapsuleCollider, tween } from 'cc';
import { Facade } from '../../../default/mvc/core/Facade';
import AudioUtil from '../../../default/mvc/util/AudioUtil';
import EventMgr from '../../../default/standar/event/EventMgr';
import PlayerModel, { Player, PlayerState } from '../../model/PlayerModel';
import { Chair } from './Chair';
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
    private mainCamera: Camera = null;

    start() {

        this._animationController = this.node_role!.getComponent(animation.AnimationController);

        this.mainCamera = this.node_camera.getComponent(Camera);

        EventMgr.getInstance().registerListener("joysitck", this, this.joysitckHandle);       //监听摇杆数据

        EventMgr.getInstance().registerListener("InputJump", this, this.jump);       //跳跃
    }

    onEnable() {

        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onDisable() {

        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
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

        if (self.player.state == PlayerState.sit) return;     //如果是坐下，则摇杆操作忽略

        if (params.angle) {

            self.joysitckCallback(params.pos, params.angle);

        } else {

            self.joysitckCallback(params.pos);
        }
    }

    private fix_update(dt: number) {

        if (!this.player) this.player = Facade.getInstance().getModel(PlayerModel).getPlayer();

        this.setPlayerState(this.player.state);     //改变动作

        //玩家位移操作
        if (this.player.state == PlayerState.walk)
            this.node.setPosition(this.node.position.add3f(this._vector.x * walkSpeed * dt, 0, -this._vector.y * walkSpeed * dt));
        else if (this.player.state == PlayerState.run)
            this.node.setPosition(this.node.position.add3f(this._vector.x * runSpeed * dt, 0, -this._vector.y * runSpeed * dt));

        //如果不是坐的状态，则摇杆的数值才有效
        if (this.player.sportMode != PlayerState.sit) {

            if (this._vector.lengthSqr() > 0) {

                this.player.state = this.player.sportMode;

            } else {

                this.player.state = PlayerState.idle;
            }
        }
    }

    private _now_time = 0;

    update(dt: number) {

        this._now_time += dt;

        while (this._now_time >= CELL_TIME) {

            this.fix_update(CELL_TIME);

            this._now_time -= CELL_TIME;
        }
    }

    private _ray: geometry.Ray = new geometry.Ray();
    onTouchStart(event: EventTouch) {

        const touch = event.touch!;

        let point = this.mainCamera.screenToWorld(new Vec3(touch.getLocationX(), touch.getLocationY(), 0))

        geometry.Ray.fromPoints(this._ray, this.node_camera.worldPosition, point);

        if (PhysicsSystem.instance.raycast(this._ray)) {

            const raycastResults = PhysicsSystem.instance.raycastResults;

            for (let i = 0; i < raycastResults.length; i++) {

                const item = raycastResults[i];

                //console.log(item.collider.node.name);

                if (item.collider.node.name == "SitTip") this.sitDowm(item.collider.node.parent);        //坐在位置上
            }
        }
    }

    /**
     * 坐在位置上
     */
    sitDowm(chair: Node) {

        this.player.onChairNode = chair.getComponent(Chair);        //记录目前坐在哪一张椅子上

        chair.getComponent(Chair).takeASeat();      //入座

        //关闭玩家的碰撞体
        this.node.getComponent(CapsuleCollider).enabled = false;
        this.node.getComponent(RigidBody).enabled = false;

        //改变玩家位置，坐下
        this.node.setWorldPosition(new Vec3(chair.worldPosition.x, 0, chair.worldPosition.z - 0.26));
        this.node.setWorldRotationFromEuler(0, 180, 0);       //改变朝向

        //标定玩家的状态
        this.player.sportMode = PlayerState.sit;
        this.player.state = PlayerState.sit;
    }

    /**
     * 跳跃或站起来
     */
    jump(self, params) {

        //如果是坐的姿态，则站起来
        if (self.player.state == PlayerState.sit) {

            self.setPlayerState(PlayerState.idle);      //站着的姿势

            self.player.onChairNode.standUp();      //玩家站起来，离开椅子

            if (params.currentSportMode == "walk")
                self.player.sportMode = PlayerState.walk;
            else
                self.player.sportMode = PlayerState.run;

            //设定位置
            self.node.setWorldPosition(new Vec3(self.node.getWorldPosition().x, 0, self.node.getWorldPosition().z - 0.8));

            // //打开碰撞器和刚体
            self.node.getComponent(CapsuleCollider).enabled = true;
            self.node.getComponent(RigidBody).enabled = true;
        }
    }

    /**
     * 设置玩家的动作
     */
    setPlayerState(state: PlayerState) {

        this.player.state == state;

        switch (state) {

            case PlayerState.idle:

                //设置动画状态，休息
                this._animationController?.setValue('sit', false);
                this._animationController?.setValue('walk', false);
                this._animationController?.setValue('run', false);

                break;

            case PlayerState.walk:

                //设置动画状态，走路
                this._animationController?.setValue('sit', false);
                this._animationController?.setValue('walk', true);
                this._animationController?.setValue('run', false);

                break;

            case PlayerState.run:

                //设置动画状态，跑步
                this._animationController?.setValue('sit', false);
                this._animationController?.setValue('walk', false);
                this._animationController?.setValue('run', true);

                break;

            case PlayerState.sit:

                //设置动画状态，坐
                this._animationController?.setValue('sit', true);
                this._animationController?.setValue('walk', false);
                this._animationController?.setValue('run', false);

                break;
        }
    }
}