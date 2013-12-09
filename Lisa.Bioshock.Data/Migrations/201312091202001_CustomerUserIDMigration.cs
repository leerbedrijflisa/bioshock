namespace Lisa.Bioshock.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CustomerUserIDMigration : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "CustomerUserID", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Users", "CustomerUserID");
        }
    }
}
