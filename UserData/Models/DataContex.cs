using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace UserData.Models;
public class DataContext : IdentityDbContext<ApplicationUser>
{

    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {
    }
    protected override void OnModelCreating(ModelBuilder builder)
    {

        base.OnModelCreating(builder);
        // Configurar propiedades de ApplicationUser
        builder.Entity<ApplicationUser>(entity =>
        {
            // Configurar que TokenRefresh puede ser nulo
            entity.Property(e => e.TokenRefresh)
                .IsRequired(false); // Indica que no es obligatorio

            // Configurar TokenRefreshExpiry como DateTime
            entity.Property(e => e.TokenRefreshExpiry)
                .HasColumnType("datetime"); // Configurar el tipo de columna en la base de datos
        });
        SeedRoles(builder);
    }

    private static void SeedRoles(ModelBuilder builder)
    {
        builder.Entity<IdentityRole>().HasData
        (
            new IdentityRole() { Name = "Admin", ConcurrencyStamp = "1", NormalizedName = "ADMIN" },
            new IdentityRole() { Name = "User", ConcurrencyStamp = "2", NormalizedName = "USER" },
            new IdentityRole() { Name = "HR", ConcurrencyStamp = "3", NormalizedName = "HR" }
        );
    }
}




