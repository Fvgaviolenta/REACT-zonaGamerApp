🏗️ Estructura del Backend Spring Boot
Fase 1: Configuración Inicial del Proyecto
1.1 Dependencias Maven (pom.xml)
XML
<dependencies>
    <!-- Spring Boot Starter -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <!-- Firebase Admin SDK -->
    <dependency>
        <groupId>com.google.firebase</groupId>
        <artifactId>firebase-admin</artifactId>
        <version>9.2.0</version>
    </dependency>
    
    <!-- Firestore -->
    <dependency>
        <groupId>com.google.cloud</groupId>
        <artifactId>google-cloud-firestore</artifactId>
        <version>3.14.0</version>
    </dependency>
    
    <!-- Firebase Cloud Storage -->
    <dependency>
        <groupId>com.google.cloud</groupId>
        <artifactId>google-cloud-storage</artifactId>
        <version>2.26.1</version>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    
    <!-- Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    
    <!-- Lombok (opcional pero recomendado) -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
Fase 2: Configuración de Firebase
2.1 Archivo de Configuración (application.yml)
YAML
spring:
  application:
    name: zonagamer-backend
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

firebase:
  credentials-path: classpath:firebase-service-account.json
  bucket-name: zonagamer-app.appspot.com
  project-id: zonagamer-app

jwt:
  secret: ${JWT_SECRET:tu-secreto-super-seguro-cambiar-en-produccion}
  expiration: 86400000 # 24 horas

cors:
  allowed-origins: http://localhost:5173,http://localhost:3000
2.2 Clase de Configuración de Firebase
Java
package com.zonagamer.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.credentials-path}")
    private String credentialsPath;

    @Value("${firebase.bucket-name}")
    private String bucketName;

    @PostConstruct
    public void initialize() throws IOException {
        InputStream serviceAccount = getClass()
            .getResourceAsStream("/firebase-service-account.json");

        FirebaseOptions options = FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
            .setStorageBucket(bucketName)
            .build();

        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
        }
    }

    @Bean
    public Firestore firestore() {
        return FirestoreClient.getFirestore();
    }

    @Bean
    public Storage storage() throws IOException {
        InputStream serviceAccount = getClass()
            .getResourceAsStream("/firebase-service-account.json");
        
        return StorageOptions.newBuilder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
            .build()
            .getService();
    }
}
Fase 3: Modelos de Datos (Entities)
3.1 Modelo Usuario
Java
package com.zonagamer.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String id;
    private String email;
    private String password; // Hash BCrypt
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Set<UserRole> roles; // ADMIN, USER
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String profileImageUrl;
    
    public enum UserRole {
        ROLE_ADMIN,
        ROLE_USER
    }
}
3.2 Modelo Producto
Java
package com.zonagamer.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    private String id;
    private String name;
    private Double price;
    private String description;
    private String imageUrl;
    private String categoryId;
    private Integer stock;
    private boolean isFeatured;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
3.3 Modelo Categoría
Java
package com.zonagamer.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    private String id;
    private String name;
    private String parentId;
    private List<Category> children;
    private boolean active;
}
Fase 4: DTOs (Data Transfer Objects)
4.1 DTOs de Usuario
Java
package com.zonagamer.dto;

import lombok.Data;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class UserRegistrationDTO {
    @NotBlank(message = "El email es requerido")
    @Email(message = "Email inválido")
    private String email;
    
    @NotBlank(message = "La contraseña es requerida")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;
    
    @NotBlank(message = "El nombre es requerido")
    private String firstName;
    
    @NotBlank(message = "El apellido es requerido")
    private String lastName;
    
    private String phoneNumber;
}

@Data
public class UserLoginDTO {
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    private String password;
}

@Data
public class AuthResponseDTO {
    private String token;
    private String type = "Bearer";
    private String userId;
    private String email;
    private Set<String> roles;
}
4.2 DTOs de Producto
Java
package com.zonagamer.dto;

import lombok.Data;
import javax.validation.constraints.*;

@Data
public class ProductCreateDTO {
    @NotBlank(message = "El nombre es requerido")
    private String name;
    
    @NotNull(message = "El precio es requerido")
    @Positive(message = "El precio debe ser positivo")
    private Double price;
    
    private String description;
    
    @NotBlank(message = "La categoría es requerida")
    private String categoryId;
    
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;
    
    private String imageUrl;
    private boolean isFeatured;
}

@Data
public class ProductResponseDTO {
    private String id;
    private String name;
    private Double price;
    private String description;
    private String imageUrl;
    private String categoryId;
    private Integer stock;
    private boolean isFeatured;
    private String createdAt;
}
Fase 5: Repositorios (Firestore)
5.1 Repositorio Base Genérico
Java
package com.zonagamer.repository;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public abstract class BaseFirestoreRepository<T> {
    
    protected final Firestore firestore;
    
    protected abstract String getCollectionName();
    protected abstract Class<T> getEntityClass();
    
    public String save(T entity) throws ExecutionException, InterruptedException {
        String id = java.util.UUID.randomUUID().toString();
        firestore.collection(getCollectionName())
            .document(id)
            .set(entity)
            .get();
        return id;
    }
    
    public Optional<T> findById(String id) throws ExecutionException, InterruptedException {
        var doc = firestore.collection(getCollectionName())
            .document(id)
            .get()
            .get();
            
        return doc.exists() ? 
            Optional.of(doc.toObject(getEntityClass())) : 
            Optional.empty();
    }
    
    public List<T> findAll() throws ExecutionException, InterruptedException {
        var querySnapshot = firestore.collection(getCollectionName())
            .get()
            .get();
            
        return querySnapshot.getDocuments().stream()
            .map(doc -> doc.toObject(getEntityClass()))
            .collect(Collectors.toList());
    }
    
    public void update(String id, T entity) throws ExecutionException, InterruptedException {
        firestore.collection(getCollectionName())
            .document(id)
            .set(entity)
            .get();
    }
    
    public void delete(String id) throws ExecutionException, InterruptedException {
        firestore.collection(getCollectionName())
            .document(id)
            .delete()
            .get();
    }
}
5.2 Repositorio de Productos
Java
package com.zonagamer.repository;

import com.google.cloud.firestore.Firestore;
import com.zonagamer.model.Product;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Repository
public class ProductRepository extends BaseFirestoreRepository<Product> {
    
    public ProductRepository(Firestore firestore) {
        super(firestore);
    }
    
    @Override
    protected String getCollectionName() {
        return "products";
    }
    
    @Override
    protected Class<Product> getEntityClass() {
        return Product.class;
    }
    
    public List<Product> findByCategory(String categoryId) throws ExecutionException, InterruptedException {
        return firestore.collection(getCollectionName())
            .whereEqualTo("categoryId", categoryId)
            .get()
            .get()
            .toObjects(Product.class);
    }
    
    public List<Product> findFeatured() throws ExecutionException, InterruptedException {
        return firestore.collection(getCollectionName())
            .whereEqualTo("isFeatured", true)
            .get()
            .get()
            .toObjects(Product.class);
    }
}
5.3 Repositorio de Usuarios
Java
package com.zonagamer.repository;

import com.google.cloud.firestore.Firestore;
import com.zonagamer.model.User;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Repository
public class UserRepository extends BaseFirestoreRepository<User> {
    
    public UserRepository(Firestore firestore) {
        super(firestore);
    }
    
    @Override
    protected String getCollectionName() {
        return "users";
    }
    
    @Override
    protected Class<User> getEntityClass() {
        return User.class;
    }
    
    public Optional<User> findByEmail(String email) throws ExecutionException, InterruptedException {
        var querySnapshot = firestore.collection(getCollectionName())
            .whereEqualTo("email", email)
            .limit(1)
            .get()
            .get();
            
        return querySnapshot.isEmpty() ? 
            Optional.empty() : 
            Optional.of(querySnapshot.toObjects(User.class).get(0));
    }
}
Fase 6: Servicios
6.1 Servicio de Storage (Firebase Cloud Storage)
Java
package com.zonagamer.service;

import com.google.cloud.storage.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StorageService {
    
    private final Storage storage;
    
    @Value("${firebase.bucket-name}")
    private String bucketName;
    
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        String fileName = folder + "/" + UUID.randomUUID() + "_" + file.getOriginalFilename();
        
        BlobId blobId = BlobId.of(bucketName, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
            .setContentType(file.getContentType())
            .build();
            
        storage.create(blobInfo, file.getBytes());
        
        return String.format("https://storage.googleapis.com/%s/%s", bucketName, fileName);
    }
    
    public void deleteFile(String fileUrl) {
        String fileName = extractFileNameFromUrl(fileUrl);
        BlobId blobId = BlobId.of(bucketName, fileName);
        storage.delete(blobId);
    }
    
    private String extractFileNameFromUrl(String url) {
        return url.substring(url.lastIndexOf("/") + 1);
    }
}
6.2 Servicio de Productos
Java
package com.zonagamer.service;

import com.zonagamer.dto.ProductCreateDTO;
import com.zonagamer.dto.ProductResponseDTO;
import com.zonagamer.model.Product;
import com.zonagamer.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    private final StorageService storageService;
    
    public ProductResponseDTO createProduct(ProductCreateDTO dto, MultipartFile image) 
            throws ExecutionException, InterruptedException, IOException {
        
        String imageUrl = image != null ? 
            storageService.uploadFile(image, "products") : 
            dto.getImageUrl();
        
        Product product = Product.builder()
            .name(dto.getName())
            .price(dto.getPrice())
            .description(dto.getDescription())
            .categoryId(dto.getCategoryId())
            .stock(dto.getStock())
            .imageUrl(imageUrl)
            .isFeatured(dto.isFeatured())
            .active(true)
            .createdAt(LocalDateTime.now())
            .build();
            
        String id = productRepository.save(product);
        product.setId(id);
        
        return mapToDTO(product);
    }
    
    public List<ProductResponseDTO> getAllProducts() throws ExecutionException, InterruptedException {
        return productRepository.findAll().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    public List<ProductResponseDTO> getProductsByCategory(String categoryId) 
            throws ExecutionException, InterruptedException {
        return productRepository.findByCategory(categoryId).stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    public ProductResponseDTO updateProduct(String id, ProductCreateDTO dto) 
            throws ExecutionException, InterruptedException {
        
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
            
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setDescription(dto.getDescription());
        product.setCategoryId(dto.getCategoryId());
        product.setStock(dto.getStock());
        product.setIsFeatured(dto.isFeatured());
        product.setUpdatedAt(LocalDateTime.now());
        
        productRepository.update(id, product);
        return mapToDTO(product);
    }
    
    public void deleteProduct(String id) throws ExecutionException, InterruptedException {
        productRepository.delete(id);
    }
    
    private ProductResponseDTO mapToDTO(Product product) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        dto.setDescription(product.getDescription());
        dto.setImageUrl(product.getImageUrl());
        dto.setCategoryId(product.getCategoryId());
        dto.setStock(product.getStock());
        dto.setIsFeatured(product.isFeatured());
        dto.setCreatedAt(product.getCreatedAt().toString());
        return dto;
    }
}
6.3 Servicio de Autenticación
Java
package com.zonagamer.service;

