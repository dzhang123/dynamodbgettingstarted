package com.amazonaws.codesamples;

import java.nio.charset.Charset;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.streamsadapter.model.RecordAdapter;
import com.amazonaws.services.kinesis.clientlibrary.interfaces.v2.IRecordProcessor;
import com.amazonaws.services.kinesis.clientlibrary.lib.worker.ShutdownReason;
import com.amazonaws.services.kinesis.clientlibrary.types.InitializationInput;
import com.amazonaws.services.kinesis.clientlibrary.types.ProcessRecordsInput;
import com.amazonaws.services.kinesis.clientlibrary.types.ShutdownInput;
import com.amazonaws.services.kinesis.model.Record;

public class StreamsRecordProcessor implements IRecordProcessor {
	
	private Integer checkpointCounter;
	private final AmazonDynamoDB dynamoDBClient;
	private final String tableName;
	
	public StreamsRecordProcessor (AmazonDynamoDB dynamoDBClient2, String tableName) {
		this.dynamoDBClient = dynamoDBClient2;
		this.tableName = tableName;
	}

	@Override
	public void initialize(InitializationInput initializationInput) {
		// TODO Auto-generated method stub
		checkpointCounter = 0;
	}

	@Override
	public void processRecords(ProcessRecordsInput processRecordsInput) {
		// TODO Auto-generated method stub
		for (Record record: processRecordsInput.getRecords()) {
			String data = new String(record.getData().array(), Charset.forName("UTF-8"));
			System.out.println(data);
			if (record instanceof RecordAdapter) {
				com.amazonaws.services.dynamodbv2.model.Record streamRecord = ((RecordAdapter) record).getInternalObject();
				
				switch(streamRecord.getEventName()) {
					case "INSERT": 
					case "MODIFY":
						StreamsAdapterDemoHelper.putItem(dynamoDBClient, tableName, streamRecord.getDynamodb().getNewImage());
						break;
					case "REMOVE":
						StreamsAdapterDemoHelper.deleteItem(dynamoDBClient, tableName, streamRecord.getDynamodb().getKeys().get("Id").getN());
				}
			}
			checkpointCounter += 1;
			if (checkpointCounter % 10 == 0) {
				try {
					processRecordsInput.getCheckpointer().checkpoint();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
	}

	@Override
	public void shutdown(ShutdownInput shutdownInput) {
		// TODO Auto-generated method stub
		if (shutdownInput.getShutdownReason() == ShutdownReason.TERMINATE) {
            try {
                shutdownInput.getCheckpointer().checkpoint();
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
 
	}

}
