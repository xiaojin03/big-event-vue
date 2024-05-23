<script setup>
import { ref } from "vue";
import { userPasswordUpdateService } from "@/api/user.js";
import { ElMessage } from "element-plus";

const passwordData = ref({
  old_pwd: "",
  new_pwd: "",
  re_pwd: "",
});

//校验密码的函数
const checkRePassword = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== passwordData.value.new_pwd) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

const rules = {
  old_pwd: [
    { required: true, message: "请输入原密码", trigger: "blur" },
    {
      min: 5,
      max: 16,
      message: "输入原密码错误",
      trigger: "blur",
    },
  ],
  new_pwd: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    {
      min: 5,
      max: 16,
      message: "长度为5~16位非空字符",
      trigger: "blur",
    },
  ],
  re_pwd: [{ validator: checkRePassword, trigger: "blur" }],
};

// 修改密码函数
const updatePassword = async () => {
  console.log(passwordData);
  let result = await userPasswordUpdateService(passwordData.value);
  console.log(result);
  ElMessage.success(result.message ? result.message : "修改成功");
};
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>基本资料</span>
      </div>
    </template>
    <el-row>
      <el-col :span="12">
        <el-form
          :model="passwordData"
          :rules="rules"
          label-width="100px"
          size="large"
        >
          <el-form-item label="原密码" prop="old_pwd">
            <el-input v-model="passwordData.old_pwd"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="new_pwd">
            <el-input v-model="passwordData.new_pwd"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="re_pwd">
            <el-input v-model="passwordData.re_pwd"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updatePassword"
              >提交修改</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>
