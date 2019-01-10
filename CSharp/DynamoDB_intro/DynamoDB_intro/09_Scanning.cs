using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Amazon.DynamoDBv2.Model;
using Amazon.DynamoDBv2.DocumentModel;

namespace DynamoDB_intro
{
  public static partial class Ddb_Intro
  {
    /*--------------------------------------------------------------------------
     *                             ClientScanning_async
     *--------------------------------------------------------------------------*/
    public static async Task<bool> ClientScanning_async( ScanRequest sRequest )
    {
      operationSucceeded = false;
      operationFailed = false;

      ScanResponse sResponse;
      Task<ScanResponse> clientScan = client.ScanAsync(sRequest);
      try
      {
        sResponse = await clientScan;
      }
      catch( Exception ex )
      {
        Console.WriteLine( "     -- FAILED to retrieve the movies, because:\n        {0}", ex.Message );
        operationFailed = true;
        pause( );
        return( false );
      }
      Console.WriteLine( "     -- The low-level scan succeeded, and returned {0} movies!", sResponse.Items.Count );
      if( !pause( ) )
      {
        operationFailed = true;
        return ( false );
      }

      Console.WriteLine( "         Here are the movies retrieved:\n" +
                         "         --------------------------------------------------------------------------" );
      foreach( Dictionary<string, AttributeValue> item in sResponse.Items )
        showMovieAttrsShort( item );

      Console.WriteLine( "     -- Retrieved {0} movies.", sResponse.Items.Count );
      operationSucceeded = true;
      return ( true );
    }
  }
}