<script setup>
import { Edit, Delete, Plus } from "@element-plus/icons-vue";
import { ref } from "vue";
import {
  articleCategoryListService,
  articleListService,
  articleAddService,
  articleUpdateService,
  articleDeleteService,
} from "@/api/article.js";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

//文章分类数据模型
const categorys = ref([
  {
    id: 3,
    categoryName: "美食",
    categoryAlias: "my",
    createTime: "2023-09-02 12:06:59",
    updateTime: "2023-09-02 12:06:59",
  },
  {
    id: 4,
    categoryName: "娱乐",
    categoryAlias: "yl",
    createTime: "2023-09-02 12:08:16",
    updateTime: "2023-09-02 12:08:16",
  },
  {
    id: 5,
    categoryName: "军事",
    categoryAlias: "js",
    createTime: "2023-09-02 12:08:33",
    updateTime: "2023-09-02 12:08:33",
  },
]);

//用户搜索时选中的分类id
const categoryId = ref("");

//用户搜索时选中的发布状态
const state = ref("");

//文章列表数据模型
const articles = ref([
  {
    id: 5,
    title: "陕西旅游攻略",
    content: "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
    coverImg:
      "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
    state: "草稿",
    categoryId: 2,
    createTime: "2023-09-03 11:55:30",
    updateTime: "2023-09-03 11:55:30",
  },
  {
    id: 5,
    title: "陕西旅游攻略",
    content: "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
    coverImg:
      "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
    state: "草稿",
    categoryId: 2,
    createTime: "2023-09-03 11:55:30",
    updateTime: "2023-09-03 11:55:30",
  },
  {
    id: 5,
    title: "陕西旅游攻略",
    content: "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
    coverImg:
      "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
    state: "草稿",
    categoryId: 2,
    createTime: "2023-09-03 11:55:30",
    updateTime: "2023-09-03 11:55:30",
  },
]);

//分页条数据模型
const pageNum = ref(1); //当前页
const total = ref(10); //总条数
const pageSize = ref(5); //每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size;
  getArticleList();
};
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num;
  getArticleList();
};

// 文章分类下拉框显示
const getArticleCategoryList = async () => {
  const result = await articleCategoryListService();
  categorys.value = result.data;
};
getArticleCategoryList();

// 文章列表查询
const getArticleList = async () => {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    categoryId: categoryId.value ? categoryId.value : null,
    state: state.value ? state.value : null,
  };
  let result = await articleListService(params);
  // 渲染列表数据
  articles.value = result.data.items;
  // 渲染总条数
  total.value = result.data.total;
  // 为列表添加categoryName属性
  for (let i = 0; i < articles.value.length; i++) {
    let article = articles.value[i];
    for (let j = 0; j < categorys.value.length; j++) {
      if (article.categoryId === categorys.value[j].id) {
        article.categoryName = categorys.value[j].categoryName;
      }
    }
  }
};
getArticleList();

//控制抽屉是否显示
const visibleDrawer = ref(false);
//添加表单数据模型
const articleModel = ref({
  title: "",
  categoryId: "",
  coverImg: "",
  content: "",
  state: "",
});

import { useTokenStore } from "@/stores/token.js";
import { ElMessage, ElMessageBox } from "element-plus";
const tokenStore = useTokenStore();
//上传图片成功回调
const uploadSuccess = (img) => {
  articleModel.value.coverImg = img.data;
};

// 添加文章
const addArticle = async (state) => {
  // 把发布状态赋值给数据模型
  articleModel.value.state = state;
  // 没有阿里云返回url地址，默认赋值
  if (!articleModel.value.coverImg) {
    articleModel.value.coverImg =
      "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png";
  }

  // 调用接口
  let result = await articleAddService(articleModel.value);
  ElMessage.success(result.message ? result.message : "添加成功");
  // 隐藏抽屉
  visibleDrawer.value = false;
  // 刷新数据
  getArticleList();
  clearArticleModel();
};

