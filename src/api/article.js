//导入请求工具类
import request from "@/utils/request.js";
import { useTokenStore } from "@/stores/token.js";

//文章分类列表查询
export const articleCategoryListService = () => {
  // //获取token
  // const tokenStore = useTokenStore();
  // return request.get("/category", {
  //   headers: {
  //     Authorization: tokenStore.token,
  //   },
  // });

  // 将把token添加到请求头的操作交给请求拦截器操作
  return request.get("/category");
};

// 添加文章分类
export const articleCategoryAddService = (categoryModel) => {
  return request.post("/category", categoryModel);
};

// 修改文章分类
export const articleCategoryUpdateService = (categoryModel) => {
  return request.put("/category", categoryModel);
};

// 删除文章分类
export const articleCategoryDeleteService = (categoryId) => {
  return request.delete(`/category?id=${categoryId}`);
};

// 文章列表查询
export const articleListService = (params) => {
  return request.get("/article", { params: params });
};

// 添加文章
export const articleAddService = (articleModel) => {
  return request.post("/article", articleModel);
};

// 修改文章
export const articleUpdateService = (articleModel) => {
  return request.put("/article", articleModel);
};

// 删除文章
export const articleDeleteService = (articleId) => {
  return request.delete(`/article?id=${articleId}`);
};
