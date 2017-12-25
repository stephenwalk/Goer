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
import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONObject;

import db.mysql.ItemMySQLConnection;
import db.mysql.RestaurantMySQLConnection;
import entity.Item;
import entity.Restaurant;


/**
 * Servlet implementation class SearchItem
 */
@WebServlet("/search")
public class SearchItem extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SearchItem() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		//response.getWriter().append("Served at: ").append(request.getContextPath());
		//Create a PrintWriter from response such that we can add data to response.
		// Get parameter from HTTP request

		HttpSession session = request.getSession();
		if (session.getAttribute("user") == null) {
			response.setStatus(403);
			return;
		}

		String userId = request.getParameter("user_id");
		double lat = Double.parseDouble(request.getParameter("lat"));
		double lon = Double.parseDouble(request.getParameter("lon"));
		String term = request.getParameter("term"); // Term can be empty or null.
		String category = request.getParameter("category");
		if (category.equals("event")) {
			ItemMySQLConnection conn = new ItemMySQLConnection();
			List<Item> items = conn.searchItems(userId, lat, lon, term);
			List<JSONObject> list = new ArrayList<>();
			Set<String> favorite = conn.getFavoriteItemIds(userId);
			try {
				for (Item item : items) {
					JSONObject obj = item.toJSONObject();
					if (favorite != null) {
						obj.put("favorite", favorite.contains(item.getItemId()));
					}
					list.add(obj);
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
			JSONArray array = new JSONArray(list);
			RpcHelper.writeJsonArray(response, array);
		} else {
			//JSONArray array = new JSONArray();
			RestaurantMySQLConnection conn = new RestaurantMySQLConnection();

			//DBConnection connection = new MongoDBConnection();
			List<Restaurant> rest = conn.searchRestaurants(userId, lat, lon, term);
			Set<String> favorite = conn.getVisitedRestaurants(userId);
			List<JSONObject> list = new ArrayList<>();
			try {
				for (Restaurant re : rest) {
					JSONObject obj = re.toJSONObject();
					if (favorite != null) {
						obj.put("is_visited", favorite.contains(re.getBusinessId()));
					}
					list.add(obj);
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
			RpcHelper.writeJsonArray(response, new JSONArray(list));
		}

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
