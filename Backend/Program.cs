using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using System.Collections.Generic;
using System.Linq;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors("AllowAll");


var products = new List<Product>
{
    new Product { Id = 1, Name = "Notebook", Price = 3500.00m, Description = "Notebook potente para trabalho e estudo", ImageUrl = "" },
    new Product { Id = 2, Name = "Mouse Gamer", Price = 150.00m, Description = "Mouse gamer com alta precisão", ImageUrl = "" },
    new Product { Id = 3, Name = "Teclado Mecânico", Price = 400.00m, Description = "Teclado mecânico com iluminação RGB", ImageUrl = "" }
};


app.MapGet("/api/products", () =>
{
    return Results.Ok(products);
});


app.MapPut("/api/products/{id}", (int id, Product updatedProduct) =>
{
    var product = products.FirstOrDefault(p => p.Id == id);
    if (product == null)
    {
        return Results.NotFound("Produto não encontrado.");
    }

    
    var minRequiredPrice = product.Price * 1.2m;
    if (updatedProduct.Price < minRequiredPrice)
    {
        return Results.BadRequest($"O novo preço deve ser pelo menos 20% maior que o atual. Preço mínimo permitido: R$ {minRequiredPrice:F2}");
    }

    product.Price = updatedProduct.Price;
    product.Description = updatedProduct.Description;
    product.Name = updatedProduct.Name;
    product.ImageUrl = updatedProduct.ImageUrl;

    return Results.Ok(product);
});

app.Run("https://localhost:5001");

record Product
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public decimal Price { get; set; }
    public string Description { get; set; } = "";
    public string ImageUrl { get; set; } = "";
}
