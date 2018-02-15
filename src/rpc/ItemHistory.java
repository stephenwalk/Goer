package rpc;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import db.DBConnection;
import db.DBConnectionFactory;
import db.mysql.MySQLDBUtil;
import entity.Item;

/**
 * Servlet implementation class ItemHistory
 */
@WebServlet("/history")
public class ItemHistory extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final DBConnection conn = DBConnectionFactory.getDBConnection();
	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public ItemHistory() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		try {
			Map<String, String[]> parametersMap = request.getParameterMap();
			if (parametersMap.containsKey("user_id") && parametersMap.containsKey("category")) {
				String userId = request.getParameter("user_id");
				MySQLDBUtil.service = request.getParameter("category");
				//MongoDBUtil.service = request.getParameter("category");
				Set<Item> items = conn.getFavoriteItems(userId);
				JSONArray array = new JSONArray();
				for (Item item : items) {
					JSONObject obj = item.toJSONObject();
					obj.append("favorite", true);
					array.put(obj);
				}
				RpcHelper.writeJsonArray(response, array);
			} else {
				RpcHelper.writeJsonObject(response, new JSONObject().put("status", "InvalidParameter"));
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		try {
			JSONObject input = RpcHelper.readJsonObject(request);
			if (input.has("user_id") && input.has("favorite")) {
				String userId = (String) input.get("user_id");
				MySQLDBUtil.service = request.getParameter("category");
				//MongoDBUtil.service = request.getParameter("category");
				List<String> favorites = getFavorite(input); 
				conn.setFavoriteItems(userId, favorites);
				RpcHelper.writeJsonObject(response, new JSONObject().put("result", "SUCCESS"));
			} else {
				RpcHelper.writeJsonObject(response, new JSONObject().put("status", "InvalidParameter"));
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}

	/**
	 * @see HttpServlet#doDelete(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doDelete(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		try {
			JSONObject input = RpcHelper.readJsonObject(request);
			if (input.has("user_id") && input.has("favorite")) {
				String userId = (String) input.get("user_id");
				MySQLDBUtil.service = request.getParameter("category");
				//MongoDBUtil.service = request.getParameter("category");
				List<String> favorites = getFavorite(input);
				conn.unsetFavoriteItems(userId, favorites);
				RpcHelper.writeJsonObject(response, new JSONObject().put("result", "SUCCESS"));
			} else {
				RpcHelper.writeJsonObject(response, new JSONObject().put("status", "InvalidParameter"));
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}

	private List<String> getFavorite(JSONObject input) {
		List<String> res = new ArrayList<>();
		try {
			JSONArray array = (JSONArray) input.get("favorite");
			for (int i = 0; i < array.length(); i++) {
				res.add((String) array.get(i));
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return res;
	}
}