import com.zonagamer.dto.*;
import com.zonagamer.model.User;
import com.zonagamer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    
    public AuthResponseDTO register(UserRegistrationDTO dto) 
            throws ExecutionException, InterruptedException {
        
        // Verificar si el usuario ya existe
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        User user = User.builder()
            .email(dto.getEmail())
            .password(passwordEncoder.encode(dto.getPassword()))
            .firstName(dto.getFirstName())
            .lastName(dto.getLastName())
            .phoneNumber(dto.getPhoneNumber())
            .roles(Set.of(User.UserRole.ROLE_USER))
            .active(true)
            .createdAt(LocalDateTime.now())
            .build();
            
        String userId = userRepository.save(user);
        user.setId(userId);
        
        String token = jwtService.generateToken(user);
        
        return buildAuthResponse(user, token);
    }
    
    public AuthResponseDTO login(UserLoginDTO dto) 
            throws ExecutionException, InterruptedException {
        
        User user = userRepository.findByEmail(dto.getEmail())
            .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));
            
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }
        
        String token = jwtService.generateToken(user);
        
        return buildAuthResponse(user, token);
    }
    
    private AuthResponseDTO buildAuthResponse(User user, String token) {
        AuthResponseDTO response = new AuthResponseDTO();
        response.setToken(token);
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());
        response.setRoles(user.getRoles().stream()
            .map(Enum::name)
            .collect(java.util.stream.Collectors.toSet()));
        return response;
    }
}
Fase 7: Controladores REST
7.1 Controlador de Productos
Java
package com.zonagamer.controller;

