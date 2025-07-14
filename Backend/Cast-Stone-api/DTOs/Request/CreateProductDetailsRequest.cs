using System.ComponentModel.DataAnnotations;

namespace Cast_Stone_api.DTOs.Request;

public class CreateProductDetailsRequest
{
    [MaxLength(100)]
    public string? UPC { get; set; }
    
    [MaxLength(10)]
    public string? IndoorUseOnly { get; set; }
    
    [MaxLength(10)]
    public string? AssemblyRequired { get; set; }
    
    [MaxLength(200)]
    public string? EaseOfAssembly { get; set; }
    
    [MaxLength(200)]
    public string? AssistanceRequired { get; set; }
    
    [MaxLength(200)]
    public string? SplashLevel { get; set; }
    
    [MaxLength(200)]
    public string? SoundLevel { get; set; }
    
    [MaxLength(200)]
    public string? SoundType { get; set; }
    
    [MaxLength(100)]
    public string? ReplacementPumpKit { get; set; }
    
    [MaxLength(100)]
    public string? ElectricalCordLength { get; set; }
    
    [MaxLength(100)]
    public string? PumpSize { get; set; }
    
    [MaxLength(100)]
    public string? ShipMethod { get; set; }

    [MaxLength(100)]
    public string? Drainage_Info { get; set; }

    [MaxLength(100)]
    public string? Inside_Top { get; set; }

    [MaxLength(100)]
    public string? Inside_Bottom { get; set; }
    [MaxLength(100)]
    public string? Inside_Height { get; set; }

    [MaxLength(100)]
    public string? CatalogPage { get; set; }
    
    [MaxLength(100)]
    public string? Factory_Code { get; set; }

    [Required]
    public int ProductId { get; set; }
}
