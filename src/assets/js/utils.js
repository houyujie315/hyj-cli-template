export default {
  install (Vue, options) {
    // 计算每个sku后面有多少项
    Vue.prototype.getLevels = function (tree) {
      const level = []
      for (let i = tree.length - 1; i >= 0; i--) {
        if (tree[i + 1] && tree[i + 1].leaf) {
          level[i] = tree[i + 1].leaf.length * level[i + 1] || 1
        } else {
          level[i] = 1
        }
      }
      return level
    }
    /**
     * 笛卡尔积运算
     * @param  {[type]} tree   [description]
     * @param  {Array}  stocks [description]
     * @return {[type]}        [description]
     */
    Vue.prototype.flatten = function (tree, stocks = [], options) {
      const {
        optionValue = 'id', optionText = 'text'
      } = options || {}
      const result = []
      let skuLen = 0
      const stockMap = {} // 记录已存在的stock的数据
      const level = this.getLevels(tree)
      if (tree.length === 0) return result
      tree.forEach(sku => {
        // console.log(tree,'tree')
        const {
          leaf
        } = sku
        if (!leaf || leaf.length === 0) return true
        skuLen = (skuLen || 1) * leaf.length
      })
      // console.log(tree,'sku')
      // 根据已有的stocks生成一个map
      stocks.forEach(stock => {
        const {
          skus,
          ...attr
        } = stock
        stockMap[skus.map(item => `${item.k_id}_${item.v_id}`).join('|')] = attr
      })

      for (let i = 0; i < skuLen; i++) {
        const skus = []
        const mapKey = []
        // console.log(skuLen,'111')
        tree.forEach((sku, column) => {
          const {
            leaf
          } = sku
          let item = {}
          if (!leaf || leaf.length === 0) return true
          if (leaf.length > 1) {
            const row = parseInt(i / level[column], 10) % leaf.length
            item = tree[column].leaf[row]
            // console.log(leaf,'leaf')
          } else {
            item = tree[column].leaf[0]
          }
          // console.log('2222222------------',sku[optionValue],sku[optionText],!sku[optionValue], !item[optionValue])
          // if (!sku[optionValue] || !item[optionValue]) return;
          // console.log('33333------------',sku[optionValue],sku[optionText])
          mapKey.push(`${sku[optionValue]}_${item[optionValue]}`)
          // console.log(item.picture,'text')
          if (typeof item.picture === 'undefined') {
            // console.log('111')
            skus.push({
              key: sku[optionText],
              value: item[optionText],
              picture: ''
            })
          } else {
            // console.log('222')
            // console.log(item.picture.length!=0,'33')
            skus.push({
              key: sku[optionText],
              value: item[optionText],
              picture: item.picture.length !== 0 ? item.picture[0].url : ''
            })
          }
          // skus.push({
          //   // k_id: sku[optionValue],
          //   key: sku[optionText],
          //   // v_id: item[optionValue],
          //   value: item[optionText],
          //   picture:item.picture!=[]?item.picture[0].url:'',
          // });
        })
        const { ...data
        } = stockMap[mapKey.join('|')] || {}
        // 从map中找出存在的sku并保留其值
        result.push({
          ...data,
          skus
        })
      }
      return result
    }
    /**
     * 批量更改数组Key名
     * @param  {[type]} list [description]
     * @param  {[type]} rule [description]
     * @return {[type]}      [description]
     */
    Vue.prototype.listChangeKey = function (list, rule) {
      for (var i in list) {
        for (var key in rule) {
          if (list[i][rule[key].old]) {
            list[i][rule[key].new] = list[i][rule[key].old]
            delete list[i][rule[key].old]
          }
        }
      }
      return list
    }
  }
}
