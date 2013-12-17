namespace Lisa.Bioshock.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class LastOpenFileMigration : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Projects", "LastOpenedFile", c => c.Guid(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Projects", "LastOpenedFile");
        }
    }
}
