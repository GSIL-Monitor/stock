package controllers;

import ggblog.baidu.ueditor.ActionEnter;
import ggframework.bottom.config.GGConfigurer;
import ggframework.bottom.log.GGLogger;

import java.io.File;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;

import common.org.UFileMultiUpload;

import play.mvc.Controller;

/**
 * 
 * 文件上传
 * 
 * @version 1.0
 * @since JDK1.7
 * @author weijs
 * @company 上海朝阳永续信息技术有限公司
 * @copyright (c) 2017 SunTime Co'Ltd Inc. All rights reserved.
 * @date 2017年12月21日 下午5:14:07
 */
public class FileUploaderAction extends Controller {
	
	public static void upload(File upfile) throws Exception {
		GGLogger.info("上传对象："+upfile);
		String result = new ActionEnter(request, "", upfile).exec();
		GGLogger.info("上传返回结果："+result);
		renderText(result);
	}

	
	/**
	 * 
	 * 上传图片
	 * 
	 * @param file 上传文件
	 * @param dir 保存目录
	 * @param width 指定宽度
	 * @param height 指定高度
	 * 
	 * @return 图片的全路径
	 * 
	 * @author weijs
	 * @date 2017年3月10日 下午5:44:06
	 */
	public static String uploadImage(File file, String dir, Integer width, Integer height) {
		if (file == null) {
			return null;
		}
		if (!StringUtils.isNotBlank(dir)) {
			dir="circle";
		}
		String uuid = UUID.randomUUID().toString().split("-")[0];
		String imageName = "ggimages/" + dir + "/" + uuid + "." + file.getName().split("\\.")[1];
		String url = GGConfigurer.get("api.ucloud.url") + "/" + imageName;
		String bucket = GGConfigurer.get("api.ucloud.bucket");
		UFileMultiUpload.uFIleUpload(file, bucket, imageName);

		if ((height == null) && (width == null)) {// 不限制
			return url;
		} else {
			if (StringUtils.isNotBlank(url)) {
				
				if ((width != null) && (height == null)) {// 指定宽度缩放 高度自适应
					url = url + "?iopcmd=thumbnail&type=4&width=" + width;
				}
				if ((height != null) && (width == null)) {// 指定高度缩放 宽度自适应
					url = url + "?iopcmd=thumbnail&type=5&height=" + height;
				}
				if ((height != null) && (width != null)) {// 指定高度缩放 指定宽度
					url = url+"?iopcmd=thumbnail&type=8&width="+width+"&height="+height;
				}
			}
		}
		return url;
	}
	
}
