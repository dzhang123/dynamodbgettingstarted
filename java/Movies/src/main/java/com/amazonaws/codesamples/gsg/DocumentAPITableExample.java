package com.amazonaws.codesamples.gsg;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.QueryOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.TableCollection;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import com.amazonaws.services.dynamodbv2.model.AttributeDefinition;
import com.amazonaws.services.dynamodbv2.model.CreateTableRequest;
import com.amazonaws.services.dynamodbv2.model.KeySchemaElement;
import com.amazonaws.services.dynamodbv2.model.KeyType;
import com.amazonaws.services.dynamodbv2.model.ListTablesResult;
import com.amazonaws.services.dynamodbv2.model.ProvisionedThroughput;
import com.amazonaws.services.dynamodbv2.model.TableDescription;


public class DocumentAPITableExample {

	static AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard()
			.withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration("http://localhost:3306", "us-east-1"))
			.build();
	static DynamoDB dynamoDB = new DynamoDB(client);
	
	static String tableName = "ExampleTable";
	
	public static void main(String[] args) throws Exception {
		// TODO Auto-generated method stub
		//createExampleTable();
		//listMyTables();
		//getTableInformation();
		//updateExampleTable();
		
		//deleteExampleTable();
		
		
		getReplyTable();

	}
	
	static void getReplyTable() {
		AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard()
				.withRegion(Regions.US_EAST_1).build();
				DynamoDB dynamoDB = new DynamoDB(client);

				Table table = dynamoDB.getTable("Reply");

				QuerySpec spec = new QuerySpec()
				    .withKeyConditionExpression("Id = :v_id")
				    .withValueMap(new ValueMap()
				        .withString(":v_id", "Amazon DynamoDB#DynamoDB Thread 1"));

				ItemCollection<QueryOutcome> items = table.query(spec);

				Iterator<Item> iterator = items.iterator();
				Item item = null;
				while (iterator.hasNext()) {
				    item = iterator.next();
				    System.out.println(item.toJSONPretty());
				}
	}
	static void createExampleTable() {
		try {
			List<AttributeDefinition> attributeDefinitions = new ArrayList<AttributeDefinition>();
			attributeDefinitions.add(new AttributeDefinition().withAttributeName("Id").withAttributeType("N"));
			
			List<KeySchemaElement> keySchema = new ArrayList<KeySchemaElement>();
			keySchema.add(new KeySchemaElement().withAttributeName("Id").withKeyType(KeyType.HASH));
			
			CreateTableRequest request = new CreateTableRequest().withTableName(tableName).withKeySchema(keySchema)
					.withAttributeDefinitions(attributeDefinitions).withProvisionedThroughput(new ProvisionedThroughput().withReadCapacityUnits(5L).withWriteCapacityUnits(6L));
			
			 System.out.println("Issuing CreateTable request for " + tableName);
	            Table table = dynamoDB.createTable(request);

	            System.out.println("Waiting for " + tableName + " to be created...this may take a while...");
	            table.waitForActive();

	            getTableInformation();
			
		} catch (Exception e) {
			System.err.println("CreateTable request failed for " + tableName);
            System.err.println(e.getMessage());
		}
	}
	
	static void listMyTables () {
		TableCollection<ListTablesResult> tables = dynamoDB.listTables();
		Iterator<Table> iterator = tables.iterator();
		
		while (iterator.hasNext()) {
			Table table = iterator.next();
			System.out.println(table.getTableName());
		}
	}
	
	static void getTableInformation() {
		TableDescription tableDescription = dynamoDB.getTable(tableName).describe();
		System.out.format(
	            "Name: %s:\n" + "Status: %s \n" + "Provisioned Throughput (read capacity units/sec): %d \n"
	                + "Provisioned Throughput (write capacity units/sec): %d \n",
	            tableDescription.getTableName(), tableDescription.getTableStatus(),
	            tableDescription.getProvisionedThroughput().getReadCapacityUnits(),
	            tableDescription.getProvisionedThroughput().getWriteCapacityUnits());
	}
	
	static void updateExampleTable () {
		Table table = dynamoDB.getTable(tableName);
		
		try {
			table.updateTable(new ProvisionedThroughput().withReadCapacityUnits(6L).withWriteCapacityUnits(7L));
			table.waitForActive();
		}catch (Exception e) {
            System.err.println("UpdateTable request failed for " + tableName);
            System.err.println(e.getMessage());
        }
	}
	static void deleteExampleTable() {

        Table table = dynamoDB.getTable(tableName);
        try {
            System.out.println("Issuing DeleteTable request for " + tableName);
            table.delete();

            System.out.println("Waiting for " + tableName + " to be deleted...this may take a while...");

            table.waitForDelete();
        }
        catch (Exception e) {
            System.err.println("DeleteTable request failed for " + tableName);
            System.err.println(e.getMessage());
        }
    }
	

}

