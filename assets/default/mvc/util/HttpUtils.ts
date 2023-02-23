import { Component, _decorator } from "cc";

const {ccclass, property} = _decorator;

@ccclass
export default class HttpUtils extends Component {

    /**
     * Get方法
     * @param {请求网址} url
     * @param {请求参数} params
     * @param {回调} callback
     * @param {头部参数} headParams
     */
    public static Get(url: string, params: any, callback: Function, headParams: any = null) {

        //拼接请求参数
        let paramsMerge = "";

        for (let item in params) {

            if(paramsMerge == ""){

                paramsMerge += "?" + item + "=" + params[item];

            }else{

                paramsMerge += "&" + item + "=" + params[item];
            }
        }

        url += paramsMerge;

        let xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {

            //如果请求状态为Done的话，则执行回调
            if (xhr.readyState == 4) {

                if (xhr.status >= 200 && xhr.status < 400) {

                    let response = xhr.responseText;

                    callback(null, response);

                } else {

                    callback("error", xhr.responseText);
                }

            }
        };

        xhr.open("GET", url, true);

        if (headParams) {

            for (let key in headParams) {

                xhr.setRequestHeader(key, headParams[key]);
            }
        }

        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.send();
    }

    /**
     * Post请求，表单提交
     * @param url 请求的网址
     * @param params 请求的数据
     * @param callback 回调函数
     */
    public static Post(url: string, params: any, callback: any, headParams: any = null) {

        //拼接请求参数
        let param = "";

        for (let item in params) {

            param += item + "=" + params[item] + "&";
        }

        //console.log(param);

        //发起请求
        let xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {

            if (xhr.readyState == 4) {

                if (xhr.status >= 200 && xhr.status < 400) {

                    let response = xhr.responseText;

                    callback(null, response);

                } else {

                    callback("error", xhr.responseText);
                }
            }
        };

        xhr.open("POST", url, true);

        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        if (headParams) {

            for (let key in headParams) {

                xhr.setRequestHeader(key, headParams[key]);
            }
        }

        xhr.send(param);    //reqData为字符串形式： "key=value"
    }
}