import com.zonagamer.dto.ProductCreateDTO;
import com.zonagamer.dto.ProductResponseDTO;
import com.zonagamer.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {
    
    private final ProductService productService;
    
    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() 
            throws ExecutionException, InterruptedException {
        return ResponseEntity.ok(productService.getAllProducts());
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByCategory(
            @PathVariable String categoryId) throws ExecutionException, InterruptedException {
        return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponseDTO> createProduct(
            @Valid @RequestPart ProductCreateDTO productDTO,
            @RequestPart(required = false) MultipartFile image) 
            throws ExecutionException, InterruptedException, java.io.IOException {
        
        ProductResponseDTO created = productService.createProduct(productDTO, image);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable String id,
            @Valid @RequestBody ProductCreateDTO productDTO) 
            throws ExecutionException, InterruptedException {
        
        return ResponseEntity.ok(productService.updateProduct(id, productDTO));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) 
            throws ExecutionException, InterruptedException {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
7.2 Controlador de Autenticación
Java
package com.zonagamer.controller;

import com.zonagamer.dto.*;
import com.zonagamer.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(
            @Valid @RequestBody UserRegistrationDTO dto) 
            throws ExecutionException, InterruptedException {
        return ResponseEntity.ok(authService.register(dto));
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(
            @Valid @RequestBody UserLoginDTO dto) 
            throws ExecutionException, InterruptedException {
        return ResponseEntity.ok(authService.login(dto));
    }
}
Fase 8: Seguridad y JWT
8.1 JWT Service
Java
package com.zonagamer.service;

import com.zonagamer.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.stream.Collectors;

@Service
public class JwtService {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private Long expiration;
    
    public String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        
        return Jwts.builder()
            .setSubject(user.getId())
            .claim("email", user.getEmail())
            .claim("roles", user.getRoles().stream()
                .map(Enum::name)
                .collect(Collectors.toList()))
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(getSigningKey(), SignatureAlgorithm.HS512)
            .compact();
    }
    
    public String getUserIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
            
        return claims.getSubject();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
    
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
}
8.2 Configuración de Seguridad
Java
package com.zonagamer.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors().and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeRequests()
                .antMatchers("/api/auth/**").permitAll()
                .antMatchers("/api/products/**").permitAll()
                .antMatchers("/api/categories/**").permitAll()
                .anyRequest().authenticated();
                
        return http.build();
    }
}
🔌 APIs Externas Recomendadas
1. Sistema de Pagos - Mercado Pago (Recomendado para Chile)
XML
<dependency>
    <groupId>com.mercadopago</groupId>
    <artifactId>sdk-java</artifactId>
    <version>2.1.21</version>
</dependency>
Servicio de Pagos:

Java
@Service
@RequiredArgsConstructor
public class PaymentService {
    
    @Value("${mercadopago.access-token}")
    private String accessToken;
    
    public Map<String, Object> createPayment(PaymentRequestDTO dto) {
        MercadoPago.SDK.setAccessToken(accessToken);
        
        Preference preference = new Preference();
        
        Item item = new Item();
        item.setTitle(dto.getProductName())
            .setQuantity(dto.getQuantity())
            .setUnitPrice(new BigDecimal(dto.getPrice()));
            
        preference.appendItem(item);
        
        return preference.save();
    }
}
2. Alternativa: Flow (Específico para Chile)
Más usado localmente
Soporta WebPay Plus, Servipag, etc.
API REST simple
3. Envío de Emails - SendGrid
XML
<dependency>
    <groupId>com.sendgrid</groupId>
    <artifactId>sendgrid-java</artifactId>
    <version>4.9.3</version>
</dependency>
4. Notificaciones Push - Firebase Cloud Messaging (FCM)
Ya incluido en Firebase Admin SDK

📁 Estructura Final del Proyecto
Code
zonagamer-backend/
├── src/main/java/com/zonagamer/
│   ├── config/
│   │   ├── FirebaseConfig.java
│   │   ├── SecurityConfig.java
│   │   └── CorsConfig.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── ProductController.java
│   │   ├── CategoryController.java
│   │   └── UserController.java
│   ├── dto/
│   │   ├── UserRegistrationDTO.java
│   │   ├── UserLoginDTO.java
│   │   ├── AuthResponseDTO.java
│   │   ├── ProductCreateDTO.java
│   │   └── ProductResponseDTO.java
│   ├── model/
│   │   ├── User.java
│   │   ├── Product.java
│   │   └── Category.java
│   ├── repository/
│   │   ├── BaseFirestoreRepository.java
│   │   ├── UserRepository.java
│   │   ├── ProductRepository.java
│   │   └── CategoryRepository.java
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── ProductService.java
│   │   ├── StorageService.java
│   │   ├── JwtService.java
│   │   └── PaymentService.java
│   ├── security/
│   │   ├── JwtAuthenticationFilter.java
│   │   └── JwtAuthenticationEntryPoint.java
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java
│   │   └── ResourceNotFoundException.java
│   └── ZonaGamerApplication.java
├── src/main/resources/
│   ├── application.yml
│   └── firebase-service-account.json
└── pom.xml
🚀 Pasos para Iniciar
Crear proyecto Spring Boot en Spring Initializr
Configurar Firebase Console:
Crear proyecto
Habilitar Firestore
Habilitar Storage
Descargar credenciales JSON
Implementar en orden:
Configuración → Modelos → Repositorios → Servicios → Controladores
Probar con Postman cada endpoint
Conectar desde React actualizando las llamadas API
Guía Explicativa Detallada - Backend Spring Boot + Firebase
📚 Introducción Conceptual
Antes de comenzar, es fundamental entender qué estamos construyendo:

¿Qué es una arquitectura Cliente-Servidor?
Tu aplicación React (frontend) es el cliente que se ejecuta en el navegador del usuario. El backend Spring Boot es el servidor que maneja la lógica de negocio, autenticación, y acceso a la base de datos. Estos se comunican mediante HTTP/REST APIs.

¿Por qué Spring Boot?
Framework maduro y robusto para aplicaciones empresariales
Inyección de dependencias automática (IoC - Inversión de Control)
Configuración mínima (convención sobre configuración)
Gran ecosistema de bibliotecas y herramientas
Seguridad integrada con Spring Security
¿Por qué Firebase/Firestore?
Base de datos NoSQL (sin esquemas rígidos como SQL)
Tiempo real (aunque no lo uses ahora, está disponible)
Escalabilidad automática (no necesitas configurar servidores)
Storage integrado para imágenes
Sin costo inicial (plan gratuito generoso)
🔍 FASE 1: Configuración Inicial del Proyecto - EXPLICACIÓN DETALLADA
¿Qué es Maven?
Maven es un gestor de dependencias y construcción de proyectos. Piensa en él como un "administrador de librerías" que:

Descarga automáticamente las bibliotecas que necesitas
Gestiona las versiones de cada biblioteca
Compila tu proyecto
Empaqueta tu aplicación en un archivo .jar ejecutable
¿Qué es el archivo pom.xml?
Es el corazón de tu proyecto Maven. Contiene:

Metadatos del proyecto (nombre, versión, descripción)
Dependencias (librerías externas que usarás)
Plugins (herramientas para compilar, testear, etc.)
Desglose de las Dependencias Clave:
1. spring-boot-starter-web
Code
¿Qué hace? 
- Configura un servidor web embebido (Tomcat)
- Habilita la creación de REST APIs con @RestController
- Incluye Jackson (para convertir objetos Java a JSON automáticamente)
- Maneja peticiones HTTP (GET, POST, PUT, DELETE)

¿Por qué la necesitas?
Sin esto, no podrías exponer endpoints HTTP para que React consuma.
2. spring-boot-starter-security
Code
¿Qué hace?
- Protege tus endpoints con autenticación
- Maneja el cifrado de contraseñas (BCrypt)
- Gestiona roles y permisos (ADMIN vs USER)
- Previene ataques comunes (CSRF, XSS)

¿Por qué la necesitas?
No puedes permitir que cualquiera cree/edite productos o acceda a datos de usuarios.
3. firebase-admin
Code
¿Qué hace?
- SDK oficial de Firebase para Java
- Permite autenticación con Firebase desde el servidor
- Conecta con Firestore Database
- Accede a Firebase Cloud Storage

¿Por qué la necesitas?
Es el "puente" entre tu aplicación Java y los servicios de Firebase.
4. google-cloud-firestore
Code
¿Qué hace?
- Cliente específico para Firestore Database
- Proporciona APIs para CRUD (Create, Read, Update, Delete)
- Maneja consultas complejas y filtros
- Gestiona transacciones y batch operations

¿Por qué la necesitas?
Aquí guardarás productos, usuarios, categorías (tu base de datos).
5. google-cloud-storage
Code
¿Qué hace?
- Cliente para Firebase Cloud Storage
- Sube archivos (imágenes de productos)
- Genera URLs públicas accesibles desde React
- Maneja metadatos de archivos (tipo MIME, tamaño)

¿Por qué la necesitas?
Para almacenar las imágenes de productos que los administradores suban.
6. jjwt-api (JSON Web Tokens)
Code
¿Qué hace?
- Crea tokens de autenticación seguros
- Valida tokens en cada petición
- Almacena información del usuario en el token (id, roles)
- Tiene expiración automática

¿Por qué la necesitas?
Cuando un usuario inicia sesión, le das un token. En cada petición posterior,
envía ese token para demostrar que está autenticado. Sin esto, tendrías que 
mantener sesiones en el servidor (menos escalable).
7. spring-boot-starter-validation
Code
¿Qué hace?
- Valida datos de entrada automáticamente
- Usa anotaciones como @NotBlank, @Email, @Min, @Max
- Devuelve mensajes de error claros al frontend
- Previene datos corruptos en la base de datos

¿Por qué la necesitas?
No puedes confiar en que el frontend siempre envíe datos correctos.
Ejemplo: precio negativo, email sin @, campo vacío.
8. lombok
Code
¿Qué hace?
- Genera código repetitivo automáticamente en tiempo de compilación
- @Data: crea getters, setters, toString, equals, hashCode
- @Builder: crea un patrón constructor fluido
- @RequiredArgsConstructor: inyección de dependencias por constructor

¿Por qué la necesitas?
Sin Lombok:
public class User {
    private String name;
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    // ... 50 líneas más para cada campo
}

Con Lombok:
@Data
public class User {
    private String name;
}
🔥 FASE 2: Configuración de Firebase - EXPLICACIÓN DETALLADA
¿Qué es application.yml?
Es el archivo de configuración centralizada de Spring Boot. Aquí defines:

Variables de entorno
Rutas a archivos de credenciales
Configuraciones de seguridad
Límites de tamaño de archivos
Ventaja sobre application.properties: Soporta estructura jerárquica más clara.

Desglose del archivo application.yml:
Sección: spring.servlet.multipart
YAML
max-file-size: 10MB
max-request-size: 10MB
¿Qué hace?

Limita el tamaño máximo de archivos que se pueden subir (imágenes de productos)
Previene ataques de denegación de servicio (alguien subiendo archivos de 1GB)
¿Por qué 10MB? Es suficiente para imágenes de alta calidad. Ajústalo según tus necesidades.

Sección: firebase
YAML
credentials-path: classpath:firebase-service-account.json
¿Qué es este archivo JSON?

Contiene las credenciales privadas de tu proyecto Firebase
Autentifica tu backend con Firebase (como una "llave maestra")
NUNCA debe subirse a GitHub (agrégalo a .gitignore)
¿Dónde obtenerlo? Firebase Console → Project Settings → Service Accounts → Generate New Private Key

YAML
bucket-name: zonagamer-app.appspot.com
¿Qué es un bucket?

Es el "contenedor" donde se almacenan archivos en Cloud Storage
Cada proyecto Firebase tiene uno por defecto
El nombre tiene formato: [nombre-proyecto].appspot.com
Sección: jwt
YAML
secret: ${JWT_SECRET:tu-secreto-super-seguro-cambiar-en-produccion}
¿Qué es esto?

${JWT_SECRET} busca una variable de entorno llamada JWT_SECRET
Si no existe, usa el valor después de : (valor por defecto)
Este secreto firma los tokens JWT (como una firma digital)
¿Por qué es importante? Si alguien conoce tu secreto, puede crear tokens falsos y hacerse pasar por cualquier usuario.

YAML
expiration: 86400000 # 24 horas en milisegundos
¿Por qué expiran los tokens?

Seguridad: si alguien roba un token, solo es válido por 24 horas
El usuario debe volver a iniciar sesión periódicamente
Sección: cors.allowed-origins
YAML
allowed-origins: http://localhost:5173,http://localhost:3000
¿Qué es CORS?

Cross-Origin Resource Sharing
Los navegadores bloquean peticiones de un dominio (localhost:5173) a otro (localhost:8080)
Esto protege a los usuarios de sitios maliciosos
¿Por qué permitir estos orígenes?

localhost:5173 → Vite (tu frontend React en desarrollo)
localhost:3000 → Create React App (alternativa)
En producción, cambiarías a:

YAML
allowed-origins: https://www.zonagamer.cl
Clase FirebaseConfig - Explicación Línea por Línea:
@Configuration
Java
@Configuration
public class FirebaseConfig {
¿Qué hace?

Le dice a Spring: "Esta clase contiene configuración del sistema"
Spring ejecuta métodos @Bean al iniciar la aplicación
Estos beans quedan disponibles para inyección de dependencias
@PostConstruct
Java
@PostConstruct
public void initialize() throws IOException {
¿Qué hace?

Se ejecuta automáticamente después de crear el objeto
Perfecto para inicialización única (conectar con Firebase)
Solo se ejecuta una vez al arrancar la aplicación
Carga de Credenciales
Java
InputStream serviceAccount = getClass()
    .getResourceAsStream("/firebase-service-account.json");
¿Qué hace?

getClass() → Obtiene la clase actual
.getResourceAsStream() → Lee un archivo del classpath (carpeta resources/)
/firebase-service-account.json → Ruta al archivo de credenciales
Importante: El archivo debe estar en src/main/resources/

FirebaseOptions Builder
Java
FirebaseOptions options = FirebaseOptions.builder()
    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
    .setStorageBucket(bucketName)
    .build();
¿Qué hace?

Patrón Builder: construye objetos complejos paso a paso
.setCredentials() → Autentica con las credenciales del JSON
.setStorageBucket() → Configura dónde guardar archivos
.build() → Crea el objeto final
Singleton Check
Java
if (FirebaseApp.getApps().isEmpty()) {
    FirebaseApp.initializeApp(options);
}
¿Por qué este if?

Firebase solo permite inicializarse una vez
Si lo intentas dos veces, lanza error
.getApps().isEmpty() verifica que no esté ya inicializado
@Bean para Firestore
Java
@Bean
public Firestore firestore() {
    return FirestoreClient.getFirestore();
}
¿Qué hace @Bean?

Registra el objeto Firestore en el contenedor de Spring
Ahora cualquier clase puede pedir Firestore en su constructor
Spring lo inyecta automáticamente (Dependency Injection)
Ejemplo de uso:

Java
@Service
public class ProductService {
    private final Firestore firestore; // Spring lo inyecta aquí
    
    public ProductService(Firestore firestore) {
        this.firestore = firestore;
    }
}
@Bean para Storage
Java
@Bean
public Storage storage() throws IOException {
    InputStream serviceAccount = getClass()
        .getResourceAsStream("/firebase-service-account.json");
    
    return StorageOptions.newBuilder()
        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
        .build()
        .getService();
}
¿Por qué crear otro InputStream?

Los streams solo se pueden leer una vez
Ya lo usamos en initialize(), entonces necesitamos otro
¿Qué hace .getService()?

StorageOptions es una configuración
.getService() crea el cliente real de Storage
📦 FASE 3: Modelos de Datos (Entities) - EXPLICACIÓN DETALLADA
¿Qué son las Entidades?
Son representaciones de objetos del mundo real en tu aplicación:

User → Una persona registrada
Product → Un artículo en venta
Category → Una clasificación de productos
Diferencia con tablas SQL: En SQL, creas tablas rígidas con columnas fijas. En Firestore, los documentos son flexibles (como JSON).

Anotaciones Lombok Explicadas:
@Data
Java
@Data
public class User {
Genera automáticamente:

getEmail(), setEmail(), etc. para todos los campos
toString() para debugging
equals() y hashCode() para comparaciones
@RequiredArgsConstructor para campos final
@Builder
Java
@Builder
public class Product {
Permite construir objetos de forma elegante:

Java
// Sin Builder (tedioso):
Product p = new Product();
p.setName("RTX 4070");
p.setPrice(800000.0);
p.setStock(10);

// Con Builder (elegante):
Product p = Product.builder()
    .name("RTX 4070")
    .price(800000.0)
    .stock(10)
    .build();
@NoArgsConstructor y @AllArgsConstructor
Java
@NoArgsConstructor  // Constructor vacío
@AllArgsConstructor // Constructor con todos los campos
¿Por qué necesitas ambos?

Firestore necesita constructor vacío para deserializar documentos
AllArgsConstructor es útil para tests y construcción manual
Campos del Modelo User - Explicación:
String id
Java
private String id;
¿Por qué String y no Long?

Firestore genera IDs alfanuméricos: abc123xyz789
Son únicos globalmente (no solo en una tabla)
Permiten sharding (distribución) más eficiente
String password
Java
private String password; // Hash BCrypt
Nunca guardes contraseñas en texto plano. BCrypt es un algoritmo de hash que:

Es irreversible (no puedes obtener la contraseña original)
Incluye "salt" automático (dos usuarios con misma contraseña tendrán hashes diferentes)
Es lento intencionalmente (dificulta ataques de fuerza bruta)
Ejemplo:

Code
Contraseña: "miPassword123"
Hash BCrypt: "$2a$10$N9qo8uLOickgx2ZMRZoMye..."
Set<UserRole> roles
Java
private Set<UserRole> roles;
¿Por qué Set y no List?

Set no permite duplicados (un usuario no puede tener ADMIN dos veces)
Operaciones de búsqueda son más rápidas: roles.contains(ADMIN)
¿Por qué enum UserRole?

Java
public enum UserRole {
    ROLE_ADMIN,
    ROLE_USER
}
Seguridad: solo valores predefinidos (no puedes poner "SUPER_HACKER")
Type-safety: el compilador detecta errores
Fácil de extender: agregas ROLE_MODERATOR y listo
LocalDateTime createdAt
Java
private LocalDateTime createdAt;
¿Por qué LocalDateTime y no Date?

Date está deprecated (obsoleto)
LocalDateTime es inmutable (thread-safe)
Mejor API: .plusDays(7), .isBefore(), etc.
Campos del Modelo Product - Explicación:
Double price
Java
private Double price;
¿Por qué Double y no BigDecimal?

Para una tienda simple, Double es suficiente
BigDecimal es mejor para aplicaciones financieras (bancos)
BigDecimal evita errores de redondeo: 0.1 + 0.2 = 0.30000000000000004
En producción real, considera:

Java
private BigDecimal price;
boolean isFeatured
Java
private boolean isFeatured;
¿Qué es un producto destacado?

Aparece en el carrusel de la página principal
Tiene mejor posicionamiento en búsquedas
Generalmente son productos con mejor margen de ganancia
Integer stock
Java
private Integer stock;
¿Por qué Integer y no int?

Integer puede ser null (producto sin stock definido aún)
int siempre es 0 por defecto (ambiguo)
Modelo Category - Jerarquía Explicada:
String parentId
Java
private String parentId;
¿Qué es una categoría padre?

Code
Hardware (parentId: null)
├── CPU (parentId: "hardware_id")
├── GPU (parentId: "hardware_id")
└── RAM (parentId: "hardware_id")
List<Category> children
Java
private List<Category> children;
¿Por qué no guardar esto en Firestore?

Se calcula dinámicamente en el backend
Evita redundancia (si cambias una subcategoría, no actualizas la padre)
Construcción del árbol de categorías:
Java
// Pseudocódigo
for (Category cat : allCategories) {
    if (cat.getParentId() == null) {
        // Es categoría raíz
        cat.setChildren(findChildren(cat.getId()));
    }
}
📝 FASE 4: DTOs (Data Transfer Objects) - EXPLICACIÓN DETALLADA
¿Qué son los DTOs y por qué son importantes?
Problema sin DTOs:

Java
// ❌ MAL: Expones toda la entidad
@GetMapping("/users/{id}")
public User getUser(@PathVariable String id) {
    return userService.findById(id); 
    // Incluye el hash de contraseña en el JSON!
}
Solución con DTOs:

Java
// ✅ BIEN: Solo expones lo necesario
@GetMapping("/users/{id}")
public UserResponseDTO getUser(@PathVariable String id) {
    User user = userService.findById(id);
    return mapToDTO(user); // Excluye password
}
Principios de DTOs:
Separación de Capas

Entidades = Modelo de dominio (base de datos)
DTOs = Contratos de API (lo que ve el frontend)
Si cambias la entidad, no rompes el API
Seguridad

Filtras datos sensibles (password, tokens internos)
Evitas over-posting (alguien enviando isAdmin: true)
Validación Centralizada

Las anotaciones @NotBlank, @Email validan entrada
Spring Boot las ejecuta automáticamente
Anotaciones de Validación Explicadas:
@NotBlank
Java
@NotBlank(message = "El email es requerido")
private String email;
¿Qué valida?

No es null
No es cadena vacía: ""
No es solo espacios: "   "
Diferencia con @NotNull:

@NotNull permite: ""
@NotBlank es más estricto
@Email
Java
@Email(message = "Email inválido")
private String email;
¿Qué valida?

Formato básico: usuario@dominio.com
No verifica si el email existe realmente
Regex interno:

Code
^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$
@Size
Java
@Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
private String password;
¿Por qué mínimo 6?

Menor = fácil de adivinar
Mayor = mejor seguridad
Considera: 8-12 caracteres en producción
@Positive
Java
@Positive(message = "El precio debe ser positivo")
private Double price;
¿Qué valida?

value > 0
Rechaza: 0, -1, -100
Alternativas:

@PositiveOrZero → permite 0 (para descuentos)
@Min(1) → más explícito
@Min / @Max
Java
@Min(value = 0, message = "El stock no puede ser negativo")
private Integer stock;
¿Cuándo usar @Min vs @Positive?

@Min(0) → incluye 0 (útil para stock agotado)
@Positive → excluye 0
UserRegistrationDTO - Flujo Completo:
1. Frontend envía:

JSON
POST /api/auth/register
{
  "email": "juan@example.com",
  "password": "miPassword123",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phoneNumber": "+56912345678"
}
2. Spring Boot valida automáticamente:

Java
public AuthResponseDTO register(
    @Valid @RequestBody UserRegistrationDTO dto // @Valid activa validaciones
) {
3. Si hay errores, responde:

JSON
{
  "timestamp": "2025-11-04T21:14:33",
  "status": 400,
  "errors": [
    {
      "field": "email",
      "message": "Email inválido"
    },
    {
      "field": "password",
      "message": "La contraseña debe tener al menos 6 caracteres"
    }
  ]
}
4. Si es válido, continúa al servicio

AuthResponseDTO - Explicación:
String token
Java
private String token;
Ejemplo de token JWT:

Code
eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyXzEyMyIsImVtYWlsIjoianVhbkBleGFtcGxlLmNvbSIsInJvbGVzIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE2OTk5OTk5OTksImV4cCI6MTcwMDA4NjM5OX0.dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk
Estructura (3 partes separadas por .):

Header: Algoritmo de encriptación
Payload: Datos del usuario (id, email, roles)
Signature: Firma digital (verifica que no fue modificado)
String type = "Bearer"
Java
private String type = "Bearer";
¿Qué es Bearer?

Es un esquema de autenticación HTTP
El frontend debe enviar: Authorization: Bearer [token]
Ejemplo de petición autenticada:

HTTP
GET /api/products
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
Set<String> roles
Java
private Set<String> roles;
¿Por qué enviarlo al frontend?

Para mostrar/ocultar botones según permisos
Ejemplo: solo ADMIN ve el botón "Eliminar producto"
Importante: NUNCA confíes solo en esto para seguridad. Siempre valida en el backend con @PreAuthorize("hasRole('ADMIN')").

ProductCreateDTO vs ProductResponseDTO:
¿Por qué dos DTOs?

CREATE (Input):

Java
// Lo que el admin envía al crear producto
{
  "name": "RTX 4070",
  "price": 800000,
  "categoryId": "gpu_id",
  "stock": 10
  // No incluye: id, createdAt (los genera el backend)
}
RESPONSE (Output):

Java
// Lo que el backend devuelve
{
  "id": "prod_abc123",
  "name": "RTX 4070",
  "price": 800000,
  "categoryId": "gpu_id",
  "stock": 10,
  "createdAt": "2025-11-04T21:14:33",
  "isFeatured": false
}
Ventajas:

Cliente no puede manipular id o createdAt
Puedes agregar campos calculados en Response (ej: priceWithTax)
🗄️ FASE 5: Repositorios (Firestore) - EXPLICACIÓN DETALLADA
¿Qué es un Repositorio?
Es la capa que interactúa directamente con la base de datos. Siguiendo el patrón:

Code
Controller → Service → Repository → Firestore
    ↓           ↓          ↓           ↓
  HTTP      Lógica    Acceso      Base de
 Request   Negocio    Datos       Datos
Principio de Separación de Responsabilidades:

Controller: Recibe peticiones HTTP
Service: Aplica reglas de negocio
Repository: Solo hace CRUD (Create, Read, Update, Delete)
BaseFirestoreRepository - Patrón Genérico:
¿Por qué usar Genéricos (<T>)?
Java
public abstract class BaseFirestoreRepository<T> {
Sin genéricos (repetitivo):

Java
public class ProductRepository {
    public String saveProduct(Product p) { ... }
}

public class UserRepository {
    public String saveUser(User u) { ... }
}

public class CategoryRepository {
    public String saveCategory(Category c) { ... }
}
// Código duplicado!
Con genéricos (DRY - Don't Repeat Yourself):

Java
public abstract class BaseFirestoreRepository<T> {
    public String save(T entity) { ... }
}

public class ProductRepository extends BaseFirestoreRepository<Product> {}
public class UserRepository extends BaseFirestoreRepository<User> {}
// Reutilizas el mismo método save()!
Métodos Abstractos:
Java
protected abstract String getCollectionName();
protected abstract Class<T> getEntityClass();
¿Por qué abstractos?

Cada repositorio hijo debe implementarlos
ProductRepository retorna "products"
UserRepository retorna "users"
Método save() - Explicación Línea por Línea:
Java
public String save(T entity) throws ExecutionException, InterruptedException {
¿Por qué throws?

Operaciones de Firestore son asíncronas
ExecutionException → Error al ejecutar operación
InterruptedException → Operación cancelada
Java
String id = java.util.UUID.randomUUID().toString();
¿Qué es UUID?

Universal Unique IDentifier
Ejemplo: 550e8400-e29b-41d4-a716-446655440000
Probabilidad de colisión: 1 en 103 trillones
Alternativa (dejar que Firestore genere el ID):

Java
DocumentReference docRef = firestore.collection("products").document();
String id = docRef.getId();
Java
firestore.collection(getCollectionName())
    .document(id)
    .set(entity)
    .get();
Desglose:

.collection("products") → Accede a la colección
.document(id) → Crea/accede a un documento específico
.set(entity) → Escribe el objeto (Firestore lo serializa a JSON)
.get() → Espera a que termine (bloquea el hilo)
¿Por qué .get()?

Sin él, el método retorna inmediatamente (operación pendiente)
Con él, esperas confirmación de que se guardó
Estructura en Firestore:

Code
products/                    (colección)
  ├── prod_abc123            (documento)
  │   ├── name: "RTX 4070"
  │   ├── price: 800000
  │   └── stock: 10
  └── prod_xyz789            (documento)
      └── ...
Método findById() - Explicación:
Java
public Optional<T> findById(String id) {
¿Por qué Optional?

El documento puede no existir

Alternativa vieja (mala):

Java
public T findById(String id) {
    return result; // ¿Qué retornas si no existe? null? Error?
}
Con Optional (elegante):

Java
Optional<Product> product = repo.findById("abc");

if (product.isPresent()) {
    Product p = product.get();
    // ...
} else {
    throw new NotFoundException("Producto no encontrado");
}
Java
var doc = firestore.collection(getCollectionName())
    .document(id)
    .get()
    .get();
Primer .get() vs Segundo .get():

Primer .get() → Ejecuta la consulta (retorna un Future)
Segundo .get() → Espera el resultado (bloquea)
Java
return doc.exists() ? 
    Optional.of(doc.toObject(getEntityClass())) : 
    Optional.empty();
Operador ternario:

Code
condición ? valor_si_true : valor_si_false
¿Qué hace .toObject()?

Deserializa el documento JSON a tu clase Java
Usa reflexión para mapear campos:
JSON
{ "name": "RTX 4070", "price": 800000 }
→
Java
Product { name = "RTX 4070", price = 800000.0 }
Método findAll() - Explicación:
Java
var querySnapshot = firestore.collection(getCollectionName())
    .get()
    .get();
¿Qué retorna?

QuerySnapshot → Colección de documentos
Similar a un ResultSet en JDBC (si vienes de SQL)
Java
return querySnapshot.getDocuments().stream()
    .map(doc -> doc.toObject(getEntityClass()))
    .collect(Collectors.toList());
Stream API de Java:

.stream() → Convierte lista en stream (flujo de datos)
.map(doc -> ...) → Transforma cada documento
.collect(Collectors.toList()) → Vuelve a convertir en lista
Equivalente sin streams:

Java
List<T> results = new ArrayList<>();
for (QueryDocumentSnapshot doc : querySnapshot.getDocuments()) {
    T entity = doc.toObject(getEntityClass());
    results.add(entity);
}
return results;
ProductRepository - Consultas Personalizadas:
findByCategory():
Java
public List<Product> findByCategory(String categoryId) {
    return firestore.collection(getCollectionName())
        .whereEqualTo("categoryId", categoryId)
        .get()
        .get()
        .toObjects(Product.class);
}
¿Qué hace .whereEqualTo()?

Filtra documentos donde categoryId == categoryId parámetro
SQL equivalente: SELECT * FROM products WHERE categoryId = ?
Otros filtros disponibles:

Java
.whereLessThan("price", 500000)      // precio < 500000
.whereGreaterThan("stock", 0)        // stock > 0
.whereIn("categoryId", Arrays.asList("cpu", "gpu"))  // IN (...)
findFeatured():
Java
.whereEqualTo("isFeatured", true)
¿Por qué crear este método?

Reutilizable (no repites la consulta)
Fácil de testear
Si cambias el criterio de "destacado", solo editas aquí
UserRepository - findByEmail():
Java
.limit(1)
¿Por qué limitar a 1?

Los emails deben ser únicos
Optimización: Firestore deja de buscar después del primer match
¿Cómo garantizar unicidad? Firestore no tiene constraints nativos. Opciones:

Validación en el servicio:

Java
if (userRepo.findByEmail(email).isPresent()) {
    throw new EmailAlreadyExistsException();
}
Índice único (Cloud Functions):

JavaScript
// Función que se ejecuta antes de crear usuario
exports.validateUniqueEmail = functions.firestore
    .document('users/{userId}')
    .onCreate((snap, context) => {
        // Valida que no exista otro con ese email
    });
⚙️ FASE 6: Servicios - EXPLICACIÓN DETALLADA
¿Qué es la Capa de Servicio?
Es donde vive la lógica de negocio. Reglas como:

"Un usuario no puede comprar un producto sin stock"
"Solo administradores pueden destacar productos"
"Al eliminar un producto, también elimina su imagen de Storage"
Separación de responsabilidades:

Code
Repository → Acceso a datos (CÓMO guardar)
Service → Lógica de negocio (QUÉ guardar y CUÁNDO)
Controller → Manejo de HTTP (exponer endpoints)
StorageService - Subida de Archivos:
uploadFile() - Flujo Completo:
1. Generar nombre único:

Java
String fileName = folder + "/" + UUID.randomUUID() + "_" + file.getOriginalFilename();
Ejemplo:

Code
folder: "products"
UUID: "550e8400-e29b-41d4-a716-446655440000"
originalFilename: "rtx4070.jpg"

Resultado: "products/550e8400-e29b-41d4-a716-446655440000_rtx4070.jpg"
¿Por qué UUID?

Evita colisiones: dos archivos "rtx4070.jpg" no se sobrescriben
Hace difícil adivinar URLs (seguridad)
2. Crear BlobId:

Java
BlobId blobId = BlobId.of(bucketName, fileName);
¿Qué es un Blob?

Binary Large Object
En Cloud Storage, cada archivo es un blob
BlobId identifica unívocamente:

Code
gs://zonagamer-app.appspot.com/products/550e8400...rtx4070.jpg
     ↑                        ↑
  bucketName              fileName
3. Definir metadatos:

Java
BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
    .setContentType(file.getContentType())
    .build();
¿Qué es ContentType?

MIME type del archivo
Ejemplos:
image/jpeg
image/png
application/pdf
¿Por qué es importante?

Los navegadores saben cómo renderizarlo
Sin él, el navegador podría descargarlo en lugar de mostrarlo
4. Subir archivo:

Java
storage.create(blobInfo, file.getBytes());
¿Qué hace .getBytes()?

Convierte el MultipartFile a array de bytes
byte[] es el formato que Cloud Storage necesita
5. Generar URL pública:

Java
return String.format("https://storage.googleapis.com/%s/%s", bucketName, fileName);
URL resultante:

Code
https://storage.googleapis.com/zonagamer-app.appspot.com/products/550e8400...rtx4070.jpg
¿Cómo hacer el archivo público? Por defecto, los archivos son privados. Opciones:

A) Configurar reglas en Firebase Console:

Code
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read; // Cualquiera puede leer
      allow write: if request.auth != null; // Solo autenticados escriben
    }
  }
}
B) Hacer público mediante código:

Java
storage.create(blobInfo, file.getBytes(), 
    Storage.BlobTargetOption.predefinedAcl(Storage.PredefinedAcl.PUBLIC_READ));
deleteFile() - Eliminación:
Java
private String extractFileNameFromUrl(String url) {
    return url.substring(url.lastIndexOf("/") + 1);
}
Ejemplo:

Code
URL: "https://storage.googleapis.com/bucket/products/550e8400...rtx4070.jpg"
lastIndexOf("/"): posición 52
substring(53): "550e8400...rtx4070.jpg"
Problema potencial: Si la URL tiene parámetros: ...rtx4070.jpg?token=abc Solución mejorada:

Java
String fileName = url.substring(url.lastIndexOf("/") + 1)
                     .split("\\?")[0]; // Elimina query params
ProductService - Lógica de Negocio:
createProduct() - Análisis:
1. Subir imagen si existe:

Java
String imageUrl = image != null ? 
    storageService.uploadFile(image, "products") : 
    dto.getImageUrl();
Casos:

Admin sube imagen: Se guarda en Storage, retorna URL
Admin proporciona URL: Se usa directamente (ej: imagen de otro servidor)
2. Construir entidad:

Java
Product product = Product.builder()
    .name(dto.getName())
    .price(dto.getPrice())
    // ...
    .createdAt(LocalDateTime.now())
    .build();
¿Por qué no usar el DTO directamente?

DTO no tiene id ni createdAt (los genera el backend)
DTO puede tener campos que no van a la entidad
Separación: DTO = API, Entity = Dominio
3. Guardar y retornar:

Java
String id = productRepository.save(product);
product.setId(id);
return mapToDTO(product);
¿Por qué asignar el ID después?

save() genera el ID y lo retorna
La entidad original no lo tiene
Lo agregamos para incluirlo en el DTO de respuesta
Método mapToDTO():
Java
private ProductResponseDTO mapToDTO(Product product) {
    ProductResponseDTO dto = new ProductResponseDTO();
    dto.setId(product.getId());
    dto.setName(product.getName());
    // ...
    return dto;
}
Alternativas más elegantes:

A) ModelMapper (biblioteca):

Java
@Autowired
private ModelMapper modelMapper;

private ProductResponseDTO mapToDTO(Product product) {
    return modelMapper.map(product, ProductResponseDTO.class);
}
B) MapStruct (genera código en compilación):

Java
@Mapper
interface ProductMapper {
    ProductResponseDTO toDTO(Product product);
}
AuthService - Autenticación:
register() - Flujo de Registro:
1. Validar unicidad de email:

Java
if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
    throw new RuntimeException("El email ya está registrado");
}
Mejor práctica (crear excepciones personalizadas):

Java
if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
    throw new EmailAlreadyExistsException(dto.getEmail());
}
Java
@ResponseStatus(HttpStatus.CONFLICT) // 409
public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException(String email) {
        super("El email " + email + " ya está registrado");
    }
}
2. Encriptar contraseña:

