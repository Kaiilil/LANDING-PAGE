II. MINH CHỨNG CÁC PHẦN ĐIỂM CỘNG ĐÃ TRIỂN KHAI (ADDITIONAL PHASES)
🟢 PHASE 1: Webhook Integration & Advanced Form Validation
Task 1.1 — Tích hợp Webhook thực tế:

Tích hợp thành công Endpoint thật qua nền tảng webhook.site / n8n để tiếp nhận dữ liệu người dùng.

Cập nhật Newsletter.jsx: Thay thế endpoint thử nghiệm bằng Webhook URL thực tế.

Xử lý cơ chế Retry Logic: Tự động gửi lại request tối đa 3 lần khi xảy ra sự cố mạng dựa trên thuật toán Exponential Backoff.

Tối ưu hóa Payload dữ liệu: Bổ sung các trường thông tin nâng cao bao gồm timestamp, source_page, và user_agent.

Xử lý phản hồi (Response) chặt chẽ: Hệ thống tự động phân tích status code từ phía server để đưa ra thông báo lỗi chi tiết nhất cho người dùng.

Cài đặt cơ chế Timeout: Giới hạn thời gian phản hồi tối đa 10 giây cho mỗi Fetch Request nhằm tránh treo ứng dụng.

Task 1.2 — Nâng cao Client-side Validation:

Xây dựng bộ kiểm tra dữ liệu theo thời gian thực (real-time validation xử lý trực tiếp qua sự kiện onChange).

Validate Họ Tên: Yêu cầu tối thiểu 2 ký tự và loại bỏ hoàn toàn các ký tự số.

Validate Email: Tích hợp bộ lọc giả lập MX record, chủ động chặn (blacklist) các domain rác/tạm thời như test.com, example.com.

Validate Số Điện Thoại: Áp dụng chuẩn Regex kiểm tra nghiêm ngặt định dạng đầu số và độ dài SĐT tại Việt Nam: /(0[3|5|7|8|9])+([0-9]{8})\b/.

Thiết kế trạng thái lỗi hệ thống (error-server) độc lập để nhận diện chính xác khi webhook gặp sự cố.

Hiển thị thông báo lỗi trực quan trên từng trường nhập liệu (Field) kết hợp hiệu ứng rung lắc nhẹ (animation shake) khi nhập sai.

Task 1.3 — Toast Notification System:

[x] Xây dựng component thông báo động Toast.jsx đặt tại thư mục src/components/ui/Toast.jsx.

[x] Hỗ trợ linh hoạt 4 trạng thái thông báo tiêu chuẩn: success, error, warning, info.

[x] Cơ chế tự động ẩn (Auto-dismiss) sau 5 giây đồng bộ cùng thanh đếm ngược (progress bar countdown).

[x] Tối ưu trải nghiệm với tính năng xếp chồng thông báo (Stacking nhiều toast, tối đa 3 thông báo cùng lúc).

[x] Đóng gói logic xử lý thành một Custom Hook tiện dụng: useToast.js.

[x] Tích hợp toàn cục vào App.jsx thông qua React Context API, giúp dễ dàng gọi thông báo từ bất kỳ vị trí nào trong dự án.

🟡 PHASE 3: Dark Mode Toggle System
Task 3.1 — Thiết kế kiến trúc Theme hệ thống:

[x] Khai báo hệ thống CSS Variables quy chuẩn trong tệp index.css cho cả hai chế độ:

CSS
:root {
    --bg-primary: #0a0514;
    --text-primary: #e2e8f0;
    /* ... các variables khác ... */
}
[data-theme="light"] {
    --bg-primary: #f8f7ff;
    --text-primary: #1e1240;
    /* ... các variables khác ... */
}
[x] Quy hoạch và chuyển đổi (Migrate) toàn bộ các mã màu cứng (hardcoded colors) trong dự án sang sử dụng hệ thống CSS Variables.

[x] Lưu trữ lựa chọn của người dùng vào localStorage và tự động nhận diện cấu hình hệ thống máy của người dùng qua thuộc tính prefers-color-scheme.

Task 3.2 — UI Component Chuyển Đổi (Toggle):

[x] Phát triển component ThemeToggle.jsx đi kèm hiệu ứng chuyển đổi mượt mà giữa biểu tượng Sun (Mặt trời) và Moon (Mặt trăng).

[x] Đặt nút chuyển đổi trên thanh điều hướng (Navbar) ngay cạnh nút kêu gọi hành động (CTA button).

[x] Tối ưu hóa hiệu ứng chuyển màu toàn trang mềm mại nhờ CSS Transition thời gian 300ms.

