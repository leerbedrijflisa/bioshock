namespace Lisa.Bioshock.Data.Migrations
{
    using Lisa.Bioshock.Data.Tables;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<Lisa.Bioshock.Data.BioshockContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(Lisa.Bioshock.Data.BioshockContext context)
        {
            context.Customers.AddOrUpdate(
                cust => cust.Name,
                new Customer
                {
                    Name = "Da Vinci College - Dordrecht"
                });

        }
    }
}