Java
.password(passwordEncoder.encode(dto.getPassword()))
¿Cómo funciona BCrypt?

Code
Input: "miPassword123"
Salt: "$2a$10$N9qo8uLOickgx2ZMRZoMye"
Hash: "$2a$10$N9qo8uLOickgx2ZMRZoMye.IjefO7Z/wM5J2eU.jF3OqP0XjU8uq"
Cada vez que encriptas la misma contraseña, obtienes un hash diferente
Verificación:
Java
passwordEncoder.matches("miPassword123", hash) // true
3. Asignar rol por defecto:

Java
.roles(Set.of(User.UserRole.ROLE_USER))
¿Y si quieres un admin?

Java
// Endpoint protegido para crear admins
@PostMapping("/create-admin")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public User createAdmin(@RequestBody UserDTO dto) {
    user.setRoles(Set.of(ROLE_ADMIN));
    // ...
}
4. Generar token JWT:

Java
String token = jwtService.generateToken(user);
¿Por qué generar token al registrar?

UX: El usuario queda logueado automáticamente
No tiene que iniciar sesión después de registrarse
login() - Flujo de Inicio de Sesión:
1. Buscar usuario:

Java
User user = userRepository.findByEmail(dto.getEmail())
    .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));
¿Por qué no decir "Usuario no encontrado"?

