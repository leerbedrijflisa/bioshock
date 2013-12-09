namespace Lisa.Bioshock.Data.Tables
{
    public class User
    {
        public int ID
        {
            get;
            set;
        }

        public object CustomerUserID
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

        public User()
        {
        }
    }
}
