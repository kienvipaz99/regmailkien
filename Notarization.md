# Ký Mã (Code Signing) và Gửi Ứng Dụng macOS để Kiểm Duyệt (Notarization) với `notarytool`

Ký mã và gửi ứng dụng macOS của bạn để kiểm duyệt (notarization) với `notarytool` là một quy trình quan trọng để đảm bảo ứng dụng của bạn được phân phối an toàn ngoài Mac App Store. Dưới đây là hướng dẫn chi tiết từng bước để thực hiện quá trình này:

---

## Bước 1: Chuẩn Bị Môi Trường

Trước khi bắt đầu, hãy đảm bảo rằng bạn đã có:

1. **Tài khoản Apple Developer** với vai trò phù hợp (Admin hoặc Member) để tạo chứng chỉ và thực hiện notarization.
2. **Xcode** được cài đặt trên máy Mac của bạn.
3. **Chứng chỉ Developer ID**, bao gồm:
   - **Developer ID Application**
   - **Developer ID Installer**

---

## Bước 2: Tạo và Cài Đặt Chứng Chỉ Developer ID

Nếu bạn chưa có chứng chỉ, hãy thực hiện các bước sau để tạo và cài đặt chúng:

1. **Đăng nhập vào Apple Developer Account:**

   - Truy cập [Apple Developer](https://developer.apple.com/account/).

2. **Tạo chứng chỉ Developer ID:**

   - Chọn **Certificates, Identifiers & Profiles**.
   - Chọn **Certificates** > nhấn nút **“+”** để tạo chứng chỉ mới.
   - **Tạo chứng chỉ Developer ID Application**:
     - Chọn **Developer ID Application** để tạo chứng chỉ dùng cho ký mã ứng dụng.
   - **Tạo chứng chỉ Developer ID Installer** (nếu cần):
     - Chọn **Developer ID Installer** để tạo chứng chỉ dùng cho ký mã installer package.

3. **Tải về và cài đặt chứng chỉ:**
   - Khi chứng chỉ đã được tạo, tải về và mở tệp chứng chỉ để cài đặt vào **Keychain Access**.

---

## Bước 3: Ký Mã (Code Signing) Ứng Dụng

Ký mã là một bước cần thiết để xác minh rằng ứng dụng của bạn đến từ một nhà phát triển đã được xác thực và không bị thay đổi.

1. **Ký mã ứng dụng:**

   Giả sử ứng dụng của bạn đã được build và có đường dẫn là `/YourApp.app`, bạn có thể ký mã như sau:

```bash
codesign --force --verify --deep --strict --options runtime \
--sign "Developer ID Application: MKT SOLUTION JOINT STOCK COMPANY (W82GRMQ4ZA)" \
YourApp.app
```

> **Ghi chú:**
>
> - `--force`: Ghi đè chữ ký hiện có.
> - `--verify`: Xác minh sau khi ký.
> - `--verbose`: Hiển thị thông tin chi tiết.
> - `--sign`: Chỉ định chứng chỉ ký mã.
> - Không sử dụng `--deep` nếu không cần thiết, vì nó có thể gây ra vấn đề với các thành phần bên trong ứng dụng.

Ký mã cho một file cụ thể (thường là dạng file binary .dylib hay bị lỗi khi ký mã chung) dùng dạng sau:

```bash
codesign --force --verify --strict --options runtime \
--sign "Developer ID Application: MKT SOLUTION JOINT STOCK COMPANY (W82GRMQ4ZA)" \
/Users/hungtq/Downloads/MKT\ Browser.app/Contents/Frameworks/MKT\ Browser\ Framework.framework/Versions/131.0.6778.70/Libraries/libGLESv2.dylib
```

2. **Kiểm tra chữ ký mã:**

   Sau khi ký mã, kiểm tra xem ứng dụng đã được ký mã đúng cách:

```bash
codesign --verify --deep --strict --verbose=2 /YourApp.app
```

Bạn sẽ thấy thông báo rằng ứng dụng của bạn **valid on disk** và **satisfies its Designated Requirement**.

---

## Bước 4: Đóng Gói Ứng Dụng (Nếu Cần)

Nếu bạn muốn notarize một installer package (`.pkg`) thay vì một ứng dụng trực tiếp, hãy thực hiện các bước sau:

1. **Tạo installer package:**

```bash
productbuild --component /YourApp.app /Applications --sign "Developer ID Installer: MKT SOLUTION JOINT STOCK COMPANY (W82GRMQ4ZA)" /YourAppInstaller.pkg
```

> **Giải thích các tùy chọn:**
>
> - `--component`: Chỉ định đường dẫn ứng dụng và thư mục đích (thường là `/Applications`).
> - `--sign`: Ký mã installer package với chứng chỉ **Developer ID Installer**.

---

## Bước 5: Gửi Ứng Dụng Để Notarize

Sử dụng `notarytool` để gửi ứng dụng của bạn lên Apple để notarization.

1. **Gửi ứng dụng hoặc installer package để notarize:**

   - **Gửi ứng dụng (đã nén thành `.zip`):**

```bash
xcrun notarytool submit /YourApp.zip --keychain-profile "DevProfile" --wait
```

- **Gửi installer package (`.pkg`):**

```bash
xcrun notarytool submit /YourAppInstaller.pkg --keychain-profile "DevProfile" --wait
```

> **Lưu ý:**
>
> - Trước khi sử dụng `notarytool`, bạn cần tạo một profile trong Keychain.

2. **Tạo Keychain Profile:**

   Trước khi gửi ứng dụng để notarize, lưu trữ thông tin xác thực của bạn một cách an toàn trong Keychain bằng lệnh:

```bash
xcrun notarytool store-credentials --keychain-profile "DevProfile" --apple-id "your-apple-id" --team-id "your-team-id" --password "app-specific-password"
```

> **Giải thích các tham số:**
>
> - `--keychain-profile`: Tên của profile bạn muốn tạo (ví dụ: `"DevProfile"`).
> - `--apple-id`: Apple ID của bạn.
> - `--team-id`: Team ID của bạn (có thể tìm thấy trong Apple Developer Account).
> - `--password`: Mật khẩu ứng dụng (App-Specific Password), không phải mật khẩu Apple ID.
>   **Lưu ý:**
> - Bạn cần tạo **App-Specific Password** cho Apple ID của mình.
> - Điều này sẽ lưu trữ thông tin xác thực của bạn một cách an toàn trong Keychain, và bạn có thể sử dụng profile này cho các yêu cầu notarization sau này.

---

## Bước 6: Kiểm Tra Trạng Thái Notarization

Sau khi gửi ứng dụng, bạn có thể kiểm tra trạng thái notarization:

1. **Kiểm tra lịch sử notarization:**

```bash
xcrun notarytool history --keychain-profile "DevProfile"
```

2. **Kiểm tra log chi tiết cho một RequestUUID cụ thể:**

```bash
xcrun notarytool log <submission-id> --keychain-profile "DevProfile"
```

```bash
xcrun notarytool log <RequestUUID> --keychain-profile "DevProfile" --output-format json > notarytool-log.json
```

- Mở và kiểm tra file `notarytool-log.json` để xem chi tiết về quá trình notarization.

---

## Bước 7: Tiến Hành Stapling (Nếu Cần)

Sau khi ứng dụng của bạn đã được notarized thành công, bạn nên tiến hành "stapling" (đính kèm) ticket notarization vào ứng dụng hoặc installer package. Điều này cho phép người dùng chạy ứng dụng của bạn mà không cần kết nối internet để kiểm tra trạng thái notarization.

1. **Staple ứng dụng:**

```bash
xcrun stapler staple /YourApp.app
```

2. **Hoặc staple installer package:**

```bash
xcrun stapler staple /YourAppInstaller.pkg
```

---

## Bước 8: Kiểm Tra Lại Ứng Dụng

Cuối cùng, kiểm tra lại ứng dụng của bạn để đảm bảo rằng nó đã được notarized và stapled thành công:

```bash
spctl --assess --type execute --verbose=4 /YourApp.app
```

```bash
spctl --assess --type execute --verbose /YourApp.app
```

- Nếu tất cả đều ổn, bạn sẽ thấy kết quả `accepted`.

---

## Bước 9: Nén và giải nén đúng cách giữ nguyên (extended attributes được gắn vào chữ ký số.)

### - Nén một file zip:

```bash
ditto -c -k --keepParent /MKT\ YourApp /MKT\ YourApp.zip
```

### - Giải nén một file zip:

```bash
ditto -x -k --rsrc MKT_App.zip /path/to/Output
```
