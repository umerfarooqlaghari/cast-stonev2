using System.ComponentModel.DataAnnotations;

namespace Cast_Stone_api.DTOs.Request;

public class CreateCollectionRequest
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    [Range(1, 3)]
    public int Level { get; set; }

    public int? ParentCollectionId { get; set; }

    public List<int>? ChildCollectionIds { get; set; }

    public List<string> Tags { get; set; } = new List<string>();

    public List<string> Images { get; set; } = new List<string>();

	    // New optional content fields
	    public string? ElegantHeader { get; set; }
	    public string? ElegantDescription { get; set; }
	    public string? Section3Header { get; set; }
	    public string? Section3Content { get; set; }
	    public string? Section3Image { get; set; }
	    public string? Section4Header { get; set; }
	    public string? Section4Content { get; set; }
	    public string? Section4Image { get; set; }
	    public List<string>? CollageImageSection { get; set; }
	    public string? StaticContentHeader { get; set; }
	    public string? StaticContentParagraph1 { get; set; }
	    public string? StaticContentParagraph2 { get; set; }
	    public string? StaticContentParagraph3 { get; set; }


    public List<int>? ProductIds { get; set; }

    public bool Published { get; set; } = false;

    [Required]
    [MaxLength(100)]
    public string CreatedBy { get; set; } = string.Empty;
}