[x] Phối bảng màu Light Mode sang trọng: Nền trắng sữa (#f8f7ff), màu sắc điểm nhấn tím nhạt (#7c3aed), và màu chữ tối (#2d1b5e).

Task 3.3 — Đồng bộ hóa giao diện trên từng Component:

[x] Navbar.jsx: Hiệu ứng mờ đục (Glassmorphism) tinh tế phiên bản giao diện sáng.

[x] Hero.jsx: Giữ nguyên màu sắc nổi bật của sản phẩm nhẫn thông minh (AuraRing X) trên nền background sáng.

[x] Features.jsx: Hệ thống các thẻ tính năng (Cards) sử dụng nền xám nhẹ kết hợp với đường viền mảnh.

[x] Specs.jsx: Giữ tông màu tím đặc trưng làm thanh chỉ báo (Tab indicator).

[x] Newsletter.jsx: Khối đăng ký chuyển sang nền trắng, các ô nhập liệu sử dụng đường viền xám trang nhã.

[x] Footer.jsx: Sử dụng nền trắng đục đi kèm màu chữ tối giúp thông tin dễ đọc.

🟢 PHASE 4: Scroll Animations & Skeleton Loading
Task 4.1 — Nâng cấp Hiệu ứng Cuộn trang (Sử dụng Motion):

[x] Đóng gói logic cuộn trang vào Custom Hook tái sử dụng: src/hooks/useScrollAnimation.js.

[x] Thay thế giải pháp cũ (IntersectionObserver + opacity thuần) bằng thư viện chuyên sâu motion/react (thuộc tính whileInView).

[x] Triển khai đa dạng các biến thể chuyển động (Animation variants):

fade-up: Hiệu ứng xuất hiện từ dưới lên (Opacity 0 → 1, Y-axis 40 → 0).

fade-left / fade-right: Hiệu ứng trượt nhẹ nhàng từ các cạnh màn hình.

scale-in: Hiệu ứng phóng to nhẹ từ tâm (Scale 0.8 → 1).

stagger-children: Cơ chế trễ tiến trình (Delay) giữa các phần tử con liên tiếp một khoảng 0.1s giúp tạo nhịp điệu hiển thị.

[x] Áp dụng đồng bộ cho: Các chữ cái trong tiêu đề Hero, Thẻ tính năng (Feature cards), Thanh thông số (Specs bars), và các mục kết nối dữ liệu (DataConnect items).

Task 4.2 — Cơ chế Skeleton Loading (Tải giả lập):

[x] Xây dựng component nền tảng src/components/ui/Skeleton.jsx có khả năng tái sử dụng cao.

[x] Viết hiệu ứng quét sáng (Shimmer animation) bằng CSS chuyển động liên tục từ trái sang phải trên dải màu gradient.

[x] Tích hợp Skeleton Loading vào các kịch bản trải nghiệm người dùng:

Khi trang tải lần đầu (Giữ giao diện giả lập trong 500ms đầu để tránh giật lag layout).

Khi biểu mẫu đang được gửi đi (Thay thế cho các icon xoay loader đơn điệu).

Khu vực hiển thị nhẫn thông minh tại phần Hero trong 300ms đầu tiên.

[x] Đa dạng hóa các biến thể Skeleton: SkeletonText, SkeletonCard, và SkeletonCircle.

Task 4.3 — Tương tác vi mô Nâng cao (Micro-interactions):

[x] Đối với các nút bấm (Buttons): Bổ sung hiệu ứng phản hồi xúc giác whileHover={{ scale: 1.04 }} và whileTap={{ scale: 0.97 }}.

[x] Các liên kết điều hướng (Navigation links): Hiệu ứng đường gạch chân (Underline) chạy mượt mà từ tâm lan ra hai bên khi rê chuột.

[x] Các ô nhập liệu (Form inputs): Đường viền phát sáng nhẹ (Glow effect) khi focus, đồng thời phần nhãn chữ (Label) tự động đẩy lên phía trên (Float label).

[x] Thẻ tính năng (Feature cards): Hiệu ứng nghiêng góc 3D sống động (3D Tilt Effect) khi di chuyển chuột qua bề mặt.

[x] Bộ đếm số hiệu ứng (Numbers counter animation): Các số liệu thông số kỹ thuật tự động chạy tăng dần từ 0 cho đến giá trị đích ngay khi người dùng cuộn màn hình tới section đó.

[x] Hiệu ứng nút kêu gọi hành động (CTA Shimmer): Tạo dải hạt lấp lánh nhẹ (Particle effect) chạy qua nút khi người dùng tương tác chuột.
