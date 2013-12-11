using System.Collections.Generic;
namespace Lisa.Bioshock.Data.Tables
{
    public class User
    {
        public User()
        {
        }

        public int ID
        {
            get;
            set;
        }

        public string CustomerUserID
        {
            get;
            set;
        }

        public int CustomerID
        {
            get;
            set;
        }

        public virtual Customer Customer
        {
            get;
            set;
        }

        public virtual List<Project> Projects
        {
            get;
            set;
        }
    }
}
