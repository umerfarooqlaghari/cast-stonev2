using AutoMapper;
using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;

namespace Cast_Stone_api.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Collection mappings
        //CreateMap<Collection, CollectionResponse>()
        //    .ForMember(dest => dest.Products, opt => opt.MapFrom(src => src.Products));
        CreateMap<Collection, CollectionResponse>()
           .ForMember(dest => dest.ParentCollection, opt => opt.Ignore())
           .ForMember(dest => dest.ChildCollections, opt => opt.Ignore())
           .ForMember(dest => dest.ProductCount, opt => opt.MapFrom(src => src.Products.Count));

        CreateMap<CreateCollectionRequest, Collection>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.ParentCollection, opt => opt.Ignore())
            .ForMember(dest => dest.ChildCollections, opt => opt.Ignore())
            .ForMember(dest => dest.Products, opt => opt.Ignore());
        
        CreateMap<UpdateCollectionRequest, Collection>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.ParentCollection, opt => opt.Ignore())
            .ForMember(dest => dest.ChildCollections, opt => opt.Ignore())
            .ForMember(dest => dest.Products, opt => opt.Ignore());

        CreateMap<Collection, CollectionHierarchyResponse>()
            .ForMember(dest => dest.Children, opt => opt.Ignore())
            .ForMember(dest => dest.ProductCount, opt => opt.Ignore());

        // Product mappings
        CreateMap<Product, ProductResponse>();
        
        CreateMap<CreateProductRequest, Product>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Collection, opt => opt.Ignore())
            .ForMember(dest => dest.OrderItems, opt => opt.Ignore());
        
        CreateMap<UpdateProductRequest, Product>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Collection, opt => opt.Ignore())
            .ForMember(dest => dest.OrderItems, opt => opt.Ignore());

        CreateMap<Product, ProductSummaryResponse>()
            .ForMember(dest => dest.MainImage, opt => opt.MapFrom(src => src.Images.FirstOrDefault()))
            .ForMember(dest => dest.CollectionName, opt => opt.MapFrom(src => src.Collection != null ? src.Collection.Name : string.Empty));

        // Order mappings
        CreateMap<Order, OrderResponse>();
        
        CreateMap<CreateOrderRequest, Order>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.TotalAmount, opt => opt.Ignore())
            .ForMember(dest => dest.StatusId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.Ignore())
            .ForMember(dest => dest.OrderItems, opt => opt.Ignore());

        CreateMap<Order, OrderSummaryResponse>()
            .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.Status != null ? src.Status.StatusName : string.Empty))
            .ForMember(dest => dest.ItemCount, opt => opt.MapFrom(src => src.OrderItems.Count));

        // OrderItem mappings
        CreateMap<OrderItem, OrderItemResponse>();
        
        CreateMap<CreateOrderItemRequest, OrderItem>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.PriceAtPurchaseTime, opt => opt.Ignore())
            .ForMember(dest => dest.OrderId, opt => opt.Ignore())
            .ForMember(dest => dest.Product, opt => opt.Ignore())
            .ForMember(dest => dest.Order, opt => opt.Ignore());

        // User mappings
        CreateMap<User, UserResponse>();
        
        CreateMap<CreateUserRequest, User>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Orders, opt => opt.Ignore());
        
        CreateMap<UpdateUserRequest, User>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Email, opt => opt.Ignore())
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Orders, opt => opt.Ignore());

        // Status mappings
        CreateMap<Status, StatusResponse>();

        // Cart mappings
        CreateMap<Cart, CartResponse>()
            .ForMember(dest => dest.TotalAmount, opt => opt.Ignore())
            .ForMember(dest => dest.TotalItems, opt => opt.Ignore());

        CreateMap<CartItem, CartItemResponse>()
            .ForMember(dest => dest.ItemTotal, opt => opt.MapFrom(src => src.Quantity * (src.Product != null ? src.Product.Price : 0)));

        CreateMap<AddToCartRequest, Cart>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore())
            .ForMember(dest => dest.CartItems, opt => opt.Ignore());

        // Contact Form mappings
        CreateMap<ContactFormSubmission, ContactFormSubmissionResponse>()
            .ForMember(dest => dest.InquiryDisplayName, opt => opt.MapFrom(src => GetInquiryDisplayName(src.Inquiry)));

        CreateMap<CreateContactFormSubmissionRequest, ContactFormSubmission>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());
    }

    private static string GetInquiryDisplayName(InquiryType inquiry)
    {
        return inquiry switch
        {
            InquiryType.ProductInquiry => "Product Inquiry",
            InquiryType.RequestDesignConsultation => "Request a Design Consultation",
            InquiryType.CustomOrders => "Custom Orders",
            InquiryType.TradePartnerships => "Trade Partnerships",
            InquiryType.InstallationSupport => "Installation Support",
            InquiryType.ShippingAndLeadTimes => "Shipping & Lead Times",
            InquiryType.RequestCatalogPriceList => "Request a Catalog / Price List",
            InquiryType.MediaPressInquiry => "Media / Press Inquiry",
            InquiryType.GeneralQuestions => "General Questions",
            _ => inquiry.ToString()
        };
    }
}
