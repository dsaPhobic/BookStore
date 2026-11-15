# BẢN MÔ TẢ NGHIỆP VỤ CHI TIẾT ĐỒ ÁN BOOKSTORE FULLSTACK
## (BẢN CHI TIẾT NGHIỆP VỤ TỪNG THÀNH VIÊN - BÁO CÁO REVIEW GIẢNG VIÊN)

---

> **Dự án:** Website Bán Sách Trực Tuyến (BookStore FullStack)  
> **Kiến trúc công nghệ Backend:** ASP.NET Core 8 Web API, Entity Framework Core, SQLite, Cloudinary SDK, Serilog, System.Linq.Dynamic.Core  
> **Kiến trúc công nghệ Frontend:** Angular 18 (Standalone Components, Signals), NgRx Store & Effects (State Management), Angular Material, SCSS (Modern Minimalist Design)  
> **Quy mô nhóm:** 4 Thành viên (Mỗi thành viên phụ trách 4 chức năng độc lập, không tính Authentication/Authorization)  

---

## MỤC LỤC TỔNG QUAN

1. [Bảng Phân Công Nhiệm Vụ 4 Thành Viên](#i-bảng-phân-công-nhiệm-vụ-4-thành-viên)
2. [Chi Tiết Nghiệp Vụ - Thành Viên 1: Quản Trị Danh Mục Sách & Tác Giả](#ii-thành-viên-1-quản-trị-danh-mục-sách--tác-giả-catalog-management)
3. [Chi Tiết Nghiệp Vụ - Thành Viên 2: Trải Nghiệm Khách Hàng & Tìm Kiếm](#iii-thành-viên-2-trải-nghiệm-khách-hàng--tìm-kiếm-storefront--discovery)
4. [Chi Tiết Nghiệp Vụ - Thành Viên 3: Giỏ Hàng & Quy Trình Mua Hàng](#iv-thành-viên-3-giỏ-hàng--quy-trình-mua-hàng-cart--checkout-flow)
5. [Chi Tiết Nghiệp Vụ - Thành Viên 4: Quản Lý Đơn Hàng & Báo Cáo](#v-thành-viên-4-quản-lý-đơn-hàng--báo-cáo-order-management--analytics)
6. [Bảng Tổng Hợp Kiểm Tra Tiến Độ & Trạng Thái Source Code](#vi-bảng-tổng-hợp-kiểm-tra-tiến-độ--trạng-thái-source-code)

---

## I. BẢNG PHÂN CÔNG NHIỆM VỤ 4 THÀNH VIÊN

| Thành viên | Phân hệ / Module phụ trách | Số lượng | Danh sách chức năng chính | Trạng thái kỹ thuật |
| :--- | :--- | :---: | :--- | :--- |
| **Thành viên 1** | **Quản trị Danh mục Sách & Tác giả** *(Catalog Management)* | 4 | 1. Quản lý Tác giả (Author CRUD)<br>2. Quản lý Thể loại sách (Genre CRUD)<br>3. Quản trị Thông tin Sách (Book Admin CRUD)<br>4. Upload & Xử lý Ảnh bìa Sách | • Sẵn có trong Source Code<br>• Sẵn có trong Source Code<br>• Sẵn có trong Source Code<br>• Sẵn có trong Source Code |
| **Thành viên 2** | **Trải nghiệm Khách hàng & Khám phá** *(Storefront & Discovery)* | 4 | 1. Duyệt danh mục Sách công khai (Book Showcase)<br>2. Tìm kiếm, Lọc & Phân trang nâng cao<br>3. Xem Chi tiết Sách & Gợi ý Sách liên quan<br>4. Danh sách Yêu thích (Wishlist) | • Sẵn có trong Source Code<br>• Sẵn có trong Source Code<br>• Sẵn có trong Source Code<br>• **Tính năng mở rộng** |
| **Thành viên 3** | **Giỏ hàng & Quy trình Mua hàng** *(Cart & Checkout Flow)* | 4 | 1. Quản lý Giỏ hàng trực tuyến (Shopping Cart CRUD)<br>2. Tính toán Giá tiền & Thuế tự động (Price & Tax)<br>3. Đặt hàng & Xử lý Thanh toán (Checkout Flow)<br>4. Áp dụng Mã giảm giá (Coupon / Voucher) | • Sẵn có trong Source Code<br>• Sẵn có trong Source Code<br>• Sẵn có trong Source Code<br>• **Tính năng mở rộng** |
| **Thành viên 4** | **Quản lý Đơn hàng & Báo cáo** *(Order Management & Analytics)* | 4 | 1. Lịch sử Đơn hàng Cá nhân (User Order History)<br>2. Quản lý Đơn hàng toàn hệ thống (Customer Orders)<br>3. Cập nhật Trạng thái Đơn hàng (Status Workflow)<br>4. Thống kê Doanh thu & Sách bán chạy (Dashboard) | • Sẵn có trong Source Code<br>• Sẵn có trong Source Code<br>• Sẵn có trong Source Code<br>• **Tính năng mở rộng** |

---

## II. THÀNH VIÊN 1: QUẢN TRỊ DANH MỤC SÁCH & TÁC GIẢ (CATALOG MANAGEMENT)

Phân hệ quản trị danh mục là nền tảng cốt lõi của website, chịu trách nhiệm lưu trữ và tổ chức cấu trúc dữ liệu xuất bản gồm Tác giả, Thể loại và Sách.

```
                    ┌─────────────────────────┐
                    │    Admin Dashboard      │
                    └───────────┬─────────────┘
                                │
        ┌───────────────────────┼──────────────────────┐
        ▼                       ▼                      ▼
┌──────────────┐        ┌──────────────┐       ┌──────────────┐
│ Author CRUD  │        │  Genre CRUD  │       │  Book CRUD   │
│+ Cloudinary  │        │ (Categories) │       │+ ImageUpload │
└──────────────┘        └──────────────┘       └──────────────┘
```

---

### Chức năng 1: Quản trị Tác giả (Author CRUD)
* **Trạng thái:** `[Sẵn có trong Source Code]`
* **Frontend Component:**
  * Component chính: `AuthorComponent` (`src/app/authors/author.component.ts`)
  * Component giao diện con:
    * `AuthorListComponent` (`src/app/authors/ui/author-list.component.ts`): Bảng dữ liệu Angular Material Table hiển thị avatar, tên tác giả, ngày sinh, tiểu sử.
    * `AuthorDialogComponent` (`src/app/authors/ui/author-dialog.component.ts`): Modal Reactive Form thêm mới và chỉnh sửa tác giả, tích hợp chọn file ảnh đại diện.
    * `AuthorPaginatorComponent` (`src/app/authors/ui/author-paginator.component.ts`): Điều khiển phân trang trang danh sách tác giả.
    * `AuthorBooksDialogComponent` (`src/app/authors/ui/author-books-dialog.component.ts`): Modal xem nhanh danh sách các đầu sách thuộc về tác giả.
  * Quản lý trạng thái: `AuthorService` (`src/app/authors/data/author.service.ts`), NgRx Store (`author.actions.ts`, `author.reducers.ts`, `author.effects.ts`, `author.facade.ts`).
* **Backend API Endpoint / Controller:**
  * Controller: `AuthorController` (`BookStoreFullStackNg.Api/Controllers/AuthorController.cs`) - Định tuyến `api/authors`
  * Endpoints:
    * `GET /api/authors?PageNumber=1&PageSize=10&SearchTerm=&SortBy=AuthorName` -> Lấy danh sách tác giả có phân trang và tìm kiếm.
    * `GET /api/authors/{id}` -> Lấy thông tin chi tiết một tác giả.
    * `POST /api/authors` -> `[Authorize(Roles = "Admin")]` Thêm mới tác giả (`[FromForm] AuthorCreateDTO`).
    * `PUT /api/authors/{id}` -> `[Authorize(Roles = "Admin")]` Cập nhật tác giả (`[FromForm] AuthorUpdateDTO`).
    * `DELETE /api/authors/{id}` -> `[Authorize(Roles = "Admin")]` Xóa tác giả.
    * `GET /api/authors/{id}/books` -> `[AllowAnonymous]` Lấy toàn bộ sách của tác giả có phân trang.
    * `GET /api/authors/{id}/stats` -> `[Authorize(Roles = "Admin")]` Thống kê số lượng sách và chỉ số của tác giả.
* **Mô tả nghiệp vụ:**
  * Cho phép Admin thực hiện đầy đủ chu trình CRUD thông tin tác giả sách.
  * Dữ liệu gửi lên hỗ trợ dạng `multipart/form-data` để tải ảnh avatar tác giả. Backend kiểm tra giới hạn kích thước file không quá 2 MB, đồng bộ upload lên dịch vụ Cloudinary CDN và lưu đường dẫn vào cơ sở dữ liệu.
  * Khi cập nhật ảnh mới hoặc xóa tác giả, backend tự động thu hồi và xóa ảnh cũ trên Cloudinary thông qua `PublicId`, tránh lưu trữ rác.
  * Kiểm tra toàn vẹn ràng buộc dữ liệu: Nếu tác giả đang có liên kết với sách trong bảng `BookAuthors`, hệ thống xử lý an toàn để không làm gãy tính toàn vẹn cơ sở dữ liệu.

---

### Chức năng 2: Quản trị Thể loại sách (Genre CRUD)
* **Trạng thái:** `[Sẵn có trong Source Code]`
* **Frontend Component:**
  * Component chính: `GenreComponent` (`src/app/genre/genre.component.ts`)
  * Component giao diện con:
    * `GenreListComponent` (`src/app/genre/ui/genre-list.component.ts`): Bảng danh mục thể loại kèm các nút thao tác Sửa/Xóa.
    * `AddGenreDialogComponent` (`src/app/genre/ui/add-genre-dialog.component.ts`): Hộp thoại thêm/chỉnh sửa tên thể loại.
  * Quản lý trạng thái: `GenreService` (`src/app/genre/data/genre.service.ts`), NgRx Store (`genre.actions.ts`, `genre.reducers.ts`, `genre.effects.ts`).
* **Backend API Endpoint / Controller:**
  * Controller: `GenreController` (`BookStoreFullStackNg.Api/Controllers/GenreController.cs`) - Định tuyến `api/genres`
  * Endpoints:
    * `GET /api/genres` -> `[AllowAnonymous]` Lấy toàn bộ danh sách thể loại sách.
    * `GET /api/genres/{id}` -> Lấy thông tin thể loại theo ID.
    * `POST /api/genres` -> `[Authorize(Roles = "Admin")]` Thêm mới thể loại (`GenreCreateDto`).
    * `PUT /api/genres/{id}` -> `[Authorize(Roles = "Admin")]` Sửa tên thể loại (`GenreUpdateDto`).
    * `DELETE /api/genres/{id}` -> `[Authorize(Roles = "Admin")]` Xóa thể loại.
* **Mô tả nghiệp vụ:**
  * Phân loại sách theo các danh mục chuẩn (Programming, Science, Novel, Business, Psychology, History,...).
  * API công khai `[AllowAnonymous]` cho người dùng tra cứu bộ lọc ngoài trang chủ, nhưng bảo vệ chặt chẽ `[Authorize(Roles = "Admin")]` đối với các quyền thay đổi dữ liệu (POST/PUT/DELETE).
  * Kiểm tra trùng lặp tên thể loại và kiểm tra ràng buộc sách trước khi thực hiện xóa.

---

### Chức năng 3: Quản trị Thông tin Sách (Book Admin CRUD)
* **Trạng thái:** `[Sẵn có trong Source Code]`
* **Frontend Component:**
  * Component chính: `BookComponent` (`src/app/book/book.component.ts`)
  * Component giao diện con:
    * `BookListComponent` (`src/app/book/ui/book-list.component.ts`): Bảng hiển thị danh sách sách trong kho, ảnh bìa, giá tiền, năm phát hành, danh sách tác giả và thể loại.
    * `BookDialogComponent` (`src/app/book/ui/book-dialog.component.ts`): Modal tạo mới/chỉnh sửa thông tin sách, hỗ trợ multi-select chọn nhiều Tác giả và nhiều Thể loại.
    * `BookFilterComponent` (`src/app/book/ui/book-filter.component.ts`): Bộ lọc tìm kiếm nhanh sách trong kho Admin.
    * `BookPaginatorComponent` (`src/app/book/ui/book-paginator.component.ts`): Phân trang phía quản trị.
  * Quản lý trạng thái: `BookService` (`src/app/book/Data/book.service.ts`), NgRx Store (`book.actions.ts`, `book.reducers.ts`, `book.effects.ts`, `book.facade.ts`).
* **Backend API Endpoint / Controller:**
  * Controller: `BooksController` (`BookStoreFullStackNg.Api/Controllers/BooksController.cs`) - Định tuyến `api/Books`
  * Endpoints:
    * `POST /api/Books` -> `[Authorize(Roles = "Admin")]` Tạo sách mới (`[FromForm] BookCreateDto`).
    * `PUT /api/Books/{id}` -> `[Authorize(Roles = "Admin")]` Cập nhật thông tin sách (`[FromForm] BookUpdateDto`).
    * `DELETE /api/Books/{id}` -> `[Authorize(Roles = "Admin")]` Xóa sách khỏi hệ thống.
    * `GET /api/Books/isbn-lookup/{isbn}` -> `[Authorize(Roles = "Admin")]` Tra cứu siêu dữ liệu sách tự động thông qua mã ISBN.
* **Mô tả nghiệp vụ:**
  * Xử lý quan hệ Đa - Đa phức tạp: Mỗi cuốn sách liên kết với nhiều tác giả (`BookAuthor`) và nhiều thể loại (`BookGenre`). Khi cập nhật, backend thực hiện đồng bộ lại bảng liên kết trung gian.
  * Tích hợp Output Caching thông minh: Khi Admin thêm mới hoặc sửa/xóa sách, backend chủ động gọi `cache.EvictByTagAsync("tag-book")` để giải phóng cache danh mục sách công khai, giúp khách hàng thấy ngay sách mới mà không cần khởi động lại server.
  * Tích hợp tính năng tra cứu thông tin sách tự động theo mã ISBN giúp Admin tiết kiệm thời gian nhập liệu.

---

### Chức năng 4: Upload & Xử lý Ảnh bìa Sách
* **Trạng thái:** `[Sẵn có trong Source Code]`
* **Frontend Component:**
  * Tích hợp trong `BookDialogComponent` (`src/app/book/ui/book-dialog.component.ts`).
  * UI Control: Khu vực kéo thả hoặc click chọn file ảnh (`<input type="file">`), hiển thị khung xem trước ảnh bìa (Image Preview), kèm nút xóa ảnh đã chọn và cảnh báo dung lượng vượt quá quy định.
* **Backend API Endpoint / Controller:**
  * Controller: `BooksController` (`POST /api/Books`, `PUT /api/Books/{id}`)
  * Service hạ tầng: `ICloudinaryService` (`BookStoreFullStackNg.Data/Services/CloudinaryService.cs`), `IFileService` vật lý fallback (`BookStoreFullStackNg.Data/Services/FileService.cs`).
  * Cấu hình Static Files: Phục vụ ảnh cục bộ thông qua middleware Static File Provider `/Resources/` kết hợp CDN Cloudinary.
* **Mô tả nghiệp vụ:**
  * Kiểm duyệt file nghiêm ngặt: Kiểm tra định dạng ảnh cho phép (jpg, jpeg, png, webp, jfif), giới hạn kích thước tối đa 3 MB.
  * Tự động căn chỉnh kích thước (Resize & Crop chuẩn tỉ lệ bìa sách 400x600 px) nhằm tối ưu băng thông và giao diện người dùng.
  * Khi Admin cập nhật ảnh bìa mới cho cuốn sách, hệ thống tự động xóa file ảnh cũ trên CDN Cloudinary bằng `ImagePublicId` để tránh lãng phí dung lượng.

---

## III. THÀNH VIÊN 2: TRẢI NGHIỆM KHÁCH HÀNG & TÌM KIẾM (STOREFRONT & DISCOVERY)

Phân hệ dành cho khách hàng vãng lai và người mua sách, tối ưu hóa tốc độ tìm kiếm, bộ lọc đa chiều và lưu giữ các tác phẩm yêu thích.

```
                           ┌───────────────────────────┐
                           │      Public Storefront    │
                           └─────────────┬─────────────┘
                                         │
        ┌────────────────────────────────┼───────────────────────────────┐
        ▼                                ▼                               ▼
┌──────────────────┐           ┌──────────────────┐            ┌──────────────────┐
│  Book Showcase   │           │ Search & Filter  │            │ Book Detail View │
│ Card Grid Layout │           │ Dynamic LINQ Core│            │ Related Books    │
└──────────────────┘           └──────────────────┘            └──────────────────┘
                                         │
                                         ▼ [Mở rộng]
                               ┌──────────────────┐
                               │     Wishlist     │
                               │(Signals & Store) │
                               └──────────────────┘
```

---

### Chức năng 1: Duyệt danh mục Sách công khai (Book Showcase)
* **Trạng thái:** `[Sẵn có trong Source Code]`
* **Frontend Component:**
  * Component chính: `HomeComponent` (`src/app/home/home.component.ts`), `BookPublicComponent` (`src/app/book-public/book-public.component.ts`)
  * Component giao diện con: `BookListPublicComponent` (`src/app/book-public/ui/book-list-public.component.ts`): Bố cục Grid thẻ sách hiện đại (Modern Minimalist Card layout) hiển thị ảnh bìa, tiêu đề sách, danh sách tác giả, giá bán, nút "Thêm vào giỏ" và nút yêu thích.
  * Service: `BookPublicService` (`src/app/book-public/data/book-public.service.ts`).
* **Backend API Endpoint / Controller:**
  * Controller: `BooksController` (`BookStoreFullStackNg.Api/Controllers/BooksController.cs`)
  * Endpoint: `GET /api/Books` -> `[AllowAnonymous]`
  * Caching: Áp dụng ASP.NET Core Output Caching với chính sách `"BooksCachePolicy"` và gắn thẻ `"tag-book"`.
* **Mô tả nghiệp vụ:**
  * Hiển thị danh mục toàn bộ sách đang mở bán cho cả khách vãng lai (chưa đăng nhập) và khách hàng thân thiết.
  * Tối ưu hóa hiệu năng phản hồi: Sử dụng bộ nhớ đệm Output Cache trên server giúp thời gian phản hồi API chỉ dưới 10ms đối với các truy vấn đọc thường xuyên.
  * Giao diện Responsive thích ứng trên cả màn hình Desktop, Tablet và Mobile.

---

### Chức năng 2: Tìm kiếm, Lọc & Phân trang nâng cao
* **Trạng thái:** `[Sẵn có trong Source Code]`
* **Frontend Component:**
  * Component: `BookPublicFilterComponent` (`src/app/book-public/ui/book-public-filter.component.ts`), tích hợp thanh Search Debounce (300ms) trên Toolbar của `BookPublicComponent`.
  * Điều khiển giao diện:
    * Ô tìm kiếm từ khóa với icon tìm kiếm tức thời.
    * Dropdown chọn thể loại sách (`GenreId`).
    * Dropdown sắp xếp động: Theo giá tăng dần, giá giảm dần, năm xuất bản, tên sách A-Z.
    * Phân trang Material Paginator (chọn kích thước trang: 8, 12, 24 cuốn/trang).
* **Backend API Endpoint / Controller:**
  * Controller: `BooksController` (`GET /api/Books`)
  * Model tham số: `BookQueryParameter` (`PageNumber`, `PageSize`, `SearchTerm`, `SortBy`, `GenreId`).
  * Thư viện xử lý: `System.Linq.Dynamic.Core` kết hợp lớp tiện ích `PagedList<Book>`.
* **Mô tả nghiệp vụ:**
  * Tìm kiếm đa năng (Full-text Search) theo tên sách hoặc tên tác giả liên kết.
  * Lọc theo thể loại thông qua truy vấn `BookGenres.Any(bg => bg.GenreId == genreId)`.
  * Sắp xếp động linh hoạt trên database mà không cần viết nhiều khối lệnh `switch-case` nhờ cú pháp Dynamic LINQ (ví dụ: `Price asc`, `Price desc`, `PublishedYear desc`).
  * Trả về siêu dữ liệu phân trang chuẩn RESTful (`TotalCount`, `PageSize`, `CurrentPage`, `TotalPages`, `HasPrevious`, `HasNext`).

---

### Chức năng 3: Xem Chi tiết Sách & Gợi ý Sách liên quan
* **Trạng thái:** `[Sẵn có trong Source Code]`
* **Frontend Component:**
  * Component chính: `BookDetailComponent` (`src/app/book-public/book-detail.component.ts`)
  * Khu vực chức năng:
    * Khung hiển thị ảnh bìa sắc nét kèm zoom preview.
    * Bảng thông tin xuất bản: Nhà xuất bản, Năm phát hành, Mã định danh, Giá bán niêm yết.
    * Mô tả tóm tắt nội dung tác phẩm.
    * Bộ chọn số lượng sách và nút "Thêm vào giỏ hàng" (`AddToCart`).
    * Danh mục các cuốn sách liên quan gợi ý phía dưới trang.
* **Backend API Endpoint / Controller:**
  * Controller: `BooksController` (`BookStoreFullStackNg.Api/Controllers/BooksController.cs`)
  * Endpoints:
    * `GET /api/Books/{id}` -> `[AllowAnonymous]` Lấy toàn bộ chi tiết sách, bao gồm mảng `Authors` và `Genres`.
    * `GET /api/Books/{id}/related` -> `[AllowAnonymous]` Lấy danh sách 4-6 cuốn sách tương tự.
* **Mô tả nghiệp vụ:**
  * Trả về thông tin đầy đủ nhất của cuốn sách phục vụ quyết định mua hàng của người đọc.
  * Thuật toán gợi ý sách liên quan: Hệ thống tìm kiếm các cuốn sách có cùng ít nhất một thể loại hoặc cùng tác giả với cuốn sách hiện tại, sắp xếp ngẫu nhiên hoặc theo độ phổ biến và loại trừ cuốn sách đang xem.
  * Nếu người dùng truy cập ID sách không tồn tại, backend trả về mã `404 Not Found` kèm thông điệp lỗi chuẩn hóa.

---

### Chức năng 4: Danh sách Yêu thích (Wishlist)
* **Trạng thái:** `[Tính năng mở rộng]` *(Đã hoàn thiện đầy đủ cả Backend & Frontend)*
* **Frontend Component:**
  * Component chính: `WishlistComponent` (`src/app/wishlist/wishlist.component.ts`): Trang quản lý tất cả sách người dùng đã lưu yêu thích.
  * Component nút bấm: `WishlistButtonComponent` (`src/app/wishlist/ui/wishlist-button.component.ts`): Nút biểu tượng trái tim đổi trạng thái tương tác trên mỗi thẻ sách.
  * Kiến trúc hỗ trợ: `WishlistService` (`src/app/wishlist/data/wishlist.service.ts`), `WishlistStore` (`src/app/wishlist/wishlist.store.ts`), `WishlistGuard` (`src/app/wishlist/wishlist.guard.ts`).
* **Backend API Endpoint / Controller:**
  * Controller: `WishlistController` (`BookStoreFullStackNg.Api/Controllers/WishlistController.cs`) - Định tuyến `api/Wishlist`
  * Endpoints:
    * `GET /api/Wishlist` -> `[Authorize]` Lấy toàn bộ danh sách sách yêu thích của người dùng hiện tại (`WishlistItemReadDto`).
    * `POST /api/Wishlist/{bookId:int}` -> `[Authorize]` Thêm một cuốn sách vào Wishlist.
    * `DELETE /api/Wishlist/{bookId:int}` -> `[Authorize]` Xóa sách khỏi Wishlist.
  * Repository & Domain: `IWishlistRepository`, `WishlistRepository.cs`, thực thể `WishlistItem.cs`.
* **Mô tả nghiệp vụ:**
  * Yêu cầu người dùng phải đăng nhập (`[Authorize]`). Nếu chưa đăng nhập, hệ thống nhắc nhở hoặc chuyển hướng sang trang đăng nhập.
  * Người dùng có thể bookmark những cuốn sách tâm đắc để theo dõi hoặc mua sắm sau này.
  * Xử lý tối ưu trải nghiệm (Optimistic UI Update): Nút trái tim đổi màu ngay lập tức trên giao diện thông qua `WishlistStore` quản lý trạng thái phản ứng (Reactive Signals/State).
  * Backend kiểm tra tính duy nhất: Một người dùng không thể thêm trùng lặp 2 lần cùng một cuốn sách vào Wishlist.

---

## IV. THÀNH VIÊN 3: GIỎ HÀNG & QUY TRÌNH MUA HÀNG (CART & CHECKOUT FLOW)

Phân hệ trực tiếp tạo ra giao dịch thương mại điện tử, quản lý các món hàng đang chọn, tự động tính toán thuế, áp dụng mã giảm giá và chuyển đổi thành đơn đặt hàng.

```
┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│  Shopping Cart   │───────>│ Price & Tax Calc │───────>│  Order Checkout  │
│(NgRx State CRUD) │        │ (Tax 18% + Math) │        │(Recipient & COD) │
└──────────────────┘        └────────┬─────────┘        └──────────────────┘
                                     │
                                     ▼ [Mở rộng]
                            ┌──────────────────┐
                            │  Coupon / Voucher│
                            │ (Percent & Limit)│
                            └──────────────────┘
```

---

### Chức năng 1: Quản lý Giỏ hàng trực tuyến (Shopping Cart CRUD)
* **Trạng thái:** `[Sẵn có trong Source Code]`
* **Frontend Component:**
  * Component chính: `CartComponent` (`src/app/cart/cart.component.ts`)
  * Component con: `CartItemComponent` (`src/app/cart/ui/cart-item.component.ts`): Hiển thị từng dòng sản phẩm gồm ảnh bìa, tên sách, đơn giá, nút tăng/giảm số lượng và nút xóa.
  * Quản lý trạng thái: NgRx Store phân hệ Cart (`cart.actions.ts`, `cart.reducers.ts`, `cart.effects.ts`, `cart.selectors.ts`).
  * Service: `CartService` (`src/app/cart/data/cart.service.ts`).
* **Backend API Endpoint / Controller:**
  * Controller: `CartsController` (`BookStoreFullStackNg.Api/Controllers/CartsController.cs`) - Định tuyến `api/Carts`
  * Endpoints:
    * `GET /api/Carts/UserCart` -> `[Authorize]` Lấy giỏ hàng chi tiết của người dùng đăng nhập.
    * `POST /api/Carts` -> `[Authorize]` Thêm sản phẩm vào giỏ hàng (`CartItemCreateDto`: `BookId`, `Quantity`).
    * `PUT /api/Carts/{cartItemId}` -> `[Authorize]` Cập nhật số lượng của mục hàng (`CartItemUpdateDto`).
    * `DELETE /api/Carts/{cartItemId}` -> `[Authorize]` Xóa một đầu sách khỏi giỏ hàng.
    * `DELETE /api/Carts` -> `[Authorize]` Xóa sạch toàn bộ giỏ hàng (Clear Cart).
    * `GET /api/Carts` -> `[Authorize(Roles = "Admin")]` Admin xem tất cả giỏ hàng trên hệ thống.
* **Mô tả nghiệp vụ:**
  * Mỗi tài khoản người dùng gắn liền với một bản ghi `Cart` trong database.
  * Xử lý cộng dồn thông minh: Nếu người dùng thêm cuốn sách đã có sẵn trong giỏ, backend tự động tăng số lượng (`Quantity = Quantity + newQuantity`) thay vì tạo dòng mới trùng lặp.
  * NgRx Store duy trì đồng bộ trạng thái giữa giỏ hàng và con số huy hiệu (Badge Counter) hiển thị trên thanh menu điều hướng Header.

---

### Chức năng 2: Tính toán Giá tiền & Thuế tự động (Price & Tax Calculation)
* **Trạng thái:** `[Sẵn có trong Source Code]`
* **Frontend Component:**
  * Component giao diện: `ClassSummaryComponent` / `CartSummaryComponent` (`src/app/cart/ui/cart-summary.component.ts`)
  * Hiển thị bảng tóm tắt chi phí trực quan: Tạm tính (Subtotal), Thuế ước tính (Tax 18%), Phí giao hàng (Free Shipping), Tổng thanh toán cuối cùng (Grand Total).
* **Backend API Endpoint / Controller:**
  * Module logic: `CartItemMapper.cs`, `OrderPricing.cs`, `Tax.cs` (`BookStoreFullStackNg.Data/Constants/Tax.cs`).
  * Tích hợp ngầm trong API: `GET /api/Carts/UserCart` và `POST /api/Coupons/apply`.
* **Mô tả nghiệp vụ:**
  * Công thức tính toán được chuẩn hóa và thực hiện làm tròn số tiền chính xác (`MidpointRounding.AwayFromZero`):
    $$\text{Subtotal} = \sum_{i=1}^{n} (\text{Price}_i \times \text{Quantity}_i)$$
    $$\text{Tax} = \text{Subtotal} \times 18\% \quad (\text{Theo cấu hình } Tax.TaxInPercent)$$
    $$\text{Grand Total} = \text{Subtotal} - \text{DiscountAmount} + \text{Tax}$$
  * Đảm bảo tính nhất quán tuyệt đối giữa dữ liệu tiền hiển thị trên Frontend và dữ liệu tiền được lưu trữ vào đơn hàng trên Backend, ngăn chặn hành vi gian lận sửa đổi giá tiền từ phía client.

---

### Chức năng 3: Đặt hàng & Xử lý Thanh toán (Checkout Flow)
* **Trạng thái:** `[Sẵn có trong Source Code]`
* **Frontend Component:**
  * Component chính: `CreateOrderComponent` (`src/app/order/create-order.component.ts`)
  * Component biểu mẫu: `CreateOrderFormComponent` (`src/app/order/ui/create-order-form.component.ts`): Form Reactive thu thập thông tin nhận hàng gồm Tên người nhận, Số điện thoại, Địa chỉ giao hàng và lựa chọn Hình thức thanh toán.
  * Màn hình kết quả:
    * `OrderSuccessComponent` (`src/app/order/order-success.component.ts`): Thông báo đặt hàng thành công kèm mã tham chiếu đơn hàng.
    * `OrderFailureComponent` (`src/app/order/order-failure.component.ts`): Thông báo xử lý thất bại nếu có lỗi xảy ra.
  * Quản lý trạng thái: NgRx Order Module (`order.actions.ts`, `order.reducers.ts`, `order.effects.ts`).
* **Backend API Endpoint / Controller:**
  * Controller: `OrdersController` (`BookStoreFullStackNg.Api/Controllers/OrdersController.cs`) - Định tuyến `api/Orders`
  * Endpoints:
    * `GET /api/Orders/payment-methods` -> Lấy danh mục các phương thức thanh toán hỗ trợ (COD - Thanh toán khi nhận hàng, Chuyển khoản ngân hàng).
    * `POST /api/Orders` -> `[Authorize]` Thực hiện đặt hàng (`OrderCreateDto`).
* **Mô tả nghiệp vụ:**
  * Xử lý Transaction nghiệp vụ khép kín:
    1. Kiểm tra giỏ hàng của người dùng: Nếu giỏ hàng trống, chặn giao dịch và báo lỗi.
    2. Tạo bản ghi đơn hàng mới (`Order`) với trạng thái ban đầu là `Pending` (Chờ duyệt).
    3. Sao chép toàn bộ các mặt hàng từ `CartItems` sang `OrderItems`, lưu lại ảnh chụp nhanh (snapshot) giá bán tại thời điểm đặt hàng.
    4. Xóa sạch giỏ hàng (`ClearCartAsync`) của người dùng để sẵn sàng cho lần mua sắm tiếp theo.
  * Phản hồi mã `204 NoContent` hoặc thông tin đơn hàng để Frontend kích hoạt chuyển hướng sang trang `OrderSuccessComponent`.

---

### Chức năng 4: Áp dụng Mã giảm giá (Coupon / Voucher)
* **Trạng thái:** `[Tính năng mở rộng]` *(Đã hoàn thiện đầy đủ cả Backend & Frontend)*
* **Frontend Component:**
  * Component quản trị Admin: `CouponsComponent` (`src/app/coupons/coupons.component.ts`): Quản lý tạo mã voucher, cấu hình tỷ lệ giảm %, giới hạn mức giảm tối đa, hạn sử dụng và số lượt dùng.
  * Tích hợp thanh toán: Khung nhập mã voucher và nút "Áp dụng" tại màn hình giỏ hàng và thanh toán.
  * Service & Model: `CouponService` (`src/app/coupons/data/coupon.service.ts`), `CouponModel`, `CouponCreateModel` (`src/app/coupons/data/coupon.model.ts`).
* **Backend API Endpoint / Controller:**
  * Controller: `CouponsController` (`BookStoreFullStackNg.Api/Controllers/CouponsController.cs`) - Định tuyến `api/Coupons`
  * Endpoints:
    * `POST /api/Coupons/apply` -> `[Authorize]` Kiểm tra tính hợp lệ và áp dụng mã giảm giá cho giỏ hàng hiện tại (`CouponApplyRequestDto`).
    * `GET /api/Coupons` -> `[Authorize(Roles = "Admin")]` Lấy danh sách tất cả mã giảm giá trên hệ thống.
    * `POST /api/Coupons` -> `[Authorize(Roles = "Admin")]` Tạo mã giảm giá mới (`CouponCreateDto`).
  * Thực thể Domain & Repository: `Coupon.cs`, `ICouponRepository`, `OrderPricing.Calculate()`.
* **Mô tả nghiệp vụ:**
  * Kiểm duyệt điều kiện khắt khe khi khách hàng nhập mã:
    * Mã phải tồn tại trong cơ sở dữ liệu và đang bật cờ `IsActive = true`.
    * Ngày hiện tại phải trước thời điểm hết hạn (`DateTime.UtcNow <= ExpiryDate`).
    * Số lần đã sử dụng phải chưa chạm ngưỡng cho phép (`UsageCount < MaxUsageCount`).
  * Tính toán mức giảm an toàn: Giảm theo tỷ lệ % nhưng không vượt quá mức trần tối đa (`MaxDiscount`). Ví dụ: Giảm 20% tối đa 50.000đ.
  * Cập nhật lại hóa đơn thanh toán ngay lập tức để người dùng kiểm tra số tiền tiết kiệm được.

---

## V. THÀNH VIÊN 4: QUẢN LÝ ĐƠN HÀNG & BÁO CÁO (ORDER MANAGEMENT & ANALYTICS)

Phân hệ quản trị luồng xử lý sau bán hàng, theo dõi lịch sử mua sắm của khách, quản trị toàn bộ đơn hàng của hệ thống theo quy trình workflow và báo cáo số liệu kinh doanh.

```
                          ┌─────────────────────────┐
                          │   Order & Analytics     │
                          └────────────┬────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
┌──────────────────┐         ┌──────────────────┐           ┌──────────────────┐
│ User Order List  │         │  Customer Orders │           │ Order Workflow   │
│ Personal History │         │ Admin Systemwide │           │ Status Machine   │
└──────────────────┘         └──────────────────┘           └──────────────────┘
                                       │
                                       ▼ [Mở rộng]
                             ┌──────────────────┐
                             │ Analytics / KPI  │
                             │ Revenue & Top 5  │
                             └──────────────────┘
```

---

### Chức năng 1: Lịch sử Đơn hàng Cá nhân (User Order History)
* **Trạng thái:** `[Sẵn có trong Source Code]`
* **Frontend Component:**
  * Component chính: `UserOrderComponent` (`src/app/order/user-order.component.ts`)
  * Component con:
    * `UserOrderListComponent` (`src/app/order/ui/user-order-list.component.ts`): Danh sách thẻ đơn hàng cá nhân hiển thị mã đơn, ngày mua, phương thức thanh toán, tổng tiền và badge trạng thái.
    * `UserOrderFilterComponent` (`src/app/order/ui/user-order-filter.component.ts`): Bộ lọc đơn hàng theo trạng thái và ngày đặt.
    * `UserOrderPaginatorComponent` (`src/app/order/ui/user-order-paginator.component.ts`): Phân trang danh sách đơn cá nhân.
  * Quản lý trạng thái: NgRx User Order Module (`user-order.actions.ts`, `user-order.reducers.ts`, `user-order.effects.ts`, `user-order.selectors.ts`).
* **Backend API Endpoint / Controller:**
  * Controller: `OrdersController` (`BookStoreFullStackNg.Api/Controllers/OrdersController.cs`)
  * Endpoints:
    * `GET /api/Orders/my-orders` hoặc `GET /api/Orders/user-orders` -> `[Authorize]` Lấy toàn bộ đơn hàng của chính tài khoản đăng nhập (`UserOrdersQueryParameters`).
* **Mô tả nghiệp vụ:**
  * Bảo mật dữ liệu người dùng: Backend tự động trích xuất `UserId` từ định danh token JWT (`User.Identity.Name`), ngăn chặn việc người dùng xem trộm đơn hàng của người khác.
  * Khách hàng theo dõi được lộ trình đơn hàng từ lúc đặt đến khi hoàn tất.
  * Hỗ trợ tìm kiếm theo mã đơn và lọc đơn theo trạng thái (Pending, Processing, Shipped, Delivered, Cancelled).

---

### Chức năng 2: Quản trị Đơn hàng toàn hệ thống (Customer Orders Management)
* **Trạng thái:** `[Sẵn có trong Source Code]`
* **Frontend Component:**
  * Component chính: `CustomerOrdersComponent` (`src/app/customer-orders/customer-orders.component.ts`)
  * Chi tiết đơn: `OrderDetailComponent` (`src/app/customer-orders/order-detail.component.ts`)
  * Component con:
    * `CustomerOrderListComponent` (`src/app/customer-orders/ui/customer-order-list.component.ts`): Bảng danh sách đơn hàng của toàn thể khách hàng trong hệ thống.
    * `CustomerOrderDetailListComponent` (`src/app/customer-orders/ui/customer-order-detail-list.component.ts`): Bảng liệt kê chi tiết từng cuốn sách, số lượng và đơn giá trong đơn hàng được chọn.
    * `CustomerOrderFilterComponent` (`src/app/customer-orders/ui/customer-order-filter.component.ts`): Bộ lọc nâng cao theo tên người nhận, số điện thoại hoặc trạng thái đơn.
  * Quản lý trạng thái: NgRx Customer Orders Module (`customer-order.actions.ts`, `customer-order.reducers.ts`, `customer-order.effects.ts`).
* **Backend API Endpoint / Controller:**
  * Controller: `OrdersController` (`BookStoreFullStackNg.Api/Controllers/OrdersController.cs`)
  * Endpoints:
    * `GET /api/Orders/customer-orders` hoặc `GET /api/Orders` -> `[Authorize(Roles = "Admin")]` Danh sách đơn hàng toàn hệ thống có phân trang và lọc (`PagedList<UserOrderDto>`).
    * `GET /api/Orders/{orderId:int}` -> `[Authorize(Roles = "Admin")]` Xem thông tin chi tiết một đơn hàng cụ thể.
    * `GET /api/Orders/OrderItems/{orderId}` -> `[Authorize(Roles = "Admin")]` Xem danh sách tất cả các cuốn sách bên trong đơn hàng đó.
* **Mô tả nghiệp vụ:**
  * Cung cấp góc nhìn toàn diện cho người quản trị về lưu lượng mua sắm của toàn sàn.
  * Tra cứu nhanh chóng đơn hàng khi khách hàng liên hệ hỗ trợ hoặc khiếu nại thông qua tìm kiếm theo Số điện thoại hoặc Tên người nhận.
  * Xem danh sách chi tiết các cuốn sách trong đơn để hỗ trợ bộ phận kho đóng gói sản phẩm.

---

### Chức năng 3: Cập nhật Trạng thái Đơn hàng (Order Status Workflow)
* **Trạng thái:** `[Sẵn có trong Source Code]`
* **Frontend Component:**
  * Tích hợp trực tiếp trên `OrderDetailComponent` (`src/app/customer-orders/order-detail.component.ts`) và `CustomerOrdersComponent`.
  * Giao diện: Dropdown lựa chọn trạng thái kế tiếp, nút cập nhật xác nhận và huy hiệu hiển thị trạng thái màu sắc theo chuẩn Modern Minimalist:
    * `Pending` (Màu vàng cam cảnh báo)
    * `Processing` (Màu xanh dương)
    * `Shipped` (Màu tím/chàm)
    * `Delivered` (Màu xanh lá thành công)
    * `Cancelled` (Màu đỏ/xám)
* **Backend API Endpoint / Controller:**
  * Controller: `OrdersController` (`BookStoreFullStackNg.Api/Controllers/OrdersController.cs`)
  * Endpoint:
    * `PUT /api/Orders/{orderId:int}/status` -> `[Authorize(Roles = "Admin")]` Cập nhật trạng thái đơn hàng (`OrderStatusUpdateDto`).
  * Module điều phối trạng thái: `OrderStatusWorkflow.cs` (`BookStoreFullStackNg.Data/Helpers/OrderStatusWorkflow.cs`).
* **Mô tả nghiệp vụ:**
  * Vận hành theo mô hình Máy trạng thái (State Machine) với quy tắc chuyển đổi logic nghiêm ngặt:
    $$\text{Pending} \longrightarrow \text{Processing} \longrightarrow \text{Shipped} \longrightarrow \text{Delivered}$$
    $$\text{Pending / Processing / Shipped} \longrightarrow \text{Cancelled}$$
  * Quy tắc chặn gian lận:
    * Không cho phép cập nhật lại trạng thái nếu đơn hàng đã ở trạng thái đó (`Already in status`).
    * Khi đơn hàng đã ở trạng thái kết thúc (`Delivered` hoặc `Cancelled`), không thể chuyển ngược lại bất kỳ trạng thái nào khác.
    * Backend sử dụng hàm `OrderStatusWorkflow.IsTransitionAllowed(currentStatus, newStatus)` để kiểm tra, nếu vi phạm sẽ trả về lỗi `400 Bad Request` với thông điệp rõ ràng.

---

### Chức năng 4: Thống kê Doanh thu & Sách bán chạy (Analytics & Dashboard)
* **Trạng thái:** `[Tính năng mở rộng]` *(Đã hoàn thiện đầy đủ cả Backend & Frontend)*
* **Frontend Component:**
  * Component chính: `DashboardComponent` (`src/app/dashboard.component.ts`)
  * Service & Model: `AnalyticsService` (`src/app/dashboard/data/analytics.service.ts`), `DashboardSummaryModel` (`src/app/dashboard/data/dashboard-summary.model.ts`).
  * Giao diện trực quan:
    * 4 Thẻ chỉ số KPI chính: Tổng doanh thu (Total Revenue), Tổng số đơn hàng (Total Orders), Số đầu sách trong kho (Total Books), Số lượng khách hàng (Total Customers).
    * Bảng xếp hạng Top 5 cuốn sách bán chạy nhất (Top Selling Books) gồm tên sách, giá niêm yết và tổng số lượng đã bán ra.
* **Backend API Endpoint / Controller:**
  * Controller: `AnalyticsController` (`BookStoreFullStackNg.Api/Controllers/AnalyticsController.cs`) - Định tuyến `api/Analytics`
  * Endpoint:
    * `GET /api/Analytics/dashboard-summary` -> `[Authorize(Roles = "Admin")]` Trả về đối tượng tóm tắt KPI kinh doanh.
  * Repository & Data Layer: `IAnalyticsRepository`, `AnalyticsRepository.cs` (`BookStoreFullStackNg.Data/Reopositories`).
* **Mô tả nghiệp vụ:**
  * Tính toán tổng doanh thu thực tế phát sinh trên toàn hệ thống dựa trên các đơn hàng hợp lệ.
  * Tổng hợp sản lượng tiêu thụ của từng đầu sách thông qua truy vấn LINQ gom nhóm:
    ```csharp
    var topBooks = await _context.OrderItems
        .GroupBy(oi => new { oi.BookId, oi.Book.Title, oi.Book.Price })
        .Select(g => new TopSellingBookDto {
            BookId = g.Key.BookId,
            Title = g.Key.Title,
            Price = g.Key.Price,
            UnitsSold = g.Sum(x => x.Quantity)
        })
        .OrderByDescending(x => x.UnitsSold)
        .Take(5)
        .ToListAsync();
    ```
  * Cung cấp công cụ trực quan giúp Ban quản trị đánh giá cuốn sách nào đang được độc giả ưa chuộng nhất để kịp thời nhập thêm hàng và điều chỉnh chiến dịch quảng cáo.

---

## VI. BẢNG TỔNG HỢP KIỂM TRA TIẾN ĐỘ & TRẠNG THÁI SOURCE CODE

| STT | Thành viên | Tên Chức Năng | Frontend Component / View | Backend Controller & Endpoint | Trạng thái Nghiệp vụ |
| :---: | :---: | :--- | :--- | :--- | :---: |
| 1 | **TV 1** | Quản lý Tác giả (CRUD) | `AuthorComponent`, `AuthorDialogComponent`, `AuthorListComponent` | `AuthorController` (`api/authors`) | `Sẵn có trong Source Code` |
| 2 | **TV 1** | Quản lý Thể loại sách (CRUD) | `GenreComponent`, `AddGenreDialogComponent`, `GenreListComponent` | `GenreController` (`api/genres`) | `Sẵn có trong Source Code` |
| 3 | **TV 1** | Quản trị Sách (Admin CRUD) | `BookComponent`, `BookDialogComponent`, `BookListComponent` | `BooksController` (`api/Books`) | `Sẵn có trong Source Code` |
| 4 | **TV 1** | Upload & Xử lý Ảnh bìa | Tích hợp trong `BookDialogComponent` (Preview + File Input) | `BooksController`, `CloudinaryService`, `FileService` | `Sẵn có trong Source Code` |
| 5 | **TV 2** | Duyệt sách công khai | `HomeComponent`, `BookPublicComponent`, `BookListPublicComponent` | `BooksController` (`GET api/Books` + OutputCache) | `Sẵn có trong Source Code` |
| 6 | **TV 2** | Tìm kiếm, Lọc & Phân trang | `BookPublicFilterComponent`, Toolbar Debounce Search, Paginator | `BooksController` (`BookQueryParameter`, Dynamic LINQ) | `Sẵn có trong Source Code` |
| 7 | **TV 2** | Trang Chi tiết Sách & Gợi ý | `BookDetailComponent` (Metadata, Preview, Related Books) | `BooksController` (`GET api/Books/{id}`, `{id}/related`) | `Sẵn có trong Source Code` |
| 8 | **TV 2** | Danh sách Yêu thích (Wishlist) | `WishlistComponent`, `WishlistButtonComponent`, `WishlistStore` | `WishlistController` (`api/Wishlist`) | **Tính năng mở rộng** *(Đã code xong)* |
| 9 | **TV 3** | Quản lý Giỏ hàng (CRUD) | `CartComponent`, `CartItemComponent`, NgRx Cart Store | `CartsController` (`api/Carts`, `UserCart`) | `Sẵn có trong Source Code` |
| 10 | **TV 3** | Tính thuế & Tiền tự động | `ClassSummaryComponent` (`Subtotal`, `Tax 18%`, `Total`) | `CartItemMapper`, `OrderPricing`, `Tax.TaxInPercent` | `Sẵn có trong Source Code` |
| 11 | **TV 3** | Đặt hàng & Thanh toán | `CreateOrderComponent`, `CreateOrderFormComponent`, `OrderSuccess` | `OrdersController` (`POST api/Orders`, `PaymentMethods`) | `Sẵn có trong Source Code` |
| 12 | **TV 3** | Áp dụng Mã giảm giá (Coupon) | `CouponsComponent`, `CouponService`, Checkout Voucher Input | `CouponsController` (`POST api/Coupons/apply`) | **Tính năng mở rộng** *(Đã code xong)* |
| 13 | **TV 4** | Lịch sử Đơn hàng Cá nhân | `UserOrderComponent`, `UserOrderListComponent`, `UserOrderFilter` | `OrdersController` (`GET api/Orders/my-orders`) | `Sẵn có trong Source Code` |
| 14 | **TV 4** | Quản trị Đơn hàng hệ thống | `CustomerOrdersComponent`, `OrderDetailComponent` | `OrdersController` (`GET api/Orders/customer-orders`) | `Sẵn có trong Source Code` |
| 15 | **TV 4** | Cập nhật Trạng thái (Workflow) | `OrderDetailComponent`, Status Transitions Dropdown & Badges | `OrdersController` (`PUT status`), `OrderStatusWorkflow` | `Sẵn có trong Source Code` |
| 16 | **TV 4** | Thống kê Báo cáo Doanh thu | `DashboardComponent` (KPI Cards + Top 5 Best Sellers) | `AnalyticsController` (`GET dashboard-summary`) | **Tính năng mở rộng** *(Đã code xong)* |

---
*Tài liệu được tổng hợp chính xác theo kiến trúc mã nguồn thực tế của dự án BookStoreFullStackNg, phục vụ công tác báo cáo và phản biện đồ án với Giảng viên.*
