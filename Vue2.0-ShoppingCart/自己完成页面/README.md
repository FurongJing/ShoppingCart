1.当购物车没有商品时，将footer隐藏，提示用户购物车没有商品 
  大概在changeTip()方法中
  2.
  
  
// 根据是否全选中的状态来动态显示 “全选” 和 “取消全选” 这两种提示文字
  changeTip() {
  	// 购物车为空
  	if(this.cartGoods.length === 0) {
  		this.isSelectAll = true  // 显示全选
  	}
  	
  	// 购物车不为空
  	// 判断目前全选单选框是全选还是取消全选
  	if(this.isSelectedAll === true) {
  		this.isSelectAll = true  // 显示全选
  	}else {
  		this.isSelectAll = false // 显示取消全选
  	}
  }