Seguridad: no revelas si el email existe
Atacante no puede enumerar emails registrados
2. Validar contraseña:

Java
if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
    throw new RuntimeException("Credenciales inválidas");
}
Consideraciones de seguridad:

Rate limiting: Limita intentos de login

Java
// Bloquear después de 5 intentos fallidos
if (failedAttempts.get(email) >= 5) {
    throw new TooManyAttemptsException();
}
Account lockout: Deshabilitar cuenta tras X intentos

Java
if (user.getFailedLoginAttempts() >= 5) {
    user.setActive(false);
    userRepository.update(user.getId(), user);
    throw new AccountLockedException();
}

Continuación - Guía Explicativa Detallada
🌐 FASE 7: Controladores REST - EXPLICACIÓN DETALLADA
¿Qué es un Controlador REST?
Un controlador es la puerta de entrada de tu aplicación. Recibe peticiones HTTP del frontend React y devuelve respuestas JSON.

Analogía del mundo real:

Code
Frontend React = Cliente en un restaurante
Controlador REST = Mesero que toma la orden
Servicio = Cocina que prepara la comida
Repositorio = Despensa donde se guardan ingredientes
Anotaciones de Spring MVC Explicadas:
@RestController
Java
@RestController
public class ProductController {
¿Qué hace?

Combina @Controller + @ResponseBody
Todos los métodos devuelven JSON automáticamente (no vistas HTML)
Spring serializa objetos Java a JSON usando Jackson
Diferencia con @Controller:

Java
// @Controller (para páginas web tradicionales)
@Controller
public class PageController {
    @GetMapping("/home")
    public String home() {
        return "home.html"; // Retorna una vista
    }
}

// @RestController (para APIs REST)
@RestController
public class ApiController {
    @GetMapping("/api/products")
    public List<Product> getProducts() {
        return products; // Retorna JSON
    }
}
@RequestMapping
Java
@RequestMapping("/api/products")
public class ProductController {
¿Qué hace?

Define la ruta base para todos los métodos del controlador
Si un método tiene @GetMapping("/category/{id}"), la ruta completa será:
Code
/api/products/category/{id}
¿Por qué prefijo /api?

Separa endpoints de API de rutas del frontend
Facilita configuración de proxies y CORS
Convención estándar en aplicaciones modernas
@CrossOrigin
Java
@CrossOrigin(origins = "*")
public class ProductController {
¿Qué hace?

Permite peticiones desde otros dominios (Cross-Origin Resource Sharing)
origins = "*" → Cualquier dominio (útil en desarrollo)
En producción:

Java
@CrossOrigin(
    origins = "https://www.zonagamer.cl",
    allowedHeaders = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE},
    maxAge = 3600
)
Mejor práctica - Configuración global:

Java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins(
                "http://localhost:5173",
                "http://localhost:3000",
                "https://www.zonagamer.cl"
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
@RequiredArgsConstructor (Lombok)
Java
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
}
¿Qué hace?

Genera un constructor con todos los campos final
Spring usa este constructor para inyección de dependencias
Código generado por Lombok:

Java
public class ProductController {
    private final ProductService productService;
    
