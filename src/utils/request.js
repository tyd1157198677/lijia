import axios from "axios";
import CryptoJS from "crypto-js";
import urlencode from "urlencode";
import { Notification, MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";
import errorCode from "@/utils/errorCode";
import { tansParams } from "@/utils/ruoyi";
import request from "@/utils/request";
axios.defaults.headers["from-source"] = "system";
axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8"; 
var dataname; 
function Proxynowdate() {
  //将时间格式转为字符串
  var offset = new Date(Date.now() - 1 * 8 * 60 * 60 * 1000);
  var date = "date: " + offset;
  date = date.split(" ");
  date =    date[1] + ", " + date[3] + " " + date[2] + " " + date[4] + " " + date[5] + " GMT";
 
  //获取服务器端时间
  // var xhr = null;
  // if (window.XMLHttpRequest) {
  //   xhr = new window.XMLHttpRequest();
  // } else {
  //   // ie
  //   xhr = new ActiveObject("Microsoft");
  // }
  // xhr.open("GET", "/lijia/", false); //false不可变
  // xhr.send(null);
  // var date = xhr.getResponseHeader("Date");
  dataname = date;
  return date;
}
function ProxynowAut() {
  //获取服务器端时间
  var datanew = "date: " + dataname;
  let result = CryptoJS.HmacSHA1(datanew, "lijia-secret");
  let sig = result.toString(CryptoJS.enc.Base64);
  sig = encodeURI(sig);
  // axios.defaults.headers["ProxyDate"] = date;
  return (
    'hmac username="lijia",algorithm="hmac-sha1",headers="date",signature="' +
    sig +
    '"'
  );
}

//网页请求类型是http还是https
var ishttps = "https:" == document.location.protocol ? true : false;
var httpprotocol = "http";
if (ishttps) {
  var httpprotocol = "https";
} else {
  var httpprotocol = "http";
}
var baseURL = "";
if (process.env.NODE_ENV != "development") {
  if (document.location.hostname == "ljlife.lijiazhengli.com") {
    baseURL = "http://ljlife.lijiazhengli.com";
  } else {
    baseURL = httpprotocol + "://app-api.lijiazhengli.com";
  }
} else {
  baseURL = process.env.VUE_APP_BASE_API;
}
// 创建axios实例 http://ljlife.lijiazhengli.com
const service = axios.create({
  //  baseURL: '/',
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: baseURL,
  // 超时
  timeout: 500000
});

// request拦截器
service.interceptors.request.use(
  config => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false;
    if (getToken() && !isToken) {
      config.headers["Authorization"] = "Bearer " + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    config.headers["ProxyDate"] = Proxynowdate();
    config.headers["ProxyAuthorization"] = ProxynowAut();
    config.headers["liJiaVersion"]="1.1.0";
    // get请求映射params参数
    if (config.method === "get" && config.params) {
      let url = config.url + "?" + tansParams(config.params);
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }
    return config;
  },
  error => {
    console.log(error);
    Promise.reject(error);
  }
);
// 响应拦截器
service.interceptors.response.use(
  res => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode["default"];
    if (code === 401) {
      Message({
        message: "登录状态已过期,请重新登录！",
        type: "error"
      });
      store.dispatch("LogOut").then(() => {
        location.href = "/lijia/index";
      });
      // MessageBox.confirm(
      //   "登录状态已过期，您可以继续留在该页面，或者重新登录",
      //   "系统提示",
      //   {
      //     confirmButtonText: "重新登录",
      //     cancelButtonText: "取消",
      //     type: "warning"
      //   }
      // )
      //   .then(() => {
      //     store.dispatch("LogOut").then(() => {
      //       location.href = "/lijia/index";
      //     });
      //   })
      //   .catch(() => {});
      return Promise.reject();
    } else if (code === 100403) {
      store.dispatch("RefreshTokenone").then(() => {});
      return request(res.config);
    } else if (code === 500) {
      Message({
        message: msg,
        type: "error"
      });
      return Promise.reject(new Error(msg));
    } else if (code !== 200) {
      Notification.error({
        title: msg
      });
      return Promise.reject("error");
    } else {
      return res.data;
    }
  },
  error => {
    console.log("err" + error);
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    Message({
      message: message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

// 通用下载方法
export function download(url, params, filename) {
  return service
    .post(url, params, {
      transformRequest: [
        params => {
          return tansParams(params);
        }
      ],
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      responseType: "blob"
    })
    .then(data => {
      const content = data;
      const blob = new Blob([content]);
      if ("download" in document.createElement("a")) {
        const elink = document.createElement("a");
        elink.download = filename;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href);
        document.body.removeChild(elink);
      } else {
        navigator.msSaveBlob(blob, filename);
      }
    })
    .catch(r => {
      console.error(r);
    });
}

export default service;
