<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item>
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-form-item>

      <el-form-item prop="role">
        <el-input
          v-model="queryParams.role"
          placeholder="请输入职业"></el-input>
        <!-- <el-select
          v-model="queryParams.role"
          placeholder="请选择职业"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item prop="level">
        <el-select
          v-model="queryParams.level"
          placeholder="请选择等级"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="item in levelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dataList" border :row-style="{height: '0'}">
      <!-- <el-table-column label="编号" type="index" width="60" /> -->
      <el-table-column label="排名" prop="ranking" width="60" show-overflow-tooltip />
      <el-table-column label="名称" prop="username" show-overflow-tooltip />
      <el-table-column label="职业" prop="role" width="80" show-overflow-tooltip />
      <el-table-column label="评分" prop="score" width="60" show-overflow-tooltip />
      <el-table-column label="描述" prop="desc" min-width="350" show-overflow-tooltip />
      <el-table-column label="等级" prop="level" show-overflow-tooltip />
      <el-table-column  label="上下移动" align="center" width="150">
        <template slot-scope="scope">
          <!-- <el-button type="text" @click="moveUp(scope.$index,scope.row)" >上移</el-button>
          <el-button type="text" @click="moveDown(scope.$index,scope.row)" >下移</el-button> -->
          <el-button type="text" @click="moveUp(scope.$index,scope.row)" v-show="scope.$index!==0">上移</el-button>
          <el-button type="text" @click="moveDown(scope.$index,scope.row)" v-show="scope.$index+1!==dataList.length">下移</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width" width="160">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="warning"
            plain
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-drawer
      :title="title"
      :visible.sync="open"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
      >
      <div class="form-content">
        <el-form class="form-info" ref="form" :model="form" :rules="rules" label-width="125px">

          <el-row>
            <el-col :span="24">
              <el-form-item label="玩家名称" prop="username">
                <el-input v-model="form.username" placeholder="请输入玩家名称" :disabled="readOnly"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="玩家排名" prop="ranking">
                <el-input v-model="form.ranking" placeholder="请输入玩家排名" type="number" @input="changeInput" :disabled="readOnly"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="职业" prop="role">
                <el-input v-model="form.role" placeholder="请输入职业" :disabled="readOnly"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="评分" prop="score">
                <el-input v-model="form.score" type="number" placeholder="请输入评分" :disabled="readOnly"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="描述" prop="desc">
                <el-input v-model="form.desc" type="textarea" placeholder="请输入描述" :disabled="readOnly"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="等级" prop="level">
                <!-- <el-input v-model="form.level" placeholder="请输入等级" :disabled="readOnly"/> -->
                <el-select
                  v-model="form.level"
                  placeholder="请选择等级"
                  style="width:100%"
                  filterable
                >
                  <el-option
                    v-for="item in levelOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="form-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>
    <!-- 添加或修改配置对话框 -->

  </div>
</template>