    // Lombok genera esto:
    public ProductController(ProductService productService) {
        this.productService = productService;
    }
}
¿Por qué usar constructor en lugar de @Autowired?

Java
// ❌ Viejo (field injection)
@Autowired
private ProductService productService;

// ✅ Moderno (constructor injection)
private final ProductService productService;

public ProductController(ProductService productService) {
    this.productService = productService;
}
Ventajas del constructor:

Inmutabilidad (final)
Testeable (puedes inyectar mocks fácilmente)
Evita NullPointerException
Detecta dependencias circulares en tiempo de compilación
Métodos HTTP - Explicación Detallada:
@GetMapping - Obtener Recursos
Java
@GetMapping
public ResponseEntity<List<ProductResponseDTO>> getAllProducts()
¿Qué es ResponseEntity?

Envoltorio que permite controlar:
Status code (200, 404, 500)
Headers (Content-Type, Cache-Control)
Body (el JSON)
Ejemplo completo:

Java
@GetMapping("/{id}")
public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable String id) {
    try {
        ProductResponseDTO product = productService.findById(id);
        
        // 200 OK con el producto
        return ResponseEntity
            .ok()
            .header("Cache-Control", "max-age=3600")
            .body(product);
            
    } catch (ProductNotFoundException e) {
        // 404 Not Found
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(null);
    }
}
Flujo de una petición GET:

Code
1. Frontend: GET http://localhost:8080/api/products
2. Spring: Busca método con @GetMapping en ProductController
3. Ejecuta: productService.getAllProducts()
4. Serializa: List<Product> → JSON
5. Responde: 
   Status: 200 OK
   Body: [{"id":"1","name":"RTX 4070",...}, {...}]
@PostMapping - Crear Recursos
Java
@PostMapping
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<ProductResponseDTO> createProduct(
    @Valid @RequestPart ProductCreateDTO productDTO,
    @RequestPart(required = false) MultipartFile image)
@Valid - Validación Automática:

Java
@Valid @RequestPart ProductCreateDTO productDTO
Flujo de validación:

Code
1. Spring deserializa JSON → ProductCreateDTO
2. Ejecuta validaciones (@NotBlank, @Email, etc.)
3. Si hay errores:
   - Lanza MethodArgumentNotValidException
   - Retorna 400 Bad Request con lista de errores
4. Si es válido:
   - Continúa al método del controlador
@RequestPart vs @RequestBody:

Java
// @RequestBody (solo JSON)
@PostMapping
public Product create(@RequestBody ProductDTO dto) {
    // Solo funciona con JSON puro
}

// @RequestPart (multipart/form-data - permite archivos)
@PostMapping
public Product create(
    @RequestPart ProductDTO dto,
    @RequestPart MultipartFile image
) {
    // Funciona con JSON + archivos
}
Ejemplo de petición desde React:

JavaScript
// Con @RequestPart
const formData = new FormData();
formData.append('productDTO', JSON.stringify({
  name: 'RTX 4070',
  price: 800000,
  categoryId: 'gpu'
}));
formData.append('image', imageFile); // File object

fetch('/api/products', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
});
required = false:

Java
@RequestPart(required = false) MultipartFile image
El parámetro image puede ser null
Útil cuando la imagen es opcional (se puede agregar URL en lugar de subir archivo)
@PreAuthorize - Control de Acceso
Java
@PreAuthorize("hasRole('ADMIN')")
¿Qué hace?

Verifica permisos antes de ejecutar el método
Si el usuario no tiene el rol, lanza AccessDeniedException
Spring Security intercepta y retorna 403 Forbidden
Expresiones SpEL disponibles:

Java
@PreAuthorize("hasRole('ADMIN')")                    // Rol específico
@PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")   // Cualquiera de estos roles
@PreAuthorize("hasAuthority('WRITE_PRODUCTS')")      // Autoridad específica
@PreAuthorize("isAuthenticated()")                   // Cualquier usuario logueado
@PreAuthorize("permitAll()")                         // Todos (incluso anónimos)

// Expresiones complejas
@PreAuthorize("hasRole('ADMIN') or (#userId == authentication.principal.id)")
// Solo admin o el propio usuario
¿Cómo se evalúa?

Code
1. Usuario hace login → recibe JWT token
2. Token contiene: { "userId": "123", "roles": ["ROLE_USER"] }
3. Usuario hace: PUT /api/products/1
4. JwtAuthenticationFilter extrae el token
5. Carga roles en SecurityContext
6. @PreAuthorize verifica: ¿Tiene ROLE_ADMIN?
7. NO → 403 Forbidden
@PutMapping - Actualizar Recursos
Java
@PutMapping("/{id}")
public ResponseEntity<ProductResponseDTO> updateProduct(
    @PathVariable String id,
    @Valid @RequestBody ProductCreateDTO productDTO)
@PathVariable:

Java
@PutMapping("/{id}")
public Product update(@PathVariable String id) {
    // URL: /api/products/abc123
    // id = "abc123"
}
Múltiples path variables:

Java
@GetMapping("/categories/{categoryId}/products/{productId}")
public Product get(
    @PathVariable String categoryId,
    @PathVariable String productId
) {
    // URL: /categories/gpu/products/rtx4070
    // categoryId = "gpu"
    // productId = "rtx4070"
}
PUT vs PATCH:

Java
// PUT - Reemplaza todo el recurso
@PutMapping("/{id}")
public Product update(@PathVariable String id, @RequestBody Product product) {
    // Actualiza TODOS los campos
}

// PATCH - Actualiza campos específicos
@PatchMapping("/{id}")
public Product partialUpdate(
    @PathVariable String id,
    @RequestBody Map<String, Object> updates
) {
    // Solo actualiza los campos enviados
}
@DeleteMapping - Eliminar Recursos
Java
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteProduct(@PathVariable String id)
ResponseEntity<Void>:

Void → No hay cuerpo en la respuesta
Solo retorna status code: 204 No Content
Mejores prácticas para DELETE:

Soft Delete (recomendado):
Java
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
    productService.softDelete(id); // Marca como inactive
    return ResponseEntity.noContent().build(); // 204
}

// En el servicio:
public void softDelete(String id) {
    Product product = findById(id);
    product.setActive(false);
    product.setDeletedAt(LocalDateTime.now());
    repository.update(id, product);
}
Hard Delete (elimina permanentemente):
Java
@DeleteMapping("/{id}/permanent")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public ResponseEntity<Void> permanentDelete(@PathVariable String id) {
    productService.hardDelete(id);
    return ResponseEntity.noContent().build();
}
AuthController - Explicación Detallada:
Endpoint de Registro:
Java
@PostMapping("/register")
public ResponseEntity<AuthResponseDTO> register(
    @Valid @RequestBody UserRegistrationDTO dto)
