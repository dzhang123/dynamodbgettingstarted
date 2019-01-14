package com.amazonaws.codesamples.gsg;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.GetItemOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;

public class MusicDocumentDemo {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard().build();
		DynamoDB docClient = new DynamoDB(client);
		
		Table table = docClient.getTable("Movies");
		GetItemOutcome outcome = table.getItemOutcome("Artist", "No One You Know", "SongTitle", "Call Me Today");
		
		int year = outcome.getItem().getInt("Year");
		System.out.println("The song was released in " + year);
	}

}
