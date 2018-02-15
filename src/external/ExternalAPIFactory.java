package external;

public class ExternalAPIFactory {
	private static final String DEFAULT_PIPELINE = "restaurant";

	// Start different APIs based on the pipeline.
	public static ExternalAPI getExternalAPI(String pipeline) {
		switch (pipeline) {
		case "restaurant":
			return new YelpAPI(); 
		case "place":
			return new HereAPI();
		case "event":
			return new TicketMasterAPI();
		case "new":
			return new NewYorkTimesAPI(); 
		case "job":
			// return new LinkedInAPI(); 
			return null;
		default:
			throw new IllegalArgumentException("Invalid pipeline " + pipeline);
		}
	}

	public static ExternalAPI getExternalAPI() {
		return getExternalAPI(DEFAULT_PIPELINE);
	}
}
