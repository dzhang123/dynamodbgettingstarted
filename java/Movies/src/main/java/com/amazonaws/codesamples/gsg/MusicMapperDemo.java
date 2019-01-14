package com.amazonaws.codesamples.gsg;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

public class MusicMapperDemo {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard().build();
		
		DynamoDBMapper mapper = new DynamoDBMapper (client);
		
		MusicItem keySchema = new MusicItem();
		keySchema.setArtist ("No One Your Know");
		keySchema.setSongTitle("Call Me Today");
		
		try {
			MusicItem result = mapper.load(keySchema);
			if (result != null) {
				System.out.println("The song was released in " + result.getYear());
			} else {
				System.out.println("No matching song was found");
			}
		}catch (Exception e) {
				System.err.println("Unable to retrieve data: ");
				System.err.println(e.getMessage());
			}
		}
	}


@DynamoDBTable(tableName = "Movies")
class MusicItem {
	private String artist;
	private String songTitle;
	private String albumTitle;
	private int year;
	
	@DynamoDBHashKey(attributeName="Artist")
	public String getArtist() { return artist;}
	public void setArtist(String artist) { this.artist = artist;}
	
	@DynamoDBRangeKey(attributeName = "SongTitle")
	public String getSongTitle() { return songTitle;}
	public void setSongTitle(String songTitle) { this.songTitle = songTitle;}
	
	@DynamoDBAttribute(attributeName="AlbumTitle")
	public String getAlbumTitle() { return albumTitle;}
	public void setAlbumTitle(String albumTitle) {this.albumTitle = albumTitle;}

	@DynamoDBAttribute(attributeName="Year")
	public int getYear() { return year;}
	public void setYear(int year) { this.year = year;}
}