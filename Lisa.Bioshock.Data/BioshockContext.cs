using Lisa.Bioshock.Data.Tables;
using System.Data.Entity;
namespace Lisa.Bioshock.Data
{
    public class BioshockContext : DbContext
    {
        public DbSet<User> Users
        {
            get;
            set;
        }

        public DbSet<Customer> Customers
        {
            get;
            set;
        }

        public BioshockContext()
            : base()
        {
        }

        public BioshockContext(string connectionString)
            : base(connectionString)
        {
        }
    }
}
