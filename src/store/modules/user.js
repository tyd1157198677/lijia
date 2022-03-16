import Cookies from 'js-cookie'

import { login, logout, getInfo, refreshToken } from "@/api/login";
import { getToken, setToken, getTokens, setTokens, removeTokens ,setExpiresIn, removeToken } from "@/utils/auth";

const user = {
  state: {
    token: getToken(),
    name: "",
    avatar: "",
    roles: [],
    permissions: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_EXPIRES_IN: (state, time) => {
      state.expires_in = time;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions;
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) { 
      const username = userInfo.username.trim();
      const password = userInfo.password;
      const code = userInfo.code;
      const uuid = userInfo.uuid;
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid)
          .then(res => {
            let data = res.data;  
            getTokens()
            setToken(data.token); 
            setTokens(data.refreshToken);
            commit("SET_TOKEN", data.token);
            setExpiresIn(data.expires_in); 
            commit("SET_EXPIRES_IN", data.expires_in);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then(res => {
            const user = res.user;
            const avatar =
              user.avatar == ""
                ? require("@/assets/images/profile.jpg")
                : user.avatar;
            if (res.roles && res.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              commit("SET_ROLES", res.roles);
              commit("SET_PERMISSIONS", res.permissions);
            } else {
              commit("SET_ROLES", ["ROLE_DEFAULT"]);
            }
            commit("SET_NAME", user.userName);
            commit("SET_AVATAR", avatar);
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 刷新token
    RefreshTokenone({ commit, state }) {
      return new Promise((resolve, reject) => { 
        var refreshTokens=Cookies.get("Refresh-Token");  
        refreshToken(refreshTokens).then(res => {
          if(res.code==200){
            let data = res.data; 
            // setToken(data.access_token);
            // commit("SET_TOKEN", data.access_token);

            getTokens()
            setToken(data.token); 
            setTokens(data.refreshToken);
            commit("SET_TOKEN", data.token);
            setExpiresIn(data.expires_in); 
            commit("SET_EXPIRES_IN", data.expires_in);
            resolve();
          }else{
            store.dispatch("LogOut").then(() => {
              location.href = "/lijia/index";
            });
          }
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => { 
            commit("SET_TOKEN", "");
            commit("SET_ROLES", []);
            commit("SET_PERMISSIONS", []);
            removeToken();
            removeTokens();
            resolve();
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit("SET_TOKEN", "");
        removeToken();
        removeTokens();
        resolve();
      });
    }
  }
};

export default user;
