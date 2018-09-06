package gogoal.api;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.CoreConnectionPNames;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;

import play.Play;

/**
 * GoGoal新一代数据平台
 * 
 * @version 1.0
 * @since JDK1.7
 * @author Albert
 * @company 上海朝阳永续信息技术有限公司
 * @copyright (c) 2015 SunTime Co'Ltd Inc. All rights reserved.
 * @date 2015年4月27日 下午2:50:48
 */
public class GoGoalAPI {
	
	private static final String DOMAIN = Play.configuration.getProperty("api.doamin");
	private static final String APP_KEY = Play.configuration.getProperty("api.app_key");
	private static final String APP_SECRET = Play.configuration.getProperty("api.secret");
	
	private static DefaultHttpClient getClient() {
		return HttpClientPool.pool.getClient();
	}
	
	private static String requestByGet(String url, String clientIp) throws Exception {
		HttpGet get = new HttpGet(url);
		get.setHeader("gg-ip", clientIp);
		try {
			HttpResponse response = getClient().execute(get);
			return EntityUtils.toString(response.getEntity());
		} catch (Exception e) {
			throw e;
		} finally {
			get.abort();
		}
	}

	private static String requestByPost(String url, Map<String, String> parameters, String clientIp) throws Exception {
		HttpPost post = new HttpPost(url);
		try {
			post.setHeader("gg-ip", clientIp);
			if (parameters != null && !parameters.isEmpty()) {
				List<NameValuePair> nvps = new ArrayList<NameValuePair>();
				for (Entry<String, String> en : parameters.entrySet()) {
					nvps.add(new BasicNameValuePair(en.getKey(), en.getValue()));
				}
				post.setEntity(new UrlEncodedFormEntity(nvps, HTTP.UTF_8));
			}
			HttpResponse response = getClient().execute(post);
			return EntityUtils.toString(response.getEntity());
		} catch (Exception e) {
			throw e;
		} finally {
			post.abort();
		}
	}
	
	public static String get(String api, Map<String, String> params, String clientIp) throws Exception {
		long timeStamp = System.currentTimeMillis() / 1000;
		
		String sign = getSign(APP_KEY, APP_SECRET, timeStamp, params, api, "GET");
		String incomingParams = "";
		if (params != null && !params.isEmpty()) {
			try {
				for (String s : params.keySet()) {
					incomingParams = incomingParams + s + "=" + URLEncoder.encode((String) params.get(s), "UTF-8") + "&";
				}
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
			incomingParams = incomingParams.substring(0, incomingParams.length() - 1);
		}
		
		String url = "";
		try {
			url = "/" + api + "?" + "app_key=" + APP_KEY + "&time_stamp=" + timeStamp + "&sign=" + URLEncoder.encode(sign, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		if (incomingParams != null && !"".equals(incomingParams.trim())) {
			url += "&" + incomingParams;
		}
		url = DOMAIN + url;
		return requestByGet(url, clientIp);
	}
	
	public static String post(String api, Map<String, String> params, String clientIp) throws Exception {
		if (params == null) {
			params = new HashMap<String, String>();
		}
		long timeStamp = System.currentTimeMillis() / 1000;
		String sign = getSign(APP_KEY, APP_SECRET, timeStamp, params, api, "POST");
		params.put("app_key", APP_KEY);
		params.put("time_stamp", String.valueOf(timeStamp));
		params.put("sign", sign);
		return requestByPost(DOMAIN + "/" + api, params, clientIp);
	}
	
	private static String getSign(String appKey, String appSecret, Long timeStamp, Map<String, String> params, String url, String requestMethod) {
        Map paramsMap = new HashMap();
        if (params != null) {
        	paramsMap.putAll(params);
        }
        paramsMap.put("app_key", appKey);
        paramsMap.put("time_stamp", timeStamp.toString());
        paramsMap.remove("sign");
        SignHelper.codePayValue(paramsMap);
        try {
            return SignHelper.makeSign(requestMethod, url, paramsMap, appSecret);
        } catch (Exception e) {
           e.printStackTrace();
        }
        return null;
    }
	
}
