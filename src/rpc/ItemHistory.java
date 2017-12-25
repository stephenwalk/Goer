package rpc;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import db.mysql.ItemMySQLConnection;
import db.mysql.RestaurantMySQLConnection;
import entity.Item;

/**
 * Servlet implementation class ItemHistory
 */
@WebServlet("/history")
public class ItemHistory extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public ItemHistory() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String category = request.getParameter("category");
		if (category.equals("event")) {
			String userId = request.getParameter("user_id");
			JSONArray array = new JSONArray();

			ItemMySQLConnection conn = new ItemMySQLConnection();
			Set<Item> items = conn.getFavoriteItems(userId);
			for (Item item : items) {
				JSONObject obj = item.toJSONObject();
				try {
					obj.append("favorite", true);
				} catch (JSONException e) {
					e.printStackTrace();
				}
				array.put(obj);
			}
			RpcHelper.writeJsonArray(response, array);
		} else {
			try {
				RestaurantMySQLConnection conn = new RestaurantMySQLConnection();
				//DBConnection connection = new MySQLDBConnection();
				JSONArray array = null;
				// allow access only if session exists
				/*
				if (!RpcParser.sessionValid(request, connection)) {
					response.setStatus(403);
					return;
				}*/
				if (request.getParameterMap().containsKey("user_id")) {
					String userId = request.getParameter("user_id");
					Set<String> visited_business_id = conn.getVisitedRestaurants(userId);
					array = new JSONArray();
					for (String id : visited_business_id) {
						array.put(conn.getRestaurantsById(id, true));
					}
					RpcHelper.writeJsonArray(response, array);
				} else {
					RpcHelper.writeJsonObject(response, new JSONObject().put("status", "InvalidParameter"));
				}
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		try {
			String category = request.getParameter("category");
			if (category.equals("event")) {
				JSONObject input = RpcHelper.readJsonObject(request);
				String userId = input.getString("user_id");
				JSONArray array = (JSONArray) input.get("favorite");
				List<String> histories = new ArrayList<>();
				for (int i = 0; i < array.length(); i++) {
					String itemId = (String) array.get(i);
					histories.add(itemId);
				}
				ItemMySQLConnection conn = new ItemMySQLConnection();
				conn.setFavoriteItems(userId, histories);
				RpcHelper.writeJsonObject(response, new JSONObject().put("result", "SUCCESS"));
			} else {
				RestaurantMySQLConnection conn = new RestaurantMySQLConnection();
				JSONObject input = RpcHelper.readJsonObject(request);
				if (input.has("user_id") && input.has("visited")) {
					String userId = (String) input.get("user_id");
					JSONArray array = (JSONArray) input.get("visited");
					List<String> visitedRestaurants = new ArrayList<>();
					for (int i = 0; i < array.length(); i++) {
						String businessId = (String) array.get(i);
						visitedRestaurants.add(businessId);
					}
					conn.setVisitedRestaurants(userId, visitedRestaurants);
					RpcHelper.writeJsonObject(response,
							new JSONObject().put("status", "OK"));
				} else {
					RpcHelper.writeJsonObject(response,
							new JSONObject().put("status", "InvalidParameter"));
				}
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
			String category = request.getParameter("category");
			if (category.equals("event")) {
				JSONObject input = RpcHelper.readJsonObject(request);
				String userId = input.getString("user_id");
				JSONArray array = (JSONArray) input.get("favorite");
				List<String> histories = new ArrayList<>();
				for (int i = 0; i < array.length(); i++) {
					String itemId = (String) array.get(i);
					histories.add(itemId);
				}
				ItemMySQLConnection conn = new ItemMySQLConnection();
				conn.unsetFavoriteItems(userId, histories);
				RpcHelper.writeJsonObject(response, new JSONObject().put("result", "SUCCESS"));
			} else {
				RestaurantMySQLConnection conn = new RestaurantMySQLConnection();
				JSONObject input = RpcHelper.readJsonObject(request);
				if (input.has("user_id") && input.has("visited")) {
					String userId = (String) input.get("user_id");
					JSONArray array = (JSONArray) input.get("visited");
					List<String> visitedRestaurants = new ArrayList<>();
					for (int i = 0; i < array.length(); i++) {
						String businessId = (String) array.get(i);
						visitedRestaurants.add(businessId);
					}
					conn.unsetVisitedRestaurants(userId, visitedRestaurants);
					RpcHelper.writeJsonObject(response, new JSONObject().put("status", "OK"));
				} else {
					RpcHelper.writeJsonObject(response, new JSONObject().put("status", "InvalidParameter"));
				}
			}

		} catch (JSONException e) {
			e.printStackTrace();
		}
	}
}