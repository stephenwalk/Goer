package rpc;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import db.DBConnection;
import db.DBConnectionFactory;
import db.mysql.MySQLDBUtil;
import entity.Item;


/**
 * Servlet implementation class SearchItem
 */
@WebServlet("/search")
public class SearchItem extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final DBConnection conn = DBConnectionFactory.getDBConnection();
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
		//response.getWriter().append("Served at: ").append(request.getContextPath());
		//Create a PrintWriter from response such that we can add data to response.
		// Get parameter from HTTP request

		HttpSession session = request.getSession();
		if (session.getAttribute("user") == null) {
			response.setStatus(403);
			return;
		}
		Map<String, String[]> parametersMap = request.getParameterMap();
		if (parametersMap.containsKey("user_id") && parametersMap.containsKey("category")) {
			MySQLDBUtil.service = request.getParameter("category");
			//MongoDBUtil.service = request.getParameter("category");
			String userId = request.getParameter("user_id");
			double lat = Double.parseDouble(request.getParameter("lat"));
			double lon = Double.parseDouble(request.getParameter("lon"));
			String term = request.getParameter("term"); // Term can be empty or null.
			String city = request.getParameter("city");
			List<Item> items = conn.searchItems(userId, lat, lon, city, term);
			Set<String> favorite = conn.getFavoriteItemIds(userId);
			JSONArray array = new JSONArray();
			try {
				for (Item item : items) {
					JSONObject obj = item.toJSONObject();
					if (favorite != null) {
						obj.put("favorite", favorite.contains(item.getItemId()));
					}
					array.put(obj);
				}
			} catch (JSONException e) {
				e.printStackTrace();
			}
			RpcHelper.writeJsonArray(response, array);
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
