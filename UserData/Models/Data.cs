using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
namespace UserData.Models;

public class DataContextDesignTimeFactory : IDesignTimeDbContextFactory<DataContext>
{
    public DataContext CreateDbContext(string[] args)
    {
        // Configura la construcción del contexto de datos utilizando un constructor vacío
        var optionsBuilder = new DbContextOptionsBuilder<DataContext>();

        // Obtiene el directorio actual del proceso (donde se ejecuta el comando)
        string currentDirectory = Directory.GetCurrentDirectory();

        // Establece la ruta base para buscar el archivo appsettings.json
        string basePath = Path.Combine(currentDirectory, "..", "Login");

        // Carga la configuración desde el archivo appsettings.json en la nueva ubicación
        IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.json")
            .Build();

        // Configura la cadena de conexión
        optionsBuilder.UseSqlite(configuration.GetConnectionString("SQLite"));

        // Crea una instancia de DataContext con las opciones de contexto configuradas
        return new DataContext(optionsBuilder.Options);
    }
}
