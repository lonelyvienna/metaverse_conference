/*
 * @Author: guofuyan
 * @Date: 2022-06-16 14:17:22
 * @LastEditTime: 2022-06-16 14:17:43
 * @Description: API接口
 */
import { Component, _decorator } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export default class API extends Component {

    //获取微信用户信息和gallery_id    Post:openid   
    public static getGallery_id = "http://mp.qdmedia.cc/api/Wechat/user_login";    
}