Flujo completo:

Code
1. Frontend envía:
   POST /api/auth/register
   {
     "email": "juan@example.com",
     "password": "Password123!",
     "firstName": "Juan",
     "lastName": "Pérez"
   }

2. Spring valida automáticamente el DTO:
   - ¿Email válido?
   - ¿Contraseña mínimo 6 caracteres?
   - ¿Campos requeridos presentes?

3. AuthService.register():
   a. Verifica que email no exista
   b. Encripta contraseña con BCrypt
   c. Guarda usuario en Firestore
   d. Genera token JWT

4. Responde:
   200 OK
   {
     "token": "eyJhbGc...",
     "type": "Bearer",
     "userId": "user_123",
     "email": "juan@example.com",
     "roles": ["ROLE_USER"]
   }

5. Frontend guarda token en localStorage:
   localStorage.setItem('token', response.token);
Endpoint de Login:
Java
@PostMapping("/login")
public ResponseEntity<AuthResponseDTO> login(
    @Valid @RequestBody UserLoginDTO dto)
Diferencias con registro:

No crea usuario, busca uno existente
Valida contraseña con BCrypt
Puede incrementar contador de intentos fallidos
Puede registrar último login
Mejoras de seguridad:

Java
@PostMapping("/login")
public ResponseEntity<AuthResponseDTO> login(
    @Valid @RequestBody UserLoginDTO dto,
    HttpServletRequest request
) {
    // Obtener IP del cliente
    String ipAddress = request.getRemoteAddr();
    
    // Registrar intento de login
    auditService.logLoginAttempt(dto.getEmail(), ipAddress);
    
    try {
        AuthResponseDTO response = authService.login(dto);
        
        // Login exitoso
        auditService.logSuccessfulLogin(dto.getEmail(), ipAddress);
        
        return ResponseEntity.ok(response);
        
    } catch (BadCredentialsException e) {
        // Incrementar contador de fallos
        loginAttemptService.recordFailedAttempt(dto.getEmail());
        
        throw e;
    }
}
Manejo de Errores Global:
Java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(
        MethodArgumentNotValidException ex
    ) {
        List<String> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .collect(Collectors.toList());
            
        ErrorResponse response = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "Errores de validación",
            errors
        );
        
        return ResponseEntity.badRequest().body(response);
    }
    
    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleProductNotFound(
        ProductNotFoundException ex
    ) {
        ErrorResponse response = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            null
        );
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
    
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(
        AccessDeniedException ex
    ) {
        ErrorResponse response = new ErrorResponse(
            HttpStatus.FORBIDDEN.value(),
            "No tienes permisos para realizar esta acción",
            null
        );
        
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericError(Exception ex) {
        ErrorResponse response = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Error interno del servidor",
            null
        );
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}

@Data
@AllArgsConstructor
class ErrorResponse {
    private int status;
    private String message;
    private List<String> errors;
}
🔐 FASE 8: Seguridad y JWT - EXPLICACIÓN DETALLADA
¿Qué es JWT (JSON Web Token)?
Un JWT es un token autofirmado que contiene información del usuario de forma segura.

Estructura de un JWT:

Code
eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyXzEyMyIsImVtYWlsIjoianVhbkBleGFtcGxlLmNvbSIsInJvbGVzIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE2OTk5OTk5OTksImV4cCI6MTcwMDA4NjM5OX0.dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk

┌─────────────────┬──────────────────────────────────────────┬──────────────────────────┐
│    HEADER       │              PAYLOAD                     │        SIGNATURE         │
└─────────────────┴──────────────────────────────────────────┴──────────────────────────┘
Decodificado:

Header:
JSON
{
  "alg": "HS512",  // Algoritmo de encriptación
  "typ": "JWT"     // Tipo de token
}
Payload (Claims):
JSON
{
  "sub": "user_123",               // Subject (ID del usuario)
  "email": "juan@example.com",
  "roles": ["ROLE_USER"],
  "iat": 1699999999,               // Issued At (cuándo se creó)
  "exp": 1700086399                // Expiration (cuándo expira)
}
Signature:
Code
HMACSHA512(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
¿Cómo funciona la firma?

Tomas Header + Payload
Los firmas con tu secreto usando HS512
Si alguien modifica el token, la firma no coincidirá
JwtService - Explicación Línea por Línea:
generateToken():
Java
public String generateToken(User user) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + expiration);
Cálculo de expiración:

Code
now = 2025-11-04 21:33:01 (timestamp: 1730758381000)
expiration = 86400000 (24 horas en ms)
expiryDate = 1730758381000 + 86400000 = 1730844781000
           = 2025-11-05 21:33:01
Java
return Jwts.builder()
    .setSubject(user.getId())
¿Qué es el Subject?

Es el "dueño" del token
Convencionalmente, el ID único del usuario
Se usa para identificar al usuario en cada petición
Java
    .claim("email", user.getEmail())
    .claim("roles", user.getRoles().stream()
        .map(Enum::name)
        .collect(Collectors.toList()))
¿Qué son los Claims?

Datos adicionales que quieres guardar en el token
Son públicos (cualquiera puede leerlos, pero no modificarlos)
NO guardes información sensible (contraseñas, números de tarjeta)
Claims estándar:

sub - Subject
iss - Issuer (quién emitió el token)
aud - Audience (para quién es el token)
exp - Expiration
iat - Issued At
nbf - Not Before (no válido antes de esta fecha)
Java
    .setIssuedAt(now)
    .setExpiration(expiryDate)
¿Por qué registrar estas fechas?

iat → Para rastrear cuándo se generó (auditoría)
exp → Spring Security rechaza tokens expirados automáticamente
Java
    .signWith(getSigningKey(), SignatureAlgorithm.HS512)
    .compact();
Algoritmos de firma disponibles:

HS256 - HMAC SHA-256 (más común, menos seguro)
HS512 - HMAC SHA-512 (más seguro, recomendado)
RS256 - RSA SHA-256 (par de claves pública/privada)
¿Cuándo usar cada uno?

Code
HS512 (simétrico):
- Una sola clave (secreto compartido)
- Backend genera y valida
- Más simple, suficiente para APIs backend-frontend

RS256 (asimétrico):
- Par de claves: privada (firma) + pública (valida)
- Útil cuando múltiples servicios validan el token
- Microservicios, OAuth2, OpenID Connect
getUserIdFromToken():
Java
public String getUserIdFromToken(String token) {
    Claims claims = Jwts.parserBuilder()
        .setSigningKey(getSigningKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
        
    return claims.getSubject();
}
Flujo de validación:

Code
1. parseClaimsJws(token)
   └─ Divide el token en Header.Payload.Signature
   
2. Recalcula la firma con el secreto
   
3. Compara firmas:
   ┌─ Si coinciden → Token válido, retorna claims
   └─ Si no coinciden → Lanza JwtException (token manipulado)
   
4. Verifica expiración:
   ┌─ Si exp > now → Token válido
   └─ Si exp < now → Lanza ExpiredJwtException
validateToken():
Java
public boolean validateToken(String token) {
    try {
        Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token);
        return true;
    } catch (JwtException | IllegalArgumentException e) {
        return false;
    }
}
Excepciones que puede lanzar:

ExpiredJwtException → Token expirado
UnsupportedJwtException → Algoritmo no soportado
MalformedJwtException → Token mal formado
SignatureException → Firma inválida
IllegalArgumentException → Token vacío o null
SecurityConfig - Configuración de Seguridad:
Java
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@EnableGlobalMethodSecurity(prePostEnabled = true):

Habilita anotaciones @PreAuthorize y @PostAuthorize
Sin esto, @PreAuthorize("hasRole('ADMIN')") no funciona
PasswordEncoder Bean:
Java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
¿Por qué BCrypt?

Adaptativo: Puedes aumentar la complejidad con el tiempo
Salt automático: Cada hash es único
Lento: Dificulta ataques de fuerza bruta (intencionalmente)
Configurar strength:

Java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12); // Más costoso, más seguro
    // Por defecto: 10
    // Rango: 4-31
}
Comparación:

Code
Strength   Tiempo por hash
10         ~100ms
12         ~300ms
14         ~1 segundo
SecurityFilterChain:
Java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .csrf().disable()
¿Por qué deshabilitar CSRF?

CSRF (Cross-Site Request Forgery): Ataque donde un sitio malicioso hace peticiones en tu nombre
No es necesario con JWT (el token está en el header, no en cookies)
Cookies = vulnerable a CSRF
JWT = no vulnerable a CSRF
Si usaras cookies:

Java
.csrf()
    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
Java
        .cors().and()
Habilita CORS usando la configuración definida anteriormente.

Java
        .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
SessionCreationPolicy.STATELESS:

No crea sesiones HTTP
Cada petición es independiente
Perfecto para APIs REST con JWT
Políticas disponibles:

Java
ALWAYS       // Siempre crea sesión
IF_REQUIRED  // Crea si Spring Security la necesita (por defecto)
NEVER        // No crea, pero usa si existe
STATELESS    // No crea ni usa sesiones (JWT)
Java
        .and()
        .authorizeRequests()
            .antMatchers("/api/auth/**").permitAll()
            .antMatchers("/api/products/**").permitAll()
            .antMatchers("/api/categories/**").permitAll()
            .anyRequest().authenticated();
Orden de evaluación:

