<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        style="width: 200px;"
        class="filter-item upload-demo"
        @input="handleFilter"
      />
      <el-upload
        class="filter-item upload-demo"
        :show-file-list="false"
        :action="uploadBaseUrl"
        :on-success="handleUploadSuccess"
        :file-list="fileList"
        :limit="1"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      max-height="680"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        label="文件名"
        prop="file_name"
        sortable="custom"
        align="center"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.file_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传者" min-width="150px" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{
            scope.row.create_by
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新日期" min-width="150px" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{
            scope.row.create_time
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            plain
            size="mini"
            icon="el-icon-download"
            @click="handleDownloadClick(scope.row)"
          >下载</el-button>
          <el-button
            size="mini"
            type="warning"
            plain
            icon="el-icon-delete"
            @click="handleRemoveClick(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import waves from '@/directive/waves' // Waves directive
import { dowloadBaseUrl, uploadBaseUrl } from './config/config.js'
import { getFiles, recordFile, removeFile } from '@/api/transfer'
import dayjs from 'dayjs'
import { debounce } from '@/utils/tools/debounce'
export default {
  name: 'ComplexTable',
  // directives: { waves },
  filters: {},
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      fileList: [],
      totalList: [],
      filename: "",
      uploadBaseUrl: uploadBaseUrl,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      console.log('按钮点击')
      const res = await getFiles()
      this.listLoading = false
      this.list = res.data
      this.totalList = res.data
    },
    handleDownloadClick(row) {
      window.open(dowloadBaseUrl + row.file_name)
      console.log('点击下载', dowloadBaseUrl + row.file_name)
    },
    async handleRemoveClick(row) {
      const name = row.file_name
      await removeFile({ name })
      this.getList()
      console.log('点击删除')
    },
    async handleUploadSuccess(response, file, fileList) {
      const file_name = fileList[0].name
      const create_by = this.$store.getters.name
      const create_time = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
      await recordFile({ file_name, create_by, create_time })
      console.log('上传成功')
      this.fileList = []
      this.getList()
    },
    handleFilter:
      debounce(function() {
        if (!this.listQuery.title) {
          this.list = this.totalList
        } else {
          let tmpFileList = []
          tmpFileList = this.list.filter(item => {
            return item.file_name.indexOf(this.listQuery.title) !== -1
          })
          this.list = tmpFileList
        }
      }, 300),
    handleButtonClick() {
      this.getList()
    }
  }
}
</script>
<style scoped>
.upload-demo {
  display: inline-block;
  vertical-align: middle;
}
</style>
