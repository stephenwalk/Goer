package algorithm;

import java.util.List;

import entity.Item;

public interface Recommendation {
	public List<Item> recommendItems(String userId, String service, double latitude, double longitude, String city);
}
