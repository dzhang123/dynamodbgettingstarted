package com.amazonaws.codesamples;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.amazonaws.services.alexaforbusiness.model.ResourceInUseException;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.model.AttributeAction;
import com.amazonaws.services.dynamodbv2.model.AttributeDefinition;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.AttributeValueUpdate;
import com.amazonaws.services.dynamodbv2.model.CreateTableRequest;
import com.amazonaws.services.dynamodbv2.model.CreateTableResult;
import com.amazonaws.services.dynamodbv2.model.DeleteItemRequest;
import com.amazonaws.services.dynamodbv2.model.DescribeTableRequest;
import com.amazonaws.services.dynamodbv2.model.DescribeTableResult;
import com.amazonaws.services.dynamodbv2.model.KeySchemaElement;
import com.amazonaws.services.dynamodbv2.model.KeyType;
import com.amazonaws.services.dynamodbv2.model.ProvisionedThroughput;
import com.amazonaws.services.dynamodbv2.model.PutItemRequest;
import com.amazonaws.services.dynamodbv2.model.ScanRequest;
import com.amazonaws.services.dynamodbv2.model.ScanResult;
import com.amazonaws.services.dynamodbv2.model.StreamSpecification;
import com.amazonaws.services.dynamodbv2.model.StreamViewType;
import com.amazonaws.services.dynamodbv2.model.UpdateItemRequest;

public class StreamsAdapterDemoHelper {

	public static String createTable(AmazonDynamoDB client, String tableName) {
		List<AttributeDefinition> attributeDefinitions = new ArrayList<AttributeDefinition> ();
		attributeDefinitions.add(new AttributeDefinition().withAttributeName("Id").withAttributeType("N"));
		
		List<KeySchemaElement> keySchema = new ArrayList<KeySchemaElement>();
		keySchema.add(new KeySchemaElement().withAttributeName("Id").withKeyType(KeyType.HASH));
		
		ProvisionedThroughput provisionedThroughput = new ProvisionedThroughput().withReadCapacityUnits(2L).withWriteCapacityUnits(2L);
		
		StreamSpecification streamSpecification = new StreamSpecification();
		streamSpecification.setStreamEnabled(true);
		streamSpecification.setStreamViewType(StreamViewType.NEW_IMAGE);
		CreateTableRequest createTableRequest = new CreateTableRequest().withTableName(tableName).withAttributeDefinitions(attributeDefinitions).withKeySchema(keySchema).withProvisionedThroughput(provisionedThroughput);
		
		try {
			System.out.println("Creating table " + tableName);
			CreateTableResult result = client.createTable(createTableRequest);
			return result.getTableDescription().getLatestStreamArn();
		} catch (ResourceInUseException e) {
			System.out.println("Table already exists.");
			return describeTable(client, tableName).getTable().getLatestStreamArn();
		}
	}
	
	public static DescribeTableResult describeTable(AmazonDynamoDB client, String tableName) {
		return client.describeTable(new DescribeTableRequest().withTableName(tableName));
	}
	
	public static ScanResult scanTable(AmazonDynamoDB client, String tableName) {
		return client.scan(new ScanRequest().withTableName(tableName));
	}
	
	public static void putItem(AmazonDynamoDB client, String tableName, String id, String val) {
		Map<String, AttributeValue> item = new HashMap<String, AttributeValue>();
		item.put("Id", new AttributeValue().withN(id));
		item.put("attribute-1", new AttributeValue().withS(val));
		
		PutItemRequest putItemRequest = new PutItemRequest().withTableName(tableName).withItem(item);
		client.putItem(putItemRequest);
	}
	
	public static void putItem(AmazonDynamoDB client, String tableName, Map<String, AttributeValue> items) {
		PutItemRequest putItemRequest = new PutItemRequest().withTableName(tableName).withItem(items);
		client.putItem(putItemRequest);
	}
	
	public static void updateItem(AmazonDynamoDB client, String tableName, String id, String val) {
		Map<String, AttributeValue> key = new HashMap<String, AttributeValue> ();
		key.put("Id", new AttributeValue().withN(id));
		
		Map<String, AttributeValueUpdate> attributeUpdates = new HashMap<String, AttributeValueUpdate>();
		AttributeValueUpdate update = new AttributeValueUpdate().withAction(AttributeAction.PUT).withValue(new AttributeValue().withS(val));
		attributeUpdates.put("attribute-2", update);
		
		UpdateItemRequest updateItemRequest = new UpdateItemRequest().withTableName(tableName).withKey(key).withAttributeUpdates(attributeUpdates);
		client.updateItem(updateItemRequest);
	}
	
	public static void deleteItem(AmazonDynamoDB client, String tableName, String id) {
		Map<String, AttributeValue> key = new HashMap<String, AttributeValue>();
		key.put("Id", new AttributeValue().withN(id));
		
		DeleteItemRequest deleteItemRequest = new DeleteItemRequest().withTableName(tableName).withKey(key);
		client.deleteItem(deleteItemRequest);
	}
	
	
}
