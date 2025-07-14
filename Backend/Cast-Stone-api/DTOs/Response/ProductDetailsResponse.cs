namespace Cast_Stone_api.DTOs.Response;

public class ProductDetailsResponse
{
    public int Id { get; set; }
    public string? UPC { get; set; }
    public string? IndoorUseOnly { get; set; }
    public string? AssemblyRequired { get; set; }
    public string? EaseOfAssembly { get; set; }
    public string? AssistanceRequired { get; set; }
    public string? SplashLevel { get; set; }
    public string? SoundLevel { get; set; }
    public string? SoundType { get; set; }
    public string? ReplacementPumpKit { get; set; }
    public string? ElectricalCordLength { get; set; }
    public string? PumpSize { get; set; }
    public string? ShipMethod { get; set; }
    public string? CatalogPage { get; set; }
    public int ProductId { get; set; }
}
