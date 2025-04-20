# 📖 Blog Page React

> Hash yönlendirme, tema geçişi ve tam CRUD işlemleri sunan modern bir React blog uygulaması.

## 🔍 Proje Genel Bakış

**Blog Page React** React ve Vite kullanılarak geliştirilmiş hash yönlendirme sayesinde sayfa yenilemeden gezinme imkânı sunan tek sayfa uygulamasıdır.  
Başlıca bölümler:

- **Anasayfa**: Öne çıkan gönderiler  
- **Hakkında**: Kişisel bilgi bölümü  
- **Blog**: Tüm gönderilerin listesi  
- **Detay**: Tüm gönderilerin tam içeriği  
- **Editör**: Yetkili kullanıcılar için blog yazısı oluşturma, düzenleme ve silme bölümü

![image](https://github.com/user-attachments/assets/974f9229-3010-415a-96a5-29e1ff106a5e)

## 🚀 Temel Özellikler

### 📌 Hash Yönlendirme

- `#/`, `#/hakkinda`, `#/blog`, `#/detaylar/, `#/editor` yolları ilgili bileşene yönlendirilir.
- Sayfa yenilemeden dinamik içerik gösterimi yapılır.

### 🌙 Tema Yönetimi

- `ThemeContext` ve `useContext` ile açık/koyu mod geçişi sağlanır.
- Seçim `localStorage`'da saklanır ve kalıcı hale gelir.

![image](https://github.com/user-attachments/assets/29704761-0520-426b-8328-f3ec1257e3e9)

### 🖥️ Anasayfa & Blog Listesi

- Gönderiler `https://gayedinc.pythonanywhere.com/posts` adresinden çekilir.
- **Anasayfa** kısmında son bloglar grid şeklinde listelenir.
- **Blog** sayfasında tüm gönderiler sıralanır.
- Her bir karta tıklanınca detay sayfasına yönlendirme yapılır.

### 📄 Detay Görünümü

- Her yazı için görsel, başlık, tarih, özet ve içerik detaylı şekilde gösterilir.
- Yüklenme sırasında kullanıcıyı bilgilendiren durum ekranı sunulur.

![image](https://github.com/user-attachments/assets/6fd76c50-16af-42e7-a24f-50c7280198fe)

### ✍️ Editör (CRUD)

![image](https://github.com/user-attachments/assets/1f099e70-ca6b-4e85-bbb3-023537703ff4)

- **Giriş Modal’ı** ile kullanıcı adı ve şifre kontrolü yapılır.

![image](https://github.com/user-attachments/assets/904c2459-54f3-45e8-afb4-d9498dedcb92)

- **Editör Modal’ı** üzerinden yeni yazı eklenebilir veya mevcut yazı düzenlenebilir.

![image](https://github.com/user-attachments/assets/c2aa6172-ef11-420c-b6f9-af9c1a02a9af)
![image](https://github.com/user-attachments/assets/85c5e3f3-0bb0-40fd-ad38-16dc204551f5)

- Yazılar silinmeden önce kullanıcıya onay sorulur.

![image](https://github.com/user-attachments/assets/d7906b2c-8cba-49be-be63-4cf7fd7312a1)

- Eğer kullanıcı **admin** değilse ve giriş bilgileri admin bilgileriyle uyuşmuyorsa bloglar üzerinde yapılan hiçbir değişiklik **kayıt edilmez**.
- Sadece **admin kullanıcı** gönderiler üzerinde ekleme, düzenleme ve silme işlemleri gerçekleştirebilir.
- Tüm işlemler `Authorization: Basic` başlığıyla güvenli şekilde API’ye iletilir.

## 🌐 Canlı Demo

🔗 [https://blog-page-react-two.vercel.app/#/](https://blog-page-react-two.vercel.app)

## 🛠️ Teknolojiler & Araçlar

- React (Hooks, Context)  
- Vite (geliştirme sunucusu, hızlı build)  
- Fetch API ile HTTP istekleri  
- Dialog API ile modal yönetimi  
- LocalStorage (tema ve auth saklama)  
- CSS Flexbox & Media Queries (responsive tasarım)
