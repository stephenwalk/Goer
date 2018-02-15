package offline;

import java.io.BufferedReader;
import java.io.FileReader;

import org.bson.Document;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.IndexOptions;
import com.mongodb.client.model.Indexes;

import db.mongodb.MongoDBUtil;

public class Purify {
	public static void main(String[] args) {
		MongoClient mongoClient = new MongoClient();
		MongoDatabase db = mongoClient.getDatabase(MongoDBUtil.DB_NAME);
		// The name of the file to open.
		String fileName = "/Users/tianfengye/Downloads/ratings_Musical_Instruments.csv";

		String line = null;

		try {
			FileReader fileReader = new FileReader(fileName);

			BufferedReader bufferedReader = new BufferedReader(fileReader);
			while ((line = bufferedReader.readLine()) != null) {
				String[] values = line.split(",");
				IndexOptions indexOptions = new IndexOptions().unique(true);
				db.getCollection("ratings").createIndex(Indexes.compoundIndex(Indexes.ascending("user"), Indexes.ascending("item")), indexOptions);
				db.getCollection("ratings").insertOne(new Document().append("user", values[0]).append("item", values[1])
						.append("rating", Double.parseDouble(values[2])));

				//				db.getCollection("ratings").updateOne(
				//						new Document().append("user", values[0]).append("item", values[1]),
				//						new Document("$set", new Document().append("rating", Double.parseDouble(values[2]))), indexOptions);
			}
			System.out.println("Import Done!");
			bufferedReader.close();
			mongoClient.close();

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}