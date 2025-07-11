using Cast_Stone_api.Data;
using Cast_Stone_api.Domain.Models.PaymentGatewaySettings;
using Cast_Stone_api.Mappings;
using Cast_Stone_api.Repositories.Implementations;
using Cast_Stone_api.Repositories.Interfaces;
using Cast_Stone_api.Services;
using Cast_Stone_api.Services.Implementations;
using Cast_Stone_api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Stripe;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Railway deployment configuration
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// Local development configuration (commented for Railway deployment)
//var port = Environment.GetEnvironmentVariable("Port") ?? "7069";
//builder.WebHost.UseUrls($"http://*:{port}");

builder.Services.AddHealthChecks();


Console.WriteLine("🧪 ENVIRONMENT: " + builder.Environment.EnvironmentName);
Console.WriteLine("🧪 DefaultConnection: " + builder.Configuration.GetConnectionString("DefaultConnection"));
// Add services to the container.

// Configure Entity Framework with PostgreSQL
try
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
}
catch(Exception ex)
{
    throw new Exception("DB Context failed to register: " + ex.Message);
}
// Configure AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Register Repositories
builder.Services.AddScoped<ICollectionRepository, CollectionRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICartRepository, CartRepository>();
builder.Services.AddScoped<IContactFormSubmissionRepository, ContactFormSubmissionRepository>();

// Register Services
builder.Services.AddScoped<ICollectionService, CollectionService>();
builder.Services.AddScoped<IProductService, Cast_Stone_api.Services.Implementations.ProductService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IContactFormSubmissionService, ContactFormSubmissionService>();
builder.Services.AddScoped<CloudinaryService>();
builder.Services.AddScoped<StripeService>();
builder.Services.AddScoped<PayPalService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.Configure<StripeSettings>(
builder.Configuration.GetSection("Stripe"));

builder.Services.Configure<PayPalSettings>(
builder.Configuration.GetSection("PayPal"));

builder.Services.Configure<SmtpSettings>(
builder.Configuration.GetSection("SmtpSettings"));

builder.Services.Configure<ApplePaySettings>(
builder.Configuration.GetSection("ApplePay"));

StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"];

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Cast Stone API",
        Version = "v1",
        Description = "A comprehensive API for Cast Stone application",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "Cast Stone Team",
            Email = "support@caststone.com"
        }
    });

    // Include XML comments
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (System.IO.File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        // Production frontend URLs (update these with your actual frontend domain)
        policy.WithOrigins(
                "https://cast-stonev2.vercel.app", "http://cast-stonev2.vercel.app",
                 "http://localhost:3000", "https://localhost:3000", "http://localhost:3001", "https://localhost:3001" // Replace with your actual frontend URL
              )
              .AllowAnyHeader()
              .AllowAnyMethod();
              //.AllowCredentials();
    });
});

var app = builder.Build();

// Fix JSON data if requested
if (app.Environment.IsDevelopment() && args.Contains("--fix-json"))
{
    await Cast_Stone_api.Scripts.FixJsonDataRunner.FixJsonData();
    return;
}

// Test API endpoints if in development mode
if (app.Environment.IsDevelopment() && args.Contains("--test"))
{
    await Cast_Stone_api.TestApiEndpoints.TestCollectionsAndProducts();
    return;
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Cast Stone API V1");
        c.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
    });
}

// HTTPS redirection - Railway handles SSL termination
// Only use HTTPS redirection in development
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// For Railway deployment, comment out HTTPS redirection
// Railway handles SSL termination at the load balancer level
//app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.UseHealthChecks("/health");

app.MapControllers();
try
{
    app.Run();
}
catch(Exception ex)
{
    Console.WriteLine("❌ Unhandled Exception");
    Console.WriteLine(ex.ToString());
}