<script>
import { listRanking, createRanking, updateRanking, deleteRanking,transferRanking} from '@/api/ranking'
export default {
  name: "ranking",
  data() {
    return {
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      dataList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 只读属性
      readOnly: false,
      // 日期范围
      dateRange: [],
      // 数据范围选项
      options: [
        {
          value: '选项1',
          label: '选项1'
        }, {
          value: '选项2',
          label: '选项2'
        }, {
          value: '选项3',
          label: '选项3'
        }, {
          value: '选项4',
          label: '选项4'
        }, {
          value: '选项5',
          label: '选项5'
        }
      ],
      levelOptions: [
        {
          value: 'SS+',
          label: 'SS+'
        }, {
          value: 'SS',
          label: 'SS'
        }, {
          value: 'S+',
          label: 'S+'
        }, {
          value: 'S',
          label: 'S'
        }, {
          value: 'S-',
          label: 'S-'
        }, {
          value: 'A+',
          label: 'A+'
        }, {
          value: 'A',
          label: 'A'
        }, {
          value: 'A-',
          label: 'A-'
        }, {
          value: 'B+',
          label: 'B+'
        }, {
          value: 'B',
          label: 'B'
        }, {
          value: 'B-',
          label: 'B-'
        }, {
          value: 'C+',
          label: 'C+'
        }, {
          value: 'C',
          label: 'C'
        }, {
          value: 'C-',
          label: 'C-'
        }, {
          value: 'D',
          label: 'D'
        }
      ],
      // 查询参数
      queryParams: {
        role: undefined,
        level: undefined
      },
      // 表单参数
      form: {
        ranking: '',
        username: '',
        role: '',
        score: '',
        desc: '',
        level: ''
      },
      // 表单校验
      rules: {
        ranking: [
          { required: true, message: '请输入排名', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请输入职业', trigger: 'blur' }
        ],
        score: [
          { required: true, message: '清输入评分', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '清选择等级', trigger: 'blur' }
        ],
      },
      // 当前可选择的角色列表
      selRoleList: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    changeInput() {
      var pattern = /^[1-9][0-9]*$/ // 正整数的正则表达式
      // 不符合正整数时
      if (!pattern.test(this.form.ranking)) {
        // input 框绑定的内容为空
        this.form.ranking = ''
      }
    },

    // 接口调用

    // 转换

    async transferUser(data) {
      const res = await transferRanking(data)
      this.getList()
      this.$modal.msgSuccess("切换成功");
    },

    // 创建用户
    async addUser() {
      const res = await createRanking(this.form)
      this.getList()
      this.$modal.msgSuccess("新建成功");
    },
    // 修改用户
    async modUser() {
      const res = await updateRanking(this.form)
      this.getList()
      this.$model.msgSuccess("修改成功");
    },
    // // 删除用户
    async deleteUser(data) {
      const res = await deleteRanking(data)
      this.getList()
      this.$model.msgSuccess("删除成功");
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      listRanking(this.queryParams).then(response => {
          this.dataList = response.data.list;
          this.loading = false;
        }
      );
    },
    // 提交按钮
    submitForm() {

      this.$refs['form'].validate((valid) => {
        if (valid) {
          if(this.form.id) {
            this.modUser()
          } else {
            this.addUser()
          }
          this.open = false;
          this.reset();
        } else {
          return false;
        }
      });

    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.readOnly = false
      this.title = "新增"
      this.open = true
      this.form = {}
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.readOnly = false
      this.title = "修改"
      this.open = true
      this.form = { ...row }
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      // this.$modal.msgSuccess("待开发");
      const username = row.username
      const data = {id:row.id}
      this.$modal.confirm('是否确认删除"' + username + '"玩家？').then(() => {
        return this.deleteUser(data);
      }).then(() => {
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    // handleExport() {
    //   // 表头转义对象
    //   const translateObj = {userId: '员工编号', username: '员工姓名', certificateNumber: '证件号码', phoneNumber: '手机号码', email: '邮箱', address: '联系地址', roleId: '角色', matureUnbound: '成熟解限', remainingOption: '剩余期权', remainingRestricted: '剩余限制性股权'}
    //   // 导出函数调用
    //   exportExcel(this.dataList,'参与方信息导出',translateObj)
    // }
    // 配置表格内容移动
    // 先判断是否有同分数
    checkScore(score) {
      const tmpList = this.dataList.filter(item => item.score === score)
      const flag = tmpList.length>1
      return {flag ,tmpList}
    },
    changeController(row,list,flag) {
      const {sortid} = row
      if(flag==0){
        // 上移
        const res = list.filter(item => item.sortid < sortid)
        let changeObj = {}
        if(res.length){
          changeObj = {...res[res.length-1]}
        }
        const result = {flag:!!res.length ,changeObj}
        return result
      }else {
        // 下
        const res = list.filter(item => item.sortid > sortid)
        let changeObj = {}
        if(res.length){
          changeObj = {...res[0]}
        }
        const result = {flag:!!res.length ,changeObj}
        return result
      }

    },
    moveUp(index, row) {
      const res = this.checkScore(row.score)
      if(res.flag){
        const result = this.changeController(row,res.tmpList,0)
        if(result.flag){
          // 转换逻辑 前一个 result.changeObj  后一个row
          this.transferUser({preRow: result.changeObj, nextRow: row})
        }else {
          this.$message.warning('已是同分中的最前排名！')
        }
      } else {
        this.$message.warning('无同分玩家无法移动！')
      }
    },
    moveDown(index, row) {
      const res = this.checkScore(row.score)
      if(res.flag){
        const result = this.changeController(row,res.tmpList,1)
        if(result.flag){
          // 转换逻辑 前一个 row  后一个result.changeObj
          this.transferUser({preRow: row, nextRow: result.changeObj})
        }else {
          this.$message.warning('已是同分中的最后排名！')
        }
      } else {
        this.$message.warning('无同分玩家无法移动！')
      }
    },
  }
};
</script>
<style  scoped>
.form-content{
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
}
.form-footer {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  margin-right: 10px;
}
</style>
