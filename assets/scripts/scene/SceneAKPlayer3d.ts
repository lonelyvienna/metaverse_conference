
import { Component, ImageAsset,Node, Sprite, Texture2D, UITransform, _decorator, gfx, Root, SpriteFrame, assetManager, BufferAsset, AssetManager, resources, director, Button, EditBox, Slider, ProgressBar, ToggleContainer, Toggle, Label, EventHandler, SpriteAtlas, size, EventTouch, NodeEventType, tween, Quat, Tween, v3, TypeScript, geometry, Camera, PhysicsSystem } from "cc";
import { AKPlayerController } from "../akplayer/AKPlayerController";
const { ccclass,property } = _decorator;


@ccclass('SceneAKPlayer3d')
export class SceneAKPlayer3d extends Component {
    @property({ type: ToggleContainer})
    public toggle: ToggleContainer = null;
    
    @property({ type: EditBox })
    public inputUrl: EditBox = null;
    public _isStream: boolean = false;

    @property( { type: AKPlayerController})
    public akCtl: AKPlayerController = null;
    
    @property({type:Node})
    public nodeBtn:Node = null;

    @property({type:Node})
    public nodeTouch:Node = null;
    @property(Camera)
    cameraMain: Camera = null; //主摄像机
    
    private _outRay: geometry.Ray = new geometry.Ray();
    protected onEnable(): void {
        const containerEventHandler = new EventHandler();
        containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerEventHandler.component = 'SceneAKPlayer';// 这个是脚本类名
        containerEventHandler.handler = 'onToggle';
        containerEventHandler.customEventData = '';
        this.toggle?.checkEvents.push(containerEventHandler);

       
        this.nodeTouch.on(Node.EventType.TOUCH_START, this._touchBegin, this);
        this.nodeTouch.on(Node.EventType.TOUCH_END, this._touchEnd, this);
        this.nodeTouch.on(Node.EventType.TOUCH_CANCEL, this._touchEnd, this);

    
    
            
            
        this.updatePlayerInfo();
    }
    protected onDisable(): void {
        this.toggle.checkEvents = [];
        this.nodeTouch.off(Node.EventType.TOUCH_START, this._touchBegin, this);
        this.nodeTouch.off(Node.EventType.TOUCH_END, this._touchEnd, this);
        this.nodeTouch.off(Node.EventType.TOUCH_CANCEL, this._touchEnd, this);

    }
    protected onToggle(toggle: Toggle, customEventData: string):void {
        console.log(toggle);
        if(toggle.node.name.indexOf('stream')>=0){
            this._isStream = true;
            this.inputUrl.string = "http://www.ffkey.com:8080/live/livestream.flv"
        }else{
            this._isStream = false;
            this.inputUrl.string = "https://demo.ffkey.com/videodemo/videoh264.flv"

        }
        this.updatePlayerInfo();
    }

    protected updatePlayerInfo(){
        this.akCtl.updatePlayerInfo(this.inputUrl.string,this._isStream);
    }

    private _touchBegin (event: EventTouch) { }

    private _touchEnd (event: EventTouch) {
        const sub = event.getStartLocation().subtract(event.getLocation()).length()
        if (sub < 5) {
            const touchPos = event.getLocation();
            this.cameraMain.screenPointToRay(touchPos.x, touchPos.y, this._outRay);
            const hit = PhysicsSystem.instance.raycastClosest(this._outRay, 0xffffffff, 50);
            if (hit) {
                const ndClick = PhysicsSystem.instance.raycastClosestResult.collider.node;
                const ndName = ndClick.name
                console.log(ndName);
                this.akCtl.play(this.inputUrl.string,this._isStream);
                this.nodeBtn.active = false;
            }
        }
    }
}