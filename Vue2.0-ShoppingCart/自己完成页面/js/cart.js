new Vue({
	el: '#app',
	data: {
		isShowFooter: true, // 是否显示footer，默认显示
		cartGoods: [], // 购物车中的商品
		isShow: false, // 是否显示删除的模态框
		currentClass: null, //当前的商品
		totalMoney: 0, //总金额
		isSelectedAll: false, // 是否全选
		curSelectNum: 0 //当前选中的商品个数
	},
	mounted: function() {
		this.$nextTick(() => {
			this.cartView()			
		})
	},
	methods: {
		// 初始化购物车页面
		cartView() {
			this.$http.get('./data/cart.json').then(res => {
				if(res.data.status === 0) {
					// _this.cartGoods = res.data.result.list;	
					this.cartGoods = res.data.result.list;	
					// 本地化持久储存
					localStorage.setItem('cartGoods', JSON.stringify(this.cartGoods))
				}
			}).catch((err) => {
				console.log(err)
			})
		},
		
		// 添加或减少商品的数量
	    changeQuantity(cartgood, num) {
			// index 为点击商品的下标值
			// 当点击 + 时
			if (num >= 0) {
				 cartgood.count++ 
			} else {  // 点击 - 时
				// 判断当前的数量是否等于1，如果等于1，数量不会改变，否则减1
				if (cartgood.count < 2) {
					cartgood.count = 1
				} else {
					cartgood.count--
				}
			}
			this.calcGoodmoney(cartgood)
			this.calcTotalmoney()
			localStorage.setItem('cartGoods', JSON.stringify(this.cartGoods))
		},
		
		// 计算每件商品的金额
		// ***** 如何将其写入到计算属性中????
		calcGoodmoney(good) {
			return good.amount = good.count * good.price
		},
		
		// 计算总价格
		// ???????是否可以考虑不用每次使用遍历  可以和计算单个商品的价格和为一个方法
		calcTotalmoney() {
			this.totalMoney = 0
			this.cartGoods.forEach(item => {
				if(item.ischecked == true) {
					this.totalMoney += item.amount
				}
				return this.totalMoney
			}) 
		},
		
		// 是否选择商品
		selectedItem(item) {
			if(typeof item.ischecked === 'undefined'){
				//局部$set方法，在item里注册ischecked属性，赋值为true
				this.$set(item, 'ischecked', true);
				this.curSelectNum += 1;
			}else {
				//点击反转属性值
				item.ischecked = !item.ischecked;
				if(item.ischecked  == true) {
					this.curSelectNum += 1;
				}else if(this.curSelectNum > 0){
					this.curSelectNum -= 1;
					// 取消一件商品的选择，自动将全选取消
					this.isSelectedAll = false
				}
			}
			// 判断所有的商品是否都选中，若都选中则触发全选按钮
			if(this.cartGoods.length === this.curSelectNum && this.cartGoods.length != 0) {
				this.isSelectedAll = true
			}
			this.calcTotalmoney()
		},
		
		// 点击全选或者取消全选按钮实现状态的改变
		checkAll() {
			// 首先判断购物车中的商品是否为空
			if(this.cartGoods.length === 0) {
				// 若购物车为空，全选的单选框为false,并且不显示footer
				this.isSelectedAll = false
				this.isShowFooter = flase
			}
			
			// 初始的isSelectedAll为false,点击会改变boolean值
			this.isSelectedAll = !this.isSelectedAll;
			this.cartGoods.forEach((item) => {
				this.$set(item, 'ischecked', this.isSelectedAll);
			})
			
			// 判断目前全选单选框是否是全选
			if(this.isSelectedAll === true) {
				this.curSelectNum= this.cartGoods.length // 改变当前选中的商品的的个数
			}else {
				this.curSelectNum = 0 // 当前选中的商品的个数为0
			}
				
			// 最后计算总计金额
			this.calcTotalmoney()
		},
		
		// 确认是否要删除购物车中的商品
		removeConfirm(index) {
			this.isShow = true
			this.currentClass = index	
		},
		
		// 删除购物车中的商品
		removeClass() {
			// indexOf方法接受一个值，在数组中进行检索这个值是否存在，这个值可以使字符串、数字、和对象
			// var index = this.cartGoods.indexOf(this.currentClass)
			
			// 隐藏模态框
			this.isShow = false
			
			// 删除选中的商品
			this.cartGoods.splice(this.currentClass, 1)
			
			// 删除商品后需要重新计算金额
			this.calcTotalmoney()
			
			// 判断购物车剩下的商品是否是全选中状态
			// 判断购物车是否为空，若为空，则footer隐藏，并且将全选设为false
			if(this.cartGoods.length === 0) {
				console.log('列表为空')
				this.isSelectedAll = false
				this.isShowFooter = false
			}
			
			// 检查剩下商品的是否全选中，若都选中则触发全选按钮
			if(this.cartGoods.length === this.curSelectNum) {
				this.isSelectedAll = true
			}

		}
	},
	computed: {
		
	}
})

	