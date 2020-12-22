Page({
	data: {
		shareTitle: '心意有礼周边 更多惊喜优惠等你来拿', // 分享标题
		shareCoverImg: '', // 分享封面图
		// shareQrImg: 'https://xyylcdn.weein.cn/group1/M00/03/17/rBUUDl7sjwGALwXAAAC3VMEkNmA234.jpg?filename=weima.jpg', // 生产
		shareQrImg: 'https://tfile.weein.cn//group1/M00/03/1F/rBIAPV7rbiOAXUrOAAC3VFUkwlU955.jpg?filename=weima.jpg', // 分享小程序二维码
		goodTitle: '',
		goodPrice: '',
		saveCanvasImg: '',
		isBecome: false
	},
	onLoad: function () {
		let shareData = wx.getStorageSync('haiBao');
		if (shareData) {
			let parseShare = JSON.parse(shareData);
			let imgArr = JSON.parse(parseShare.coverImgUrl);
			console.log(imgArr);
			this.setData({
				goodTitle: parseShare.productName,
				goodPrice: parseShare.salePrice,
				shareCoverImg:imgArr[0].url
			})
		}
	},
	downloadImg: function () {
		wx.showLoading({
			title: '生成中,请等待'
		});
		let that = this;
		// 创建画布
		const ctx = wx.createCanvasContext('shareCanvas')
		// 白色背景
		ctx.setFillStyle('#fff')
		ctx.fillRect(0, 0, 300, 380)
		ctx.draw()
		// 下载封面图
		wx.getImageInfo({
			src: that.data.shareCoverImg,
			success: (res2) => {
				ctx.drawImage(res2.path, 0, 0, 300, 190)
				// 分享标题
				// ctx.setTextAlign('center')    // 文字居中
				ctx.setFillStyle('#000') // 文字颜色：黑色
				ctx.setFontSize(18) // 文字字号：20px
				ctx.fillText(that.data.shareTitle, 10, 220, 280);
				//名称
				ctx.setFillStyle('#000') // 文字颜色：黑色
				ctx.setFontSize(14) // 文字字号：16px
				ctx.fillText(that.data.goodTitle, 10, 280)
				//价格
				ctx.setFillStyle('red') // 文字颜色：黑色
				ctx.setFontSize(14) // 文字字号：16px
				ctx.fillText('￥' + (that.data.goodPrice) / 100, 10, 330)

				// 下载二维码生成海拔
				wx.getImageInfo({
					src: that.data.shareQrImg,
					success: (res3) => {
						let qrImgSize = 90
						ctx.drawImage(res3.path, 202, 256, qrImgSize, qrImgSize)
						ctx.stroke()
						ctx.draw(true)
						wx.hideLoading();
						wx.canvasToTempFilePath({
							canvasId: 'shareCanvas',
							success: function (res) {//存图片
								that.setData({
									saveCanvasImg: res.tempFilePath,
									isBecome: true
								})
							}
						}, this)

					}
				})
			}
		})
	},
	saveImg: function () {
		let saveImg = this.data.saveCanvasImg;
		let isSave = this.data.isBecome;
		if (isSave) {
			wx.getSetting({
				success(res) {
				  if (res.authSetting['scope.writePhotosAlbum']) {
					wx.saveImageToPhotosAlbum({
					  filePath: saveImg,
					  success(res) {
						wx.showToast({
							title: '图片保存成功'
						})
						
					  }
					})
				  } else {
					if (res.authSetting['scope.writePhotosAlbum'] == false) {
					  wx.openSetting({
						success(res) {
						  console.log(res.authSetting)
						}
					  })
					} else {
					  wx.saveImageToPhotosAlbum({
						filePath: saveImg,
						success(res) {
						  
						},
						fail:function(){
						  console.log('heihei')
						  wx.showToast({
							title: '请打开保存相册权限后重试',
							icon:'none',
							duration:2000
						  })
						}
		  
					  })
					}
				  }
				}
			  })

		} else {
			wx.showToast({
				title: '请先生成海报',
				icon:'none'
			})

		}

	}

})