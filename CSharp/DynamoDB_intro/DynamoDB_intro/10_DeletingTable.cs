using System;
using System.Threading.Tasks;

namespace DynamoDB_intro
{
  public static partial class Ddb_Intro
  {
    /*--------------------------------------------------------------------------
     *                DeletingTable_async
     *--------------------------------------------------------------------------*/
    public static async Task<bool> DeletingTable_async( string tableName )
    {
      operationSucceeded = false;
      operationFailed = false;

      Console.WriteLine( "  -- Trying to delete the table named \"{0}\"...", tableName );
      pause( );
      Task tblDelete = client.DeleteTableAsync( tableName );
      try
      {
        await tblDelete;
      }
      catch( Exception ex )
      {
        Console.WriteLine( "     ERROR: Failed to delete the table, because:\n            " + ex.Message );
        operationFailed = true;
        return ( false );
      }
      Console.WriteLine( "     -- Successfully deleted the table!" );
      operationSucceeded = true;
      pause( );
      return ( true );
    }
  }
}