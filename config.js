module.exports = {
  prompts: [{
    type: 'input',
    name: 'projectName',
    message: '请填写项目目录名（字母或数字组合）：',
    default: 'cyb-template'
  }, {
    type: 'list',
    name: 'template',
    message: '请选择项目模板',
    default: 'basic-template',
    choices: [{
      name: '基础简单模板',
      value: 'basic-template',
      short: 'basic-template',
      git: 'https://github.com/lavas-project/lavas-template-vue.git',
      branch: 'basic-template',
    }, {
      name: 'ant管理后台模板',
      value: 'ant-admin-template',
      short: 'ant-admin-template',
      git: 'https://github.com/lavas-project/lavas-template-vue.git',
      branch: 'ant-admin-template',
    }],
  }],
  filters: {
    'template/basic-template/': "userModel && modelConfig === 'basic-template'",
    'template/ant-admin-template/': "userModel && modelConfig === 'ant-admin-template'",
  }
}
