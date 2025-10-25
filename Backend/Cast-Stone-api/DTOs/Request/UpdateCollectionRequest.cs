using System.ComponentModel.DataAnnotations;

namespace Cast_Stone_api.DTOs.Request;

public class UpdateCollectionRequest
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
	    public string? Section5Header { get; set; }
	    public string? Section5Content { get; set; }
	    public string? Section5Image { get; set; }
	    public string? Section6Header { get; set; }
	    public string? Section6Content { get; set; }
	    public string? Section6Image { get; set; }
	    public string? Section7Header { get; set; }
	    public string? Section7Content { get; set; }
	    public string? Section7Image { get; set; }

	    // CTA Button fields for Sections 3-7
	    public string? Section3CtaButtonText { get; set; }
	    public string? Section3CtaButtonLink { get; set; }
	    public string? Section4CtaButtonText { get; set; }
	    public string? Section4CtaButtonLink { get; set; }
	    public string? Section5CtaButtonText { get; set; }
	    public string? Section5CtaButtonLink { get; set; }
	    public string? Section6CtaButtonText { get; set; }
	    public string? Section6CtaButtonLink { get; set; }
	    public string? Section7CtaButtonText { get; set; }
	    public string? Section7CtaButtonLink { get; set; }

	    public List<string>? CollageImageSection { get; set; }
	    public string? StaticContentHeader { get; set; }
	    public string? StaticContentParagraph1 { get; set; }
	    public string? StaticContentParagraph2 { get; set; }
	    public string? StaticContentParagraph3 { get; set; }
	    public string? StaticContentBackgroundImage { get; set; }

    // Section Visibility Toggles
    public bool ShowElegantDescription { get; set; } = true;
    public bool ShowSection3 { get; set; } = true;
    public bool ShowSection4 { get; set; } = true;
    public bool ShowSection5 { get; set; } = true;
    public bool ShowSection6 { get; set; } = true;
    public bool ShowSection7 { get; set; } = true;
    public bool ShowCollage { get; set; } = true;
    public bool ShowCtaSection { get; set; } = true;
    public bool ShowWorkerMessage { get; set; } = true;

    public List<int>? ProductIds { get; set; }

    public bool Published { get; set; } = false;

    [Required]
    [MaxLength(100)]
    public string UpdatedBy { get; set; } = string.Empty;
}
