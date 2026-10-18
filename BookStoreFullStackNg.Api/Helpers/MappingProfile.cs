using System;
using AutoMapper;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs;
using BookStoreFullStackNg.Data.DTOs.Author;
using BookStoreFullStackNg.Data.DTOs.Book;
using BookStoreFullStackNg.Data.DTOs.Cart;

namespace BookStoreFullStackNg.Api.Helpers;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Genre, GenreCreateDto>().ReverseMap();
        CreateMap<Genre, GenreUpdateDto>().ReverseMap();
        CreateMap<Genre, GenreReadDto>().ReverseMap();
        CreateMap<Author, AuthorCreateDTO>().ReverseMap();
        CreateMap<Author, AuthorUpdateDTO>().ReverseMap();
        CreateMap<Author, AuthorReadDTO>().ReverseMap();
        CreateMap<Book, BookReadDto>().ReverseMap();
        CreateMap<Book, BookCreateDto>().ReverseMap();
        CreateMap<Book, BookUpdateDto>().ReverseMap();
        CreateMap<CartItem,CartItemCreateDto>().ReverseMap();
        CreateMap<CartItem,CartItemUpdateDto>().ReverseMap();
        CreateMap<CartItem,CartItemDto>().ReverseMap();
    }
}
