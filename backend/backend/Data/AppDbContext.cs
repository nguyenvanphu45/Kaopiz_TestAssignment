using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
	public class AppDbContext : DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
		{
		}

		public DbSet<Users> Users { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			// Unique constraints
			modelBuilder.Entity<Users>()
				.HasIndex(u => u.Email)
				.IsUnique();

			// Soft delete
			modelBuilder.Entity<Users>().HasQueryFilter(u => u.DeletedAt == null);
		}
	}
}