Code
1. /api/auth/** → permitAll() (registro, login)
2. /api/products/** → permitAll() (ver productos sin login)
3. /api/categories/** → permitAll() (ver categorías)
4. Cualquier otra ruta → authenticated() (requiere login)
Configuración más segura:

Java
.authorizeRequests()
    // Público
    .antMatchers(HttpMethod.GET, "/api/products/**").permitAll()
    .antMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
    .antMatchers("/api/auth/login", "/api/auth/register").permitAll()
    
    // Solo admin
    .antMatchers(HttpMethod.POST, "/api/products/**").hasRole("ADMIN")
    .antMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")
    .antMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")
    
    // Usuario logueado
    .antMatchers("/api/orders/**").authenticated()
    .antMatchers("/api/profile/**").authenticated()
    
    // Todo lo demás requiere autenticación
    .anyRequest().authenticated();
Filtro JWT (falta implementar):
Para que JWT funcione completamente, necesitas un filtro que intercepte peticiones:

Java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtService jwtService;
    private final UserRepository userRepository;
    
    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        
        // 1. Extraer token del header
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        String token = authHeader.substring(7); // Remover "Bearer "
        
        // 2. Validar token
        if (!jwtService.validateToken(token)) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // 3. Extraer userId
        String userId = jwtService.getUserIdFromToken(token);
        
        // 4. Cargar usuario
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        
        // 5. Crear Authentication object
        UsernamePasswordAuthenticationToken authentication = 
            new UsernamePasswordAuthenticationToken(
                user,
                null,
                user.getRoles().stream()
                    .map(role -> new SimpleGrantedAuthority(role.name()))
                    .collect(Collectors.toList())
            );
        
        // 6. Guardar en SecurityContext
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // 7. Continuar cadena de filtros
        filterChain.doFilter(request, response);
    }
}
Registrar el filtro en SecurityConfig:

Java
@Bean
public SecurityFilterChain filterChain(
    HttpSecurity http,
    JwtAuthenticationFilter jwtFilter
) throws Exception {
    http
        // ... configuración anterior
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        
    return http.build();
}
🚀 PASOS PARA INICIAR - DETALLADO
1. Configuración en Spring Initializr
Ve a: https://start.spring.io/

Project Metadata:
Code
Project: Maven
Language: Java
Spring Boot: 3.2.0 (o la última versión estable 3.x)

Project Metadata:
├── Group: com.zonagamer
├── Artifact: zonagamer-backend
├── Name: ZonaGamer Backend
├── Description: Backend REST API para tienda gaming ZonaGamer
├── Package name: com.zonagamer
├── Packaging: Jar
└── Java: 17 (LTS recomendado)
¿Por qué Java 17?

Es LTS (Long Term Support) - soporte hasta 2029
Spring Boot 3.x requiere mínimo Java 17
Incluye mejoras modernas (records, pattern matching, text blocks)
Dependencies en Spring Initializr:
Selecciona SOLO estas 4:

✅ Spring Web → Para crear REST APIs
✅ Spring Security → Para autenticación y autorización
✅ Lombok → Para reducir código boilerplate
✅ Validation → Para validar DTOs (busca "Validation" no "Spring Session")
NO selecciones:

❌ Spring Session for JDBC (no la necesitas)
Genera y descarga el proyecto.

2. Agregar Dependencias de Firebase Manualmente
Las dependencias de Firebase NO están en Spring Initializr, debes agregarlas manualmente en pom.xml.

Abre pom.xml y agrega dentro de <dependencies>:

XML
<!-- Firebase Admin SDK -->
<dependency>
    <groupId>com.google.firebase</groupId>
    <artifactId>firebase-admin</artifactId>
    <version>9.2.0</version>
</dependency>

<!-- Firestore -->
<dependency>
    <groupId>com.google.cloud</groupId>
    <artifactId>google-cloud-firestore</artifactId>
    <version>3.14.0</version>
</dependency>

<!-- Firebase Cloud Storage -->
<dependency>
    <groupId>com.google.cloud</groupId>
    <artifactId>google-cloud-storage</artifactId>
    <version>2.26.1</version>
</dependency>

<!-- JWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
¿Por qué 3 dependencias de JWT?

jjwt-api → Interfaces públicas
jjwt-impl → Implementación (solo en runtime)
jjwt-jackson → Para serializar claims a JSON
3. Configurar Firebase Console
Paso 1: Crear Proyecto Firebase
Ve a: https://console.firebase.google.com/
Click en "Agregar proyecto"
Nombre: zonagamer-app
Habilitar Google Analytics (opcional)
Click "Crear proyecto"
Paso 2: Habilitar Firestore Database
En el menú izquierdo: Build → Firestore Database
Click "Crear base de datos"
Modo: Producción (luego configuraremos reglas)
Ubicación: southamerica-east1 (São Paulo - más cercano a Chile)
Click "Habilitar"
Configurar reglas de seguridad:

JavaScript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Productos - lectura pública, escritura solo admins
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     request.auth.token.role == 'admin';
    }
    
    // Usuarios - solo el propio usuario o admins
    match /users/{userId} {
      allow read: if request.auth.uid == userId || 
                     request.auth.token.role == 'admin';
      allow write: if request.auth.uid == userId || 
                      request.auth.token.role == 'admin';
    }
    
    // Categorías - lectura pública, escritura solo admins
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     request.auth.token.role == 'admin';
    }
  }
}
Paso 3: Habilitar Cloud Storage
En el menú: Build → Storage
Click "Comenzar"
Reglas: Modo producción
Ubicación: southamerica-east1
Click "Listo"
Configurar reglas de Storage:

JavaScript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true; // Imágenes públicas
      allow write: if request.auth != null; // Solo usuarios logueados
    }
    
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid == userId; // Solo el propio usuario
    }
  }
}
Paso 4: Descargar Credenciales
En el menú: Configuración del proyecto (ícono de engranaje)
Pestaña: Cuentas de servicio
Click: Generar nueva clave privada
Descargar archivo JSON
Renombrar a: firebase-service-account.json
Mover a: src/main/resources/ de tu proyecto Spring Boot
⚠️ IMPORTANTE: Agrega a .gitignore:

Code
src/main/resources/firebase-service-account.json
4. Estructura de Carpetas del Proyecto
Code
zonagamer-backend/
│
├── src/main/java/com/zonagamer/
│   ├── ZonaGamerApplication.java
│   │
│   ├── config/
│   │   ├── FirebaseConfig.java
│   │   ├── SecurityConfig.java
│   │   └── CorsConfig.java
│   │
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── ProductController.java
│   │   └── CategoryController.java
│   │
│   ├── dto/
│   │   ├── request/
│   │   │   ├── UserRegistrationDTO.java
│   │   │   ├── UserLoginDTO.java
│   │   │   └── ProductCreateDTO.java
│   │   └── response/
│   │       ├── AuthResponseDTO.java
│   │       └── ProductResponseDTO.java
│   │
│   ├── model/
│   │   ├── User.java
│   │   ├── Product.java
│   │   └── Category.java
│   │
│   ├── repository/
│   │   ├── BaseFirestoreRepository.java
│   │   ├── UserRepository.java
│   │   ├── ProductRepository.java
│   │   └── CategoryRepository.java
│   │
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── ProductService.java
│   │   ├── StorageService.java
│   │   └── JwtService.java
│   │
│   ├── security/
│   │   ├── JwtAuthenticationFilter.java
│   │   └── JwtAuthenticationEntryPoint.java
│   │
│   └── exception/
│       ├── GlobalExceptionHandler.java
│       ├── ResourceNotFoundException.java
│       └── EmailAlreadyExistsException.java
│
├── src/main/resources/
│   ├── application.yml
│   └── firebase-service-account.json (NO subir a Git)
│
└── pom.xml
5. Orden de Implementación Recomendado
Fase 1 - Configuración (Día 1)
Code
1. Crear proyecto en Spring Initializr
2. Agregar dependencias Firebase en pom.xml
3. Configurar Firebase Console
4. Crear application.yml
5. Implementar FirebaseConfig.java
6. Implementar SecurityConfig.java (básico)
Fase 2 - Modelos y DTOs (Día 1-2)
Code
7. Crear modelos: User, Product, Category
8. Crear DTOs de request
9. Crear DTOs de response
Fase 3 - Repositorios (Día 2)
Code
10. Implementar BaseFirestoreRepository
11. Implementar UserRepository
12. Implementar ProductRepository
13. Implementar CategoryRepository
Fase 4 - Servicios (Día 3)
Code
14. Implementar JwtService
15. Implementar StorageService
16. Implementar AuthService
17. Implementar ProductService
Fase 5 - Controladores (Día 4)
Code
18. Implementar AuthController
19. Implementar ProductController
20. Implementar GlobalExceptionHandler
Fase 6 - Seguridad Completa (Día 5)
Code
21. Implementar JwtAuthenticationFilter
22. Registrar filtro en SecurityConfig
23. Probar endpoints con Postman
6. Probar con Postman
Colección de Endpoints:
1. Registro de Usuario:

Code
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "email": "admin@zonagamer.cl",
  "password": "Admin123!",
  "firstName": "Admin",
  "lastName": "ZonaGamer",
  "phoneNumber": "+56912345678"
}
2. Login:

Code
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "admin@zonagamer.cl",
  "password": "Admin123!"
}

Respuesta:
{
  "token": "eyJhbGc...",
  "type": "Bearer",
  "userId": "user_123",
  "email": "admin@zonagamer.cl",
  "roles": ["ROLE_ADMIN"]
}
3. Crear Producto (requiere token):

Code
POST http://localhost:8080/api/products
Authorization: Bearer eyJhbGc...
Content-Type: multipart/form-data

productDTO: {
  "name": "RTX 4070 Ti SUPER",
  "price": 800000,
  "description": "Tarjeta gráfica de última generación",
  "categoryId": "gpu",
  "stock": 15,
  "isFeatured": true
}
image: [archivo de imagen]
4. Obtener Productos (público):

Code
GET http://localhost:8080/api/products
7. Conectar desde React
Actualizar src/lib/api/productsApi.js:

JavaScript
const API_URL = 'http://localhost:8080/api';

export async function fetchProducts() {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Error al obtener productos');
    return response.json();
}

export async function createProduct(productData, imageFile, token) {
    const formData = new FormData();
    formData.append('productDTO', new Blob([JSON.stringify(productData)], {
        type: 'application/json'
    }));
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });
    
    if (!response.ok) throw new Error('Error al crear producto');
    return response.json();
}
📌 Resumen de Dependencias
Desde Spring Initializr:
- Spring Web
- Spring Security
- Lombok
- Validation
Agregar Manualmente en pom.xml:
- firebase-admin (9.2.0)
- google-cloud-firestore (3.14.0)
- google-cloud-storage (2.26.1)
- jjwt-api (0.11.5)
- jjwt-impl (0.11.5)
- jjwt-jackson (0.11.5)