// 自主编写文章更新和删除的代码
// 文章更新
const updateArticle = async () => {
  let result = await articleUpdateService(articleModel.value);
  ElMessage.success(result.message ? result.message : "修改成功");
  visibleDrawer.value = false;
  getArticleList();
};

// 文章删除
const deleteArticle = async (row) => {
  ElMessageBox.confirm("你确认删除该文章信息吗？", "温馨提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      //用户点击了确认
      let result = await articleDeleteService(row.id);
      ElMessage.success(result.message ? result.message : "删除成功");
      //再次调用getArticleList，获取所有文章
      getArticleList();
    })
    .catch(() => {
      //用户点击了取消
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};

// 清空文章数据模型
const clearArticleModel = () => {
  articleModel.value = {
    title: "",
    categoryId: "",
    coverImg: "",
    content: "",
    state: "",
  };
};

// 动态展示弹窗标题
const drawerTitle = ref("");
// 数据的编辑功能，数据回显
const showDrawer = (row) => {
  // 修改标题
  drawerTitle.value = "修改文章";
  // 抽屉显示
  visibleDrawer.value = true;
  // 回显数据
  articleModel.value = {
    id: row.id,
    title: row.title,
    categoryId: row.categoryId,
    coverImg: row.coverImg,
    content: row.content,
    state: row.state,
  };
};
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章管理</span>
        <div class="extra">
          <el-button
            type="primary"
            @click="
              visibleDrawer = true;
              drawerTitle = '添加文章';
              clearArticleModel();
            "
          >
            添加文章
          </el-button>
        </div>
      </div>
    </template>
    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <el-select placeholder="请选择" v-model="categoryId">
          <el-option
            v-for="c in categorys"
            :key="c.id"
            :label="c.categoryName"
            :value="c.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="发布状态：">
        <el-select placeholder="请选择" v-model="state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getArticleList">搜索</el-button>
        <el-button
          @click="
            categoryId = '';
            state = '';
            getArticleList();
          "
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 文章列表 -->
    <el-table :data="articles" style="width: 100%">
      <el-table-column
        label="文章标题"
        width="200"
        prop="title"
      ></el-table-column>
      <el-table-column label="分类" prop="categoryName"></el-table-column>
      <el-table-column
        label="发表时间"
        width="200"
        prop="createTime"
      ></el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="showDrawer(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="deleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 分页条 -->
    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :page-sizes="[3, 5, 10, 15]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
    <!-- 添加文章编辑抽屉  -->
    <el-drawer
      v-model="visibleDrawer"
      :title="drawerTitle"
      direction="rtl"
      size="50%"
    >
      <!-- 添加文章表单 -->
      <el-form :model="articleModel" label-width="100px">
        <el-form-item label="文章标题">
          <el-input
            v-model="articleModel.title"
            placeholder="请输入标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="文章分类">
          <el-select placeholder="请选择" v-model="articleModel.categoryId">
            <el-option
              v-for="c in categorys"
              :key="c.id"
              :label="c.categoryName"
              :value="c.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章封面">
          <el-upload
            class="avatar-uploader"
            :auto-upload="true"
            :show-file-list="false"
            action="/api/upload"
            name="file"
            :headers="{ Authorization: tokenStore.token }"
            :on-success="uploadSuccess"
          >
            <img
              v-if="articleModel.coverImg"
              :src="articleModel.coverImg"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="文章内容">
          <div class="editor">
            <quill-editor
              theme="snow"
              v-model:content="articleModel.content"
              contentType="html"
            >
            </quill-editor>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="
              drawerTitle === '添加文章'
                ? addArticle('已发布')
                : updateArticle()
            "
          >
            发布
          </el-button>
          <el-button
            type="info"
            @click="
              drawerTitle === '添加文章' ? addArticle('草稿') : updateArticle()
            "
            >草稿</el-button
          >
        </el-form-item>
      </el-form>
    </el-drawer>
  </el-card>
</template>
<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
/* 抽屉样式 */
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
