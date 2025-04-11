using Microsoft.EntityFrameworkCore;
using NguyenThuyTien_2122110531.Model;

namespace NguyenThuyTien_2122110531.Data
{
        public class AppDbContext : DbContext
        {
            public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
            public DbSet<Product> Products { get; set; }
            public DbSet<Category> Categories { get; set; }
    }
}
