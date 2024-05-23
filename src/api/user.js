// 导入request.js请求工具
import request from "@/utils/request.js";

// 提供调用注册接口的函数
export const userRegisterService = (registerData) => {
  // 借助于UrlSearchParams完成传递，nodejs提供的
  const params = new URLSearchParams();
  for (let key in registerData) {
    params.append(key, registerData[key]);
  }
  return request.post("/user/register", params);
};

// 调用登录接口的函数
export const userLoginService = (loginData) => {
  // 借助于UrlSearchParams完成传递，nodejs提供的
  const params = new URLSearchParams();
  for (let key in loginData) {
    params.append(key, loginData[key]);
  }
  return request.post("/user/login", params);
};

// 获取用户的详细信息
export const userInfoGetService = () => {
  return request.get("/user/userInfo");
};

// 用户修改个人信息
export const userInfoUpdateService = (userInfo) => {
  return request.put("/user/update", userInfo);
};

//修改头像
export const userAvatarUpdateService = (avatarUrl) => {
  let params = new URLSearchParams();
  params.append("avatarUrl", avatarUrl);
  return request.patch("/user/updateAvatar", params);
};

// 修改密码
export const userPasswordUpdateService = (password) => {
  return request.patch("/user/updatePwd", password);
};
