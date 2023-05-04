using Microsoft.EntityFrameworkCore;

namespace Lab3BookAPI.Model
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public bool? IsConfirmed { get; set; }
        public string? ConfirmationCode { get; set; }
        public DateTime? ConfirmationCodeExpiration { get; set; }


        public virtual ICollection<Book>? BookList { get; set; }
        public virtual ICollection<Author>? AuthorList { get; set; }
        public virtual ICollection<Genre>? GenresList { get; set; }
        //public virtual ICollection<BookAuthor>? BookAuthorList { get; set; }
        public virtual UserProfile UserProfile { get; set; }
    }
}
