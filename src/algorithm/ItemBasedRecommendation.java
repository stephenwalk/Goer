package algorithm;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import db.DBConnection;
import db.DBConnectionFactory;

import entity.Item;
import external.HereAPI;
import external.NewYorkTimesAPI;

public class ItemBasedRecommendation implements Recommendation {
	private static final int MAX_RECOMMENDED_ITEMS = 20;

	@Override
	public List<Item> recommendItems(String userId, String service, double latitude, double longitude, String city) {
		DBConnection conn = DBConnectionFactory.getDBConnection();
		Set<String> favoriteItems = conn.getFavoriteItemIds(userId);//step 1
		Set<String> allCategories = new HashSet<>();//step 2
		for (String item : favoriteItems) {
			if (service.equals("place")) {
				String s = conn.getCategories(item).iterator().next().split(";")[0];
				allCategories.add(s);
			} else {
				allCategories.addAll(conn.getCategories(item));
			}
		}
		allCategories.remove("Undefined"); // tune category set
		if (allCategories.isEmpty()) {
			return new ArrayList<>();
		}
		List<Item> diff = new ArrayList<>();//step 4
		if (service.equals("place")) {
			HereAPI api = new HereAPI();
			Set<Item> allPlaces = new HashSet<>();//step 3
			for (String category : allCategories) {
				List<Item> places = api.searchByCategory(category, latitude, longitude); 
				for (Item place : places) {
					// Save the item into db.
					conn.saveItem(place);
				}
				allPlaces.addAll(places);
			}
			int count = 0;
			for (Item place : allPlaces) {
				// Perform filtering
				if (!favoriteItems.contains(place.getItemId())) {
					diff.add(place);
					count++;
					if (count >= MAX_RECOMMENDED_ITEMS) {
						break;
					}
				}
			}
		} else if (service.equals("restaurant")) {
			Set<String> allItemIds = new HashSet<>();//step 3
			for (String category : allCategories) {
				Set<String> set = conn.getItemIds(category);
				allItemIds.addAll(set);
			}
			int count = 0;
			for (String itemId : allItemIds) {
				// Perform filtering
				if (!favoriteItems.contains(itemId)) {
					diff.add(conn.getItemById(itemId));
					count++;
					if (count >= MAX_RECOMMENDED_ITEMS) {
						break;
					}
				}
			}		
		} else {
			NewYorkTimesAPI api = new NewYorkTimesAPI();
			Set<Item> allNews = new HashSet<>();//step 3
			for (String category : allCategories) {
				List<Item> news = api.searchByCategory(city, category);
				Thread.currentThread();
				try {
					Thread.sleep(1000);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}   
				for (Item item : news) {
					conn.saveItem(item);
				}
				allNews.addAll(news);
			}
			int count = 0;
			for (Item item : allNews) {
				// Perform filtering
				if (!favoriteItems.contains(item.getItemId())) {
					diff.add(item);
					count++;
					if (count >= MAX_RECOMMENDED_ITEMS) {
						break;
					}
				}
			}
			if (count < MAX_RECOMMENDED_ITEMS) {
				Set<String> res = new HashSet<>();//step 3
				for (String category : allCategories) {
					Set<String> set = conn.getItemIds(category);
					res.addAll(set);
				}
				for (String businessId : res) {
					// Perform filtering
					if (!favoriteItems.contains(businessId)) {
						diff.add(conn.getItemById(businessId));
						count++;
						if (count >= MAX_RECOMMENDED_ITEMS) {
							break;
						}
					}
				}
			}
		}
		return diff;
	}

}
