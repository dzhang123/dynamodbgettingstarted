package com.amazonaws.codesamples.gsg;

import java.util.HashMap;
import java.util.Map;

import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTyped;

public class MoviesMapperDemo {

	public static void main(String[] args) {
		// TODO Auto-generated method stub

		AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard()
				.withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration("http://localhost:3306", "us-east-1"))
				.build();
		
		//DynamoDB dynamoDB = new DynamoDB(client);
		DynamoDBMapper mapper = new DynamoDBMapper (client);
		
		MoviesItem item = new MoviesItem();
		item.setYear(2015);
		item.setTitle("You Know No Movies");
		Map<String, Object> infoMap = new HashMap<String, Object>();
		infoMap.put("plot",  "Nothing Happens at all");
		infoMap.put("rating", 0);
		item.setInfo(infoMap);
		
		
		mapper.save(item);
			
	}
	
	@DynamoDBTable(tableName="Movies")
	@DynamoDBTyped
	public static class MoviesItem {
		
		private Integer year;
		private String title;
		private Map<String, Object> info;
		
		@DynamoDBHashKey(attributeName = "year")
		public Integer getYear() { return year; }
		public void setYear(Integer year) { this.year = year;}
		
		@DynamoDBRangeKey(attributeName = "title")
		public String getTitle() { return title;}
		public void setTitle(String title) { this.title = title;}
		
		@DynamoDBAttribute(attributeName = "info")
		public Map<String, Object> getInfo() { return info;}
		public void setInfo(Map<String, Object> info) { this.info = info;}
	}
}