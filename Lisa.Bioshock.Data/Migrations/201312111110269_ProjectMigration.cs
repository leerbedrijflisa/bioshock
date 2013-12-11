namespace Lisa.Bioshock.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ProjectMigration : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Projects",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        RootID = c.Guid(nullable: false, identity: true),
                        OwnerID = c.Int(nullable: false),
                        Created = c.DateTime(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.Users", t => t.OwnerID, cascadeDelete: true)
                .Index(t => t.OwnerID);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Projects", "OwnerID", "dbo.Users");
            DropIndex("dbo.Projects", new[] { "OwnerID" });
            DropTable("dbo.Projects");
        }
    }
}
